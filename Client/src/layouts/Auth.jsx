import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import NotFound from '../views/main/Notfound'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import LoginBg from '../assets/cover-homepage.png'
import { AuthRoutes } from '../routes'

const getRoutes = () => {
  return AuthRoutes.map((data, key) => {
    return <Route path={ data.path } element={ data.component } key={ key }/>
  })
}
const Auth = () => {
  return (
    <div className='bg-[#eee] min-h-screen flex justify-center items-center font-poppins'>
      <div className='relative w-[1366px] h-[768px] grid grid-cols-1 md:grid-cols-2'>
        <LazyLoadImage src={LoginBg} className='hidden md:block w-full h-full 2xl:rounded-tl-xl 2xl:rounded-bl-xl bg-white' />
        
        <div className='absolute top-0 right-0 w-full md:w-1/2 h-full overflow-hidden bg-white 2xl:rounded-tr-xl 2xl:rounded-br-xl z-10'>
          <Routes>
            {getRoutes()}
            <Route path='*' element={<NotFound />} />
            <Route path='/' element={<Navigate replace to='/auth/sign-in'/>} />
          </Routes>
        </div>

      </div>
    </div>
  )
}

export default Auth