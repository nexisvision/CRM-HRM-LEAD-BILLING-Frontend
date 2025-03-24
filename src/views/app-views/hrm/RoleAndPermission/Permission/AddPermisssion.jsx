// import React from 'react';
// import { Form, Input, Button, message, Row, Col } from 'antd';
// import { useNavigate } from 'react-router-dom';



// const AddPermission = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     message.success('Permission added successfully!');
//     navigate('app/hrm/permission')
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };



//   return (
//     <div className="add-employee">
//       <Form
//         layout="vertical"
//         form={form}
//         name="add-employee"
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//       >
//         <hr className="mb-4 border-b pb-2 font-medium"></hr>

//         {/* User Information */}
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="firstName"
//               label="Permission"
//               rules={[{ required: true, message: 'First Name is required' }]}
//             >
//               <Input placeholder="John" />
//             </Form.Item>
//           </Col>

//         </Row>

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

// export default AddPermission;

