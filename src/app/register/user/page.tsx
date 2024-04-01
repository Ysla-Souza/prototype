'use client'
import { registerUser } from '@/firebase/user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<any>(null);
  const [company, setCompany] = useState('');
  const [lastName, setLastName] = useState('');
  const [typeUser, setTypeUser] = useState('developer');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const router = useRouter();

  const handleRegisterDev = async () => {
    const validate = /\S+@\S+\.\S+/;
    const vEmail = !email || !validate.test(email) || email === '';
    if (firstName === null || firstName.length < 2 && typeUser === 'developer') {
      window.alert('Necessário preencher um Nome com mais de 2 caracteres');
    } if (company === null || company.length < 2 && typeUser === 'company') {
      window.alert('Necessário preencher um Nome para a Empresa com pelo menos 2 caracteres');
    } else if (lastName === null || lastName.length < 2) {
      window.alert('Necessário preencher um Sobrenome com mais de 2 caracteres');
    } else if(vEmail) {
      window.alert('Necessário preencher um Email válido');
    } else if(description.length < 50) {
      window.alert('Necessário preencher uma auto descrição com pelo menos 50 caracteres');
    } else if(image.length === 0 || image === '') {
      window.alert('Necessário escolher uma imagem de perfil');
    } else if (!password || password.length < 6) {
      window.alert('Necessário inserir uma Senha com pelo menos 6 dígitos');
    } else if (password !== password2) {
      window.alert('As senhas inseridas não conferem');
    } else {
      const reg = await registerUser(
        email,
        password,
        company,
        firstName,
        lastName,
        description,
        image,
        typeUser,
      );
      if (reg) router.push('/home');
      setFirstName('');
      setLastName('');
      setCompany('');
      setEmail('');
      setDescription('');
      setTypeUser('developer');
      setPassword('');
      setPassword2('');
    }
  };

  const handleImage = (e: any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return(
    <section className="bg-dice bg-center bg-fixed min-h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-full lg:py-0">
       <div className="border-2 border-prot-light md:my-5 w-full rounded-lg shadow bg-black/90">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-violet-400 md:text-2xl text-violet-400">
                Cadastro
            </h1>
            <div className="w-full">
            <div className="mb-5">
              <label
                htmlFor="input-desenvolvedor"
                className="block mb-2 text-sm font-medium text-violet-400 flex cursor-pointer items-center gap-2"
                onClick={(e) => setTypeUser('developer')}
              >
                <div className="rounded-full h-7 w-7 border border-violet-400 flex items-center justify-center">
                  {
                    typeUser === 'developer'
                    && <Image
                        src="/faceInvader.png"
                        className="w-5 h-5 object-cover"
                        width={2000}
                        height={2000}
                        alt="background image"
                       />
                  }
                </div>
                Sou um Desenvolvedor
              </label>
              <label
                htmlFor="input-empresa"
                className="block mb-2 text-sm font-medium text-violet-400 flex cursor-pointer items-center gap-2"
                onClick={(e) => setTypeUser('company')}
              >
                <div className="rounded-full h-7 w-7 border border-violet-400 flex items-center justify-center">
                  {
                    typeUser === 'company'
                    && <Image
                        src="/faceInvader.png"
                        className="w-5 h-5 object-cover"
                        width={2000}
                        height={2000}
                        alt="background image"
                       />
                  }
                </div>
                Represento uma Empresa
              </label>
            </div>
            {
              typeUser === 'company' &&
              <div className="mb-5">
                <label htmlFor="company" className="block mb-2 text-sm font-medium text-violet-400">Nome da Empresa</label>
                <input 
                  type="company"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="shadow-sm w-full bg-black border border-violet-400 text-violet-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-violet-400" 
                  placeholder="Insira o nome da Empresa" 
                  required 
                />
              </div>
            }
            {
              typeUser === 'developer' &&
              <div>
                <div className="mb-5">
                  <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-violet-400">Nome</label>
                  <input 
                    type="firstName"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value.toLowerCase())}
                    className="shadow-sm w-full bg-black border border-violet-400 text-violet-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-violet-400" 
                    placeholder="Insira seu primeiro nome" 
                    required 
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-violet-400">Sobrenome</label>
                  <input 
                    type="lastName"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value.toLowerCase())}
                    className="shadow-sm w-full bg-black border border-violet-400 text-violet-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-violet-400" 
                    placeholder="Insira seu último nome" 
                    required 
                  />
                </div>
              </div>
            }
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-violet-400">Email</label>
                <input 
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="shadow-sm w-full bg-black border border-violet-400 text-violet-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-violet-400" 
                  placeholder="name@flowbite.com" 
                  required 
                />
              </div>
              <div className="mb-5">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-violet-400">Fale um pouco sobre você</label>
                <textarea 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="shadow-sm w-full bg-black border border-violet-400 text-violet-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-violet-400" 
                  placeholder="Quem é você?" 
                  required 
                />
              </div>
              <div className="mb-5">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-violet-400">Escolha uma Imagem para seu perfil</label>
                  <input 
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleImage}
                    className="shadow-sm w-full bg-black border border-violet-400 text-violet-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-violet-400"
                  />
              </div>
              <div className="mb-5">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-violet-400">Senha</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow-sm bg-black border border-violet-400 text-violet-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-violet-400"
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <div className="mb-5">
                <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-violet-400">Repita a Senha</label>
                <input 
                  type="password" 
                  id="repeat-password" 
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="shadow-sm bg-black border border-violet-400 text-violet-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-violet-400"
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <button 
                type="button"
                onClick={ handleRegisterDev }
                className="bg-black border-2 border-prot-light transition-colors hover:border-violet-700 text-violet-400 w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:text-violet-700"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div> 
    </section>
  );
}
  
  export default Register;