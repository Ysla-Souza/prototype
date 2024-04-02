'use client'
import { useEffect, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, documentId, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { authenticate } from '@/firebase/authenticate';
import { IoIosSend } from 'react-icons/io';
import Navigation from '@/components/navigation';
import { getHoraOficialBrasil, sendMessage } from '@/firebase/chat';
import { getUserByEmail } from '@/firebase/user';
import Loading from '@/components/loading';

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyDugptWWK6AM3Dkc9zSt5ZcJAGOyTjSx7w",
  authDomain: "uploadreact-85d68.firebaseapp.com",
  projectId: "uploadreact-85d68",
  storageBucket: "uploadreact-85d68.appspot.com",
  messagingSenderId: "642741037500",
  appId: "1:642741037500:web:8b7659add544af2e28a3b9",
  measurementId: "G-X4S0NFGFK4",
});

export default function SessionId({ params } : { params: { id: string } }) {
  const [text, setText] = useState('');
  const [dataChat, setDataChat] = useState<any>('');
  const [userName, setUserName] = useState<any>({});
  const db = getFirestore(firebaseConfig);
  const sessionRef = collection(db, "chats");
  const querySession = query(sessionRef, where(documentId(), "==", params.id));
  const [session] = useCollectionData(querySession, { idField: "id" } as any);
  const [showData, setShowData] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    setShowData(false);
    verifyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyUser = async () => {
    const authData = await authenticate();
    if (authData) {
      const userSearch = await getUserByEmail(authData.email);
      if(userSearch.company) {
        setUserName(userSearch.company.toLowerCase());
      } else {
        setUserName(`${userSearch.firstName.toLowerCase()} ${userSearch.lastName.toLowerCase()}`);
      }
      const sessionDocSnapshot = await getDocs(querySession);
      if (sessionDocSnapshot.empty) {
        router.push('/chats');
        window.alert('A Conversa não foi encontrada');
      } else {
        const sessionData = sessionDocSnapshot.docs[0].data();
        setDataChat(sessionData);
        setShowData(true);
      }
    } else router.push('/');
  };
  
  useLayoutEffect(() => {
    const messagesContainer: HTMLElement | null = document.getElementById('messages-container');
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };  

  const messageForm = (index: number, msg: any, color: string) => {
    if (msg.type === 'general') {
      return(
        <div key={index} className="break-words my-3 w-full flex justify-center text-gray-400">
          <div className="break-words bg-black text-sm text-center rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-2 mb-2 flex flex-col">
            <span>{ msg.message }</span>
            <span>{ msg.date && msg.date }</span>
          </div>
        </div>
      )
    }
    return(
      <div key={index} className={`w-full flex ${color === 'current' ? 'justify-end' : 'justify-start'} text-white`}>
        <div className={`${color === 'current' ? 'bg-prot-light': 'bg-prot-dark'} rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-3 mb-3`}>
          {
            color === 'gray' &&
            <div className="break-words pb-2 capitalize font-bold">
              { msg.user }
            </div>
          }
          <div>
            { msg.message }
          </div>
          <div className="break-words flex justify-end pt-2">
            <span className="break-words w-full text-right text-sm flex justify-end">
              { msg.date && msg.date }
            </span>
          </div>
        </div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (text !== '' && text !== ' ') {
      const date = await getHoraOficialBrasil();
      sendMessage(params.id, {
        message: text,
        type: 'user',
        date,
        user: userName,
      });
      setText('');
    }
    scrollToBottom();
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const buttonSend = document.getElementById('sendMessage');
      if (buttonSend) buttonSend.click();
    }
  };

  return (
    <div className="break-words h-screen overflow-y-auto bg-dice bg-cover bg-top">
      <Navigation name="chat" />
      {
        showData
        ? <div className="break-words flex h-full pt-14 bg-black/90">
            <div className="break-words flex flex-col h-full w-full relative">
              <div id="messages-container" className={`relative h-screen overflow-y-auto pt-2 px-2`}>
                {
                  session && session.length > 0 && session[0].chat && session[0].chat.length >= 0
                  ? session[0] && session[0].chat.map((msg: any, index: number) => {
                    if (userName !== '' && userName === msg.user.toLowerCase()) {
                      return messageForm(index, msg, 'current');
                    } return messageForm(index, msg, 'other');
                  })
                  : <div className="break-words bg-black/60 text-white h-90vh flex items-center justify-center flex-col">
                      <span className="break-words loader z-50" />
                    </div>
                }
              </div>
              <div className="break-words w-full bg-black p-2 flex flex-col gap-2 justify-center items-center min-h-10vh">
                <div className="break-words flex w-full items-end relative">
                  <div className="break-words border border-violet-500 w-full">
                    <input
                      type="text"
                      className="break-words h-full w-full text-white bg-black p-2 outline-none mb-0"
                      value={text}
                      onChange={(e: any) => {
                        const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                        setText(sanitizedValue);
                      }}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <div className="break-words pl-2 gap-2 flex h-full">
                    <div className="break-words text-xl border border-white flex justify-center hover:bg-prot-dark transition-colors text-white">
                      <button
                        className="break-words p-2"
                        id="sendMessage"
                        onClick={ handleSendMessage }
                      >
                        <IoIosSend />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        : <div className="break-words bg-black/80 text-white h-screen flex items-center justify-center flex-col">
            <Loading />
          </div>
      }
    </div>
  );
}