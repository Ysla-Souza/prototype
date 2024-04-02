'use client'
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getDevelopers } from "@/firebase/user";
import Footer from "@/components/footer";
import { MdOutlineFilterList } from "react-icons/md";
import Loading from "@/components/loading";

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
        const devs = await getDevelopers();
        const filtered = devs.filter((dev: any) => dev.email !== auth.email)
        setDevelopers(filtered);
        setAllDevelopers(filtered);
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
    <div className={`w-full ${showData ? 'h-full' : 'h-80vh'}`}>
      <Navigation name="developers" />
      {
        !showData 
        ? <div className="break-words h-screen flex items-center justify-center bg-dice w-full bg-center">
          <Loading />               
        </div>
        : <div className="break-words w-full h-full items-center justify-center flex flex-col py-5 bg-black">
            <div className="break-words w-full h-35vh relative bg-dice bg-cover" />
            <div className={`px-5 bg-black w-full ${developers && developers.length === 0 ? 'h-screen' : ''}`}>
              <div className="break-words w-full pt-5">
                  <div className="break-words flex justify-between items-center w-full">
                    <h2 className="break-words text-left text-white sm:text-left mt-3 mb-5 text-2xl">Desenvolvedores</h2>
                  </div>
                  <MdOutlineFilterList
                    className="break-words text-xl mb-5 cursor-pointer text-white"
                    onClick={() => {
                      setShowFilter(!showFilter);
                      setNameDev('');
                      setDevelopers(allDevelopers);
                    }}
                  />
                  {
                    showFilter &&
                    <div className="break-words w-full mb-3">
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
                        className="break-words shadow-sm w-full bg-prot-dark border text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-300"
                        required 
                      />
                    </div>
                  }
                  <div className="break-words grid grid-cols-1 gap-3 w-full">
                    {
                      developers
                      && developers.length > 0
                      && developers.map((developer: any, index: number) => (
                        <button type="button"
                          onClick={ () => router.push(`/developers/${developer.id}`)}
                          key={index}
                          className="break-words border border-violet-500 hover:border-white transition-colors duration-500 border-2 p-4 grid grid-cols-1 sm:grid-cols-5 cursor-pointer"
                        >
                          <div className="break-words flex w-full h-full items-center justify-center">
                            <div className="break-words mx-auto border-4 border-violet-500 rounded-full overflow-hidden bg-black flex items-center justify-center w-28 h-28">
                              {
                                developer.imageURL !== undefined && developer.imageURL !== ''
                                ? <Image
                                  width={1000}
                                  height={1000}
                                  className="break-words object-cover object-top w-28 h-28"
                                  src={developer.imageURL}
                                  alt={developer.firstName}
                                />
                                : <p className="break-words text-white text-4xl">
                                    {developer.firstName[0]}
                                  </p>
                              }
                            </div>
                          </div>
                          <div className="break-words col-span-4">
                            <div className="break-words w-full text-center sm:text-left my-2 text-white capitalize text-violet-500 text-xl">
                              { developer.firstName } { developer.lastName }
                            </div>
                            <div className="break-words text-center sm:text-left text-sm text-violet-400 w-full mb-2">
                              { generateList(developer.skills) }
                            </div>
                            <div className="break-words text-center sm:text-left text-white w-full my-5 break-words">
                              { developer.description }
                            </div>
                          </div>
                        </button>
                      ))
                    }
                  </div>
                  { developers && developers.length === 0 &&
                    <div className="break-words text-white text-2xl pt-10">
                      Nenhum Desenvolvedor encontrado
                    </div>
                  }
              </div>
            </div>
          </div>
        }
      <Footer />
    </div>
    );
}