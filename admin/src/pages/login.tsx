// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
const Login = () => {
  const [role, setRole] = useState<"Admin" | "Doctor">("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Use navigate for navigation

  const toggleRole = () => {
    setRole((prev) => (prev === "Admin" ? "Doctor" : "Admin"));
  };



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    setMessage("Please enter a valid email.");
    return;
  }

  if (!password) {
    setMessage("Please enter a password.");
    return;
  }

  setIsLoading(true);
  setMessage("");

  try {
    // Construct URL depending on role
    const url =
      role === "Admin"
        ? "http://localhost:5000/auth/login/admin"
        : "http://localhost:5000/auth/login/doctor";

    const response = await axios.post(url, {
      email,
      password,
    });

    const {  message ,token} = response.data;
    let userRole: string | undefined;
    if (response.data.role) {
      userRole = response.data.role; // ideal case
    } else if (response.data.doctor) {
      userRole = "Doctor";
    } else if (response.data.admin) {
      userRole = "Admin";
    }
    localStorage.setItem('token', token);
    
    setMessage(message || "Login successful!");
    if (userRole === "Admin") {
      navigate("/admin/dashboard");
    } else if (userRole === "Doctor") {
      navigate("/doctor/dashboard");
    } else {
      setMessage("Access denied: Only Admin or Doctor roles are supported here.");
    }
  } catch (error: any) {
    setMessage(
      error.response?.data?.message || "Login failed. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-purple-600"
        onSubmit={handleSubmit}
      >
        <div className="mb-6 text-center">
          <p className="text-2xl font-semibold text-purple-600">
            <span className="font-bold">{role}</span> Login
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="text-purple-600 text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-purple-600 rounded-lg"
            placeholder={`${role.toLowerCase()}@example.com`}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="text-purple-600 text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-purple-600 rounded-lg"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-purple-600">
            {role === "Admin" ? "Doctor" : "Admin"} Login?{" "}
            <button type="button" onClick={toggleRole} className="underline font-medium">
              Click here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
