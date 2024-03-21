'use client'
import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import SwiperImages from "@/components/swiperImages";
import { authenticate } from "@/firebase/authenticate";
import { getVideoById } from "@/firebase/video";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiStar } from "react-icons/ci";

export default function Video({ params }: { params: { id: string} }) {
  const { id } = params;
  const [showData, setShowData] = useState(false);
  const [video, setVideo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const authUser = async () => {
      const auth = await authenticate();
      if (auth) {
        const getById = await getVideoById(id);
        setVideo(getById);
        setShowData(true);
      } else router.push("/");
    };
    authUser();
  }, []);

  const generateList = (staticText: string, list: string[]) => {
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
    <div className="w-full">
      <Navigation name="video" />
      <div className="w-full h-full items-center justify-center flex flex-col w-wrap py-10 px-5 sm:px-32">
        {
            !showData 
              ? <div className="flex items-center justify-center">
                  <span className="loader p-6 space-y-4 md:space-y-6 sm:p-8" />
                </div>                
              : <div className="w-full">
                  {
                    video !== null &&
                    <div>
                      <video controls className="w-full">
                        <source src={video.linkVideo} type="video/mp4" />
                        Seu navegador não suporta o elemento de vídeo.
                      </video>
                      <div className="w-full">
                        { video.linkImages.length > 0 && <SwiperImages list={video.linkImages} />}
                      </div>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">{video.title}</p>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">{ video.description }</p>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">{ generateList('Categorias: ', video.categories) }</p>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">{ generateList('Desenvolvido por: ', video.developers) }</p>
                      { video.publisher !== '' && <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">Distribuidora: { video.publisher }</p> }
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">Data de Criação / Última Atualização { video.releaseDate }</p>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">Versão do DirectX: { video.requirement.directXVersion }</p>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">Grá/ficos: { video.requirement.graphics }</p>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">Memória: { video.requirement.memory }</p>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">Armazenamento: { video.requirement.storage }</p>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">Processador: { video.requirement.processor }</p>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all capitalize">{ generateList('Sistemas Operacionais: ', video.requirement.operatingSystems) }.</p>
                      <div className="flex items-center gap-2">
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">Reviews: { video.reviews }</p>
                        <div className="flex gap-1 pb-3">
                          <CiStar />
                          <CiStar />
                          <CiStar />
                          <CiStar />
                          <CiStar />
                        </div>
                      </div>
                    </div>
                  }
                </div>
        }
      </div>
      <Footer />
    </div>
    );
  }