'use client'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { createProfileImage } from './storage';

const firebaseConfig = {
  apiKey: "AIzaSyDugptWWK6AM3Dkc9zSt5ZcJAGOyTjSx7w",
  authDomain: "uploadreact-85d68.firebaseapp.com",
  projectId: "uploadreact-85d68",
  storageBucket: "uploadreact-85d68.appspot.com",
  messagingSenderId: "642741037500",
  appId: "1:642741037500:web:8b7659add544af2e28a3b9",
  measurementId: "G-X4S0NFGFK4"
};

export async function getDevelopers() {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(query(usersCollection, where("typeUser", "==", "developer")));
    const developers: any = [];
    querySnapshot.forEach(doc => {
      developers.push({ id: doc.id, ...doc.data() });
    });
    return developers;
  } catch (error) {
    window.alert('Erro ao obter Desenvolvedores. Por favor, atualize a página e tente novamente (' + error + ')');
  }
};

export async function getCompanies() {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(query(usersCollection, where("typeUser", "==", "company")));
    const companies: any = [];
    querySnapshot.forEach(doc => {
      companies.push({ id: doc.id, ...doc.data() });
    });
    return companies;
  } catch (error) {
    window.alert('Erro ao obter Empresas. Por favor, atualize a página e tente novamente (' + error + ')');
  }
};

export async function registerUser(
  email: string,
  password: string,
  company: string,
  firstName: string,
  lastName: string,
  description: string,
  image: any,
  typeUser: string,
  ) {
    try {
    const firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const imageURL = await createProfileImage(user.uid, image);
    if (typeUser === 'company') {
      await setDoc(doc(db, 'users', user.uid), {
        email, company, typeUser, imageURL, description, skills: [],
      });
      window.alert('Empresa registrada com sucesso!');
    } else {
      await setDoc(doc(db, 'users', user.uid), {
        email, firstName, lastName, typeUser, imageURL, description, skills: [],
      });
      window.alert('Usuário registrado com sucesso!');
    }
    return true;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert('Erro ao registrar:' + errorCode + ' - ' + errorMessage);
    return false;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      window.alert('Usuário com o email fornecido não encontrado.');
    } else {
      let user: any;
      querySnapshot.forEach((doc: any) => {
        user = doc.data();
        user.id = doc.id;
      });
      return user;
    }
  } catch (error) {
    window.alert('Erro ao obter usuário por email: ' + error);
    return false;
  }
}

export async function getUserById(userId: string) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);

    const usersCollectionRef = collection(db, 'users');
    const userDoc = await getDoc(doc(usersCollectionRef, userId));

    if (!userDoc.exists()) {
      window.alert('Usuário com o ID fornecido não encontrado.');
      return null;
    } else {
      const user = userDoc.data();
      if (user) {
        user.id = userDoc.id;
        return user;
      } else {
        window.alert('Usuário encontrado com ID inválido.');
        return null;
      }
    }
  } catch (error) {
    window.alert('Erro ao obter usuário por ID: ' + error);
    return null;
  }
}

export async function updateUserById(userData: any) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, 'users', userData.id);
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
      window.alert('Usuário / Empresa não encontrad(a)');
    } else {
      await updateDoc(userDocRef, userData);
      window.alert('Dados atualizados com sucesso!');
      return true;
    }
  } catch (error) {
    window.alert('Erro ao atualizar dados: ' + error);
    return false;
  }
}