import type { FC } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 rounded-lg transition-all duration-200
     hover:bg-purple-100 hover:text-purple-700
     ${isActive ? 'bg-purple-300 text-purple-900 font-semibold' : 'text-purple-700'}`;

  return (
    <aside className="w-64 bg-purple-50 border-r border-purple-200 shadow-sm h-full">
      <div className="p-6 text-2xl font-bold text-purple-800"></div>
      <nav className="flex flex-col gap-1 px-4 ">
        <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
        <NavLink to="/appointments" className={navClass}>Appointments</NavLink>
        <NavLink to="/doctors" className={navClass}>Doctors</NavLink>
        <NavLink to="/patients" className={navClass}>Patients</NavLink>
        <NavLink to="/payments" className={navClass}>Payments</NavLink>
        <NavLink to="/reports" className={navClass}>Reports</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
