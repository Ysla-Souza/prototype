'use client'
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import contextProv from '../../context/context';
import DeleteChat from "@/components/deleteChat";
import { MdDelete, MdOutlineFilterList } from "react-icons/md";
import { getUserByEmail } from "@/firebase/user";

export default function Chat() {
  const context = useContext(contextProv);
  const { showDeleteChat, setShowDeleteChat, getChats, allChats, listChats, setListChats } = context;
  const [showFilter, setShowFilter] = useState(false);
  const [showData, setShowData] = useState(false);
  const [dataUser, setDataUser] = useState<any>(false);
  const [chat, setChat] = useState('');
  const router = useRouter();

  useEffect(() => {
    const authUser = async () => {
      setShowData(false);
      const auth = await authenticate();
      if (auth) {
        const getUser = await getUserByEmail(auth.email);
        setDataUser(getUser);
        setShowData(true);
        getChats(auth.email);
        setShowData(true);
      }
      else router.push("/");
    };
    authUser();
  }, []);

  function limitString(str: string) {
    if (str.length <= 100) {
      return str;
    } else {
      return str.substring(0, 100) + '...';
    }
  }

  return(
    <div className={`w-full ${showData ? 'min-h-screen' : 'h-80vh'}`}>
      <Navigation name="chat" />
      <div className="break-words w-full h-35vh relative bg-dice bg-cover" />
      <div className="break-words w-full h-full items-center justify-center flex w-wrap py-5 px-5  bg-black">
        {
          !showData 
          ? <div className="break-words flex items-center justify-center">
              <span className="break-words loader p-6 space-y-4 md:space-y-6 sm:p-8" />
            </div>                
          : <div className="break-words w-full min-h-80vh">
              <div className="break-words flex justify-between items-center w-full">
                <h2 className="break-words text-center text-white sm:text-left mt-3 mb-5 text-2xl">Conversas</h2>
              </div>
              <MdOutlineFilterList
                className="break-words text-xl mb-5 cursor-pointer text-white "
                onClick={() => {
                  setShowFilter(!showFilter);
                  setListChats(allChats)
                  setChat('');
                }}
              />
              {
                showFilter &&
                <div className="break-words w-full mb-3">
                  <input
                    type="text"
                    name="categories"
                    id="categories"
                    value={chat}
                    placeholder="Digite aqui"
                    onChange={(e: any) => {
                      if (e.target.value.length === '') setListChats(allChats);
                      else {
                        if (dataUser.typeUser === 'developer') {
                          setListChats(
                            allChats.filter((cht: any) => cht.companyName.toLowerCase().includes(e.target.value.toLowerCase()))
                          );
                        } else {
                          setListChats(
                            allChats.filter((cht: any) => cht.developerName.toLowerCase().includes(e.target.value.toLowerCase()))
                          );
                        }
                      }
                      setChat(e.target.value);
                    }}
                    className="break-words shadow-sm w-full bg-prot-dark border text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-300"
                    required 
                  />
                </div>
              }
              <div className="break-words flex flex-col w-full gap-2">
              {
                listChats.length > 0
                && listChats.map((allChat: any, index: number) => (
                  <button
                    key={index}
                    type="button"
                    className="break-words border border-2 border-violet-500 hover:border-white transition-colors duration-500 flex flex-col p-4 bg-black text-white "
                    onClick={() => router.push(`/chat/${allChat.id}`)}
                  >
                    <div className="break-words pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0 bg-black">
                      <MdDelete
                        className="break-words text-3xl cursor-pointer text-white absolute hover:text-violet-500 transition-colors duration-500"
                        onClick={ (e: any) => {
                          e.stopPropagation();
                          setShowDeleteChat({ show: true, chat: allChat })
                        }}
                      />
                    </div>
                    <div className="break-words w-full grid grid-cols-1 sm:grid-cols-6 sm:gap-4">
                      <div className="break-words flex items-center justify-center w-full h-full pb-5 sm:pb-0">
                        <div className="break-words w-20 h-20 rounded-full bg-violet-500">
                          <Image
                            width={1000}
                            height={1000}
                            className="break-words object-cover object-top w-full h-full rounded-full ring-2 ring-violet-500"
                            src={ dataUser.typeUser === 'company' ? allChat.developerImage : allChat.companyImage}
                            alt={ dataUser.typeUser === 'company' ? allChat.developerName : allChat.companyName }
                          />
                        </div>
                      </div>
                      <div className="break-words col-span-5 w-full flex flex-col justify-center">
                        <div className="break-words text-center sm:text-left w-full capitalize text-xl">
                          { dataUser.typeUser === 'company' ? allChat.developerName : allChat.companyName }
                        </div>
                        <div className="break-words text-center sm:text-left w-full text-violet-300">
                          {`(${ allChat.video })`}
                        </div>
                        <div className="break-words text-center sm:text-left w-full text-gray-400">
                          { limitString(allChat.chat[allChat.chat.length-1].message) }
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              }
              { 
                listChats.length === 0 &&
                <div className="break-words text-white w-full text-center sm:text-left text-2xl pt-10">
                  Nenhum chat encontrado
                </div>
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