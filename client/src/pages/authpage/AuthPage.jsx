import './authPage.css';

import Image from './../../components/image/Image';
import { useState } from 'react';
import apiRequest from '../../utils/apiRequest';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      const res = await apiRequest.post(
        `/users/auth/${isRegister ? 'register' : 'login'}`,
        data
      );

      setCurrentUser(res.data);

      navigate('/');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className='authPage'>
      <div className='authContainer'>
        <Image path='/general/logo.png' w={36} h={36} alt='' />

        {isRegister ? (
          <>
            <h1>Create an Account</h1>
            <form onSubmit={handleSubmit}>
              <div className='formGroup'>
                <label htmlFor='username'>Username</label>
                <input
                  type='text'
                  placeholder='Username'
                  required
                  name='username'
                  id='username'
                />
              </div>
              <div className='formGroup'>
                <label htmlFor='displayName'>Name</label>
                <input
                  type='text'
                  placeholder='Name'
                  required
                  name='displayName'
                  id='displayName'
                />
              </div>
              <div className='formGroup'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  placeholder='Email'
                  required
                  name='email'
                  id='email'
                />
              </div>
              <div className='formGroup'>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  placeholder='Password'
                  required
                  name='password'
                  id='password'
                />
              </div>
              <button type='submit'>Register</button>
              <p>
                Do you have an account?{' '}
                <b onClick={() => setIsRegister(false)}>Login</b>
              </p>
              {error && <p className='error'>{error}</p>}
            </form>
          </>
        ) : (
          <>
            <h1>Login to your account</h1>
            <form onSubmit={handleSubmit}>
              <div className='formGroup'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  placeholder='Email'
                  required
                  name='email'
                  id='email'
                />
              </div>
              <div className='formGroup'>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  placeholder='Password'
                  required
                  name='password'
                  id='password'
                />
              </div>
              <button type='submit'>Login</button>
              <p>
                Don&apos;t have an account?{' '}
                <b onClick={() => setIsRegister(true)}>Register</b>
              </p>
              {error && <p className='error'>{error}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
