import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDugptWWK6AM3Dkc9zSt5ZcJAGOyTjSx7w",
    authDomain: "uploadreact-85d68.firebaseapp.com",
    projectId: "uploadreact-85d68",
    storageBucket: "uploadreact-85d68.appspot.com",
    messagingSenderId: "642741037500",
    appId: "1:642741037500:web:8b7659add544af2e28a3b9",
    measurementId: "G-X4S0NFGFK4"
  };

export async function createVideo (title: string, data: any){
  try {
    const app = initializeApp(firebaseConfig);
    
    const storage = getStorage(app);
    const storageRef = ref(storage, `videos/${title}/${data.name}`);
    await uploadBytes(storageRef, data);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error: any) {
    window.alert("Erro ao fazer upload da midia video: " + error.message);
    return false;
  }
};

export async function createImage (title: string, data: any){
  try {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const storageRef = ref(storage, `images/${title}/${data.name}`);
    await uploadBytes(storageRef, data);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error: any) {
    window.alert("Erro ao fazer upload da midia imagem: " + error.message);
    return false;
  }
};

export async function getAllVideos () {
  try {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const storageRef = ref(storage, 'video');

    //função que coleta todos os videos baseado na referência recebida
    const filesList = await listAll(storageRef);

    //função que transforma a lista de elementos do tipo File em objetos com chaves name e url
    const filesWithUrlPromises = filesList.items.map(async (itemRef: any) => {
    const url = await getDownloadURL(itemRef);
    return { name: itemRef.name, url };
   });

   const filesWithUrl: any[] = await Promise.all(filesWithUrlPromises);
   return filesWithUrl;

  } catch (error) {
    window.alert('Erro ao listar arquivos: ' + error);
  }
};