// import { useContext, useState, FormEvent } from 'react';
// import logo from '../assets/logo2.png';
// import { AdminContext } from '../context/AdminContext';
// import axios from 'axios';

// interface LoginResponse {
//   success: boolean;
//   token: string;
// }

// const Login = () => {
//   const [state, setState] = useState<'Admin' | 'Doctor'>('Admin');
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');

//   const { setAToken, backendUrl } = useContext(AdminContext);

//   const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     try {
//       let endpoint = state === 'Admin' ? '/api/admin/login' : '/api/doctor/login';
//       const { data } = await axios.post<LoginResponse>(`${backendUrl}${endpoint}`, {
//         email,
//         password,
//       });

//       if (data.success) {
//         console.log('Token:', data.token);
//         setAToken(data.token);
//       }
//     } catch (error: any) {
//       console.error('Login failed:', error?.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <form onSubmit={onSubmitHandler} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-6">
//           <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-2" />
//           <p className="text-2xl font-semibold text-purple-700">
//             {state} <span className="text-gray-800">Login</span>
//           </p>
//         </div>

//         {/* Role Switcher */}
//         <div className="flex justify-center gap-4 mb-6">
//           <button
//             type="button"
//             onClick={() => setState('Admin')}
//             className={`px-4 py-2 rounded-full border transition ${
//               state === 'Admin' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'
//             }`}
//           >
//             Admin
//           </button>
//           <button
//             type="button"
//             onClick={() => setState('Doctor')}
//             className={`px-4 py-2 rounded-full border transition ${
//               state === 'Doctor' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'
//             }`}
//           >
//             Doctor
//           </button>
//         </div>

//         {/* Email Field */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-1">Email</label>
//           <input
//             type="email"
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//             placeholder="you@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         {/* Password Field */}
//         <div className="mb-6">
//           <label className="block text-gray-700 font-medium mb-1">Password</label>
//           <input
//             type="password"
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//             placeholder="••••••••"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
