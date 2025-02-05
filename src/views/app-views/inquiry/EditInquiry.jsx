import React, { useEffect, useState } from "react";
import { Input, Button, Row, Col, message } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { editinqu, getinqu } from "./inquiryReducer/inquirySlice";

const EditInquiry = ({ idd, onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getinqu());
  }, []);

  const allbranch = useSelector((state) => state.inquiry);
  const fndbranch = allbranch.inquiry.data;

  useEffect(() => {
    if (fndbranch) {
      const ffd = fndbranch.find((item) => item.id === idd);
      setInitialValues({
        name: ffd.name,
        email: ffd.email,
        phone: ffd.phone,
        subject: ffd.subject,
        message: ffd.message,
      });
    }
  }, [fndbranch]);

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter a Name."),
    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter an Email."),
    phone: Yup.string().required("Please enter a Phone number."),
    subject: Yup.string().required("Please enter a Subject."),
    message: Yup.string().required("Please enter a Message."),
  });

  // onSubmit function
  const onSubmit = (values, { resetForm }) => {
    dispatch(editinqu({ idd, values })).then(() => {
      dispatch(getinqu());
      // message.success("Inquiry submitted successfully");
      onClose();
      resetForm();
    });
  };

  return (
    <div>
      <hr style={{ marginBottom: "15px", border: "1px solid #E8E8E8" }} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, handleSubmit }) => (
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
                <div>
                  <label>Name</label>
                  <Field
                    name="name"
                    as={Input}
                    placeholder="Enter Name"
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label>Email</label>
                  <Field
                    name="email"
                    as={Input}
                    placeholder="Enter Email"
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-2">
                  <label>Phone</label>
                  <Field
                    name="phone"
                    as={Input}
                    placeholder="Enter Phone"
                    type="number"
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="w-full">
                  <label className="block p-2">Subject</label>
                  <Field
                    name="subject"
                    as={Input}
                    placeholder="Enter Subject"
                  />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24}>
                <div className="mt-4 w-full">
                  <label className="block p-2">Message</label>
                  <Field
                    name="message"
                    as={Input.TextArea}
                    placeholder="Enter Message"
                  />
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

export default EditInquiry;
