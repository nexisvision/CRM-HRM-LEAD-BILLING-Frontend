// import React, { useEffect, useState } from "react";
// import { Modal, Form, Input, Switch, Button, Row, Col } from "antd";
// import { useSelector } from "react-redux";
// import { ClientData, Editclient } from "./CompanyReducers/CompanySlice";
// import { useDispatch } from "react-redux";

// const EditCompany = ({ visible, onCancel, onUpdate, clientData,comnyid,onClose }) => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();

//   // const handleFinish = async(values) => {
//   //   await dispatch(Editclient({ comnyid, values })).unwrap();
//   //   onUpdate(values); 
//   //   form.resetFields();
//   // };

//     const handleFinish = async (values) => {
//       try {
//         await dispatch(Editclient({ comnyid, values })).unwrap();
    
//         console.log("Client Data Added Successfully:", values);
//         form.resetFields();
  
//         onClose();
    
//         await dispatch(ClientData());
    
//         form.resetFields();
    
     
//       } catch (error) {
//         console.error("Error Adding Client:", error);
//       }
//     };
   

//    const allempdata = useSelector((state) => state.ClientData);

//    const datac = allempdata.ClientData.data;
//     const [singleEmp, setSingleEmp] = useState(null);
  
//     useEffect(() => {
//       const empData = datac || [];
//       const data = empData.find((item) => item.id === comnyid);
//       setSingleEmp(data || null);
//     }, [datac, comnyid]);
  
//     useEffect(() => {
//       if (singleEmp) {
//         form.setFieldsValue({
//           ...singleEmp,
//         });
//       }
//     }, [singleEmp, form]);

//   return (
    
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleFinish}
//         initialValues={{
//           ...clientData, 
//         }}
//       >
//       <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

//         <Form.Item
//           name="username"
//           label="Name"
//           rules={[{ required: true, message: "Please enter the client name" }]}
//         >
//           <Input placeholder="Enter client Name" />
//         </Form.Item>

//         <Form.Item
//           name="email"
//           label="E-Mail Address"
//           rules={[
//             { required: true, message: "Please enter the client email" },
//             { type: "email", message: "Please enter a valid email address" },
//           ]}
//         >
//           <Input placeholder="Enter Client Email" />
//         </Form.Item>


//         <Form.Item>
//           <Row justify="end" gutter={16}>
//             <Col>
//               <Button onClick={onClose}>Cancel</Button>
//             </Col>
//             <Col>
//               <Button type="primary" htmlType="submit">
//                 Update
//               </Button>
//             </Col>
//           </Row>
//         </Form.Item>
//       </Form>

//   );
// };

// export default EditCompany;


import React, { useEffect } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  TimePicker,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { assignplan } from "./CompanyReducers/CompanyService";
import CompanyService from "./CompanyReducers/CompanyService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Editclients } from "./CompanyReducers/CompanySlice";

const { Option } = Select;
const { EditClient, ClientData } = CompanyService;

const EditCompany = ({comnyid, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const AllDepart = useSelector((state) => state.Department);
  const datadept = AllDepart.Department.data;

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data;

  const initialValues = {
    firstName: "",
    lastName: "",
    bankname: "",
    ifsc: "",
    banklocation: "",
    accountholder: "",
    accountnumber: "",
    e_signature: "",
    gstIn: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    address: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please enter a First Name."),
    lastName: Yup.string().required("Please enter a Last Name."),
    bankname: Yup.string().required("Please enter a Bankname."),
    ifsc: Yup.string().required("Please enter a Ifsc."),
    banklocation: Yup.string().required("Please enter a Banklocation."),
    accountholder: Yup.string().required("Please enter a Accountholder."),
    accountnumber: Yup.string().required("Please enter a Accountnumber."),
    e_signature: Yup.string().required("Please enter a Signature."),
    gstIn: Yup.string().required("Please enter a GstIn."),
    city: Yup.string().required("Please enter a City."),
    state: Yup.string().required("Please enter a State."),
    country: Yup.string().required("Please enter a Country."),
    zipcode: Yup.string().required("Please enter a Zipcode."),
    address: Yup.string().required("Please enter an Address."),
  });

  const handleSubmit = async (values) => {
    try {
      console.log("Editing client with ID:", comnyid);
      const response = await dispatch(Editclients({ comnyid, values })).unwrap();
      console.log("Client Data Updated Successfully:", values);
      message.success("Client data updated successfully!");
      onClose(); // Close the form after successful submission
      await dispatch(ClientData()); // Refresh the client data
    } catch (error) {
      console.error("Error updating client data:", error.message);
      message.error(error.message); // Show the error message to the user
    }
  };

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

            <Row gutter={16}>
              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">First Name</label>
                  <Field name="firstName" as={Input} placeholder="Enter First Name" />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Last Name</label>
                  <Field name="lastName" as={Input} placeholder="Enter Last Name" />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Bank Name</label>
                  <Field name="bankname" as={Input} placeholder="Enter  Bank Name" />
                  <ErrorMessage
                    name="bankname"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Ifsc</label>
                  <Field name="ifsc" as={Input} placeholder="Enter  Ifsc" type="string" />
                  <ErrorMessage
                    name="ifsc"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Bank Location</label>
                  <Field name="banklocation" as={Input} placeholder="Enter  Bank Location" />
                  <ErrorMessage
                    name="banklocation"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Account Holder</label>
                  <Field name="accountholder" as={Input} placeholder="Enter  Account Holder" />
                  <ErrorMessage
                    name="accountholder"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Account Number</label>
                  <Field name="accountnumber" as={Input} placeholder="Enter  Account Number" type="number" />
                  <ErrorMessage
                    name="accountnumber"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Signature</label>
                  <Field name="e_signature" as={Input} placeholder="Enter  Signature" />
                  <ErrorMessage
                    name="e_signature"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">GstIn</label>
                  <Field name="gstIn" as={Input} placeholder="Enter  GstIn" />
                  <ErrorMessage
                    name="gstIn"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">City</label>
                  <Field name="city" as={Input} placeholder="Enter  City" />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">State</label>
                  <Field name="state" as={Input} placeholder="Enter  State" />
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Country</label>
                  <Field name="country" as={Input} placeholder="Enter  Country" />
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Zipcode</label>
                  <Field name="zipcode" as={Input} placeholder="Enter  Zipcode" type="string" />
                  <ErrorMessage
                    name="zipcode"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Address</label>
                  <Field name="address" as={Input} placeholder="Enter  address" />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-2">
              <Button type="default" className="mr-2" onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditCompany;
