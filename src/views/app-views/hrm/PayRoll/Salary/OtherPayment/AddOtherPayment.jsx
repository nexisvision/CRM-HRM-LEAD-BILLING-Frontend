import React, { useEffect } from "react";
import { Input, Button, Col, Select, message } from "antd";
import { ErrorMessage, Field, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
// import { getallcurrencies } from "views/app-views/setting/currencies/currenciesreducer/currenciesSlice";
import { Option } from "antd/es/mentions";
import {
  addotherpay,
  getotherpay,
} from "./otherpaymentReducer/otherpaymentSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";

const AddOtherPayment = ({ id, onClose }) => {
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

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    dispatch(addotherpay(values))
      .then(() => {
        dispatch(getotherpay());
        message.success("Other payment added successfully");
        onClose();
        resetForm();
      })
      .catch((error) => {
        message.error("Something went wrong. Please try again!");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="employee-salary">
      <hr className="my-2 border-gray-300" />
      <Formik
        initialValues={{ title: "", type: "", currency: "", amount: "" }}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, setFieldValue, isSubmitting, resetForm }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Col span={24} className="mt-4">
              <div className="form-item">
                  <label className="font-semibold">Employee <span className="text-red-500">*</span></label>
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

            <div>
              <label className="font-semibold">Title <span className="text-red-500">*</span></label>
              <Field name="title">
                {({ field }) => <Input {...field} placeholder="Enter Title" />}
              </Field>
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500"
              />
            </div>

            <div>
              <label className="font-semibold">Type <span className="text-red-500">*</span></label>
              <Field name="type">
                {({ field }) => <Input {...field} placeholder="Enter Type" />}
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className="text-red-500"
              />
            </div>

            <Col span={24} className="mt-4">
              <div className="form-item">
                <label className="font-semibold">Currency <span className="text-red-500">*</span></label>
                <Field name="currency">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full mt-2"
                      placeholder="Select Currency"
                      onChange={(value) => setFieldValue("currency", value)}
                      value={values.currency}
                    >
                      {fnddatass && fnddatass.length > 0 ? (
                        fnddatass.map((client) => (
                          <Option key={client.id} value={client.id}>
                            {client.currencyCode}
                            ({client.currencyIcon})
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

            <div>
              <label className="font-semibold">Amount <span className="text-red-500">*</span> </label>
              <Field name="amount">
                {({ field }) => <Input {...field} placeholder="Enter Amount" type="number" />}
              </Field>
              <ErrorMessage
                name="amount"
                component="div"
                className="text-red-500"
              />
            </div>

            <div className="text-right">
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AddOtherPayment;
