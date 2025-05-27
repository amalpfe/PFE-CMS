import { useEffect, useState } from "react";
import DoctorLayout from "../components/DoctorLayout";
import axios from "axios";

interface Booking {
  name: string;
  date: string;
  status: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    earnings: 0,
    appointments: 0,
    patients: 0,
  });

  const [bookings, setBookings] = useState<Booking[]>([]);

  const doctorId = 2; // Replace with actual ID from auth/context

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/doctor/${doctorId}/dashboard`);
        setStats({
          earnings: res.data.earnings,
          appointments: res.data.appointments,
          patients: res.data.patients,
        });
        setBookings(res.data.bookings);
      } catch (err) {
        console.error("Dashboard data error:", err);
      }
    };

    fetchDashboardData();
  }, [doctorId]);

  return (
    <DoctorLayout>
      <div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-gray-500">Earnings</p>
            <p className="text-xl font-bold">${stats.earnings}</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-gray-500">Appointments</p>
            <p className="text-xl font-bold">{stats.appointments}</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-gray-500">Patients</p>
            <p className="text-xl font-bold">{stats.patients}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Latest Bookings</h2>
          <ul className="space-y-4">
            {bookings.length === 0 ? (
              <p className="text-gray-400">No recent bookings.</p>
            ) : (
              bookings.map((b, i) => (
                <li key={i} className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://via.placeholder.com/40"
                      className="rounded-full"
                      alt="User"
                    />
                    <div>
                      <p className="font-medium">{b.name}</p>
                      <p className="text-sm text-gray-500">Booking on {b.date}</p>
                    </div>
                  </div>
                  <span
                    className={
                      b.status === "Completed"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {b.status}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Dashboard;
