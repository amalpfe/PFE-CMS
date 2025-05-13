import React, { createContext, useState, type ReactNode } from "react";

// Define the shape of the context
interface AdminContextType {
  atoken: string | null;
  setATOKEN: React.Dispatch<React.SetStateAction<string | null>>;
  backendUrl: string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [atoken, setATOKEN] = useState<string | null>(null);
  const backendUrl = "your-backend-url"; // replace with actual URL

  return (
    <AdminContext.Provider value={{ atoken, setATOKEN, backendUrl }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = React.useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
};
