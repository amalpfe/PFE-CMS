import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo2.png';
import { useState } from 'react';
import prof from '../assets/profilee_icon.png';
import drop from '../assets/drop_icon.png';

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);

  return (
<div className="flex items-center justify-between px-6 py-2 bg-white shadow-sm rounded-xl mb-4 border border-gray-200">
      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="w-24 cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={() => navigate('/')}
      />

<ul className='hidden md:flex items-start gap-5 font-medium'>
  {[
    { label: 'HOME', to: '/' },
    { label: 'ALL DOCTORS', to: '/doctors', requiresAuth: true },
    { label: 'ABOUT', to: '/about' },
    { label: 'CONTACT', to: '/contact' },
  ].map((item) => (
    <li
      key={item.to}
      className='py-2 relative group cursor-pointer'
      onClick={() => {
        if (item.requiresAuth && !token) {
          alert('Please login to access this page.');
        } else {
          navigate(item.to);
        }
      }}
    >
      <span className={`${location.pathname === item.to ? 'text-purple-700' : ''}`}>
        {item.label}
      </span>
      <span
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-3/5 bg-purple-700 transition-opacity duration-200 ${
          location.pathname === item.to
            ? 'opacity-100'
            : 'opacity-0 group-hover:opacity-60'
        }`}
      ></span>
    </li>
  ))}
</ul>

      <a 
  href="/assistant" 
  className="text-purple-700 hover:text-purple-900 font-semibold text-lg py-2 px-4 rounded-lg hover:bg-purple-100 transition duration-300"
>
  AI Assistant
</a>

      <div className='flex items-center gap-4'>
        {token ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img   className="w-7 h-7 rounded-full ring-2 ring-purple-300 shadow"src={prof} alt='Profile' />
            <img className='w-4' src={drop} alt='Dropdown icon' />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointment</p>
                {token && (
    <p onClick={() => navigate('medical-reports')} className='hover:text-black cursor-pointer'>
      Medical Reports
    </p>
  )}
                <p onClick={() => setToken(false)} className="hover:text-red-500 cursor-pointer">Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-purple-700 text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-purple-600 transition duration-200 shadow-md'
          >
            Create account
          </button>
        )}
       


      </div>
    </div>
  );
}

export default Navbar;
