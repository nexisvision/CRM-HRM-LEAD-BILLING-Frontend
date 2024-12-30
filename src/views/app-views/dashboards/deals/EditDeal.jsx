import React, { useEffect, useState } from "react";
import { Input, Button, Select, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { EditDeals, GetDeals } from "./DealReducers/DealSlice";

const { Option } = Select;

const EditDeal = ({ onClose, id }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = useState({
    dealName: "",
    phoneNumber: "",
    price: "",
    clients: "",
  });

  const allempdata = useSelector((state) => state.Deals);
  const datac = allempdata.Deals.data;

  const tabledata = useSelector((state) => state?.SubClient);
  const clientdata = tabledata?.SubClient?.data;

  useEffect(() => {
    // Check if the deal data exists for the given `id`
    const dealData = datac.find((item) => item.id === id);
    if (dealData) {
      setInitialValues({
        dealName: dealData.dealName || "",
        phoneNumber: dealData.phoneNumber || "",
        price: dealData.price || "",
        clients: dealData.clients || "",
      });
    }
  }, [id, datac]);

  const validationSchema = Yup.object({
    dealName: Yup.string().optional("Please enter a Deal Name."),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "telephone number must be exactly 10 digits")
      .nullable(),
    price: Yup.string().optional("Please enter a Price."),
    clients: Yup.string().required("Please select clients."),
  });

  const onSubmit = (values) => {
    dispatch(EditDeals({ id, values }))
      .then(() => {
        dispatch(GetDeals());
        message.success("Deal updated successfully!");
        onClose();
      })
      .catch((error) => {
        message.error("Failed to update Employee.");
        console.error("Edit API error:", error);
      });
  };

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true} // Allow Formik to reset the initialValues when they change
        onSubmit={onSubmit}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          handleChange,
          setFieldTouched,
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
                        {...field}
                        style={{ width: "100%" }}
                        placeholder="Select User"
                        loading={!clientdata}
                        value={values.clients} // Ensure this matches the `clients` field
                        onChange={(value) => setFieldValue("clients", value)} // Update `clients` in Formik
                        onBlur={() => setFieldTouched("clients", true)}
                      >
                        {clientdata && clientdata.length > 0 ? (
                          clientdata.map((employee) => (
                            <Option key={employee.id} value={employee.id}>
                              {employee.firstName ||
                                employee.username ||
                                "Unnamed User"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Users Available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>

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
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditDeal;
