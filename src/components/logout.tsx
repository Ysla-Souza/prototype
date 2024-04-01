'use client'
import { signOutFirebase } from "@/firebase/authenticate";
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
      className="text-black z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-background bg-black/80 px-3 sm:px-0"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white w-full sm:w-2/3 md:w-1/3 overflow-y-auto">
        <div className="flex flex-col justify-center items-center bg-background bg-contain relative border-white border-2">
          <div className="bg-white/80">
            <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
              <IoIosCloseCircleOutline
                className="text-4xl text-black cursor-pointer"
                onClick={ () => setShowLogout(false)}
              />
            </div>
            <div className="pb-5 px-5 w-full">
              <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
                <p className="text-black w-full text-center pb-3 pt-5">
                  Tem certeza que quer Sair?
                </p>
              </label>
              <div className="flex w-full gap-2">
                <button
                  type="button"
                  onClick={ () => setShowLogout(false)}
                  className={`text-black bg-pink-mjg hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={ logout }
                  className={`text-black bg-blue-mjg hover:border-blue-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
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
