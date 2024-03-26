'use client'
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { getAllVideos } from "@/firebase/video";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ItemVideo from "@/components/itemVideo";
import Image from "next/image";
import { MdOutlineFilterList } from "react-icons/md";
import { categories } from "@/categories";
import { IoClose } from "react-icons/io5";
import { getUserByEmail } from "@/firebase/user";
import Footer from "@/components/footer";

export default function Home() {
  const [listCategories, setListCategories] = useState<any>(categories.sort());
  const [selectedCat, setSelectedCat] = useState<any>([]);
  const [allFilteredVideos, setAllFilteredVideos] = useState<any[]>([]);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [loggedUser, setLoggedUser] = useState<any>();
  const [showData, setShowData] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const router = useRouter();

  const getVideos = async () => {
    const allVideos = await getAllVideos();
    setAllFilteredVideos(allVideos);
    setAllVideos(allVideos);
    const uniqueCategories: string[] = [];
    allVideos.forEach((video: any) => {
      video.categories.forEach((category: any) => {
        if (!uniqueCategories.includes(category)) {
          uniqueCategories.push(category);
        }
      });
    });
    setListCategories(uniqueCategories.sort());
  };

  useEffect(() => {
    const authUser = async () => {
      const auth = await authenticate();
      if (auth) {
        setShowData(true);
        const user = await getUserByEmail(auth.email);
        setLoggedUser(user);
      }
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
              <MdOutlineFilterList
                className="text-xl mb-5 cursor-pointer"
                onClick={() => setShowFilter(!showFilter)}
              />
              {
                showFilter &&
                <div className="w-full mb-3">
                  <select
                    name="categories"
                    id="categories"
                    onChange={(e: any) => {
                      const newArray = [...selectedCat, e.target.value];
                      setSelectedCat(newArray);
                      setListCategories(listCategories.filter((listCat: string) => listCat !== e.target.value).sort());
                      setAllFilteredVideos(allFilteredVideos.filter((video: any) => video.categories.includes(e.target.value)));
                      if (newArray.length > 1) {
                        setAllFilteredVideos(allVideos.filter(video =>
                          video.categories.some((category: any) => newArray.includes(category)))
                        );
                      }
                    }}
                    value=""
                    className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    required 
                  >
                    <option disabled value="" > Selecione uma Categoria </option>
                    {
                      listCategories.length > 0 && listCategories.map((cat: any, index: number) => (
                        <option key={index} value={cat} className="capitalize"> {cat} </option>    
                      ))
                    }
                  </select>
                </div>
              }
              {
                showFilter && selectedCat.length > 0 &&
                <div className="flex gap-2 flex-wrap mb-5">
                  {
                    selectedCat.map((cat: string, index: number) => (
                      <div
                        key={index}
                        className="rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 from-purple-600 to-blue-500 text-white px-3 p-2 flex items-center gap-5"
                      >
                        { cat }
                        <IoClose
                        className="transition-colors duration-300 hover:bg-black rounded-full p-1 text-3xl cursor-pointer"
                        onClick={() => {
                          const newArray = [...listCategories, cat];
                          setListCategories(newArray.sort());
                          const removeCategory = selectedCat.filter((listCat: string) => listCat !== cat).sort();
                          setSelectedCat(removeCategory);
                          if (selectedCat.length === 1) setAllFilteredVideos(allVideos);
                          console.log(removeCategory);
                          if (removeCategory.length > 0)
                            setAllFilteredVideos(allVideos.filter(video =>
                            video.categories.some((category: any) => removeCategory.includes(category)))
                          );
                        }}
                        />
                      </div>
                    ))
                  }
                </div>
              }
              <div className={`${selectedCat.length !== 0 && allFilteredVideos.length === 0 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} grid gap-5`}>
                {
                  allFilteredVideos
                  && allFilteredVideos.length > 0
                  ? allFilteredVideos.map((itemVideo: any, index: number) => (
                    <ItemVideo
                      key={index}
                      itemVideo={itemVideo}
                      loggedUser={loggedUser}
                    />
                  ))
                  : selectedCat.length === 0
                    ? <div className="h-80vh" />
                    : <div className="h-80vh text-center w-full mt-10">{`${selectedCat.length === 1 ? 'Não existem vídeos com a categoria selecionada' : 'Não existem vídeos cadastrados que possuam alguma das categorias selecionadas.'}`}</div>
                }
              </div>
            </div>
        }
      </div>
      <Footer />
    </div>
    );
  }
