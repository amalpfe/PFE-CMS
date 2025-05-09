import { useState } from "react";

const Login = () => {
  const [role, setRole] = useState<"Admin" | "Doctor">("Admin");

  const toggleRole = () => {
    setRole((prev) => (prev === "Admin" ? "Doctor" : "Admin"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-purple-600">
        <div className="mb-6 text-center">
          <p className="text-2xl font-semibold text-purple-600">
            <span className="font-bold">{role}</span> Login
          </p>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-purple-600 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-4 py-2 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder={`${role.toLowerCase()}@example.com`}
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-purple-600 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="w-full px-4 py-2 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="********"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          Login
        </button>

        {/* Toggle Login Type */}
        <div className="mt-4 text-center">
          <p className="text-sm text-purple-600">
            {role === "Admin" ? "Doctor" : "Admin"} Login?{" "}
            <button
              type="button"
              onClick={toggleRole}
              className="underline hover:text-purple-800 font-medium"
            >
              Click here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
