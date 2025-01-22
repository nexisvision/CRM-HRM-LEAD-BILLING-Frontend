import React, { useEffect } from "react";
import {
  Input,
  Button,
  Select,
  Radio,
  message,
  Row,
  Col,
  Upload,
  DatePicker,
} from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
// import { Addpolicys, getpolicys } from "./policyReducer/policySlice";
// import { getBranch } from "../hrm/Branch/BranchReducer/BranchSlice";
// const { Option } = Select;
const { Option } = Select;
const  AddInquiry = ({ onClose }) => {
  const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getBranch());
//   }, []);

  const allbranch = useSelector((state) => state.Branch);
  const fndbranch = allbranch.Branch.data;

//   const onSubmit = async (values, { resetForm }) => {
//     try {
//       dispatch(Addpolicys(values)).then(() => {
//         dispatch(getpolicys());
//         onClose();
//         resetForm();
//         message.success("Form submitted successfully");
//       });
//       message.success("Job application added successfully!");
//     } catch (error) {
//       console.error("Submission error:", error);
//       message.error("An error occurred while submitting the job application.");
//     }
//   };
  const initialValues = {
    branch: "",
    title: "",
    description: "",
  };
  const validationSchema = Yup.object({
    branch: Yup.string().required("Please select a Branch."),
    title: Yup.string().required("Please enter a Title."),
    description: Yup.string().required("Please enter a description."),
  });
  return (
    <div>
      <hr style={{ marginBottom: "15px", border: "1px solid #E8E8E8" }} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        // onSubmit={onSubmit}
      >
        {({
          values,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
          resetForm,
        }) => (
          <Form
            onSubmit={handleSubmit}
            style={{
              padding: "20px",
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <Row gutter={16}>
              <Col span={12} className="mb-4">
                <div className="">
                  <label>Name</label>
                  <Field name="name" as={Input} placeholder="Enter Name" className="mt-2"/>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item ">
                  <label className=" ">Email</label>
                  <Field name="email" as={Input} placeholder="Enter Email"  className="mt-2"/>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message text-red-500  my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="">Phone</label>
                  <Field name="phone" as={Input} placeholder="Enter Phone"   type="number" className="mt-2"/>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

             <Col span={12}>
              <div className=" w-full">
                <span className="block p-2">Subject</span>
                <Field name="subject" as={Input} placeholder="Enter Subject" />
                <ErrorMessage
                    name="subject"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
              </div>
              </Col>

              <Col span={24}>
              <div className="mt-4 w-full">
                <span className="block  p-2">Message</span>
                <Field name="message" as={Input} placeholder="Enter Message" />
                <ErrorMessage
                    name="message"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
              </div>
              </Col>

            </Row>
            <div style={{ textAlign: "right", marginTop: "16px" }}>
              <Button style={{ marginRight: 8 }} onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddInquiry;
