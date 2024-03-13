'use client'
import { categories } from '@/categories';
import { registerVideo } from '@/firebase/video';
import Image from 'next/image';
import { useRef, useState } from "react";
import { MdDelete } from "react-icons/md";

export default function Media() {
  const [listCategories, setListCategories] = useState<any>(categories.sort());
  const [provCat, setProvCat] = useState<any>('');
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
      linkImages: [],
      categories: [],
      publishDate: '',
      reviews: [],
    },
  );
    
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  
  const handleSO = () => {
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
  }

  const handleCat = () => {
    setData({
      ...data,
      categories: [ ...data.categories, provCat ],
      }
    );
    const newOptions = listCategories.filter((defCat: any) => defCat !== provCat);
    setListCategories(newOptions);
    setProvCat('');
  }

  const handleImage = (e: any) => {
    if (e.target.files[0]) setProvImage(e.target.files[0]);
    
  };

  const generateImage = (file:any) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      return (
        <div className="image-container" key={imageUrl}>
          <Image src={imageUrl} alt="Imagem" width={500} height={500} />
          <MdDelete onClick={() => removeImg(file)} />
        </div>
      );
    }
    return null;
  };

  const saveImage = () => {
    console.log(provImage);
    if(provImage || provImage !== ''){
      setData({
        ...data,
        linkImages: [...data.linkImages, provImage],
      });
    }
    if (imageInputRef.current) imageInputRef.current.value = '';
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
    setData({
      ...data,
        linkImages: data.linkImages.filter((rmSo: any) => rmSo !== option),
    })
  }

  const checkRegister = async () => {
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
    } else if (data.linkImages.length === 0) {
      window.alert('Necessario adicionar pelo menos uma imagem');
    } else if (data.releaseDate === '') {
      window.alert('Necessario preencher uma Data de Criação / Última atualização válida');
    } else if (data.developers.length === 0) {
      window.alert('Necessario adicionar pelo menos um desenvolvedor');
    } else if (data.categories.length === 0) {
      window.alert('Necessario adicionar pelo menos uma categoria');
    } else await registerVideo(data);
  }

  return(
    <div className="flex flex-col items-center justify-center gap-2">
      <label>
        Título
        <input
          className="text-black"
          type="text"
          name="linkVideo"
          value={data.title}
          onChange={ (e: any) => setData({
            ...data,
            title: e.target.value,
          })}
          style={{
            border: '2px solid #3498db', // Example border color
            borderRadius: '5px', // Example border radius
            padding: '8px', // Example padding
            fontSize: '16px', // Example font size
            // Add more styles as needed
          }}
        />
      </label>

      <label>
        Descrição:
        <textarea
          className="text-black"
          name="description"
          value={data.description}
          onChange={ (e: any) => setData({
            ...data,
            description: e.target.value,
          })}
        />
      </label>

      <div className="flex flex-col items-center justify-center gap-2">
        <label>
          Memória
          <input
            className="text-black"
            type="text"
            name="linkVideo"
            value={data.requirement.memory}
            onChange={ (e: any) => setData({
              ...data,
              requirement: {
                ...data.requirement,
                memory: e.target.value,
              },
            })}
          />
        </label>
        <label>
          Processador
          <input
            className="text-black"
            type="text"
            name="linkVideo"
            value={data.requirement.processor}
            onChange={ (e: any) => setData({
              ...data,
              requirement: {
                ...data.requirement,
                processor: e.target.value,
              },
            })}
          />
        </label>
        <label>
          Gráficos
          <input
            className="text-black"
            type="text"
            name="linkVideo"
            value={data.requirement.graphics}
            onChange={ (e: any) => setData({
              ...data,
              requirement: {
                ...data.requirement,
                graphics: e.target.value,
              },
            })}
          />
        </label>
        <label>
          Versão do DirectX
          <input
          className="text-black"
            type="text"
            name="linkVideo"
            value={data.requirement.directXVersion}
            onChange={ (e: any) => setData({
              ...data,
              requirement: {
                ...data.requirement,
                directXVersion: e.target.value,
              },
            })}
          />
        </label>
        <label>
          Armazenamento
          <input
          className="text-black"
            type="text"
            name="linkVideo"
            value={data.requirement.storage}
            onChange={ (e: any) => setData({
              ...data,
              requirement: {
                ...data.requirement,
                storage: e.target.value,
              },
            })}
          />
        </label>
        <label>
          Sistemas Operacionais
          <select
            id="operation-system"
            onChange={(e: any) => setProvSO(e.target.value) }
            value={provSO} className='text-black capitalize'
          >
            <option disabled value="" > {defaultSO.length === 0 ? 'Todas as opções já foram selecionadas' : 'Selecione um SO'} </option>
            {
              defaultSO.map((defSO: any, index: number) => (
                <option key={index} value={defSO} className="capitalize"> {defSO} </option>    
              ))
            }
          </select>
          <button
            type="button"
            onClick={handleSO}>
            +
          </button> 
          {
            data.requirement.operatingSystems.map((so: any, index: number) => (
              <div key={index} className="bg-white text-black capitalize">
                { so }
                <MdDelete
                  onClick={() => removeSO(so)}
                 />
              </div>
            ))
          }
        </label>
      </div>

      <label>
        Carregue seu vídeo:
        <input type="file" ref={fileInputRef} onChange={handleVideo} />
      </label>

      <label>
        Carregue sua Imagem:
        <input type="file" onChange={handleImage} ref={imageInputRef} />
        <button type="button" onClick={saveImage}>
          +
        </button>
      </label>

      {
        data.linkImages.map((linkImg: any, index: number) => (
          <div key={index} className="bg-white text-black">
            {generateImage(linkImg)}
          </div>
        ))
      }

    <label>
      Data de Criação / Última atualização
      <input
      className="text-black"
        type="date"
        value={data.releaseDate}
        onChange={ (e: any) => setData({
          ...data,
          releaseDate: e.target.value,
        })}
      />
    </label>
    <label>
        Distribuidora
        <input
        className="text-black"
            type="text"
            name="linkVideo"
            value={data.publisher}
            onChange={ (e: any) => setData({
            ...data,
            publisher: e.target.value,
          })}
        />
    </label>
    <label>
        Desenvolvedores
        <input
          className="text-black"
          type="text"
          name="linkVideo"
          value={provDev}
          onChange={ (e: any) => setProvDev(e.target.value)}
        />
        <button type="button" onClick={() => {
          const findItem = data.developers.find((dev: any) => dev === provDev);
          console.log(findItem);
          if (findItem) {
            window.alert('Desenvolvedor já inserido!')
          } else {
            setData({
              ...data,
              developers: [ ...data.developers, provDev],
            });
          }
          setProvDev('');
        }}>
          +
        </button>
        {
            data.developers.map((dev: any, index: number) => (
              <div key={index} className="bg-white text-black capitalize">
                { dev }
                <MdDelete
                  onClick={() => removeDev(dev)}
                 />
              </div>
            ))
          }
    </label>
    
    <label>
        Categorias
          <select
            id="categories"
            onChange={(e: any) => setProvCat(e.target.value) }
            value={provCat} className='text-black capitalize'
          >
            <option disabled value="" > Selecione uma Categoria </option>
            {
              listCategories.map((cat: any, index: number) => (
                <option key={index} value={cat} className="capitalize"> {cat} </option>    
              ))
            }
          </select>
          <button
            type="button"
            onClick={handleCat}>
            +
          </button> 
          {
            data.categories.map((cat: any, index: number) => (
              <div key={index} className="bg-white text-black capitalize">
                { cat }
                <MdDelete
                  onClick={() => removeCategory(cat)}
                 />
              </div>
            ))
          }
        </label>

    <button onClick={ checkRegister }>Registrar</button>


    </div>
   
  );
}