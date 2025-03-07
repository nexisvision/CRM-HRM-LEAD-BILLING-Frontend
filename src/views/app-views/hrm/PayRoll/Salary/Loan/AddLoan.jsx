import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input, Select, Button, Col, message } from "antd";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { useSelector } from "react-redux";
// import { getallcurrencies } from "views/app-views/setting/currencies/currenciesreducer/currenciesSlice";
import { useDispatch } from "react-redux";
import { addloans, getloans } from "./loanReducer/loanSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import * as Yup from 'yup';

const { Option } = Select;

const validationSchema = Yup.object().shape({
  employeeId: Yup.string()
    .required('Employee is required'),
  title: Yup.string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(50, 'Title must not exceed 50 characters'),
  loanOption: Yup.string()
    .required('Loan option is required'),
  type: Yup.string()
    .required('Type is required'),
  currency: Yup.string()
    .required('Currency is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(1, 'Amount must be greater than 0'),
  reason: Yup.string()
    .required('Reason is required')
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must not exceed 500 characters'),
});

const AddLoan = ({ id, onClose }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(empdata());
  }, []);

  const alldataemp = useSelector((state) => state.employee);
  const fnddata = alldataemp.employee?.data || [];
  const filteredEmployees = fnddata?.filter((employee) => employee.id === id);
  useEffect(() => {
    dispatch(getcurren());
  }, []);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const handleSubmit = (values, { resetForm }) => {
    dispatch(addloans(values)).then(() => {
      dispatch(getloans());
      message.success("loans added successfully");
      onClose();
      resetForm();
    });
  };
  return (
    <div className="employee-salary">
      <h2 className="mb-3 border-b pb-1 font-medium"></h2>
      <Formik
        initialValues={{
          title: "",
          loanOption: "",
          type: "",
          currency: "",
          amount: "",
          reason: "",
          employeeId: id || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit} 
      >
        {({ values, setFieldValue, resetForm }) => (
          <Form className="space-y-4">
            {/* title */}

            <Col span={24} className="mt-4">
              <div className="form-item">
                <label className="font-semibold">employee <span className="text-red-500">*</span></label>
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
            {/* Salary */}
            <div>
              <label className="font-semibold">LoanOption <span className="text-red-500">*</span></label>
              <Field name="loanOption">
                {({ field }) => (
                  <Input {...field} placeholder="Enter LoanOption" />
                )}
              </Field>
              <ErrorMessage
                name="loanOption"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* Account */}
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
                <label className="font-semibold">currency <span className="text-red-500">*</span></label>
                <Field name="currency">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full mt-2"
                      placeholder="Select AddProjectMember"
                      onChange={(value) => setFieldValue("currency", value)}
                      value={values.currency}
                    >
                      {fnddatass && fnddatass?.length > 0 ? (
                        fnddatass?.map((client) => (
                          <Option key={client.id} value={client?.id}>
                             {client?.currencyCode}
                             ({client?.currencyIcon})
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
                <ErrorMessage
                  name="currency"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>

            <div>
                <label className="font-semibold">Amount <span className="text-red-500">*</span></label>
              <Field name="amount">
                {({ field }) => <Input {...field} placeholder="Enter Amount" type="number" />}
              </Field>
              <ErrorMessage
                name="amount"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label className="font-semibold">Reason <span className="text-red-500">*</span></label>
              <Field name="reason">
                {({ field }) => <Input {...field} placeholder="Enter Reason" />}
              </Field>
              <ErrorMessage
                name="reason"
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
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default AddLoan;
