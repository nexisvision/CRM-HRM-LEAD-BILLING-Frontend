import React, { useEffect ,useState} from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Checkbox,
} from "antd";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AddSalaryss, getSalaryss } from "./SalaryReducers/SalarySlice";
import { useDispatch, useSelector } from "react-redux";
import { empdata } from "../../Employee/EmployeeReducers/EmployeeSlice";
import { Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { AddLable, GetLable } from "../../../dashboards/sales/LableReducer/LableSlice";
// import { getallcurrencies } from "views/app-views/setting/currencies/currenciesreducer/currenciesSlice";

const { Option } = Select;

const AddSalary = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const allempdata = useSelector((state) => state.employee);
  const fnddata = allempdata.employee.data;

  const allloged = useSelector((state) => state.user.loggedInUser.username)

  const filterdata = fnddata.filter((item)=>item.created_by === allloged)

  const { currencies } = useSelector((state) => state.currencies);

  useEffect(() => {
    dispatch(getcurren());
  }, []);

  // status start
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statuses, setStatuses] = useState([]);

  const AllLoggedData = useSelector((state) => state.user);

  const lid = AllLoggedData.loggedInUser.id;



  const fetchLables = async (lableType, setter) => {
    try {
      const lid = AllLoggedData.loggedInUser.id;
      const response = await dispatch(GetLable(lid));

      if (response.payload && response.payload.data) {
        const uniqueStatuses = response.payload.data
          .filter((label) => label && label.name) // Filter out invalid labels
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t.name === label.name)
          ); // Remove duplicates

        setStatuses(uniqueStatuses);
      }
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      message.error("Failed to load statuses");
    }
  };

  useEffect(() => {
    fetchLables("status", setStatuses);
  }, []);

  const handleAddNewStatus = async () => {
    if (!newStatus.trim()) {
      message.error("Please enter a status name");
      return;
    }

    try {
      const lid = AllLoggedData.loggedInUser.id;
      const payload = {
        name: newStatus.trim(),
        labelType: "status",
      };

      await dispatch(AddLable({ lid, payload }));
      message.success("Status added successfully");
      setNewStatus("");
      setIsStatusModalVisible(false);

      // Fetch updated statuses
      await fetchLables();
    } catch (error) {
      console.error("Failed to add Status:", error);
      message.error("Failed to add Status");
    }
  };

  // status end

  // const allempdatass = useSelector((state) => state.currencies);
  // const fnddatass = allempdatass?.currencies;

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddSalaryss(values)).then(() => {
      dispatch(getSalaryss());
      onClose();
      resetForm();
      message.success("salary added successfully");
    });
    console.log("Submitted values:", values);
    message.success("Job added successfully!");
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
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
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
            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">employee</label>
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
                              {client.firstName ||
                                client.username ||
                                "Unnamed employee"}
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

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Payroll Type</label>
                  <Field name="payslipType">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
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

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Currency</label>
                  <div className="flex gap-2">
                    <Field name="currency">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full"
                          placeholder="Select Currency"
                          onChange={(value) => {
                            const selectedCurrency = currencies?.data?.find(
                              (c) => c.id === value
                            );
                            form.setFieldValue(
                              "currency",
                              selectedCurrency?.currencyCode || ""
                            );
                          }}
                        >
                          {currencies?.data?.map((currency) => (
                            <Option key={currency.id} value={currency.id}>
                              {currency.currencyCode}
                            </Option>
                          )) || []}
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

              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Status</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new status"
                    value={values.status}
                    onChange={(value) => setFieldValue("status", value)}
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            className="w-full mt-2"
                            onClick={() => setIsStatusModalVisible(true)}
                          >
                            Add New Status
                          </Button>
                        </div>
                      </div>
                    )}
                  >
                    {statuses.map((status) => (
                      <Option key={status.id} value={status.name}>
                        {status.name}
                      </Option>
                    ))}
                  </Select>
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

      <Modal
        title="Add New Status"
        open={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        onOk={() => handleAddNewStatus("status", newStatus, setNewStatus, setIsStatusModalVisible)}
        okText="Add Status"
      >
        <Input
          placeholder="Enter new status name"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default AddSalary;
