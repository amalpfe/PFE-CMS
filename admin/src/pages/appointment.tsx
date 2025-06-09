// pages/appointment.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import {
  Calendar,
  dateFnsLocalizer,
  type Event,
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
} from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface AppointmentEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: "Scheduled" | "Completed" | "Cancelled";
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState<AppointmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "http://localhost:5000/admin/recent-appointments"
        );

  const mappedAppointments: AppointmentEvent[] = response.data.map(
  (appt: any) => {
    const start = new Date(appt.appointmentDate);
    const end = new Date(start.getTime() + 30 * 60000); // 30 minutes duration

    return {
      id: String(appt.id),
      title: `${appt.patientName} with Dr. ${appt.doctorName}`,
      start,
      end,
      status: appt.appointmentStatus,
    };
  }
);


        setAppointments(mappedAppointments);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: AppointmentEvent["status"]
  ) => {
    const oldStatus = appointments.find((appt) => appt.id === id)?.status;

    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: newStatus } : appt
      )
    );

    try {
      await axios.put(`http://localhost:5000/admin/appointments/${id}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");

      if (oldStatus) {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: oldStatus } : appt
          )
        );
      }
    }
  };

  const eventStyleGetter = (
    event: Event,
    _start: Date,
    _end: Date,
    _isSelected: boolean
  ) => {
    const appt = event as AppointmentEvent;

    let backgroundColor = "#facc15"; // Scheduled - yellow
    if (appt.status === "Completed") backgroundColor = "#22c55e"; // green
    if (appt.status === "Cancelled") backgroundColor = "#ef4444"; // red

    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        border: "none",
        padding: "5px",
      },
    };
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">
          Appointment Calendar
        </h1>

        {loading && <p>Loading calendar...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div style={{ height: "80vh" }}>
           <Calendar
                    localizer={localizer}
                    events={appointments}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%", borderRadius: "10px" }}
                    defaultView="week"
                    views={["month", "week", "day"]}
                    eventPropGetter={eventStyleGetter}
                    onSelectEvent={(event) => {
                      const appt = event as AppointmentEvent;
                      const newStatus = prompt(
                        `Change status for:\n\n${appt.title}\n\nCurrent: ${appt.status}\n\nEnter: Scheduled, Completed, or Cancelled`
                      ) as AppointmentEvent["status"];
                      if (
                        newStatus === "Scheduled" ||
                        newStatus === "Completed" ||
                        newStatus === "Cancelled"
                      ) {
                        handleStatusChange(appt.id, newStatus);
                      }
                    }}
              min={new Date(0, 0, 0, 8, 0)}   // 8:00 AM
              max={new Date(0, 0, 0, 20, 0)}  // 8:00 PM
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AppointmentCalendar;
