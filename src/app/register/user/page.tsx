'use client'
import Loading from '@/components/loading';
import { registerUser } from '@/firebase/user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegisterDev = async () => {
    setLoading(true);
    const validate = /\S+@\S+\.\S+/;
    const vEmail = !email || !validate.test(email) || email === '';
    if (firstName.length < 2 && typeUser === 'developer') {
      window.alert('Necessário preencher um Nome com mais de 2 caracteres');
    } else if (lastName.length < 2 && typeUser === 'developer') {
      window.alert('Necessário preencher um Sobrenome com mais de 2 caracteres');
    } else if (company.length < 2 && typeUser === 'company') {
      window.alert('Necessário preencher um Nome para a Empresa com pelo menos 2 caracteres');
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
    setLoading(false);
  };

  const handleImage = (e: any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return(
    <section className="break-words bg-dice bg-center bg-fixed min-h-screen w-full items-center justify-center">
    <div className="break-words flex flex-col items-center justify-center px-6 py-8 mx-auto h-full lg:py-0">
       <div className="break-words border-2 border-prot-light md:my-5 w-full rounded-lg shadow bg-black/90">
          <div className="break-words p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="break-words flex items-center justify-between w-full">
              <h1 className="break-words text-xl font-bold leading-tight tracking-tight text-white md:text-2xl text-white">
                  Cadastro
              </h1>
              <FiArrowRight
                className="break-words text-white text-3xl cursor-pointer"
                onClick={ () => router.push('/') }
              />
            </div>
            <div className="break-words w-full">
            <div className="break-words mb-5">
              <label
                htmlFor="input-desenvolvedor"
                className="break-words block mb-2 text-sm font-medium text-white flex cursor-pointer items-center gap-2"
                onClick={(e) => setTypeUser('developer')}
              >
                <div className="break-words rounded-full h-5 w-5 border-2 border-violet-400 flex items-center justify-center">
                  {
                    typeUser === 'developer'
                    && <Image
                        src="/faceInvader.png"
                        className="break-words w-3 h-3 object-cover"
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
                className="break-words block mb-2 text-sm font-medium text-white flex cursor-pointer items-center gap-2"
                onClick={(e) => setTypeUser('company')}
              >
                <div className="break-words rounded-full h-5 w-5 border-2 border-violet-400 flex items-center justify-center">
                  {
                    typeUser === 'company'
                    && <Image
                        src="/faceInvader.png"
                        className="break-words w-3 h-3 object-cover"
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
              <div className="break-words mb-5">
                <label htmlFor="company" className="break-words block mb-2 text-sm font-medium text-white">Nome da Empresa</label>
                <input 
                  type="company"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="break-words shadow-sm w-full bg-black border border-violet-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400" 
                  placeholder="Insira o nome da Empresa" 
                  required 
                />
              </div>
            }
            {
              typeUser === 'developer' &&
              <div>
                <div className="break-words mb-5">
                  <label htmlFor="firstName" className="break-words block mb-2 text-sm font-medium text-white">Nome</label>
                  <input 
                    type="firstName"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value.toLowerCase())}
                    className="break-words shadow-sm w-full bg-black border border-violet-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400" 
                    placeholder="Insira seu primeiro nome" 
                    required 
                  />
                </div>
                <div className="break-words mb-5">
                  <label htmlFor="lastName" className="break-words block mb-2 text-sm font-medium text-white">Sobrenome</label>
                  <input 
                    type="lastName"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value.toLowerCase())}
                    className="break-words shadow-sm w-full bg-black border border-violet-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400" 
                    placeholder="Insira seu último nome" 
                    required 
                  />
                </div>
              </div>
            }
              <div className="break-words mb-5">
                <label htmlFor="email" className="break-words block mb-2 text-sm font-medium text-white">Email</label>
                <input 
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="break-words shadow-sm w-full bg-black border border-violet-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400" 
                  placeholder="name@flowbite.com" 
                  required 
                />
              </div>
              <div className="break-words mb-5">
                <label htmlFor="description" className="break-words block mb-2 text-sm font-medium text-white">Fale um pouco sobre você</label>
                <textarea 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="break-words shadow-sm w-full bg-black border border-violet-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400" 
                  placeholder="Quem é você?" 
                  required 
                />
              </div>
              <div className="break-words mb-5">
                <label htmlFor="description" className="break-words block mb-2 text-sm font-medium text-white">Escolha uma Imagem para seu perfil</label>
                  <input 
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleImage}
                    className="break-words shadow-sm w-full bg-black border border-violet-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                  />
              </div>
              <div className="break-words mb-5">
                <label htmlFor="password" className="break-words block mb-2 text-sm font-medium text-white">Senha</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="break-words shadow-sm bg-black border border-violet-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                  placeholder="••••••" 
                  required 
                />
              </div>
              <div className="break-words mb-5">
                <label htmlFor="repeat-password" className="break-words block mb-2 text-sm font-medium text-white">Repita a Senha</label>
                <input 
                  type="password" 
                  id="repeat-password" 
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="break-words shadow-sm bg-black border border-violet-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                  placeholder="••••••" 
                  required 
                />
              </div>
              <button 
                type="button"
                onClick={ handleRegisterDev }
                className="break-words relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 w-full"
              >
                <span className="break-words relative px-5 py-2.5 transition-all ease-in duration-75 text-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  { loading ? 'Registrando, por favor aguarde' : 'Registrar' }
                </span>
              </button>
            </div>
          { loading && <Loading /> }
          </div>
        </div>
      </div> 
    </section>
  );
}
  
  export default Register;