import { useEffect, useState } from "react";
import { Table, Button, message, Select, Input, Tag, Modal, Space } from "antd";
import axios from "axios";
import Layout from "../components/Layout";
import moment from "moment";

const { Option } = Select;
const { Search } = Input;

interface Payment {
  id: number;
  appointmentId: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Cancelled";
  paymentMethod: "Cash" | "Card" | "Online";
  createdAt: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewFilter, setViewFilter] = useState<"Today" | "All">("Today");

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/staff/payments");
      setPayments(response.data);
      setFilteredPayments(response.data);
    } catch {
      message.error("Failed to fetch payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    let data = [...payments];

    if (viewFilter === "Today") {
      const today = moment().format("YYYY-MM-DD");
      data = data.filter((p) => p.appointmentDate.startsWith(today));
    }

    if (filterStatus !== "All") {
      data = data.filter((p) => p.paymentStatus === filterStatus);
    }

    if (searchQuery.trim()) {
      data = data.filter((p) =>
        p.patientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPayments(data);
  }, [filterStatus, searchQuery, payments, viewFilter]);

  const updatePaymentStatus = async (id: number, newStatus: string) => {
    try {
      await axios.put(`http://localhost:5000/staff/payments/${id}`, {
        paymentStatus: newStatus,
      });
      message.success("Payment status updated.");
      fetchPayments();
      setEditingId(null);
    } catch {
      message.error("Update failed.");
    }
  };

  const columns = [
    {
      title: "Appointment",
      dataIndex: "appointmentId",
    },
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
      render: (text: string) => moment(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount: number) =>
        amount && !isNaN(Number(amount)) ? Number(amount).toFixed(2) + " $" : "0.00 $",
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      render: (status: string) => (
        <Tag color={status === "Paid" ? "green" : status === "Pending" ? "orange" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
    },
    {
      title: "Actions",
      render: (_: any, record: Payment) => (
        <>
          <Button onClick={() => setEditingId(record.id)} style={{ marginRight: 8 }}>
            Update
          </Button>
          <Button onClick={() => window.print()}>Print Invoice</Button>

          <Modal
            open={editingId === record.id}
            title="Update Payment Status"
            onCancel={() => setEditingId(null)}
            onOk={() => updatePaymentStatus(record.id, selectedStatus)}
          >
            <Select
              defaultValue={record.paymentStatus}
              onChange={(val) => setSelectedStatus(val)}
              style={{ width: "100%" }}
            >
              <Option value="Paid">Paid</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Modal>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Payments List</h1>

        <Space style={{ marginBottom: 16 }} wrap>
          <Select
            defaultValue="Today"
            value={viewFilter}
            onChange={(value: "Today" | "All") => setViewFilter(value)}
            style={{ width: 150 }}
          >
            <Option value="Today">Today</Option>
            <Option value="All">All</Option>
          </Select>

          <Select
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            style={{ width: 200 }}
          >
            <Option value="All">All Statuses</Option>
            <Option value="Paid">Paid</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>

          <Search
            placeholder="Search by patient name"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </Space>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredPayments}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </Layout>
  );
};

export default Payments;
