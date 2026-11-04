
import {
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  Table,
  Tag,
} from "antd";

import {
  TeamOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface Policy {
  id: string;
  customer: string;
  product: string;
  premium: number;
  status: string;
}

const policies: Policy[] = [
  {
    id: "POL-001",
    customer: "John Smith",
    product: "Life Insurance",
    premium: 1200,
    status: "Active",
  },
  {
    id: "POL-002",
    customer: "Emily Johnson",
    product: "Health Insurance",
    premium: 850,
    status: "Pending",
  },
  {
    id: "POL-003",
    customer: "Michael Brown",
    product: "Car Insurance",
    premium: 650,
    status: "Active",
  },
];

const columns: ColumnsType<Policy> = [
  {
    title: "Policy ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Customer",
    dataIndex: "customer",
    key: "customer",
  },
  {
    title: "Insurance Product",
    dataIndex: "product",
    key: "product",
  },
  {
    title: "Premium ($)",
    dataIndex: "premium",
    key: "premium",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag color={status === "Active" ? "success" : "warning"}>
        {status}
      </Tag>
    ),
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="dashboard-heading">
        <Title level={2}>Dashboard</Title>
        <Text type="secondary">
          Welcome back! Here is your insurance business overview.
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={1250}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Policies"
              value={856}
              prefix={<FileProtectOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Claims"
              value={24}
              prefix={<FileSearchOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={125000}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Recent Policies"
        style={{ marginTop: 24 }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={policies}
          pagination={false}
          scroll={{ x: 700 }}
        />
      </Card>
    </div>
  );
}
