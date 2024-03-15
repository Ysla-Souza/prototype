'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaWindows } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { GrApple } from "react-icons/gr";
import { authenticate, handleGoogleLogin, signIn } from "@/firebase/authenticate";

function App() {

  const [showData, setShowData] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

const router = useRouter();

useEffect(() => {
  const authUser = async () => {
    const auth = await authenticate();
    if(auth) router.push("/home");
    else setShowData(true);
  };
  authUser();
}, []);

  const handleLogin = async () => {
    const validate = /\S+@\S+\.\S+/;
    const vEmail = !email || !validate.test(email) || email === '';
    if(vEmail) {
      window.alert('Necessário preencher um Email válido');
    } else if (!password || password.length < 6) {
      window.alert('Necessário inserir uma Senha com pelo menos 6 dígitos');
    } else {
      const log = await signIn(email, password);
      if (log) router.push("/home"); 
      else window.alert('Não foi possível realizar o login. Por favor, verifique suas credenciais e tente novamente.');
    } 
  };

  const handleGoogle = async () => {
    const logGoogle = await handleGoogleLogin();
    if (logGoogle) router.push("/home");
    else window.alert('Não foi possível realizar o login. Por favor, tente novamente.'); 
  };

  // const handleMicrosoftLogin = async () => {
  //   const provider = new firebase.auth.OAuthProvider('microsoft.com');
  //   try {
  //     await firebase.auth().signInWithPopup(provider);
  //     router.push('/home');
  //   } catch (error) {
  //     window.alert('Erro ao fazer login com a Microsoft: ' + error);
  //   }
  // }; 
    // ? return <span className="loader" />
  return(
    <section className="bg-gray-50 dark:bg-gray-900 h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-full lg:py-0">
          {
            !showData 
              ? <div className="flex items-center justify-center">
                  <span className="loader p-6 space-y-4 md:space-y-6 sm:p-8" />
                </div>                
              : <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Login
                  </h1>
                  <div className="space-y-4 md:space-y-6">
                      <div>
                          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                          <input 
                            type="email"
                            name="email"
                            id="email" 
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                      </div>
                      <div>
                          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                          <input 
                          type="password"
                          name="password"
                          id="password"
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                      </div>
                      <div className="flex items-center justify-end">
                          <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Esqueceu a Senha?</a>
                      </div>
                      <button 
                        type="button"
                        onClick={handleLogin}
                        className="border-2 border-gray-300 hover:border-black text-black w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                      <div className="flex items-center justify-center gap-4">
                        <GrApple 
                        //onClick={handleAppleLogin}
                        className="text-xl cursor-pointer" />
                        <FcGoogle 
                        onClick={handleGoogle}
                        className="text-xl cursor-pointer" />
                        <FaWindows 
                        //onClick={handleMicrosoftLogin}
                        className="text-xl cursor-pointer" />
                      </div>
                      <Link 
                      href="/register/user"
                      className="text-sm font-light text-gray-500 dark:text-gray-400 flex items-center justify-center">
                          Não tem uma conta? <span className="font-medium text-primary-600 hover:underline dark:text-primary-500 pl-1 underline">Cadastrar</span>
                      </Link>
                      
                  </div>
              </div>
              </div>
          }
        </div>
      
    </section>
  );
}

export default App;