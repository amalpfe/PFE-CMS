import React, { createContext, ReactNode, useState } from "react";

// Define the shape of the context value
interface AdminContextType {
  aToken: string;
  setAToken: React.Dispatch<React.SetStateAction<string>>;
  backendUrl: string;
}

// Create the context with the correct type
export const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Define the props for the provider component
interface AdminContextProviderProps {
  children: ReactNode;
}

const AdminContextProvider: React.FC<AdminContextProviderProps> = ({ children }) => {
  const [aToken, setAToken] = useState<string>('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';  // Ensure a fallback value if not set

  const value: AdminContextType = {
    aToken,
    setAToken,
    backendUrl,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
