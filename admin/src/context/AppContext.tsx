import { createContext, type ReactNode } from "react";

type AppContextType = object

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}


export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const value: AppContextType = {
    
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
