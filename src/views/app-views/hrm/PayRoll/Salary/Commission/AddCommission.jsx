import React, { useEffect } from "react";
import { Button, Col, Input, Select } from "antd";
import { ErrorMessage, Field, Formik } from "formik";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addcommi, getcommi } from "./commistionReducer/commitionSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import * as Yup from "yup";

const { Option } = Select;

// Add validation schema
const validationSchema = Yup.object().shape({
  employeeId: Yup.string()
    .required("Please select an employee"),
  title: Yup.string()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(50, "Title must not exceed 50 characters"),
  type: Yup.string()
    .required("Type is required")
    .min(2, "Type must be at least 2 characters")
    .max(50, "Type must not exceed 50 characters"),
  currency: Yup.string()
    .required("Please select a currency"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .typeError("Amount must be a number")
});

const AddCommission = ({ id, onClose }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const alldataemp = useSelector((state) => state.employee);
  const fnddata = alldataemp.employee.data;

  const filteredEmployees = fnddata?.filter((employee) => employee.id === id);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const handleSubmit = (values, { resetForm }) => {
    dispatch(addcommi(values)).then(() => {
      dispatch(getcommi());
      onClose();
      resetForm();
    });
  };
  return (
    <div className="employee-salary">
     <h2 className="mb-3 border-b pb-1 font-medium"></h2>
      <Formik
        initialValues={{
          employeeId: "",
          title: "",
          type: "",
          currency: "",
          amount: ""
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, setFieldValue, values, resetForm, touched, errors }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Col span={24} className="mt-4">
              <div className="form-item">
                <label className="font-semibold">Employee <span className="text-red-500">*</span></label>
                <Field name="employeeId">
                  {({ field }) => (
                    <Select
                      {...field}
                      className={`w-full mt-2 ${touched.employeeId && errors.employeeId ? 'border-red-500' : ''}`}
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
                  className="error-message text-red-500 text-sm mt-1"
                />
              </div>
            </Col>
            <div>
              <label className="font-semibold">Title <span className="text-red-500">*</span></label>
              <Field name="title">
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Title"
                    className={`${touched.title && errors.title ? 'border-red-500' : ''}`}
                  />
                )}
              </Field>
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="font-semibold">Type <span className="text-red-500">*</span></label>
              <Field name="type">
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Type"
                    className={`${touched.type && errors.type ? 'border-red-500' : ''}`}
                  />
                )}
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <Col span={24} className="mt-4">
              <div className="form-item">
                <label className="font-semibold">Currency <span className="text-red-500">*</span></label>
                <Field name="currency">
                  {({ field }) => (
                    <Select
                      {...field}
                      className={`w-full mt-2 ${touched.currency && errors.currency ? 'border-red-500' : ''}`}
                      placeholder="Select Currency"
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
                          No Currency Available
                        </Option>
                      )}
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="currency"
                  component="div"
                  className="error-message text-red-500 text-sm mt-1"
                />
              </div>
            </Col>
            <div>
              <label className="font-semibold">Amount <span className="text-red-500">*</span></label>
              <Field name="amount">
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Amount"
                    type="number"
                    className={`${touched.amount && errors.amount ? 'border-red-500' : ''}`}
                  />
                )}
              </Field>
              <ErrorMessage
                name="amount"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="text-right">
              <Button type="default" className="mr-2" onClick={onClose}>
                Cancel
              </Button>
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
export default AddCommission;
