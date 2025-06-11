import { useState, FormEvent } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const SignUp = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>(""); // added username state
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/patient/signup", {
        firstName,
        lastName,
        email,
        username,   // send username
        password,
        confirmPassword,
      });

      setSuccessMessage(response.data.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setUsername("");  // reset username
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setFormError(error.response.data.message);
      } else {
        setFormError("An unexpected error occurred");
      }
    }
  };

  const formVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-200 px-4"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="signup"
          variants={formVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="backdrop-blur-lg bg-white/70 border border-purple-200 shadow-xl rounded-3xl p-10 w-full max-w-md flex flex-col gap-5 text-zinc-700"
        >
          <h2 className="text-3xl font-bold text-purple-700 text-center tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-center text-gray-500">
            Join us to book appointments with ease.
          </p>

          {/* Error and Success Messages */}
          <AnimatePresence>
            {formError && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm"
              >
                {formError}
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md text-sm"
              >
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-sm font-medium">First Name</label>
            <input
              type="text"
              placeholder="John"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Last Name</label>
            <input
              type="text"
              placeholder="Doe"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2 rounded-full shadow-md transition duration-300"
          >
            Create Account
          </button>

          <div className="text-center text-sm mt-3">
            Already have an account?{" "}
            <span
              className="text-purple-600 font-medium hover:underline cursor-pointer transition-colors duration-300"
              onClick={() => {
                setFormError(null);
                window.location.href = "/login";
              }}
            >
              Login here
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </form>
  );
};

export default SignUp;
