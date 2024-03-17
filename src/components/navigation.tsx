'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { authenticate, signOutFirebase } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";

export default function Navigation(props: { name: string }) {
  const { name } = props;
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const authUser = async () => {
      const auth = await authenticate();
      if (auth) setUser(auth);
    };
    authUser();
  }, []);

  const barra1 = () => {
    if(!showMenu) {
      return 'rotate-0 transition duration-500 z-0';
    } return 'rotate-45 transition duration-500 translate-y-2 z-40';
  }
  const barra2 = () => {
    if(!showMenu) {
      return 'rotate-0 transition duration-500 z-0';
    } return '-rotate-45 transition duration-500 z-40';
  }
  const barra3 = () => {
    if(!showMenu) {
      return 'opacity-1 transition duration-500 z-0';
    } return 'opacity-0 transition duration-500 z-40';
  }

  const logout = async () => {
    setShowMenu(false);
    const signOut = await signOutFirebase();
    if (signOut) router.push("/"); 
  }
  return(
    <nav className="absolute w-full border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {
          user && user.photoURL &&
            <button 
              type="button"
              onClick={ () => setShowMenu(!showMenu) }
              className="pt-1 pb-1 rounded cursor-pointer fixed right-0 top-0 sm:mt-2 sm:mr-3 flex flex-col z-40"
            >
              <Image
                className={`w-10 h-10 p-1 rounded-full ring-2 hover:ring-blue-700 ${showMenu ? 'ring-blue-700' : 'ring-white'} dark:ring-white`}
                src={user.photoURL}
                width={500}
                height={500}
                alt="Bordered avatar"
              />
            </button>
        } 
        {
          user && user.email && !user.photoURL &&
            <button 
              type="button"
              onClick={ () => setShowMenu(!showMenu) }
              className="rounded cursor-pointer fixed right-0 top-0 sm:mt-3 sm:mr-3 flex flex-col z-40"
            >
              <div
                className={`w-10 capitalize flex items-center justify-center dark:text-white text-black font-bolder h-10 rounded-full ring-2 hover:ring-blue-700 ${showMenu ? 'ring-blue-700' : 'ring-white'} dark:ring-white`}
              >
                {user.email[0]}
              </div>
            </button>
        } 
        {
          showMenu &&
          <div className="absolute right-0 top-0 h-screen flex flex-col bg-white w-full sm:1/3 md:w-1/4 lg:w-1/5">
            <ul className="flex flex-col font-medium items-center justify-center h-full p-4 md:p-0 border border-gray-100 bg-gray-50 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 gap-4">
              <Link 
                href="/"
                onClick={ () => setShowMenu(false) }
                className={`text-center w-full py-2 px-3  ${name === 'home' ? 'bg-white text-blue-700' : 'bg-blue-700 text-white'} rounded md:bg-transparent md:p-0`}
                aria-current="page"
              >
                Início
              </Link>
              <Link  
                href="/videos"
                onClick={ () => setShowMenu(false) }
                className={`text-center w-full py-2 px-3  ${name === 'videos' || name === 'video' ? 'bg-white text-blue-700' : 'bg-blue-700 text-white'} rounded md:bg-transparent md:p-0`}>
                Meus Vídeos
              </Link>
              <Link  
                href="/companies"
                onClick={ () => setShowMenu(false) }
                className={`text-center w-full py-2 px-3  ${name === 'companies' || name === 'company' ? 'bg-white text-blue-700' : 'bg-blue-700 text-white'} rounded md:bg-transparent md:p-0`}>
                Empresas
              </Link>
              <Link  
                href="/profile"
                onClick={ () => setShowMenu(false) }
                className={`text-center w-full py-2 px-3  ${name === 'profile' ? 'bg-white text-blue-700' : 'bg-blue-700 text-white'} rounded md:bg-transparent md:p-0`}>
                Perfil
              </Link>
              <Link  
                href="/about"
                onClick={ () => setShowMenu(false) }
                className={`text-center w-full py-2 px-3  ${name === 'about' ? 'bg-white text-blue-700' : 'bg-blue-700 text-white'} rounded md:bg-transparent md:p-0`}>
                Sobre
              </Link>
              <button 
                type="button"
                onClick={logout}
                className="mt-5 w-full text-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                Sair
              </button>
            </ul>
          </div>
        }
      </div>
    </nav>
  );
}