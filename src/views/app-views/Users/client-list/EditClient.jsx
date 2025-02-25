import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  message,
  Row,
  Col,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { ClientData, Editclient } from "./CompanyReducers/CompanySlice";
import { getDept } from "views/app-views/hrm/Department/DepartmentReducers/DepartmentSlice";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import Upload from "antd/es/upload/Upload";
import { UploadOutlined } from '@ant-design/icons';
import {  QuestionCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const EditClient = ({ comnyid, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDept());
  }, [dispatch]);

  const AllDepart = useSelector((state) => state.Department);
  const datadept = AllDepart.Department.data;

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data;

  useEffect(() => {
    dispatch(ClientData());
  }, []);

  const AllSubClient = useSelector((state) => state.SubClient);
  const fnddatas = AllSubClient.SubClient.data;

  useEffect(() => {
    const clientData = fnddatas.find((item) => item.id === comnyid);

    if (clientData) {
      setInitialValues({
        firstName: clientData.firstName || "",
        lastName: clientData.lastName || "",
        bankname: clientData.bankname || "",
        ifsc: clientData.ifsc || "",
        banklocation: clientData.banklocation || "",
        accountholder: clientData.accountholder || "",
        accountnumber: clientData.accountnumber || "",
        e_signature: clientData.e_signature || "",
        gstIn: clientData.gstIn || "",
        city: clientData.City || "",
        state: clientData.State || "",
        country: clientData.Country || "",
        zipcode: clientData.Zipcode || "",
        address: clientData.address || "",
        accountType: clientData.accountType || "",
      });
    }
  }, [fnddatas]);

  const onSubmit = async (values, { resetForm }) => {
    console.log("Submitting form with values:", values); // Debugging

    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }

    dispatch(Editclient({ comnyid, formData }))
      .then(() => {
        dispatch(ClientData());
        message.success("Client updated successfully");
        resetForm();
        onClose();
      })
      .catch((error) => {
        console.error("Error during submit:", error);
        message.error("Failed to edit client");
      });
  };

  const [initialValues,setInitialValues] =  useState({
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
    accountType: "",
  })

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("Please enter a First Name.")
      .min(2, "First Name must be at least 2 characters long."),
    lastName: Yup.string()
      .required("Please enter a Last Name.")
      .min(2, "Last Name must be at least 2 characters long."),
    bankname: Yup.string()
      .required("Please enter a Bank Name.")
      .min(3, "Bank Name must be at least 3 characters long."),
    ifsc: Yup.string()
      .required("Please enter an IFSC.")
      .matches(/^[A-Za-z]{4}\d{7}$/, "Invalid IFSC format."),
    banklocation: Yup.string()
      .required("Please enter a Bank Location.")
      .min(3, "Bank Location must be at least 3 characters long."),
    accountholder: Yup.string()
      .required("Please enter an Account Holder.")
      .min(3, "Account Holder must be at least 3 characters long."),
    accountnumber: Yup.string()
      .required("Please enter an Account Number.")
      .matches(/^\d+$/, "Account Number must be numeric."),
    e_signature: Yup.string()
      .required("Please enter a Signature."),
    gstIn: Yup.string()
      .required("Please enter a GSTIN.")
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format."),
    city: Yup.string()
      .required("Please enter a City.")
      .min(2, "City must be at least 2 characters long."),
    state: Yup.string()
      .required("Please enter a State.")
      .min(2, "State must be at least 2 characters long."),
    country: Yup.string()
      .required("Please enter a Country.")
      .min(2, "Country must be at least 2 characters long."),
    zipcode: Yup.string()
      .required("Please enter a Zipcode.")
      .matches(/^\d{5,6}$/, "Invalid Zipcode format."),
    address: Yup.string()
      .required("Please enter an Address.")
      .min(5, "Address must be at least 5 characters long."),
    accountType: Yup.string()
      .required("Please select an Account Type."),
  });

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
        validateOnSubmit={true}
      >
        {({
          values,
          handleSubmit,
          isSubmitting,
          isValid,
          dirty,
          setFieldValue,
          errors,
        }) => {
          console.log("Formik errors:", errors); // Debugging
          console.log("Is form valid?", isValid); // Debugging
          console.log("Is form dirty?", dirty); // Debugging

          return (
            <Form className="formik-form" onSubmit={handleSubmit}>
              <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
              <Row gutter={16}>
                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">First Name <span className="text-red-500">*</span></label>
                    <Field
                      name="firstName"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter First Name"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Last Name <span className="text-red-500">*</span></label>
                    <Field
                      name="lastName"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Last Name"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Bank Name <span className="text-red-500">*</span></label>
                    <Field
                      name="bankname"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Bank Name"
                    />
                    <ErrorMessage
                      name="bankname"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">IFSC <span className="text-red-500">*</span></label>
                    <Field
                      name="ifsc"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter IFSC"
                      type="string"
                    />
                    <ErrorMessage
                      name="ifsc"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Bank Location <span className="text-red-500">*</span></label>
                    <Field
                      name="banklocation"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Bank Location"
                    />
                    <ErrorMessage
                      name="banklocation"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Account Holder <span className="text-red-500">*</span></label>
                    <Field
                      name="accountholder"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Account Holder"
                    />
                    <ErrorMessage
                      name="accountholder"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Account Number <span className="text-red-500">*</span></label>
                    <Field
                      name="accountnumber"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Account Number"
                      type="number"
                    />
                    <ErrorMessage
                      name="accountnumber"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                {/* <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Signature <span className="text-red-500">*</span></label>
                    <Field
                      name="e_signature"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Signature"
                    />
                    <ErrorMessage
                      name="e_signature"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col> */}

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">GSTIN <span className="text-red-500">*</span></label>
                    <Field
                      name="gstIn"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter GSTIN"
                    />
                    <ErrorMessage
                      name="gstIn"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">City <span className="text-red-500">*</span></label>
                    <Field
                      name="city"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter City"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">State <span className="text-red-500">*</span></label>
                    <Field
                      name="state"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter State"
                    />
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Country <span className="text-red-500">*</span></label>
                    <Field
                      name="country"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Country"
                    />
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold text-gray-700">Account Type <span className="text-red-500">*</span></label>
                    <Field name="accountType">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-2"
                          placeholder="Select Account Type"
                          onChange={(value) => form.setFieldValue("accountType", value)}
                        >
                          <Option value="savings">Savings</Option>
                          <Option value="current">Current</Option>
                          <Option value="other">Other</Option>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="accountType"
                      component="div" 
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Zipcode <span className="text-red-500">*</span></label>
                    <Field
                      name="zipcode"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Zipcode"
                      type="string"
                    />
                    <ErrorMessage
                      name="zipcode"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Address <span className="text-red-500">*</span>    </label>
                    <Field
                      name="address"
                        as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Address"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                {/* <Col span={12} className="mt-4 space-y-2">
                  <div className="flex flex-col gap-3">
                    <label className="font-semibold text-gray-700">Profile Picture</label>
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
                </Col> */}

                <Col span={24} className="mt-4">
                  <span className="block font-semibold p-2">
                    Add <QuestionCircleOutlined />
                  </span>
                  <Field name="profilePic">
                    {({ field }) => (
                      <div>
                        <Upload
                          beforeUpload={(file) => {
                            setFieldValue("profilePic", file); // Set file in Formik state
                            return false; // Prevent auto upload
                          }}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
                        </Upload>
                      </div>
                    )}
                  </Field>
                </Col>
              </Row>

              <div className="form-buttons text-right mt-2">
                <Button type="default" className="mr-2" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!isValid || !dirty || isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default EditClient;
