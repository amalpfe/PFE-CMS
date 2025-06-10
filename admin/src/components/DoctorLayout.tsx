import Navbar from "./DoctorNavbar";
import Sidebar from "./DoctorSidebar";


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-purple-600 text-white p-6 flex flex-col shadow-lg">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 bg-white rounded-lg shadow-md overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
