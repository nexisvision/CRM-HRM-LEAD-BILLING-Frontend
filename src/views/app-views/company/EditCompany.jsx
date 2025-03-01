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
const EditCompany = ({ comnyid, initialData, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const AllDepart = useSelector((state) => state.Department);
  const datadept = AllDepart.Department.data;
  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data;
  const allcom = useSelector((state) => state.ClientData);
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(ClientData());
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (allcom?.ClientData?.data) {
      const foundClient = allcom.ClientData.data.find(
        (item) => item.id === comnyid
      );
      setClientData(foundClient || null);
    }
  }, [allcom, comnyid]);

  const [initialValues, setInitialValues] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    bankname: initialData?.bankname || "",
    phone: initialData?.phone || "",
    ifsc: initialData?.ifsc || "",
    banklocation: initialData?.banklocation || "",
    accountholder: initialData?.accountholder || "",
    accountnumber: initialData?.accountnumber || "",
    gstIn: initialData?.gstIn || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    country: initialData?.country || "",
    zipcode: initialData?.zipcode || "",
    profilePic: initialData?.profilePic || "",
    address: initialData?.address || "",
    website: initialData?.website || "",
    accountType: initialData?.accountType || "",
  });

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please enter a First Name."),
    lastName: Yup.string().required("Please enter a Last Name."),
    phone: Yup.string().required("Please enter a Phone."),
    bankname: Yup.string().required("Please enter a Bankname."),
    city: Yup.string().required("Please enter a City."),
    state: Yup.string().required("Please enter a State."),
    country: Yup.string().required("Please enter a Country."),
    zipcode: Yup.string().required("Please enter a Zipcode."),
    address: Yup.string().required("Please enter an Address."),
    website: Yup.string().required("Please enter a Website."),
    accountType: Yup.string().required("Please select an Account Type"),
  });

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          if (key === 'profilePic' && typeof values[key] === 'object') {
            formData.append(key, values[key]);
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      await dispatch(Editclients({ comnyid, formData })).unwrap();
      message.success("Company updated successfully!");
      await dispatch(ClientData());
      onClose();
    } catch (error) {
      message.error(error.message || "Failed to update company");
    }
  };

  useEffect(() => {
    if (initialData) {
      setInitialValues({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        bankname: initialData.bankname || "",
        phone: initialData.phone || "",
        ifsc: initialData.ifsc || "",
        banklocation: initialData.banklocation || "",
        accountholder: initialData.accountholder || "",
        accountnumber: initialData.accountnumber || "",
        gstIn: initialData.gstIn || "",
        city: initialData.city || "",
        state: initialData.state || "",
        country: initialData.country || "",
        zipcode: initialData.zipcode || "",
        profilePic: initialData.profilePic || "",
        address: initialData.address || "",
        website: initialData.website || "",
        accountType: initialData.accountType || "",
      });
    }
  }, [initialData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
            <Row gutter={16}>
              <Col span={12} className="">
                <div className="form-item ">
                  <label className="font-semibold ">First Name <span className="text-red-500">*</span></label>
                  <Field name="firstName" as={Input} placeholder="Enter First Name" className="mt-1" />
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
                  <Field name="website" as={Input} placeholder="Enter  Website" className="mt-2" />
                  <ErrorMessage
                    name="website"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <Field name="accountType">
                    {({ field, form }) => (
                      <Select
                        {...field}
                        value={field.value || undefined}
                        onChange={(value) => form.setFieldValue('accountType', value)}
                        placeholder="Select Account Type"
                        className="w-full rounded-md"
                        style={{ width: '100%' }}
                      >
                        <Option value="current">Current</Option>
                        <Option value="saving">Saving</Option>
                        <Option value="business">Business</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="accountType"
                    component="div"
                    className="text-sm text-red-500"
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
                          form.setFieldValue('profilePic', file);
                          return false;
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