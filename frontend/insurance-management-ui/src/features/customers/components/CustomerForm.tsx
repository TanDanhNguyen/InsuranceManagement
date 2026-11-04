
import { Form, Input, Select, DatePicker, Modal } from "antd";
import dayjs from "dayjs";

import type {
  Customer,
  CustomerRequest,
} from "../types/customer";

interface Props {
  open: boolean;
  customer?: Customer | null;
  onCancel: () => void;
  onSubmit: (values: CustomerRequest) => void;
}

export default function CustomerForm({
  open,
  customer,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const request: CustomerRequest = {
      ...values,
      dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
    };

    onSubmit(request);
  };

  return (
    <Modal
      title={customer ? "Edit Customer" : "Create Customer"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Save"
      cancelText="Cancel"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          firstName: customer?.firstName ?? "",
          lastName: customer?.lastName ?? "",
          email: customer?.email ?? "",
          phoneNumber: customer?.phoneNumber ?? "",
          dateOfBirth: customer?.dateOfBirth
            ? dayjs(customer.dateOfBirth)
            : null,
          address: customer?.address ?? "",
          status: customer?.status ?? "Active",
        }}
        key={customer?.id ?? "new"}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "First name is required" }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Last name is required" }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid email format" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, message: "Phone is required" }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="dateOfBirth"
          rules={[{ required: true, message: "Date of birth is required" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Address is required" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter address" />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
