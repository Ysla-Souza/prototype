'use client'
import EditProfile from "@/components/editProfile";
import Footer from "@/components/footer";
import ItemVideo from "@/components/itemVideo";
import Loading from "@/components/loading";
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
    <div className="break-words w-full min-h-screen">
      <Navigation name="developers" />
      <div className="break-words w-full h-full items-center justify-start flex flex-col w-wrap pb-10 min-h-screen bg-black">
        {
            !showData 
              ? <div className="break-words h-screen flex items-center justify-center bg-dice w-full bg-center">
                  <Loading />               
                </div>               
              : <div className="break-words w-full flex items-start h-full">
                  {
                    userData &&
                    <div className="break-words w-full h-full">
                      <div className="break-words w-full">
                        <div className="break-words h-35vh bg-dice bg-cover" />
                        <div className="break-words mx-auto w-32 h-32 relative -mt-16 border-4 border-violet-500 rounded-full overflow-hidden bg-black flex items-center justify-center">
                          {
                            userData.imageURL !== undefined && userData.imageURL !== ''
                            ? <Image
                              width={1000}
                              height={1000}
                              className="break-words object-cover object-top w-full"
                              src={userData.imageURL}
                              alt={userData.firstName}
                            />
                            : <p className="break-words text-white text-4xl">
                                {userData.firstName[0]}
                              </p>
                          }
                        </div>
                        <div className="break-words w-full flex flex-col items-center justify-center mb-5">
                          <div className="break-words text-center mt-2 w-4/5 sm:w-1/3 text-white">
                            <h2 className="break-words font-semibold capitalize">
                              {userData.firstName} {userData.lastName}
                            </h2>
                            {
                              userData.typeUser === 'developer'
                              && <p className="break-words text-white">
                                {
                                  userData.skills !== ''
                                  && userData.skills
                                  && generateList(userData.skills)
                                }
                              </p>
                            }
                          </div>
                          <div className="break-words text-center mt-5 w-full w-4/5 sm:w-2/3 text-white px-5 break-words">
                            <h2 className="break-words font-semibold">
                              { userData.description }
                            </h2>
                          </div>
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
                      <div>
                        {
                          listVideos.length > 0
                          ? <div className="break-words grid grid-cols-1 gap-5 cursor-pointer px-5">
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
                          : <div className="break-words w-full text-center text-white">
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