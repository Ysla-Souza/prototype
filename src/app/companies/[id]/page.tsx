'use client'
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Company() {

  const [showData, setShowData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authUser = async () => {
      const auth = await authenticate();
      if (auth) setShowData(true);
      else router.push("/");
    };
    authUser();
  }, []);

  return(
    <div className="w-full h-screen">
      <Navigation name="company" />
      <div className="w-full h-full items-center justify-center flex flex-col w-wrap py-10 px-32">
        {
            !showData 
              ? <div className="flex items-center justify-center">
                  <span className="loader p-6 space-y-4 md:space-y-6 sm:p-8" />
                </div>                
              : <div>
                  Empresa X
                </div>
        }
      </div>
    </div>
    );
  }