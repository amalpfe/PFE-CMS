import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from './context/AppContext'; // ✅ import the context provider

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppContextProvider> {/* ✅ Wrap your app with this */}
      <App />
    </AppContextProvider>
  </BrowserRouter>
//edit

);
