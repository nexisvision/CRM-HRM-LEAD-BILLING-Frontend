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
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
// import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
// import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";
// import { AddMeet, MeetData } from "./MeetingReducer/MeetingSlice";

const { Option } = Select;

const EditClient = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(empdata());
  // }, [dispatch]);

  // useEffect(() => {
  //   dispatch(getDept());
  // }, [dispatch]);

  const AllDepart = useSelector((state) => state.Department);
  const datadept = AllDepart.Department.data;

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data;

  const onSubmit = (values, { resetForm }) => {

  };

  const initialValues = {
    firstName: "",
    lastName: "",
    profilePic: "",
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
    firstName: Yup.string().required("Please Select a FirstName."),
    lastName: Yup.string().required("Please select an LastName."),
    profilePic: Yup.string().required("Please enter a ProfilePic."),
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
    address: Yup.string().required("Please enter a Address."),




  });

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnSubmit={true} // Ensure validation on submit
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
          isSubmitting,
          isValid,
          dirty,
        }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

            <Row gutter={16}>

              <Col span={12} className="mt-2">
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

              <Col span={12} className="mt-2">
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


              {/* <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Profile Pic</label>
                  <Field name="profilePic" as={Input} placeholder="Enter  Profile Pic" />
                  <ErrorMessage
                    name="profilePic"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}

              <Col span={12} className="mt-2">
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

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Ifsc</label>
                  <Field name="ifsc" as={Input} placeholder="Enter  Ifsc" type="number" />
                  <ErrorMessage
                    name="ifsc"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
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

              <Col span={12} className="mt-2">
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

              <Col span={12} className="mt-2">
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

              <Col span={12} className="mt-2">
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

              <Col span={12} className="mt-2">
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

              <Col span={12} className="mt-2">
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

              <Col span={12} className="mt-2">
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

              <Col span={12} className="mt-2">
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

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Zipcode</label>
                  <Field name="zipcode" as={Input} placeholder="Enter  Zipcode" type="number" />
                  <ErrorMessage
                    name="zipcode"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
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
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditClient;
