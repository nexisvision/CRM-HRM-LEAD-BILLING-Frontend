import React, { useEffect } from "react";
import {
  Input,
  Button,
  Select,
  Row,
  Col,
  Badge,
} from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AddSalaryss, getSalaryss } from "./SalaryReducers/SalarySlice";
import { useDispatch, useSelector } from "react-redux";
import { empdata } from "../../Employee/EmployeeReducers/EmployeeSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";

const { Option } = Select;

const AddSalary = ({ onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const allempdata = useSelector((state) => state.employee);
  const fndddata = allempdata.employee.data;

  const user = useSelector((state) => state.user.loggedInUser.username);

  const fnddata = fndddata.filter((item) => item.created_by === user);


  const allloged = useSelector((state) => state.user.loggedInUser.username)

  const filterdata = fnddata.filter((item) => item.created_by === allloged)

  const { currencies } = useSelector((state) => state.currencies);


  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);


  const onSubmit = (values, { resetForm }) => {
    const payload = {
      ...values,
      netSalary: values.netSalary.toString(),
    };

    dispatch(AddSalaryss(payload)).then(() => {
      dispatch(getSalaryss());
      onClose();
      resetForm();
    });
  };

  const initialValues = {
    employeeId: "",
    payslipType: "",
    currency: "",
    salary: "",
    netSalary: "",
    status: "",
    bankAccount: "",
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
    <div className="add-salary">

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >

        {({
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
          resetForm,
        }) => (
          <Form
            layout="vertical"
            name="add-salary"
            className="formik-form"
            onSubmit={handleSubmit}
          >
            <div className="mb-3 border-b pb-1 font-medium"></div>
            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">employee <span className="text-red-500">*</span></label>
                  <Field name="employeeId">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        placeholder="Select AddProjectMember"
                        onChange={(value) => setFieldValue("employeeId", value)}
                        value={values.employeeId}
                        onBlur={() => setFieldTouched("employeeId", true)}
                      >
                        {filterdata && filterdata.length > 0 ? (
                          filterdata.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.username}
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
                    name="employeeId"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Payroll Type <span className="text-red-500">*</span></label>
                  <Field name="payslipType">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Payroll Type"
                        onChange={(value) =>
                          setFieldValue("payslipType", value)
                        }
                        onBlur={() => setFieldTouched("payslipType", true)}
                      >
                        <Option value="monthly">Monthly</Option>
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

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Currency <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <Field name="currency">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          placeholder="Select Currency"
                          onChange={(value) => {
                            form.setFieldValue("currency", value);
                          }}
                        >
                          {currencies?.data?.map((currency) => (
                            <Option key={currency.id} value={currency.currencyIcon}>
                              <div className="flex items-center">
                                <span className="text-lg">{currency.currencyIcon}</span>
                              </div>
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="currency"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Salary Per Month <span className="text-red-500">*</span></label>
                  <Field
                    name="salary"
                    as={Input}
                    type="text"
                    className="w-full mt-1"
                    placeholder="Enter Salary Amount"
                    onChange={(e) => {
                      const monthlySalary = e.target.value;
                      setFieldValue("salary", monthlySalary);
                      const yearlySalary = monthlySalary * 12;
                      setFieldValue("netSalary", yearlySalary);
                    }}
                  />
                  <ErrorMessage
                    name="salary"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Yearly Package <span className="text-red-500">*</span></label>
                  <Field
                    name="netSalary"
                    as={Input}
                    type="text"
                    className="w-full mt-1"
                    placeholder="Enter Yearly Pay Amount"
                    readOnly
                  />
                  <ErrorMessage
                    name="netSalary"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Status <span className="text-red-500">*</span></label>
                  <Field name="status">
                    {({ field, form }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Status"
                        onChange={(value) => setFieldValue("status", value)}
                      >
                        <Option value="paid">
                          <div className="flex items-center">
                            <Badge status="success" text="Paid" />
                          </div>
                        </Option>
                        <Option value="unpaid">
                          <div className="flex items-center">
                            <Badge status="error" text="Unpaid" />
                          </div>
                        </Option>
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

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Bank Account <span className="text-red-500">*</span></label>
                  <Field name="bankAccount">
                    {({ field }) => (
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter Bank Account"
                        onChange={(e) => setFieldValue("bankAccount", e.target.value)}
                        onBlur={() => setFieldTouched("bankAccount", true)}
                      />
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
                Create Salary
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddSalary;
