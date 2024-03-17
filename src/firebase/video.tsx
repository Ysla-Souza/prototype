import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { createImage, createVideo } from "./storage";
import { initializeApp } from "firebase/app";
import { authenticate } from "./authenticate";

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

      // Criar consulta para verificar se existe algum registro com o título informado
      const verify = query(videosCollection, where('title', '==', data.title));
      const querySnapshot = await getDocs(verify);
          // Se já existir um vídeo com o mesmo título, exiba um alerta e encerre a função
      if (!querySnapshot.empty) {
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
}

export async function getAllVideos() {
  try {
    const auth = await authenticate();
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
}

export async function getVideoById(videoId: string) {
  try {
    const auth = await authenticate();
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const videoDocRef = doc(db, "videos", videoId);

    const videoDocSnapshot = await getDoc(videoDocRef);
    
    if (videoDocSnapshot.exists()) {
      return videoDocSnapshot.data();
    } else {
      throw new Error('O vídeo com o ID fornecido não foi encontrado.');
    }
  } catch (error) {
    console.error('Erro ao obter vídeo por ID:', error);
    throw error;
  }
}