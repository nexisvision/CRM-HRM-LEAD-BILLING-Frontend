// import React, { useEffect, useState } from "react";
// import {
//   Modal,
//   Input,
//   Button,
//   DatePicker,
//   Select,
//   Upload,
//   message,
//   Row,
//   Col,
// } from "antd";
// import { useNavigate } from "react-router-dom";
// import { UploadOutlined } from "@ant-design/icons";
// import ReactQuill from "react-quill";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { addEmp, empdata } from "./EmployeeReducers/EmployeeSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
// import { getDes } from "../Designation/DesignationReducers/DesignationSlice";
// import { getallcountries } from "../../setting/countries/countriesreducer/countriesSlice";

// const { Option } = Select;

// const AddEmployee = ({ onClose, setSub }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otpToken, setOtpToken] = useState(null);
//   const [otp, setOtp] = useState("");

//   const departmentData = useSelector((state) => state.Department?.Department?.data || []);
//   const designationData = useSelector((state) => state.Designation?.Designation?.data || []);

//   const loggedusername = useSelector((state)=>state.user.loggedInUser.username);


//   const fnddepart =  departmentData.filter((item)=>item.created_by === loggedusername);
//   const fnddesi = designationData.filter((item)=>item.created_by === loggedusername);


//   const countries = useSelector((state) => state.countries.countries);

//   useEffect(() => {
//     dispatch(getallcountries());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(getDept());
//     dispatch(getDes());
//   }, [dispatch]);

//   const otpapi = async (otp) => {
//     try {
//       const res = await axios.post(
//         "http://localhost:5353/api/v1/auth/verify-signup",
//         { otp },
//         {
//           headers: {
//             Authorization: `Bearer ${otpToken}`,
//           },
//         }
//       );
//       return res.data;
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       throw error;
//     }
//   };
//   const handleOtpVerify = async () => {
//     if (!otp || otp.length !== 6) {
//       message.error("Please enter a valid 6-digit OTP.");
//       return;
//     }

//     try {
//       const response = await otpapi(otp);
//       if (response.success) {
//         message.success("OTP Verified Successfully");
//         setShowOtpModal(false);
//         dispatch(empdata());
//       } else {
//         message.error("Invalid OTP. Please try again.");
//       }
//     } catch (error) {
//       message.error("Failed to verify OTP. Please try again.");
//     }
//   };

