import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { createImage, createVideo } from "./storage";
import { initializeApp } from "firebase/app";
import { authenticate } from "./authenticate";
import { deleteObject, getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDugptWWK6AM3Dkc9zSt5ZcJAGOyTjSx7w",
  authDomain: "uploadreact-85d68.firebaseapp.com",
  projectId: "uploadreact-85d68",
  storageBucket: "uploadreact-85d68.appspot.com",
  messagingSenderId: "642741037500",
  appId: "1:642741037500:web:8b7659add544af2e28a3b9",
  measurementId: "G-X4S0NFGFK4"
};

export async function registerVideo(data: any) {
  try {
    const auth = await authenticate();
    const user = auth?.email;
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const videosCollection = collection(db, "videos");
    const verify = query(videosCollection, where('title', '==', data.title));
      const querySnapshot = await getDocs(verify);if (!querySnapshot.empty) {
        window.alert('Já existe um vídeo com o título informado. Não é possível prosseguir com o cadastro.');
        return;
      }
      const linkVid = await createVideo(data.title, data.linkVideo);
      const linkImages = [];
      for (let i = 0; i < data.linkImages.length; i += 1) {
      const linkImg = await createImage(data.title, data.linkImages[i]);
      linkImages.push(linkImg);
    }
    
    if (typeof linkVid === 'string' && linkImages.length > 0) {
      const item = {
        linkVideo: linkVid,
        title: data.title,
        description: data.description,
        requirement: {
          memory: data.requirement.memory,
          operatingSystems: data.requirement.operatingSystems,
          processor: data.requirement.processor,
          graphics: data.requirement.graphics,
          directXVersion: data.requirement.directXVersion,
          storage: data.requirement.storage,
        },
        releaseDate: data.releaseDate,
        publisher: data.publisher,
        developers: data.developers,
        linkImages: linkImages,
        categories: data.categories,
        PublishDate: Date.now(),
        reviews: [],
        user: user,
      };
      await addDoc(videosCollection, item);
      window.alert('video adicionado com sucesso!');
    }
  } catch(error: any) {
    window.alert('Ocorreu um erro ao tentar adicionar o video (' + error + ')');
  }
};

export async function getAllVideos() {
  try {
    await authenticate();
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const videosCollection = collection(db, "videos");
    const querySnapshot = await getDocs(videosCollection);
    const allVideos: any = [];
    querySnapshot.forEach(doc => {
      allVideos.push({ id: doc.id, ...doc.data() });
    });
    return allVideos;
  } catch (error) {
    window.alert('Erro ao obter vídeos. Por favor, atualize a página e tente novamente (' + error + ')');
  }
};

export async function getVideoById(videoId: string) {
  try {
    await authenticate();
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const videoDocRef = doc(db, "videos", videoId);
    const videoDocSnapshot = await getDoc(videoDocRef);
    if (videoDocSnapshot.exists()) {
      const videoData = videoDocSnapshot.data();
      videoData.id = videoDocSnapshot.id;
      return videoData;
    } else window.alert('O vídeo com o ID fornecido não foi encontrado.');
  } catch (error) {
    console.error('Erro ao obter vídeo por ID:', error);
    throw error;
  }
};

export async function getVideosByEmail(email: string) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const videosCollectionRef = collection(db, 'videos');
    const q = query(videosCollectionRef, where('user', '==', email));
    const querySnapshot = await getDocs(q);
    const videos: any = [];
    querySnapshot.forEach((doc) => {
      videos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return videos;
  } catch (error) {
    window.alert('Erro ao obter vídeos por email: (' + error + ')');
    return false;
  }
};

export async function updateVideo(
  id: string,
  data: any,
  newImages: any[],
  listRemovedImages: any[]
) {
  try {
    const linkImages = [];
    for (let i = 0; i < newImages.length; i += 1) {
      const linkImg = await createImage(data.title, newImages[i]);
      linkImages.push(linkImg);
    }

    for(let i = 0; i < listRemovedImages.length; i += 1) {
      await deleteImage(listRemovedImages[i]);
    }

    const item = {
      linkVideo: data.linkVideo,
      title: data.title,
      description: data.description,
      requirement: {
        memory: data.requirement.memory,
        operatingSystems: data.requirement.operatingSystems,
        processor: data.requirement.processor,
        graphics: data.requirement.graphics,
        directXVersion: data.requirement.directXVersion,
        storage: data.requirement.storage,
      },
      releaseDate: data.releaseDate,
      publisher: data.publisher,
      developers: data.developers,
      linkImages: [...data.linkImages, ...linkImages],
      categories: data.categories,
      PublishDate: data.PublishDate,
      reviews: data.reviews,
      user: data.user,
    };
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const videoRef = doc(db, 'videos', id);
    await updateDoc(videoRef, item);
    window.alert('O vídeo foi atualizado com sucesso.');
  } catch(error: any) {
    window.alert('Não foi possível atualizar o vídeo (' + error + ')');
  }
};

export async function deleteImage(url: string) {
  const caminhoDoArquivo = decodeURIComponent(url.split('images%2F')[1].split('?')[0]);
  const storage = getStorage();
  const imagemRef = ref(storage, '/images/' + caminhoDoArquivo);
  await deleteObject(imagemRef);
};

export async function deleteVideo(url: string) {
  const caminhoDoArquivo = decodeURIComponent(url.split('videos%2F')[1].split('?')[0]);
  const storage = getStorage();
  const imagemRef = ref(storage, '/videos/' + caminhoDoArquivo);
  await deleteObject(imagemRef);
};

export async function deleteVideoById(videoId: string) {
  try {
    const videoToDelete = await getVideoById(videoId);
    if (videoToDelete) {
      for (let i = 0; i < videoToDelete.linkImages.length; i += 1) {
        await deleteImage(videoToDelete.linkImages[i]);
      }
      await deleteVideo(videoToDelete.linkVideo);
      
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getFirestore(firebaseApp);
      const videoDocRef = doc(db, "videos", videoId);
      const videoDocSnapshot = await getDoc(videoDocRef);
      if (videoDocSnapshot.exists()) {
        await deleteDoc(videoDocRef);
        window.alert(`Vídeo excluído com sucesso!`);
      } else {
        window.alert('O vídeo não foi encontrado. Por favor, atualize a página e tente novamente');
      }
    } else window.alert('O vídeo não foi encontrado. Por favor, atualize a página e tente novamente');
  } catch (error) {
    window.alert('Erro ao excluir vídeo (' + error + ').');
  }
};
