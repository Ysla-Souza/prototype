'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { authenticate, signIn } from "@/firebase/authenticate";
import Image from "next/image";
import Loading from "@/components/loading";
import contextProv from '../context/context';
import ForgotPassword from "@/components/forgotPassword";

function App() {
  const context = useContext(contextProv);
  const [showData, setShowData] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  
  const { setShowForgotPassword, showForgotPassword } = context;

  useEffect(() => {
    const authUser = async () => {
      const auth = await authenticate();
      if(auth) router.push("/home");
      else setShowData(true);
    };
    authUser();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const validate = /\S+@\S+\.\S+/;
    const vEmail = !email || !validate.test(email) || email === '';
    if(vEmail) {
      window.alert('Necessário preencher um Email válido');
      setLoading(false);
    } else if (!password || password.length < 6) {
      window.alert('Necessário inserir uma Senha com pelo menos 6 dígitos');
      setLoading(false);
    } else {
      const log = await signIn(email, password);
      if (log) router.push("/home"); 
      else {
        window.alert('Não foi possível realizar o login. Por favor, verifique suas credenciais e tente novamente.');
        setLoading(false);
      }
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const buttonSend = document.getElementById('sendMessage');
      if (buttonSend) buttonSend.click();
    }
  };
  
  return(
    <section className="break-words bg-dice bg-center min-h-screen w-full items-center justify-center">
      <div className="break-words flex flex-col items-center justify-center px-6 py-8 mx-auto h-full lg:py-0">
        {
          !showData 
            ? <div className="break-words h-screen flex items-center justify-center bg-dice w-full bg-center">
                <Loading />               
              </div>                 
            : <div className="break-words p-1 bg-prot-light w-full rounded-lg shadow dark:border sm:max-w-md dark:border-gray-700 z-50 my-5">
                <div className="break-words w-full bg-black rounded-lg shadow dark:border md:mt-0 w-full xl:p-0 dark:border-gray-700 ">
                  <div className="break-words p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className={`flex w-full items-center justify-center ${loading ? 'animate-spin' : ''}`}>
                      <Image
                        src="/faceInvader.png"
                        className="break-words w-20 h-20 object-cover rounded-full"
                        width={2000}
                        height={2000}
                        alt="background image"
                        />
                    </div>
                    <h2 className="break-words w-full text-center font-bold text-white text-2xl">
                      Bem vindo!
                    </h2>
                    <div className="break-words space-y-4 md:space-y-6">
                      <div>
                          <label htmlFor="email" className="break-words block mb-2 text-sm font-medium text-white">Email</label>
                          <div className="break-words border border-2 border-prot-light rounded">
                            <input 
                              type="email"
                              name="email"
                              id="email" 
                              onChange={(e) => setEmail(e.target.value)}
                              className="break-words bg-black border-none outline-none text-white sm:text-sm rounded block w-full p-2.5 placeholder-gray-400" placeholder="name@company.com"
                            />
                          </div>
                      </div>
                      <div>
                          <label htmlFor="password" className="break-words block mb-2 text-sm font-medium text-white">Senha</label>
                          <div className="break-words border border-2 border-prot-light rounded">
                            <input 
                            type="password"
                            name="password"
                            id="password"
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className="break-words bg-black border-none outline-none text-white sm:text-sm rounded block w-full p-2.5 placeholder-gray-400"
                          />
                          </div>
                      </div>
                      <div className="break-words flex items-center justify-end">
                          <button
                            onClick={() => setShowForgotPassword(true) }
                            className="break-words text-sm font-medium text-primary-600 hover:underline dark:text-primary-500 text-violet-500">
                              Esqueceu a Senha?
                          </button>
                      </div>
                      <button 
                        type="button"
                        onClick={handleLogin}
                        id="sendMessage"
                        className="break-words bg-black border-2 border-prot-light transition-colors hover:border-white text-white w-full focus:ring-4 focus:outline-none focus:ring-prot-light font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        { loading ? 'Verificando...' : 'Entrar'}
                      </button>
                      <Link 
                        href="/register/user"
                        className="break-words text-sm font-light text-violet-400 flex items-center justify-center">
                        Não tem uma conta? <span className="break-words font-medium hover:underline pl-1 underline">Cadastrar</span>
                      </Link>   
                    </div>
                  </div>
                </div>
                { showForgotPassword && <ForgotPassword /> }
              </div>
        }
      </div>
    </section>
  );
}

export default App;