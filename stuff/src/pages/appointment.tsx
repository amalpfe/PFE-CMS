// src/pages/Appointments.tsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Select,
  DatePicker,
  Button,
  Tag,
  message,
  Modal,
  Form,
  Input,
} from "antd";
import axios from "axios";
import moment from "moment";
import Layout from "../components/Layout";

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentStatus: string;
  notes?: string;
}

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
}

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
}

const statusColors: Record<string, string> = {
  Scheduled: "blue",
  Completed: "green",
  Cancelled: "red",
};

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filtered, setFiltered] = useState<Appointment[]>([]);
  const [doctorFilter, setDoctorFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [patientSearch, setPatientSearch] = useState<string>("");
  const [viewFilter, setViewFilter] = useState<"Today" | "All">("Today");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/staff/appointments");
      setAppointments(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load appointments.");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/patient/doctors");
      setDoctors(res.data);
    } catch (err) {
      message.error("Failed to load doctors.");
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/patient/all");
      setPatients(res.data);
    } catch (err) {
      message.error("Failed to load patients.");
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:5000/staff/appointments/status/${id}`, {
        status: newStatus,
      });
      message.success("Status updated");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      message.error("Status update failed");
    }
  };

  const filterData = () => {
    let data = [...appointments];

    if (viewFilter === "Today") {
      const today = moment().format("YYYY-MM-DD");
      data = data.filter((a) => a.appointmentDate.startsWith(today));
    }

    if (doctorFilter) {
      data = data.filter((a) => a.doctorName.includes(doctorFilter));
    }
    if (statusFilter) {
      data = data.filter((a) => a.appointmentStatus === statusFilter);
    }
    if (dateFilter) {
      data = data.filter((a) => a.appointmentDate.startsWith(dateFilter));
    }
    if (patientSearch) {
      data = data.filter((a) =>
        a.patientName.toLowerCase().includes(patientSearch.toLowerCase())
      );
    }

    setFiltered(data);
  };

  useEffect(() => {
    filterData();
  }, [appointments, viewFilter, doctorFilter, statusFilter, dateFilter, patientSearch]);

  const handleCreateAppointment = async (values: any) => {
    const data = {
      patientId: values.patientId,
      doctorId: values.doctorId,
      appointmentDate: values.appointmentDate.format("YYYY-MM-DD"),
      appointmentStatus: values.appointmentStatus,
      notes: values.notes || "",
    };

    try {
      await axios.post("http://localhost:5000/staff/appointments", data);
      message.success("Appointment created");
      form.resetFields();
      setIsModalOpen(false);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      message.error("Failed to create appointment.");
    }
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "patientName",
    },
    {
      title: "Doctor",
      dataIndex: "doctorName",
    },
    {
      title: "Date",
      dataIndex: "appointmentDate",
    },
    {
      title: "Status",
      dataIndex: "appointmentStatus",
      render: (status: string, record: Appointment) => (
        <Select
          value={status}
          onChange={(val) => handleStatusChange(record.id, val)}
          style={{ width: 120 }}
        >
          {["Scheduled", "Completed", "Cancelled"].map((s) => (
            <Option key={s} value={s}>
              <Tag color={statusColors[s]}>{s}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Notes",
      dataIndex: "notes",
    },
  ];

  return (
    <Layout>
      <div style={{ padding: 20 }}>
        <h2 className="text-3xl font-bold mb-6">Appointment Management</h2>

        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <Select
            defaultValue="Today"
            onChange={(val: "Today" | "All") => setViewFilter(val)}
            style={{ width: 150 }}
          >
            <Option value="Today">Today</Option>
            <Option value="All">All</Option>
          </Select>

          <Select
            allowClear
            placeholder="Filter by doctor"
            onChange={(val) => setDoctorFilter(val)}
            style={{ width: 200 }}
          >
            {[...new Set(appointments.map((a) => a.doctorName))].map((name) => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </Select>

          <Select
            allowClear
            placeholder="Filter by status"
            onChange={(val) => setStatusFilter(val)}
            style={{ width: 150 }}
          >
            <Option value="Scheduled">Scheduled</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>

          <DatePicker
            allowClear
            placeholder="Filter by date"
            onChange={(date) =>
              setDateFilter(date ? moment(date).format("YYYY-MM-DD") : "")
            }
          />

          <Search
            placeholder="Search by patient name"
            onChange={(e) => setPatientSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />

          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            ➕ Create Appointment
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />

        <Modal
          title="Create Appointment"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form layout="vertical" form={form} onFinish={handleCreateAppointment}>
            <Form.Item
              name="patientId"
              label="Patient"
              rules={[{ required: true, message: "Please select a patient" }]}
            >
              <Select placeholder="Select patient">
                {patients.map((p) => (
                  <Option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="doctorId"
              label="Doctor"
              rules={[{ required: true, message: "Please select a doctor" }]}
            >
              <Select placeholder="Select doctor">
                {doctors.map((d) => (
                  <Option key={d.id} value={d.id}>
                    {d.firstName} {d.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="appointmentDate"
              label="Appointment Date & Time"
              rules={[{ required: true, message: "Please pick a date & time" }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="appointmentStatus"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
              initialValue="Scheduled"
            >
              <Select>
                <Option value="Scheduled">Scheduled</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Create Appointment
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Appointments;
