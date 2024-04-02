'use client';
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { authenticate } from "@/firebase/authenticate";
import Logout from "./logout";
import { IoIosCloseCircleOutline, IoIosNotifications } from "react-icons/io";
import { deleteNotificationById } from "@/firebase/notifications";
import { useRouter } from "next/navigation";
import contextProv from '../context/context';
import { getUserByEmail } from "@/firebase/user";
import Loading from "./loading";

export default function Navigation(props: { name: string }) {
  const context = useContext(contextProv);
  const { allNotifications, getNotifications } = context;
  const { name } = props;
  const [showMenu, setShowMenu] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [user, setUser] = useState<any>({});
  const [notifications, setNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const authUser = async () => {
      const auth = await authenticate();
      if (auth) {
        getNotifications(auth.email);
        const user = await getUserByEmail(auth.email);
        setUser(user);
      } else router.push('/');
    };
    authUser();
    setLoading(false);
  }, []);

  return(
    <nav className="fixed w-full bg-black z-50">
      <div className="w-full flex items-center justify-between p-2">
        <Image
          src="/faceInvader.png"
          className="w-10 h-10 object-cover cursor-pointer"
          width={2000}
          height={2000}
          alt="Face invader"
          onClick={ () => router.push('/home') }
        />
        <div className="z-50 flex justify-end items-center gap-3">
          <button
            type="button"
            className="ring-2 ring-violet-500 rounded-full relative"
            onClick={ () => {
              setNotifications(!notifications);
              if(showMenu) setShowMenu(false);
            }}
            >
            { allNotifications.length > 0 && <div className="h-2 w-2 rounded-full bg-red-500 z-50 absolute top-1 right-0" /> }
            <IoIosNotifications
              className="text-4xl p-1 text-violet-500 cursor-pointer bg-black rounded-full"
            />
          </button>
          {
            user && user.imageURL &&
              <button 
                type="button"
                onClick={ () => {
                  setShowMenu(!showMenu);
                  if(notifications) setNotifications(false);
                }}
                className="rounded-full cursor-pointer sm:mr-3 flex flex-col z-40"
              >
                <Image
                  className={`w-9 h-9 p-1 rounded-full ring-2 ring-violet-500 hover:ring-violet-500`}
                  src={user.imageURL}
                  width={500}
                  height={500}
                  alt="Bordered avatar"
                />
              </button>
          }
        </div>
        {
          showMenu &&
          <div className="absolute right-0 top-0 h-screen flex flex-col bg-black w-full sm:1/3 md:w-1/4 lg:w-1/5 border-l-2 border-violet-500">
            <ul className="flex flex-col font-medium items-center justify-center h-full p-4 md:p-0 border border-gray-100 md:border-0 md:bg-black gap-4">
              <Link 
                href="/home"
                onClick={ () => setShowMenu(false) }
                className={`text-center w-full py-2 px-3  ${name === 'home' ? 'bg-black text-violet-500' : 'text-white hover:text-violet-500'} rounded md:bg-transparent md:p-0`}
                aria-current="page"
              >
                Início
              </Link>
              <Link  
                href="/profile"
                onClick={ () => setShowMenu(false) }
                className={`text-center w-full py-2 px-3  ${name === 'profile' ? 'bg-black text-violet-500' : 'text-white hover:text-violet-500'} rounded md:bg-transparent md:p-0`}>
                Perfil
              </Link>
              <Link  
                href="/about"
                onClick={ () => setShowMenu(false) }
                className={`text-center w-full py-2 px-3  ${name === 'about' ? 'bg-black text-violet-500' : 'text-white hover:text-violet-500'} rounded md:bg-transparent md:p-0`}>
                Sobre
              </Link>
              <Link  
                href="/companies"
                onClick={ () => setShowMenu(false) }
                className={`text-center w-full py-2 px-3  ${name === 'companies' || name === 'company' ? 'bg-black text-violet-500' : 'text-white hover:text-violet-500'} rounded md:bg-transparent md:p-0`}>
                Empresas
              </Link>
              <Link  
                href="/chat"
                onClick={ () => setShowMenu(false) }
                className={`text-center w-full py-2 px-3  ${name === 'chat' ? 'bg-black text-violet-500' : 'text-white hover:text-violet-500'} rounded md:bg-transparent md:p-0`}>
                Conversas
              </Link>
              <Link  
                href="/developers"
                onClick={ () => setShowMenu(false) }
                className={`text-center w-full py-2 px-3  ${name === 'developers' || name === 'video' ? 'bg-black text-violet-500' : 'text-white hover:text-violet-500'} rounded md:bg-transparent md:p-0`}>
                Desenvolvedores
              </Link>
              <button 
                type="button"
                onClick={ () => setShowLogout(true)}
                className="mt-5 w-full text-center py-2 px-3 rounded md:border-0 text-white hover:text-violet-500 md:p-0">
                Sair
              </button>
            </ul>
          </div>
        }
        {
          notifications &&
          <div className="absolute right-0 top-0 h-screen flex flex-col justify-start bg-black w-full sm:1/3 md:w-1/4 lg:w-1/5 pt-14 bg-dice bg-cover border-l-2 border-violet-500">
            <div className="text-black p-2 flex flex-col items-center justify-start gap-3 overflow-y-auto">
            {
              allNotifications.length > 0
              ? allNotifications.map((notif: any, index: number) => (
                  <button
                    onClick={ () => router.push('/chat')}
                    type="button"
                    key={index}
                    className="border border-1 p-2 bg-black rounded-xl relative"
                  >
                    <div className="flex items-center justify-center w-full my-2">
                      <Image
                        src="/faceInvader.png"
                        className="w-10 h-10 object-cover cursor-pointer"
                        width={2000}
                        height={2000}
                        alt="Face invader"
                        onClick={ () => router.push('/home') }
                      />
                    </div>
                    <div className="w-full flex items-center justify-end absolute top-2 right-2">
                      <IoIosCloseCircleOutline
                        className="text-3xl text-white cursor-pointer"
                        onClick={ async (e: any) => {
                          e.stopPropagation();
                          const auth = await authenticate();
                          if (auth) {
                            await deleteNotificationById(notif.id);
                            getNotifications(auth.email);
                          }
                        }}
                      />
                    </div>
                    <p className="text-sm w-full text-center text-white px-2 pb-3">{ notif.message }</p>
                    <div className="flex items-center justify-center">
                      <Image
                        src="/faceInvader.png"
                        className="w-10 h-10 object-cover cursor-pointer"
                        width={2000}
                        height={2000}
                        alt="Face invader"
                        onClick={ () => router.push('/home') }
                      />
                    </div>
                  </button>
                ))
              : <div>
                  {
                    loading
                    ? <Loading />
                    : <div className="h-80vh w-full">
                        <div className="border border-1 px-4 py-5 bg-black rounded-xl relative text-white w-full text-center flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center py-5">
                          <Image
                            src="/faceInvader.png"
                            className="w-10 h-10 object-cover cursor-pointer"
                            width={2000}
                            height={2000}
                            alt="Face invader"
                            onClick={ () => router.push('/home') }
                          />
                        </div>
                        <p>Você não possui Notificações pendentes</p>
                        <div className="flex items-center justify-center py-5">
                        <Image
                          src="/faceInvader.png"
                          className="w-10 h-10 object-cover cursor-pointer"
                          width={2000}
                          height={2000}
                          alt="Face invader"
                          onClick={ () => router.push('/home') }
                        />
                      </div>
                        </div>
                      </div>
                  }
                </div>
            }
            </div>
          </div>
        }
        { showLogout && <Logout setShowLogout={setShowLogout} /> }
      </div>
    </nav>
  );
}
