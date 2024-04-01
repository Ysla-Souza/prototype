'use client'
import { useRouter } from "next/navigation";
import { IoIosCloseCircleOutline } from "react-icons/io";
import contextProv from '../context/context';
import { useContext, useState } from "react";
import { deleteChatById } from "@/firebase/chat";
import { authenticate } from "@/firebase/authenticate";

export default function DeleteChat() {
  const router: any = useRouter();
  const context = useContext(contextProv);
  const [loading, setLoading] = useState(false);
  const { getChats, getNotifications, showDeleteChat, setShowDeleteChat } = context;

  const deleteChatFromFirebase = async () => {
    const auth = await authenticate();
    if(auth) {
      setLoading(true);
      await deleteChatById(showDeleteChat.chat, auth.email);
      getChats(auth.email);
      getNotifications(auth.email);
      setLoading(false);
      router.push('/chat');
      setShowDeleteChat({ show: false, chat: {} });
    } else router.push('/');
  };

  return(
    <div
      className="text-black z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-background bg-black/80 px-3 sm:px-0"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white w-full sm:w-2/3 md:w-1/3 overflow-y-auto">
        <div className="flex flex-col justify-center items-center bg-background bg-contain relative border-white border-2">
          <div className="bg-white/80">
            <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
              <IoIosCloseCircleOutline
                className="text-4xl text-black cursor-pointer"
                onClick={ () => setShowDeleteChat({ show: false, chat: {} })}
              />
            </div>
            <div className="pb-5 px-5 w-full">
              <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
                <p className="text-black w-full text-center pb-3 pt-5">
                  Tem certeza que quer encerrar esta conversa? Após isso, não será mais possível interagir com a outra parte até que a Empresa demonstre interesse novamente em algum projeto do Desenvolvedor.
                </p>
              </label>
              { !loading
                ? <div className="flex w-full gap-2">
                  <button
                    type="button"
                    onClick={ () => setShowDeleteChat({ show: false, chat: {} })}
                    className={`text-black bg-pink-mjg hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={ deleteChatFromFirebase }
                    className={`text-black bg-blue-mjg hover:border-blue-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
                  >
                    Excluir
                  </button>
                </div>
                : <div className={`text-black bg-blue-mjg transition-colors cursor-pointer border-2 border-white w-full text-center p-2 mt-6 font-bold`}>Excluindo...</div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
