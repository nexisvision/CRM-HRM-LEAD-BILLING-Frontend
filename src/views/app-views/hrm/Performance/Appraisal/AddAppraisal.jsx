import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, message, Row, Col, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, Formik } from 'formik';
import { PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;

const AddAppraisal = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [awards, setAwards] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAwardName, setNewAwardName] = useState('');

  const onFinish = (values) => {
    console.log('Submitted values:', values);
    message.success('Appraisal added successfully!');
    navigate('/app/hrm/appraisal');
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Form submission failed:', errorInfo);
    message.error('Please fill out all required fields.');
  };

  const handleAddAward = () => {
    if (newAwardName) {
      setAwards([...awards, { id: awards.length + 1, name: newAwardName }]);
      setNewAwardName('');
      setIsModalVisible(false);
      message.success(`Award "${newAwardName}" added successfully!`);
    } else {
      message.error('Please enter an award name.');
    }
  };

  return (
    <div className="add-appraisal">
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Formik
        initialValues={{ branch: '', employee: '', month: '', award: '', remarks: '' }}
        onSubmit={onFinish}
        onReset={onFinishFailed}
      >
        {({ values, setFieldValue }) => (
          <Form layout="vertical">
            <Row gutter={16}>
              {/* Branch Dropdown */}
              <Col span={12}>
                <Form.Item
                  name="branch"
                  label="Branch"
                  rules={[{ required: true, message: 'Branch is required' }]}
                >
                  <Select placeholder="Select Branch">
                    <Option value="branch1">Branch 1</Option>
                    <Option value="branch2">Branch 2</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Employee Dropdown */}
              <Col span={12}>
                <Form.Item
                  name="employee"
                  label="Employee"
                  rules={[{ required: true, message: 'Employee is required' }]}
                >
                  <Select placeholder="Select Employee">
                    <Option value="employee1">Employee 1</Option>
                    <Option value="employee2">Employee 2</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Select Month */}
              <Col span={12}>
                <Form.Item
                  name="month"
                  label="Select Month"
                  rules={[{ required: true, message: 'Month is required' }]}
                >
                  <DatePicker picker="month" style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              {/* Award Dropdown */}
              <Col span={12}>
                <div className="form-item mt-2">
                  <label >Award</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new Award"
                    value={values.award}
                    onChange={(value) => {
                      if (value === 'add_new') {
                        setIsModalVisible(true);
                      } else {
                        setFieldValue("award", value);
                      }
                    }}
                  >
                    {awards.map((award) => (
                      <Option key={award.id} value={award.name}>
                        {award.name}
                      </Option>
                    ))}
                    <Option value="add_new">
                      <Button type="link" icon={<PlusOutlined />}>
                        Add New Award
                      </Button>
                    </Option>
                  </Select>
                  <ErrorMessage
                    name="award"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24}>
                <Form.Item name="remarks" label="Remarks">
                  <TextArea rows={4} placeholder="Enter remark" />
                </Form.Item>
              </Col>
            </Row>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-xl">
                <h1 className="text-lg font-medium">Behavioral Competencies</h1>
                <div className="flex gap-36 items-center mr-28">
                  <h2 className="font-semibold">Indicator</h2>
                  <h2 className="font-semibold">Appraisal</h2>
                </div>
              </div>
              <hr className="mb-4 border border-gray-300" />
              
              <Row gutter={16}>
                <Col span={12}>
                  <label className="block mb-1">Business Process</label>
                  <label className="block mt-4">Oral Communication</label>
                </Col>
                <Col span={12}>
                  <div className="grid grid-cols-2 gap-3">
                    <Rate  />
                    <Rate  />
                    <Rate />
                    <Rate  />
                  </div>
                </Col>
              </Row>
            </div>

            {/* Organizational Competencies */}
            <div className="flex flex-col gap-4">
              <h1 className="text-lg font-semibold mb-3 mt-6">Organizational Competencies</h1>
              <hr className="mb-4 border border-gray-300" />
              
              <Row gutter={16}>
                <Col span={12}>
                  <label className="block mb-1">LeaderShip</label>
                  <label className="block mt-4">Project Management</label>
                </Col>
                <Col span={12}>
                  <div className="grid grid-cols-2 gap-3">
                    <Rate  />
                    <Rate  />
                    <Rate  />
                    <Rate  />
                  </div>
                </Col>
              </Row>
            </div>

            {/* Technical Competencies */}
            <div className="flex flex-col gap-4">
              <h1 className="text-lg font-semibold mb-3 mt-6">Technical Competencies</h1>
              <hr className="mb-4 border border-gray-300" />
              
              <Row gutter={16}>
                <Col span={12}>
                  <label className="block mb-1">Allocating Resources</label>
                </Col>
                <Col span={12}>
                  <div className="grid grid-cols-2 gap-3">
                    <Rate  />
                    <Rate />
                  </div>
                </Col>
              </Row>
            </div>

            <Form.Item>
              <div className="text-right mt-3">
                <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/appraisal')}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Formik>

      {/* Modal for Adding New Award */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Award</h2>
            <Input
              placeholder="Enter new award name"
              value={newAwardName}
              onChange={(e) => setNewAwardName(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end">
              <Button
                type="default"
                onClick={() => setIsModalVisible(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button type="primary" onClick={handleAddAward}>
                Add Award
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAppraisal;












// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// const AddAppraisal = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Appraisal added successfully!');
//     navigate('app/hrm/appraisal')
//     // Navigate or perform additional actions here
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };

  

//   return (
//     <div className="add-employee">
//       {/* <h2 className="mb-4">Add New Appraisal</h2> */}
//       <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

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
//             <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/employee')}>
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

// export default AddAppraisal;
