import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import Packages from './pages/Packages'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import PackageDetails from './pages/PackageDetails'
import Cart from './pages/Cart'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Packages' element={<Packages />} />
        <Route path='/Packages/:speciality' element={<Packages />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/book/:testId' element={<PackageDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/appointment' element={<Appointment />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App