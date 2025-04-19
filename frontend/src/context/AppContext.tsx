import { createContext, ReactNode } from "react";
import { doctors } from "../assets/assets";

// Define the doctor type
export interface Doctor {
  _id: string;
  name: string;
  Image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: {
    line1: string;
    line2: string;
  };
}

// Define the context type
interface AppContextType {
  doctors: Doctor[];
}

// Create the context with an initial undefined value
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Define the props for the provider
interface AppContextProviderProps {
  children: ReactNode;
}

// Provider component
const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const value: AppContextType = {
    doctors,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
