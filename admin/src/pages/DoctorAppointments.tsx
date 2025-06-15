"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Table, Button, Input, Select, Tag, Space } from "antd";
import DoctorLayout from "../components/DoctorLayout";
import { SearchOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Option } = Select;

type Appointment = {
  id: number;
  patient: string;
  image?: string;
  payment?: string;
  age: number;
  datetime: string;
  fees: string;
  status: string;
  notes?: string;
};

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "today" | "month">("today");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const doctorId = (() => {
    try {
      const stored = localStorage.getItem("doctor");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed?.id ?? null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found. Please login again.");
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/doctor/${doctorId}/appointments/detailed`);
        setAppointments(res.data);
      } catch (err) {
        setError("Failed to fetch appointments.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  useEffect(() => {
    let filtered = [...appointments];

    if (filterType === "today") {
      filtered = filtered.filter((appt) => moment(appt.datetime).isSame(moment(), "day"));
    } else if (filterType === "month") {
      filtered = filtered.filter((appt) => moment(appt.datetime).isSame(moment(), "month"));
    }

    if (searchTerm) {
      filtered = filtered.filter((appt) =>
        appt.patient.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, appointments, filterType]);

  const statusTag = (status: string) => {
    if (status === "Completed") return <Tag color="green">Completed</Tag>;
    if (status === "Cancelled") return <Tag color="red">Cancelled</Tag>;
    return <Tag color="blue">{status}</Tag>;
  };

  const handleCancel = async (appointmentId: number) => {
    const confirm = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:5000/doctor/appointments/${appointmentId}/cancel`);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: "Cancelled" } : appt
        )
      );
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment. Try again.");
    }
  };

  const handleComplete = async (appointmentId: number) => {
    const confirm = window.confirm("Mark this appointment as completed?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:5000/doctor/appointments/${appointmentId}/complete`);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: "Completed" } : appt
        )
      );
    } catch (err) {
      console.error("Error completing appointment:", err);
      alert("Failed to complete appointment. Try again.");
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Patient",
      key: "patient",
      dataIndex: "patient",
      render: (_: any, record: Appointment) => (
        <div className="flex items-center gap-2">
          <img
            src={record.image || "/default-profile.png"}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover border"
          />
          <span>{record.patient}</span>
        </div>
      ),
    },
    {
      title: "Payment",
      key: "payment",
      dataIndex: "payment",
      render: (payment: string) =>
        payment ? (
          <Tag color="purple">{payment}</Tag>
        ) : (
          <Tag color="default">N/A</Tag>
        ),
    },
    {
      title: "Age",
      key: "age",
      dataIndex: "age",
    },
    {
      title: "Date & Time",
      key: "datetime",
      dataIndex: "datetime",
      render: (datetime: string) => moment(datetime).format("YYYY-MM-DD hh:mm A"),
    },
    {
      title: "Fees",
      key: "fees",
      dataIndex: "fees",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => statusTag(status),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Appointment) => (
        <Space>
          {record.status !== "Cancelled" && (
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => handleCancel(record.id)}
            />
          )}
          {record.status === "Scheduled" && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleComplete(record.id)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <DoctorLayout>
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Appointments</h1>

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by patient name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3"
          />

          <Select
            value={filterType}
            onChange={(val) => setFilterType(val)}
            className="w-full md:w-1/4"
          >
            <Option value="today">Today</Option>
            <Option value="all">All</Option>
            <Option value="month">This Month</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredAppointments}
          loading={loading}
          pagination={{ pageSize: 6 }}
          rowKey="id"
        />
      </div>
    </DoctorLayout>
  );
}
