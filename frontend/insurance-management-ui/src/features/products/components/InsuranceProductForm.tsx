
import { useEffect } from "react";

import {
  Form,
  Input,
  InputNumber,
  Modal,
  Switch,
} from "antd";

import type {
  InsuranceProduct,
  InsuranceProductRequest,
  UpdateInsuranceProductRequest,
} from "../types/insuranceProduct";

interface InsuranceProductFormProps {
  open: boolean;
  product?: InsuranceProduct | null;
  onCancel: () => void;
  onSubmit: (
    values: InsuranceProductRequest | UpdateInsuranceProductRequest
  ) => void | Promise<void>;
}

const InsuranceProductForm = ({
  open,
  product,
  onCancel,
  onSubmit,
}: InsuranceProductFormProps) => {
  const [form] = Form.useForm();

  const isEdit = !!product;

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        productCode: product?.productCode ?? "",
        productName: product?.productName ?? "",
        insuranceType: product?.insuranceType ?? "",
        description: product?.description ?? "",
        basePremium: product?.basePremium ?? null,
        isActive: product?.isActive ?? true,
      });
    } else {
      form.resetFields();
    }
  }, [open, product, form]);

  const handleFinish = async (values: InsuranceProductRequest | UpdateInsuranceProductRequest) => {
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={isEdit ? "Edit Insurance Product" : "Create Insurance Product"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={isEdit ? "Update" : "Create"}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        {!isEdit && (
          <Form.Item
            label="Product Code"
            name="productCode"
            rules={[
              {
                required: true,
                message: "Please enter product code",
              },
              {
                max: 50,
                message: "Product code cannot exceed 50 characters",
              },
            ]}
          >
            <Input placeholder="Enter product code" />
          </Form.Item>
        )}

        <Form.Item
          label="Product Name"
          name="productName"
          rules={[
            {
              required: true,
              message: "Please enter product name",
            },
            {
              max: 200,
              message: "Product name cannot exceed 200 characters",
            },
          ]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          label="Insurance Type"
          name="insuranceType"
          rules={[
            {
              required: true,
              message: "Please enter insurance type",
            },
            {
              max: 100,
              message: "Insurance type cannot exceed 100 characters",
            },
          ]}
        >
          <Input placeholder="e.g. Life, Health, Auto" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea
            rows={3}
            maxLength={1000}
            placeholder="Enter product description"
          />
        </Form.Item>

        <Form.Item
          label="Base Premium"
          name="basePremium"
          rules={[
            {
              required: true,
              message: "Please enter base premium",
            },
            {
              type: "number",
              min: 0.01,
              message: "Base premium must be greater than zero",
            },
          ]}
        >
          <InputNumber
            min={0.01}
            precision={2}
            style={{ width: "100%" }}
            placeholder="Enter base premium"
          />
        </Form.Item>

        {isEdit && (
          <Form.Item
            label="Active"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default InsuranceProductForm;
