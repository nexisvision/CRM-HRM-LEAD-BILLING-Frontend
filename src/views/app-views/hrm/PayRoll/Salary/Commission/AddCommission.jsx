import React, { useEffect } from "react";
import { Button, Col, Form, Input, Select } from "antd";
import { ErrorMessage, Field, Formik } from "formik";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { useSelector } from "react-redux";
// import { getallcurrencies } from "views/app-views/setting/currencies/currenciesreducer/currenciesSlice";
import { useDispatch } from "react-redux";
import { addcommi, getcommi } from "./commistionReducer/commitionSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
const { Option } = Select;

const AddCommission = ({ id, onClose }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(empdata());
  }, []);

  const alldataemp = useSelector((state) => state.employee);
  const fnddata = alldataemp.employee.data;

  const filteredEmployees = fnddata?.filter((employee) => employee.id === id);

  useEffect(() => {
    dispatch(getcurren());
  }, []);

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
    <div className="employee-salary p-4">
      <hr className="my-2 border-gray-300" />
      <Formik
        initialValues={{ title: "", type: "", currency: "", amount: "" }}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, setFieldValue, values, resetForm }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label className="font-semibold">Title</label>
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
              <label className="font-semibold">Type</label>
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
            {/* Currency */}
            <div>
              <label className="font-semibold">Amount</label>
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
export default AddCommission;
