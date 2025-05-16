import { createContext, ReactNode, useState } from "react";
import { doctors } from "../assets/assets";

// Define the doctor type
export type Doctor = {
  _id: string;
  name: string;
  degree: string;
  speciality: string;
  experience: string;
  about: string;
  fees: number;
  Image: string;
  availability?: {
    doctorId: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }[];
};


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
  const [user, setUser] = useState<User | null>({
    id: "patient123", // Example static user for development/testing
    name: "John Doe",
    email: "john@example.com"
  });

  const currencySymbol = '$';

  const value: AppContextType = {
    user,
    setUser,
    doctors,
    currencySymbol,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
