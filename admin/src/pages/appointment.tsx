import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import moment from "moment";
import { Table, Input, Button, Tag, Space, message, Modal } from "antd";

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentStatus: "Scheduled" | "Completed" | "Cancelled";
  payment?: string;
  age?: number;
  fees?: string;
  notes?: string;
  patientImage?: string; // ممكن تكون base64 أو اسم ملف
}

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "today" | "month">("today");
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/admin/recent-appointments");

        const fixedData = response.data.map((appt: any) => ({
          ...appt,
          id: appt.id ?? appt.appointmentId,
        }));

        setAppointments(fixedData);
      } catch (error) {
        message.error("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = [...appointments];

    if (filterType === "today") {
      filtered = filtered.filter((appt) =>
        moment(appt.appointmentDate).isSame(moment(), "day")
      );
    } else if (filterType === "month") {
      filtered = filtered.filter((appt) =>
        moment(appt.appointmentDate).isSame(moment(), "month")
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((appt) =>
        appt.patientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, appointments, filterType]);

  const showCancelConfirmation = (appointmentId: number) => {
    setCancelingId(appointmentId);
    setIsModalVisible(true);
  };

  const handleCancelConfirmed = async () => {
    if (cancelingId === null) return;

    try {
      await axios.put(`http://localhost:5000/admin/appointments/${cancelingId}`);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === cancelingId ? { ...appt, appointmentStatus: "Cancelled" } : appt
        )
      );
      message.success("Appointment cancelled successfully.");
    } catch (error) {
      message.error("Failed to cancel appointment.");
    } finally {
      setIsModalVisible(false);
      setCancelingId(null);
    }
  };

  const handleCancelRejected = () => {
    setIsModalVisible(false);
    setCancelingId(null);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "Completed":
        return <Tag color="green">{status}</Tag>;
      case "Cancelled":
        return <Tag color="red">{status}</Tag>;
      default:
        return <Tag color="blue">{status}</Tag>;
    }
  };

  const getImageUrl = (img?: string): string => {
    if (!img) return "https://via.placeholder.com/32";
    if (img.startsWith("data:image")) return img;
    return `http://localhost:5000/uploads/${img}`;
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Patient",
      dataIndex: "patientName",
      key: "patientName",
      render: (text: string, record: Appointment) => (
        <Space>
          <img
            src={getImageUrl(record.patientImage)}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Date & Time",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date: string) => moment(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "appointmentStatus",
      key: "appointmentStatus",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Appointment) =>
        record.appointmentStatus === "Scheduled" ? (
          <Button
            danger
            type="link"
            onClick={() => showCancelConfirmation(record.id)}
          >
            Cancel
          </Button>
        ) : (
          <span style={{ color: "#999" }}>—</span>
        ),
    },
  ];

  return (
    <Layout>
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-xl font-semibold text-purple-700 mb-4">All Appointments</h1>

        <Space className="mb-4 flex flex-wrap" size="middle">
          <Input
            placeholder="Search by patient name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 220 }}
          />
          <Button
            type={filterType === "all" ? "primary" : "default"}
            onClick={() => setFilterType("all")}
          >
            All
          </Button>
          <Button
            type={filterType === "today" ? "primary" : "default"}
            onClick={() => setFilterType("today")}
          >
            Today
          </Button>
          <Button
            type={filterType === "month" ? "primary" : "default"}
            onClick={() => setFilterType("month")}
          >
            This Month
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredAppointments}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          bordered
        />

        <Modal
          title="Confirm Cancellation"
          open={isModalVisible}
          onOk={handleCancelConfirmed}
          onCancel={handleCancelRejected}
          okText="Yes, Cancel"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to cancel this appointment?</p>
        </Modal>
      </div>
    </Layout>
  );
};

export default AppointmentCalendar;
