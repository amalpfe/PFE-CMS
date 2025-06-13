import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { specialityData } from '../assets/assets';

function Speciality() {
  const navigate = useNavigate();
  const [token, setToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(!!savedToken);
  }, []);

  const handleSpecialityClick = (speciality: string) => {
    if (!token) {
      setErrorMessage('❗ Please login to access this page..');
         setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    setErrorMessage('');
    scrollTo(0, 0);
    navigate(`/doctors/${speciality}`);
  };

  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-4 py-16 text-gray-800"
    >
      <h1 className="text-3xl font-medium">Find By Speciality</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors,
        schedule your appointment hassle-free.
      </p>

      <div className="flex sm:justify-center gap-6 w-full overflow-x-auto scrollbar-hide px-4 mt-6">
        {specialityData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center min-w-[100px] transition-transform duration-300 hover:scale-101 cursor-pointer"
            onClick={() => handleSpecialityClick(item.speciality)}
          >
            <img
              className="w-16 sm:w-20 mb-2.5 object-contain transition-transform duration-300 hover:scale-101"
              src={item.image}
              alt={item.speciality}
            />
            <p className="text-sm font-medium text-center transition-colors duration-300 hover:text-purple-700">
              {item.speciality}
            </p>
          </div>
        ))}
      </div>

      {/* Inline error message */}
      {errorMessage && (
        <div className="mt-6 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md shadow-sm">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default Speciality;
