'use client'
import EditProfile from "@/components/editProfile";
import Footer from "@/components/Footer";
import ItemVideo from "@/components/itemVideo";
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { getUserByEmail, getUserById } from "@/firebase/user";
import { getVideosByEmail } from "@/firebase/video";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdVideocam } from "react-icons/md";

export default function Developer({ params }: { params: { id: string} }) {
  const { id } = params;
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
  const [loggedUser, setLoggedUser] = useState<any>();
  const [listVideos, setListVideos] = useState([]);
  const [showData, setShowData] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authUser = async () => {
      const auth: any = await authenticate();
      if (auth) {
        const getUser = await getUserById(id);
        if (getUser) {
          const getVideos = await getVideosByEmail(getUser.email);
          const user = await getUserByEmail(auth.email);
          setLoggedUser(user);
          setUserData(getUser);
          setListVideos(getVideos);
          setShowData(true);
        }
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
    <div className="w-full min-h-screen">
      <Navigation name="developers" />
      <div className="w-full h-full items-center justify-start flex flex-col w-wrap pb-10 min-h-screen">
        {
            !showData 
              ? <div className="flex items-center justify-center min-h-screen">
                  <span className="loader p-6 space-y-4 md:space-y-6 sm:p-8" />
                </div>                
              : <div className="w-full flex items-start h-full">
                  {
                    userData &&
                    <div className="w-full h-full">
                      <div
                        className="w-full text-gray-900">
                        <div className="h-32 overflow-hidden bg-gray-500" />
                        <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden bg-black flex items-center justify-center">
                          {
                            userData.imageURL !== undefined && userData.imageURL !== ''
                            ? <Image
                              width={1000}
                              height={1000}
                              className="object-cover object-top w-full"
                              src={userData.imageURL}
                              alt={userData.firstName}
                            />
                            : <p className="text-white text-4xl">
                                {userData.firstName[0]}
                              </p>
                          }
                        </div>
                        <div className="w-full flex flex-col items-center justify-center mb-5">
                          <div className="text-center mt-2 w-4/5 sm:w-1/3">
                            <h2 className="font-semibold">
                              {userData.firstName} {userData.lastName}
                            </h2>
                            {
                              userData.typeUser === 'developer'
                              && <p className="text-gray-500">
                                {
                                  userData.skills !== ''
                                  && userData.skills
                                  && generateList(userData.skills)
                                }
                              </p>
                            }
                          </div>
                          <div className="text-center mt-5 w-full w-4/5 sm:w-2/3">
                            <h2 className="font-semibold">
                              { userData.description }
                            </h2>
                          </div>
                        </div>
                        {
                          userData.typeUser === 'developer' &&
                          <ul className="pb-4 mt-2 text-gray-700 flex items-center justify-around">
                            <li className="flex flex-col items-center justify-around">
                              <MdVideocam className="text-blue-900 text-xl" />
                              <div>{ listVideos.length }</div>
                            </li>
                          </ul>
                        }
                      </div>
                      <div>
                        {
                          listVideos.length > 0
                          ? <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5 cursor-pointer px-5">
                              {
                                listVideos.map((itemVideo: any, index: number) => (
                                  <ItemVideo
                                    key={index}
                                    itemVideo={itemVideo}
                                    loggedUser={loggedUser}
                                  />
                                ))
                              }
                            </div>
                          : <div className="w-full text-center">
                              Nenhum video cadastrado
                            </div>
                        }
                      </div>
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
      <Footer />
    </div>
    );
  }