import { useEffect, useState } from "react";
import DoctorLayout from "../components/DoctorLayout";

type Appointment = {
  id: number;
  patient: string;
  payment?: string; // payment not provided by backend yet? Can be optional
  age: number;
  datetime: string;
  fees: string;
  status: string;
  notes?: string;
};

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const doctorId = 2; // or get from route params or context

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/doctor/${doctorId}/appointments/detailed`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        setError("Failed to fetch appointments.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const statusColor = (status: string) => {
    if (status === "Completed") return "text-green-600";
    if (status === "Cancelled") return "text-red-500";
    return "text-gray-500";
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <DoctorLayout>
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold text-purple-700 mb-6">
          All Appointments
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-3 px-4 font-medium">#</th>
                <th className="py-3 px-4 font-medium">Patient</th>
                <th className="py-3 px-4 font-medium">Payment</th>
                <th className="py-3 px-4 font-medium">Age</th>
                <th className="py-3 px-4 font-medium">Date & Time</th>
                <th className="py-3 px-4 font-medium">Fees</th>
                <th className="py-3 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={appt.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <img
                      src="https://via.placeholder.com/32"
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    {appt.patient}
                  </td>
                  <td className="py-3 px-4">
                    <span className="border px-2 py-1 rounded-full text-xs">
                      {appt.payment || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-4">{appt.age}</td>
                  <td className="py-3 px-4">{appt.datetime}</td>
                  <td className="py-3 px-4">{appt.fees}</td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${statusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Appointments;
