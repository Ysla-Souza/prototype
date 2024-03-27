'use client'
import Footer from "@/components/footer";
import DeleteVideo from "@/components/deleteVideo";
import EditVideo from "@/components/editVideo";
import Navigation from "@/components/navigation";
import StaticReviews from "@/components/staticReviews";
import SwiperImages from "@/components/swiperImages";
import UpdateReview from "@/components/updateReview";
import { authenticate } from "@/firebase/authenticate";
import { getUserByEmail } from "@/firebase/user";
import { getVideoById } from "@/firebase/video";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function Video({ params }: { params: { id: string} }) {
  const { id } = params;
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showData, setShowData] = useState(false);
  const [loggedUser, setLoggedUser] = useState<any>();
  const [video, setVideo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const authUser = async () => {
      const auth = await authenticate();
      if (auth) {
        const getById = await getVideoById(id);
        setVideo(getById);
        setShowData(true);
        const user = await getUserByEmail(auth.email);
        setLoggedUser(user);
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
          ? <div className="flex items-center justify-center h-screen">
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
                  <div className="w-full flex items-center justify-between">
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">{video.title}</p>
                    {
                      loggedUser
                      && loggedUser.email !== ''
                      && loggedUser.email
                      && loggedUser.typeUser === 'developer'
                      && loggedUser.email === video.user
                      && 
                      <div className="m-3 flex items-center">
                        <div className="p-1">
                          <FaEdit
                            className="cursor-pointer"
                            onClick={(e) => {
                              setShowEdit(true);
                              e.stopPropagation();
                            }}
                          />
                        </div>
                        <div className="p-1">
                          <MdDelete
                            className="cursor-pointer text-lg"
                            onClick={(e) => {
                              setShowDelete(true);
                              e.stopPropagation();
                            }}
                          />
                        </div>
                      </div>
                    }
                  </div>
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
                  {
                    loggedUser && loggedUser.email === video.user
                    ? <div className="flex flex-col justify-center gap-2 mb-5">
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">Esta é a média das notas que os usuários deram: </p>
                        <StaticReviews video={video} />
                      </div>
                    : <div className="flex flex-col justify-center gap-2 mb-5">
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">Qual sua nota para este projeto?</p>
                        <UpdateReview video={video} />
                      </div>
                  }
                </div>
              }
              <div className="w-full">
                {
                  loggedUser
                  && loggedUser.email !== ''
                  && loggedUser.email
                  && loggedUser.typeUser === 'company'
                  && 
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                  >
                    <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Estou interessado
                    </span>
                  </button>
                }
              </div>
            </div>
        }
      </div>
      {
        showDelete &&
        <DeleteVideo
          itemVideo={video}
          setShowDelete={setShowDelete}
        />
      }
      {
        showEdit &&
        <EditVideo
          itemVideo={video}
          setShowEdit={setShowEdit}
        />
      }
      <Footer />
    </div>
    );
  }
