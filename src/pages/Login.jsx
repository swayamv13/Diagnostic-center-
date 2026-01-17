import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

const Login = () => {
  const [state, setState] = useState('Sign In') // 'Sign In' or 'Sign Up'

  // Email State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const { setToken } = useContext(AppContext)
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  // --- EMAIL AUTH HANDLERS ---
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (state === 'Sign Up') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (error) {
      console.error("Email Auth Error:", error);
      alert(error.message);
    }
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center section-padding py-10'>
      <div className='bg-white rounded-2xl shadow-2xl flex overflow-hidden max-w-4xl w-full border border-gray-100'>

        {/* Left Side */}
        <div className='hidden md:flex w-1/2 bg-gradient-to-br from-primary to-teal-800 p-10 flex-col justify-between relative overflow-hidden'>
          <div className='z-10'>
            <h2 className='text-3xl font-bold text-white mb-2'>
              {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className='text-teal-100'>Your innovative path to better health starts here.</p>
          </div>
          <div className='absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/30 rounded-full blur-3xl'></div>
        </div>

        {/* Right Side - Form */}
        <div className='w-full md:w-1/2 p-10 flex flex-col justify-center'>

          <h2 className='text-2xl font-bold text-gray-900 mb-6'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>

          {/* --- EMAIL FORM --- */}
          <form onSubmit={handleEmailAuth} className='flex flex-col gap-4'>
            {state === 'Sign Up' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                <input
                  required
                  type="text"
                  className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary outline-none'
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
              <input
                required
                type="email"
                className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary outline-none'
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
              <input
                required
                type="password"
                className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary outline-none'
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className='bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark shadow-lg mt-2'>
              {state === 'Sign Up' ? 'Create Account' : 'Login'}
            </button>

            <p className='text-center text-sm text-gray-600 mt-2'>
              {state === 'Sign Up' ? "Already have an account? " : "Don't have an account? "}
              <span onClick={() => setState(state === 'Sign Up' ? 'Sign In' : 'Sign Up')} className='text-primary font-bold cursor-pointer hover:underline'>
                {state === 'Sign Up' ? 'Login' : 'Sign Up'}
              </span>
            </p>
          </form>

          <div className='flex items-center gap-4 my-6'>
            <div className='h-[1px] bg-gray-200 flex-1'></div>
            <span className='text-sm text-gray-400'>OR</span>
            <div className='h-[1px] bg-gray-200 flex-1'></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className='w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700'
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className='w-5 h-5' />
            Continue with Google
          </button>

        </div>
      </div>
    </div>
  )
}

export default Login