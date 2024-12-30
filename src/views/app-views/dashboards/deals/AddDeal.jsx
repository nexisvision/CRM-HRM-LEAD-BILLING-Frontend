import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, Select, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import utils from "utils";
import OrderListData from "assets/data/order-list.data.json";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddDeals, GetDeals } from "./DealReducers/DealSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";

const { Option } = Select;

const AddDeal = ({ onClose }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const tabledata = useSelector((state) => state?.SubClient);
  const clientdata = tabledata?.SubClient?.data;

  console.log("gfgfh", clientdata);

  const initialValues = {
    dealName: "",
    phoneNumber: "",
    price: "",
    clients: "",
  };

  const validationSchema = Yup.object({
    dealName: Yup.string().optional("Please enter a Deal Name."),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "telephone number must be exactly 10 digits")
      .nullable(),
    price: Yup.string().optional("Please enter a Price."),
    clients: Yup.string().optional("Please select clients."),
  });

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddDeals(values))
      .then(() => {
        dispatch(GetDeals()); // Refresh leave data
        message.success("Deal added successfully!");
        resetForm();
        onClose(); // Close modal
      })
      .catch((error) => {
        message.error("Failed to add Leads.");
        console.error("Add API error:", error);
      });
  };
  // console.log("object",Option)

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          handleChange,
          setFieldTouched,
          resetForm,
        }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <h2 className="mb-4 border-b pb-2 font-medium"></h2>

            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Deal Name</label>
                  <Field
                    name="dealName"
                    as={Input}
                    placeholder="Enter Deal Name"
                    rules={[{ required: true }]}
                  />
                  <ErrorMessage
                    name="dealName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Phone</label>
                  <Field
                    name="phoneNumber"
                    as={Input}
                    placeholder="Enter Phone Number"
                  />

                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Price</label>
                  <Field
                    name="price"
                    as={Input}
                    placeholder="Enter Price"
                    rules={[{ required: true }]}
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Clients</label>
                  <Field name="clients">
                    {({ field }) => (
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Select Client"
                        loading={!clientdata}
                        value={values.clients} // Bind value to Formik's field
                        onChange={(value) => setFieldValue("clients", value)} // Update Formik's field value
                        onBlur={() => setFieldTouched("clients", true)} // Set touched state
                      >
                        {clientdata && clientdata.length > 0 ? (
                          clientdata.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.firstName ||
                                client.username ||
                                "Unnamed Client"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Clients Available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  {/* <Field name="user" as={Select} className='w-full' placeholder="Select User">
                                        <Option value="xyz">xyz</Option>
                                        <Option value="abc">abc</Option>
                                    </Field> */}
                  <ErrorMessage
                    name="user"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-4">
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

export default AddDeal;
