'use client'
import { useRef, useState } from "react";
import { MdDelete } from "react-icons/md";

export default function Media() {
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
      category: '',
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

  const handleImage = (e: any) => {
    if (e.target.files[0]) setProvImage(e);
  };

  const saveImage = () => {
    setData({
      ...data,
      linkImages: [...data.linkImages, provImage],
    });
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleVideo = (e: any) => {
    if (e.target.files[0]) {
      setData({
        ...data,
        linkVideo: e.target.value,
      });
    }
  };

  const removeOption = (option: string) => {
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

  return(
    <div className="flex flex-col items-center justify-center gap-2">
      <label>
        Título
        <input
          type="text"
          name="linkVideo"
          value={data.title}
          onChange={ (e: any) => setData({
            ...data,
            title: e.target.value,
          })}
        />
      </label>

      <label>
        Descrição:
        <textarea
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
            type="text"
            name="linkVideo"
            value={data.requirement.processor}
            onChange={ (e: any) => setData({
              ...data,
              requirements: {
                ...data.requirements,
                processor: e.target.value,
              },
            })}
          />
        </label>
        <label>
          Gráficos
          <input
            type="text"
            name="linkVideo"
            value={data.requirement.graphics}
            onChange={ (e: any) => setData({
              ...data,
              requirements: {
                ...data.requirements,
                graphics: e.target.value,
              },
            })}
          />
        </label>
        <label>
          Versão do DirectX
          <input
            type="text"
            name="linkVideo"
            value={data.requirement.directXVersion}
            onChange={ (e: any) => setData({
              ...data,
              requirements: {
                ...data.requirements,
                directXVersion: e.target.value,
              },
            })}
          />
        </label>
        <label>
          Armazenamento
          <input
            type="text"
            name="linkVideo"
            value={data.requirement.storage}
            onChange={ (e: any) => setData({
              ...data,
              requirements: {
                ...data.requirements,
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
                  onClick={() => removeOption(so)}
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
            Image {index + 1}
          </div>
        ))
      }

    <label>
      Data de Criação / Última atualização
      <input
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
            type="text"
            name="linkVideo"
            value={data.developers}
            onChange={ (e: any) => setData({
            ...data,
            developers: e.target.value,
          })}
        />
    </label>
    <label>
        Categoria
        <input
            type="text"
            name="linkVideo"
            value={data.category}
            onChange={ (e: any) => setData({
            ...data,
            category: e.target.value,
          })}
        />
    </label>
    <label>
      Publish Date
      <input
        type="date"
        name="publishDate"
        className="text-black"
        value={data.publishDate}
        onChange={(e) => setData((prevData: any) => ({
          ...prevData,
          publishDate: e.target.value,
        }))}
      />
    </label>

    </div>
  );
}