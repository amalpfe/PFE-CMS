import { useEffect, useState } from "react";
import DoctorLayout from "../components/DoctorLayout";
import axios from "axios";
import { Calendar, type Event as RBCEvent } from "react-big-calendar";
import momentLocalizer from "react-big-calendar/lib/localizers/moment";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  start: Date;
  end: Date;
}

interface Booking {
  id: number;
  name: string;
  date: string;
  status: string;
  patientId: number;
}

interface Stats {
  earnings: number;
  appointments: number;
  patients: number;
}

interface CustomEvent extends RBCEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  patientId: number;
}

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats>({ earnings: 0, appointments: 0, patients: 0 });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const doctorId = (() => {
    try {
      const stored = localStorage.getItem("doctor");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed?.id ?? null;
    } catch {
      return null;
    }
  })();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/doctor/${doctorId}/dashboard`);
      setStats({
        earnings: res.data.earnings,
        appointments: res.data.appointments,
        patients: res.data.patients,
      });
      setBookings(res.data.bookings);
      setError(null);
    } catch (err) {
      console.error("Dashboard data error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/doctor/${doctorId}/appointments/detailed`);
      const transformed = res.data
        .filter((item: any) => item.status !== "Cancelled")
        .map((item: any) => ({
          id: item.id,
          patientId: item.patientId ?? 0,
          patientName: item.patient || "Unnamed",
          start: new Date(item.datetime),
          end: new Date(moment(item.datetime).add(30, 'minutes').toISOString()),
        }));
      setAppointments(transformed);
    } catch (err) {
      console.error("Error loading appointments:", err);
      setError("Failed to load appointments");
    }
  };

  useEffect(() => {
    if (!doctorId) return;
    fetchDashboardData();
    fetchAppointments();
  }, [doctorId]);

  const handleSelectEvent = (event: RBCEvent) => {
    const customEvent = event as CustomEvent;
    if (customEvent.patientId) {
      navigate(`/doctor/patient/${customEvent.patientId}`);
    } else {
      console.error("No patientId found in event");
    }
  };

  const events: CustomEvent[] = appointments.map((a) => ({
    id: a.id,
    title: a.patientName,
    start: new Date(a.start),
    end: new Date(a.end),
    patientId: a.patientId,
  }));

  if (!doctorId) return <p className="p-4 text-red-500">Please login to see dashboard data.</p>;
  if (loading) return <p className="p-4">Loading dashboard...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <DoctorLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stats and Bookings */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 shadow rounded-lg text-center">
                <p className="text-gray-500 text-sm">Earnings</p>
                <p className="text-xl font-bold">${stats.earnings.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 shadow rounded-lg text-center">
                <p className="text-gray-500 text-sm">Appointments</p>
                <p className="text-xl font-bold">{stats.appointments.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 shadow rounded-lg text-center">
                <p className="text-gray-500 text-sm">Patients</p>
                <p className="text-xl font-bold">{stats.patients.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">Recent Bookings</h2>
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No recent bookings</p>
                ) : (
                  bookings.slice(0, 5).map((booking) => (
                    <div 
                      key={booking.id} 
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => booking.patientId && navigate(`/doctor/patient/${booking.patientId}`)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center">
                          {booking.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{booking.name}</p>
                          <p className="text-sm text-gray-500">
                            {moment(booking.date).format("MMM D, YYYY h:mm A")}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === "Completed" 
                          ? "bg-green-100 text-green-800" 
                          : booking.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white shadow rounded-lg p-4 h-[600px]">
            <h2 className="text-lg font-semibold mb-4">Appointment Calendar</h2>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%", minHeight: "500px" }}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={(_event) => ({
                style: {
                  backgroundColor: "#3b82f6",
                  borderColor: "#2563eb",
                  color: "white",
                  borderRadius: "4px",
                  border: "none",
                },
              })}
            />
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Dashboard;