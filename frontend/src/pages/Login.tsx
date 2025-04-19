import { useState, FormEvent } from "react";

const Login = () => {
  const [state, setState] = useState<"Sign Up" | "Login">("Sign Up");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
// edit
  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ name, email, password, type: state });
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-200 px-4"
    >
      <div className="backdrop-blur-lg bg-white/70 border border-purple-200 shadow-xl rounded-3xl p-10 w-full max-w-md flex flex-col gap-5 animate-fade-in text-zinc-700">
        <h2 className="text-3xl font-bold text-purple-700 text-center tracking-tight">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-sm text-center text-gray-500">
          {state === "Sign Up"
            ? "Join us to book appointments with ease."
            : "Log in to continue booking your doctor."}
        </p>

        {state === "Sign Up" && (
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
              type="text"
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
            type="password"
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2 rounded-full shadow-md transition duration-300"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <div className="text-center text-sm mt-3">
          {state === "Sign Up" ? "Already have an account?" : "New to us?"}{" "}
          <span
            className="text-purple-600 font-medium hover:underline cursor-pointer"
            onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
          >
            {state === "Sign Up" ? "Login here" : "Sign up here"}
          </span>
        </div>
      </div>
    </form>
  );
};

export default Login;
