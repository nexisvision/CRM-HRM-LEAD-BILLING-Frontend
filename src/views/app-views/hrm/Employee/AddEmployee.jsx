import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { addEmp, empdata } from "./EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
import { getDes } from "../Designation/DesignationReducers/DesignationSlice";
import { getallcountries } from "../../setting/countries/countriesreducer/countriesSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";
import AddBranch from "../../hrm/Branch/AddBranch";
import { PlusOutlined } from "@ant-design/icons";
import AddDepartment from "../Department/AddDepartment";
import AddDesignation from "../Designation/AddDesignation";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";

import { env } from "configs/EnvironmentConfig";
import { AddSalaryss } from "../PayRoll/Salary/SalaryReducers/SalarySlice";
import AddCountries from "views/app-views/setting/countries/AddCountries";

const { Option } = Select;

const AddEmployee = ({ onClose, setSub, initialData = {} }) => {
  const dispatch = useDispatch();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [otp, setOtp] = useState("");
  const [salary, setSalary] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [formValues2, setFormValues2] = useState({});
  const departmentData = useSelector(
    (state) => state.Department?.Department?.data || []
  );
  const designationData = useSelector(
    (state) => state.Designation?.Designation?.data || []
  );
  const loggedusername = useSelector(
    (state) => state.user.loggedInUser.username
  );
  const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
  const fndbranchdata = branchData.filter(
    (item) => item.created_by === loggedusername
  );
  const fnddepart = departmentData.filter(
    (item) => item.created_by === loggedusername
  );
  const fnddesi = designationData.filter(
    (item) => item.created_by === loggedusername
  );
  const [selectedBranch, setSelectedBranch] = useState(null);
  const filteredDepartments = fnddepart.filter(
    (dept) => dept.branch === selectedBranch
  );
  const filteredDesignations = fnddesi.filter(
    (des) => des.branch === selectedBranch
  );
  const countries = useSelector((state) => state.countries.countries);
  const { currencies } = useSelector((state) => state.currencies);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);
  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] =
    useState(false);

  const getInitialCountry = () => {
    if (countries?.length > 0) {
      const indiaCode = countries.find((c) => c.countryCode === "IN");
      return indiaCode?.phoneCode || "+91";
    }
    return "+91";
  };

  const generatePassword = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    const randomNum = Math.floor(Math.random() * 10).toString();
    password = password.slice(0, 7) + randomNum;

    return password;
  };
  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(getDept());
  //   dispatch(getDes());
  //   dispatch(getBranch());
  // }, [dispatch]);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  const otpapi = async (otp) => {
    try {
      const res = await axios.post(
        ` ${env.API_ENDPOINT_URL}/auth/verify-signup`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${otpToken}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };
  const handleOtpVerify = async () => {
    if (!otp || otp.length !== 6) {
      message.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await otpapi(otp);
      if (response.success) {
        message.success("OTP Verified Successfully");
        setShowOtpModal(false);
        dispatch(empdata());
        onClose();

        if (salary) {
          const payloadss = {
            ...formValues2,
            employeeId: response.data.user.id,
          };
          await dispatch(AddSalaryss(payloadss));
          onClose();
        }
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      message.error("Failed to verify OTP. Please try again.");
    }
  };

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 15) {
      setFieldValue("phone", value);
    }
  };

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      setFormValues2(values);
      const updatedFormValues = { ...values };

      const response = await dispatch(addEmp(updatedFormValues));

      if (response.payload?.data?.sessionToken) {
        setOtpToken(response.payload?.data?.sessionToken);
        setShowOtpModal(true);
      }

      if (response.payload?.data?.employeeId) {
        updatedFormValues.employeeId = response.payload.data.employeeId;
        setFormValues(updatedFormValues);

        if (!response.payload?.data?.sessionToken) {
          resetForm();
          onClose();
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to add employee. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Form submission failed:", errorInfo);
  };

  const onCloseOtpModal = () => {
    setShowOtpModal(false);
  };

  const initialValues = {
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    username: "",
    phoneCode: getInitialCountry(),
    password: "",
    email: initialData.email || "",
    phone: "",
    address: "",
    branch: "",
    joiningDate: null,
    leaveDate: null,
    department: "",
    designation: "",
    salary: "",
    accountholder: "",
    accountnumber: "",
    bankname: "",
    banklocation: "",
    payroll: "",
    bankAccount: "",
    netSalary: "",
    status: "",
    currency: "",
  };

  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);

  const openAddBranchModal = () => {
    setIsAddBranchModalVisible(true);
  };

  const closeAddBranchModal = () => {
    setIsAddBranchModalVisible(false);
    dispatch(getBranch());
  };

  const [isAddDepartmentModalVisible, setIsAddDepartmentModalVisible] =
    useState(false);

  const openAddDepartmentModal = () => {
    setIsAddDepartmentModalVisible(true);
  };

  const closeAddDepartmentModal = () => {
    setIsAddDepartmentModalVisible(false);
    dispatch(getDept());
  };

  const [isAddDesignationModalVisible, setIsAddDesignationModalVisible] =
    useState(false);

  const openAddDesignationModal = () => {
    setIsAddDesignationModalVisible(true);
  };

  const closeAddDesignationModal = () => {
    setIsAddDesignationModalVisible(false);
    dispatch(getDes());
  };

  return (
    <div className="add-employee">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({
          isSubmitting,
          resetForm,
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
        }) => (
          <Form
            className="space-y-6"
            onSubmit={handleSubmit}
            onFinishFailed={onFinishFailed}
          >
            <div className="mb-3 border-b pb-1 font-medium">
              <h1 className="text-xl font-bold text-gray-800">Personal Details</h1>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="firstName"
                    as={Input}
                    placeholder="John"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="lastName"
                    as={Input}
                    placeholder="Doe"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="username"
                    as={Input}
                    placeholder="john_doe"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      as={Input.Password}
                      placeholder="Password"
                      className="w-full mt-1"
                    />
                    <Button
                      className="absolute right-5 top-1/2 border-0 bg-transparent ring-0 hover:none -translate-y-1/2 flex items-center z-10"
                      onClick={() =>
                        setFieldValue("password", generatePassword())
                      }
                    >
                      <ReloadOutlined />
                    </Button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="email"
                    as={Input}
                    placeholder="johndoe@example.com"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-0">
                    <Field name="phoneCode">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          style={{
                            width: "80px",
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderRight: 0,
                            backgroundColor: "#f8fafc",
                          }}
                          placeholder={
                            <span className="text-gray-400">+91</span>
                          }
                          onChange={(value) => {
                            if (value === "add_new") {
                              setIsAddPhoneCodeModalVisible(true);
                            } else {
                              setFieldValue("phoneCode", value);
                            }
                          }}
                          value={values.phoneCode}
                          dropdownStyle={{ minWidth: "180px" }}
                          suffixIcon={
                            <span className="text-gray-400 text-xs">▼</span>
                          }
                          dropdownRender={(menu) => (
                            <div>
                              <div
                                className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
                                onClick={() =>
                                  setIsAddPhoneCodeModalVisible(true)
                                }
                              >
                                <PlusOutlined className="mr-2" />
                                <span className="text-sm">Add New</span>
                              </div>
                              {menu}
                            </div>
                          )}
                        >
                          {countries?.map((country) => (
                            <Option key={country.id} value={country.phoneCode}>
                              <div className="flex items-center w-full px-1">
                                <span className="text-base min-w-[40px]">
                                  {country.phoneCode}
                                </span>
                                <span className="text-gray-600 text-sm ml-3">
                                  {country.countryName}
                                </span>
                                <span className="text-gray-400 text-xs ml-auto">
                                  {country.countryCode}
                                </span>
                              </div>
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                    <Field name="phone">
                      {({ field }) => (
                        <Input
                          {...field}
                          className="w-full mt-1"
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderLeft: "1px solid #d9d9d9",
                            width: "calc(100% - 80px)",
                          }}
                          type="number"
                          placeholder="Enter phone number"
                          onChange={(e) =>
                            handlePhoneNumberChange(e, setFieldValue)
                          }
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 mt-1 text-sm"
                  />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="address"
                    as={Input}
                    placeholder="Enter Address"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Joining Date <span className="text-red-500">*</span>
                  </label>
                  <Field name="joiningDate">
                    {({ field }) => (
                      <Input
                        {...field}
                        className="w-full mt-1"
                        type="date"
                        onChange={(e) => setFieldValue("joiningDate", e.target.value)}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="joiningDate"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <Field name="branch">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Branch"
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Button
                              type="link"
                              block
                              onClick={openAddBranchModal}
                            >
                              + Add New Branch
                            </Button>
                          </>
                        )}
                        onChange={(value) => {
                          setFieldValue("branch", value);
                          setFieldValue("department", "");
                          setFieldValue("designation", "");
                          setSelectedBranch(value);
                        }}
                      >
                        {fndbranchdata.map((branch) => (
                          <Option key={branch.id} value={branch.id}>
                            {branch.branchName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="branch"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <Field name="department">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Department"
                        disabled={!selectedBranch}
                        onChange={(value) => setFieldValue("department", value)}
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Button
                              type="link"
                              block
                              onClick={openAddDepartmentModal}
                            >
                              + Add New Department
                            </Button>
                          </>
                        )}
                      >
                        {filteredDepartments.map((dept) => (
                          <Option key={dept.id} value={dept.id}>
                            {dept.department_name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="department"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <Field name="designation">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Designation"
                        disabled={!selectedBranch}
                        onChange={(value) =>
                          setFieldValue("designation", value)
                        }
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Button
                              type="link"
                              block
                              onClick={openAddDesignationModal}
                            >
                              + Add New Designation
                            </Button>
                          </>
                        )}
                      >
                        {filteredDesignations.map((des) => (
                          <Option key={des.id} value={des.id}>
                            {des.designation_name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="designation"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Salary <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="salary"
                    as={Input}
                    placeholder="$"
                    type="number"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="salary"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="mb-3 border-b pb-1 font-medium">
              <h1 className="text-xl font-bold text-gray-800">Bank Details</h1>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Account Holder Name </label>
                  <Field
                    name="accountholder"
                    as={Input}
                    placeholder="John Doe"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="accountholder"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Account Number </label>
                  <Field
                    name="accountnumber"
                    as={Input}
                    placeholder="123456789"
                    type="number"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="accountnumber"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Bank Name </label>
                  <Field
                    name="bankname"
                    as={Input}
                    placeholder="Bank Name"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="bankname"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">IFSC </label>
                  <Field
                    name="ifsc"
                    as={Input}
                    placeholder="IFSC"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="ifsc"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Bank Location </label>
                  <Field
                    name="banklocation"
                    as={Input}
                    placeholder="Bank Location"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="banklocation"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="mb-3 border-b pb-1 font-medium">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Salary Details</h1>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={salary}
                    onChange={(e) => setSalary(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>
            </div>

            {salary && (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ marginBottom: "16px" }}>
                      <label className="font-semibold">Payroll Type </label>
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

                  <Col span={12}>
                    <div style={{ marginBottom: "16px" }}>
                      <label className="font-semibold">Currency </label>
                      <Field name="currency">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full mt-1"
                            placeholder="Select Currency"
                            onChange={(value) =>
                              setFieldValue("currency", value)
                            }
                          >
                            {currencies?.data?.map((currency) => (
                              <Option key={currency.id} value={currency.id}>
                                {currency.currencyCode} ({currency.currencyIcon}
                                )
                              </Option>
                            ))}
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
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ marginBottom: "16px" }}>
                      <label className="font-semibold">Net Salary </label>
                      <Field
                        name="netSalary"
                        as={Input}
                        type="string"
                        className="w-full mt-1"
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
                    <div style={{ marginBottom: "16px" }}>
                      <label className="font-semibold">Status </label>
                      <Field name="status">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full mt-1"
                            placeholder="Select Status"
                            onChange={(value) => setFieldValue("status", value)}
                          >
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                            <Option value="pending">Pending</Option>
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

                  <Col span={12}>
                    <div style={{ marginBottom: "16px" }}>
                      <label className="font-semibold">Bank Account</label>
                      <Field
                        name="bankAccount"
                        as={Input}
                        type="string"
                        className="w-full mt-1"
                        placeholder="Enter Bank Account"
                      />
                      <ErrorMessage
                        name="bankAccount"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                </Row>
              </>
            )}

            <div className="text-right">
              <Button 
                type="default" 
                className="mr-2" 
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <Modal
        title="Verify OTP"
        visible={showOtpModal}
        onCancel={onCloseOtpModal}
        footer={null}
        centered
      >
        <div className="p-4 rounded-lg bg-white">
          <h2 className="text-xl  mb-4">OTP Page</h2>
          <p>
            An OTP has been sent to your registered email. Please enter the OTP
            below to verify your account.
          </p>
          <Input
            type="number"
            placeholder="Enter OTP"
            className="mt-4 p-3 border border-gray-300 rounded-md"
            style={{ width: "100%" }}
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="mt-4">
            <Button type="primary" className="w-full" onClick={handleOtpVerify}>
              Verify OTP
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        title="Add Branch"
        visible={isAddBranchModalVisible}
        onCancel={closeAddBranchModal}
        footer={null}
        width={800}
      >
        <AddBranch onClose={closeAddBranchModal} />
      </Modal>
      <Modal
        title="Add Department"
        visible={isAddDepartmentModalVisible}
        onCancel={closeAddDepartmentModal}
        footer={null}
        width={800}
      >
        <AddDepartment onClose={closeAddDepartmentModal} />
      </Modal>
      <Modal
        title="Add Designation"
        visible={isAddDesignationModalVisible}
        onCancel={closeAddDesignationModal}
        footer={null}
        width={800}
      >
        <AddDesignation onClose={closeAddDesignationModal} />
      </Modal>
      <Modal
        title="Add New Country"
        visible={isAddPhoneCodeModalVisible}
        onCancel={() => setIsAddPhoneCodeModalVisible(false)}
        footer={null}
        width={600}
      >
        <AddCountries
          onClose={() => {
            setIsAddPhoneCodeModalVisible(false);
            dispatch(getallcountries());
          }}
        />
      </Modal>
      <style jsx global>{`
        /* Input field styling */
        .date-input {
          padding: 8px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          font-size: 14px;
          color: #333;
          background-color: #fff;
          transition: all 0.3s;
          cursor: pointer;
          height: 36px;
          width: 100%;
        }

        .date-input:hover {
          border-color: #40a9ff;
        }

        .date-input:focus {
          outline: none;
          border-color: #40a9ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        /* Calendar popup styling */
        ::-webkit-calendar-picker {
          width: 300px;
          height: 300px;
          background: white;
          border: 1px solid #d9d9d9;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }

        /* Calendar icon */
        .date-input::-webkit-calendar-picker-indicator {
          cursor: pointer;
          padding: 4px;
          margin-right: -4px;
          opacity: 0.6;
          transition: opacity 0.2s;
          width: 20px;
          height: 20px;
        }

        .date-input::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }

        /* Date text styling */
        .date-input::-webkit-datetime-edit {
          padding: 0;
          margin: 0;
        }

        .date-input::-webkit-datetime-edit-fields-wrapper {
          padding: 0;
        }

        .date-input::-webkit-datetime-edit-text,
        .date-input::-webkit-datetime-edit-month-field,
        .date-input::-webkit-datetime-edit-day-field,
        .date-input::-webkit-datetime-edit-year-field {
          color: #666;
          padding: 0 2px;
        }

        /* Selected date text color */
        .date-input:valid::-webkit-datetime-edit-text,
        .date-input:valid::-webkit-datetime-edit-month-field,
        .date-input:valid::-webkit-datetime-edit-day-field,
        .date-input:valid::-webkit-datetime-edit-year-field {
          color: #333;
        }

        /* Calendar header */
        ::-webkit-calendar-picker-header {
          background: #fafafa;
          border-bottom: 1px solid #f0f0f0;
          padding: 8px;
          font-weight: 500;
        }

        /* Calendar grid */
        ::-webkit-calendar-picker-grid {
          padding: 8px;
        }

        /* Calendar days */
        ::-webkit-calendar-picker-day-cell {
          height: 32px;
          width: 32px;
          border-radius: 4px;
          text-align: center;
          line-height: 32px;
          cursor: pointer;
        }

        ::-webkit-calendar-picker-day-cell:hover {
          background: #e6f7ff;
        }

        /* Selected day */
        ::-webkit-calendar-picker-day-cell:selected {
          background: #1890ff;
          color: white;
        }

        /* Today's date */
        ::-webkit-calendar-picker-day-cell:today {
          border: 1px solid #1890ff;
          color: #1890ff;
        }
      `}</style>
    </div>
  );
};

export default AddEmployee;
