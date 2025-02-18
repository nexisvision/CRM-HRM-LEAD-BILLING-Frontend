import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  TimePicker,
  Upload,
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
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;
const { EditClient, ClientData } = CompanyService;
const EditCompany = ({ comnyid, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const AllDepart = useSelector((state) => state.Department);
  const datadept = AllDepart.Department.data;
  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data;
  const allcom = useSelector((state) => state.ClientData);
  const fndcom = allcom.ClientData?.data;


  useEffect(() => {
    if (fndcom) {
      const ffd = fndcom.find((item) => item.id === comnyid);
      // console.log("Editing client with ID:", ffd);
      setInitialValues({
        firstName: ffd.username,
        email: ffd.email,
        profilePic: ffd.profilePic,
      });
    }
  }, [fndcom]);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    bankname: "",
    phone: "",
    ifsc: "",
    // email: "",
    banklocation: "",
    accountholder: "",
    accountnumber: "",
    // e_signature: "",
    gstIn: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    profilePic: "",
    address: "",
    website: "",
  });
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please enter a First Name."),
    // email: Yup.string().required("Please enter a Email."),
    phone: Yup.string().required("Please enter a Phone."),
    lastName: Yup.string().required("Please enter a Last Name."),
    bankname: Yup.string().required("Please enter a Bankname."),
    ifsc: Yup.string().optional("Please enter a Ifsc."),
    banklocation: Yup.string().optional("Please enter a Banklocation."),
    accountholder: Yup.string().optional("Please enter a Accountholder."),
    accountnumber: Yup.string().optional("Please enter a Accountnumber."),
    // e_signature: Yup.string().required("Please enter a Signature."),
    gstIn: Yup.string().optional("Please enter a GstIn."),
    city: Yup.string().required("Please enter a City."),
    state: Yup.string().required("Please enter a State."),
    country: Yup.string().required("Please enter a Country."),
    zipcode: Yup.string().required("Please enter a Zipcode."),
    address: Yup.string().required("Please enter an Address."),
    website: Yup.string().required("Please enter a Website."),
  });
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Append all form fields to FormData
      for (const key in values) {
        formData.append(key, values[key]);
      }

      // console.log("Editing client with ID:", comnyid);
      const response = await dispatch(Editclients({ comnyid, formData })).unwrap();
      console.log("Company Data Updated Successfully:", formData);
      // message.success("Client data updated successfully!");
      onClose(); // Close the form after successful submission
      await dispatch(ClientData()); // Refresh the client data
    } catch (error) {
      // console.error("Error updating client data:", error.message);
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
              <Col span={12} className="">
                <div className="form-item ">
                  <label className="font-semibold ">First Name <span className="text-red-500">*</span></label>
                  <Field name="firstName" as={Input} placeholder="Enter First Name" className="mt-1"/>
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="">
                <div className="form-item">
                  <label className="font-semibold">Last Name <span className="text-red-500">*</span></label>
                  <Field name="lastName" as={Input} placeholder="Enter Last Name" className="mt-1" />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Email <span className="text-red-500">*</span></label>
                  <Field name="email" as={Input} placeholder="Enter Email" className="mt-1" />
                  <ErrorMessage
  
                    name="email"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Phone <span className="text-red-500">*</span></label>
                  <Field name="phone" as={Input} placeholder="Enter Phone" className="mt-1" />
                  <ErrorMessage


                    name="phone"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Bank Name <span className="text-red-500">*</span></label>
                  <Field name="bankname" as={Input} placeholder="Enter  Bank Name" className="mt-1" />
                  <ErrorMessage
                    name="bankname"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Ifsc <span className="text-red-500">*</span></label>
                  <Field name="ifsc" as={Input} placeholder="Enter  Ifsc" type="string" className="mt-1" />
                  <ErrorMessage
                    name="ifsc"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Bank Location <span className="text-red-500">*</span></label>
                  <Field name="banklocation" as={Input} placeholder="Enter  Bank Location" className="mt-1" />
                  <ErrorMessage
                    name="banklocation"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Account Holder <span className="text-red-500">*</span></label>
                  <Field name="accountholder" as={Input} placeholder="Enter  Account Holder" className="mt-1" />
                  <ErrorMessage
                    name="accountholder"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Account Number <span className="text-red-500">*</span></label>
                  <Field name="accountnumber" as={Input} placeholder="Enter  Account Number" type="number" className="mt-1" />
                  <ErrorMessage
                    name="accountnumber"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Signature</label>
                  <Field name="e_signature" as={Input} placeholder="Enter  Signature" />
                  <ErrorMessage
                    name="e_signature"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">GstIn <span className="text-red-500">*</span></label>
                  <Field name="gstIn" as={Input} placeholder="Enter  GstIn" className="mt-1" />
                  <ErrorMessage
                    name="gstIn"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">City <span className="text-red-500">*</span></label>
                  <Field name="city" as={Input} placeholder="Enter  City" className="mt-1" />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">State <span className="text-red-500">*</span></label>
                  <Field name="state" as={Input} placeholder="Enter  State" className="mt-1" />
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Country <span className="text-red-500">*</span></label>
                  <Field name="country" as={Input} placeholder="Enter  Country" className="mt-1" />
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Zipcode <span className="text-red-500">*</span></label>
                  <Field name="zipcode" as={Input} placeholder="Enter  Zipcode" type="string" className="mt-1" />
                  <ErrorMessage
                    name="zipcode"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Address <span className="text-red-500">*</span></label>
                  <Field name="address" as={Input} placeholder="Enter  address" className="mt-1" />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold ">Website <span className="text-red-500">*</span></label>
                        <Field name="website" as={Input} placeholder="Enter  Website" className="mt-1"  />
                      <ErrorMessage
                        name="website"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
              <Col span={12} className="mt-3">
                <div className="flex flex-col gap-3">
                  <label className="font-semibold text-gray-700">Profile Picture <span className="text-red-500">*</span></label>
                  <Field name="profilePic">
                    {({ field, form }) => (
                      <Upload
                        accept="image/*"
                        beforeUpload={(file) => {
                          form.setFieldValue('profilePic', file); // Set the uploaded file in Formik state
                          return false; // Prevent automatic upload
                        }}
                        showUploadList={true}
                      >
                        <Button icon={<UploadOutlined />} className="flex items-center gap-2">
                          Upload Profile Picture
                        </Button>
                      </Upload>
                    )}
                  </Field>
                  <ErrorMessage
                    name="profilePic"
                    component="div"
                    className="text-red-500 text-sm"
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