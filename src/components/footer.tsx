'use client'
import React from 'react';

export default function Footer() {
  return (
    <footer className="text-black bg-gray-300 relative text-white px-6 flex flex-col sm:flex-row justify-between items-center w-full py-2 z-5 bg-gradient-to-t from-blue-mjg to-pink-mjg">
      <div className="pl-0 sm:w-1/4 flex flex-row justify-center sm:justify-start p-2 my-0 text-2xl gap-3 text-black">
      </div>
      <div className="sm:w-3/4 text-sm">
        <p className="mt-2 text-center sm:text-right w-full text-black">© 2024 Ysla Cristin Geraldo de Souza. Todos os direitos reservados.</p>
        <p
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="pt-3 pb-2 sm:py-0 text-center sm:text-right w-full cursor-pointer text-black font-bold hover:underline"
        >
          Retornar ao Topo
        </p>
      </div>
    </footer>
  );
}