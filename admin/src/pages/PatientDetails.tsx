import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PatientDetails = () => {
  const { id } = useParams(); // patientId
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [labResults, setLabResults] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const [recordRes, labsRes] = await Promise.all([
          axios.get(`http://localhost:5000/patient/reports/:patientId`),
          axios.get(`http://localhost:5000/patients/${id}/lab-results`)
        ]);

        setMedicalRecord(recordRes.data);
        setLabResults(labsRes.data);
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };

    fetchPatientData();
  }, [id]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Medical Record</h2>
      {medicalRecord ? (
        <pre>{JSON.stringify(medicalRecord, null, 2)}</pre>
      ) : (
        <p>Loading medical record...</p>
      )}

      <h2 className="text-xl font-bold mt-6">Lab Results</h2>
      {labResults.length > 0 ? (
        <ul>
          {labResults.map((result: any, idx: number) => (
            <li key={idx}>
              <strong>{result.testName}</strong>: {result.result}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading lab results...</p>
      )}
    </div>
  );
};

export default PatientDetails;
