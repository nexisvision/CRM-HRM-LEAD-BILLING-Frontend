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

  // Update CV state to match profile picture structure
  const [cvFileList, setCvFileList] = useState([]);

  const departmentData = useSelector((state) => state.Department?.Department?.data || []);
  const designationData = useSelector((state) => state.Designation?.Designation?.data || []);

  
    const loggedusername = useSelector((state)=>state.user.loggedInUser.username);
  
  
    const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
    const fndbranchdata = branchData.filter((item) => item.created_by === loggedusername);

    const fnddepart =  departmentData.filter((item)=>item.created_by === loggedusername);
    const fnddesi = designationData.filter((item)=>item.created_by === loggedusername);
  



    const departmentDataa = useSelector((state) => state.Department?.Department?.data || []);
    const designationDataa = useSelector((state) => state.Designation?.Designation?.data || []);
    const branchDataa = useSelector((state) => state.Branch?.Branch?.data || []);
  
    
    const getBranchName = (branchId) => {
      const branch = branchDataa.find(item => item.id === branchId);
      console.log("branch", branch);
      return branch?.branchName || '';
    };
    
    const getDepartmentName = (deptId) => {
      const department = departmentDataa.find(item => item.id === deptId);
      console.log("department", department);
      return department?.department_name || '';
    };
    

    const getDesignationName = (desigId) => {
      const designation = designationDataa.find(item => item.id === desigId);
      console.log("designation", designation);
      return designation?.designation_name || '';
    };



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
      // Split phone number into code and number if it exists
      let phoneCode = "";
      let phoneNumber = "";
      if (data.phone) {
        const phoneMatch = data.phone.match(/\+(\d+)\s*\((\d+)\)\s*(\d+)-(\d+)/);
        if (phoneMatch) {
          phoneCode = phoneMatch[1];
          phoneNumber = `${phoneMatch[2]}${phoneMatch[3]}${phoneMatch[4]}`;
        }
      }

      // Get names using IDs
      const branchName = getBranchName(data.branch);
      const departmentName = getDepartmentName(data.department);
      const designationName = getDesignationName(data.designation);

      form.setFieldsValue({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        username: data.username || "",
        password: data.password || "",
        email: data.email || "",
        phone: {
          code: phoneCode,
          number: phoneNumber
        },
        address: data.address || "",
        joiningDate: data.joiningDate ? moment(data.joiningDate) : null,
        leaveDate: data.leaveDate ? moment(data.leaveDate) : null,
        branch: {
          label: branchName,
          value: data.branch
        },
        department: {
          label: departmentName,
          value: data.department
        },
        designation: {
          label: designationName,
          value: data.designation
        },
        salary: data.salary || "",
        accountholder: data.accountholder || "",
        accountnumber: data.accountnumber?.toString() || "",
        bankname: data.bankname || "",
        banklocation: data.banklocation || "",
        profilePic: data.profilePic || "",
        
      });

      // Set file lists if profile pic or CV exists
      if (data.profilePic) {
        setFileList([{
          uid: '-1',
          name: 'Profile Picture',
          status: 'done',
          url: data.profilePic
        }]);
      }

      if (data.cv_path) {
        setCvFileList([{
          uid: '-1',
          name: 'CV',
          status: 'done',
          url: data.cv_path
        }]);
      }

      console.log('Branch Name:', branchName);
      console.log('Department Name:', departmentName);
      console.log('Designation Name:', designationName);
    }
  }, [allempdata, employeeIdd, form, branchData, departmentData, designationData]);

  //   console.log("singleEmp", singleEmp);
  // // useEffect(() => {
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

      // Handle file uploads
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('profilePic', fileList[0].originFileObj);
      }

      if (cvFileList.length > 0 && cvFileList[0].originFileObj) {
        formData.append('cv', cvFileList[0].originFileObj);
      }

      // Format phone number
      if (values.phone?.code && values.phone?.number) {
        formData.append('phone', `+${values.phone.code} (${values.phone.number})`);
      }

      // Handle dates
      if (values.joiningDate) {
        formData.append('joiningDate', values.joiningDate.toISOString());
      }
      if (values.leaveDate) {
        formData.append('leaveDate', values.leaveDate.toISOString());
      }

      // Convert the branch, department, and designation back to IDs for submission
      formData.append('branch', values.branch.value);
      formData.append('department', values.department.value);
      formData.append('designation', values.designation.value);

      // Add all other form values
      Object.keys(values).forEach(key => {
        if (key !== 'phone' && 
            key !== 'profilePic' && 
            key !== 'cv' && 
            key !== 'joiningDate' && 
            key !== 'leaveDate' && 
            values[key] !== undefined && 
            values[key] !== null) {
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
      message.error(error?.message || "Failed to update employee");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Form submission failed:", errorInfo);
    // message.error("Please fill out all required fields.");
  };



  const initialValues = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    phone: {
      code: "",
      number: ""
    },
    address: "",
    branch: "",
    department: "",
    designation: "",
    salary: "",
    accountholder: "",
    accountnumber: "",
    bankname: "",
    banklocation: "",
    joiningDate: null,
    leaveDate: null,
  };



  // if (!singleEmp) {
  //   return <div>Loading...</div>;
  // }

  // Handle CV file change
  const handleCVChange = ({ file }) => {
    // Check if file is a valid document type
    const isValidType = file.type === 'application/pdf' || 
                       file.type === 'application/msword' || 
                       file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (!isValidType && file.status !== 'removed') {
      message.error('You can only upload PDF or Word documents!');
      return;
    }

    if (file.status !== 'removed') {
      setCvFileList([{
        uid: '-1',
        name: file.name,
        status: 'done',
        originFileObj: file
      }]);
    } else {
      setCvFileList([]);
    }
  };

  // Handle profile picture change - store the actual file object
  const handleFileChange = ({ file }) => {
    if (file.status !== 'removed') {
      setFileList([{
        uid: '-1',
        name: file.name,
        status: 'done',
        originFileObj: file
      }]);
    } else {
      setFileList([]);
    }
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
              className="mt-2 "
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "First Name is required" }]}
            >
              <Input placeholder="John" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mt-2  "
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
              className=" "
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="Strong Password" />
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              className=" "
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
    className=" "
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
              className=" "
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
              className=" "
              rules={[{ required: true, message: "Joining Date is required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="leaveDate" 
            label="Leave Date"
             className=" "
              rules={[{ required: true, message: "Leave Date is required" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          
        </Row>





        {/* Designation, Salary, and CV Upload */}
        <Row gutter={16}>
        <Col span={24} className="mt-4">
                <span className="block  p-2">
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
            <Form.Item
              name="branch"
              label="Branch"
              rules={[{ required: true, message: "Branch is required" }]}
            >
              <Select
                placeholder="Select Branch"
                labelInValue
                onChange={(value) => form.setFieldsValue({ branch: value })}
              >
                {branchData.map((branch) => (
                  <Option key={branch.id} value={branch.id}>
                    {branch.branchName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Department Selection */}
          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Department is required" }]}
            >
              <Select
                placeholder="Select Department"
                labelInValue
                onChange={(value) => form.setFieldsValue({ department: value })}
              >
                {departmentData.map((dept) => (
                  <Option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Designation Selection */}
          <Col span={12}>
            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true, message: "Designation is required" }]}
            >
              <Select
                placeholder="Select Designation"
                labelInValue
                onChange={(value) => form.setFieldsValue({ designation: value })}
              >
                {designationData.map((desig) => (
                  <Option key={desig.id} value={desig.id}>
                    {desig.designation_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          

        </Row>

        <h1 className="text-lg font-bold mt-3">Bank Details</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="accountholder"
              className="mt-2 "
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
              className="mt-2  "
              rules={[
                { required: true, message: "Account Number is required" },
              ]}
            >
              <Input placeholder="123456789" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="bankname"
              label="Bank Name"
              className="  "
              rules={[{ required: true, message: "Bank Name is required" }]}
            >
              <Input placeholder="Bank of Example" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="banklocation"
              label="Bank Location"
              className="  "
              rules={[{ required: true, message: "Bank Location is required" }]}
            >
              <Input placeholder="Bank Location" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="cv" 
              label="Upload CV" 
              className="font-semibold"
            >
              <Upload
                fileList={cvFileList}
                beforeUpload={(file) => {
                  const isValidType = file.type === 'application/pdf' || 
                                    file.type === 'application/msword' || 
                                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                  if (!isValidType) {
                    message.error('You can only upload PDF or Word documents!');
                  }
                  return false; // Prevent auto upload
                }}
                onChange={handleCVChange}
                onRemove={() => {
                  form.setFieldsValue({ cv: null });
                  setCvFileList([]);
                }}
                accept=".pdf,.doc,.docx"
                maxCount={1}
              >
                <Button 
                  icon={<UploadOutlined />}
                  disabled={cvFileList.length > 0}
                >
                  Choose CV File (.pdf, .doc, .docx)
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="mr-3" >
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
//               className=" font-semibold"
//               rules={[
//                 { required: true, message: "Email is required" },
//                 {
//                   type: "email",
//                   message:
//                     "Please enter a valid email (e.g., example@example.com)",
//                 },
//               ]}
//             >
//               <Input placeholder="johndoe@example.com" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="phone"
//               label="Phone"
//               className=" font-semibold"
//               rules={[{ required: true, message: 'Phone number is required' }]}
//             >
//               <Input.Group compact>
//                 <Form.Item
//                   name={['phone', 'code']}
//                   noStyle
//                   // rules={[{ required: true, message: 'Code is required' }]}
//                 >
//                   <Select
//                     style={{ width: '30%' }}
//                     placeholder="Code"
//                   >
//                     {countries.map((country) => (
//                       <Option key={country.id} value={country.phoneCode}>
//                         (+{country.phoneCode})
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//                 <Form.Item
//                   name={['phone', 'number']}
//                   noStyle
//                   rules={[{ required: true, message: 'Phone number is required' }]}
//                 >
//                   <Input 
//                     type="number"
//                     style={{ width: '70%' }} 
//                     placeholder="Enter Phone"
//                     onKeyPress={(e) => {
//                       // Allow only numbers
//                       if (!/[0-9]/.test(e.key)) {
//                         e.preventDefault();
//                       }
//                     }}
//                     className="hide-number-spinner"
//                   />
//                 </Form.Item>
//               </Input.Group>
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
//               className=" font-semibold"
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
