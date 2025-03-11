import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Select, Button, message, Col, Input, Row } from "antd";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { addallowan, getallowan } from "./AllowancwReducer/AllowanceSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";

const { Option } = Select;

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

const AddAllowance = ({ id, onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const alldataemp = useSelector((state) => state.employee);
  const fnddata = alldataemp.employee?.data || [];

  const filteredEmployees = fnddata?.filter((employee) => employee.id === id);


  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

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
            <div className="mb-3 border-b pb-1 font-medium"></div>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="block mb-2">Employee<span className="text-red-500">*</span></label>
                  <Field name="employeeId">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full "
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
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="block mb-2">Allowance Option <span className="text-red-500">*</span></label>
                  <Select
                    placeholder="Select Allowance Option"
                    value={values.allowanceOption}
                    className="w-full"
                    onChange={(value) => setFieldValue("allowanceOption", value)}
                  >
                    <Option value="transportation">Transportation Allowance</Option>
                    <Option value="education">Education or Training Allowance</Option>
                    <Option value="health">Health and Wellness Allowance</Option>
                  </Select>
                  {errors.allowanceOption && touched.allowanceOption && (
                    <div className="text-red-500 text-sm mt-1">{errors.allowanceOption}</div>
                  )}
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="block mb-2">Title <span className="text-red-500">*</span></label>
                  <Field name="title">
                    {({ field }) => <Input {...field} placeholder="Enter Title" />}
                  </Field>
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="block mb-2">Type <span className="text-red-500">*</span></label>
                  <Select
                    placeholder="Select Type"
                    className="w-full"
                    value={values.type}
                    onChange={(value) => setFieldValue("type", value)}
                  >
                    <Option value="fixed">Fixed</Option>
                    <Option value="percentage">Percentage</Option>
                  </Select>
                  {errors.type && touched.type && (
                    <div className="text-red-500 text-sm mt-1">{errors.type}</div>
                  )}
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="block mb-2">Currency <span className="text-red-500">*</span></label>
                  <Field name="currency">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Currency"
                        onChange={(value) => setFieldValue("currency", value)}
                        value={values.currency}
                      >
                        {fnddatass && fnddatass?.length > 0 ? (
                          fnddatass?.map((client) => (
                            <Option key={client.id} value={client?.id}>
                              {client?.currencyCode} ({client?.currencyIcon})
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
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="block mb-2">Amount <span className="text-red-500">*</span></label>
                  <Field name="amount">
                    {({ field }) => <Input {...field} placeholder="Enter Amount" type="number" />}
                  </Field>
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>
            </Row>

            <Button
              type="primary"
              htmlType="submit"
              onClick={onClose}
              className="mt-4 mb-0"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>

      <style jsx>{`
        .allowance {
          padding-bottom: 0;
        }
        .formik-form {
          margin-bottom: 0;
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
