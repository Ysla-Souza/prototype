import { CiStar } from "react-icons/ci";
import { useRouter } from "next/navigation";

export default function ItemVideo(props: any) {
  const { itemVideo } = props;
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
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
        {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">{ generateDescription(itemVideo.description) }</p> */}
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-words text-sm">{generateListItems('Desenvolvido por ', itemVideo.developers)}.</p>
        <div className="flex gap-1 pb-3">
          <CiStar />
          <CiStar />
          <CiStar />
          <CiStar />
          <CiStar />
        </div>
      </button>
    </div>
  );
}