import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import {  AdminProvider } from './context/AdminContext.tsx';
import { DoctorContextProvider } from './context/DoctorContext.tsx';
import { AppContextProvider } from './context/AppContext.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <AdminProvider>
    <DoctorContextProvider>
      <AppContextProvider>
        <App/>
      </AppContextProvider>
    </DoctorContextProvider>
  </AdminProvider>
  </BrowserRouter>,
);
