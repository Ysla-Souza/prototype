'use client'
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { IoIosCloseCircleOutline } from "react-icons/io";
import contextProv from '../../context/context';
import DeleteChat from "@/components/deleteChat";

export default function Chat() {
  const context = useContext(contextProv);
  const { showDeleteChat, setShowDeleteChat, getChats, allChats } = context;
  const [showData, setShowData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authUser = async () => {
      setShowData(false);
      const auth = await authenticate();
      if (auth) {
        setShowData(true);
        getChats(auth.email);
        setShowData(true);
      }
      else router.push("/");
    };
    authUser();
  }, []);

  return(
    <div className={`w-full ${showData ? 'min-h-screen' : 'h-80vh'}`}>
      <Navigation name="chat" />
      <Image
        src=""
        className="w-full object-cover h-20vh bg-gray-500"
        width={1500}
        height={1500}
        alt="paisagem"
      />
      <div className="w-full h-full items-center justify-center flex w-wrap py-5 px-5 sm:px-20 lg:px-28 bg-gray-200">
        {
          !showData 
          ? <div className="flex items-center justify-center">
              <span className="loader p-6 space-y-4 md:space-y-6 sm:p-8" />
            </div>                
          : <div className="w-full h-screen">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-center sm:text-left mt-3 mb-5 text-2xl">Chat</h2>
              </div>
              <div className="flex flex-col w-full">
              {
                allChats.length > 0
                && allChats.map((allChat: any, index: number) => (
                  <button
                    key={index}
                    type="button"
                    className="border border-2 border-black flex flex-col p-2"
                    onClick={() => router.push(`/chat/${allChat.id}`)}
                  >
                    <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
                      <IoIosCloseCircleOutline
                        className="text-4xl text-black cursor-pointer"
                        onClick={ (e: any) => {
                          e.stopPropagation();
                          setShowDeleteChat({ show: true, chat: allChat })
                        }}
                      />
                    </div>
                    <div>Empresa: { allChat.company }</div>
                    <div>Vídeos: { allChat.video }</div>
                    <div>Última mensagem: {allChat.chat[allChat.chat.length-1].message }</div>
                  </button>
                ))
              }
              </div>
            </div>
        }
      </div>
      { showDeleteChat.show && <DeleteChat /> }
      <Footer />
    </div>
    );
  }