'use client'
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import ItemVideo from "@/components/itemVideo";
import Image from "next/image";
import { MdOutlineFilterList } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { getUserByEmail } from "@/firebase/user";
import Footer from "@/components/footer";
import RegisterVideo from "@/components/registerVideo";
import contextPro from '../../context/context';
import Loading from "@/components/loading";

export default function Home() {
  const context = useContext(contextPro);
  const {
    allVideos,
    getVideos,
    allFilteredVideos, setAllFilteredVideos,
    listCategories, setListCategories,
    showRegister, setShowRegister,
  } = context;
  const [selectedCat, setSelectedCat] = useState<any>([]);
  const [loggedUser, setLoggedUser] = useState<any>();
  const [showData, setShowData] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const router = useRouter();

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
      <div className="w-full h-35vh relative bg-dice bg-cover" />
      <div className="w-full h-full items-center justify-center flex w-wrap pb-10 py-5 px-5 sm:px-20 lg:px-28 bg-black">
        {
          !showData 
          ? <Loading />                
          : <div className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-center w-full">
                <h2 className="text-center text-violet-400 sm:text-left mt-3 text-2xl">Bem vindo!</h2>
                {
                  loggedUser
                  && loggedUser.typeUser === 'developer' &&
                  <button
                    onClick={() => setShowRegister(true) }
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 text-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Carregar Vídeo
                    </span>
                  </button>
                }
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
                    className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
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
              <div className={`${selectedCat.length !== 0 && allFilteredVideos.length === 0 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-1'} grid gap-5`}>
                {
                  allFilteredVideos.length > 0
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
      {
        showRegister &&
        <RegisterVideo />
      }
      <Footer />
    </div>
    );
  }