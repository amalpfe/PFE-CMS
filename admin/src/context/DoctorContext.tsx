import { createContext, type ReactNode } from "react";

interface DoctorContextType {
  // Define your context values here, for example:
  // doctorId: string;
  // setDoctorId: (id: string) => void;
}

export const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

interface DoctorContextProviderProps {
  children: ReactNode;
}

export const DoctorContextProvider = ({ children }: DoctorContextProviderProps) => {
  const value: DoctorContextType = {
    // Provide values for the context
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};
