'use client'
import SwiperImages from "@/components/swiperImages";
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { getAllVideos } from "@/firebase/video";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ItemVideo from "@/components/itemVideo";
import Image from "next/image";
import Footer from "@/components/footer";

export default function Home() {
  const [allVideos, setAllVideos] = useState<any[]>();
  const [showData, setShowData] = useState(false);
  const router = useRouter();

  const getVideos = async () => {
    const allVideos = await getAllVideos();
    setAllVideos(allVideos);
  };

  useEffect(() => {
    const authUser = async () => {
      const auth = await authenticate();
      if (auth) setShowData(true);
      else router.push("/");
    };
    getVideos();
    authUser();
  }, []);

  return(
    <div className={`w-full ${showData ? 'min-h-screen' : 'h-80vh'}`}>
      <Navigation name="home" />
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
          : <div className="w-full">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-center sm:text-left mt-3 mb-5 text-2xl">Vídeos</h2>
                <button
                  onClick={() => router.push('/register/media') }
                  className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    Carregar Vídeo
                  </span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ">
                {
                  allVideos
                  && allVideos.length > 0
                  ? allVideos.map((itemVideo: any, index: number) => (
                    <ItemVideo
                      key={index}
                      itemVideo={itemVideo}
                    />
                  ))
                  : <div className="h-80vh" />
                }
              </div>
            </div>
        }
      </div>
      <Footer />
    </div>
    );
  }