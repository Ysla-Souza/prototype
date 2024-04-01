'use client'
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/footer";
import { getCompanies } from "@/firebase/user";
import { MdOutlineFilterList } from "react-icons/md";

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
    <div className={`w-full ${showData ? 'min-h-screen' : 'h-80vh'}`}>
      <Navigation name="companies" />
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
          : <div className="w-full min-h-screen">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-center sm:text-left mt-3 mb-5 text-2xl">Companies</h2>
              </div>
              <MdOutlineFilterList
                className="text-xl mb-5 cursor-pointer"
                onClick={() => setShowFilter(!showFilter)}
              />
              {
                showFilter &&
                <div className="w-full mb-3">
                  <input
                    name="company"
                    id="company"
                    value={nameComp}
                    placeholder="Digite aqui um Nome"
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
                    className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    required 
                  />
                </div>
              }
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {
                  companies
                  && companies.length > 0
                  && companies.map((company: any, index: number) => (
                    <div
                      key={index}
                      className="border border-black p-2"
                    >
                      <div className="mx-auto w-28 h-28 border-4 border-white rounded-full overflow-hidden bg-black flex items-center justify-center">
                        {
                          company.imageURL !== undefined && company.imageURL !== ''
                          ? <Image
                            width={1000}
                            height={1000}
                            className="object-cover object-top w-full"
                            src={company.imageURL}
                            alt={company.company}
                          />
                          : <p className="text-white text-4xl">
                              {company.company[0]}
                            </p>
                        }
                      </div>
                      <div className="w-full text-center my-2">
                        { company.company }
                      </div>
                      <div className="text-center w-full mb-2">
                        { generateList(company.categories) }
                      </div>
                      <div className="text-center w-full my-5">
                        { company.description }
                      </div>
                    </div>
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