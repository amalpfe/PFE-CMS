import React, { createContext, ReactNode } from "react";

// Define the shape of your context value
interface AppContextType {
  // Add your shared state or functions here, for now it's empty
}

// Create the context with an initial undefined value
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Define props for the provider
interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const value: AppContextType = {
    // Add shared state or functions here
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
