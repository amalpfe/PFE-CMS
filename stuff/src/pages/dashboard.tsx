import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { localizer } from "../utils/localizer"; // تأكد من هذا الملف موجود ومهيأ بالmoment أو date-fns

type DoctorAvailability = {
  id: number;
  doctorId: number;
  doctorName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
};

type DoctorGroupedAvailability = {
  doctorId: number;
  doctorName: string;
  availabilities: DoctorAvailability[];
};

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

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
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    // دالة مساعدة لقراءة القيمة حسب اسم الحقل الصحيح من الريسبونس
    const fetchStat = async (
      url: string,
      field: string,
      setter: React.Dispatch<React.SetStateAction<number | null>>
    ) => {
      try {
        const response = await axios.get(url);
        setter(response.data[field]);
      } catch (error) {
        console.error(`Error fetching ${url}`, error);
        setter(null);
      }
    };

    fetchStat("http://localhost:5000/staff/total-appointments-today", "totalAppointmentsToday", setTotalAppointmentsToday);
    fetchStat("http://localhost:5000/staff/checked-in-patients", "checkedInPatients", setCheckedInPatients);
    fetchStat("http://localhost:5000/staff/pending-payments", "pendingPayments", setPendingPayments);
    fetchStat("http://localhost:5000/staff/upcoming-appointments", "upcomingAppointments", setUpcomingAppointments);

    const fetchAvailableDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/staff/available-doctors");
        const data: DoctorAvailability[] = response.data.doctorAvailability;
        setAvailableDoctors(data);

        const today = new Date();
        const events: CalendarEvent[] = data.map((slot) => {
          const dayOffset = (dayOfWeekMap[slot.dayOfWeek] - today.getDay() + 7) % 7;
          const date = new Date(today);
          date.setDate(today.getDate() + dayOffset);

          const [startHour, startMinute] = slot.startTime.split(":").map(Number);
          const [endHour, endMinute] = slot.endTime.split(":").map(Number);

          const start = new Date(date);
          start.setHours(startHour, startMinute, 0);

          const end = new Date(date);
          end.setHours(endHour, endMinute, 0);

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
              selectable={true}
              onSelectSlot={(slotInfo) => {
                const selectedDate = slotInfo.start;
                const filteredEvents = calendarEvents.filter(event =>
                  event.start.toDateString() === selectedDate.toDateString()
                );
                alert(
                  filteredEvents.length > 0
                    ? `Doctors on ${selectedDate.toDateString()}:\n` + filteredEvents.map(e => e.title).join("\n")
                    : `No doctors available on ${selectedDate.toDateString()}`
                );
              }}
              onSelectEvent={(event) => {
                alert(`Selected: ${event.title}\nTime: ${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}`);
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
