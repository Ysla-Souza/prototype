'use client'
import { registerCompany, registerUser } from '@/firebase/user';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [company, setCompany] = useState('');
  const [lastName, setLastName] = useState('');
  const [typeUser, setTypeUser] = useState('developer');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const router = useRouter();

  const handleRegisterDev = async () => {
    const validate = /\S+@\S+\.\S+/;
    const vEmail = !email || !validate.test(email) || email === '';
    if (firstName === null || firstName.length < 2) {
      window.alert('Necessário preencher um Nome com mais de 2 caracteres');
    } else if (lastName === null || lastName.length < 2) {
      window.alert('Necessário preencher um Sobrenome com mais de 2 caracteres');
    } else if(vEmail) {
      window.alert('Necessário preencher um Email válido');
    } else if (!password || password.length < 6) {
      window.alert('Necessário inserir uma Senha com pelo menos 6 dígitos');
    } else if (password !== password2) {
      window.alert('As senhas inseridas não conferem');
    } else {
      const reg = await registerUser(
        email,
        password,
        firstName,
        lastName,
        typeUser,
      );
      if (reg) router.push('/home');
    }
    setFirstName('');
    setLastName('');
    setEmail('');
    setTypeUser('developer');
    setPassword('');
    setPassword2('');
  };

  const handleRegisterComp = async () => {
    const validate = /\S+@\S+\.\S+/;
    const vEmail = !email || !validate.test(email) || email === '';
    if (company === null || company.length < 2) {
      window.alert('Necessário preencher um Nome para a Empresa com pelo menos 2 caracteres');
    } else if(vEmail) {
      window.alert('Necessário preencher um Email válido');
    } else if (!password || password.length < 6) {
      window.alert('Necessário inserir uma Senha com pelo menos 6 dígitos');
    } else if (password !== password2) {
      window.alert('As senhas inseridas não conferem');
    } else {
      const reg = await registerCompany(
        email,
        password,
        company,
        typeUser,
      );
      if (reg) router.push('/home');
    }
    setCompany('');
    setEmail('');
    setTypeUser('developer');
    setPassword('');
    setPassword2('');
  };
  
  return(
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-full lg:py-0">
       <div className="md:my-5 w-full bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Cadastro
            </h1>
            <div className="w-full">
            <div className="mb-5">
              <label htmlFor="input-desenvolvedor" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white flex cursor-pointer">
                <input 
                  type="radio" 
                  id="input-desenvolvedor"
                  name="type-user"
                  onClick={(e) => setTypeUser('developer')}
                  className="mr-2"
                  checked={typeUser === 'developer'}
                  required 
                />
                Sou um Desenvolvedor
              </label>
              <label htmlFor="input-empresa" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white flex cursor-pointer">
                <input 
                  type="radio" 
                  id="input-empresa"
                  name="type-user"
                  onClick={(e) => setTypeUser('company')}
                  className="mr-2"
                  required 
                />
                Represento uma Empresa
              </label>
            </div>
            {
              typeUser === 'company' &&
              <div className="mb-5">
                <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome da Empresa</label>
                <input 
                  type="company"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                  placeholder="Insira o nome da Empresa" 
                  required 
                />
              </div>
            }
            {
              typeUser === 'developer' &&
              <div>
                <div className="mb-5">
                  <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                  <input 
                    type="firstName"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                    placeholder="Insira seu primeiro nome" 
                    required 
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sobrenome</label>
                  <input 
                    type="lastName"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                    placeholder="Insira seu último nome" 
                    required 
                  />
                </div>
              </div>
            }
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input 
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                  placeholder="name@flowbite.com" 
                  required 
                />
              </div>
              <div className="mb-5">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <div className="mb-5">
                <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repita a Senha</label>
                <input 
                  type="password" 
                  id="repeat-password" 
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <button 
                type="button"
                onClick={ () => {
                  if (typeUser === 'developer') {
                    handleRegisterDev();
                  } else handleRegisterComp();
                }}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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