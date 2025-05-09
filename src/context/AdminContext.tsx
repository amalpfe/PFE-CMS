import { createContext, type ReactNode } from "react";

interface AdminContextType {
  // Define your context values here, e.g.:
  // isAdmin: boolean;
  // setIsAdmin: (value: boolean) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminContextProviderProps {
  children: ReactNode;
}

export const AdminContextProvider = ({ children }: AdminContextProviderProps) => {
  const value: AdminContextType = {
    // Provide values for the context
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
