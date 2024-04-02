'use client'
import { categories } from '@/categories';
import { authenticate } from '@/firebase/authenticate';
import { registerVideo } from '@/firebase/video';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { MdDelete } from "react-icons/md";
import contextProv from '../context/context';
import Loading from './loading';

export default function RegisterVideo() {
  const context = useContext(contextProv);
  const { getVideos, setShowRegister } = context;
  const [listCategories, setListCategories] = useState<any>(categories.sort());
  const [provCat, setProvCat] = useState<any>('');
  const [loading, setLoading] = useState(false);
  const [linkImages, setLinkImages] = useState<any>([]);
  const [provDev, setProvDev] = useState('');
  const [defaultSO, setDefaultSO] = useState(['android', 'ios', 'linux', 'macintosh', 'windows']);
  const [provImage, setProvImage] = useState('');
  const [provSO, setProvSO] = useState('');
  const [data, setData] = useState<any>(
    {
      linkVideo: '',
      title: '',
      description: '',
      requirement: {
        memory: '',
        processor: '',
        graphics: '',
        directXVersion: '',
        storage: '',
        operatingSystems: [],
      },
      releaseDate: '',
      publisher: '',
      developers: [],
      categories: [],
      publishDate: '',
      reviews: [],
    },
  );
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
    
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  
  const handleSO = () => {
    if (provSO !== '') {
      setData({
        ...data,
        requirement: {
          ...data.requirement,
          operatingSystems: [ ...data.requirement.operatingSystems, provSO ],
        }}
      );
      const newOptions = defaultSO.filter((defSO: any) => defSO !== provSO);
      setDefaultSO(newOptions);
      setProvSO('');
    } else window.alert('Necessário selecionar um Sistema Operacional antes.');
  }

  const handleCat = () => {
    if (provCat !== '') {
      setData({ ...data, categories: [ ...data.categories, provCat ] });
      const newOptions = listCategories.filter((defCat: any) => defCat !== provCat);
      setListCategories(newOptions);
      setProvCat('');
    } else window.alert('Necessário selecionar uma Categoria antes.');
  }

  const handleImage = (e: any) => {
    if (e.target.files[0]) setProvImage(e.target.files[0]);
  };

  const saveImage = () => {
    if(provImage || provImage !== ''){
      setLinkImages([...linkImages, provImage]);
    } else window.alert('Necessário adicionar uma Imagem.');
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const generateImage = (file:any) => {
    if (file) {
      return (
        <div className="break-words image-container h-20 relative" key={URL.createObjectURL(file)}>
          <Image src={URL.createObjectURL(file)} alt={`Imagem a ser adicionada (${file.name})`} className="break-words h-40 object-contain relative" width={500} height={500} />
          <div className="break-words bg-white absolute right-0 top-0 p-2 cursor-pointer">
            <MdDelete
              className="break-words text-2xl"
              onClick={() => removeImg(file)}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const handleVideo = (e: any) => {
    if (e.target.files[0]) {
      setData({
        ...data,
        linkVideo: e.target.files[0],
      });
    }
  };

  const removeSO = (option: string) => {
    const ordered = [...defaultSO, option];
    setDefaultSO(ordered.sort());
    setData({
      ...data,
      requirement: {
        ...data.requirement,
        operatingSystems: data.requirement.operatingSystems.filter((rmSo: any) => rmSo !== option),
      }
    })
  }

  const removeCategory = (option: string) => {
    const ordered = [...listCategories, option];
    setListCategories(ordered.sort());
    setData({
      ...data,
      categories: data.categories.filter((rmSo: any) => rmSo !== option),
    })
  }

  const removeDev = (option: string) => {
    setData({
      ...data,
        developers: data.developers.filter((rmSo: any) => rmSo !== option),
    })
  }

  const removeImg = (option: string) => {
    setLinkImages(linkImages.filter((rmSo: any) => rmSo !== option));
  }

  const checkRegister = async () => {
    setLoading(true);
    if (data.title === '' || data.title.length < 4) {
      window.alert('Necessario preencher um Titulo com mais de 4 caracteres');
    } else if (data.description === '' || data.description.length < 100) {
      window.alert('Necessario preencher um Descrição com mais de 100 caracteres');
    } else if (data.requirement.memory === '' || data.requirement.memory.length < 4) {
      window.alert('Necessario preencher um valor para a memoria com pelo menos 4 caracteres');
    } else if (data.requirement.processor === '' || data.requirement.processor.length < 4) {
      window.alert('Necessario preencher um valor para o processador com menos 4 caracteres');
    } else if (data.requirement.graphics === '' || data.requirement.graphics.length < 4) {
      window.alert('Necessario preencher um valor para o grafico com menos 4 caracteres');
    } else if (data.requirement.directXVersion === '') {
      window.alert('Necessario preencher um valor para a versão do DirectX');
    } else if (data.requirement.storage === '' || data.requirement.storage.length < 4) {
      window.alert('Necessario preencher um valor para o armazenamento com menos 4 caracteres');
    } else if (data.requirement.operatingSystems.length === 0) {
      window.alert('Necessario adicionar pelo menos um sistema operacional');
    } else if  (data.linkVideo === '') {
      window.alert('É necessario o carregamento de um video');
    } else if (linkImages.length < 3) {
      window.alert('Necessario adicionar pelo menos 3 imagens.');
    } else if (data.releaseDate === '') {
      window.alert('Necessario preencher uma Data de Criação / Última atualização válida');
    } else if (data.developers.length === 0) {
      window.alert('Necessario adicionar pelo menos um desenvolvedor');
    } else if (data.categories.length === 0) {
      window.alert('Necessario adicionar pelo menos uma categoria');
    } else {
      await registerVideo(data, linkImages);
      getVideos();
      setShowRegister(false);
    } setLoading(false);
  }

  return(
    <section className="break-words z-50 fixed top-0 left-0 w-full h-screen overflow-y-auto bg-dice bg-center flex flex-col items-center justify-start">
      <div className="break-words pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
        <IoIosCloseCircleOutline
          className="break-words text-4xl text-white hover:text-violet-500 cursor-pointer transition-colors duration-500"
          onClick={ () => setShowRegister(false)}
        />
      </div>
      <div className="break-words w-full flex flex-col items-center justify-start px-1 sm:px-6 py-2 sm:py-8 mx-auto h-full lg:py-0">
        <div className="break-words md:my-5 w-full bg-black/90 rounded-lg">
          <div className="break-words p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="break-words text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                Cadastro de Vídeo
            </h1>
            {
              !showData 
                ? <div className="break-words flex items-center justify-center">
                    <span className="break-words loader p-6 space-y-4 md:space-y-6 sm:p-8" />
                  </div>                
                : <div className="break-words flex flex-col items-center justify-center gap-2 w-full">
                  <div className="break-words mb-5 w-full">
                    <label htmlFor="title" className="break-words block mb-2 text-sm font-medium text-white dark:text-white">Título</label>
                    <input 
                      type="text"
                      name="title"
                      id="title"
                      value={data.title}
                      onChange={ (e: any) => setData({
                        ...data,
                        title: e.target.value,
                      })}
                      className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                      placeholder="Insira um título" 
                      required 
                    />
                  </div>
                  <div className="break-words mb-5 w-full">
                    <label htmlFor="description" className="break-words block mb-2 text-sm font-medium text-white dark:text-white">Descrição</label>
                    <textarea
                      id="description"
                      name="description"
                      value={data.description}
                      onChange={ (e: any) => setData({
                        ...data,
                        description: e.target.value,
                      })}
                      className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                      placeholder="Insira uma descrição" 
                      required 
                    />
                  </div>
                  <div className="break-words mb-5 w-full">
                    <label htmlFor="memory" className="break-words block mb-2 text-sm font-medium text-white dark:text-white">Memória</label>
                    <input 
                      type="text"
                      name="memory"
                      id="memory"
                      value={data.requirement.memory}
                      onChange={ (e: any) => setData({
                        ...data,
                        requirement: {
                          ...data.requirement,
                          memory: e.target.value,
                        },
                      })}
                      className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                      placeholder="Insira um valor de memória" 
                      required 
                    />
                  </div>
                  <div className="break-words mb-5 w-full">
                    <label htmlFor="processor" className="break-words block mb-2 text-sm font-medium text-white dark:text-white">Processador</label>
                    <input 
                      type="text"
                      name="processor"
                      id="processor"
                      value={data.requirement.processor}
                      onChange={ (e: any) => setData({
                        ...data,
                        requirement: {
                          ...data.requirement,
                          processor: e.target.value,
                        },
                      })}
                      className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                      placeholder="Insira um Processador" 
                      required 
                    />
                  </div>
                  <div className="break-words mb-5 w-full">
                    <label htmlFor="graphics" className="break-words block mb-2 text-sm font-medium text-white dark:text-white">Gráficos</label>
                    <input 
                      type="text"
                      name="graphics"
                      id="graphics"
                      value={data.requirement.graphics}
                      onChange={ (e: any) => setData({
                        ...data,
                        requirement: {
                          ...data.requirement,
                          graphics: e.target.value,
                        },
                      })}
                      className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                      placeholder="Insira um valor gráfico" 
                      required 
                    />
                  </div>
                  <div className="break-words mb-5 w-full">
                    <label htmlFor="directXVersion" className="break-words block mb-2 text-sm font-medium text-white dark:text-white">Versão do DirectX</label>
                    <input 
                      type="text"
                      name="directXVersion"
                      id="directXVersion"
                      value={data.requirement.directXVersion}
                      onChange={ (e: any) => setData({
                        ...data,
                        requirement: {
                          ...data.requirement,
                          directXVersion: e.target.value,
                        },
                      })}
                      className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                      placeholder="Insira um valor gráfico" 
                      required 
                    />
                  </div>
                  <div className="break-words mb-5 w-full">
                    <label htmlFor="storage" className="break-words block mb-2 text-sm font-medium text-white dark:text-white">Armazenamento</label>
                    <input 
                      type="text"
                      name="storage"
                      id="storage"
                      value={data.requirement.storage}
                      onChange={ (e: any) => setData({
                        ...data,
                        requirement: {
                          ...data.requirement,
                          storage: e.target.value,
                        },
                      })}
                      className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                      placeholder="Insira um valor gráfico" 
                      required 
                    />
                  </div>
                  <label htmlFor="operatingSystems" className="break-words block mt-2 w-full text-sm font-medium text-white dark:text-white">Sistemas Operacionais</label>
                  <div className="break-words w-full flex gap-1">
                    <select
                      name="operatingSystems"
                      id="operatingSystems"
                      onChange={(e: any) => setProvSO(e.target.value) }
                      value={provSO}
                      className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                      required 
                    >
                      <option disabled value="" > {defaultSO.length === 0 ? 'Todas as opções já foram selecionadas' : 'Selecione um SO'} </option>
                      {
                        defaultSO.map((defSO: any, index: number) => (
                          <option key={index} value={defSO} className="break-words capitalize"> {defSO} </option>    
                        ))
                      }
                    </select>
                    <button
                      type="button"
                      className="break-words border border-gray-300 p-2 text-sm rounded-lg text-white text-2xl bg-black"
                      onClick={handleSO}
                    >
                      +
                    </button>
                  </div>
                  {
                    data.requirement.operatingSystems.map((so: any, index: number) => (
                      <div
                        key={index}
                        className="break-words bg-white text-black capitalize flex w-full justify-between items-center border border-gray-300 p-2 text-sm rounded-lg"
                      >
                        { so }
                        <MdDelete
                          className="break-words cursor-pointer text-xl"
                          onClick={() => removeSO(so)}
                        />
                      </div>
                    ))
                  }
                  <div className="break-words w-full">
                    <label htmlFor="video" className="break-words block mt-5 mb-2 text-sm font-medium text-white dark:text-white">Carregue seu vídeo</label>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      name="video"
                      id="video"
                      onChange={handleVideo}
                      className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                      placeholder="Insira um valor gráfico" 
                      required 
                    />
                  </div>
                  <div className="break-words w-full">
                    <label htmlFor="image" className="break-words block mt-5 mb-2 text-sm font-medium text-white dark:text-white">Carregue sua Imagem</label>
                    <div className="break-words flex gap-1 w-full">
                      <input 
                        id="image"
                        name="image"
                        type="file"
                        ref={imageInputRef}
                        onChange={handleImage}
                        className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                      />
                      <button
                        className="break-words border border-gray-300 p-2 text-sm rounded-lg text-white bg-black"
                        type="button"
                        onClick={saveImage}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="break-words grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {
                      linkImages.map((linkImg: any, index: number) => (
                        <div key={index} className="break-words border border-gray-300 rounded text-black h-40">
                         { generateImage(linkImg) }
                        </div>
                      ))
                    }
                  </div>
                  <div className="break-words mb-5 w-full">
                    <label htmlFor="date" className="break-words block mt-4 mb-2 text-sm font-medium text-white dark:text-white">Data de Criação / Última atualização</label>
                    <input 
                      type="date"
                      name="date"
                      id="date"
                      value={data.releaseDate}
                      onChange={ (e: any) => setData({
                        ...data,
                        releaseDate: e.target.value,
                      })}
                      className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                      placeholder="Insira um valor gráfico" 
                      required 
                    />
                  </div>
                  <div className="break-words mb-5 w-full">
                    <label htmlFor="publisher" className="break-words block mb-2 text-sm font-medium text-white dark:text-white">Distribuidora</label>
                    <input 
                      type="text"
                      name="publisher"
                      id="publisher"
                      onChange={ (e: any) => setData({
                        ...data,
                        publisher: e.target.value,
                      })}
                      className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                      placeholder="Insira um valor gráfico" 
                      required 
                    />
                  </div>
                  <div className={`${data.developers.length === 0 ? 'mb-2' : 'mb-1'} w-full`}>
                    <label htmlFor="developers" className="break-words block mb-2 text-sm font-medium text-white dark:text-white">Desenvolvedores</label>
                    <div className="break-words flex gap-1">
                      <input 
                        type="text"
                        name="developers"
                        id="developers"
                        value={provDev}
                        onChange={ (e: any) => {
                          const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                          setProvDev(sanitizedValue);
                        }}
                        className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                        placeholder="Insira um Desenvolvedor" 
                        required 
                      />
                      <button
                        type="button"
                        className="break-words border border-gray-300 p-2 text-sm rounded-lg bg-black text-white"
                        onClick={() => {
                          var text = provDev;
                          if ((text[text.length -1]) === ' ') text = text.slice(0, -1);
                          const findItem = data.developers.find((dev: any) => dev === text);
                          if (text === '' || text === ' ') {
                            window.alert('Necessário inserir um nome para o Desenvolvedor!')
                          } else if (findItem) {
                            window.alert('Desenvolvedor já inserido!')
                          } else {
                            setData({
                              ...data,
                              developers: [ ...data.developers, text],
                            });
                          }
                          setProvDev('');
                      }}>
                        +
                      </button>
                    </div>
                    </div>
                    <div className={`${data.developers.length === 0 ? 'mb-0' : 'mb-1'} w-full`}>
                      {
                        data.developers.map((dev: any, index: number) => (
                          <div
                            key={index}
                            className="break-words bg-white text-black capitalize flex w-full justify-between items-center border border-gray-300 p-2 text-sm rounded-lg mb-2"
                          >
                            { dev }
                            <MdDelete
                              className="break-words cursor-pointer text-xl"
                              onClick={() => removeDev(dev)}
                            />
                          </div>
                        ))
                      }
                    </div>
                    <label htmlFor="categories" className="break-words block w-full text-sm font-medium text-white dark:text-white">Categorias</label>
                    <div className="break-words w-full flex gap-1">
                      <select
                        name="categories"
                        id="categories"
                        onChange={(e: any) => setProvCat(e.target.value) }
                        value={provCat}
                        className="break-words shadow-sm w-full bg-black border-violet-500 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        required 
                      >
                        <option disabled value="" > Selecione uma Categoria </option>
                        {
                          listCategories.map((cat: any, index: number) => (
                            <option key={index} value={cat} className="break-words capitalize"> {cat} </option>    
                          ))
                        }
                      </select>
                      <button
                        type="button"
                        className="break-words border border-gray-300 p-2 text-sm rounded-lg bg-black text-white"
                        onClick={handleCat}
                      >
                        +
                      </button>
                    </div>
                    {
                      data.categories.map((cat: any, index: number) => (
                        <div
                          key={index}
                          className="break-words bg-white text-black capitalize flex w-full justify-between items-center border border-gray-300 p-2 text-sm rounded-lg"
                        >
                          { cat }
                          <MdDelete
                            className="break-words cursor-pointer text-xl"
                            onClick={() => removeCategory(cat)}
                          />
                        </div>
                      ))
                    }
                    <button
                      onClick={ checkRegister }
                      disabled={loading}
                      className="break-words relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 w-full mt-3"
                    >
                      <span className="break-words relative px-5 py-2.5 transition-all ease-in duration-75 text-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        { loading ? "Registrando..." : "Registrar" }
                      </span>
                    </button>
                    {
                      loading &&
                      <div className="break-words flex items-center justify-center my-5">
                        <Loading />
                      </div> 
                    }
                  </div>
            }
          </div>
        </div>
      </div>
    </section>
  );
}