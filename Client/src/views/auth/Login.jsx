import React, { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import UserLogo from '../../assets/user-login.png'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    localStorage.setItem('userData', JSON.stringify(formData))
    navigate('/dashboard', {replace: true})
  }

  return ( 
    <div className='h-full flex flex-col justify-center items-center space-y-8'>
      <LazyLoadImage src={UserLogo} className='w-20 h-20 bg-primary p-3 rounded-full' />
      
      <div className='text-center'>
        <h1 className='text-xl md:text-2xl font-bold'>Sign in to your account</h1>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6 w-9/12 md:w-1/2'>
        <div>
          <label className='font-semibold'>Username</label>
          <input
            placeholder='username'
            name='username'
            type="text"
            className='w-full mt-1 px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-primary focus:border-primary'
            onChange={handleChange}
          />
        </div>
        <div>
          <label className='font-semibold'>Passoword</label>
          <input
            placeholder='password'
            name='password'
            type="password"
            className='w-full mt-1 px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-primary focus:border-primary'
            onChange={handleChange}
          />
        </div>
      </form>

      <button onClick={handleSubmit} className='bg-primary hover:bg-blckprimary w-9/12 md:w-1/2 p-2 rounded-xl text-white font-semibold'>
        Sign In
      </button>

    </div>
  )
}

export default Login