import React, { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Form, message, Select, DatePicker } from "antd";
import Layout from "../components/Layout";
import axios from "axios";

const { Option } = Select;

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
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/patient/patients");
      setPatients(res.data);
      setFilteredPatients(res.data);
    } catch (error) {
      message.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    setFilteredPatients(
      patients.filter((p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, patients]);

 const handleViewPatient = async (patient: Patient) => {
    setViewingPatient(patient);
    try {
      const response = await axios.get(`http://localhost:5000/patient/appointments/${patient.id}`);
      setAppointments(response.data.data || []);
    } catch {
      message.error("Failed to load appointments");
    }
  };

  const handleRegisterPatient = async (values: any) => {
    try {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
      };
      await axios.post("http://localhost:5000/patient/register", payload);
      message.success("Patient registered successfully");
      setRegisterModalOpen(false);
      form.resetFields();
      fetchPatients();
    } catch {
      message.error("Failed to register patient");
    }
  };

  const columns = [
    {
      title: "Name",
      render: (_: any, record: Patient) => `${record.firstName} ${record.lastName}`,
    },
    { title: "DOB", dataIndex: "dateOfBirth" },
    { title: "Gender", dataIndex: "gender" },
    { title: "Phone", dataIndex: "phoneNumber" },
    { title: "Email", dataIndex: "email" },
    { title: "Address", dataIndex: "address" },
    {
      title: "Emergency Contact",
      render: (_: any, record: Patient) =>
        `${record.emergencyContactName} (${record.emergencyContactPhone})`,
    },
    {
      title: "Actions",
      render: (_: any, record: Patient) => (
         <Button type="link" onClick={() => handleViewPatient(record)}>View</Button>
      ),
    },
  ];

  const appointmentColumns = [
    {
      title: "Date",
      dataIndex: "appointmentDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    { title: "Doctor", dataIndex: "doctorName" },
    { title: "Specialty", dataIndex: "specialty" },
    { title: "Status", dataIndex: "appointmentStatus" },
    { title: "Notes", dataIndex: "notes" },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold mb-6">Patient List</h1>
          <Button
            type="primary"
            onClick={() => setRegisterModalOpen(true)}
            className="bg-purple-600"
          >
            Register New Patient
          </Button>
        </div>

        <Input.Search
          placeholder="Search by name..."
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: 300, marginBottom: 20 }}
          allowClear
        />

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredPatients}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />

        {/* View Patient Modal */}
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

        {/* Register Patient Modal */}
        <Modal
          open={registerModalOpen}
          title="Register New Patient"
          onCancel={() => setRegisterModalOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleRegisterPatient}>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Select>
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>
            <Form.Item
              name="emergencyContactName"
              label="Emergency Contact Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="emergencyContactPhone"
              label="Emergency Contact Phone"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="bg-purple-600">
                Register
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default PatientList;
