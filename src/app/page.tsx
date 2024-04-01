'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { authenticate, signIn } from "@/firebase/authenticate";
import Image from "next/image";
import Loading from "@/components/loading";

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

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const buttonSend = document.getElementById('sendMessage');
      if (buttonSend) buttonSend.click();
    }
  };
  
  return(
    <section className="bg-dice bg-center h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-full lg:py-0">
        {
          !showData 
            ? <Loading />                
            : <div className="p-1 bg-prot-light w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:border-gray-700 z-50">
                <div className="w-full bg-black rounded-lg shadow dark:border md:mt-0 w-full xl:p-0 dark:border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className="flex w-full items-center justify-center">
                      <Image
                        src="/faceInvader.png"
                        className="w-20 h-20 object-cover"
                        width={2000}
                        height={2000}
                        alt="background image"
                        />
                    </div>
                    <h2 className="w-full text-center font-bold text-violet-400 text-2xl">
                      Bem vindo!
                    </h2>
                    <div className="space-y-4 md:space-y-6">
                      <div>
                          <label htmlFor="email" className="block mb-2 text-sm font-medium text-violet-400">Email</label>
                          <div className="border border-2 border-prot-light rounded">
                            <input 
                              type="email"
                              name="email"
                              id="email" 
                              onChange={(e) => setEmail(e.target.value)}
                              className="bg-black border-none outline-none text-violet-400 sm:text-sm rounded block w-full p-2.5 placeholder-violet-500" placeholder="name@company.com"
                            />
                          </div>
                      </div>
                      <div>
                          <label htmlFor="password" className="block mb-2 text-sm font-medium text-violet-400">Senha</label>
                          <div className="border border-2 border-prot-light rounded">
                            <input 
                            type="password"
                            name="password"
                            id="password"
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-black border-none outline-none text-violet-400 sm:text-sm rounded block w-full p-2.5 placeholder-violet-500"
                          />
                          </div>
                      </div>
                      <div className="flex items-center justify-end">
                          {/* <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Esqueceu a Senha?</a> */}
                      </div>
                      <button 
                        type="button"
                        onClick={handleLogin}
                        id="sendMessage"
                        className="bg-black border-2 border-prot-light transition-colors hover:border-violet-700 text-violet-400 w-full focus:ring-4 focus:outline-none focus:ring-prot-light font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:text-violet-700">Entrar</button>
                      <Link 
                        href="/register/user"
                        className="text-sm font-light text-violet-400 flex items-center justify-center">
                        Não tem uma conta? <span className="font-medium text-primary-600 hover:underline pl-1 underline">Cadastrar</span>
                      </Link>   
                    </div>
                  </div>
                </div>
              </div>
        }
      </div>
    </section>
  );
}

export default App;