import { useState } from "react";
import { FaFileMedicalAlt } from "react-icons/fa";
//update
interface Report {
  id: string;
  visitDate: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
}

const Reports = () => {
  const [reports] = useState<Report[]>([
    {
      id: "1",
      visitDate: "2025-04-15",
      symptoms: "Fever, cough, fatigue",
      diagnosis: "Influenza (Flu)",
      treatment: "Rest, fluids, and antiviral medication",
      prescription: "Oseltamivir 75mg twice daily for 5 days",
      notes: "Patient advised to monitor symptoms and return if condition worsens.",
    },
    {
      id: "2",
      visitDate: "2025-03-10",
      symptoms: "Shortness of breath, chest pain",
      diagnosis: "Mild Asthma",
      treatment: "Inhaled corticosteroids and bronchodilators",
      prescription: "Albuterol inhaler as needed",
      notes: "Patient advised to avoid allergens and schedule a follow-up in 2 weeks.",
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-purple-700 flex items-center justify-center gap-3">
          <FaFileMedicalAlt className="text-purple-600 text-3xl" />
          Medical Reports
        </h1>
        <p className="text-gray-500 mt-2">Review your visit history and medical summaries</p>
      </div>

      {reports.length === 0 ? (
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
                <ReportItem label="Symptoms" value={report.symptoms} />
                <ReportItem label="Diagnosis" value={report.diagnosis} />
                <ReportItem label="Treatment" value={report.treatment} />
                <ReportItem label="Prescription" value={report.prescription} />
                <ReportItem label="Notes" value={report.notes} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Reusable Report Item Component
const ReportItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h4 className="text-sm font-medium text-purple-700">{label}</h4>
    <p className="text-sm text-gray-700">{value}</p>
  </div>
);

export default Reports;
