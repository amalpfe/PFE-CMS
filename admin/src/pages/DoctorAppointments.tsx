import DoctorLayout from "../components/DoctorLayout";

const Appointments = () => {
  const appointments = [
    {
      id: 0,
      patient: "Avinash Kr",
      payment: "CASH",
      age: 31,
      datetime: "5 Oct 2024, 12:00 PM",
      fees: "$50",
      status: "Pending",
    },
    {
      id: 1,
      patient: "GreatStack",
      payment: "CASH",
      age: 24,
      datetime: "26 Sep 2024, 11:00 AM",
      fees: "$40",
      status: "Cancelled",
    },
    {
      id: 2,
      patient: "GreatStack",
      payment: "CASH",
      age: 24,
      datetime: "25 Sep 2024, 02:00 PM",
      fees: "$40",
      status: "Completed",
    },
    {
      id: 3,
      patient: "GreatStack",
      payment: "CASH",
      age: 24,
      datetime: "23 Sep 2024, 11:00 AM",
      fees: "$40",
      status: "Completed",
    },
  ];

  const statusColor = (status: string) => {
    if (status === "Completed") return "text-green-600";
    if (status === "Cancelled") return "text-red-500";
    return "text-gray-500";
  };

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
                  <td className="py-3 px-4">{index}</td>
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
                      {appt.payment}
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
            </tbody>
          </table>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Appointments;
