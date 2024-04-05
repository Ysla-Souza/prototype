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
    <div className={`w-full ${showData ? 'min-h-screen' : 'h-screen'}`}>
      <Navigation name="home" />
        {
          !showData 
          ? <div className="break-words h-screen flex items-center justify-center bg-dice w-full bg-center">
              <Loading />               
            </div>       
          : <div className=" flex items-center flex-col justify-start"> 
              <div className="break-words w-full h-35vh relative bg-dice bg-cover" />
              <div className="break-words w-full h-full items-starts justify-center flex w-wrap pb-10 py-5 px-5 bg-black">
                <div className="break-words w-full">
                  <div className="break-words flex flex-col sm:flex-row justify-between items-center w-full mb-5">
                    <h2 className="break-words pb-5 sm:pb-0 text-center text-white sm:text-left mt-3 text-2xl">Bem vindo!</h2>
                    {
                      loggedUser
                      && loggedUser.typeUser === 'developer' &&
                      <button
                        onClick={() => setShowRegister(true) }
                        className="break-words w-full sm:w-48 relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                      >
                        <span className="break-words relative px-5 py-2.5 transition-all ease-in duration-75 text-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                          Carregar Vídeo
                        </span>
                      </button>
                    }
                  </div>
                  <MdOutlineFilterList
                    className="break-words text-xl mb-5 cursor-pointer text-white "
                    onClick={() => setShowFilter(!showFilter)}
                  />
                  {
                    showFilter &&
                    <div className="break-words w-full mb-3">
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
                        className="break-words text-white w-full bg-prot-dark text-gray-900 text-sm rounded-lg block w-full p-2.5 appearance-none"
                        required 
                      >
                        <option disabled className="break-words bg-gray-300" value=""> Selecione uma Categoria </option>
                        {
                          listCategories.length > 0 && listCategories.map((cat: any, index: number) => (
                            <option
                              key={index}
                              value={cat}
                              className="break-words capitalize py-2 px-4"
                            >
                              {cat}
                            </option>    
                          ))
                        }
                      </select>
                    </div>
                  }
                  {
                    selectedCat.length > 0 &&
                    <div className="break-words flex gap-2 flex-wrap mb-5">
                      {
                        selectedCat.map((cat: string, index: number) => (
                          <div
                            key={index}
                            className="break-words rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 from-purple-600 to-blue-500 text-white px-3 p-2 flex items-center gap-5"
                          >
                            { cat }
                            <IoClose
                            className="break-words transition-colors duration-300 hover:bg-black  rounded-full p-1 text-3xl cursor-pointer"
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
                        ? <div className="break-words h-80vh" />
                        : <div className="break-words h-80vh text-center w-full mt-10">{`${selectedCat.length === 1 ? 'Não existem vídeos com a categoria selecionada' : 'Não existem vídeos cadastrados que possuam alguma das categorias selecionadas.'}`}</div>
                    }
                  </div>
                </div>
              </div>
            </div>
        }
      {
        showRegister &&
        <RegisterVideo />
      }
      <Footer />
    </div>
    );
  }