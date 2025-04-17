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
    <div className='flex items-center justify-between text-sm py-0 mb-5 border-b border-b-gray-400'>
      <img src={logo} alt="Logo" className="w-30 h-auto cursor-pointer" />

      <ul className='hidden md:flex items-start gap-5 font-medium'>
        {[
          { label: 'HOME', to: '/' },
          { label: 'ALL DOCTORS', to: '/doctors' },
          { label: 'ABOUT', to: '/about' },
          { label: 'CONTACT', to: '/contact' },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => isActive ? 'text-purple-700' : ''}
          >
            <li className='py-2 relative group cursor-pointer'>
              {item.label}
              <span
      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-3/5 bg-purple-700 transition-opacity duration-200 ${
        location.pathname === item.to
          ? 'opacity-100'
          : 'opacity-0 group-hover:opacity-60'
      }`}
    ></span>
            </li>
          </NavLink>
        ))}
      </ul>

      <div className='flex items-center gap-4'>
        {token ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='w-8 rounded-full' src={prof} alt='Profile' />
            <img className='w-4' src={drop} alt='Dropdown icon' />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointment</p>
                <p onClick={() => setToken(false)} className='hover:text-black cursor-pointer'>Logout</p>
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
