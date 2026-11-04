
import { useEffect, useState } from "react";

import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  DatePicker,
  message,
} from "antd";

import dayjs, { type Dayjs } from "dayjs";

import type { Customer } from "../../customers/types/customer";

import type {
  InsurancePolicy,
  InsurancePolicyRequest,
  UpdateInsurancePolicyRequest,
} from "../types/insurancePolicy";

import { customerService } from "../../customers/services/customerService";

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
  insuranceType: string;
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
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!policy;

  useEffect(() => {
    if (!open) return;

    if (policy) {
      form.setFieldsValue({
        insuranceType: policy.insuranceType,
        startDate: dayjs(policy.startDate),
        endDate: dayjs(policy.endDate),
        premium: policy.premium,
      });
    } else {
      form.resetFields();
    }

    const loadCustomers = async () => {
      if (policy) return;

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
    };

    void loadCustomers();
  }, [open, policy, form]);

  const handleFinish = async (values: FormValues) => {
    setSubmitting(true);

    try {
      const commonValues = {
        insuranceType: values.insuranceType,
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
          label="Insurance Type"
          name="insuranceType"
          rules={[
            {
              required: true,
              message: "Please enter insurance type",
            },
            {
              max: 100,
              message: "Maximum 100 characters",
            },
          ]}
        >
          <Input placeholder="e.g. Health Insurance" />
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
