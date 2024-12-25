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
// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
// import { useNavigate } from 'react-router-dom';
// const { Option } = Select;
// const AddLeave = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Leave added successfully!');
//     navigate('app/hrm/Leave')
//     // Navigate or perform additional actions here
//   };
//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };
  
//   return (
//     <div className="add-employee">
//       <h2 className="mb-4">Add New Leave</h2>
//       <Form
//         layout="vertical"
//         form={form}
//         name="add-employee"
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//       >
//         {/* User Information */}
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="firstName"
//               label="First Name"
//               rules={[{ required: true, message: 'First Name is required' }]}
//             >
//               <Input placeholder="John" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="lastName"
//               label="Last Name"
//               rules={[{ required: true, message: 'Last Name is required' }]}
//             >
//               <Input placeholder="Doe" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="username"
//               label="User Name"
//               rules={[{ required: true, message: 'User Name is required' }]}
//             >
//               <Input placeholder="john_doe" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="password"
//               label="Password"
//               rules={[{ required: true, message: 'Password is required' }]}
//             >
//               <Input.Password placeholder="Strong Password" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="email"
//               label="Email"
//               rules={[
//                 { required: true, message: 'Email is required' },
//                 { type: 'email', message: 'Please enter a valid email' },
//               ]}
//             >
//               <Input placeholder="johndoe@example.com" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="phone"
//               label="Phone"
//               rules={[{ required: true, message: 'Phone is required' }]}
//             >
//               <Input placeholder="01500000000" />
//             </Form.Item>
//           </Col>
//         </Row>
//         {/* Address Information */}
//         {/* <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="street"
//               label="Street"
//               rules={[{ required: true, message: 'Street is required' }]}
//             >
//               <Input placeholder="123 Main Street" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="city"
//               label="City"
//               rules={[{ required: true, message: 'City is required' }]}
//             >
//               <Input placeholder="Los Angeles" />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item
//               name="state"
//               label="State"
//               rules={[{ required: true, message: 'State is required' }]}
//             >
//               <Input placeholder="CA" />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item
//               name="zipCode"
//               label="Zip Code"
//               rules={[{ required: true, message: 'Zip Code is required' }]}
//             >
//               <Input placeholder="90211" />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item
//               name="country"
//               label="Country"
//               rules={[{ required: true, message: 'Country is required' }]}
//             >
//               <Input placeholder="USA" />
//             </Form.Item>
//           </Col>
//         </Row> */}
//         {/* Employee Information */}
//         {/* <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="joiningDate"
//               label="Joining Date"
//               rules={[{ required: true, message: 'Joining Date is required' }]}
//             >
//               <DatePicker style={{ width: '100%' }} />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item name="leaveDate" label="Leave Date">
//               <DatePicker style={{ width: '100%' }} />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="employeeId"
//               label="Employee ID"
//               rules={[{ required: true, message: 'Employee ID is required' }]}
//             >
//               <Input placeholder="OE-012" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="bloodGroup"
//               label="Blood Group"
//               rules={[{ required: true, message: 'Blood Group is required' }]}
//             >
//               <Select placeholder="Select Blood Group">
//                 <Option value="A+">A+</Option>
//                 <Option value="A-">A-</Option>
//                 <Option value="B+">B+</Option>
//                 <Option value="B-">B-</Option>
//                 <Option value="O+">O+</Option>
//                 <Option value="O-">O-</Option>
//                 <Option value="AB+">AB+</Option>
//                 <Option value="AB-">AB-</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row> */}
//         {/* Designation & Salary Information */}
//         {/* <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="designation"
//               label="Designation"
//               rules={[{ required: true, message: 'Designation is required' }]}
//             >
//               <Select placeholder="Select Designation">
//                 <Option value="Manager">Manager</Option>
//                 <Option value="Developer">Developer</Option>
//                 <Option value="Designer">Designer</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="salary"
//               label="Salary"
//               rules={[{ required: true, message: 'Salary is required' }]}
//             >
//               <Input placeholder="$" type="number" />
//             </Form.Item>
//           </Col>
//         </Row> */}
//         <Form.Item>
//           <div className="text-right">
//             <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/Leave')}>
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };
// export default AddLeave;
