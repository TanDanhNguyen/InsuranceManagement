
import { useEffect, useMemo, useState } from "react";

import {
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  Popconfirm,
  message,
} from "antd";

import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

import type {
  Customer,
  CustomerRequest,
} from "../types/customer";

import { customerService } from "../services/customerService";
import CustomerForm from "../components/CustomerForm";

const { Title } = Typography;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const loadCustomers = async () => {
    setLoading(true);

    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch {
      messageApi.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return customers.filter((customer) => {
      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();

      return (
        fullName.includes(keyword) ||
        customer.email.toLowerCase().includes(keyword) ||
        customer.phoneNumber.includes(keyword)
      );
    });
  }, [customers, search]);

  const handleCreate = () => {
    setSelectedCustomer(null);
    setModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleSubmit = async (values: CustomerRequest) => {
    try {
      if (selectedCustomer) {
        await customerService.update(selectedCustomer.id, values);
        messageApi.success("Customer updated successfully");
      } else {
        await customerService.create(values);
        messageApi.success("Customer created successfully");
      }

      setModalOpen(false);
      setSelectedCustomer(null);

      await loadCustomers();
    } catch {
      messageApi.error("Unable to save customer");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await customerService.delete(id);
      messageApi.success("Customer deleted successfully");
      await loadCustomers();
    } catch {
      messageApi.error("Unable to delete customer");
    }
  };

  const columns: ColumnsType<Customer> = [
    {
      title: "Customer ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: number) => `CUS-${String(id).padStart(3, "0")}`,
    },
    {
      title: "Full Name",
      key: "fullName",
      render: (_, record) =>
        `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Customer["status"]) => (
        <Tag color={status === "Active" ? "success" : "default"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />

          <Popconfirm
            title="Delete this customer?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Customers</Title>
        <Typography.Text type="secondary">
          Manage your insurance customers.
        </Typography.Text>
      </div>

      <Card>
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
          wrap
        >
          <Input
            placeholder="Search name, email or phone..."
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300, maxWidth: "100%" }}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add Customer
          </Button>
        </Space>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredCustomers}
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} customers`,
          }}
          scroll={{ x: 900 }}
        />
      </Card>

      <CustomerForm
        open={modalOpen}
        customer={selectedCustomer}
        onCancel={() => {
          setModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}
