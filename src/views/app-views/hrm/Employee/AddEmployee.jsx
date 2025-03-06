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
import { useNavigate } from "react-router-dom";
import { ReloadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { addEmp, empdata } from "./EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
import { getDes } from "../Designation/DesignationReducers/DesignationSlice";
import { getallcountries } from "../../setting/countries/countriesreducer/countriesSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";
import AddBranch from '../../hrm/Branch/AddBranch';
import { PlusOutlined } from '@ant-design/icons';
import AddDepartment from '../Department/AddDepartment';
import AddDesignation from '../Designation/AddDesignation';
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { AddSalaryss } from "../PayRoll/Salary/SalaryReducers/SalarySlice";

const { Option } = Select;

const AddEmployee = ({ onClose, setSub, initialData = {} }) => {
  const dispatch = useDispatch();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [otp, setOtp] = useState("");
  const [salary, setSalary] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [formValues2, setFormValues2] = useState({});

  const departmentData = useSelector((state) => state.Department?.Department?.data || []);
  const designationData = useSelector((state) => state.Designation?.Designation?.data || []);

  const loggedusername = useSelector((state) => state.user.loggedInUser.username);

  const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
  const fndbranchdata = branchData.filter((item) => item.created_by === loggedusername);

  const fnddepart = departmentData.filter((item) => item.created_by === loggedusername);
  const fnddesi = designationData.filter((item) => item.created_by === loggedusername);

  const [selectedBranch, setSelectedBranch] = useState(null);

  const filteredDepartments = fnddepart.filter((dept) => dept.branch === selectedBranch);
  const filteredDesignations = fnddesi.filter((des) => des.branch === selectedBranch);

  const countries = useSelector((state) => state.countries.countries);

  const { currencies } = useSelector((state) => state.currencies);

  const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    const randomNum = Math.floor(Math.random() * 10).toString();
    password = password.slice(0, 7) + randomNum;

    return password;
  };
  useEffect(() => {
    dispatch(empdata())
  }, [dispatch])

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDept());
    dispatch(getDes());
    dispatch(getBranch());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  const otpapi = async (otp) => {
    try {
      const res = await axios.post(
        "http://localhost:5353/api/v1/auth/verify-signup",
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
      console.log("Response:", response);
      if (response.success) {
        message.success("OTP Verified Successfully");
        setShowOtpModal(false);
        dispatch(empdata());

        // Debugging: Log formValues to ensure it's populated
        console.log("Form Values:", formValues);

        const payloadss = {
          ...formValues2,
          employeeId: response.data.user.id,
        }

        await dispatch(AddSalaryss(payloadss));
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      message.error("Failed to verify OTP. Please try again.");
    }
  };

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      console.log("Form Values:", values);
      setFormValues2(values);
      // Store employeeId in formValues  
      const updatedFormValues = { ...values };

      const response = await dispatch(addEmp(updatedFormValues));

      if (response.payload?.data?.sessionToken) {
        setOtpToken(response.payload?.data?.sessionToken);
        setShowOtpModal(true);
      }

      if (response.payload?.data?.employeeId) {
        updatedFormValues.employeeId = response.payload.data.employeeId;
        setFormValues(updatedFormValues); // Set formValues here

        // Only reset form and close modal after successful employee creation
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

  const onOpenOtpModal = () => {
    setShowOtpModal(true);
  };
  const onCloseOtpModal = () => {
    setShowOtpModal(false);
  };

  const initialValues = {
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    username: "",
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

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please enter a first name."),
    lastName: Yup.string().required("Please enter a last name."),
    username: Yup.string().required("Please enter a username."),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/\d/, "Password must have at least one number")
      .required("Password is required"),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Please enter an email"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits.")
      .required("Please enter a phone number."),
    address: Yup.string().required("Please enter an address."),
    branch: Yup.string().required("Please select a branch."),
    joiningDate: Yup.date().nullable().required("Joining date is required."),
    leaveDate: Yup.date().nullable().required("Leave date is required."),
    department: Yup.string().required("Please select a department."),
    designation: Yup.string().required("Please select a designation."),
    salary: Yup.string().required("Please enter a salary."),
    accountholder: Yup.string().optional(),
    accountnumber: Yup.string().optional(),
    bankname: Yup.string().optional(),
    ifsc: Yup.string().optional(),
    banklocation: Yup.string().optional(),
    payroll: Yup.string().optional(),
    bankAccount: Yup.string().optional(),
    netSalary: Yup.string().optional(),
    status: Yup.string().optional(),
    currency: Yup.string().optional(),
  });

  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);

  const openAddBranchModal = () => {
    setIsAddBranchModalVisible(true);
  };

  const closeAddBranchModal = () => {
    setIsAddBranchModalVisible(false);
    dispatch(getBranch());
  };

  const [isAddDepartmentModalVisible, setIsAddDepartmentModalVisible] = useState(false);

  const openAddDepartmentModal = () => {
    setIsAddDepartmentModalVisible(true);
  };

  const closeAddDepartmentModal = () => {
    setIsAddDepartmentModalVisible(false);
    dispatch(getDept());
  };

  const [isAddDesignationModalVisible, setIsAddDesignationModalVisible] = useState(false);

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
        // validationSchema={validationSchema}
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
            className="space-y-4"
            onSubmit={handleSubmit}
            onFinishFailed={onFinishFailed}
          >
            <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="firstName"
                    as={Input}
                    placeholder="John"
                    className="w-full rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-500" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="lastName"
                    as={Input}
                    placeholder="Doe"
                    className="w-full rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-500" />
                </div>
              </Col>
            </Row>

            <Row gutter={16} className="mt-4">
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Username <span className="text-rose-500">*</span></label>
                  <Field name="username" as={Input} placeholder="john_doe" className="mt-1" />
                  <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Password <span className="text-rose-500">*</span></label>
                  <div className="relative flex items-center">
                    <Field
                      name="password"
                      as={Input.Password}
                      placeholder="Password"
                      className="mt-1 pr-12 w-full"
                    />
                    <Button
                      className="absolute right-0 top-1/2 -translate-y-1/2 px-2 border-0 bg-transparent hover:bg-gray-50"
                      onClick={() => setFieldValue("password", generatePassword())}
                      style={{ marginTop: '2px' }}
                    >
                      <ReloadOutlined />
                    </Button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
            </Row>

            <Row gutter={16} className="mt-4">
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Email <span className="text-rose-500">*</span></label>
                  <Field name="email" as={Input} placeholder="johndoe@example.com" className="mt-1" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Phone <span className="text-rose-500">*</span></label>
                  <div className="flex">
                    <Select
                      style={{ width: '30%', marginRight: '8px' }}
                      placeholder="Code"
                      name="phoneCode"
                      defaultValue="91"
                      onChange={(value) => setFieldValue('phoneCode', value)}
                      className="mt-1"
                    >
                      {countries && countries.length > 0 ? (
                        countries.map((country) => (
                          <Option key={country.id} value={country.phoneCode}>
                            {country.phoneCode}
                          </Option>
                        ))
                      ) : (
                        <Option value="91">+91</Option>
                      )}
                    </Select>
                    <Field name="phone">
                      {({ field }) => (
                        <Input
                          {...field}
                          type="string"
                          style={{ width: '70%' }}
                          placeholder="Enter phone number"
                          className="mt-1"
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Address <span className="text-red-500">*</span></label>
                  <Field name="address" as={Input} placeholder="Enter Address" className="mt-1" />
                  <ErrorMessage name="address" component="div" className="text-red-500" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Joining Date <span className="text-red-500">*</span></label>
                  <Field name="joiningDate">
                    {({ field }) => (
                      <DatePicker
                        className="w-full mt-1"
                        format="DD-MM-YYYY"
                        onChange={(date) => setFieldValue("joiningDate", date)}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="joiningDate" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Branch <span className="text-red-500">*</span></label>
                  <Field name="branch">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        placeholder="Select Branch"
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Button
                              type="link"
                              block
                              onClick={() => {
                                openAddBranchModal();
                                dispatch(getBranch());
                              }}
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
                  <ErrorMessage name="branch" component="div" className="text-red-500" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-1">
                  <label className="">Department <span className="text-red-500">*</span></label>
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
                  <ErrorMessage name="department" component="div" className="text-red-500" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="">Designation <span className="text-red-500">*</span></label>
                  <Field name="designation">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Designation"
                        disabled={!selectedBranch}
                        onChange={(value) => setFieldValue("designation", value)}
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
                  <ErrorMessage name="designation" component="div" className="text-red-500" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibol">Salary <span className="text-red-500">*</span></label>
                  <Field name="salary" as={Input} placeholder="$" type="text" className="mt-1" />
                  <ErrorMessage name="salary" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>
            <h1 className="text-lg font-bold mb-3 mt-4">Bank Details</h1>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Account Holder Name </label>
                  <Field name="accountholder" as={Input} placeholder="John Doe" className="mt-1" />
                  <ErrorMessage name="accountholder" component="div" className="text-red-500" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Account Number </label>
                  <Field name="accountnumber" as={Input} placeholder="123456789" type="number" className="mt-1" />
                  <ErrorMessage name="accountnumber" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Bank Name </label>
                  <Field name="bankname" as={Input} placeholder="Bank Name" className="mt-1" />
                  <ErrorMessage name="bankname" component="div" className="text-red-500" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="">IFSC </label>
                  <Field name="ifsc" as={Input} placeholder="IFSC" className="mt-1" />
                  <ErrorMessage name="ifsc" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="">Bank Location   </label>
                  <Field name="banklocation" as={Input} placeholder="Bank Location" className="mt-1" />
                  <ErrorMessage name="banklocation" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>

            <Col span={24} className="mt-4 "><div className="flex justify-between items-center">
              <label className="text-lg font-bold mb-3 mt-4">Salary</label>
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
            </Col>
            {salary && (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="form-item">
                      <label className="">Payroll Type </label>
                      <Field name="payslipType">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full mt-1"
                            placeholder="Select Payroll Type"
                            onChange={(value) => setFieldValue("payslipType", value)}
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
                    <div className="form-item">
                      <label className="">Currency </label>
                      <Field name="currency">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full mt-1"
                            placeholder="Select Currency"
                            onChange={(value) => setFieldValue("currency", value)}
                          >
                            {currencies?.data?.map((currency) => (
                              <Option key={currency.id} value={currency.id}>
                                {currency.currencyCode} ({currency.currencyIcon})
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
                    <div className="form-item">
                      <label className="">Net Salary </label>
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
                    <div className="form-item">
                      <label className="">Status </label>
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
                    <div className="form-item mt-3">
                      <label className="">Bank Account</label>
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
            <div className="text-right mt-6 space-x-2">
              <Button
                onClick={onClose}
                className="hover:bg-gray-50 border-gray-300 text-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 border-0"
              >
                {isSubmitting ? "Creating..." : "Create Employee"}
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
        title={
          <div className="flex items-center gap-2 text-gray-700">
            <PlusOutlined className="text-lg" />
            <span className="font-medium">Add Branch</span>
          </div>
        }
        visible={isAddBranchModalVisible}
        onCancel={closeAddBranchModal}
        footer={null}
        width={800}
        className="custom-modal"
      >
        <AddBranch onClose={closeAddBranchModal} />
      </Modal>
      <Modal
        title={
          <div className="flex items-center gap-2 text-gray-700">
            <PlusOutlined className="text-lg" />
            <span className="font-medium">Add Department</span>
          </div>
        }
        visible={isAddDepartmentModalVisible}
        onCancel={closeAddDepartmentModal}
        footer={null}
        width={800}
        className="custom-modal"
      >
        <AddDepartment onClose={closeAddDepartmentModal} />
      </Modal>
      <Modal
        title={
          <div className="flex items-center gap-2 text-gray-700">
            <PlusOutlined className="text-lg" />
            <span className="font-medium">Add Designation</span>
          </div>
        }
        visible={isAddDesignationModalVisible}
        onCancel={closeAddDesignationModal}
        footer={null}
        width={800}
        className="custom-modal"
      >
        <AddDesignation onClose={closeAddDesignationModal} />
      </Modal>
    </div>
  );
};

export default AddEmployee;
