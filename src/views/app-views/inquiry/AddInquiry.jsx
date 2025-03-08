import React from "react";
import { Input, Button, Row, Col, message } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addinqu, getinqu } from "./inquiryReducer/inquirySlice";

const validationSchema = Yup.object({
  name: Yup.string().required("Please enter a Name."),
  email: Yup.string()
    .email("Invalid email address")
    .required("Please enter an Email."),
  phone: Yup.string().required("Please enter a Phone number."),
  subject: Yup.string().required("Please enter a Subject."),
  message: Yup.string().required("Please enter a Message."),
});

const AddInquiry = ({ onClose }) => {
  const dispatch = useDispatch();

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(addinqu(values)).unwrap();
      await dispatch(getinqu());
      message.success("Inquiry submitted successfully!");
      resetForm();
      onClose();
    } catch (error) {
      message.error(error.message || "Failed to submit inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-3 border-b pb-1 font-medium"></h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Name <span className="text-red-500">*</span></label>
                  <Field
                    name="name"
                    as={Input}
                    placeholder="Enter Name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Email <span className="text-red-500">*</span></label>
                  <Field
                    name="email"
                    as={Input}
                    placeholder="Enter Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Phone <span className="text-red-500">*</span></label>
                  <Field
                    name="phone"
                    as={Input}
                    placeholder="Enter Phone"
                    type="number"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Subject <span className="text-red-500">*</span></label>
                  <Field
                    name="subject"
                    as={Input}
                    placeholder="Enter Subject"
                  />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={24}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Message <span className="text-red-500">*</span></label>
                  <Field
                    name="message"
                    as={Input.TextArea}
                    placeholder="Enter Message"
                    rows={4}
                  />
                  <ErrorMessage
                    name="message"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="default"
                onClick={onClose}
                style={{ marginRight: '8px' }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
              >
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddInquiry;
