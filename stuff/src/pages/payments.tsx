import React, { useEffect, useState, useRef } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import { ColumnsType } from "antd/es/table";
import ReactToPrint from "react-to-print";
import Layout from "../components/Layout";

interface Invoice {
  id: number;
  patientName: string;
  description: string;
  amount: number;
  status: string;
  issuedDate: string;
  dueDate: string;
}

const Payments: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/doctor/invoices");
      setInvoices(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch invoices");
      setLoading(false);
    }
  };

  const markAsPaid = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/doctor/invoices/${id}/pay`);
      message.success("Marked as paid");
      fetchInvoices();
    } catch (error) {
      message.error("Failed to mark as paid");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const columns: ColumnsType<Invoice> = [
    {
      title: "Invoice ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount ($)",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Issued Date",
      dataIndex: "issuedDate",
      key: "issuedDate",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span style={{ color: status === "Paid" ? "green" : "red" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_text, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => markAsPaid(record.id)}
            disabled={record.status === "Paid"}
          >
            Mark Paid
          </Button>

          <ReactToPrint
            trigger={() => <Button>Print</Button>}
            content={() => printRef.current}
            onBeforeGetContent={() => setSelectedInvoice(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Payments</h2>
        <Table
          columns={columns}
          dataSource={invoices}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />

        {/* Hidden invoice print content */}
        <div style={{ display: "none" }}>
          <div ref={printRef} className="p-8 font-mono">
            <h2 className="text-2xl font-bold mb-4">Invoice</h2>
            <p><strong>Invoice ID:</strong> {selectedInvoice?.id}</p>
            <p><strong>Patient Name:</strong> {selectedInvoice?.patientName}</p>
            <p><strong>Description:</strong> {selectedInvoice?.description}</p>
            <p><strong>Amount:</strong> ${selectedInvoice?.amount}</p>
            <p><strong>Issued Date:</strong> {selectedInvoice?.issuedDate ? new Date(selectedInvoice.issuedDate).toLocaleDateString() : ''}</p>
            <p><strong>Due Date:</strong> {selectedInvoice?.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString() : ''}</p>
            <p><strong>Status:</strong> {selectedInvoice?.status}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payments;
