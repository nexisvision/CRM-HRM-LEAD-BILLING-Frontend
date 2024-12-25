import React from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";

const { Option } = Select;

const AddJobOnBoard = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Form Values:", values);
    onCreate(values);
  };

  return (
    <Modal
      title="Add to Job OnBoard"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="joiningDate"
          label="Joining Date"
          rules={[{ required: true, message: "Please select a joining date!" }]}
        >
          <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="daysOfWeek"
          label="Days Of Week"
          rules={[{ required: true, message: "Please enter days of the week!" }]}
        >
          <Input placeholder="Days Of Week" />
        </Form.Item>
        <Form.Item
          name="salary"
          label="Salary"
          rules={[{ required: true, message: "Please enter the salary!" }]}
        >
          <Input placeholder="Salary" />
        </Form.Item>
        <Form.Item
          name="salaryType"
          label="Salary Type"
          rules={[{ required: true, message: "Please select a salary type!" }]}
        >
          <Select placeholder="Hourly Payslip">
            <Option value="hourly">Hourly Payslip</Option>
            <Option value="monthly">Monthly Payslip</Option>
            <Option value="yearly">Yearly Payslip</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="salaryDuration"
          label="Salary Duration"
          rules={[{ required: true, message: "Please select a salary duration!" }]}
        >
          <Select placeholder="Select Salary Duration">
            <Option value="weekly">Weekly</Option>
            <Option value="biweekly">Biweekly</Option>
            <Option value="monthly">Monthly</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="jobType"
          label="Job Type"
          rules={[{ required: true, message: "Please select a job type!" }]}
        >
          <Select placeholder="Select Job Type">
            <Option value="full-time">Full-Time</Option>
            <Option value="part-time">Part-Time</Option>
            <Option value="contract">Contract</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status!" }]}
        >
          <Select placeholder="Select Status">
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onCancel} style={{ marginRight: "8px" }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: "#66dd66", borderColor: "#66dd66" }}>
              Create
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddJobOnBoard;
