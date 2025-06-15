import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Calendar, type Event } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { localizer } from "../utils/localizer";

type DoctorAvailability = {
  id: number;
  doctorId: number;
  doctorName: string; // Make sure this is provided from the backend
  dayOfWeek: string;
  startTime: string;
  endTime: string;
};

type DoctorGroupedAvailability = {
  doctorId: number;
  doctorName: string;
  availabilities: DoctorAvailability[];
};

const dayOfWeekMap: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const Dashboard = () => {
  const [totalAppointmentsToday, setTotalAppointmentsToday] = useState<number | null>(null);
  const [checkedInPatients, setCheckedInPatients] = useState<number | null>(null);
  const [pendingPayments, setPendingPayments] = useState<number | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<number | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<DoctorAvailability[] | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchStat = async (url: string, setter: React.Dispatch<React.SetStateAction<number | null>>) => {
      try {
        const response = await axios.get(url);
        setter(response.data.count);
      } catch (error) {
        console.error(`Error fetching ${url}`, error);
        setter(null);
      }
    };

    fetchStat("http://localhost:5000/staff/total-appointments-today", setTotalAppointmentsToday);
    fetchStat("http://localhost:5000/staff/checked-in-patients", setCheckedInPatients);
    fetchStat("http://localhost:5000/staff/pending-payments", setPendingPayments);
    fetchStat("http://localhost:5000/staff/upcoming-appointments", setUpcomingAppointments);

    const fetchAvailableDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/staff/available-doctors");
        const data: DoctorAvailability[] = response.data.doctorAvailability;
        setAvailableDoctors(data);

        // Generate calendar events
        const today = new Date();
        const events: Event[] = data.map((slot) => {
          const dayOffset = (dayOfWeekMap[slot.dayOfWeek] - today.getDay() + 7) % 7;
          const date = new Date(today);
          date.setDate(today.getDate() + dayOffset);

          const [startHour, startMinute] = slot.startTime.split(":").map(Number);
          const [endHour, endMinute] = slot.endTime.split(":").map(Number);

          const start = new Date(date);
          start.setHours(startHour, startMinute);

          const end = new Date(date);
          end.setHours(endHour, endMinute);

          return {
            title: `Dr. ${slot.doctorName}`,
            start,
            end,
            allDay: false,
          };
        });

        setCalendarEvents(events);
      } catch (error) {
        console.error("Error fetching available doctors", error);
        setAvailableDoctors([]);
      }
    };

    fetchAvailableDoctors();
  }, []);

  const groupedDoctors: Record<number, DoctorGroupedAvailability> = {};

  availableDoctors?.forEach((item) => {
    if (!groupedDoctors[item.doctorId]) {
      groupedDoctors[item.doctorId] = {
        doctorId: item.doctorId,
        doctorName: item.doctorName,
        availabilities: [],
      };
    }
    groupedDoctors[item.doctorId].availabilities.push(item);
  });

 
  const renderCount = (count: number | null) => (count === null ? "Loading..." : count);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow rounded p-5">
            <h2 className="text-lg font-semibold mb-2">Total Appointments Today</h2>
            <p className="text-4xl font-bold">{renderCount(totalAppointmentsToday)}</p>
          </div>

          <div className="bg-white shadow rounded p-5">
            <h2 className="text-lg font-semibold mb-2">Checked-in Patients</h2>
            <p className="text-4xl font-bold">{renderCount(checkedInPatients)}</p>
          </div>

          <div className="bg-white shadow rounded p-5">
            <h2 className="text-lg font-semibold mb-2">Pending Payments</h2>
            <p className="text-4xl font-bold">{renderCount(pendingPayments)}</p>
          </div>

          <div className="bg-white shadow rounded p-5">
            <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
            <p className="text-4xl font-bold">{renderCount(upcomingAppointments)}</p>
          </div>
        </div>

       

        {/* Calendar */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Doctor Availability Calendar</h2>
          <div className="h-[500px]">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
