import type { FC } from 'react';

const Navbar: FC = () => {
  return (
    <header className="bg-purple-50 border-b border-purple-200 shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-purple-800 tracking-tight">Clinic Staff Panel</h1>
      <button className="text-sm text-purple bg-purple-600 px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition">
        Logout
      </button>
    </header>
  );
};

export default Navbar;
