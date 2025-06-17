// src/pages/DoctorAvailability.tsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  TimePicker,
  message,
  Input,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";
import Layout from "../components/Layout";

const { Option } = Select;
const { Search } = Input;

interface Availability {
  id: number;
  doctorId: number;
  doctorName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DoctorAvailability = () => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [filtered, setFiltered] = useState<Availability[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState<Availability | null>(null);
  const [dayFilter, setDayFilter] = useState<string>("");
  const [doctorSearch, setDoctorSearch] = useState<string>("");

  const fetchAvailability = async () => {
    try {
      const res = await axios.get("http://localhost:5000/staff/availability");
      setAvailability(res.data);
      setFiltered(res.data);
    } catch (error) {
      message.error("Failed to fetch availability.");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/doctor/all");
      setDoctors(res.data);
    } catch {
      message.error("Failed to fetch doctors.");
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchAvailability();
  }, []);

  useEffect(() => {
    let data = [...availability];
    if (dayFilter) {
      data = data.filter((a) => a.dayOfWeek === dayFilter);
    }
    if (doctorSearch) {
      data = data.filter((a) =>
        a.doctorName.toLowerCase().includes(doctorSearch.toLowerCase())
      );
    }
    setFiltered(data);
  }, [dayFilter, doctorSearch, availability]);

  const handleSubmit = async (values: any) => {
    const payload = {
      doctorId: values.doctorId,
      dayOfWeek: values.dayOfWeek,
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
    };

    try {
      if (editing) {
        await axios.put(
          `http://localhost:5000/staff/availability/${editing.id}`,
          payload
        );
        message.success("Availability updated.");
      } else {
        await axios.post("http://localhost:5000/staff/availability", payload);
        message.success("Availability added.");
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditing(null);
      fetchAvailability();
    } catch {
      message.error("Error saving availability.");
    }
  };

  const handleEdit = (record: Availability) => {
    setEditing(record);
    form.setFieldsValue({
      doctorId: record.doctorId,
      dayOfWeek: record.dayOfWeek,
      startTime: dayjs(record.startTime, "HH:mm"),
      endTime: dayjs(record.endTime, "HH:mm"),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/staff/availability/${id}`);
      message.success("Deleted.");
      fetchAvailability();
    } catch {
      message.error("Failed to delete.");
    }
  };

  const columns = [
    {
      title: "Doctor",
      dataIndex: "doctorName",
    },
    {
      title: "Day",
      dataIndex: "dayOfWeek",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
    },
    {
      title: "Actions",
      render: (_: any, record: Availability) => (
        <>
          <Button onClick={() => handleEdit(record)} type="link">
            Edit
          </Button>
          <Button onClick={() => handleDelete(record.id)} danger type="link">
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div style={{ padding: 20 }}>
        <h2 className="text-3xl font-bold mb-6">Doctor Availability Management</h2>

        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <Select
            allowClear
            placeholder="Filter by day"
            style={{ width: 200 }}
            onChange={(val) => setDayFilter(val || "")}
          >
            {days.map((day) => (
              <Option key={day} value={day}>
                {day}
              </Option>
            ))}
          </Select>

          <Search
            allowClear
            placeholder="Search doctor name"
            onChange={(e) => setDoctorSearch(e.target.value)}
            style={{ width: 200 }}
          />

          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
              form.resetFields();
              setEditing(null);
            }}
          >
            Add Availability
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          style={{ marginTop: 20 }}
        />

        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={() => form.submit()}
          title={editing ? "Edit Availability" : "Add Availability"}
        >
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
              label="Doctor"
              name="doctorId"
              rules={[{ required: true, message: "Please select a doctor" }]}
            >
              <Select placeholder="Select doctor">
                {doctors.map((doc) => (
                  <Option key={doc.id} value={doc.id}>
                    {doc.firstName} {doc.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Day of Week"
              name="dayOfWeek"
              rules={[{ required: true, message: "Please select a day" }]}
            >
              <Select placeholder="Select day">
                {days.map((day) => (
                  <Option key={day} value={day}>
                    {day}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Start Time"
              name="startTime"
              rules={[{ required: true, message: "Please select a start time" }]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="End Time"
              name="endTime"
              rules={[{ required: true, message: "Please select an end time" }]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default DoctorAvailability;
