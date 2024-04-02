'use client'
import { categories } from "@/categories";
import { updateUserById } from "@/firebase/user";
import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";

export default function EditProfile(props: any) {
  const [listCategories, setListCategories] = useState<any>(categories.sort());
  const [userData, setUserData] = useState<any>(props.userData);
  const [provSkill, setProvSkill] = useState('');
  const [provCat, setProvCat] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setListCategories(listCategories.filter((cat: string) => !props.userData.skills.includes(cat)));
  }, []);
  
  const updateUser = async () => {
    setLoading(true);
    setError('');
    if(userData.firstName && userData.firstName.length < 2 && userData.typeUser === 'developer') {
      setError('Necessário inserir um Nome com mais de 2 caracteres');
    } else if(userData.lastName && userData.lastName.length < 2) {
      setError('Necessário inserir um Sobrenome com mais de 2 caracteres');
    } else if(userData.company && userData.company.length < 2 && userData.typeUser === 'company') {
      setError('Necessário inserir um Nome para a Empresa com pelo menos 2 caracteres');
    } else if(userData.skills.length === 0) {
      setError('Necessário inserir pelo menos uma habilidade');
    } else {
     const updtUser = await updateUserById(userData);
     if (updtUser) props.setUserData(userData);
     props.setShowEditProfile(false)
    }
    setLoading(false);
  };

  const removeSkill = (option: string) => {
    setUserData({
      ...userData,
      skills: userData.skills.filter((rmSo: any) => rmSo !== option),
    });
    if (userData.typeUser === 'company') {
      const ordered = [...listCategories, option];
      setListCategories(ordered.sort());
    }
  }

  const addCategory = () => {
    const findItem = userData.skills.find((dev: any) => dev === provCat);
    if (findItem) window.alert('Área de Interesse / Atuação já inserida!');
    else {
      if (provCat !== '' && provCat !== ' ') {
        setUserData({
          ...userData,
          skills: [...userData.skills, provCat],
        });
        const newOptions = listCategories.filter((defCat: any) => defCat !== provCat);
        setListCategories(newOptions);
        setProvCat('');
      } else window.alert('Necessário preencher uma categoria com pelo menos um catactere');
    }
  }

  const addSkill = () => {
    var text = provSkill;
    if ((text[text.length -1]) === ' ') text = text.slice(0, -1);
    const findItem = userData.skills.find((dev: any) => dev === text);
    if (findItem) window.alert('Habilidade já inserida!');
    else {
      if (text !== '' && text !== ' ') {
        setUserData({
          ...userData,
          skills: [...userData.skills, text],
        });
      } else window.alert('Necessário preencher uma habilidade com pelo menos um Caractere');
    }
    setProvSkill('');
  }

  return (
    <div className="break-words z-50 fixed top-0 left-0 w-full flex items-start justify-center bg-dice py-2 sm:px-0 overflow-y-auto h-full">
      <div className="break-words w-full lex flex-col justify-center items-center min-h-screen relative border-white border-2 mx-1 pb-5">
        <div className="break-words pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="break-words text-4xl text-white cursor-pointer hover:text-violet-500 duration-500 transition-colors"
            onClick={() => props.setShowEditProfile(false) }
          />
        </div>
        <div className="break-words px-4 sm:px-10 w-full">
          <div className="break-words w-full overflow-y-auto flex flex-col justify-center items-center mt-2 mb-10">
            <div className="break-words w-full text-white text-2xl pb-3 font-bold text-center mt-2 mb-2">
              Editar Perfil
            </div>
            {
              userData.typeUser === 'developer'
              ? <div className="break-words w-full">
                <label htmlFor="firstName" className="break-words mb-4 flex flex-col items-center w-full">
                  <p className="break-words w-full mb-1 text-white">Nome</p>
                  <input
                    type="text"
                    id="firstName"
                    value={ userData.firstName }
                    placeholder="Nome"
                    className="break-words bg-black border border-violet-500 w-full p-3 cursor-pointer text-white text-center"
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      setUserData({
                        ...userData,
                        firstName: e.target.value,
                      });
                    }}
                  />
                </label>
                <label htmlFor="lastName" className="break-words mb-4 flex flex-col items-center w-full">
                  <p className="break-words w-full mb-1 text-white">Sobrenome</p>
                  <input
                    type="text"
                    id="lastName"
                    value={ userData.lastName }
                    className="break-words bg-black border border-violet-500 w-full p-3 cursor-pointer text-white text-center"
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
              : <label htmlFor="company" className="break-words mb-4 flex flex-col items-center w-full">
                  <p className="break-words w-full mb-1 text-white">Empresa</p>
                  <input
                    type="text"
                    id="company"
                    value={ userData.company }
                    placeholder="Nome da Empresa"
                    className="break-words bg-black border border-violet-500 w-full p-3 cursor-pointer text-white text-center"
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      setUserData({
                        ...userData,
                        company: e.target.value,
                      });
                    }}
                  />
                </label>
            }
            <label htmlFor="bio" className="break-words mb-4 flex flex-col items-center w-full">
              <p className="break-words w-full mb-1 text-white">Bio</p>
              <textarea
                id="bio"
                rows={7}
                value={ userData.description }
                className="break-words bg-black border border-violet-500 w-full p-3 cursor-pointer text-white text-left sm:text-justify"
                placeholder="Fale um pouco sobre você"
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setUserData({
                    ...userData,
                    description: e.target.value,
                  });
                }}
              />
            </label>
            <label className="break-words mb-4 flex flex-col items-center w-full">
                <p className="break-words w-full mb-1 text-white">{ userData.typeUser === 'company' ? 'Categorias de Interesse' : 'Habilidades' }</p>
                { userData.typeUser === 'developer' ? 
                  <div className="break-words w-full flex items-center justify-center gap-2">
                    <input
                      className="break-words bg-black border border-violet-500 w-full p-3 cursor-pointer text-white text-center"
                      type="text"
                      name="linkVideo"
                      placeholder="Digite uma habilidade ou tecnologia"
                      value={provSkill}
                      onChange={ (e: any) => {
                        const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                        setProvSkill(sanitizedValue);
                      }}
                    />
                    <button
                      type="button"
                      className="break-words cursor-pointer h-full bg-black border border-violet-500 p-3 border border-white rounded text-white"
                      onClick={addSkill}
                    >
                      +
                    </button>
                  </div>
                  : <div className="break-words w-full flex items-center justify-center gap-2">
                    <select
                      id="categories"
                      onChange={(e: any) => {
                        const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                        setProvCat(sanitizedValue);
                      }}
                      value={provCat} className='bg-black border border-violet-500 w-full p-3 cursor-pointer text-white text-center capitalize'
                    >
                      <option disabled value="">Selecione uma Categoria </option>
                      {
                        listCategories.map((cat: any, index: number) => (
                          <option key={index} value={cat} className="break-words capitalize"> {cat} </option>    
                        ))
                      }
                    </select>
                    <button
                      type="button"
                      className="break-words cursor-pointer h-full bg-black border border-violet-500 p-3 border border-white rounded text-white"
                      onClick={addCategory}>
                      +
                    </button>
                    </div>
                }
                {
                  userData && userData.skills && userData.skills.map((optionSkill: any, index: number) => (
                    <div key={index} className="break-words bg-black border border-violet-500 text-white capitalize w-full flex items-center justify-between mt-2 p-2">
                      { optionSkill }
                      <MdDelete
                        className="break-words cursor-pointer"
                        onClick={() => removeSkill(optionSkill)}
                      />
                    </div>
                  ))
                }
            </label>
            <div className="break-words grid grid-cols-2 w-full gap-3">
              <button
              className="break-words text-white hover:text-red-500 transition-colors cursor-pointer border-2 border-red-500 w-full p-2 mt-6 font-bold bg-black"
              onClick={() => props.setShowEditProfile(false) }
              >
              Cancelar
              </button>
              <button
                className="break-words text-white hover:text-green-500 transition-colors cursor-pointer border-2 border-green-500 w-full p-2 mt-6 font-bold bg-black"
                onClick={ updateUser }
              >
                  Salvar
              </button>
            </div>
            {
              error !== '' && <div className="break-words text-white pt-4 pb-3 text-center">{ error }</div>
            }
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