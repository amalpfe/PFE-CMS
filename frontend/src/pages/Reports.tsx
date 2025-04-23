// src/pages/MedicalReports.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Report {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  createdAt: string;
}

const MedicalReports = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await axios.get('/api/reports'); // Adjust based on your backend
        setReports(data.reports);
      } catch (error: any) {
        console.error("Error fetching reports:", error?.response?.data?.message || error.message);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">My Medical Reports</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {reports.length === 0 ? (
          <p className="text-gray-600">No reports found.</p>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">{report.title}</h3>
              <p className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
              <p className="mt-2 text-gray-700">{report.description}</p>
              <a
                href={report.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-purple-600 hover:underline"
              >
                View Report
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicalReports;
