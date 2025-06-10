import { useEffect, useState } from "react";
import DoctorLayout from "../components/DoctorLayout";
import axios from "axios";
import { Calendar, type Event } from "react-big-calendar";
import  momentLocalizer  from "react-big-calendar/lib/localizers/moment"
import moment from "moment";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  start: Date; // ISO date string
  end: Date;   // ISO date string
}

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();

useEffect(() => {
  const fetchAppointments = async () => {
    try {
      const doctorId = 20;
      const res = await axios.get(`http://localhost:5000/doctor/${doctorId}/appointments/detailed`);
      
      const transformed = res.data.map((item: any) => ({
        id: item.id,
        patientId: item.patientId ?? 0, // or ask backend to include it
        patientName: item.patient || "Unnamed",
        start: new Date(item.datetime),
        end: new Date(moment(item.datetime).add(30, 'minutes').toISOString())
      }));

      setAppointments(transformed);
    } catch (err) {
      console.error("Error loading appointments:", err);
    }
  };

  fetchAppointments();
}, []);

  // Map your appointments to events for react-big-calendar
  const events: Event[] = appointments.map((a) => ({
    id: a.id,
    title: a.patientName,
    start: new Date(a.start),
    end: new Date(a.end),
  }));

  const handleSelectEvent = (event: Event) => {
    // Find appointment to get patientId
    const appointment = appointments.find((a) => a.id === event.id);
    if (appointment) {
      // Navigate to patient's profile page to see medical record + lab tests
      navigate(`/doctor/patients/${appointment.patientId}`);
    }
  };

  return (
    <DoctorLayout>
      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </DoctorLayout>
  );
};

export default Dashboard;
