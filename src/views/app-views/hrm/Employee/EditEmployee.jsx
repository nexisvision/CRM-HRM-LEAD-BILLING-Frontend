import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Field, ErrorMessage, Formik } from "formik";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import { empdata, updateEmp } from "./EmployeeReducers/EmployeeSlice";
import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
import { getDes } from "../Designation/DesignationReducers/DesignationSlice";
import { getallcountries } from "../../setting/countries/countriesreducer/countriesSlice";
import {  QuestionCircleOutlined} from "@ant-design/icons";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";
import * as Yup from "yup";

const { Option } = Select;

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.object().shape({
    code: Yup.string().required("Code is required"),
    number: Yup.string().required("Number is required")
  }),
  address: Yup.string().required("Address is required"),
  branch: Yup.string().required("Branch is required"),
  leaveDate: Yup.date().required("Leave Date is required"),
  department: Yup.string().required("Department is required"),
  designation: Yup.string().required("Designation is required"),
});

const EditEmployee = ({ employeeIdd, onClose }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // console.log("employeeIdd", employeeIdd);


  // Add state for file handling
  const [fileList, setFileList] = useState([]);

  const departmentData = useSelector((state) => state.Department?.Department?.data || []);
  const designationData = useSelector((state) => state.Designation?.Designation?.data || []);

  
    const loggedusername = useSelector((state)=>state.user.loggedInUser.username);
  
  
    const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
    const fndbranchdata = branchData.filter((item) => item.created_by === loggedusername);

    const fnddepart =  departmentData.filter((item)=>item.created_by === loggedusername);
    const fnddesi = designationData.filter((item)=>item.created_by === loggedusername);
  
    
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Filter departments and designations based on selected branch
  const filteredDepartments = fnddepart.filter((dept) => dept.branch === selectedBranch);
  const filteredDesignations = fnddesi.filter((des) => des.branch === selectedBranch);


  const countries = useSelector((state) => state.countries.countries);
  

  useEffect(()=>{
    dispatch(empdata())
  },[dispatch])

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);


  const allempdata = useSelector((state) => state.employee);
  const [singleEmp, setSingleEmp] = useState(null);


  useEffect(() => {
    dispatch(getDept());
    dispatch(getDes());
    dispatch(getBranch());
  }, [dispatch]);



  useEffect(() => {
    const empData = allempdata?.employee?.data || [];

    // console.log("empData", empData); 

    const data = empData.find((item) => item.id === employeeIdd);
    setSingleEmp(data || null);


    console.log("data", data);

    // Update form fields with the employee's data once it's available
    if (data) {
      form.setFieldsValue({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        password: data.password,
        email: data.email,
        phone: data.phone,
        address: data.address,
        joiningDate: data.joiningDate ? moment(data.joiningDate) : null,
        leaveDate: data.leaveDate ? moment(data.leaveDate) : null,
        department: data.department,
        designation: data.designation,
        salary: data.salary,
        accountholder: data.accountholder,
        accountnumber: data.accountnumber,
        bankname: data.bankname,
        banklocation: data.banklocation,
        profilePic: data.profilePic,
        branch: data.branch,
        // Add other fields as needed
      });
    }
  }, [allempdata, employeeIdd, form]);


  // useEffect(() => {
  //   if (singleEmp) {
  //     form.setFieldsValue({
  //       ...singleEmp,
  //       joiningDate: singleEmp.joiningDate
  //         ? moment(singleEmp.joiningDate)
  //         : null,
  //       leaveDate: singleEmp.leaveDate ? moment(singleEmp.leaveDate) : null,
  //     });
  //   }
  // }, [singleEmp, form]);


  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      
      // Handle profile picture separately
      if (fileList.length > 0) {
        formData.append('profilePic', fileList[0].originFileObj || fileList[0]);
      }

      // Add all other form values to FormData
      Object.keys(values).forEach(key => {
        if (key !== 'profilePic' && values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      const response = await dispatch(updateEmp({ employeeIdd, formData })).unwrap();
      
      if (response) {
        message.success('Employee updated successfully!');
        dispatch(empdata());
        onClose();
      }
    } catch (error) {
      console.error("Update error:", error);
      message.error(error?.message || "An error occurred while updating the employee.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Form submission failed:", errorInfo);
    // message.error("Please fill out all required fields.");
  };



  const initialValues = {
    firstName: singleEmp?.firstName || "",
    lastName: singleEmp?.lastName || "",
    // username: singleEmp?.username || "",
    password: "",
    email: singleEmp?.email || "",
    phone: {
      code: singleEmp?.phone?.code || "",
      number: singleEmp?.phone?.number || ""
    },
    address: singleEmp?.address || "",
    joiningDate: singleEmp?.joiningDate ? moment(singleEmp.joiningDate) : null,
    leaveDate: singleEmp?.leaveDate ? moment(singleEmp.leaveDate) : null,
    // employeeId: "",
    department: singleEmp?.department || "",
    designation: singleEmp?.designation || "",
    salary: singleEmp?.salary || "",
    accountholder: singleEmp?.accountholder || "",
    accountnumber: singleEmp?.accountnumber || "",
    bankname: singleEmp?.bankname || "",
    banklocation: singleEmp?.banklocation || "",
  };



  // if (!singleEmp) {
  //   return <div>Loading...</div>;
  // }

  // Update file handling function
  const handleFileChange = ({ file }) => {
    // Store the actual file object
    setFileList([{
      uid: '-1',
      name: file.name,
      status: 'done',
      originFileObj: file
    }]);
  };

  return (
    <div className="edit-employee">
       <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={onFinish}
      >
        {({
          isSubmitting,
          resetForm,
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
        }) => (
      // <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

      <Form
        layout="vertical"
        form={form}
        name="edit-employee"
        onFinish={handleSubmit}
        initialValues={initialValues}
        onFinishFailed={onFinishFailed}
      >
        {/* User Information */}
        <h1 className="border-b-2 border-gray-300 pb-2"></h1>

        <h1 className="text-lg font-bold mt-3">Personal Information</h1>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              className="mt-2 font-semibold"
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "First Name is required" }]}
            >
              <Input placeholder="John" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mt-2 font-semibold "
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Last Name is required" }]}
            >
              <Input placeholder="Doe" />
            </Form.Item>
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
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              className=" font-semibold"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="Strong Password" />
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              className=" font-semibold"
              rules={[
                { required: true, message: "Email is required" },
                {
                  type: "email",
                  message:
                    "Please enter a valid email (e.g., example@example.com)",
                },
              ]}
            >
              <Input placeholder="johndoe@example.com" />
            </Form.Item>
          </Col> */}
          <Col span={12}>
  <Form.Item
    name="phone"
    label="Phone"
    className=" font-semibold"
    rules={[{ required: true, message: "Phone number is required" }]}
  >
    <Input.Group compact>
      <Form.Item
        name={['phone', 'code']}
        noStyle
        // rules={[{ required: true, message: 'Code is required' }]}
      >
        <Select
          style={{ width: '30%' }}
          placeholder="Code"
        >
          {countries.map((country) => (
            <Option key={country.id} value={country.phoneCode}>
              (+{country.phoneCode})
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={['phone', 'number']}
        noStyle
        rules={[{ required: true, message: 'Phone number is required' }]}
      >
        <Input 
          type="number"
          style={{ width: '70%' }} 
          placeholder="Enter Phone"
          onKeyPress={(e) => {
            // Allow only numbers
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          className="hide-number-spinner"
        />
      </Form.Item>
    </Input.Group>
  </Form.Item>
</Col>
        </Row>

        {/* Address Information */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="address"
              label="Address"
              className=" font-semibold"
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
              className=" font-semibold"
              rules={[{ required: true, message: "Joining Date is required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="leaveDate" 
            label="Leave Date"
             className=" font-semibold"
              rules={[{ required: true, message: "Leave Date is required" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          
        </Row>





        {/* Designation, Salary, and CV Upload */}
        <Row gutter={16}>
        <Col span={24} className="mt-4">
                <span className="block font-semibold p-2">
                  Profile Picture <QuestionCircleOutlined />
                </span>
                <Form.Item name="profilePic">
                  <Upload
                    fileList={fileList}
                    beforeUpload={(file) => {
                      handleFileChange({ file });
                      return false; // Prevent auto upload
                    }}
                    onRemove={() => {
                      form.setFieldsValue({ profilePic: null });
                      setFileList([]);
                    }}
                    accept="image/*"
                  >
                    <Button 
                      icon={<UploadOutlined />} 
                      disabled={fileList.length > 0}
                    >
                      Choose Profile Picture            
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
        {/* <Col span={8} className="mt-2">
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Department is required" }]}
            >
              <Select
                placeholder="Select Department"
                onChange={(value) => form.setFieldsValue({ department: value })}
              >
                {fnddepart.map((dept) => (
                  <Option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} className="mt-2">
            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true, message: "Designation is required" }]}
            >
              <Select
                placeholder="Select Designation"
                onChange={(value) => form.setFieldsValue({ designation: value })}
              >
                {fnddesi.map((des) => (
                  <Option key={des.id} value={des.id}>
                    {des.designation_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            </Col> */}
           <Col span={12}>
            <div className="form-item">
              <label className="font-semibold">Branch <span className="text-red-500">*</span></label>
              <Field name="branch">
                {({ field }) => (
                  <Select
                    {...field}
                    className="w-full mt-1"
                    placeholder="Select Branch"
                    onChange={(value) => {
                      setFieldValue("branch", value);
                      setFieldValue("department", "");
                      setFieldValue("designation", "");
                      setSelectedBranch(value); // Update selected branch
                    }}
                  >
                    {fndbranchdata.map((branch) => (
                       <Option key={branch.id} value={branch.id}>
                       {branch.branchName}
                     </Option>
                    ))}
                  </Select>
                )}
              </Field>
              <ErrorMessage name="branch" component="div" className="text-red-500" />
            </div>
          </Col>

          {/* Department Selection */}
          <Col span={12}>
            <div className="form-item">
              <label className="font-semibold">Department <span className="text-red-500">*</span></label>
              <Field name="department">
                {({ field }) => (
                  <Select
                    {...field}
                    className="w-full mt-1"
                    placeholder="Select Department"
                    disabled={!selectedBranch}
                    onChange={(value) => setFieldValue("department", value)}
                  >
                    {filteredDepartments.map((dept) => (
                      <Option key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Field>
              <ErrorMessage name="department" component="div" className="text-red-500" />
            </div>
          </Col>

          {/* Designation Selection */}
          <Col span={12}>
            <div className="form-item mt-2">
              <label className="font-semibold">Designation <span className="text-red-500">*</span></label>
              <Field name="designation">
                {({ field }) => (
                  <Select
                    {...field}
                    className="w-full mt-1"
                    placeholder="Select Designation"
                    disabled={!selectedBranch}
                    onChange={(value) => setFieldValue("designation", value)}
                  >
                    {filteredDesignations.map((des) => (
                      <Option key={des.id} value={des.id}>
                        {des.designation_name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Field>
              <ErrorMessage name="designation" component="div" className="text-red-500" />
            </div>
          </Col>
          

        </Row>

        <h1 className="text-lg font-bold mt-3">Bank Details</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="accountholder"
              className="mt-2 font-semibold"
              label="Account Holder Name"
              rules={[
                { required: true, message: "Account Holder Name is required" },
              ]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="accountnumber"
              label="Account Number"
              className="mt-2 font-semibold "
              rules={[
                { required: true, message: "Account Number is required" },
              ]}
            >
              <Input placeholder="123456789" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="bankName"
              label="Bank Name"
              className=" font-semibold "
              rules={[{ required: true, message: "Bank Name is required" }]}
            >
              <Input placeholder="Bank of Example" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="file" label="Upload CV" className=" font-semibold ">
              <Upload
                action="http://localhost:3000/api/users/upload-cv"
                listType="picture"
                accept=".pdf"
                maxCount={1}
                showUploadList={{ showRemoveIcon: true }}
              >
                <Button icon={<UploadOutlined />}>Upload </Button>
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
         )}
      </Formik>

    </div>
  );
};

export default EditEmployee;

{
  /* <h1 className="text-lg font-bold mb-3">Document</h1> */
}

{
  /* <Row gutter={16}>
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
</Row> */
}

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
