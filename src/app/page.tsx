'use client'
import { createVideo, getAllVideos } from '@/firebase/storage';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react';

const firebaseConfig = {
    apiKey: "AIzaSyDugptWWK6AM3Dkc9zSt5ZcJAGOyTjSx7w",
    authDomain: "uploadreact-85d68.firebaseapp.com",
    projectId: "uploadreact-85d68",
    storageBucket: "uploadreact-85d68.appspot.com",
    messagingSenderId: "642741037500",
    appId: "1:642741037500:web:8b7659add544af2e28a3b9",
    measurementId: "G-X4S0NFGFK4"
};

export default function App() {
    //estado para armazenar o vídeo que está sendo carregado
    const [video, setVideo] = useState<any>(null);

    //estado que armazena a url do video recém-carregado
    const [videoUrl, setVideoUrl] = useState<any>('');

    //estado que recebe a lista de vídeos armazenados no storage
    const [files, setFiles] = useState<any>([]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const fetchFiles = async () => {
        const getAll = await getAllVideos();
        setFiles(getAll);
    };
    //hook que é o primeiro a executar quando o componente é carregado
    useEffect(() => {
        fetchFiles();
    }, []);

    const addVideo = async () => {
        const createV = await createVideo(video);
        setVideoUrl(createV);
        fetchFiles();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        };

    const handleImageChange = (e: any) => {
        if (e.target.files[0]) {
            setVideo(e.target.files[0]);
        }
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            Olá
            <input type="file" ref={fileInputRef} onChange={handleImageChange} />
            <button
                type="button"
                onClick={addVideo}
            >
                Carregar imagem
            </button>

            {
                files.length > 0 && files.map((file: any, index: number) => (
                    <video key={index} width="640" height="360" controls>
                        <source src={file.url} type="video/mp4" />
                        Seu navegador não suporta o elemento de vídeo.
                    </video>
                ))
            }
        </main>
    )
}
