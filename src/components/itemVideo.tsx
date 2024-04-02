import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import EditVideo from "./editVideo";
import DeleteVideo from "./deleteVideo";
import StaticReviews from "./staticReviews";
import { authenticate } from "@/firebase/authenticate";
import { getUserByEmail } from "@/firebase/user";
import { demonstrateInterest, getChatByCompAndDevAndVideo } from "@/firebase/chat";
import contextPro from '../context/context';
import Link from "next/link";

export default function ItemVideo(props: any) {
  const context = useContext(contextPro);
  const { showEdit, setShowEdit, showDelete, setShowDelete } = context;
  const { itemVideo } = props;
  const [company, setCompany] = useState<any>('');
  const [developer, setDeveloper] = useState<any>('');
  const [chatExistent, setChatExistent] = useState<any>(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const setUsers = async () => {
      const auth = await authenticate();
      if (auth) {
        const getCompany = await getUserByEmail(auth.email);
        setCompany(getCompany);
        const getDev = await getUserByEmail(itemVideo.user);
        setDeveloper(getDev);
        const findChat = await getChatByCompAndDevAndVideo(getCompany.email, getDev.email, itemVideo.title);
        setChatExistent(findChat);
        setLoading(false);
      } else router.push('/');
    }
    setUsers();
  }, []);

  const generateListItems = (staticText: string, list: string[]) => {
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
    const route = await demonstrateInterest(company, developer, itemVideo);
    router.push(route);
  };

  return (
    <div className="break-words w-full bg-black border border-violet-400 relative flex flex-col sm:flex-row items-center p-3">
      <div className="break-words w-full sm:w-72 h-40">
        <video controls className="break-words w-full h-full object-contain">
          <source src={itemVideo.linkVideo} type="video/mp4" className="break-words h-full" />
            Seu navegador não suporta o elemento de vídeo.
        </video>
      </div>
      <button
        type="button"
        onClick={ () => router.push(`/videos/${itemVideo.id}`) } 
        className="break-words px-5 pb-1 text-left w-full"
      >
        <h5 className="break-words mb-2 text-violet-400 text-lg font-bold tracking-tight text-gray-900 dark:text-white break-words">{ itemVideo.title }</h5>
        <p className="break-words font-normal text-violet-400 dark:text-gray-400 break-words text-sm break-words">{generateListItems('Categorias: ', itemVideo.categories)}.</p>
        <p className="break-words font-normal text-violet-400 dark:text-gray-400 break-words text-sm break-words">{generateListItems('Desenvolvido por: ', itemVideo.developers)}.</p>
        <p className="break-words mb-3 font-normal text-violet-400 dark:text-gray-400 break-words text-sm ">
          <span className="break-words pr-1">Publicado por:</span>
          <button
            onClick={ (e: any) => {
              e.stopPropagation();
              router.push(`/developers/${developer.id}`);
            }}
            className="break-words underline capitalize break-words"
          >
            {developer.firstName} {developer.lastName}
          </button>
        </p>
        <StaticReviews video={itemVideo} />
        {
          props.loggedUser
          && props.loggedUser.email !== ''
          && props.loggedUser.email
          && props.loggedUser.typeUser === 'developer'
          && props.loggedUser.email === itemVideo.user
          && 
          <div className="break-words absolute bottom-0 right-0 m-3 flex items-center">
            <div className="break-words p-1">
              <FaEdit
                className="break-words cursor-pointer text-violet-400 text-xl"
                onClick={(e) => {
                  setShowEdit({ show: true, video: itemVideo});
                  e.stopPropagation();
                }}
              />
            </div>
            <div className="break-words p-1">
              <MdDelete
                className="break-words cursor-pointer text-lg text-violet-400 text-xl"
                onClick={(e) => {
                  setShowDelete({ show: true, video: itemVideo});
                  e.stopPropagation();
                }}
              />
            </div>
          </div>
        }
        <div className="break-words w-full">
          {
            props.loggedUser
            && props.loggedUser.email !== ''
            && props.loggedUser.email
            && props.loggedUser.typeUser === 'company'
            && 
            <div>
              {
                loading
                ? <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="break-words relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
                  >
                    <span className="break-words relative px-5 py-2.5 transition-all ease-in duration-75 text-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Carregando...
                    </span>
                  </button>
                : chatExistent
                  ? <button
                      onClick={(e) => {
                        router.push(`/chat/${chatExistent.id}`);
                        e.stopPropagation();
                      }}
                      className="break-words relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                      <span className="break-words relative px-5 py-2.5 transition-all ease-in duration-75 text-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Ir para a conversa
                      </span>
                    </button>
                  : <button
                      onClick={(e) => {
                        interest();
                        e.stopPropagation();
                      }}
                      className="break-words relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                    >
                      <span className="break-words relative px-5 py-2.5 transition-all ease-in duration-75 text-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Estou interessado
                      </span>
                    </button>
              }
            </div>
          }
        </div>
      </button>
      { showDelete.show && <DeleteVideo /> }
      { showEdit.show && <EditVideo /> }
    </div>
  );
}