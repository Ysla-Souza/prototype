'use client'
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/footer";
import { getCompanies } from "@/firebase/user";
import { MdOutlineFilterList } from "react-icons/md";
import Loading from "@/components/loading";

export default function Companies() {
  const [allCompanies, setAllCompanies] = useState<any>();
  const [nameComp, setNameComp] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [companies, setCompanies] = useState<any>();
  const [showData, setShowData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authUser = async () => {
      const auth = await authenticate();
      if (auth) {
        const comps = await getCompanies();
        const filtered = comps.filter((comp: any) => comp.email !== auth.email);
        setCompanies(filtered);
        setAllCompanies(filtered);
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
    const formattedCompanies = list.map((company, index) => {
      if (index === lastIndex - 1) return `${company}`;
      if (index === lastIndex) return company;
      return `${company}`;
    });
    return formattedCompanies.join(' - ');
  };

  return(
    <div className={`w-full ${showData ? 'h-full' : 'h-80vh'}`}>
      <Navigation name="companies" />
      {
        !showData 
        ? <div className="break-words h-screen flex items-center justify-center bg-dice w-full bg-center">
          <Loading />               
        </div>
        : <div className="break-words w-full h-full items-center justify-center flex flex-col py-5 bg-black">
            <div className="break-words w-full h-35vh relative bg-dice bg-cover" />
            <div className={`px-5 bg-black w-full ${companies.length === 0 ? 'h-screen' : ''}`}>
              <div className="break-words w-full pt-5">
                  <div className="break-words flex justify-between items-center w-full">
                    <h2 className="break-words text-left text-white sm:text-left mt-3 mb-5 text-2xl">Empresas</h2>
                  </div>
                  <MdOutlineFilterList
                    className="break-words text-xl mb-5 cursor-pointer text-white"
                    onClick={() => {
                      setShowFilter(!showFilter);
                      setNameComp('');
                      setCompanies(allCompanies);
                    }}
                  />
                  {
                    showFilter &&
                    <div className="break-words w-full mb-3">
                      <input
                        name="company"
                        id="company"
                        value={nameComp}
                        placeholder="Digite aqui"
                        onChange={(e: any) => {
                          if (e.target.value.length === 0) setCompanies(allCompanies);
                          else {
                            setCompanies(
                              allCompanies
                                .filter((comp: any) => comp.company.toLowerCase().includes(e.target.value.toLowerCase())
                            ));
                          }
                          setNameComp(e.target.value);
                        }}
                        className="break-words shadow-sm w-full bg-prot-dark border text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-300"
                        required 
                      />
                    </div>
                  }
                  <div className="break-words grid grid-cols-1 gap-3 w-full">
                    {
                      companies
                      && companies.length > 0
                      && companies.map((company: any, index: number) => (
                        <div
                          key={index}
                          className="break-words border border-violet-500 border-2 p-4 grid grid-cols-1 sm:grid-cols-5"
                        >
                          <div className="break-words flex w-full h-full items-center justify-center">
                            <div className="break-words mx-auto border-4 border-violet-500 rounded-full overflow-hidden bg-black flex items-center justify-center w-28 h-28">
                              {
                                company.imageURL !== undefined && company.imageURL !== ''
                                ? <Image
                                  width={1000}
                                  height={1000}
                                  className="break-words object-cover object-top w-28 h-28"
                                  src={company.imageURL}
                                  alt={company.company}
                                />
                                : <p className="break-words text-white text-4xl">
                                    {company.company[0]}
                                  </p>
                              }
                            </div>
                          </div>
                          <div className="break-words col-span-4">
                            <div className="break-words w-full text-center sm:text-left my-2 text-white">
                              { company.company }
                            </div>
                            <div className="break-words text-center sm:text-left text-sm text-violet-400 w-full mb-2">
                              { generateList(company.skills) }
                            </div>
                            <div className="break-words text-center sm:text-left text-white w-full my-5">
                              { company.description }
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  { 
                    companies.length === 0 &&
                    <div className="break-words text-white w-full text-center sm:text-left text-2xl pt-10">
                      Nenhuma Empresa encontrada
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