import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { getHoraOficialBrasil } from "./chat";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDugptWWK6AM3Dkc9zSt5ZcJAGOyTjSx7w",
  authDomain: "uploadreact-85d68.firebaseapp.com",
  projectId: "uploadreact-85d68",
  storageBucket: "uploadreact-85d68.appspot.com",
  messagingSenderId: "642741037500",
  appId: "1:642741037500:web:8b7659add544af2e28a3b9",
  measurementId: "G-X4S0NFGFK4"
};

export async function registerNotification(data: any) {
  const { message, user } = data;
  const date = await getHoraOficialBrasil();
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const chatCollectionRef = collection(db, 'notifications');
    const newChatDocRef = await addDoc(
      chatCollectionRef,
      {
        message,
        user,
        date,
      },
    );
    return newChatDocRef.id;
  } catch (error: any) {
    window.alert('Erro ao registrar Notificação: (' + error.message + ')');
    return false;
  }
};

export async function getNotificationsByEmail(email: string) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const notificationsCollectionRef = collection(db, 'notifications');
    const querySnapshot = await getDocs(query(notificationsCollectionRef, where('user', '==', email)));
    const notificationsList: any = [];
    querySnapshot.forEach(doc => {
      notificationsList.push({ id: doc.id, ...doc.data() });
    });
    return notificationsList;
  } catch (error: any) {
    window.alert('Erro ao obter Notificações: ' + error.message);
    return false;
  }
}

export async function getNotificationById(notificationId: string) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const notificationDocRef = doc(db, 'notifications', notificationId);
    const notificationDocSnapshot = await getDoc(notificationDocRef);
    
    if (notificationDocSnapshot.exists()) {
      return { id: notificationDocSnapshot.id, ...notificationDocSnapshot.data() };
    } else {
      return false;
    }
  } catch (error: any) {
    window.alert('Erro ao obter Notificação: ' + error.message);
    return false;
  }
};

export async function deleteNotificationById(id: string) {
  try {
    const notificationToDelete = await getNotificationById(id);
    if (notificationToDelete) {      
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getFirestore(firebaseApp);
      const notificationDocRef = doc(db, "notifications", id);
      const notificationDocSnapshot = await getDoc(notificationDocRef);
      if (notificationDocSnapshot.exists()) await deleteDoc(notificationDocRef);
    }
  } catch (error) {
    window.alert('Ocorreu um erro na interação com a Notificação (' + error + ').');
  }
};