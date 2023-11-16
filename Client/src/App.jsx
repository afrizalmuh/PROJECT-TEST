import { useState } from 'react'
import Login from './views/auth/Login'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Auth from './layouts/Auth'
import Dashboard from './layouts/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='font-poopins'>
      <Router>
        <Routes>
          <Route path='' element={<Navigate to="/auth" replace={true} /> } />
          <Route path='/auth/*' element={<Auth />} />
          <Route path='/dashboard/*' element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
