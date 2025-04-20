import React, { createContext, ReactNode } from "react";
import { doctors } from "../assets/assets";

// Define the shape of the context
interface AppContextType {
  doctors: typeof doctors;
  
}


// Create the context with an initial empty value
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Define props for the provider
interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const value: AppContextType = {
    doctors,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
