import DoctorLayout from "../components/DoctorLayout";

const Dashboard = () => {
  return (
    <DoctorLayout>
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded text-center">
          <p className="text-gray-500">Earnings</p>
          <p className="text-xl font-bold">$130</p>
        </div>
        <div className="bg-white p-4 shadow rounded text-center">
          <p className="text-gray-500">Appointments</p>
          <p className="text-xl font-bold">4</p>
        </div>
        <div className="bg-white p-4 shadow rounded text-center">
          <p className="text-gray-500">Patients</p>
          <p className="text-xl font-bold">2</p>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">Latest Bookings</h2>
        <ul className="space-y-4">
          {[
            { name: "Avinash K", date: "5 Oct 2024", status: "Completed" },
            { name: "GreatStack", date: "26 Sep 2024", status: "Cancelled" },
            { name: "GreatStack", date: "25 Sep 2024", status: "Completed" },
            { name: "GreatStack", date: "23 Sep 2024", status: "Completed" },
          ].map((b, i) => (
            <li key={i} className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img src="https://via.placeholder.com/40" className="rounded-full" alt="User" />
                <div>
                  <p className="font-medium">{b.name}</p>
                  <p className="text-sm text-gray-500">Booking on {b.date}</p>
                </div>
              </div>
              <span className={
                b.status === "Completed"
                  ? "text-green-500"
                  : "text-red-500"
              }>
                {b.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </DoctorLayout>
  );
};

export default Dashboard;

