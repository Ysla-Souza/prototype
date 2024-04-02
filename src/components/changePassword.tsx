'use client'
import { useContext, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import contextProv from '../context/context';
import { changeUserPassword } from "@/firebase/authenticate";

export default function ChangePassword(props: any) {
  const context = useContext(contextProv);
  const [lastPassword, setLastPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [loading, setLoading] = useState(false);

  const { setShowChangePassword, showChangePassword } = context;
  
  const updatePassword = async () => {
    setLoading(true);
    if (lastPassword.length < 2) {
      window.alert('As senhas inseridas não conferem. Por favor, tente novamente.');
    } else if (newPassword1 !== newPassword2) {
      window.alert('As senhas inseridas não conferem. Por favor, tente novamente.');
    } else if(newPassword1.length < 6) {
      window.alert('É necessário preencher uma nova tenha com pelo menos seis dígitos');
    } else { 
      await changeUserPassword(lastPassword, showChangePassword.user.email, newPassword1);
      setLoading(false);
      setShowChangePassword({ show: false, user: {} });
    }
  };

  return (
    <div className="break-words z-50 fixed top-0 left-0 w-full flex items-center justify-center bg-black/80 px-3 sm:px-0 overflow-y-auto h-full">
      <div className="break-words w-11/12 sm:w-1/2 lex flex-col justify-center items-center relative border-violet-500 border-2 pb-5 bg-dice">
        <div className="break-words pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="break-words text-4xl text-white cursor-pointer hover:text-violet-500 duration-500 transition-colors"
            onClick={() => setShowChangePassword({ show: false, user: {} }) }
          />
        </div>
        <div className="break-words px-6 sm:px-10 w-full">
          <div className="break-words w-full overflow-y-auto flex flex-col justify-center items-center mt-2 mb-10">
            <div className="break-words w-full text-white text-2xl pb-3 font-bold text-center mt-2 mb-2">
              Alteração de Senha
            </div>
            <label htmlFor="lastPassword" className="break-words mb-4 flex flex-col items-center w-full">
              <p className="break-words w-full mb-1 text-white">Digite a senha antiga</p>
              <input
                type="password"
                id="lastPassword"
                value={ lastPassword }
                placeholder="••••••"
                className="break-words bg-black border border-violet-500 w-full p-3 cursor-pointer text-white text-left"
                onChange={ (e: any) => setLastPassword(e.target.value) }
              />
            </label>
            <label htmlFor="newPassword1" className="break-words mb-4 flex flex-col items-center w-full">
              <p className="break-words w-full mb-1 text-white">Digite a Nova Senha</p>
              <input
                type="password"
                id="newPassword1"
                value={ newPassword1 }
                placeholder="••••••"
                className="break-words bg-black border border-violet-500 w-full p-3 cursor-pointer text-white text-left"
                onChange={ (e: any) => setNewPassword1(e.target.value) }
              />
            </label>
            <label htmlFor="newPassword2" className="break-words mb-4 flex flex-col items-center w-full">
              <p className="break-words w-full mb-1 text-white">Repita a Nova Senha</p>
              <input
                type="password"
                id="newPassword2"
                value={ newPassword2 }
                placeholder="••••••"
                className="break-words bg-black border border-violet-500 w-full p-3 cursor-pointer text-white text-left"
                onChange={ (e: any) => setNewPassword2(e.target.value) }
              />
            </label>
            <button
              onClick={ updatePassword }
              disabled={loading}
              className="break-words relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 w-full mt-3"
              >
              <span className="break-words relative px-5 py-2.5 transition-all ease-in duration-75 text-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                { loading ? "Atualizando..." : "Atualizar" }
              </span>
            </button>
          </div>
          {
            loading
            && <div className="break-words bg-black/80 text-white flex items-center justify-center flex-col my-5">
              <span className="break-words loader z-50" />
            </div>
          }
        </div>    
      </div>
    </div>
  );
}