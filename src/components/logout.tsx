'use client'
import { signOutFirebase } from "@/firebase/authenticate";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function Logout(props: any) {
  const { setShowLogout } = props;
  const router: any = useRouter();

  const logout = async () => {
    const signOut = await signOutFirebase();
    if (signOut) router.push("/"); 
  }

  return(
    <div
      className="break-words text-white bg-black z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-background bg-black/80 px-3 sm:px-0"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="break-words bg-black w-full sm:w-2/3 md:w-1/3 overflow-y-auto">
        <div className="break-words flex flex-col justify-center items-center relative border-violet-500 border-2 p-4">
          <div className="break-words w-full">
            <div className="break-words pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
              <IoIosCloseCircleOutline
                className="break-words text-4xl text-white cursor-pointer hover:text-violet-500 transition-colors duration-500"
                onClick={ () => setShowLogout(false)}
              />
            </div>
            <div className="break-words pb-5 w-full">
              <label htmlFor="palavra-passe" className="break-words flex flex-col items-center w-full">
              <div className="break-words flex items-center justify-center w-full my-2">
                <Image
                  src="/faceInvader.png"
                  className="break-words w-14 h-14 object-cover cursor-pointer"
                  width={2000}
                  height={2000}
                  alt="Face invader"
                  onClick={ () => router.push('/home') }
                />
              </div>
              <p className="break-words text-white w-full text-center pb-3 pt-5">
                Tem certeza que quer Sair da plataforma?
              </p>
              </label>
              <div className="break-words flex w-full gap-2">
                <button
                  type="button"
                  onClick={ () => setShowLogout(false)}
                  className="break-words text-white hover:text-green-500 transition-colors cursor-pointer border-2 border-green-500 w-full p-2 mt-6 font-bold"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={ logout }
                  className="break-words text-white hover:text-red-500 transition-colors cursor-pointer border-2 border-red-500 w-full p-2 mt-6 font-bold"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
