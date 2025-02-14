import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Select, Button, message, Col } from "antd";
import axios from "axios";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
// import { getallcurrencies } from "views/app-views/setting/currencies/currenciesreducer/currenciesSlice";
import { addallowan, getallowan } from "./AllowancwReducer/AllowanceSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";

const { Option } = Select;

// Validation Schema
const AllowanceSchema = Yup.object().shape({
  employeeId: Yup.string().required("Employee is required"),
  allowanceOption: Yup.string().required("Allowance option is required"),
  title: Yup.string().required("Title is required"),
  type: Yup.string().required("Type is required"),
  currency: Yup.string().required("Currency is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
});

const AddAllowance = ({ id, onClose}) => {
  const [employees, setEmployees] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata());
  }, []);

  const alldataemp = useSelector((state) => state.employee);
  const fnddata = alldataemp.employee?.data || [];

  const filteredEmployees = fnddata?.filter((employee) => employee.id === id);

  console.log("filteredEmployees",filteredEmployees);

  useEffect(() => {
    dispatch(getcurren());
  }, []);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const handleSubmit = async (values, { resetForm }) => {
    try {
      dispatch(addallowan(values)).then(() => {
        dispatch(getallowan());
        resetForm();
        onClose();
        onClose();
      });
    } catch (error) {
      message.error("Failed to add allowance");
      console.error("Error:", error);
    }
  };

  return (
    <div className="allowance">
      {/* <h3>Allowance</h3> */}
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
      <Formik
        initialValues={{
          employeeId: "",
          allowanceOption: "",
          title: "",
          type: "",
          currency: "",
          amount: "",
        }}
        validationSchema={AllowanceSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form className="formik-form">
            <Col span={24} className="mt-4">
              <div className="form-item">
                <label className="font-semibold">employee</label>
                <Field name="employeeId">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full mt-2"
                      placeholder="Select Employee"
                      onChange={(value) => setFieldValue("employeeId", value)}
                      value={values.employeeId}
                    >
                      {filteredEmployees && filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <Option key={employee.id} value={employee.id}>
                            {employee.firstName ||
                              employee.username ||
                              "Unnamed employee"}
                          </Option>
                        ))
                      ) : (
                        <Option value="" disabled>
                          No Employee Available
                        </Option>
                      )}
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="employeeId"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>

            <div className="form-group">
              <label>Allowance Option</label>
              <Select
                placeholder="Select Allowance Option"
                value={values.allowanceOption}
                onChange={(value) => setFieldValue("allowanceOption", value)}
                style={{ width: "100%" }}
              >
                <Option value="transportation">Transportation Allowance</Option>
                <Option value="education">
                  Education or Training Allowance
                </Option>
                <Option value="health">Health and Wellness Allowance</Option>
              </Select>
              {errors.allowanceOption && touched.allowanceOption && (
                <div className="error-message">{errors.allowanceOption}</div>
              )}
            </div>

            <div className="form-group">
              <label>Title</label>
              <Field
                name="title"
                type="text"
                className="form-control"
                placeholder="Title"
              />
              {errors.title && touched.title && (
                <div className="error-message">{errors.title}</div>
              )}
            </div>

            <div className="form-group">
              <label>Type</label>
              <Select
                placeholder="Select Type"
                value={values.type}
                onChange={(value) => setFieldValue("type", value)}
                style={{ width: "100%" }}
              >
                <Option value="fixed">Fixed</Option>
                <Option value="percentage">Percentage</Option>
              </Select>
              {errors.type && touched.type && (
                <div className="error-message">{errors.type}</div>
              )}
            </div>

            <Col span={24} className="mt-4">
              <div className="form-item">
                <label className="font-semibold">currency</label>
                <Field name="currency">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full mt-2"
                      placeholder="Select Currency"
                      onChange={(value) => setFieldValue("currency", value)}
                      value={values.currency}
                    >
                      {fnddatass && fnddatass?.length > 0 ? (
                        fnddatass?.map((client) => (
                          <Option key={client.id} value={client?.id}>
                            {client?.currencyIcon ||
                              client?.currencyCode ||
                              "Unnamed currency"}
                          </Option>
                        ))
                      ) : (
                        <Option value="" disabled>
                          {/* No Clients Available */}
                        </Option>
                      )}
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="currency"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>

            <div className="form-group">
              <label>Amount</label>
              <Field
                name="amount"
                type="number"
                className="form-control"
                placeholder="Amount"
              />
              {errors.amount && touched.amount && (
                <div className="error-message">{errors.amount}</div>
              )}
            </div>

            <Button type="primary" htmlType="submit" onClick={onClose}>
              Add Allowance
            </Button>
          </Form>
        )}
      </Formik>

      <style jsx>{`
        .formik-form {
          max-width: 600px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
        }
        .form-control {
          width: 100%;
          padding: 8px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
        }
        .error-message {
          color: red;
          font-size: 12px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default AddAllowance;
