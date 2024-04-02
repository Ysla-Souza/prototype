'use client'
import Construction from "@/components/construction";
import Loading from "@/components/loading";
import Navigation from "@/components/navigation";
import { authenticate } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function About() {

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
    <div className="break-words w-full h-screen">
      <Navigation name="about" />
      <div className="break-words bg-dice w-full h-full items-center justify-center flex flex-col w-wrap py-10 px-32">
        {
            !showData 
              ? <div className="break-words h-screen flex items-center justify-center w-full">
                  <Loading />               
                </div>                 
              : <div className="break-words w-full">
                  <Construction />
                </div>
        }
      </div>
    </div>
    );
  }