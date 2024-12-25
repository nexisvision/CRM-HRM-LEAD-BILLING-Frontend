import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, Upload, message, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import { empdata, updateEmp } from "./EmployeeReducers/EmployeeSlice";

const { Option } = Select;

const EditEmployee = ({ employeeIdd,onClose }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allempdata = useSelector((state) => state.emp);
  const [singleEmp, setSingleEmp] = useState(null);

  useEffect(() => {
    const empData = allempdata?.emp?.data || [];
    const data = empData.find((item) => item.id === employeeIdd);
    setSingleEmp(data || null);
  }, [allempdata, employeeIdd]);

  useEffect(() => {
    if (singleEmp) {
      form.setFieldsValue({
        ...singleEmp,
        joiningDate: singleEmp.joiningDate ? moment(singleEmp.joiningDate) : null,
        leaveDate: singleEmp.leaveDate ? moment(singleEmp.leaveDate) : null,
      });
    }
  }, [singleEmp, form]);


  const onFinish = async (values) => {
    // try {
    //   console.log("Payload:", values);
    //   await dispatch(updateEmp({ employeeIdd, values })).unwrap();
    //   message.success("Employee details updated successfully!");
    //   navigate("/app/hrm/employee");
    //   onClose();
    // } catch (error) {
    //   message.error(error || "Failed to update employee details. Please try again.");
    // }

     dispatch(updateEmp({ employeeIdd, values }))
          .then(() => {
            dispatch(empdata());
            message.success("Employee details updated successfully!");
            onClose();
            navigate('/app/hrm/employee');
          })
          .catch((error) => {
            message.error('Failed to update Employee.');
            console.error('Edit API error:', error);
          });
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Form submission failed:", errorInfo);
    message.error("Please fill out all required fields.");
  };

  if (!singleEmp) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-employee">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

      <Form
        layout="vertical"
        form={form}
        name="edit-employee"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {/* User Information */}
        <h1 className="text-lg font-bold mb-3">Personal Information</h1>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "First Name is required" }]}
            >
              <Input placeholder="John" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Last Name is required" }]}
            >
              <Input placeholder="Doe" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="username"
              label="User Name"
              rules={[{ required: true, message: "User Name is required" }]}
            >
              <Input placeholder="john_doe" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="Strong Password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email (e.g., example@example.com)" },
              ]}
            >
              <Input placeholder="johndoe@example.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                { required: true, message: "Phone number is required" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Phone number must be exactly 10 digits",
                },
              ]}
            >
              <Input placeholder="1234567890" maxLength={10} />
            </Form.Item>
          </Col>
        </Row>

        {/* Address Information */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <TextArea placeholder="123 Main Street" />
            </Form.Item>
          </Col>
        </Row>

        {/* Employee Information */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="joiningDate"
              label="Joining Date"
              rules={[{ required: true, message: "Joining Date is required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="leaveDate" label="Leave Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="employeeId"
              label="Employee ID"
              rules={[{ required: true, message: "Employee ID is required" }]}
            >
              <Input placeholder="OE-012" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Department is required" }]}
            >
              <Select placeholder="Select Department">
                <Option value="Manager">Manager</Option>
                <Option value="Developer">Developer</Option>
                <Option value="Designer">Designer</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Designation, Salary, and CV Upload */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true, message: "Designation is required" }]}
            >
              <Select placeholder="Select Designation">
                <Option value="Manager">Manager</Option>
                <Option value="Developer">Developer</Option>
                <Option value="Designer">Designer</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="salary"
              label="Salary"
              rules={[{ required: true, message: "Salary is required" }]}
            >
              <Input placeholder="$" type="number" />
            </Form.Item>
          </Col>
        </Row>

        <h1 className="text-lg font-bold mb-3">Bank Details</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="accountholder"
              label="Account Holder Name"
              rules={[{ required: true, message: "Account Holder Name is required" }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="accountnumber"
              label="Account Number"
              rules={[{ required: true, message: "Account Number is required" }]}
            >
              <Input placeholder="123456789" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="bankName"
              label="Bank Name"
              rules={[{ required: true, message: "Bank Name is required" }]}
            >
              <Input placeholder="Bank of Example" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="file" label="Upload CV">
              <Upload
                action="http://localhost:5500/api/users/upload-cv"
                listType="picture"
                accept=".pdf"
                maxCount={1}
                showUploadList={{ showRemoveIcon: true }}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Update Employee
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditEmployee;







{/* <h1 className="text-lg font-bold mb-3">Document</h1> */}

{/* <Row gutter={16}>
<Col span={12}>
  <Form.Item
    name="cv"
    label="Upload CV"
    rules={[{ required: true, message: "CV is required" }]}
  >
    <Upload beforeUpload={() => false}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  </Form.Item>
</Col>
<Col span={12}>
  <Form.Item
    name="photo"
    label="Upload Photo"
    rules={[{ required: true, message: "Photo is required" }]}
  >
    <Upload beforeUpload={() => false}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  </Form.Item>
</Col>
</Row> */}





// import React, { useEffect, useState } from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
// import { useNavigate, useParams } from 'react-router-dom';

// const { Option } = Select;

// const EditEmployee = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const { employeeId } = useParams(); // Assuming employeeId is passed in URL params
//   const [employeeData, setEmployeeData] = useState(null);

//   // Fetch employee data based on employeeId
//   useEffect(() => {
//     // Replace this with actual API call to fetch employee data
//     const fetchEmployeeData = async () => {
//       // Example employee data
//       const data = {
//         firstName: 'John',
//         lastName: 'Doe',
//         username: 'john_doe',
//         email: 'johndoe@example.com',
//         phone: '1234567890',
//         street: '123 Main Street',
//         city: 'Los Angeles',
//         state: 'CA',
//         zipCode: '90211',
//         country: 'USA',
//         joiningDate: '2024-01-01', // Example date format, adjust based on your data
//         leaveDate: '2024-12-01',
//         employeeId: 'OE-012',
//         bloodGroup: 'O+',
//         designation: 'Developer',
//         salary: '5000',
//       };
//       setEmployeeData(data);
//       form.setFieldsValue(data); // Set the form values to fetched employee data
//     };

//     fetchEmployeeData();
//   }, [employeeId, form]);

//   const onFinish = (values) => {
//     console.log('Updated values:', values);
//     message.success('Employee updated successfully!');
//     navigate('/app/hrm/employee'); // Navigate to the employee list page after successful update
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };

//   if (!employeeData) {
//     return <div>Loading...</div>; // Show loading indicator while employee data is being fetched
//   }

//   return (
//     <div className="edit-employee">
//       <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

//       <Form
//         layout="vertical"
//         form={form}
//         name="edit-employee"
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
//                 { type: 'email', message: 'Please enter a valid email (e.g., example@example.com)' },
//               ]}
//             >
//               <Input placeholder="johndoe@example.com" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="phone"
//               label="Phone"
//               rules={[
//                 { required: true, message: 'Phone number is required' },
//                 {
//                   pattern: /^[0-9]{10}$/,
//                   message: 'Phone number must be exactly 10 digits',
//                 },
//               ]}
//             >
//               <Input placeholder="1234567890" maxLength={10} />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* Address Information */}
//         <Row gutter={16}>
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
//               rules={[
//                 { required: true, message: 'Zip Code is required' },
//                 {
//                   pattern: /^[0-9]{6}$/,
//                   message: 'Zip Code must be exactly 6 digits',
//                 },
//               ]}
//             >
//               <Input placeholder="90211" maxLength={6} />
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
//         </Row>

//         {/* Employee Information */}
//         <Row gutter={16}>
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
//         </Row>

//         {/* Designation & Salary Information */}
//         <Row gutter={16}>
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
//         </Row>

//         <Form.Item>
//           <div className="text-right">
//             <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/employee')}>
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default EditEmployee;










// import React, { useEffect, useState } from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
// import { useNavigate, useParams } from 'react-router-dom';

// const { Option } = Select;

// const EditEmployee = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const { employeeId } = useParams(); // Assuming employeeId is passed in the route params

//   // Simulating fetching employee data (In a real app, you should fetch data from an API)
//   const [employeeData, setEmployeeData] = useState(null);

//   useEffect(() => {
//     // Mock employee data. Replace this with an actual API call to fetch the employee details by employeeId.
//     const mockEmployeeData = {
//       firstName: 'John',
//       lastName: 'Doe',
//       username: 'john_doe',
//       password: 'StrongPassword',
//       email: 'johndoe@example.com',
//       phone: '1234567890',
//       street: '123 Main Street',
//       city: 'Los Angeles',
//       state: 'CA',
//       zipCode: '90211',
//       country: 'USA',
//       joiningDate: '2023-01-01',
//       leaveDate: '2024-01-01',
//       employeeId: 'OE-012',
//       bloodGroup: 'O+',
//       designation: 'Developer',
//       salary: 50000,
//     };

//     setEmployeeData(mockEmployeeData); // Set the fetched data
//   }, [employeeId]);

//   // Handle form submission for editing
//   const onFinish = (values) => {
//     console.log('Updated values:', values);
//     message.success('Employee updated successfully!');
//     navigate('/app/hrm/employee');
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };

//   if (!employeeData) {
//     return <div>Loading...</div>; // Return loading state while employeeData is being fetched
//   }

//   return (
//     <div className="edit-employee">
//       <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

//       <Form
//         layout="vertical"
//         form={form}
//         name="edit-employee"
//         initialValues={employeeData}
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
//                 { type: 'email', message: 'Please enter a valid email (e.g., example@example.com)' },
//               ]}
//             >
//               <Input placeholder="johndoe@example.com" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="phone"
//               label="Phone"
//               rules={[
//                 { required: true, message: 'Phone number is required' },
//                 {
//                   pattern: /^[0-9]{10}$/,
//                   message: 'Phone number must be exactly 10 digits',
//                 },
//               ]}
//             >
//               <Input placeholder="1234567890" maxLength={10} />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* Address Information */}
//         <Row gutter={16}>
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
//               rules={[
//                 { required: true, message: 'Zip Code is required' },
//                 {
//                   pattern: /^[0-9]{6}$/,
//                   message: 'Zip Code must be exactly 6 digits',
//                 },
//               ]}
//             >
//               <Input placeholder="90211" maxLength={6} />
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
//         </Row>

//         {/* Employee Information */}
//         <Row gutter={16}>
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
//         </Row>

//         {/* Designation & Salary Information */}
//         <Row gutter={16}>
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
//         </Row>

//         <Form.Item>
//           <div className="text-right">
//             <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/employee')}>
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Update
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default EditEmployee;
