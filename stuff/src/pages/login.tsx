import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/staff/login", {
        email,
        password,
      });

      const { token, staff } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", "Staff");
      localStorage.setItem("staff", JSON.stringify(staff));
      localStorage.setItem("staffId", staff.id.toString());

      navigate("/staff/dashboard");
    } catch (error: any) {
      if (error.response && error.response.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Login failed. Please try again.");
      }
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
            <span className="font-bold">Staff</span> Login
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
            placeholder="staff@example.com"
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
      </form>
    </div>
  );
};

export default StaffLogin;
