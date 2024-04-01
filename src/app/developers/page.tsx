'use client'
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getDevelopers } from "@/firebase/user";
import Footer from "@/components/footer";
import { MdOutlineFilterList } from "react-icons/md";

export default function Developers() {
  const [developers, setDevelopers] = useState<any>();
  const [allDevelopers, setAllDevelopers] = useState<any>();
  const [nameDev, setNameDev] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showData, setShowData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authUser = async () => {
      const auth = await authenticate();
      if (auth) {
        setShowData(true);
        const devs = await getDevelopers();
        const filtered = devs.filter((dev: any) => dev.email !== auth.email)
        setDevelopers(filtered);
        setAllDevelopers(filtered);
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

  function getFirst100Characters(inputString: string) {
    if (inputString.length <= 100) {
      return inputString;
    } else {
      return inputString.slice(0, 100) + "...";
    }
  }

  return(
    <div className={`w-full ${showData ? 'min-h-screen' : 'h-80vh'}`}>
      <Navigation name="developers" />
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
          : <div className="w-full h-screen">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-center sm:text-left mt-3 mb-5 text-2xl">Developers</h2>
              </div>
              <MdOutlineFilterList
                className="text-xl mb-5 cursor-pointer"
                onClick={() => setShowFilter(!showFilter)}
              />
              {
                showFilter &&
                <div className="w-full mb-3">
                  <input
                    name="categories"
                    id="categories"
                    value={nameDev}
                    placeholder="Digite aqui um Nome"
                    onChange={(e: any) => {
                      if (e.target.value.length === '') setDevelopers(allDevelopers);
                      else {
                        setDevelopers(allDevelopers.filter((dev: any) => dev.firstName.toLowerCase().includes(e.target.value.toLowerCase()) || dev.lastName.toLowerCase().includes(e.target.value.toLowerCase())));
                      }
                      setNameDev(e.target.value);
                    }}
                    className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    required 
                  />
                </div>
              }
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {
                  developers
                  && developers.length > 0
                  && developers.map((developer: any, index: number) => (
                    <button
                      type="button"
                      onClick={() => router.push(`/developers/${developer.id}`)}
                      key={index}
                      className="border border-black p-2"
                    >
                      <div className="mx-auto w-28 h-28 border-4 border-white rounded-full overflow-hidden bg-black flex items-center justify-center">
                        {
                          developer.imageURL !== undefined && developer.imageURL !== ''
                          ? <Image
                            width={1000}
                            height={1000}
                            className="object-cover object-top w-full"
                            src={developer.imageURL}
                            alt={developer.firstName}
                          />
                          : <p className="text-white text-4xl">
                              { developer.firstName[0] }
                            </p>
                        }
                      </div>
                      <div className="w-full text-center my-2">
                        { developer.firstName } { developer.lastName }
                      </div>
                      <div className="text-center w-full mb-2">
                        { generateList(developer.skills) }
                      </div>
                      <div className="text-center w-full my-5">
                        { getFirst100Characters(developer.description) }
                      </div>
                    </button>
                  ))
                }
              </div>
            </div>
          }
      </div>
      <Footer />
    </div>
    );
  }