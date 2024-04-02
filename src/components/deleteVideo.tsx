'use client'
import { deleteVideoById } from "@/firebase/video";
import { useRouter } from "next/navigation";
import { IoIosCloseCircleOutline } from "react-icons/io";
import contextProv from '../context/context';
import { useContext, useState } from "react";
import Image from "next/image";

export default function DeleteVideo() {
  const router: any = useRouter();
  const context = useContext(contextProv);
  const [loading, setLoading] = useState(false);
  const { getVideos, showDelete, setShowDelete } = context;

  const deleteVideoFromFirebase = async () => {
    setLoading(true);
    await deleteVideoById(showDelete.video.id);
    getVideos();
    setLoading(false);
    router.push('/home');
    setShowDelete({ show: false, video: {} });
  };

  return(
    <div
      className="break-words text-white z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-background bg-black/80 px-3 sm:px-0"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="break-words bg-black w-full sm:w-2/3 md:w-1/3 overflow-y-auto">
        <div className="break-words flex flex-col justify-center items-center relative border-violet-500 border-2 p-4">
          <div className="break-words ">
            <div className="break-words pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
              <IoIosCloseCircleOutline
                className="break-words text-4xl text-white cursor-pointer hover:text-violet-500 transition-colors duration-500"
                onClick={ () => setShowDelete({ show: false, video: {} })}
              />
            </div>
            <div className="break-words pb-5 px-5 w-full">
              <div className="break-words flex items-center justify-center w-full my-2">
                <Image
                  src="/faceInvader.png"
                  className="break-words w-14 h-14 object-cover cursor-pointer"
                  width={2000}
                  height={2000}
                  alt="Face invader"
                  onClick={ () => router.push('/home') }
                />
              </div>
              <label htmlFor="palavra-passe" className="break-words flex flex-col items-center w-full">
                <p className="break-words text-white w-full text-center pb-3 pt-5">
                  Tem certeza que quer excluir permanentemente o Vídeo selecionado?
                </p>
              </label>
              { !loading
                ? <div className="break-words flex w-full gap-2">
                  <button
                    type="button"
                    onClick={ () => setShowDelete({ show: false, video: {} })}
                    className="break-words text-white hover:text-green-500 transition-colors cursor-pointer border-2 border-green-500 w-full p-2 mt-6 font-bold"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={ deleteVideoFromFirebase }
                    className="break-words text-white hover:text-red-500 transition-colors cursor-pointer border-2 border-red-500 w-full p-2 mt-6 font-bold"
                  >
                    Excluir
                  </button>
                </div>
                : <div className="break-words text-white bg-blue-mjg transition-colors w-full text-center p-2 mt-6 font-bold">Excluindo, por favor Aguarde...</div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
