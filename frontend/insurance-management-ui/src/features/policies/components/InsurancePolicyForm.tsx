import { useEffect, useState } from "react";

import {
  Form,
  InputNumber,
  Modal,
  Select,
  DatePicker,
  message,
} from "antd";

import dayjs, { type Dayjs } from "dayjs";

import type { Customer } from "../../customers/types/customer";
import type { InsuranceProduct } from "../../products/types/insuranceProduct";

import type {
  InsurancePolicy,
  InsurancePolicyRequest,
  UpdateInsurancePolicyRequest,
} from "../types/insurancePolicy";

import { customerService } from "../../customers/services/customerService";
import insuranceProductService from "../../products/services/insuranceProductService";

interface InsurancePolicyFormProps {
  open: boolean;
  policy?: InsurancePolicy | null;
  onCancel: () => void;
  onSubmit: (
    values: InsurancePolicyRequest | UpdateInsurancePolicyRequest
  ) => Promise<void>;
}

interface FormValues {
  customerId?: number;
  productId: number;
  startDate: Dayjs;
  endDate: Dayjs;
  premium: number;
}

export default function InsurancePolicyForm({
  open,
  policy,
  onCancel,
  onSubmit,
}: InsurancePolicyFormProps) {
  const [form] = Form.useForm<FormValues>();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<InsuranceProduct[]>([]);

  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!policy;

  useEffect(() => {
    if (!open) return;

    if (policy) {
      form.setFieldsValue({
        productId: policy.productId,
        startDate: dayjs(policy.startDate),
        endDate: dayjs(policy.endDate),
        premium: policy.premium,
      });
    } else {
      form.resetFields();
    }

    const loadData = async () => {
      setLoadingProducts(true);

      try {
        const data = await insuranceProductService.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
        message.error("Failed to load insurance products");
      } finally {
        setLoadingProducts(false);
      }

      if (!policy) {
        setLoadingCustomers(true);

        try {
          const data = await customerService.getAll();
          setCustomers(data);
        } catch (error) {
          console.error("Failed to load customers:", error);
          message.error("Failed to load customers");
        } finally {
          setLoadingCustomers(false);
        }
      }
    };

    void loadData();
  }, [open, policy, form]);

  const handleFinish = async (values: FormValues) => {
    setSubmitting(true);

    try {
      const commonValues = {
        productId: values.productId,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
        premium: values.premium,
      };

      if (isEdit) {
        await onSubmit(commonValues);
      } else {
        await onSubmit({
          ...commonValues,
          customerId: values.customerId!,
        });
      }

      form.resetFields();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Insurance Policy" : "Create Insurance Policy"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      okText={isEdit ? "Update" : "Create"}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        {!isEdit && (
          <Form.Item
            label="Customer"
            name="customerId"
            rules={[
              {
                required: true,
                message: "Please select a customer",
              },
            ]}
          >
            <Select
              placeholder="Select customer"
              loading={loadingCustomers}
              showSearch
              optionFilterProp="label"
              options={customers
                .filter((customer) => customer.status === "Active")
                .map((customer) => ({
                  label: `${customer.firstName} ${customer.lastName} - ${customer.email}`,
                  value: customer.id,
                }))}
            />
          </Form.Item>
        )}

        <Form.Item
          label="Insurance Product"
          name="productId"
          rules={[
            {
              required: true,
              message: "Please select an insurance product",
            },
          ]}
        >
          <Select
            placeholder="Select insurance product"
            loading={loadingProducts}
            showSearch
            optionFilterProp="label"
            options={products
              .filter(
                (product) =>
                  product.isActive ||
                  product.id === policy?.productId
              )
              .map((product) => ({
                label: `${product.productCode} - ${product.productName}`,
                value: product.id,
              }))}
          />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[
            {
              required: true,
              message: "Please select start date",
            },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          dependencies={["startDate"]}
          rules={[
            {
              required: true,
              message: "Please select end date",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startDate = getFieldValue("startDate");

                if (!value || !startDate || value.isAfter(startDate, "day")) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("End date must be later than start date")
                );
              },
            }),
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          label="Premium"
          name="premium"
          rules={[
            {
              required: true,
              message: "Please enter premium",
            },
            {
              type: "number",
              min: 0.01,
              message: "Premium must be greater than zero",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0.01}
            precision={2}
            placeholder="Enter premium"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}