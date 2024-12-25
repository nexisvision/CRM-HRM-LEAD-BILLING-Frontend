import React from "react";
import {  Input, Button, DatePicker, Select, Upload, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { addEmp, empdata } from "./EmployeeReducers/EmployeeSlice";
import { useDispatch } from "react-redux";

const { Option } = Select;

const AddEmployee = ({onClose,setSub}) => {
  // const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  

  // const onSubmit = async (values) => {
  //   console.log("Submitted values:", values);
  //   try {
  //     await RoleData(values);
  //     message.success("Employee added successfully!");
  //     navigate("/app/hrm/employee");
  //     resetForm();
  //   } catch (error) {
  //     message.error("Failed to add employee. Please try again.");
  //   }
  // };

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    console.log("Submitted values:", values);
    try {
      // await RoleData(values);
      dispatch(addEmp(values));
      message.success("Employee added successfully!");
      navigate("/app/hrm/employee");
      dispatch(empdata());
      setSub(true);
      resetForm();
      onClose();
       
    } catch (error) {
      message.error("Failed to add employee. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  const onFinishFailed = (errorInfo) => {
    console.error("Form submission failed:", errorInfo);
    message.error("Please fill out all required fields.");
  };

   const initialValues = {
    firstName: '',
    lastName: '',
    username:'',
    password:'',
    email: '',
    phone:'',
    address: '',
    joiningDate: null,
    leaveDate: null,
    employeeId:'',
    department:'',
    designation:'',
    salary:'',
    accountholder:'',
    accountnumber:'',
    bankname:'',
    banklocation:'',
  }
  
      const validationSchema = Yup.object({
        firstName: Yup.string().required('Please enter a firstName.'),
        lastName:Yup.string().required('Please enter a lastName.'),
        username:Yup.string().required('Please enter a userName.'),
        password:Yup.string().min(8, "Password must be at least 8 characters").matches(/\d/, "Password must have at least one number").required("Password is required"),
        email: Yup.string().email('Please enter a valid email address with @.').required('please enter a email'),
        phone: Yup.string()
              .matches(/^\d{10}$/, 'phone number must be 10 digits.')
              .required('Please enter a phone Number.'), 
        address: Yup.string().required('Please enter a  Address.'),
        joiningDate: Yup.date().nullable().required('Joining Date is required.'),
        leaveDate: Yup.date().nullable().required('Leave Date is required.'),
        employeeId:Yup.string().required('Please enter a  Employee Id.'),
        department:Yup.string().required('Please select a Department.'),
        designation:Yup.string().required('Please select a Designation.'),
        salary:Yup.string().required('Please enter a Salary.'),
        accountholder:Yup.string().required('please enter a Accountholder'),
        accountnumber:Yup.string().required('Please enter a Account Number'),
        bankname:Yup.string().required('Please enter a Bank Name'),
        ifsc:Yup.string().required('Please enter a Ifsc'),
        banklocation:Yup.string().required('Please enter a Bank Location'),
      });
  

  return (
    <div className="add-employee">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
      <Formik
                          initialValues={initialValues}
                          validationSchema={validationSchema}
                          onSubmit={onSubmit}
                      >
                          {({isSubmitting ,resetForm, values, setFieldValue, handleSubmit, setFieldTouched  }) => (

      <Form
        // layout="vertical"
        // form={form}
        // name="add-employee"
        className="formik-form" onSubmit={handleSubmit}
        // onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {/* User Information */}
      <h1 className="text-lg font-bold mb-1">Personal Information</h1>
                        <Row gutter={16}>
                            <Col span={12}>
                                              <div className="form-item">
                                                  <label className='font-semibold'>First Name</label>
                                                  <Field name="firstName" as={Input} placeholder="John"/>
                                                  <ErrorMessage name="firstName" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>
          {/* <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "First Name is required" }]}
            >
              <Input placeholder="John" />
            </Form.Item>
          </Col> */}
                            <Col span={12}>
                                              <div className="form-item">
                                                  <label className='font-semibold'>Last Name</label>
                                                  <Field name="lastName" as={Input} placeholder="Doe" />
                                                  <ErrorMessage name="lastName" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>
          {/* <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Last Name is required" }]}
            >
              <Input placeholder="Doe" />
            </Form.Item>
          </Col> */}
                            <Col span={12} className="mt-2">
                                              <div className="form-item">
                                                  <label className='font-semibold'>User Name</label>
                                                  <Field name="username" as={Input} placeholder="john_doe" />
                                                  <ErrorMessage name="username" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>
          {/* <Col span={12}>
            <Form.Item
              name="username"
              label="User Name"
              rules={[{ required: true, message: "User Name is required" }]}
            >
              <Input placeholder="john_doe" />
            </Form.Item>
          </Col> */}
                            <Col span={12} className="mt-2">
                                              <div className="form-item">
                                                  <label className='font-semibold'>Password</label>
                                                  <Field name="password" as={Input} placeholder="Strong Password" type='password' />
                                                  <ErrorMessage name="password" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>
          {/* <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="Strong Password" />
            </Form.Item>
          </Col> */}
                            <Col span={12} className="mt-2">
                                              <div className="form-item">
                                                  <label className='font-semibold'>Email</label>
                                                  <Field name="email" as={Input} placeholder="johndoe@example.com" type='email' />
                                                  <ErrorMessage name="email" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>
          {/* <Col span={12}>
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
          </Col> */}
                            <Col span={12} className="mt-2">
                                              <div className="form-item">
                                                  <label className='font-semibold'>Phone</label>
                                                  <Field name="phone" as={Input} placeholder="1234567890" />
                                                  <ErrorMessage name="phone" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>
          {/* <Col span={12}>
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
          </Col> */}
        </Row>

        {/* Address Information */}
        <Row gutter={16}>

                    <Col span={24} className='mt-2'>
                                              <div className="form-item">
                                                  <label className="font-semibold">Address</label>
                                                  <Field name="address">
                                                      {({ field }) => (
                                                          <ReactQuill
                                                              {...field}
                                                              value={values.address}
                                                              onChange={(value) => setFieldValue('address', value)}
                                                              onBlur={() => setFieldTouched("address", true)}
                                                              placeholder="Los Angeles" 
                                                          />
                                                      )}
                                                  </Field>
                                                  <ErrorMessage name="address" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                                          </Col>
         
          {/* <Col span={24}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <TextArea placeholder="Los Angeles" />
            </Form.Item>
          </Col> */}

        </Row>

        {/* Employee Information */}
        <Row gutter={16}>
                            <Col span={12} className='mt-2'>
                              <div className="form-item">
                                <label className='font-semibold'> Joining Date</label>
                                <DatePicker
                                  className="w-full"
                                  format="DD-MM-YYYY"
                                  value={values.joiningDate}
                                  onChange={(joiningDate) => setFieldValue('joiningDate', joiningDate)}
                                  onBlur={() => setFieldTouched("joiningDate", true)}
                                />
                                <ErrorMessage name="joiningDate" component="div" className="error-message text-red-500 my-1" />
                              </div>
                            </Col>
          {/* <Col span={12}>
            <Form.Item
              name="joiningDate"
              label="Joining Date"
              rules={[{ required: true, message: "Joining Date is required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col> */}
                            <Col span={12} className='mt-2'>
                              <div className="form-item">
                                <label className='font-semibold'> Leave Date</label>
                                <DatePicker
                                  className="w-full"
                                  format="DD-MM-YYYY"
                                  value={values.leaveDate}
                                  onChange={(leaveDate) => setFieldValue('leaveDate', leaveDate)}
                                  onBlur={() => setFieldTouched("leaveDate", true)}
                                />
                                <ErrorMessage name="leaveDate" component="div" className="error-message text-red-500 my-1" />
                              </div>
                            </Col>
          {/* <Col span={12}>
            <Form.Item name="leaveDate" label="Leave Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col> */}
                            <Col span={12} className="mt-2">
                                              <div className="form-item">
                                                  <label className='font-semibold'>Employee ID</label>
                                                  <Field name="employeeId" as={Input} placeholder="OE-012"  />
                                                  <ErrorMessage name="employeeId" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>
          {/* <Col span={12}>
            <Form.Item
              name="employeeId"
              label="Employee ID"
              rules={[{ required: true, message: "Employee ID is required" }]}
            >
              <Input placeholder="OE-012" />
            </Form.Item>
          </Col> */}
                            <Col span={12} className='mt-2'>
                              <div className="form-item">
                                <label className='font-semibold'>Department</label>
                                <Field name="department">
                                  {({ field }) => (
                                    <Select
                                      {...field}
                                      className="w-full"
                                      placeholder="Select Department"
                                      onChange={(value) => setFieldValue('department', value)}
                                      value={values.department}
                                      onBlur={() => setFieldTouched("department", true)}
                                    >
                                      <Option value="Manager">Manager</Option>
                                      <Option value="Developer">Developer</Option>
                                      <Option value="Designer">Designer</Option>
                                    </Select>
                                  )}
                                </Field>
                                <ErrorMessage name="department" component="div" className="error-message text-red-500 my-1" />
                              </div>
                            </Col>
          {/* <Col span={12}>
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
          </Col> */}
          
        </Row>

        {/* Designation, Salary, and CV Upload */}
        <Row gutter={16} className="mt-2">
                  <Col span={12} className='mt-2'>
                              <div className="form-item">
                                <label className='font-semibold'>Designation</label>
                                <Field name="designation">
                                  {({ field }) => (
                                    <Select
                                      {...field}
                                      className="w-full"
                                      placeholder="Select Designation"
                                      onChange={(value) => setFieldValue('designation', value)}
                                      value={values.designation}
                                      onBlur={() => setFieldTouched("designation", true)}
                                    >
                                      <Option value="Manager">Manager</Option>
                                      <Option value="Developer">Developer</Option>
                                      <Option value="Designer">Designer</Option>
                                    </Select>
                                  )}
                                </Field>
                                <ErrorMessage name="designation" component="div" className="error-message text-red-500 my-1" />
                              </div>
                  </Col>
          {/* <Col span={12}>
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
          </Col> */}
                            <Col span={12} className="mt-2">
                                              <div className="form-item">
                                                  <label className='font-semibold'>Salary</label>
                                                  <Field name="salary" as={Input} placeholder="$" type="number"/>
                                                  <ErrorMessage name="salary" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>
          {/* <Col span={12}>
            <Form.Item
              name="salary"
              label="Salary"
              rules={[{ required: true, message: "Salary is required" }]}
            >
              <Input placeholder="$" type="number" />
            </Form.Item>
          </Col> */}

        </Row>

        <h1 className="text-lg font-bold mb-3 mt-2">Bank Details</h1>

        <Row gutter={16}>
                            <Col span={12} className="mt-2">
                                              <div className="form-item">
                                                  <label className='font-semibold'>Account Holder Name</label>
                                                  <Field name="accountholder" as={Input} placeholder="John Doe" type="string"/>
                                                  <ErrorMessage name="accountholder" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>
          {/* <Col span={12}>
            <Form.Item
              name="accountholder"
              label="Account Holder Name"
              rules={[{ required: true, message: "Account Holder Name is required" }]}
            >
            <Input placeholder="John Doe" type="string" />

            </Form.Item>
          </Col> */}
                            <Col span={12} className="mt-2">
                                              <div className="form-item">
                                                  <label className='font-semibold'>Account Number</label>
                                                  <Field name="accountnumber" as={Input} placeholder="123456789" type="number"/>
                                                  <ErrorMessage name="accountnumber" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>
          {/* <Col span={12}>
            <Form.Item
              name="accountnumber"
              label="Account Number"
              rules={[{ required: true, message: "Account Number is required" }]}
            >
              <Input placeholder="123456789" type="number" />
            </Form.Item>
          </Col> */}

                            <Col span={12} className="mt-2">
                                              <div className="form-item">
                                                  <label className='font-semibold'>Bank Name</label>
                                                  <Field name="bankname" as={Input} placeholder="Bank Name" type="string"/>
                                                  <ErrorMessage name="bankname" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>

          {/* <Col span={12}>
            <Form.Item
              name="bankname"
              label="Bank Name"
              rules={[{ required: true, message: "Bank Name is required" }]}
            >
            <Input placeholder="Bank Name" type="string" />

            </Form.Item>
          </Col>          */}
                            <Col span={12} className="mt-2">
                                              <div className="form-item">
                                                  <label className='font-semibold'>IFSC</label>
                                                  <Field name="ifsc" as={Input} placeholder="IFSC" type="number"/>
                                                  <ErrorMessage name="ifsc" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>
           {/* <Col span={12}>
            <Form.Item
              name="ifsc"
              label="IFSC"
              rules={[{ required: true, message: "IFSC is required" }]}
            >
            <Input placeholder="IFSC" type="number" />

            </Form.Item>
          </Col> */}

                            <Col span={12} className="mt-2">
                                              <div className="form-item">
                                                  <label className='font-semibold'>Bank Location</label>
                                                  <Field name="banklocation" as={Input} placeholder="Bank Location" type="string"/>
                                                  <ErrorMessage name="banklocation" component="div" className="error-message text-red-500 my-1" />
                                              </div>
                            </Col>

          {/* <Col span={12}>
            <Form.Item
              name="banklocation"
              label="Bank Location"
              rules={[{ required: true, message: "Bank Location is required" }]}
            >
            <Input placeholder="Bank Location" type="string" />

            </Form.Item>
          </Col> */}
</Row>

<h1 className="text-lg font-bold mb-3">Document</h1>

          {/* <Row gutter={16}> */}
          {/* <Col span={12}>
            <Form.Item
              name="cv"
              label="Upload CV"
              rules={[{ required: true, message: "CV is required" }]}
            >
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Col> */}
          {/* <Col span={12}>
            <Form.Item
              name="photo"
              label="Upload Photo"
              rules={[{ required: true, message: "Photo is required" }]}
            >
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Col> */}
        {/* </Row> */}

          <div className="text-right">
            <Button
              type="default"
              className="mr-2"
              // onClick={() => navigate("/app/hrm/employee")}
              onClick={() => onClose()} // Clear all fields


            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
            <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
              {/* Submit */}
            </Button>
          </div>
      </Form>
       )}
                      </Formik>
    </div>
  );
};

export default AddEmployee;
















// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// const AddEmployee = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Employee added successfully!');
//     navigate('/app/hrm/employee');
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };

//   return (
//     <div className="add-employee">
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
//               Submit
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default AddEmployee;
















// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// const AddEmployee = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Employee added successfully!');
//     navigate('app/hrm/employee')
//     // Navigate or perform additional actions here
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };

  

