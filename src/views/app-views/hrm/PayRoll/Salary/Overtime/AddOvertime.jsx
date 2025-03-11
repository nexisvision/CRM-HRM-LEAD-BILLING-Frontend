import React, { useEffect } from "react";
import { Input, Select, Col, Button, message } from "antd";
import { ErrorMessage, Field, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { addovertimess, getovertimess } from "./overtimeReducer/overtimeSlice";
const { Option } = Select;

const validationSchema = Yup.object().shape({
  employeeId: Yup.string()
    .required('Employee is required'),
  title: Yup.string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(50, 'Title must not exceed 50 characters'),
  days: Yup.number()
    .required('Days is required')
    .positive('Days must be a positive number')
    .max(31, 'Days cannot exceed 31'),
  Hours: Yup.number()
    .required('Hours is required')
    .positive('Hours must be a positive number')
    .max(24, 'Hours cannot exceed 24 per day'),
  rate: Yup.number()
    .required('Rate is required')
    .positive('Rate must be a positive number'),
});

const AddOvertime = ({ id, onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const alldataemp = useSelector((state) => state.employee);
  const fnddata = alldataemp.employee?.data || [];
  const filteredEmployees = fnddata?.filter((employee) => employee.id === id);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    dispatch(addovertimess(values))
      .then(() => {
        dispatch(getovertimess());
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
      <h2 className="mb-3 border-b pb-1 font-medium"></h2>
      <Formik
        initialValues={{
          employeeId: "",
          title: "",
          days: "",
          Hours: "",
          rate: ""
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
              <label className="font-semibold">Title <span className="text-red-500">*</span>  </label>
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
              <label className="font-semibold">Days <span className="text-red-500">*</span></label>
              <Field name="days">
                {({ field }) => <Input {...field} placeholder="Enter Days" />}
              </Field>
              <ErrorMessage
                name="days"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* Deduction Option */}
            <div>
              <label className="font-semibold">Hours <span className="text-red-500">*</span></label>
              <Field name="Hours">
                {({ field }) => <Input {...field} placeholder="Enter Hours" />}
              </Field>
              <ErrorMessage
                name="Hours"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* Currency */}
            <div>
              <label className="font-semibold">Rate <span className="text-red-500">*</span>   </label>
              <Field name="rate">
                {({ field }) => <Input {...field} placeholder="Enter Rate" type="text" />}
              </Field>
              <ErrorMessage
                name="rate"
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
export default AddOvertime;
