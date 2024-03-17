'use client'
import SwiperImages from "@/components/swiperImages";
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { getAllVideos } from "@/firebase/video";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiStar } from "react-icons/ci";

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

  const generateDescription = (text: string) => {
    if (text.length <= 150) {
      return text;
    } else {
      return text.substring(0, 150) + '...';
    }
  };

  const generateDevelopers = (staticText: string, list: string[]) => {
    if (!list || list.length === 0) return '';
    if (list.length === 1) return staticText + list[0];
    const lastIndex = list.length - 1;
    const formattedDevelopers = list.map((developer, index) => {
      if (index === lastIndex - 1) return `${developer} e`;
      if (index === lastIndex) return developer;
      return `${developer}, `;
    });
    return staticText + formattedDevelopers.join(' ');
  };

  return(
    <div className="w-full h-screen">
      <Navigation name="home" />
      <div className="w-full h-full items-center justify-center flex flex-col w-wrap py-10 px-10 sm:px-20 lg:px-32">
        {
            !showData 
              ? <div className="flex items-center justify-center">
                  <span className="loader p-6 space-y-4 md:space-y-6 sm:p-8" />
                </div>                
              : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ">
                  {
                    allVideos
                    && allVideos.length > 0
                    && allVideos.map((itemVideo: any, index: number) => (
                      <div key={index} className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <video controls className="w-full">
                          <source src={itemVideo.linkVideo} type="video/mp4" />
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                        { itemVideo.linkImages.length > 0 && <SwiperImages list={itemVideo.linkImages} />}
                        <div className="px-5 pb-5">
                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white pt-4">{ itemVideo.title }</h5>
                          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-words text-sm">{generateDevelopers('Categorias: ', itemVideo.categories)}.</p>
                          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">{ generateDescription(itemVideo.description) }</p>
                          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-words text-sm">{generateDevelopers('Desenvolvido por ', itemVideo.developers)}.</p>
                          <div className="flex gap-1 pb-3">
                            <CiStar />
                            <CiStar />
                            <CiStar />
                            <CiStar />
                            <CiStar />
                          </div>
                          <button
                            type="button"
                            onClick={ () => router.push(`/videos/${itemVideo.id}`) }
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Veja mais
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
        }
      </div>
    </div>
    );
  }