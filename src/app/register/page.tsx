'use client'
import { registerUser } from '@/firebase/user';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    const validate = /\S+@\S+\.\S+/;
    const vEmail = !email || !validate.test(email) || email === '';
    if(vEmail) {
      window.alert('Necessário preencher um Email válido');
    } else if (!password || password.length < 6) {
      window.alert('Necessário inserir uma Senha com pelo menos 6 dígitos');
    } else if (password !== password2) {
      window.alert('As senhas inseridas não conferem');
    } else {
      const reg = await registerUser(email, password);
      if (reg) router.push('/home');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-3 h-screen">
          <h2>Registro</h2>
          <label htmlFor="email" className="flex flex-col">
            Email:
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black p-2"
            />
          </label>
          <label htmlFor="password" className="flex flex-col">
            Senha:
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black"
            />
          </label>
          <label htmlFor="password" className="flex flex-col">
            Repita a Senha:
            <input
              type="password"
              id="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="text-black"
            />
          </label>
         <button onClick={handleRegister}>Registrar</button>
      </div>
    </div>
  );
};

export default Register;
