
import { useEffect, useState } from "react";

import {
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
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
  InsuranceProduct,
  InsuranceProductRequest,
  UpdateInsuranceProductRequest,
} from "../types/insuranceProduct";

import insuranceProductService from "../services/insuranceProductService";
import InsuranceProductForm from "../components/InsuranceProductForm";

const { Title } = Typography;

const InsuranceProductsPage = () => {
  const [products, setProducts] = useState<InsuranceProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<InsuranceProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<InsuranceProduct | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await insuranceProductService.getAll();

      setProducts(data);
      setFilteredProducts(data);
    } catch {
      message.error("Failed to load insurance products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const keyword = searchText.trim().toLowerCase();

    const result = products.filter(
      (product) =>
        product.productCode.toLowerCase().includes(keyword) ||
        product.productName.toLowerCase().includes(keyword) ||
        product.insuranceType.toLowerCase().includes(keyword)
    );

    setFilteredProducts(result);
  }, [searchText, products]);

  const handleCreate = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product: InsuranceProduct) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleCancel = () => {
    setFormOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (
    values: InsuranceProductRequest | UpdateInsuranceProductRequest
  ) => {
    try {
      if (selectedProduct) {
        await insuranceProductService.update(
          selectedProduct.id,
          values as UpdateInsuranceProductRequest
        );

        message.success("Insurance product updated successfully.");
      } else {
        await insuranceProductService.create(
          values as InsuranceProductRequest
        );

        message.success("Insurance product created successfully.");
      }

      handleCancel();
      await loadProducts();
    } catch {
      message.error("Failed to save insurance product.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await insuranceProductService.remove(id);

      message.success("Insurance product deleted successfully.");

      await loadProducts();
    } catch {
      message.error("Failed to delete insurance product.");
    }
  };

  const columns: ColumnsType<InsuranceProduct> = [
    {
      title: "Product Code",
      dataIndex: "productCode",
      key: "productCode",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Insurance Type",
      dataIndex: "insuranceType",
      key: "insuranceType",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Base Premium",
      dataIndex: "basePremium",
      key: "basePremium",
      render: (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="success">Active</Tag>
        ) : (
          <Tag color="default">Inactive</Tag>
        ),
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
            Edit
          </Button>

          <Popconfirm
            title="Delete insurance product?"
            description="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Insurance Products
          </Title>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add Product
          </Button>
        </div>

        <Input
          placeholder="Search by product code, name or insurance type"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          allowClear
          style={{ maxWidth: 400 }}
        />

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredProducts}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
          }}
        />

        <InsuranceProductForm
          open={formOpen}
          product={selectedProduct}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </Space>
    </Card>
  );
};

export default InsuranceProductsPage;
