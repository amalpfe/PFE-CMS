import { NavLink } from 'react-router-dom';
import logo from '../assets/logo2.png';

function Navbar() {
  return (
    <div className='flex items-center justify-between text-sm py-1 mb-5 border-b border-b-gray-400'>
      <img src={logo} alt="" className="w-25 h-auto cursor-pointer" />
      <ul className='hidden md:flex items-start gap-5 front-medium'>
        <NavLink to='/'>
            <li className='py-1'>
                HOME
            </li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors'>
            <li className='py-1'>
                ALL DOCTORS
            </li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'  />
        </NavLink>
        <NavLink to='/about'>
            <li className='py-1'>
                ABOUT
            </li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'  />
        </NavLink>
        <NavLink to='/contact'>
            <li className='py-1'>
                CONTACT
            </li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'  />
        </NavLink>
      </ul>
      <button>Create account</button>
    </div>
  )
}

export default Navbar
