import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button, Modal, Form, Space, Image, Typography, message } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Layout from "../components/Layout";

const { Search } = Input;
const { Title, Text } = Typography;
const { confirm } = Modal;

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  phoneNumber: string;
  email: string;
  address: string;
  degree: string;
  fees: string;
  experience: string;
  about: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const DoctorList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);
  const [form] = Form.useForm();

  // Fetch doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/admin/doctors");
        setDoctors(response.data);
      } catch (error) {
        message.error("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors by search term
  const filteredDoctors = doctors.filter((doctor) => {
    const term = searchTerm.toLowerCase();
    return (
      doctor.firstName.toLowerCase().includes(term) ||
      doctor.lastName.toLowerCase().includes(term) ||
      doctor.email.toLowerCase().includes(term) ||
      doctor.specialty.toLowerCase().includes(term)
    );
  });

  // Confirm delete modal
  const showDeleteConfirm = (doctor: Doctor) => {
    confirm({
      title: `Are you sure you want to delete Dr. ${doctor.firstName} ${doctor.lastName}?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDeleteDoctor(doctor.id);
      },
    });
  };

  // Delete doctor handler
  const handleDeleteDoctor = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/admin/doctors/${id}`);
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
      message.success("Doctor deleted successfully");
    } catch (error) {
      message.error("Failed to delete doctor");
    }
  };

  // Edit modal open
  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    form.setFieldsValue({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      specialty: doctor.specialty,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      fees: doctor.fees,
    });
  };

  // Edit modal submit
  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!editingDoctor) return;

      const response = await axios.put(`http://localhost:5000/admin/doctors/${editingDoctor.id}`, values);
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === editingDoctor.id ? response.data : doc))
      );
      message.success("Doctor updated successfully");
      setEditingDoctor(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to update doctor");
    }
  };

  // Columns for antd Table
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <Image
          width={50}
          height={50}
          src={image || "https://via.placeholder.com/100"}
          alt="doctor"
          style={{ borderRadius: "50%" }}
          preview={false}
        />
      ),
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "firstName",
      key: "name",
      render: (_: any, record: Doctor) => `${record.firstName} ${record.lastName}`,
      sorter: (a: Doctor, b: Doctor) => a.firstName.localeCompare(b.firstName),
      width: 180,
    },
    {
      title: "Specialty",
      dataIndex: "specialty",
      key: "specialty",
      sorter: (a: Doctor, b: Doctor) => a.specialty.localeCompare(b.specialty),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Fees",
      dataIndex: "fees",
      key: "fees",
      render: (fees: string) => `$${fees}`,
      sorter: (a: Doctor, b: Doctor) => Number(a.fees) - Number(b.fees),
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Doctor) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => setViewingDoctor(record)}
            type="default"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            type="primary"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
            danger
          />
        </Space>
      ),
      width: 140,
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        <Title level={2} style={{ color: "#6b21a8", marginBottom: 24 }}>
          Doctor List
        </Title>

        <Search
          placeholder="Search by name, email, or specialty..."
          allowClear
          enterButton="Search"
          size="middle"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 16, maxWidth: 400 }}
          value={searchTerm}
        />

        <Table
          rowKey="id"
          dataSource={filteredDoctors}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 8 }}
          bordered
          scroll={{ x: 900 }}
        />

        {/* Edit Doctor Modal */}
        <Modal
          title={`Edit Doctor: ${editingDoctor?.firstName} ${editingDoctor?.lastName}`}
          visible={!!editingDoctor}
          onOk={handleEditSubmit}
          onCancel={() => {
            setEditingDoctor(null);
            form.resetFields();
          }}
          okText="Save Changes"
          cancelText="Cancel"
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={editingDoctor || {}}
            preserve={false}
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="specialty"
              label="Specialty"
              rules={[{ required: true, message: "Please enter specialty" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="fees"
              label="Fees"
              rules={[{ required: true, message: "Please enter fees" }]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Form>
        </Modal>

        {/* View Doctor Modal */}
        <Modal
          title={`Doctor Profile: ${viewingDoctor?.firstName} ${viewingDoctor?.lastName}`}
          visible={!!viewingDoctor}
          footer={[
            <Button key="close" onClick={() => setViewingDoctor(null)}>
              Close
            </Button>,
          ]}
          onCancel={() => setViewingDoctor(null)}
          width={600}
          destroyOnClose
        >
          {viewingDoctor && (
            <Space size="large" direction="horizontal" style={{ width: "100%" }}>
              <Image
                width={150}
                height={150}
                src={viewingDoctor.image || "https://via.placeholder.com/150"}
                alt={`${viewingDoctor.firstName} ${viewingDoctor.lastName}`}
                style={{ borderRadius: 8 }}
                preview={false}
              />
              <div style={{ flex: 1 }}>
                <Text>
                  <strong>Name: </strong>
                  {viewingDoctor.firstName} {viewingDoctor.lastName}
                </Text>
                <br />
                <Text>
                  <strong>Specialty: </strong>
                  {viewingDoctor.specialty}
                </Text>
                <br />
                <Text>
                  <strong>Email: </strong>
                  {viewingDoctor.email}
                </Text>
                <br />
                <Text>
                  <strong>Phone: </strong>
                  {viewingDoctor.phoneNumber}
                </Text>
                <br />
                <Text>
                  <strong>Degree: </strong>
                  {viewingDoctor.degree}
                </Text>
                <br />
                <Text>
                  <strong>Fees: </strong>${viewingDoctor.fees}
                </Text>
                <br />
                <Text>
                  <strong>Experience: </strong>
                  {viewingDoctor.experience}
                </Text>
                <br />
                <Text>
                  <strong>Address: </strong>
                  {viewingDoctor.address}
                </Text>
                <br />
                <Text>
                  <strong>About: </strong>
                  {viewingDoctor.about}
                </Text>
              </div>
            </Space>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default DoctorList;
