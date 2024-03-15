import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithRedirect, signOut } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyDugptWWK6AM3Dkc9zSt5ZcJAGOyTjSx7w",
    authDomain: "uploadreact-85d68.firebaseapp.com",
    projectId: "uploadreact-85d68",
    storageBucket: "uploadreact-85d68.appspot.com",
    messagingSenderId: "642741037500",
    appId: "1:642741037500:web:8b7659add544af2e28a3b9",
    measurementId: "G-X4S0NFGFK4"
  };

export const signIn = async (email: string, password: string) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    return false;
  }
}

export const signOutFirebase = async () => {
  const firebaseApp = initializeApp(firebaseConfig);
  try {
    const auth = getAuth(firebaseApp);
    await signOut(auth);
    return true;
  } catch (error) {
    window.alert('Não foi possível deslogar o usuário. Por favor, atualize a página e Tente novamente ('+ error + ').' );
    return false;
  }
};

export const authenticate = () => {
  const firebaseApp = initializeApp(firebaseConfig);
  return new Promise<{ email: string, photoURL: string, displayName: string } | null>((resolve) => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        const { displayName, email, photoURL } = user;
        resolve({
          email,
          displayName,
          photoURL,
        });
      } else {
        resolve(null);
      } unsubscribe();
    });
  });
};

export const handleGoogleLogin = async () => {
  const firebaseApp = initializeApp(firebaseConfig);
  const provider = new GoogleAuthProvider();
  const auth = getAuth(firebaseApp);
  auth.languageCode = 'it';
  try {
    await signInWithRedirect(auth, provider);
    return true;  
  } catch (error) {
    window.alert('Ocorreu um erro ao realizar o login. Por favor, tente novamente.');
    return false;
  }
};