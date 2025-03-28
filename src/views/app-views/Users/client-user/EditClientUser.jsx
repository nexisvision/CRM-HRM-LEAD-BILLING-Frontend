// import React, { useEffect } from 'react';
// import { Form, Input, Select, Button } from 'antd';

// const { Option } = Select;

// const EditClientUser = ({ isVisible, onCancel, onSubmit, userData }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (userData) {
//       form.setFieldsValue({
//         companyName: userData.companyName,
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         email: userData.email,
//         telephone: userData.telephone,
//         position: userData.position,
//         timeZone: userData.timeZone,
//       });
//     }
//   }, [userData, form]);

//   const handleSubmit = () => {
//     form
//       .validateFields()
//       .then((values) => {
//         onSubmit(values);
//         form.resetFields();
//       })
//       .catch((error) => {
//         console.error('Validation Failed:', error);
//       });
//   };

//   return (

//     <Form form={form} layout="vertical" name="edit_client_user_form">


//       <Form.Item
//         name="companyName"
//         label="Company Name*"
//         rules={[{ required: true, message: 'Please select a company!' }]}
//       >
//         <Select placeholder="Select a company">
//           <Option value="company1">Company 1</Option>
//           <Option value="company2">Company 2</Option>
//           <Option value="company3">Company 3</Option>
//         </Select>
//       </Form.Item>

//       <Form.Item
//         name="firstName"
//         label="First Name*"
//         rules={[{ required: true, message: 'Please enter the first name!' }]}
//       >
//         <Input placeholder="Enter First Name" />
//       </Form.Item>

//       <Form.Item
//         name="lastName"
//         label="Last Name*"
//         rules={[{ required: true, message: 'Please enter the last name!' }]}
//       >
//         <Input placeholder="Enter Last Name" />
//       </Form.Item>

//       <Form.Item
//         name="email"
//         label="Email Address*"
//         rules={[
//           { required: true, message: 'Please enter an email address!' },
//           { type: 'email', message: 'Please enter a valid email address!' },
//         ]}
//       >
//         <Input placeholder="Enter Email Address" />
//       </Form.Item>

//       <Form.Item
//         name="telephone"
//         label="Telephone"
//       >
//         <Input placeholder="Enter Telephone" />
//       </Form.Item>

//       <Form.Item
//         name="position"
//         label="Position"
//       >
//         <Input placeholder="Enter Position" />
//       </Form.Item>

//       <Form.Item
//         name="timeZone"
//         label="Time Zone"
//         initialValue="Europe/Amsterdam"
//       >
//         <Select placeholder="Select a time zone">
//           <Option value="Europe/Amsterdam">Europe/Amsterdam</Option>
//           <Option value="America/New_York">America/New York</Option>
//           <Option value="Asia/Tokyo">Asia/Tokyo</Option>
//           <Option value="Australia/Sydney">Australia/Sydney</Option>
//         </Select>
//       </Form.Item>

//       <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
//         <Button onClick={onCancel} style={{ background: '#f0f0f0', borderColor: '#d9d9d9' }}>
//           Close
//         </Button>
//         <Button
//           type="primary"
//           onClick={handleSubmit}
//           style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}
//         >
//           Create
//         </Button>
//       </div>
//     </Form>

//   );
// };

// export default EditClientUser;
