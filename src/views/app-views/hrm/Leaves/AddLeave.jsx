import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CreateL, GetLeave } from "./LeaveReducer/LeaveSlice";
import { empdata } from '../Employee/EmployeeReducers/EmployeeSlice';
const { Option } = Select;
const { TextArea } = Input;
const AddLeave = ({ onClose }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(empdata()); // Fetch employee data 
  }, [dispatch]);
  useEffect(() => {
    dispatch(GetLeave()); 
  }, [dispatch]);
  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data; // Extract employee data
  const onFinish = (values) => {
    dispatch(CreateL(values))
      .then(() => {
        dispatch(GetLeave()); // Refresh leave data
        message.success('Leave added successfully!');
        form.resetFields(); // Reset form fields
        onClose(); // Close modal
        navigate('/app/hrm/leave'); // Redirect to leave page
      })
      .catch((error) => {
        message.error('Failed to add leave.');
        console.error('Add API error:', error);
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.error('Form submission failed:', errorInfo);
    message.error('Please fill out all required fields.');
  };
  return (
    <div className="add-leave-form">
      <Form
        layout="vertical"
        form={form}
        name="add-leave"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
        <Row gutter={16}>
          {/* Employee */}
          <Col span={24}>
            <Form.Item
              name="employee_id"
              label="Employee"
              rules={[{ required: true, message: 'Please select an employee.' }]}
            >
              <Select placeholder="Select Employee" loading={!empData}>
                {empData && empData.length > 0 ? (
                  empData.map((emp) => (
                    <Option key={emp.id} value={emp.id}>
                      {emp.firstName || 'Unnamed Employee'}
                    </Option>
                  ))
                ) : (
                  <Option value="" disabled>
                    No Employees Available
                  </Option>
                )}
              </Select>
            </Form.Item>
          </Col>
          {/* Leave Type */}
          <Col span={24}>
            <Form.Item
              name="leaveType"
              label="Leave Type"
              rules={[{ required: true, message: 'Please select leave type.' }]}
            >
              <Select placeholder="Select Leave Type">
                <Option value="sick">Sick Leave</Option>
                <Option value="casual">Casual Leave</Option>
                <Option value="annual">Annual Leave</Option>
              </Select>
            </Form.Item>
          </Col>
          {/* Start and End Date */}
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: 'Start Date is required.' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" placeholder="dd-mm-yyyy" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: 'End Date is required.' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" placeholder="dd-mm-yyyy" />
            </Form.Item>
          </Col>
          {/* Leave Reason */}
          <Col span={24}>
            <Form.Item
              name="reason"
              label="Leave Reason"
              rules={[{ required: true, message: 'Please provide a leave reason.' }]}
            >
              <TextArea rows={4} placeholder="Leave Reason" />
            </Form.Item>
          </Col>
          {/* Remark */}
          <Col span={24}>
            <Form.Item
              name="remark"
              label="Remark"
              rules={[{ required: true, message: 'Please provide a remark.' }]}
            >
              <TextArea rows={4} placeholder="Leave Remark" />
            </Form.Item>
          </Col>
        </Row>
        {/* Form Buttons */}
        <Form.Item>
          <div className="form-buttons text-right">
            <Button type="default" className="mr-2" onClick={onClose}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default AddLeave;
