import { useState, useEffect, useContext } from "react";
import { FaFileMedicalAlt } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import axios from "axios";

interface Report {
  id: string;
  visitDate: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  symptoms?: string;
  notes?: string;
}

const Reports = () => {
  const appContext = useContext(AppContext);
  const patientId = appContext?.user?.id;

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (!patientId) {
        setError("No patient ID found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/patient/reports/${patientId}`
        );
        setReports(response.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch medical records.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [patientId]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-purple-700 flex items-center justify-center gap-3">
          <FaFileMedicalAlt className="text-purple-600 text-3xl" />
          Medical Reports
        </h1>
        <p className="text-gray-500 mt-2">Review your visit history and medical summaries</p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading medical reports...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">No medical reports available.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-gradient-to-br from-white via-purple-50 to-white rounded-2xl p-6 shadow-md border hover:shadow-lg transition"
            >
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Visit Date</span>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(report.visitDate).toLocaleDateString()}
                </p>
              </div>

              <hr className="my-3 border-gray-200" />

              <div className="space-y-2">
                {report.symptoms && <ReportItem label="Symptoms" value={report.symptoms} />}
                <ReportItem label="Diagnosis" value={report.diagnosis} />
                <ReportItem label="Treatment" value={report.treatment} />
                <ReportItem label="Prescription" value={report.prescription} />
                {report.notes && <ReportItem label="Notes" value={report.notes} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Reusable component
const ReportItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h4 className="text-sm font-medium text-purple-700">{label}</h4>
    <p className="text-sm text-gray-700">{value}</p>
  </div>
);

export default Reports;
