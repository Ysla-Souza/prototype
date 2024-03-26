import { CiStar } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DeleteVideo from "./deleteVideo";
import { useState } from "react";

export default function ItemVideo(props: any) {
  const { itemVideo } = props;
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();

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


  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
      <video controls className="w-full h-52">
        <source src={itemVideo.linkVideo} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
      <button
        type="button"
        onClick={ () => router.push(`/videos/${itemVideo.id}`) } 
        className="px-5 pb-1 text-left"
      >
        <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white pt-4">{ itemVideo.title }</h5>
        <p className="font-normal text-gray-700 dark:text-gray-400 break-words text-sm">{generateListItems('Categorias: ', itemVideo.categories)}.</p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-words text-sm">{generateListItems('Desenvolvido por ', itemVideo.developers)}.</p>
        <div className="flex gap-1 pb-3">
          <CiStar />
          <CiStar />
          <CiStar />
          <CiStar />
          <CiStar />
        </div>
        {
          props.loggedUser
          && props.loggedUser.email !== ''
          && props.loggedUser.email
          && props.loggedUser.typeUser === 'developer'
          && props.loggedUser.email === itemVideo.user
          && 
          <div className="absolute bottom-0 right-0 m-3 flex items-center">
            <div className="p-1">
              <FaEdit
                className="cursor-pointer"
                onClick={(e) => {
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
        <div className="w-full">
          {
            props.loggedUser
            && props.loggedUser.email !== ''
            && props.loggedUser.email
            && props.loggedUser.typeUser === 'company'
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
      </button>
      {
        showDelete &&
        <DeleteVideo
          itemVideo={itemVideo}
          setShowDelete={setShowDelete}
        />
      }
    </div>
  );
}
