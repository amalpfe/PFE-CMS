import React, { createContext, ReactNode } from "react";

// Define the shape of your context value
interface DoctorContextType {
  // Add your shared state or functions here, for now it's empty
}

// Create the context with an initial undefined value
export const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

// Define props for the provider
interface DoctorContextProviderProps {
  children: ReactNode;
}

const DoctorContextProvider: React.FC<DoctorContextProviderProps> = ({ children }) => {
  const value: DoctorContextType = {
    // Add shared state or functions here
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
