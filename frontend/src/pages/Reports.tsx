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
      } catch (err) {
        setError("Failed to fetch medical records.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [patientId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-purple-700 mb-6 border-b pb-4">
         
          Medical Reports
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Review your medical visit history and summaries
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading medical reports...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : reports.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No medical reports available.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-gradient-to-br from-white via-purple-50 to-white rounded-3xl p-6 shadow-md border-2 border-purple-200 hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 cursor-default"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full tracking-wide select-text">
                  {new Date(report.visitDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <FaFileMedicalAlt className="text-purple-600 text-xl" />
              </div>

              <div className="space-y-5">
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

const ReportItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h4 className="text-sm font-semibold text-purple-700">{label}</h4>
    <p className="text-gray-700 text-sm leading-relaxed select-text">{value}</p>
  </div>
);

export default Reports;
