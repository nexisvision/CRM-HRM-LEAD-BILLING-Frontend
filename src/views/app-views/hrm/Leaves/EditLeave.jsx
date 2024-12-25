import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { empdata } from '../Employee/EmployeeReducers/EmployeeSlice';
import { EditLeave as EditLeaveAction, GetLeave } from './LeaveReducer/LeaveSlice'; // Fixed import
const { Option } = Select;
const { TextArea } = Input;
const EditLeave = ({ editid, onClose }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const leaveData = useSelector((state) => state.Leave);
  const empData = useSelector((state) => state.employee || []);
  
console.log("bbbb",leaveData)
console.log("vvvv",empData)
const employeedata = empData.employee.data;
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  useEffect(() => {
    dispatch(GetLeave());
  }, [dispatch]);
  useEffect(() => {
    console.log("iiiiii",editid)
    if (editid && leaveData?.Leave?.data.length > 0 && employeedata.length > 0) {
      const leave = leaveData.Leave.data.find((item) => item.id === editid);
      
      if (leave) {
        form.setFieldsValue({
          employee_id: leave.employee_id,
          leaveType: leave.leaveType,
          startDate: leave.startDate ? moment(leave.startDate, 'DD-MM-YYYY') : null,
          endDate: leave.endDate ? moment(leave.endDate, 'DD-MM-YYYY') : null,
          reason: leave.reason,
          remark: leave.remark,
        });
        setIsDataLoaded(true);
      }
    }
  }, [editid, leaveData, employeedata, form]);
  const onFinish = async (values) => {
    try {
      const id = editid;
      dispatch(EditLeaveAction({ id, values }))
        .then(() => {
          dispatch(GetLeave());
          message.success("Leave details updated successfully!");
          onClose();
          navigate('/app/hrm/leave');
        })
        .catch((error) => {
          message.error('Failed to update employee.');
          console.error('Edit API error:', error);
        });
      const formattedValues = {
        id: editid.id,
        ...values,
        startDate: values.startDate.format('DD-MM-YYYY'),
        endDate: values.endDate.format('DD-MM-YYYY'),
      };
    } catch (error) {
      message.error('Failed to update leave: ' + error.message);
    }
  };
  const onFinishFailed = (errorInfo) => {
    message.error('Please check all required fields');
  };
  const onCloseHandler = () => {
    form.resetFields(); // Reset form fields on close
    onClose(); // Close the modal
  };
 
  return (
    <div className="edit-leave-form">
      <Form
        layout="vertical"
        form={form}
        name="edit-leave"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="employee_id"
              label="Employee"
              rules={[{ required: true, message: 'Please select an employee' }]}
            >
              <Select placeholder="Select Employee">
                {employeedata.map((emp) => (
                  <Option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="leaveType"
              label="Leave Type"
              rules={[{ required: true, message: 'Please select leave type' }]}
            >
              <Select placeholder="Select Leave Type">
                <Option value="sick">Sick Leave</Option>
                <Option value="casual">Casual Leave</Option>
                <Option value="annual">Annual Leave</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: 'Start date is required' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: 'End date is required' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="reason"
              label="Leave Reason"
              rules={[{ required: true, message: 'Please provide a reason' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="remark"
              label="Remark"
              rules={[{ required: true, message: 'Please provide a remark' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <div className="form-buttons" style={{ textAlign: 'right' }}>
            <Button 
              type="default" 
              onClick={onCloseHandler} 
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default EditLeave;