//   const onSubmit = async (values, { resetForm, setSubmitting }) => {
//     try {
//       console.log("values", values);
//       const response = await dispatch(addEmp(values));

      
//       if (response.payload?.data?.sessionToken) {
//         setOtpToken(response.payload?.data?.sessionToken);
//         setShowOtpModal(true);
//       }
//       resetForm();
//       onClose();
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       message.error("Failed to add employee. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error("Form submission failed:", errorInfo);
//     // message.error("Please fill out all required fields.");
//   };

//   const onOpenOtpModal = () => {
//     setShowOtpModal(true);
//   };
//   const onCloseOtpModal = () => {
//     setShowOtpModal(false);
//   };

//   const initialValues = {
//     firstName: "",
//     lastName: "",
//     username: "",
//     password: "",
//     email: "",
//     phone: "",
//     address: "",
//     joiningDate: null,
//     leaveDate: null,
//     department: "",
//     designation: "",
//     salary: "",
//     accountholder: "",
//     accountnumber: "",
//     bankname: "",
//     banklocation: "",
//   };

//   const validationSchema = Yup.object({
//     firstName: Yup.string().required("Please enter a first name."),
//     lastName: Yup.string().required("Please enter a last name."),
//     username: Yup.string().required("Please enter a username."),
//     password: Yup.string()
//       .min(8, "Password must be at least 8 characters")
//       .matches(/\d/, "Password must have at least one number")
//       .required("Password is required"),
//     email: Yup.string()
//       .email("Please enter a valid email address.")
//       .required("Please enter an email"),
//     phone: Yup.string()
//       .matches(/^\d{10}$/, "Phone number must be 10 digits.")
//       .required("Please enter a phone number."),
//     address: Yup.string().required("Please enter an address."),
//     joiningDate: Yup.date().nullable().required("Joining date is required."),
//     leaveDate: Yup.date().nullable().required("Leave date is required."),
//     department: Yup.string().required("Please select a department."),
//     designation: Yup.string().required("Please select a designation."),
//     salary: Yup.string().required("Please enter a salary."),
//     accountholder: Yup.string().required("Please enter an account holder name."),
//     accountnumber: Yup.string().required("Please enter an account number."),
//     bankname: Yup.string().required("Please enter a bank name."),
//     ifsc: Yup.string().required("Please enter an IFSC code."),
//     banklocation: Yup.string().required("Please enter a bank location."),
//   });

//   return (
//     <div className="add-employee p-6">
//       <Formik
//         initialValues={initialValues}
//         // validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         {({
//           isSubmitting,
//           resetForm,
//           values,
//           setFieldValue,
//           handleSubmit,
//           setFieldTouched,
//         }) => (
//           <Form
//             className="space-y-4"
//             onSubmit={handleSubmit}
//             onFinishFailed={onFinishFailed}
//           >
//             <h1 className="text-lg font-bold mb-4">Personal Details</h1>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="">First Name</label>
//                   <Field name="firstName" as={Input} placeholder="John" className="mt-1" />
//                   <ErrorMessage name="firstName" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Last Name</label>
//                   <Field name="lastName" as={Input} placeholder="Doe" className="mt-1" />
//                   <ErrorMessage name="lastName" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Username</label>
//                   <Field name="username" as={Input} placeholder="john_doe" className="mt-1" />
//                   <ErrorMessage name="username" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Password</label>
//                   <Field name="password" as={Input.Password} placeholder="Strong Password" className="mt-1" />
//                   <ErrorMessage name="password" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Email</label>
//                   <Field name="email" as={Input} placeholder="johndoe@example.com" className="mt-1" />
//                   <ErrorMessage name="email" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//               <Col span={12} className="mt-2">
//   <div className="form-item">
//     <label className="font-semibold">Phone</label>
//     <div className="flex">
//       <Select
//         style={{ width: '30%', marginRight: '8px' }}
//         placeholder="Code"
//         name="phoneCode"
//         onChange={(value) => setFieldValue('phoneCode', value)}
//       >
//         {countries.map((country) => (
//           <Option key={country.id} value={country.phoneCode}>
//             (+{country.phoneCode})
//           </Option>
//         ))}
//       </Select>
//       <Field name="phone">
//         {({ field }) => (
//           <Input
//             {...field}  
//             type="string"
//             style={{ width: '70%' }}
//             placeholder="Enter phone number"
//             onKeyPress={(e) => {
//               // Allow only numbers
//               if (!/[0-9]/.test(e.key)) {
//                 e.preventDefault();
//               }
//             }}
//             // Remove spinner arrows
//             className="hide-number-spinner"
//           />
//         )}
//       </Field>
//     </div>
//     <ErrorMessage
//       name="phone"
//       component="div"
//       className="error-message text-red-500 my-1"
//     />
//   </div>
// </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Address</label>
//                   <Field name="address" as={Input} placeholder="Enter Address" className="mt-1" />
//                   <ErrorMessage name="address" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Joining Date</label>
//                   <Field name="joiningDate">
//                     {({ field }) => (
//                       <DatePicker
//                         className="w-full mt-1"
//                         format="DD-MM-YYYY"
//                         onChange={(date) => setFieldValue("joiningDate", date)}
//                       />
//                     )}
//                   </Field>
//                   <ErrorMessage name="joiningDate" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Leave Date</label>
//                   <Field name="leaveDate">
//                     {({ field }) => (
//                       <DatePicker
//                         className="w-full mt-1"
//                         format="DD-MM-YYYY"
//                         onChange={(date) => setFieldValue("leaveDate", date)}
//                       />
//                     )}
//                   </Field>
//                   <ErrorMessage name="leaveDate" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Department</label>
//                   <Field name="department">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         className="w-full mt-1"
//                         placeholder="Select Department"
//                         onChange={(value) => setFieldValue("department", value)}
//                       >
//                         {fnddepart.map((dept) => (
//                           <Option key={dept.id} value={dept.id}>
//                             {dept.department_name}
//                           </Option>
//                         ))}
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage name="department" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Designation</label>
//                   <Field name="designation">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         className="w-full mt-1"
//                         placeholder="Select Designation"
//                         onChange={(value) => setFieldValue("designation", value)}
//                       >
//                         {fnddesi.map((des) => (
//                           <Option key={des.id} value={des.id}>
//                             {des.designation_name}
//                           </Option>
//                         ))}
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage name="designation" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Salary</label>
//                   <Field name="salary" as={Input} placeholder="$" type="number" className="mt-1" />
//                   <ErrorMessage name="salary" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//             </Row>
//             <h1 className="text-lg font-bold mb-3 mt-4">Bank Details</h1>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Account Holder Name</label>
//                   <Field name="accountholder" as={Input} placeholder="John Doe" className="mt-1" />
//                   <ErrorMessage name="accountholder" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Account Number</label>
//                   <Field name="accountnumber" as={Input} placeholder="123456789" type="number" className="mt-1" />
//                   <ErrorMessage name="accountnumber" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Bank Name</label>
//                   <Field name="bankname" as={Input} placeholder="Bank Name" className="mt-1" />
//                   <ErrorMessage name="bankname" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">IFSC</label>
//                   <Field name="ifsc" as={Input} placeholder="IFSC" className="mt-1" />
//                   <ErrorMessage name="ifsc" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Bank Location</label>
//                   <Field name="banklocation" as={Input} placeholder="Bank Location" className="mt-1" />
//                   <ErrorMessage name="banklocation" component="div" className="text-red-500" />
//                 </div>
//               </Col>
//             </Row>
//             <div className="text-right mt-4">
//               <Button type="default" className="mr-2" onClick={() => onClose()}>
//                 Cancel
//               </Button>
//               <Button 
//                 type="primary" 
//                 htmlType="submit"
//                 loading={isSubmitting}
//               >
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//       <Modal
//         title="Verify OTP"
//         visible={showOtpModal}
//         onCancel={onCloseOtpModal}
//         footer={null}
//         centered
//       >
//         <div className="p-4 rounded-lg bg-white">
//           <h2 className="text-xl font-semibold mb-4">OTP Page</h2>
//           <p>
//             An OTP has been sent to your registered email. Please enter the OTP
//             below to verify your account.
//           </p>
//           <Input
//             type="number"
//             placeholder="Enter OTP"
//             className="mt-4 p-3 border border-gray-300 rounded-md"
//             style={{ width: "100%" }}
//             onChange={(e) => setOtp(e.target.value)}
//           />
//           <div className="mt-4">
//             <Button type="primary" className="w-full" onClick={handleOtpVerify}>
//               Verify OTP
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default AddEmployee;













import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { addEmp, empdata } from "./EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
import { getDes } from "../Designation/DesignationReducers/DesignationSlice";
import { getallcountries } from "../../setting/countries/countriesreducer/countriesSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";

const { Option } = Select;

const AddEmployee = ({ onClose, setSub }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [otp, setOtp] = useState("");

  const departmentData = useSelector((state) => state.Department?.Department?.data || []);
  const designationData = useSelector((state) => state.Designation?.Designation?.data || []);

  const loggedusername = useSelector((state)=>state.user.loggedInUser.username);

  const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
  const fndbranchdata = branchData.filter((item) => item.created_by === loggedusername);


  const fnddepart =  departmentData.filter((item)=>item.created_by === loggedusername);
  const fnddesi = designationData.filter((item)=>item.created_by === loggedusername);

  // console.log("fnddepart", fnddesi);


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


  useEffect(() => {
    dispatch(getDept());
    dispatch(getDes());
    dispatch(getBranch());
  }, [dispatch]);

  const otpapi = async (otp) => {
    try {
      const res = await axios.post(
        "http://localhost:5353/api/v1/auth/verify-signup",
        { otp },
        {
          headers: {
            Authorization: `Bearer ${otpToken}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };
  const handleOtpVerify = async () => {
    if (!otp || otp.length !== 6) {
      message.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await otpapi(otp);
      if (response.success) {
        message.success("OTP Verified Successfully");
        setShowOtpModal(false);
        dispatch(empdata());
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      message.error("Failed to verify OTP. Please try again.");
    }
  };

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      // console.log("values", values);
      const response = await dispatch(addEmp(values));
      
      if (response.payload?.data?.sessionToken) {
        setOtpToken(response.payload?.data?.sessionToken);
        setShowOtpModal(true);
      }
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to add employee. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Form submission failed:", errorInfo);
    // message.error("Please fill out all required fields.");
  };

  const onOpenOtpModal = () => {
    setShowOtpModal(true);
  };
  const onCloseOtpModal = () => {
    setShowOtpModal(false);
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    branch: "",
    joiningDate: null,
    leaveDate: null,
    department: "",
    designation: "",
    salary: "",
    accountholder: "",
    accountnumber: "",
    bankname: "",
    banklocation: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please enter a first name."),
    lastName: Yup.string().required("Please enter a last name."),
    username: Yup.string().required("Please enter a username."),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/\d/, "Password must have at least one number")
      .required("Password is required"),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Please enter an email"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits.")
      .required("Please enter a phone number."),
    address: Yup.string().required("Please enter an address."),
    branch: Yup.string().required("Please select a branch."),
    joiningDate: Yup.date().nullable().required("Joining date is required."),
    leaveDate: Yup.date().nullable().required("Leave date is required."),
    department: Yup.string().required("Please select a department."),
    designation: Yup.string().required("Please select a designation."),
    salary: Yup.string().required("Please enter a salary."),
    accountholder: Yup.string().required("Please enter an account holder name."),
    accountnumber: Yup.string().required("Please enter an account number."),
    bankname: Yup.string().required("Please enter a bank name."),
    ifsc: Yup.string().required("Please enter an IFSC code."),
    banklocation: Yup.string().required("Please enter a bank location."),
  });

  return (
    <div className="add-employee p-6">
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          isSubmitting,
          resetForm,
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
        }) => (
          <Form
            className="space-y-4"
            onSubmit={handleSubmit}
            onFinishFailed={onFinishFailed}
          >
            <h1 className="border-b-2 border-gray-300 pb-4 mt-[-35px] "></h1>
            <h1 className="text-lg font-bold mb-4">Personal Details</h1>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">First Name <span className="text-red-500">*</span></label>
                  <Field name="firstName" as={Input} placeholder="John" className="mt-1" />
                  <ErrorMessage name="firstName" component="div" className="text-red-500" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Last Name <span className="text-red-500">*</span></label>
                  <Field name="lastName" as={Input} placeholder="Doe" className="mt-1" />
                  <ErrorMessage name="lastName" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Username <span className="text-red-500">*</span></label>
                  <Field name="username" as={Input} placeholder="john_doe" className="mt-1" />
                  <ErrorMessage name="username" component="div" className="text-red-500" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                    <label className="">Password <span className="text-red-500">*</span></label>
                  <Field name="password" as={Input.Password} placeholder="Strong Password" className="mt-1" />
                  <ErrorMessage name="password" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Email <span className="text-red-500">*</span></label>
                  <Field name="email" as={Input} placeholder="johndoe@example.com" className="mt-1" />
                  <ErrorMessage name="email" component="div" className="text-red-500" />
                </div>
              </Col>
              <Col span={12} className="mt-2">
  <div className="form-item">
    <label className="">Phone <span className="text-red-500">*</span></label>
    <div className="flex">
      <Select
        style={{ width: '30%', marginRight: '8px' }}
        placeholder="Code"
        name="phoneCode"
        onChange={(value) => setFieldValue('phoneCode', value)}
      >
        {countries.map((country) => (
          <Option key={country.id} value={country.phoneCode}>
            (+{country.phoneCode})
          </Option>
        ))}
      </Select>
      <Field name="phone">
        {({ field }) => (
          <Input
            {...field}
            type="string"
            style={{ width: '70%' }}
            placeholder="Enter phone number"
            onKeyPress={(e) => {
              // Allow only numbers
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            // Remove spinner arrows
            className="hide-number-spinner"
          />
        )}
      </Field>
    </div>
    <ErrorMessage
      name="phoneNumber"
      component="div"
      className="error-message text-red-500 my-1"
    />
  </div>
</Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Address <span className="text-red-500">*</span></label>
                  <Field name="address" as={Input} placeholder="Enter Address" className="mt-1" />
                  <ErrorMessage name="address" component="div" className="text-red-500" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Joining Date <span className="text-red-500">*</span></label>
                  <Field name="joiningDate">
                    {({ field }) => (
                      <DatePicker
                        className="w-full mt-1"
                        format="DD-MM-YYYY"
                        onChange={(date) => setFieldValue("joiningDate", date)}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="joiningDate" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Leave Date <span className="text-red-500">*</span></label>
                  <Field name="leaveDate">
                    {({ field }) => (
                      <DatePicker
                        className="w-full mt-1"
                        format="DD-MM-YYYY"
                        onChange={(date) => setFieldValue("leaveDate", date)}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="leaveDate" component="div" className="text-red-500" />
                </div>
              </Col>
              
              <Col span={12}>
            <div className="form-item">
              <label className="">Branch <span className="text-red-500">*</span></label>
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
            <div className="form-item mt-2">
              <label className="">Department <span className="text-red-500">*</span></label>
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
              <label className="">Designation <span className="text-red-500">*</span></label>
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

              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibol">Salary <span className="text-red-500">*</span></label>
                  <Field name="salary" as={Input} placeholder="$" type="number" className="mt-1" />
                  <ErrorMessage name="salary" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>
            <h1 className="text-lg font-bold mb-3 mt-4">Bank Details</h1>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Account Holder Name <span className="text-red-500">*</span></label>
                  <Field name="accountholder" as={Input} placeholder="John Doe" className="mt-1" />
                  <ErrorMessage name="accountholder" component="div" className="text-red-500" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Account Number <span className="text-red-500">*</span></label>
                  <Field name="accountnumber" as={Input} placeholder="123456789" type="number" className="mt-1" />
                  <ErrorMessage name="accountnumber" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Bank Name <span className="text-red-500">*</span></label>
                  <Field name="bankname" as={Input} placeholder="Bank Name" className="mt-1" />
                  <ErrorMessage name="bankname" component="div" className="text-red-500" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="">IFSC <span className="text-red-500">*</span></label>
                  <Field name="ifsc" as={Input} placeholder="IFSC" className="mt-1" />
                  <ErrorMessage name="ifsc" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Bank Location <span className="text-red-500">*</span>  </label>
                  <Field name="banklocation" as={Input} placeholder="Bank Location" className="mt-1" />
                  <ErrorMessage name="banklocation" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>
            <div className="text-right mt-4">
              <Button type="default" className="mr-2" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <Modal
        title="Verify OTP"
        visible={showOtpModal}
        onCancel={onCloseOtpModal}
        footer={null}
        centered
      >
        <div className="p-4 rounded-lg bg-white">
          <h2 className="text-xl  mb-4">OTP Page</h2>
          <p>
            An OTP has been sent to your registered email. Please enter the OTP
            below to verify your account.
          </p>
          <Input
            type="number"
            placeholder="Enter OTP"
            className="mt-4 p-3 border border-gray-300 rounded-md"
            style={{ width: "100%" }}
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="mt-4">
            <Button type="primary" className="w-full" onClick={handleOtpVerify}>
              Verify OTP
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddEmployee;

