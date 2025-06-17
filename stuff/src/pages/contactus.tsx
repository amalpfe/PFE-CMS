// src/pages/ContactUs.tsx
import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import Layout from "../components/Layout";
import axios from "axios";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const ContactUs = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/staff/contactus");
      setMessages(res.data);
    } catch (err) {
      message.error("Failed to fetch contact messages.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text: string) => (
        <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", maxWidth: 400 }}>
          {text}
        </div>
      )
    },
    {
      title: "Sent At",
      dataIndex: "created_at",
      key: "created_at"
    },
  ];

  const handleRowClick = (record: ContactMessage) => {
    const subject = `Reply to your message on Aeternum Clinic`;
    const body = `Hi ${record.name},\n\nThank you for your message:\n"${record.message}"\n\n[Your reply here]\n\nBest regards,\nAeternum Clinic Staff`;

    // Open the user's default email client
    window.location.href = `mailto:${record.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Layout>
      <div style={{ padding: 20 }}>
        <h2  className="text-3xl font-bold mb-6">Contact Messages</h2>
        <Table
          columns={columns}
          dataSource={messages}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: "pointer" }
          })}
        />
      </div>
    </Layout>
  );
};

export default ContactUs;
