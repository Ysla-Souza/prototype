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
import { useContext, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import contextPro from '../../../context/context';
import { demonstrateInterest, getChatByCompAndDevAndVideo } from "@/firebase/chat";
import Loading from "@/components/loading";

export default function Video({ params }: { params: { id: string} }) {
  const { id } = params;
  const context = useContext(contextPro);
  const [chatExistent, setChatExistent] = useState<any>(false);
  const { showEdit, setShowEdit, showDelete, setShowDelete } = context;
  const [showData, setShowData] = useState(false);
  const [loggedUser, setLoggedUser] = useState<any>();
  const [video, setVideo] = useState<any>(null);
  const [company, setCompany] = useState('');
  const [developer, setDeveloper] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const setUsers = async () => {
      const auth = await authenticate();
      if (auth) {
        const getById: any = await getVideoById(id);
        setVideo(getById);
        const getCompany = await getUserByEmail(auth.email);
        setCompany(getCompany);
        const getDev = await getUserByEmail(getById.user);
        setLoggedUser(getCompany);
        setDeveloper(getDev);
        const findChat = await getChatByCompAndDevAndVideo(getCompany.email, getDev.email, getById.title);
        setChatExistent(findChat);
        setShowData(true);
        setLoading(false);
      } else router.push('/');
    }
    setUsers();
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

  const interest = async () => {
    setLoading(true);
    const route = await demonstrateInterest(company, developer, video);
    router.push(route);
  };

  return(
    <div className="break-words w-full">
      <Navigation name="video" />
      {
        !showData 
        ? <div className="break-words h-screen flex items-center justify-center bg-dice w-full bg-center">
          <Loading />               
        </div>               
        : <div className="break-words w-full h-full items-center justify-center flex flex-col w-wrap py-10 px-1 sm:px-5 sm:px-32 bg-dice bg-center">
            <div className="break-words w-full bg-black p-2 sm:p-4">
              <p className="break-words text-center py-10 px-5 mb-3 font-normal text-white break-all text-xl sm:text-3xl sm:mb-10">{video.title}</p>
              {
                video !== null &&
                <div className="break-words flex flex-col">
                  <div className="break-words flex flex-col sm:flex-row w-full sm:h-96 items-center justify-center">
                    <video controls className="break-words w-11/12 sm:w-1/2">
                      <source src={video.linkVideo} type="video/mp4" />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                    <div className="break-words w-11/12 sm:w-1/2 h-60 sm:h-96">
                      { video.linkImages.length > 0 && <SwiperImages list={video.linkImages} />}
                    </div>
                  </div>
                  <div className="break-words w-full flex items-center justify-between w-full">
                    {
                      loggedUser
                      && loggedUser.email !== ''
                      && loggedUser.email
                      && loggedUser.typeUser === 'developer'
                      && loggedUser.email === video.user
                      && 
                      <div className="break-words w-full m-3 flex items-center justify-end py-3">
                        <div className="break-words p-1">
                          <FaEdit
                            className="break-words cursor-pointer text-white hover:text-violet-500 text-2xl transition-colors duration-500"
                            onClick={(e) => {
                              setShowEdit({ show: true, video: video});
                              e.stopPropagation();
                            }}
                          />
                        </div>
                        <div className="break-words p-1">
                          <MdDelete
                            className="break-words cursor-pointer text-white hover:text-violet-500 text-2xl transition-colors duration-500"
                            onClick={(e) => {
                              setShowDelete({ show: true, video: video});
                              e.stopPropagation();
                            }}
                          />
                        </div>
                      </div>
                    }
                  </div>
                  <div className="break-words px-5">
                    <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all">{ video.description }</p>
                    <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all">{ generateList('Categorias: ', video.categories) }</p>
                    <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all">{ generateList('Desenvolvido por: ', video.developers) }</p>
                    { video.publisher !== '' && <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all">Distribuidora: { video.publisher }</p> }
                    <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all">Data de Criação / Última Atualização { video.releaseDate }</p>
                    <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all">Versão do DirectX: { video.requirement.directXVersion }</p>
                    <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all">Grá/ficos: { video.requirement.graphics }</p>
                    <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all">Memória: { video.requirement.memory }</p>
                    <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all">Armazenamento: { video.requirement.storage }</p>
                    <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all">Processador: { video.requirement.processor }</p>
                    <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all capitalize">{ generateList('Sistemas Operacionais: ', video.requirement.operatingSystems) }.</p>
                    {
                      loggedUser && loggedUser.email === video.user
                      ? <div className="break-words flex flex-col justify-center gap-2 mb-5 mt-10 sm:mt-0">
                          <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all">Esta é a média das notas que os usuários deram: </p>
                          <StaticReviews video={video} />
                        </div>
                      : <div className="break-words flex flex-col justify-center gap-2 mb-5 mt-10 sm:mt-0">
                          <p className="break-words mb-3 font-normal text-white dark:text-gray-400 break-all">Qual sua nota para este projeto?</p>
                          <UpdateReview video={video} />
                        </div>
                    }
                  </div>
                </div>
              }
              <div className="break-words w-full">
                {
                  loggedUser
                  && loggedUser.email !== ''
                  && loggedUser.email
                  && loggedUser.typeUser === 'company'
                  && 
                  <div>
                    {
                      loading
                      ? <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="break-words w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                        >
                          <span className="break-words w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Carregando...
                          </span>
                        </button>
                      : chatExistent
                        ? <button
                            onClick={(e) => {
                              router.push(`/chat/${chatExistent.id}`);
                              e.stopPropagation();
                            }}
                            className="break-words w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                          >
                            <span className="break-words w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                              Ir para a conversa
                            </span>
                          </button>
                        : <button
                            onClick={(e) => {
                              interest();
                              e.stopPropagation();
                            }}
                            className="break-words w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                          >
                            <span className="break-words w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                              Estou interessado
                            </span>
                          </button>
                    }
                    </div>
                }
              </div>
            </div>
          </div>
      }
      { showDelete.show && <DeleteVideo /> }
      { showEdit.show && <EditVideo /> }
      <Footer />
    </div>
    );
  }