//   return (
//     <div className="add-employee">
//       {/* <h2 className="mb-4">Add New Employee</h2> */}

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
//               Submit
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default AddEmployee;










// import React from 'react'
// import { Form, Input, Button, message } from 'antd';
// import ReactQuill from 'react-quill';
// import { useNavigate } from 'react-router-dom';

// const AddEmployee = () => {

// 	const navigate = useNavigate()

// 	const modules = {
// 		toolbar: [
// 			[{ header: [1, 2, false] }],
// 			['bold', 'italic', 'underline'],
// 			['image', 'code-block']
// 		],
// 	}

// 	const back = () => {
// 		navigate('app/hrm/employee');
// 	}

// 	const onFinish = () => {
// 		message.success('Email has been sent');
// 		navigate('/app/apps/mail/inbox');
// 	}

// 	return (
// 		<div className="mail-compose">
// 			{/* <h4 className="mb-4"></h4> */}
// 			<Form  name="nest-messages" onFinish={onFinish} >
// 				<Form.Item name={['mail', 'to']}>
//                     <label htmlFor="First Name">First Name :  </label>
// 				<Input placeholder="First Name:"/>
// 				</Form.Item>


// 				<Form.Item name={['mail', 'cc']} >
//                 <label htmlFor="Last Name">Last Name :  </label>
//                 	<Input placeholder="Last Name:"/>
// 				</Form.Item>
// 				<Form.Item name={['mail', 'subject']} >

//                 <label htmlFor="First Name">First Name :  </label>

// 					<Input placeholder="Subject:"/>
// 				</Form.Item>
// 				<Form.Item name={['mail', 'content']}>

//                 <label htmlFor="First Name">First Name :  </label>
// 					<ReactQuill theme="snow" modules={modules}/>
// 				</Form.Item>
// 				<Form.Item>
// 					<div className="mt-5 text-right">
// 						<Button type="link" className="mr-2">
// 							Save Darft
// 						</Button>
// 						<Button className="mr-2" onClick={back}>
// 							Discard
// 						</Button>
// 						<Button type="primary" htmlType="submit">
// 							Send
// 						</Button>
// 					</div>
// 				</Form.Item>
// 			</Form>
// 		</div>
// 	)
// }

// export default AddEmployee
