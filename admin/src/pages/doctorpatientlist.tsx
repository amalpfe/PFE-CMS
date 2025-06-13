"use client";

import { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";
import DoctorLayout from "../components/DoctorLayout";
import { useNavigate } from "react-router-dom";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  createdAt: string;
  updatedAt: string;
  image?: string | null;  // Added
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const doctor = JSON.parse(localStorage.getItem("doctor") || "{}");
        const doctorId = doctor?.id;

        if (!doctorId) {
          console.error("Doctor ID not found in localStorage.");
          return;
        }

        const response = await axios.get(`http://localhost:5000/doctor/patients/${doctorId}`);
        setPatients(response.data);
        setFilteredPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const getFullName = (patient: Patient) => `${patient.firstName} ${patient.lastName}`;

  const getAge = (dob: string) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter((patient) =>
        getFullName(patient).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (genderFilter) {
      filtered = filtered.filter(
        (patient) => patient.gender.toLowerCase() === genderFilter.toLowerCase()
      );
    }

    setFilteredPatients(filtered);
  }, [searchTerm, genderFilter, patients]);

  const columns = [
    {
      title: "Patient",
      key: "patient",
      render: (_: any, record: Patient) => (
        <div className="flex items-center">
          {record.image ? (
            <img
              src={record.image}
              alt={getFullName(record)}
              className="w-10 h-10 rounded-full mr-2 object-cover"
            />
          ) : (
            <img
              src="/default-profile.png"
              alt={getFullName(record)}
              className="w-10 h-10 rounded-full mr-2 object-cover"
            />
          )}
          <span>{getFullName(record)}</span>
        </div>
      ),
    },
    {
      title: "Age",
      key: "age",
      render: (_: any, record: Patient) => getAge(record.dateOfBirth),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Emergency Contact",
      key: "emergencyContact",
      render: (_: any, record: Patient) =>
        record.emergencyContactName && record.emergencyContactPhone
          ? `${record.emergencyContactName} (${record.emergencyContactPhone})`
          : "N/A",
    },
  ];

  return (
    <DoctorLayout>
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">My Patients</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name"
            className="p-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="p-2 border border-gray-300 rounded-md"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <Table
          dataSource={filteredPatients}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          onRow={(record) => ({
            onClick: () => navigate(`/doctor/patients/${record.id}`),
          })}
        />
      </div>
    </DoctorLayout>
  );
}
