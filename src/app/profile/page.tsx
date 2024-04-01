'use client'
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { authenticate } from "@/firebase/authenticate";
import { getUserByEmail } from "@/firebase/user";
import { getVideosByEmail } from "@/firebase/video";
import { MdVideocam } from "react-icons/md";
import EditProfile from "@/components/editProfile";
import Footer from "@/components/Footer";
import ItemVideo from "@/components/itemVideo";
import Loading from "@/components/loading";
import Navigation from "@/components/navigation";
import Image from "next/image";
import Link from "next/link";
import contextProv from '../../context/context';
import RegisterVideo from "@/components/registerVideo";

export default function Profile() {
  const context = useContext(contextProv);
  const { showRegister, setShowRegister } = context;
  const [userData, setUserData] = useState<any>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    imageURL: '',
    description: '',
    skills: [],
    typeUser: '',
  });
  const [listVideos, setListVideos] = useState([]);
  const [showData, setShowData] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authUser = async () => {
      const auth: any = await authenticate();
      if (auth) {
        const getUser = await getUserByEmail(auth.email);
        const getVideos = await getVideosByEmail(auth.email);
        setUserData(getUser);
        setListVideos(getVideos);
        setShowData(true);
      }
      else router.push("/");
    };
    authUser();
  }, []);

  const generateList = (list: string[]) => {
    if (!list || list.length === 0) return '';
    if (list.length === 1) return list[0];
    const lastIndex = list.length - 1;
    const formattedDevelopers = list.map((developer, index) => {
      if (index === lastIndex - 1) return `${developer}`;
      if (index === lastIndex) return developer;
      return `${developer}`;
    });
    return formattedDevelopers.join(' - ');
  };

  return(
    <div className="w-full min-h-screen bg-black">
      <Navigation name="profile" />
      <div className="w-full h-full items-center justify-start flex flex-col pb-10 min-h-screen">
        {
            !showData 
              ? <div className="h-80vh flex items-center justify-center">
                  <Loading />               
                </div>
              : <div className="w-full flex items-start h-full">
                  {
                    userData &&
                    <div className="w-full h-full">
                      <div
                        className="w-full text-white">
                        <div className="h-35vh bg-dice bg-cover" />
                        <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-violet-500 rounded-full overflow-hidden bg-black flex items-center justify-center">
                          {
                            userData.imageURL
                            && <Image
                              width={1000}
                              height={1000}
                              className="object-cover object-top w-full"
                              src={userData.imageURL}
                              alt={userData.firstName}
                            />
                          }
                        </div>
                        <div className="w-full flex flex-col items-center justify-center mb-5">
                          <div className="text-center mt-2 w-4/5 sm:w-1/3">
                            {
                              userData.typeUser === 'developer'
                              ? <h2 className="font-semibold capitalize">{userData.firstName} {userData.lastName}</h2>
                              : <h2 className="font-semibold capitalize">{userData.company}</h2>
                            }
                            {
                              userData.typeUser === 'developer'
                              && <p className="text-violet-400">{
                                userData.skills === '' || !userData.skills
                                ? 'Ainda sem Habilidades'
                                : generateList(userData.skills)
                                }</p>
                            }
                            {
                              userData.typeUser === 'company'
                              && <p className="text-violet-400">{
                                userData.categories === '' || !userData.categories
                                ? 'Ainda sem ramo de Atuação'
                                : generateList(userData.categories)
                                }</p>
                            }
                          </div>
                          <div className="text-center mt-5 w-full w-4/5 sm:w-2/3">
                            <h2 className="font-semibold">{
                              userData.description === '' || !userData.description
                              ? 'Ainda sem Bio'
                              : userData.description
                            }</h2>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-center">
                          <button
                            onClick={() => setShowEditProfile(true) }
                            className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                          >
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 text-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                              Editar Perfil
                            </span>
                          </button>
                        </div>
                        {
                          userData.typeUser === 'developer' &&
                          <ul className="pb-4 mt-2 text-gray-700 flex items-center justify-around">
                            <li className="flex flex-col items-center justify-around">
                              <MdVideocam className="text-violet-500 text-xl" />
                              <div className="text-white">{ listVideos.length }</div>
                            </li>
                          </ul>
                        }
                      </div>
                      {
                        userData.typeUser === 'developer' &&
                        <div>
                          {
                            listVideos.length > 0
                            ? <div className="grid grid-cols-1 gap-5 cursor-pointer px-5">
                                <button
                                  onClick={ () => setShowRegister(true) }
                                  className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                                >
                                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 text-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    Carregar Vídeo
                                  </span>
                                </button>
                                {
                                  listVideos.map((itemVideo: any, index: number) => (
                                    <ItemVideo
                                      key={index}
                                      itemVideo={itemVideo}
                                      loggedUser={userData}
                                    />
                                  ))
                                }
                              </div>
                            : <div className="w-full text-center">Nenhum video cadastrado. Que tal adicionar um vídeo ao seu perfil clicando <Link href="/home" className="underline">aqui</Link>? </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
        }
      </div>
      {
        showEditProfile &&
        <EditProfile
          setShowEditProfile={setShowEditProfile}
          userData={userData}
          setUserData={setUserData}
        />
      }
      { showRegister && <RegisterVideo /> }
      <Footer />
    </div>
    );
  }