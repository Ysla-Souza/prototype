'use client'
import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { authenticate } from './authenticate';
import { registerNotification } from './notifications';
import { getUserByEmail } from './user';

const firebaseConfig = {
  apiKey: "AIzaSyDugptWWK6AM3Dkc9zSt5ZcJAGOyTjSx7w",
  authDomain: "uploadreact-85d68.firebaseapp.com",
  projectId: "uploadreact-85d68",
  storageBucket: "uploadreact-85d68.appspot.com",
  messagingSenderId: "642741037500",
  appId: "1:642741037500:web:8b7659add544af2e28a3b9",
  measurementId: "G-X4S0NFGFK4"
};

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, function(char: string) {
    return char.toUpperCase();
  });
}

export async function createChat(message: any) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const chatCollectionRef = collection(db, 'chats');
    const companyData = await getUserByEmail(message.company);
    const developerData = await getUserByEmail(message.developer);
    const newChatDocRef = await addDoc(
      chatCollectionRef,
      {
        chat: message.chat,
        company: message.company,
        companyName: companyData.company,
        companyImage: companyData.imageURL,
        developer: message.developer,
        developerName: `${developerData.firstName} ${developerData.lastName}`,
        developerImage: developerData.imageURL,
        video: [message.video],
      },
    );
    return newChatDocRef.id;
  } catch (error: any) {
    window.alert('Erro ao criar interação entre empresa e desenvolvedor: (' + error.message + ')');
    return false;
  }
}

export async function getAllChats() {
  try {
    await authenticate();
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const chatsCollection = collection(db, "chats");
    const querySnapshot = await getDocs(chatsCollection);
    const allChats: any = [];
    querySnapshot.forEach(doc => {
      allChats.push({ id: doc.id, ...doc.data() });
    });
    return allChats;
  } catch (error) {
    window.alert('Erro ao obter Conversas. Por favor, atualize a página e tente novamente (' + error + ')');
  }
};

export async function addToChat(id: string, title: string, message: any) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const chatDocRef = doc(db, 'chats', id);
    const chatDocSnapshot = await getDoc(chatDocRef);
    if (chatDocSnapshot.exists()) {
      const chatData = chatDocSnapshot.data();  
      const updatedVideoArray = chatData.video.length > 0 ? [...chatData.video, title] : [title];
      const currentMessages = chatData.chat || [];
      currentMessages.push(message);
      await updateDoc(chatDocRef, { 
        chat: currentMessages,
        video: updatedVideoArray,
      });
      return true;
    } else {
      window.alert('O registro de chat não foi encontrado.');
      return false;}
  } catch (error: any) {
    window.alert('Erro ao enviar mensagem: ' + error.message);
    return false;
  }
}

export async function sendMessage(id: string, message: any) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const chatDocRef = doc(db, 'chats', id);
    const chatDocSnapshot = await getDoc(chatDocRef);
    if (chatDocSnapshot.exists()) {
      const chatData = chatDocSnapshot.data(); 
      let currentMessages = chatData.chat || [];
      if (currentMessages.length >= 15) {
        currentMessages = currentMessages.slice(currentMessages.length - 15);
      }
      currentMessages.push(message);
      await updateDoc(chatDocRef, { 
        chat: currentMessages,
      });
      return true;
    } else {
      window.alert('O registro de chat não foi encontrado.');
      return false;
    }
  } catch (error: any) {
    window.alert('Erro ao enviar mensagem: ' + error.message);
    return false;
  }
};

export async function getChatByCompAndDevAndVideo(compEmail: string, devEmail: string, title: string) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const chatQuery = query(
      collection(db, 'chats'),
      where('company', '==', compEmail),
      where('developer', '==', devEmail)
    );
    const querySnapshot = await getDocs(chatQuery);
    if (!querySnapshot.empty) {
      for (const chatDoc of querySnapshot.docs) {
        const chatData = chatDoc.data();
        if (chatData.video && chatData.video.includes(title)) {
          return { id: chatDoc.id, ...chatData };
        }
      }
    }
    return false;
  } catch (error: any) {
    window.alert('Erro ao obter chat: ' + error.message);
    return false;
  }
}

export async function getChatByCompAndDev(compEmail: string, devEmail: string) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const chatQuery = query(
      collection(db, 'chats'),
      where('company', '==', compEmail),
      where('developer', '==', devEmail)
    );
    const querySnapshot = await getDocs(chatQuery);
    if (!querySnapshot.empty) {
      const chatDoc = querySnapshot.docs[0];
      return { id: chatDoc.id, ...chatDoc.data() };
    } else return false;
  } catch (error: any) {
    window.alert('Erro ao obter chat: ' + error.message);
    return false;
  }
}

export async function getChatsByEmail(email: string) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const chatCollectionRef = collection(db, 'chats');
    const queryByCompany = query(chatCollectionRef, where('company', '==', email));
    const queryByEmail = query(chatCollectionRef, where('developer', '==', email));
    const querySnapshotByCompany = await getDocs(queryByCompany);
    const querySnapshotByEmail = await getDocs(queryByEmail);
    const combinedResults: any = [];

    querySnapshotByCompany.forEach(doc => {
      combinedResults.push({ id: doc.id, ...doc.data() });
    });

    querySnapshotByEmail.forEach(doc => {
      const alreadyIncluded = combinedResults.some((item: any) => item.id === doc.id);
      if (!alreadyIncluded) {
        combinedResults.push({ id: doc.id, ...doc.data() });
      }
    });

    return combinedResults;
  } catch (error: any) {
    window.alert('Erro ao obter chat: ' + error.message);
    return false;
  }
}


