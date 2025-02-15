import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  message,
  Row,
  Col,
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
      });
    }
  }, [fnddatas]);

  const onSubmit = async (values, { resetForm }) => {
    // try {
    //   console.log("Form values:", values); // Debugging
    //   await dispatch(Editclient({ comnyid, values }));
    //   dispatch(ClientData());
    //   message.success("Client edited successfully");
    //   resetForm();
    //   onClose();
    // } catch (error) {
    //   console.error("Error during submit:", error);
    //   message.error("Failed to edit client");
    // }

      const formData = new FormData();
                    for (const key in values) {
                      formData.append(key, values[key]);
                    }
                
                    dispatch(Editclient({ comnyid, formData })).then(() => {
                      dispatch(ClientData());
                      message.success("Client edited successfully");
                      resetForm();
                      onClose();
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
  })

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please enter a First Name."),
    lastName: Yup.string().required("Please enter a Last Name."),
    bankname: Yup.string().required("Please enter a Bank Name."),
    ifsc: Yup.string().required("Please enter an IFSC."),
    banklocation: Yup.string().required("Please enter a Bank Location."),
    accountholder: Yup.string().required("Please enter an Account Holder."),
    accountnumber: Yup.string().required("Please enter an Account Number."),
    e_signature: Yup.string().required("Please enter a Signature."),
    gstIn: Yup.string().required("Please enter a GSTIN."),
    city: Yup.string().required("Please enter a City."),
    state: Yup.string().required("Please enter a State."),
    country: Yup.string().required("Please enter a Country."),
    zipcode: Yup.string().required("Please enter a Zipcode."),
    address: Yup.string().required("Please enter an Address."),
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
          setFieldValue
        }) => (
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

              <Col span={12} className="mt-2">
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
              </Col>

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
                disabled={!isValid || !dirty}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditClient;
