import React from "react";
import { Input, Button, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addcus, Getcus } from "./CustomerReducer/CustomerSlice";

const AddCustomer = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    name: "",
    contact: "",
    email: "",
    taxnumber: "",
    alternatemobilenumber: "",
    billing_name: "",
    billing_phone: "",
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_country: "",
    billing_zipcode: "",
    shipping_name: "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_country: "",
    shipping_zipcode: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter a Name."),
    contact: Yup.string()
      .matches(/^\d{10}$/, "Contact number must be 10 digits.")
      .required("Please enter a Contact Number."),
    email: Yup.string()
      .email("Please enter a valid email address with @.")
      .required("please enter a email"),
    taxnumber: Yup.string().required("Please enter a Tax Number."),
    alternatemobilenumber: Yup.string().matches(
      /^\d{10}$/,
      "Alternate number must be 10 digits."
    ),
    billing_name: Yup.string().required("Please enter a Name."),
    billing_phone: Yup.string().matches(
      /^\d{10}$/,
      "Phone number must be 10 digits."
    ),
    billing_address: Yup.string().required("Please enter a Billing Address."),
    billing_city: Yup.string().required("Please enter a City."),
    billing_state: Yup.string().required("Please enter a State."),
    billing_country: Yup.string().required("Please enter a Country."),
    billing_zipcode: Yup.string().required("Please enter a Zip Code."),
    shipping_name: Yup.string().required("Please enter a Name."),
    shipping_phone: Yup.string().matches(
      /^\d{10}$/,
      "Phone number must be 10 digits."
    ),
    shipping_address: Yup.string().required("Please enter a Shipping Address."),
    shipping_city: Yup.string().required("Please enter a City."),
    shipping_state: Yup.string().required("Please enter a State."),
    shipping_country: Yup.string().required("Please enter a Country."),
    shipping_zipcode: Yup.string().required("Please enter a Zip Code."),
  });

  const onSubmit = (values, { resetForm }) => {
    const payload = {
      name: values.name,
      contact: values.contact,
      email: values.email,
      tax_number: values.taxnumber,
      alternate_number: values.alternatemobilenumber,
      billing_address: {
        street: values.billing_address,
        city: values.billing_city,
        state: values.billing_state,
        zip: values.billing_zipcode,
        country: values.billing_country,
      },
      shipping_address: {
        street: values.shipping_address,
        city: values.shipping_city,
        state: values.shipping_state,
        zip: values.shipping_zipcode,
        country: values.shipping_country,
      },
    };

    dispatch(addcus(payload));
    dispatch(Getcus());
    dispatch(Getcus());
    onClose();
    resetForm();

    console.log("Submitted values:", payload);
    message.success("Customer added successfully!");
  };

  return (
    <div className="add-job-form">
      <div className=" ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
        <h1 className="mb-4 border-b pb-4 font-medium"></h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            setFieldValue,
            handleSubmit,
            setFieldTouched,
            resetForm,
          }) => (
            <Form className="formik-form" onSubmit={handleSubmit}>
              <Row gutter={16} className="mt-4">
                <Col span={24}>
                  <h1 className="font-semibold text-lg">Basic Info</h1>
                </Col>

                <Col span={8} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Name</label>
                    <Field name="name" as={Input} placeholder="Enter Name" />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={8} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Contact</label>
                    <Field
                      name="contact"
                      as={Input}
                      placeholder="Enter Contact"
                    />

                    <ErrorMessage
                      name="contact"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={8} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Email</label>
                    <Field name="email" as={Input} placeholder="Enter Email" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={8} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Tax Number</label>
                    <Field
                      name="taxnumber"
                      as={Input}
                      placeholder="Enter Tax Number"
                    />
                    <ErrorMessage
                      name="taxnumber"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={8} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">
                      Alternate Mobile Number
                    </label>
                    <Field
                      name="alternatemobilenumber"
                      as={Input}
                      placeholder="Enter Alternate Mobile Number"
                    />

                    <ErrorMessage
                      name="alternatemobilenumber"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={24} className="mt-4">
                  <h1 className="font-semibold text-lg">Billing Address</h1>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Name</label>
                    <Field
                      name="billing_name"
                      as={Input}
                      placeholder="Enter Name"
                    />
                    <ErrorMessage
                      name="billing_name"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Phone</label>
                    <Field
                      name="billing_phone"
                      as={Input}
                      placeholder="Enter phone"
                    />

                    <ErrorMessage
                      name="billing_phone"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={24} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Address</label>
                    <Field name="billing_address">
                      {({ field }) => (
                        <ReactQuill
                          {...field}
                          value={values.billing_address}
                          onChange={(value) =>
                            setFieldValue("billing_address", value)
                          }
                          onBlur={() =>
                            setFieldTouched("billing_address", true)
                          }
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="billing_address"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">City</label>
                    <Field
                      name="billing_city"
                      as={Input}
                      placeholder="Enter City"
                    />
                    <ErrorMessage
                      name="billing_city"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">State</label>
                    <Field
                      name="billing_state"
                      as={Input}
                      placeholder="Enter State"
                    />

                    <ErrorMessage
                      name="billing_state"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Country</label>
                    <Field
                      name="billing_country"
                      as={Input}
                      placeholder="Enter Country"
                    />

                    <ErrorMessage
                      name="billing_country"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2 mb-4">
                  <div className="form-item">
                    <label className="font-semibold">Zip Code</label>
                    <Field
                      name="billing_zipcode"
                      as={Input}
                      placeholder="Enter Zip Code"
                    />

                    <ErrorMessage
                      name="billing_zipcode"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                {/* <Col span={24} className="mt-2">
                  <div className="form-buttons text-right">
                    <Button type="primary" htmlType="submit">
                      Shipping Same As Billing
                    </Button>
                  </div>
                </Col> */}

                <Col span={24}>
                  <h1 className="font-semibold mb-2 text-lg">
                    Shipping Address
                  </h1>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Name</label>
                    <Field
                      name="shipping_name"
                      as={Input}
                      placeholder="Enter Name"
                    />
                    <ErrorMessage
                      name="shipping_name"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Phone</label>
                    <Field
                      name="shipping_phone"
                      as={Input}
                      placeholder="Enter phone"
                    />

                    <ErrorMessage
                      name="shipping_phone"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={24} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Address</label>
                    <Field name="shipping_address">
                      {({ field }) => (
                        <ReactQuill
                          {...field}
                          value={values.shipping_address}
                          onChange={(value) =>
                            setFieldValue("shipping_address", value)
                          }
                          onBlur={() =>
                            setFieldTouched("shipping_address", true)
                          }
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="shipping_address"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">City</label>
                    <Field
                      name="shipping_city"
                      as={Input}
                      placeholder="Enter City"
                    />

                    <ErrorMessage
                      name="shipping_city"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">State</label>
                    <Field
                      name="shipping_state"
                      as={Input}
                      placeholder="Enter State"
                    />

                    <ErrorMessage
                      name="shipping_state"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Country</label>
                    <Field
                      name="shipping_country"
                      as={Input}
                      placeholder="Enter Country"
                    />

                    <ErrorMessage
                      name="shipping_country"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Zip Code</label>
                    <Field
                      name="shipping_zipcode"
                      as={Input}
                      placeholder="Enter Zip Code"
                    />

                    <ErrorMessage
                      name="shipping_zipcode"
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
    </div>
  );
};

export default AddCustomer;
