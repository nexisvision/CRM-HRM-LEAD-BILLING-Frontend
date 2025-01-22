import React, { useEffect } from "react";
import {
  Input,
  Button,
  Select,
  message,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateSalary, getSalaryss } from "./SalaryReducers/SalarySlice";
import { useDispatch, useSelector } from "react-redux";
import { empdata } from "../../Employee/EmployeeReducers/EmployeeSlice";
import { getallcurrencies } from "views/app-views/setting/currencies/currenciesreducer/currenciesSlice";

const { Option } = Select;

const EditSalary = ({ onClose, initialData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata());
    dispatch(getallcurrencies());
  }, []);

  const allempdata = useSelector((state) => state.employee);
  const fnddata = allempdata.employee.data;

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies;

  const onSubmit = (values, { setSubmitting }) => {
    dispatch(updateSalary({ id: initialData.id, ...values })).then(() => {
      dispatch(getSalaryss());
      onClose();
      message.success("Salary updated successfully");
    });
    setSubmitting(false);
  };

  const validationSchema = Yup.object({
    employeeId: Yup.string().required("Employee ID is required"),
    payslipType: Yup.string().required("Payroll type is required"),
    currency: Yup.string().required("Currency is required"),
    salary: Yup.string().required("Salary is required"),
    netSalary: Yup.string().required("Net salary is required"),
    status: Yup.string().required("Status is required"),
    bankAccount: Yup.string().required("Bank account is required"),
  });

  return (
    <div className="edit-salary">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
      <Formik
        initialValues={initialData}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
        }) => (
          <Form
            layout="vertical"
            name="edit-salary"
            className="formik-form"
            onSubmit={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Employee</label>
                  <Field name="employeeId">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        placeholder="Select Employee"
                        onChange={(value) => setFieldValue("employeeId", value)}
                        value={values.employeeId}
                        onBlur={() => setFieldTouched("employeeId", true)}
                      >
                        {fnddata && fnddata.length > 0 ? (
                          fnddata.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.firstName || client.username || "Unnamed employee"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Employees Available
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

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Payroll Type</label>
                  <Field name="payslipType">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Payroll Type"
                        onChange={(value) => setFieldValue("payslipType", value)}
                        onBlur={() => setFieldTouched("payslipType", true)}
                      >
                        <Option value="monthly">Monthly Payslip</Option>
                        <Option value="hourly">Hourly</Option>
                        <Option value="weekly">Weekly</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="payslipType"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Currency</label>
                  <Field name="currency">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        placeholder="Select Currency"
                        onChange={(value) => setFieldValue("currency", value)}
                        value={values.currency}
                        onBlur={() => setFieldTouched("currency", true)}
                      >
                        {fnddatass && fnddatass?.length > 0 ? (
                          fnddatass?.map((client) => (
                            <Option key={client.id} value={client?.id}>
                              {client?.currencyIcon || client?.currencyCode || "Unnamed currency"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Currencies Available
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

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Salary</label>
                  <Field
                    name="salary"
                    as={Input}
                    type="string"
                    placeholder="Enter Salary Amount"
                  />
                  <ErrorMessage
                    name="salary"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Net Salary</label>
                  <Field
                    name="netSalary"
                    as={Input}
                    type="string"
                    placeholder="Enter Net Salary Amount"
                  />
                  <ErrorMessage
                    name="netSalary"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Status</label>
                  <Field name="status">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Status"
                        onChange={(value) => setFieldValue("status", value)}
                        onBlur={() => setFieldTouched("status", true)}
                      >
                        <Option value="paid">Paid</Option>
                        <Option value="unpaid">Unpaid</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Bank Account</label>
                  <Field name="bankAccount">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Bank"
                        onChange={(value) => setFieldValue("bankAccount", value)}
                        onBlur={() => setFieldTouched("bankAccount", true)}
                      >
                        <Option value="ICICI">ICICI Bank</Option>
                        <Option value="HDFC">HDFC Bank</Option>
                        <Option value="AXIS">Axis Bank</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="bankAccount"
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
                Update Salary
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditSalary;
