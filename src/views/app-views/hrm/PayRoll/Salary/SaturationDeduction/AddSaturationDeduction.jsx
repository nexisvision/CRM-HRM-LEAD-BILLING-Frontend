import React, { useEffect } from "react";
import { Input, Button, Col, message, Select } from "antd";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { Option } from "antd/es/mentions";
import { adddeducati, getdeducati } from "./deducationReducer/deducationSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";

const validationSchema = Yup.object().shape({
  employeeId: Yup.string()
    .required('Employee is required'),
  title: Yup.string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(50, 'Title must not exceed 50 characters'),
  type: Yup.string()
    .required('Type is required')
    .min(2, 'Type must be at least 2 characters'),
  deductionOption: Yup.string()
    .required('Deduction Option is required'),
  currency: Yup.string()
    .required('Currency is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .typeError('Amount must be a number'),
});

const AddSaturationDeduction = ({ id, onClose }) => {
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
    dispatch(adddeducati(values))
      .then(() => {
        dispatch(getdeducati());
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
  <div className="mb-2 border-b pb-[-10px] font-medium"></div>
      <Formik
        initialValues={{
          title: "",
          type: "",
          deductionOption: "",
          currency: "",
          amount: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, resetForm, setFieldValue, values }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}

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
                        filteredEmployees.map((client) => (
                          <Option key={client.id} value={client.id}>
                            {client.firstName ||
                              client.username ||
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
              <label className="font-semibold">Title <span className="text-red-500">*</span>    </label>
              <Field name="title">
                {({ field }) => <Input {...field} placeholder="Enter Title" />}
              </Field>
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* Type */}
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
            {/* Deduction Option */}
            <div>
              <label className="font-semibold">Deduction Option <span className="text-red-500">*</span></label>
              <Field name="deductionOption">
                {({ field }) => (
                  <Input {...field} placeholder="Enter Deduction Option" />
                )}
              </Field>
              <ErrorMessage
                name="deductionOption"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* Currency */}
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

            {/* Amount */}
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
            {/* Submit Button */}
            <div className="text-right">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};
export default AddSaturationDeduction;
