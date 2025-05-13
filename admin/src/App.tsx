import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <>
      <div className="mx-4 sm:mx-[10%]">
      
        <Routes>
      
                 <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}  />
        </Routes>
      
      </div>
    </>
  );
}

export default App;