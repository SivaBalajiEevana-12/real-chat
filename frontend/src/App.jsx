import React, { useEffect } from 'react'
import NavBar from './components/NavBar'
import { Routes ,Route, Navigate} from 'react-router-dom'
import Home from './components/Home'
import Signup from './components/Signup'
import Login from './components/Login'
import SettingsPage from './components/SettingsPage'
import ProfilePage from './components/ProfilePage'
import AuthStore from '../store/AuthStore'
import {Loader} from 'lucide-react'
import { ThemeStore } from '../store/ThemeStore'
// ThemeStore



const App = () => {
  const {authUser,isCheckingAuth}=AuthStore();
  // const { authUser, isCheckingAuth } = AuthStore();
  const checkAuth = AuthStore(state => state.checkAuth);
  // const s=true 
  useEffect(()=>{
    checkAuth();
  },[checkAuth])
  const {theme}=ThemeStore();
  console.log(authUser);
  console.log('isCheckingAuth:', isCheckingAuth);
  if(isCheckingAuth && !authUser)
    return(
<div className='flex items-center justify-center h-screen'> 
  <Loader className='size-10 animate-spin'/>
</div>
  )
  return (
    <div data-theme={theme} >
      <NavBar/>
    <Routes>
      <Route path='/' element={authUser?<Home/> :<Navigate to='/login'/>}/>
      <Route path='signup' element={!authUser?<Signup/>:<Navigate to='/'/>}/>
      <Route path='login' element={!authUser?<Login/>:<Navigate to='/'/>}/>
      <Route path='/settings' element={<SettingsPage/>}/>
      <Route path='/profile' element={authUser? <ProfilePage/> :<Navigate to='/login'/>}/> 
      </Routes>
    </div>
  )
}

export default App
