'use client'
import { categories } from "@/categories";
import { updateUserById } from "@/firebase/user";
import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";

export default function EditProfile(props: any) {
  const [listCategories, setListCategories] = useState<any>(categories.sort());
  const [userData, setUserData] = useState<any>(props.userData);
  const [provSkill, setProvSkill] = useState('');
  const [provCat, setProvCat] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const updateUser = async () => {
    setLoading(true);
    setError('');
    if(userData.firstName.length < 2) {
      setError('Necessário inserir um Nome com mais de 2 caracteres');
    } else if(userData.lastName.length < 2) {
      setError('Necessário inserir um Sobrenome com mais de 2 caracteres');
    } else if(userData.skills.length === 0) {
      setError('Necessário inserir pelo menos uma habilidade');
    } else {
     const updtUser = await updateUserById(userData);
     if (updtUser) props.setUserData(userData);
     props.setShowEditProfile(false)
    }
    setLoading(false);
  };

  const updateCompany = async () => {
    setLoading(true);
    setError('');
    if(userData.company.length < 2) {
      setError('Necessário inserir um Nome para a Empresa com pelo menos 2 caracteres');
    } else if(userData.categories.length === 0) {
      setError('Necessário inserir pelo menos uma Área de Atuação / Interesse');
    } else {
     const updtUser = await updateUserById(userData);
     if (updtUser) props.setUserData(userData);
     props.setShowEditProfile(false)
    }
    setLoading(false);
  };

  const removeSkill = (option: string) => {
    if (userData.typeUser === 'company') {
      setUserData({
        ...userData,
        categories: userData.categories.filter((rmSo: any) => rmSo !== option),
      });
      const ordered = [...listCategories, option];
      setListCategories(ordered.sort());
    } else {
      setUserData({
        ...userData,
        skills: userData.skills.filter((rmSo: any) => rmSo !== option),
      });
    }
  }

  const addCategory = () => {
    const findItem = userData.categories.find((dev: any) => dev === provCat);
    if (findItem) window.alert('Área de Interesse / Atuação já inserida!');
    else {
      setUserData({
        ...userData,
        categories: [...userData.categories, provCat],
      });
    }
    const newOptions = listCategories.filter((defCat: any) => defCat !== provCat);
    setListCategories(newOptions);
    setProvCat('');
  }

  const addSkill = () => {
    const findItem = userData.skills.find((dev: any) => dev === provSkill);
    if (findItem) window.alert('Habilidade já inserida!');
    else {
      setUserData({
        ...userData,
        categories: [...userData.categories, provSkill],
        skills: [...userData.skills, provSkill],
      });
    }
    setProvSkill('');
  }

  return (
    <div className="z-50 fixed top-0 left-0 w-full flex items-start justify-center bg-black/80 px-3 sm:px-0 overflow-y-auto h-full">
      <div className="w-full lex flex-col justify-center items-center bg-gray-500 min-h-screen relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => props.setShowEditProfile(false) }
          />
        </div>
        <div className="px-6 sm:px-10 w-full">
          <div className="w-full overflow-y-auto flex flex-col justify-center items-center mt-2 mb-10">
            <div className="w-full text-white text-2xl pb-3 font-bold text-center mt-2 mb-2">
              Editar Perfil
            </div>
            {
              userData.typeUser === 'developer'
              ? <div className="w-full">
                <label htmlFor="firstName" className="mb-4 flex flex-col items-center w-full">
                  <p className="w-full mb-1">Nome</p>
                  <input
                    type="text"
                    id="firstName"
                    value={ userData.firstName }
                    placeholder="Nome"
                    className="bg-white w-full p-3 cursor-pointer text-black text-center"
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      setUserData({
                        ...userData,
                        firstName: e.target.value,
                      });
                    }}
                  />
                </label>
                <label htmlFor="lastName" className="mb-4 flex flex-col items-center w-full">
                  <p className="w-full mb-1">Sobrenome</p>
                  <input
                    type="text"
                    id="lastName"
                    value={ userData.lastName }
                    className="bg-white w-full p-3 cursor-pointer text-black text-center"
                    placeholder="Sobrenome"
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      setUserData({
                        ...userData,
                        lastName: e.target.value,
                      });
                    }}
                  />
                </label>
              </div>
              : <label htmlFor="company" className="mb-4 flex flex-col items-center w-full">
                  <p className="w-full mb-1">Empresa</p>
                  <input
                    type="text"
                    id="company"
                    value={ userData.company }
                    placeholder="Nome da Empresa"
                    className="bg-white w-full p-3 cursor-pointer text-black text-center"
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      setUserData({
                        ...userData,
                        company: e.target.value,
                      });
                    }}
                  />
                </label>
            }
            <label htmlFor="bio" className="mb-4 flex flex-col items-center w-full">
              <p className="w-full mb-1">Bio</p>
              <textarea
                id="bio"
                value={ userData.description }
                className="bg-white w-full p-3 cursor-pointer text-black text-justify"
                placeholder="Fale um pouco sobre você"
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setUserData({
                    ...userData,
                    description: e.target.value,
                  });
                }}
              />
            </label>
            <label className="mb-4 flex flex-col items-center w-full">
                <p className="w-full mb-1">{ userData.typeUser === 'company' ? 'Categorias de Interesse' : 'Habilidades' }</p>
                { userData.typeUser === 'developer' ? 
                  <div className="w-full flex items-center justify-center gap-2">
                    <input
                      className="bg-white w-full p-3 cursor-pointer text-black text-center"
                      type="text"
                      name="linkVideo"
                      placeholder="Digite uma habilidade ou tecnologia"
                      value={provSkill}
                      onChange={ (e: any) => setProvSkill(e.target.value)}
                    />
                    <button
                      type="button"
                      className="cursor-pointer h-full bg-white p-3 border border-black"
                      onClick={addSkill}
                    >
                      +
                    </button>
                  </div>
                  : <div className="w-full flex items-center justify-center gap-2">
                    <select
                      id="categories"
                      onChange={(e: any) => setProvCat(e.target.value) }
                      value={provCat} className='bg-white w-full p-3 cursor-pointer text-black text-center capitalize'
                    >
                      <option disabled value="">Selecione uma Categoria </option>
                      {
                        listCategories.map((cat: any, index: number) => (
                          <option key={index} value={cat} className="capitalize"> {cat} </option>    
                        ))
                      }
                    </select>
                    <button
                      type="button"
                      className="cursor-pointer h-full bg-white p-3 border border-black"
                      onClick={addCategory}>
                      +
                    </button>
                    </div>
                }
                {
                  userData && userData.skills && userData.skills.map((optionSkill: any, index: number) => (
                    <div key={index} className="bg-white text-black capitalize w-full flex items-center justify-between mt-2 p-2">
                      { optionSkill }
                      <MdDelete
                        className="cursor-pointer"
                        onClick={() => removeSkill(optionSkill)}
                      />
                    </div>
                  ))
                }
                {
                  userData && userData.categories && userData.categories.map((optionSkill: any, index: number) => (
                    <div key={index} className="bg-white text-black capitalize w-full flex items-center justify-between mt-2 p-2">
                      { optionSkill }
                      <MdDelete
                        className="cursor-pointer"
                        onClick={() => removeSkill(optionSkill)}
                      />
                    </div>
                  ))
                }
            </label>
            <div className="grid grid-cols-2 w-full gap-3">
              <button
              className={`text-white bg-black hover:border-red-800 transition-colors cursor-pointer' } border-2 border-white w-full p-2 mt-6 font-bold`}
              onClick={() => props.setShowEditProfile(false) }
              >
              Cancelar
              </button>
              <button
                className={`text-white bg-black hover:border-red-800 transition-colors cursor-pointer' } border-2 border-white w-full p-2 mt-6 font-bold`}
                onClick={ () => {
                  if(userData.typeUser === 'developer') updateUser();
                  else updateCompany();
                }}
              >
                  Salvar
              </button>
            </div>
            {
              error !== '' && <div className="text-white pt-4 pb-3 text-center">{ error }</div>
            }
          </div>
          {
            loading
            && <div className="bg-black/80 text-white flex items-center justify-center flex-col my-5">
              <span className="loader z-50" />
            </div>
          }
        </div>    
      </div>
    </div>
  );
}