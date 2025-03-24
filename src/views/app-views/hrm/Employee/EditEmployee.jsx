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
import { Formik, Form, Field, ErrorMessage } from "formik";
import { empdata, updateEmp } from "./EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
import { getDes } from "../Designation/DesignationReducers/DesignationSlice";
import { getallcountries } from "../../setting/countries/countriesreducer/countriesSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";
import AddBranch from '../../hrm/Branch/AddBranch';
import AddDepartment from '../Department/AddDepartment';
import AddDesignation from '../Designation/AddDesignation';
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import dayjs from "dayjs";
import AddCountries from "views/app-views/setting/countries/AddCountries";
import * as Yup from 'yup';

const { Option } = Select;

const EditEmployee = ({ idd, onClose, setSub, initialData = {} }) => {
  const dispatch = useDispatch();
  const [salary, setSalary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState(null);
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
  useEffect(() => {
    dispatch(empdata());
  }, [dispatch])
  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);

  const getInitialCountry = () => {
    if (countries?.length > 0) {
      const indiaCode = countries.find(c => c.countryCode === 'IN');
      return indiaCode?.phoneCode || "+91";
    }
    return "+91";
  };

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 15) {
      setFieldValue('phone', value);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [
          empResponse,
        ] = await Promise.all([
          dispatch(empdata()),
          dispatch(getallcountries()),
          dispatch(getDept()),
          dispatch(getDes()),
          dispatch(getBranch()),
          dispatch(getcurren())
        ]);

        const empData = empResponse.payload.data.find(emp => emp.id === idd);
        if (empData) {
          setEmployeeData(empData);
          setSelectedBranch(empData.branch);
          setSalary(Boolean(empData.payroll || empData.netSalary || empData.currency));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        message.error("Failed to load employee data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch, idd]);

  const initialValues = {
    firstName: employeeData?.firstName || "",
    lastName: employeeData?.lastName || "",
    phone: employeeData?.phone || "",
    phoneCode: employeeData?.phoneCode || getInitialCountry(),
    address: employeeData?.address || "",
    branch: employeeData?.branch || "",
    joiningDate: employeeData?.joiningDate ? 
      new Date(employeeData.joiningDate).toISOString().split('T')[0] : 
      "",
    leaveDate: employeeData?.leaveDate ? dayjs(employeeData.leaveDate) : null,
    department: employeeData?.department || "",
    designation: employeeData?.designation || "",
    salary: employeeData?.salary || "",
    accountholder: employeeData?.accountholder || "",
    accountnumber: employeeData?.accountnumber || "",
    bankname: employeeData?.bankname || "",
    banklocation: employeeData?.banklocation || "",
    payroll: employeeData?.payroll || "",
    bankAccount: employeeData?.bankAccount || "",
    netSalary: employeeData?.netSalary || "",
    status: employeeData?.status || "",
    currency: employeeData?.currency || "",
    state: employeeData?.state || "",
    city: employeeData?.city || "",
    country: employeeData?.country || "",
    zipCode: employeeData?.zipCode || "",
    gender: employeeData?.gender || "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .max(100, 'First name cannot exceed 100 characters'),
    lastName: Yup.string()
      .trim()
      .max(100, 'Last name cannot exceed 100 characters'),
    phone: Yup.string()
      .trim()
      .matches(/^[0-9-]*$/, 'Phone number can only contain numbers and hyphens')
      .max(15, 'Phone number cannot exceed 15 characters'),
    phoneCode: Yup.string()
      .trim(),
    address: Yup.string()
      .trim()
      .max(255, 'Address cannot exceed 255 characters'),
    branch: Yup.string()
      .trim(),
    joiningDate: Yup.date()
      .nullable(),
    leaveDate: Yup.date()
      .nullable(),
    department: Yup.string()
      .trim(),
    designation: Yup.string()
      .trim(),
    salary: Yup.string()
      .trim(),
    accountholder: Yup.string()
      .trim()
      .max(100, 'Account holder name cannot exceed 100 characters'),
    accountnumber: Yup.string()
      .trim()
      .matches(/^[0-9-]*$/, 'Account number can only contain numbers and hyphens')
      .max(15, 'Account number cannot exceed 15 characters'),
    bankname: Yup.string()
      .trim()
      .max(100, 'Bank name cannot exceed 100 characters'),
    banklocation: Yup.string()
      .trim()
      .max(100, 'Bank location cannot exceed 100 characters'),
    payroll: Yup.string()
      .trim(),
    bankAccount: Yup.string()
      .trim()
      .matches(/^[0-9-]*$/, 'Bank account can only contain numbers and hyphens')
      .max(15, 'Bank account cannot exceed 15 characters'),
    netSalary: Yup.string()
      .trim(),
    status: Yup.string()
      .oneOf(['active', 'inactive', 'pending'], 'Please select a valid status'),
    currency: Yup.string()
      .trim(),
    state: Yup.string()
      .trim()
      .max(100, 'State name cannot exceed 100 characters'),
    city: Yup.string()
      .trim()
      .max(100, 'City name cannot exceed 100 characters'),
    country: Yup.string()
      .trim(),
    zipCode: Yup.string()
      .trim()
      .matches(/^[0-9-]*$/, 'Zip code can only contain numbers and hyphens')
      .max(10, 'Zip code cannot exceed 10 characters'),
    gender: Yup.string()
      .oneOf(['male', 'female', 'other'], 'Please select a valid gender'),
  });

  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);
  const [isAddDepartmentModalVisible, setIsAddDepartmentModalVisible] = useState(false);
  const [isAddDesignationModalVisible, setIsAddDesignationModalVisible] = useState(false);

  const openAddBranchModal = () => setIsAddBranchModalVisible(true);
  const closeAddBranchModal = () => {
    setIsAddBranchModalVisible(false);
    dispatch(getBranch());
  };

  const openAddDepartmentModal = () => setIsAddDepartmentModalVisible(true);
  const closeAddDepartmentModal = () => {
    setIsAddDepartmentModalVisible(false);
    dispatch(getDept());
  };

  const openAddDesignationModal = () => setIsAddDesignationModalVisible(true);
  const closeAddDesignationModal = () => {
    setIsAddDesignationModalVisible(false);
    dispatch(getDes());
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(updateEmp({ idd, values })).unwrap();
      // console.log("response",values);
      if (response) {
        onClose();
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      message.error(error?.message || "Failed to update employee");
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Form submission failed:", errorInfo);
  };

  if (isLoading || !employeeData) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="text-lg">Loading employee data...</div>
      </div>
    );
  }

  return (
    <div className="edit-employee">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={false}
      >
        {({
          isSubmitting,
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
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-0">
                    <Field name="phoneCode">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="phone-code-select"
                          style={{
                            width: '80px',
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderRight: 0,
                            backgroundColor: '#f8fafc',
                          }}
                          placeholder={<span className="text-gray-400">+91</span>}
                          onChange={(value) => {
                            if (value === 'add_new') {
                              setIsAddPhoneCodeModalVisible(true);
                            } else {
                              setFieldValue('phoneCode', value);
                            }
                          }}
                          value={values.phoneCode}
                          dropdownStyle={{ minWidth: '180px' }}
                          suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
                          dropdownRender={menu => (
                            <div>
                              <div
                                className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
                                onClick={() => setIsAddPhoneCodeModalVisible(true)}
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
                                <span className="text-base min-w-[40px]">{country.phoneCode}</span>
                                <span className="text-gray-600 text-sm ml-3">{country.countryName}</span>
                                <span className="text-gray-400 text-xs ml-auto">{country.countryCode}</span>
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
                          className="phone-input"
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderLeft: '1px solid #d9d9d9',
                            width: 'calc(100% - 80px)'
                          }}
                          type="number"
                          placeholder="Enter phone number"
                          onChange={(e) => handlePhoneNumberChange(e, setFieldValue)}
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
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
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Country
                  </label>
                  <Field name="country">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Country"
                        onChange={(value) => setFieldValue("country", value)}
                      >
                        {countries?.map((country) => (
                          <Option key={country.id} value={country.id}>
                            {country.countryName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    State
                  </label>
                  <Field
                    name="state"
                    as={Input}
                    placeholder="Enter State"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="state"
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
                    City
                  </label>
                  <Field
                    name="city"
                    as={Input}
                    placeholder="Enter City"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Zip Code
                  </label>
                  <Field
                    name="zipCode"
                    as={Input}
                    placeholder="Enter Zip Code"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="zipCode"
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
                    Gender
                  </label>
                  <Field name="gender">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Gender"
                        onChange={(value) => setFieldValue("gender", value)}
                      >
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="gender"
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
                    Joining Date <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="joiningDate"
                    type="date"
                    className="w-full mt-1 date-input"
                  />
                  <ErrorMessage
                    name="joiningDate"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="branch"
                    as={Select}
                    placeholder="Select Branch"
                    className="w-full mt-1"
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
                  </Field>
                  <ErrorMessage
                    name="branch"
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
                    Department <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="department"
                    as={Select}
                    placeholder="Select Department"
                    className="w-full mt-1"
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
                  <Field
                    name="designation"
                    as={Select}
                    placeholder="Select Designation"
                    className="w-full mt-1"
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
                    type="text"
                    placeholder="$"
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
                  <label className="font-semibold">
                    Account Holder Name
                  </label>
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
                  <label className="font-semibold">
                    Account Number
                  </label>
                  <Field
                    name="accountnumber"
                    as={Input}
                    type="number"
                    placeholder="123456789"
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
                  <label className="font-semibold">
                    Bank Name
                  </label>
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
                  <label className="font-semibold">
                    Bank Location
                  </label>
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
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="font-semibold">
                      Payroll Type
                    </label>
                    <Field
                      name="payroll"
                      as={Select}
                      placeholder="Select Payroll Type"
                      className="w-full mt-1"
                      onChange={(value) => setFieldValue("payroll", value)}
                    >
                      <Option value="monthly">Monthly</Option>
                      <Option value="hourly">Hourly</Option>
                      <Option value="weekly">Weekly</Option>
                    </Field>
                    <ErrorMessage
                      name="payroll"
                      component="div"
                      className="text-red-500 mt-1"
                    />
                  </div>
                </Col>

                <Col span={12}>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="font-semibold">
                      Currency
                    </label>
                    <Field
                      name="currency"
                      as={Select}
                      placeholder="Select Currency"
                      className="w-full mt-1"
                      onChange={(value) => setFieldValue("currency", value)}
                    >
                      {currencies?.data?.map((currency) => (
                        <Option key={currency.id} value={currency.id}>
                          {currency.currencyCode} ({currency.currencyIcon})
                        </Option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="currency"
                      component="div"
                      className="text-red-500 mt-1"
                    />
                  </div>
                </Col>
              </Row>
            )}

            {salary && (
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="font-semibold">
                      Net Salary
                    </label>
                    <Field
                      name="netSalary"
                      as={Input}
                      type="number"
                      placeholder="Enter Net Salary Amount"
                      className="w-full mt-1"
                    />
                    <ErrorMessage
                      name="netSalary"
                      component="div"
                      className="text-red-500 mt-1"
                    />
                  </div>
                </Col>

                <Col span={12}>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="font-semibold">
                      Status
                    </label>
                    <Field
                      name="status"
                      as={Select}
                      placeholder="Select Status"
                      className="w-full mt-1"
                      onChange={(value) => setFieldValue("status", value)}
                    >
                      <Option value="active">Active</Option>
                      <Option value="inactive">Inactive</Option>
                      <Option value="pending">Pending</Option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-red-500 mt-1"
                    />
                  </div>
                </Col>
              </Row>
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
                {isSubmitting ? "Submitting..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

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
      <style jsx>{`
        .edit-employee {
          width: 100%;
        }

        .phone-code-select .ant-select-selector {
          background-color: #f8fafc !important;
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          border-right: 0 !important;
        }

        .phone-code-select .ant-select-selection-item {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 16px !important;
        }

        .phone-code-select .ant-select-selection-item > div {
          display: flex !important;
          align-items: center !important;
        }

        .phone-code-select .ant-select-selection-item span:not(:first-child) {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default EditEmployee;
