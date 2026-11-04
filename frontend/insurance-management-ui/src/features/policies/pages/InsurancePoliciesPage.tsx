
import { useEffect, useMemo, useState } from "react";

import {
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
  Select,
  Popconfirm,
} from "antd";

import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

import type {
  InsurancePolicy,
  PolicyStatus,
  InsurancePolicyRequest,
  UpdateInsurancePolicyRequest,
} from "../types/insurancePolicy";

import { insurancePolicyService } from "../services/insurancePolicyService";
import InsurancePolicyForm from "../components/InsurancePolicyForm";

const { Title } = Typography;

export default function InsurancePoliciesPage() {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PolicyStatus | undefined>();

  const [messageApi, contextHolder] = message.useMessage();
  const [modalOpen, setModalOpen] = useState(false);

  const loadPolicies = async () => {
    setLoading(true);

    try {
      const data = await insurancePolicyService.getAll();
      setPolicies(data);
    } catch (error) {
      console.error("Failed to load policies:", error);
      messageApi.error("Failed to load insurance policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPolicies();
  }, []);

  const handleCreate = () => {
    setModalOpen(true);
  };

  const [selectedPolicy, setSelectedPolicy] =
    useState<InsurancePolicy | null>(null);

  const handleSubmit = async (
    values: InsurancePolicyRequest | UpdateInsurancePolicyRequest
  ) => {
    try {
      if (selectedPolicy) {
        await insurancePolicyService.update(
          selectedPolicy.id,
          values as UpdateInsurancePolicyRequest
        );

        messageApi.success("Insurance policy updated successfully.");
      } else {
        await insurancePolicyService.create(
          values as InsurancePolicyRequest
        );

        messageApi.success("Insurance policy created successfully.");
      }

      setModalOpen(false);
      setSelectedPolicy(null);

      await loadPolicies();
    } catch (error) {
      console.error("Failed to save insurance policy:", error);
      messageApi.error("Failed to save insurance policy.");
    }
  };

  const handleEdit = (policy: InsurancePolicy) => {
    setSelectedPolicy(policy);
    setModalOpen(true);
  };

  const filteredPolicies = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return policies.filter((policy) => {
      const matchesSearch =
        policy.policyNumber.toLowerCase().includes(keyword) ||
        policy.insuranceType.toLowerCase().includes(keyword);

      const matchesStatus =
        !status || policy.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [policies, search, status]);

  const handleDelete = async (id: number) => {
    try {
      await insurancePolicyService.delete(id);

      messageApi.success("Insurance policy deleted successfully.");

      await loadPolicies();
    } catch (error) {
      console.error("Failed to delete policy:", error);
      messageApi.error("Failed to delete insurance policy.");
    }
  };

  const columns: ColumnsType<InsurancePolicy> = [
    {
      title: "Policy Number",
      dataIndex: "policyNumber",
      key: "policyNumber",
    },
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
      render: (id: number) => `CUS-${String(id).padStart(3, "0")}`,
    },
    {
      title: "Insurance Type",
      dataIndex: "insuranceType",
      key: "insuranceType",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (value: string) =>
        new Date(value).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (value: string) =>
        new Date(value).toLocaleDateString(),
    },
    {
      title: "Premium",
      dataIndex: "premium",
      key: "premium",
      render: (value: number) =>
        value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: PolicyStatus) => {
        const colors: Record<PolicyStatus, string> = {
          Pending: "gold",
          Active: "success",
          Expired: "default",
          Cancelled: "error",
        };

        return <Tag color={colors[value]}>{value}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
          </Button>

          <Popconfirm
            title="Delete this insurance policy?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Insurance Policies</Title>

        <Typography.Text type="secondary">
          Manage customer insurance policies.
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
          <Space wrap>
            <Input
              placeholder="Search policy number or type..."
              prefix={<SearchOutlined />}
              allowClear
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 300, maxWidth: "100%" }}
            />

            <Select
              placeholder="Filter by status"
              allowClear
              value={status}
              onChange={(value) => setStatus(value)}
              style={{ width: 180 }}
              options={[
                { label: "Pending", value: "Pending" },
                { label: "Active", value: "Active" },
                { label: "Expired", value: "Expired" },
                { label: "Cancelled", value: "Cancelled" },
              ]}
            />
          </Space>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add Policy
          </Button>
        </Space>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredPolicies}
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} policies`,
          }}
          scroll={{ x: 1100 }}
        />
      </Card>

      <InsurancePolicyForm
        open={modalOpen}
        policy={selectedPolicy}
        onCancel={() => {
          setModalOpen(false);
          setSelectedPolicy(null);
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}
