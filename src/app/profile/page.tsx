'use client'
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { authenticate } from "@/firebase/authenticate";
import { getUserByEmail } from "@/firebase/user";
import { getVideosByEmail } from "@/firebase/video";
import { MdVideocam } from "react-icons/md";
import EditProfile from "@/components/editProfile";
import Footer from "@/components/footer";
import ItemVideo from "@/components/itemVideo";
import Loading from "@/components/loading";
import Navigation from "@/components/navigation";
import Image from "next/image";
import Link from "next/link";
import contextProv from '../../context/context';
import RegisterVideo from "@/components/registerVideo";
import ChangePassword from "@/components/changePassword";

export default function Profile() {
  const context = useContext(contextProv);
  const { showRegister, setShowRegister, setShowChangePassword, showChangePassword } = context;
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
    <div className="break-words w-full min-h-screen bg-black">
      <Navigation name="profile" />
      <div className="break-words w-full h-full items-center justify-start flex flex-col pb-10 min-h-screen">
        {
            !showData 
              ? <div className="break-words h-screen flex items-center justify-center bg-dice w-full bg-center">
                  <Loading />               
                </div>
              : <div className="break-words w-full flex items-start h-full">
                  {
                    userData &&
                    <div className="break-words w-full h-full">
                      <div className="break-words w-full text-white">
                        <div className="break-words h-35vh bg-dice bg-cover" />
                        <div className="break-words mx-auto w-32 h-32 relative -mt-16 border-4 border-violet-500 rounded-full overflow-hidden bg-black flex items-center justify-center">
                          {
                            userData.imageURL
                            && <Image
                              width={1000}
                              height={1000}
                              className="break-words object-cover w-full h-full"
                              src={userData.imageURL}
                              alt={userData.typeUser === 'developer' ? userData.firstName : userData.company}
                            />
                          }
                        </div>
                        <div className="break-words w-full flex flex-col items-center justify-center mb-5">
                          <div className="break-words text-center mt-2 w-4/5 sm:w-1/3">
                            {
                              userData.typeUser === 'developer'
                              ? <h2 className="break-words font-semibold capitalize">{userData.firstName} {userData.lastName}</h2>
                              : <h2 className="break-words font-semibold capitalize">{userData.company}</h2>
                            }
                            {
                              <p className="break-words text-violet-400">{
                                userData.skills === '' || !userData.skills
                                ? <span>{ userData.typeUser === 'developer' ? 'Ainda sem Habilidades' : 'Ainda sem ramo de Atuação' }</span>
                                : generateList(userData.skills)
                                }</p>
                            }
                          </div>
                          <div className="break-words text-center mt-5 w-full w-4/5 sm:w-2/3 px-5">
                            <h2 className="break-words font-semibold break-words">{
                              userData.description === '' || !userData.description
                              ? 'Ainda sem Bio'
                              : userData.description
                            }</h2>
                          </div>
                        </div>
                        <div className="break-words mt-2 flex items-center justify-center gap-2">
                          <button
                            onClick={() => setShowEditProfile(true) }
                            className="break-words relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                          >
                            <span className="break-words relative px-5 py-2.5 transition-all ease-in duration-75 text-white rounded-md group-hover:bg-opacity-0">
                              Editar Perfil
                            </span>
                          </button>
                          <button
                            onClick={
                              () => setShowChangePassword({ show: true, user: userData })
                            }
                            className="break-words relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                          >
                            <span className="break-words relative px-5 py-2.5 transition-all ease-in duration-75 text-white rounded-md group-hover:bg-opacity-0">
                              Alterar Senha
                            </span>
                          </button>
                        </div>
                        {
                          userData.typeUser === 'developer' &&
                          <ul className="break-words pb-4 mt-2 text-gray-700 flex items-center justify-around">
                            <li className="break-words flex flex-col items-center justify-around">
                              <MdVideocam className="break-words text-violet-500 text-xl" />
                              <div className="break-words text-white">{ listVideos.length }</div>
                            </li>
                          </ul>
                        }
                      </div>
                      {
                        userData.typeUser === 'developer' &&
                        <div>
                          {
                            listVideos.length > 0
                            ? <div className="break-words grid grid-cols-1 gap-5 cursor-pointer px-5">
                                <button
                                  onClick={ () => setShowRegister(true) }
                                  className="break-words relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                                >
                                  <span className="break-words relative px-5 py-2.5 transition-all ease-in duration-75 text-white rounded-md group-hover:bg-opacity-0">
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
                            : <div className="break-words w-full text-center">Nenhum video cadastrado. Que tal adicionar um vídeo ao seu perfil clicando <Link href="/home" className="break-words underline">aqui</Link>? </div>
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
      { showChangePassword.show && <ChangePassword /> }
      <Footer />
    </div>
    );
  }