import { useEffect, useState } from "react";
import DoctorLayout from "../components/DoctorLayout";
import axios from "axios";
import { Calendar, type Event } from "react-big-calendar";
import momentLocalizer from "react-big-calendar/lib/localizers/moment";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  start: Date;
  end: Date;
}

interface Booking {
  name: string;
  date: string;
  status: string;
}

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({ earnings: 0, appointments: 0, patients: 0 });
  const [bookings, setBookings] = useState<Booking[]>([]);
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

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/doctor/${doctorId}/appointments/detailed`);
      const transformed = res.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => item.status !== "Cancelled")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
  };

  useEffect(() => {
    if (!doctorId) return;
    fetchDashboardData();
    fetchAppointments();
  }, [doctorId]);

   const handleSelectEvent = (event: Event) => {
    const appointment = appointments.find((a) => a.id === event.id);
    if (appointment) {
      navigate(`/doctor/patients/${appointment.patientId}`);
    }
  };

  if (!doctorId) return <p>Please login to see dashboard data.</p>;

  const events: Event[] = appointments.map((a) => ({
    id: a.id,
    title: a.patientName,
    start: new Date(a.start),
    end: new Date(a.end),
  }));

  return (
    <DoctorLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats and Bookings */}
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

        {/* Calendar */}
        <div className="bg-white p-4 shadow rounded h-[600px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Dashboard;
