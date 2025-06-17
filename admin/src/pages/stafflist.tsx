import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Space,
  Image,
  Typography,
  message,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Layout from "../components/Layout";

const { Search } = Input;
const { Title, Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const StaffList = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [viewingStaff, setViewingStaff] = useState<Staff | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/admin/staff");
        setStaffs(response.data);
      } catch (error) {
        message.error("Failed to fetch staff");
      } finally {
        setLoading(false);
      }
    };
    fetchStaffs();
  }, []);

  // Extract unique roles for filtering
  const roles = Array.from(new Set(staffs.map((s) => s.role))).sort();

  const filteredStaffs = staffs.filter((staff) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      staff.firstName.toLowerCase().includes(term) ||
      staff.lastName.toLowerCase().includes(term) ||
      staff.email.toLowerCase().includes(term) ||
      staff.role.toLowerCase().includes(term);
    const matchesRole = selectedRole ? staff.role === selectedRole : true;
    return matchesSearch && matchesRole;
  });

  const showDeleteConfirm = (staff: Staff) => {
    confirm({
      title: `Are you sure you want to delete ${staff.firstName} ${staff.lastName}?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDeleteStaff(staff.id);
      },
    });
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/admin/staff/${id}`);
      setStaffs((prev) => prev.filter((s) => s.id !== id));
      message.success("Staff deleted successfully");
    } catch (error) {
      message.error("Failed to delete staff");
    }
  };

  const openEditModal = (staff: Staff) => {
    setEditingStaff(staff);
    form.setFieldsValue({
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      phoneNumber: staff.phoneNumber,
      role: staff.role,
    });
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!editingStaff) return;

      const response = await axios.put(
        `http://localhost:5000/admin/staff/${editingStaff.id}`,
        values
      );
      setStaffs((prev) =>
        prev.map((s) => (s.id === editingStaff.id ? response.data : s))
      );
      message.success("Staff updated successfully");
      setEditingStaff(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to update staff");
    }
  };

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
          alt="staff"
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
      render: (_: any, record: Staff) =>
        `${record.firstName} ${record.lastName}`,
      sorter: (a: Staff, b: Staff) => a.firstName.localeCompare(b.firstName),
      width: 180,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: (a: Staff, b: Staff) => a.role.localeCompare(b.role),
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
      title: "Actions",
      key: "actions",
      render: (_: any, record: Staff) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => setViewingStaff(record)}
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
          Staff List
        </Title>

        <Space style={{ marginBottom: 16 }} wrap>
          <Search
            placeholder="Search by name, email, or role..."
            allowClear
            enterButton
            size="middle"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            style={{ maxWidth: 300 }}
          />

          <Select
            placeholder="Filter by role"
            allowClear
            style={{ minWidth: 200 }}
            value={selectedRole || undefined}
            onChange={(value) => setSelectedRole(value || "")}
          >
            {roles.map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </Space>

        <Table
          rowKey="id"
          dataSource={filteredStaffs}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 8 }}
          bordered
          scroll={{ x: 900 }}
        />

        {/* Edit Modal */}
        <Modal
          title={`Edit Staff: ${editingStaff?.firstName} ${editingStaff?.lastName}`}
          open={!!editingStaff}
          onOk={handleEditSubmit}
          onCancel={() => {
            setEditingStaff(null);
            form.resetFields();
          }}
          okText="Save Changes"
          cancelText="Cancel"
          destroyOnClose
        >
          <Form form={form} layout="vertical">
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
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Invalid email" },
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
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select placeholder="Select role">
                {roles.map((role) => (
                  <Option key={role} value={role}>
                    {role}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Modal */}
        <Modal
          title={`Staff Profile: ${viewingStaff?.firstName} ${viewingStaff?.lastName}`}
          open={!!viewingStaff}
          onCancel={() => setViewingStaff(null)}
          footer={[
            <Button key="close" onClick={() => setViewingStaff(null)}>
              Close
            </Button>,
          ]}
          width={600}
          destroyOnClose
        >
          {viewingStaff && (
            <Space size="large" direction="horizontal" style={{ width: "100%" }}>
              <Image
                width={150}
                height={150}
                src={viewingStaff.image || "https://via.placeholder.com/150"}
                alt="staff"
                style={{ borderRadius: 8 }}
                preview={false}
              />
              <div style={{ flex: 1 }}>
                <Text>
                  <strong>Name:</strong> {viewingStaff.firstName} {viewingStaff.lastName}
                </Text>
                <br />
                <Text>
                  <strong>Role:</strong> {viewingStaff.role}
                </Text>
                <br />
                <Text>
                  <strong>Email:</strong> {viewingStaff.email}
                </Text>
                <br />
                <Text>
                  <strong>Phone:</strong> {viewingStaff.phoneNumber}
                </Text>
              </div>
            </Space>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default StaffList;
