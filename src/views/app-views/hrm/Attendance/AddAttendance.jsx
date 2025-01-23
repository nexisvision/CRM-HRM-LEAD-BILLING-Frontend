import React, { useEffect } from "react";
import { Formik, Form as FormikForm, Field } from "formik";
import { Select, DatePicker, TimePicker, Input, Button, Row, Col, message, Form } from "antd";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { addAttendance, getAttendances } from "./AttendanceReducer/AttendanceSlice";

const { Option } = Select;



const AddAttendance = ({onClose}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const employeeData = useSelector((state) => (state.employee?.employee?.data || []));
 

 
 useEffect(() => {
     dispatch(empdata());
   }, [dispatch]);
 
 // Validation Schema using Yup
 const validationSchema = Yup.object().shape({
  employee: Yup.string().required("User is required"),
  date: Yup.date().required("Start Date is required"),
   startTime: Yup.string().required("Start Time is required"),
   endTime: Yup.string().required("End Time is required"),
   late: Yup.string().required("Late field is required"),
   halfDay: Yup.string().required("Half Day selection is required"),
   comment: Yup.string().optional(),
 });


  const handleSubmit = (values) => {
    console.log("values", values);
   dispatch(addAttendance(values)) // Fixed naming
         .then(() => {
           dispatch(getAttendances());
           message.success('Appraisal added successfully!');
           onClose(); // Optional if provided
           navigate("/app/hrm/attendance");
         })
         .catch((error) => {
           message.error('Failed to add appraisal.');
           console.error('Add API error:', error);
         });
    
  };

  return (
    <div className="add-attendance-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

      <Formik
        initialValues={{
          employee: "",
          date: "",
          startTime: "",
          endTime: "",
          late: "",
          halfDay: "",
          comment: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <FormikForm>
            <Row gutter={16}>
             
              <Col span={24}>
            <Form.Item
              name="employee"
              label="Employee"
              rules={[{ required: true, message: 'Please select a employee' }]}
            >
              <Select placeholder="Select employee">
                {employeeData.map((emp) => (
                  <Option key={emp.id} value={emp.id}>
                    {emp.username}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

              {/* Start Date and Start Time */}
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label>Start Date</label>
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select date"
                    onChange={(date) => setFieldValue("date", date)}
                  />
                  {errors.date && touched.date && (
                    <div style={{ color: "red", fontSize: "12px" }}>{errors.date}</div>
                  )}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label>Start Time</label>
                  <TimePicker
                    style={{ width: "100%" }}
                    placeholder="Select time"
                    onChange={(time) => setFieldValue("startTime", time)}
                  />
                  {errors.startTime && touched.startTime && (
                    <div style={{ color: "red", fontSize: "12px" }}>{errors.startTime}</div>
                  )}
                </div>
              </Col>

              {/* End Time */}
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label>End Time</label>
                  <TimePicker
                    style={{ width: "100%" }}
                    placeholder="Select time"
                    onChange={(time) => setFieldValue("endTime", time)}
                  />
                  {errors.endTime && touched.endTime && (
                    <div style={{ color: "red", fontSize: "12px" }}>{errors.endTime}</div>
                  )}
                </div>
              </Col>

              {/* Late Field */}
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label>Late</label>
                  <Field
                    as={Input}
                    name="late"
                    placeholder="Enter Late Time"
                    onChange={(e) => setFieldValue("late", e.target.value)}
                  />
                  {errors.late && touched.late && (
                    <div style={{ color: "red", fontSize: "12px" }}>{errors.late}</div>
                  )}
                </div>
              </Col>

              {/* Half Day Dropdown */}
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label>Half Day</label>
                  <Field
                    as={Select}
                    name="halfDay"
                    placeholder="Select Yes or No"
                    style={{ width: "100%" }}
                    onChange={(value) => setFieldValue("halfDay", value)}
                  >
                    <Option value="yes">Yes</Option>
                    <Option value="no">No</Option>
                  </Field>
                  {errors.halfDay && touched.halfDay && (
                    <div style={{ color: "red", fontSize: "12px" }}>{errors.halfDay}</div>
                  )}
                </div>
              </Col>

              {/* Comment Field */}
              <Col span={24}>
                <div style={{ marginBottom: "16px" }}>
                  <label>Comment</label>
                  <Field
                    as={Input.TextArea}
                    name="comment"
                    placeholder="Add a comment (optional)"
                    rows={3}
                    onChange={(e) => setFieldValue("comment", e.target.value)}
                  />
                </div>
              </Col>
            </Row>

            {/* Submit Button */}
            <div className="text-center">
              <Button type="primary" htmlType="submit">
                Add Attendance
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default AddAttendance;

















// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, TimePicker, message, Row, Col } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// const AddAttendance = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Attendance added successfully!');
//     // Add logic to save data
//     navigate('/app/hrm/attendance');
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };

//   return (
//     <div className="add-attendance-form">
//       <h2 className="mb-4 text-center">Add Attendance</h2>
//       <p className="text-center text-danger">* Please fill Date and Time</p>
//       <Form
//         layout="vertical"
//         form={form}
//         name="add-manual-attendance"
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//       >
//         <Row gutter={16}>
//           {/* User Field */}
//           <Col span={24}>
//             <Form.Item
//               name="user"
//               label="User"
//               rules={[{ required: true, message: 'User is required' }]}
//             >
//               <Select placeholder="Select User">
//                 <Option value="user1">User 1</Option>
//                 <Option value="user2">User 2</Option>
//                 <Option value="user3">User 3</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Start Time */}
//           <Col span={12}>
//             <Form.Item
//               name="startDate"
//               label="Start Time"
//               rules={[{ required: true, message: 'Start Date and Time are required' }]}
//             >
//               <DatePicker style={{ width: '100%' }} placeholder="Select date" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="startTime"
//               label=" "
//               rules={[{ required: true, message: 'Start Time is required' }]}
//             >
//               <TimePicker style={{ width: '100%' }} placeholder="Select time" />
//             </Form.Item>
//           </Col>

//           {/* End Time */}
//           <Col span={12}>
//             <Form.Item
//               name="endDate"
//               label="End Time"
//               rules={[{ required: true, message: 'End Date and Time are required' }]}
//             >
//               <DatePicker style={{ width: '100%' }} placeholder="Select date" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="endTime"
//               label=" "
//               rules={[{ required: true, message: 'End Time is required' }]}
//             >
//               <TimePicker style={{ width: '100%' }} placeholder="Select time" />
//             </Form.Item>
//           </Col>

//           {/* Comment */}
//           <Col span={24}>
//             <Form.Item name="comment" label="Comment">
//               <Input.TextArea placeholder="Comment" />
//             </Form.Item>
//           </Col>

//           {/* IP Address */}
//           {/* <Col span={24}>
//             <Form.Item
//               name="ipAddress"
//               label="IP Address"
//               initialValue="127.0.0.1"
//               rules={[{ required: true, message: 'IP Address is required' }]}
//             >
//               <Input disabled />
//             </Form.Item>
//           </Col> */}
//         </Row>

//         <Form.Item>
//           <div className="text-center">
//             <Button type="primary" htmlType="submit">
//               Add Attendance
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default AddAttendance;













// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// const AddAttendance = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Attendance added successfully!');
//     navigate('app/hrm/department')
//     // Navigate or perform additional actions here
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };

  

//   return (
//     <div className="add-employee">
//       <h2 className="mb-4">Add New Attendance</h2>
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
//             <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/desigantion')}>
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

// export default AddAttendance;