export const getHoraOficialBrasil = async () => {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo');
    const data = await response.json();
    const date = new Date(data.utc_datetime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
    return formattedDate;
  } catch (error) {
    return null;
  }
};

export const demonstrateInterest = async (company: any, developer: any, itemVideo: any) => {
  const auth = await authenticate();
  const date = await getHoraOficialBrasil();
  if (auth) {
    const findChat = await getChatByCompAndDev(company.email, developer.email);
    if (findChat) {
      await addToChat(
        findChat.id,
        itemVideo.title,
        {
          type: "general",
          message: `A Empresa ${ capitalizeWords(company.company) } também demonstrou interesse no Projeto ${ itemVideo.title }.`,
          date,
          user: '',
        }
      );
      await registerNotification(
        {
          message: `É muito bom ver a ${capitalizeWords(company.company)} demonstrando interesse em mais um projeto do desenvolvedor ${capitalizeWords(developer.firstName)} ${capitalizeWords(developer.lastName)}. Enviamos uma notificação para ele e, para acessar a conversa, basta buscar pelo dev em "Conversas", ou clique aqui nesta notificação para ser redirecionado para lá.`,
          user: company.email,
        },
      );
      await registerNotification(
        {
          message: `Olá, tudo bem? A Empresa ${capitalizeWords(company.company)}, que já havia entrado em contato sobre um projeto seu, agora demonstra interesse em um outro projeto que você também publicou, o ${itemVideo.title}. Vá até "Conversas para ter acesso ao chat que criamos para que vocês se comuniquem, ou clique aqui nesta notificação para ser redirecionado.`,
          user: developer.email,
        },
      );
      return `/chat/${findChat.id}`;
    } else {
      const chatId = await createChat({
        chat: [
          {
            type: "general",
            message: `Uma conversa foi iniciada entre a empresa ${company.company} e o Desenvolvedor ${developer.firstName} ${developer.lastName}`,
            date,
            user: '',
          },
          {
            type: "general",
            message: `A Empresa ${company.company} demonstrou interesse no Projeto ${ itemVideo.title } e criamos esse chat para que as partes se conheçam e conversem sobre o mesmo.`,
            date,
            user: '',
          }
        ],
        developer: itemVideo.user,
        company: auth.email,
        video: itemVideo.title,
      });
      await registerNotification(
        {
          message: `Uma interação foi criada entre você e o desenvolvedor ${capitalizeWords(developer.firstName)} ${capitalizeWords(developer.lastName)}. Para acessar a conversa, basta buscar pelo dev em "Conversas", ou clique aqui nesta notificação para ser redirecionado para lá.`,
          user: company.email,
        },
      );
      await registerNotification(
        {
          message: `Olá, tudo bem? A Empresa ${capitalizeWords(company.company)} demonstrou interesse no seu projeto ${itemVideo.title}. Vá até "Conversas para ter acesso ao chat que criamos para que vocês se comuniquem, ou clique aqui nesta notificação para ser redirecionado para lá.`,
          user: developer.email,
        },
      );
      return '/chat/' + chatId;
    }
  } else return '/';
};

export async function getChatById(chatId: string) {
  try {
    await authenticate();
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const chatDocRef = doc(db, "chats", chatId);
    const chatDocSnapshot = await getDoc(chatDocRef);
    if (chatDocSnapshot.exists()) {
      const chatData = chatDocSnapshot.data();
      chatData.id = chatDocSnapshot.id;
      return chatData;
    } else window.alert('O chat com o ID fornecido não foi encontrado.');
  } catch (error) {
    console.error('Erro ao obter chat por ID:', error);
    throw error;
  }
};

export async function deleteChatById(chat: any, email: string) {
  try {
    const chatToDelete = await getChatById(chat.id);
    if (chatToDelete) {   
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getFirestore(firebaseApp);
      const chatDocRef = doc(db, "chats", chat.id);
      const chatDocSnapshot = await getDoc(chatDocRef);
      if (chatDocSnapshot.exists()) {
        let text = '';
        if (chat.video.length > 1) {
          if (chat.video.length === 0) {
            text = '';
          } else if (chat.video.length === 1) {
            text = chat.video[0];
          } else {
            const lastMessage = chat.video.pop();
            text = `os Projetos ${chat.video.join(', ')} e ${lastMessage}`;
          }
        } else text = `o Projeto ${chat.video[0]}`;
        await deleteDoc(chatDocRef);
        await registerNotification(
          {
            message: `${email === chat.company ? `Você encerrou a conversa com o desenvolvedor sobre ${text}` : `A conversa sobre ${text} foi encerrada pelo desenvolvedor`}. Esperamos que tenha sido uma ótima experiência na nossa plataforma!`,
            user: chat.company,
          },
        );
        await registerNotification(
          {
            message: `${email === chat.developer ? `Você encerrou a conversa com a empresa sobre ${text}` : `A conversa sobre ${text} foi encerrada pela empresa`}. Esperamos que tenha sido uma ótima experiência na nossa plataforma!`,
            user: chat.developer,
          },
        );
        window.alert(`Conversa excluída com sucesso!`);
      } else {
        window.alert('A Conversa não foi encontrada. Por favor, atualize a página e tente novamente');
      }
    } else window.alert('A Conversa não foi encontrada. Por favor, atualize a página e tente novamente');
  } catch (error) {
    window.alert('Erro ao excluir Conversa (' + error + ').');
  }
};