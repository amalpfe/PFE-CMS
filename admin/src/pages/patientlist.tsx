import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Input, Modal, Form, message } from "antd";
import Layout from "../components/Layout";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  phoneNumber?: string;
  email?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  weight?: number | null;
  height?: number | null;
  geneticDiseases?: string;
  chronicDiseases?: string;
  allergy?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  hadSurgery?: boolean | null;
  image?: string;
}

interface Appointment {
  appointmentId: number;
  appointmentDate: string;
  appointmentStatus: string;
  notes: string;
  doctorId: number;
  doctorName: string;
  specialty: string;
  doctorImage: string;
  address: string;
}

const PatientList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/patient/patients");
        setPatients(response.data);
      } catch (err) {
        message.error("Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleViewPatient = async (patient: Patient) => {
    setViewingPatient(patient);
    try {
      const response = await axios.get(`http://localhost:5000/patient/appointments/${patient.id}`);
      setAppointments(response.data.data || []);
    } catch {
      message.error("Failed to load appointments");
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.put(
        `http://localhost:5000/patient/patients/${editingPatient?.id}`,
        values
      );
      setPatients((prev) =>
        prev.map((p) => (p.id === editingPatient?.id ? response.data : p))
      );
      setEditingPatient(null);
      message.success("Patient updated successfully");
    } catch {
      message.error("Failed to update patient");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/patient/patients/${patientToDelete?.id}`);
      setPatients((prev) => prev.filter((p) => p.id !== patientToDelete?.id));
      setPatientToDelete(null);
      message.success("Patient deleted successfully");
    } catch {
      message.error("Failed to delete patient");
    }
  };

  const filteredPatients = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      render: (_: any, record: Patient) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "DOB",
      dataIndex: "dateOfBirth",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Emergency Contact",
      render: (_: any, record: Patient) =>
        `${record.emergencyContactName} (${record.emergencyContactPhone})`,
    },
    {
      title: "Actions",
      render: (_: any, record: Patient) => (
        <>
          <Button type="link" onClick={() => handleViewPatient(record)}>View</Button>
          <Button type="link" onClick={() => {
            setEditingPatient(record);
            form.setFieldsValue(record);
          }}>Edit</Button>
          <Button type="link" danger onClick={() => setPatientToDelete(record)}>Delete</Button>
        </>
      ),
    },
  ];

  const appointmentColumns = [
    {
      title: "Date",
      dataIndex: "appointmentDate",
    },
    {
      title: "Doctor",
      dataIndex: "doctorName",
    },
    {
      title: "Specialty",
      dataIndex: "specialty",
    },
    {
      title: "Status",
      dataIndex: "appointmentStatus",
    },
    {
      title: "Notes",
      dataIndex: "notes",
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Patient List</h1>
        <Input.Search
          placeholder="Search by name..."
          allowClear
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: 300, marginBottom: 20 }}
        />
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredPatients}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />

        {/* View Modal */}
        <Modal
          open={!!viewingPatient}
          title={`Patient Profile: ${viewingPatient?.firstName} ${viewingPatient?.lastName}`}
          onCancel={() => {
            setViewingPatient(null);
            setAppointments([]);
          }}
          footer={<Button onClick={() => setViewingPatient(null)}>Close</Button>}
          width={900}
        >
          {viewingPatient && (
            <div style={{ lineHeight: "1.8" }}>
              <p><strong>Username:</strong> {viewingPatient.username}</p>
              <p><strong>User ID:</strong> {viewingPatient.id}</p>
              <p><strong>Date of Birth:</strong> {viewingPatient.dateOfBirth}</p>
              <p><strong>Gender:</strong> {viewingPatient.gender}</p>
              <p><strong>Phone:</strong> {viewingPatient.phoneNumber || "N/A"}</p>
              <p><strong>Email:</strong> {viewingPatient.email || "N/A"}</p>
              <p><strong>Address:</strong> {viewingPatient.address || "N/A"}</p>
              <p><strong>Weight:</strong> {viewingPatient.weight ?? "N/A"} kg</p>
              <p><strong>Height:</strong> {viewingPatient.height ?? "N/A"} cm</p>
              <p><strong>Blood Group:</strong> {viewingPatient.bloodGroup || "N/A"}</p>
              <p><strong>Genetic Diseases:</strong> {viewingPatient.geneticDiseases || "None"}</p>
              <p><strong>Chronic Diseases:</strong> {viewingPatient.chronicDiseases || "None"}</p>
              <p><strong>Allergy:</strong> {viewingPatient.allergy || "None"}</p>
              <p><strong>Marital Status:</strong> {viewingPatient.maritalStatus || "N/A"}</p>
              <p><strong>Had Surgery:</strong> {viewingPatient.hadSurgery ? "Yes" : "No"}</p>
              <p><strong>Emergency Contact:</strong> {viewingPatient.emergencyContactName} ({viewingPatient.emergencyContactPhone})</p>
              <p><strong>Created At:</strong> {viewingPatient.createdAt}</p>
              <p><strong>Updated At:</strong> {viewingPatient.updatedAt}</p>
              {viewingPatient.image && (
                <div style={{ marginTop: "10px" }}>
                  <strong>Profile Image:</strong><br />
                  <img
                    src={viewingPatient.image}
                    alt="Profile"
                    style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px", marginTop: "5px" }}
                  />
                </div>
              )}
              <div style={{ marginTop: "20px" }}>
                <h3 style={{ fontWeight: "bold", marginBottom: 10 }}>Appointments</h3>
                <Table
                  rowKey="appointmentId"
                  columns={appointmentColumns}
                  dataSource={appointments}
                  pagination={{ pageSize: 5 }}
                  size="small"
                />
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Modal */}
        <Modal
          open={!!editingPatient}
          title={`Edit Patient: ${editingPatient?.firstName} ${editingPatient?.lastName}`}
          onCancel={() => setEditingPatient(null)}
          onOk={handleUpdate}
          okText="Save"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="emergencyContactName" label="Emergency Contact Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="emergencyContactPhone" label="Emergency Contact Phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          open={!!patientToDelete}
          title="Confirm Deletion"
          onCancel={() => setPatientToDelete(null)}
          onOk={confirmDelete}
          okText="Delete"
          okType="danger"
        >
          Are you sure you want to delete{" "}
          <strong>{`${patientToDelete?.firstName} ${patientToDelete?.lastName}`}</strong>?
        </Modal>
      </div>
    </Layout>
  );
};

export default PatientList;
