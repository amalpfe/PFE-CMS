import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/logo2.png';
import prof from '../assets/profilee_icon.png';
import drop from '../assets/drop_icon.png';
import bell from '../assets/bell-icon.png';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    setToken(!!savedToken);

    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        const id = parsedUser.id;
        setUserId(id);

        // ✅ Fetch updated user data (with image) from backend
        fetch(`http://localhost:5000/patient/profile/${id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.image && !data.image.startsWith('data:image')) {
              data.image = `data:image/jpeg;base64,${data.image}`;
            }
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data)); // Update localStorage
          })
          .catch((err) => {
            console.error('Error fetching user from backend:', err);
          });
      } catch (err) {
        console.error('Error parsing user from localStorage:', err);
        setUser(null);
        setUserId(null);
      }
    }
  }, []);

  const handleProtectedNav = (to: string, requiresAuth: boolean) => {
    if (requiresAuth && !token) {
      setErrorMessage('❗ Please login to access this page.');
      setTimeout(() => setErrorMessage(''), 3000);
    } else {
      navigate(to);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(false);
    setUserId(null);
    setUser(null);
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 py-2 bg-white shadow-sm rounded-xl mb-4 border border-gray-200 relative">
        <img
          src={logo}
          alt="Logo"
          className="w-24 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => navigate('/')}
        />

        <ul className="hidden md:flex items-start gap-5 font-medium">
          {[
            { label: 'HOME', to: '/' },
            { label: 'ALL DOCTORS', to: '/doctors', requiresAuth: true },
            { label: 'ABOUT', to: '/about' },
            { label: 'CONTACT', to: '/contact' },
          ].map((item) => (
            <li
              key={item.to}
              className="py-2 relative group cursor-pointer"
              onClick={() => handleProtectedNav(item.to, item.requiresAuth || false)}
            >
              <span
                className={`${
                  location.pathname === item.to ? 'text-purple-700' : ''
                }`}
              >
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

        {/* <a
          href="/assistant"
          className="text-purple-700 hover:text-purple-900 font-semibold text-lg py-2 px-4 rounded-lg hover:bg-purple-100 transition duration-300"
        >
          AI Assistant
        </a> */}

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <div className="relative cursor-pointer">
                <img
                  src={bell}
                  alt="Notifications"
                  className="w-6 h-6 hover:scale-110 transition-transform"
                  onClick={() => navigate('/notifications')}
                />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  !
                </span>
              </div>

              <div className="flex items-center gap-2 cursor-pointer group relative">
                <img
                  className="w-7 h-7 rounded-full ring-2 ring-purple-300 shadow object-cover"
                  src={user?.image || prof}
                  alt="Profile"
                />

                <img className="w-4" src={drop} alt="Dropdown icon" />
                <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                  <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                    <p
                      onClick={() => navigate(`/my-profile/${userId}`)}
                      className="hover:text-black cursor-pointer"
                    >
                      My Profile
                    </p>
                    <p
                      onClick={() => navigate('/my-appointments')}
                      className="hover:text-black cursor-pointer"
                    >
                      My Appointment
                    </p>
                    <p
                      onClick={() => navigate('/medical-reports')}
                      className="hover:text-black cursor-pointer"
                    >
                      Medical Reports
                    </p>
                    <p
                      onClick={() => setShowLogoutModal(true)}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      Logout
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-purple-700 text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-purple-600 transition duration-200 shadow-md"
            >
              Create account
            </button>
          )}
        </div>

        {errorMessage && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm shadow-lg z-50">
            {errorMessage}
          </div>
        )}
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
