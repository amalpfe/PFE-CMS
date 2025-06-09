import { createContext, ReactNode, useState, useEffect } from "react";
import { doctors } from "../assets/assets";
import type { Doctor } from "../assets/assets";

// Define the user type
export interface User {
  id: string;
  name: string;
  email?: string;
}

// Define the context type
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  doctors: Doctor[];
  currencySymbol: string;
}

// Create the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Props for provider
interface AppContextProviderProps {
  children: ReactNode;
}

// Provider component
const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  // Sync changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const currencySymbol = "$";

  const value: AppContextType = {
    user,
    setUser,
    token,
    setToken,
    doctors,
    currencySymbol,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;