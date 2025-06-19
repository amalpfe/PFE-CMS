import { useEffect, useState } from "react";
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
  Radio,
  Space,
} from "antd";
import axios from "axios";
import moment from "moment";
import Layout from "../components/Layout";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea, Search } = Input;

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

interface AvailableSlot {
  doctorId: number;
  doctorName: string;
  start: string;
  end: string;
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

  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

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
      const res = await axios.get("http://localhost:5000/staff/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load doctors.");
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/staff/patients");
      setPatients(res.data);
    } catch (err) {
      console.error(err);
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
    const isoDate = values.appointmentDate.toISOString();
    const data = {
      patientId: values.patientId,
      doctorId: values.doctorId,
      appointmentDate: isoDate,
      appointmentStatus: values.appointmentStatus,
      notes: values.notes || "",
    };

    try {
      await axios.post("http://localhost:5000/staff/appointments", data);
      message.success("Appointment created");
      form.resetFields();
      setAvailableSlots([]);
      setIsModalOpen(false);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      message.error("Failed to create appointment.");
    }
  };

  const getFullName = (firstName: string, lastName?: string) =>
    `${firstName ?? ""} ${lastName ?? ""}`.trim();

  const openCreateModal = async () => {
    setIsModalOpen(true);
    setLoadingSlots(true);
    try {
      const res = await axios.get("http://localhost:5000/staff/available-appointments");
      setAvailableSlots(res.data.availableSlots);
    } catch (err) {
      message.error("Failed to load available appointment slots.");
    }
    setLoadingSlots(false);
  };

  const onSlotSelect = (slot: AvailableSlot) => {
    form.setFieldsValue({
      doctorId: slot.doctorId,
      appointmentDate: dayjs(slot.start),
    });
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
      render: (text: string) => moment(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "appointmentStatus",
      render: (status: string, record: Appointment) => (
        <Select
          value={status}
          onChange={(val) => handleStatusChange(record.id, val)}
          style={{ width: 120 }}
          disabled={["Completed", "Cancelled"].includes(status)} // 🔒 Disables after final states
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

        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
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
              setDateFilter(date ? dayjs(date).format("YYYY-MM-DD") : "")
            }
          />

          <Search
            placeholder="Search by patient name"
            onChange={(e) => setPatientSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />

          <Button type="primary" onClick={openCreateModal} loading={loadingSlots}>
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
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
            setAvailableSlots([]);
          }}
          footer={null}
          width={700}
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
                    {getFullName(p.firstName, p.lastName)}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {availableSlots.length > 0 && (
              <Form.Item label="Select Available Slot (optional)">
                <Radio.Group
                  style={{ maxHeight: 150, overflowY: "auto", display: "block" }}
                  onChange={(e) => {
                    const slot = availableSlots.find(
                      (s) => `${s.doctorId}-${s.start}` === e.target.value
                    );
                    if (slot) onSlotSelect(slot);
                  }}
                >
                  <Space direction="vertical">
                    {availableSlots.map((slot) => (
                      <Radio
                        key={`${slot.doctorId}-${slot.start}`}
                        value={`${slot.doctorId}-${slot.start}`}
                      >
                        Dr. {slot.doctorName} |{" "}
                        {moment(slot.start).format("YYYY-MM-DD HH:mm")} -{" "}
                        {moment(slot.end).format("HH:mm")}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Form.Item>
            )}

            <Form.Item
              name="doctorId"
              label="Doctor"
              rules={[{ required: true, message: "Please select a doctor" }]}
            >
              <Select placeholder="Select doctor">
                {doctors.map((d) => (
                  <Option key={d.id} value={d.id}>
                    {getFullName(d.firstName, d.lastName)}
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
