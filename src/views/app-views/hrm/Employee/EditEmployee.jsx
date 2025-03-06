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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { empdata, updateEmp } from "./EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
import { getDes } from "../Designation/DesignationReducers/DesignationSlice";
import { getallcountries } from "../../setting/countries/countriesreducer/countriesSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";
import AddBranch from '../../hrm/Branch/AddBranch';
import AddDepartment from '../Department/AddDepartment';
import AddDesignation from '../Designation/AddDesignation';
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import dayjs from "dayjs";

const { Option } = Select;

const EditEmployee = ({ idd, onClose, setSub, initialData = {} }) => {
  const navigate = useNavigate();
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

  useEffect(()=>{
    dispatch(empdata());
  },[dispatch])

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [
          empResponse,
          countriesResponse,
          deptResponse,
          desResponse,
          branchResponse,
          currencyResponse
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
    phoneCode: employeeData?.phoneCode || "+91",
    address: employeeData?.address || "",
    branch: employeeData?.branch || "",
    joiningDate: employeeData?.joiningDate ? dayjs(employeeData.joiningDate) : null,
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
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please enter a first name."),
    lastName: Yup.string().required("Please enter a last name."),
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
        // validationSchema={validationSchema}
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
            className="space-y-4"
            onSubmit={handleSubmit}
            onFinishFailed={onFinishFailed}
          >
            <h1 className="text-lg font-bold mb-4">Personal Details</h1>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">First Name <span className="text-rose-500">*</span></label>
                  <Field name="firstName" as={Input} placeholder="John" className="mt-1" />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Last Name <span className="text-rose-500">*</span></label>
                  <Field name="lastName" as={Input} placeholder="Doe" className="mt-1" />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
            </Row>
            <Row gutter={16} className="mt-4">
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Phone <span className="text-rose-500">*</span></label>
                  <div className="flex">
                    <Select
                      style={{ width: '30%', marginRight: '8px' }}
                      placeholder="Code"
                      name="phoneCode"
                      defaultValue={employeeData?.phoneCode || "+91"}
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
                        <Option value="+91">+91</Option>
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
                          defaultValue={employeeData?.phone || ""}
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Address <span className="text-rose-500">*</span></label>
                  <Field name="address" as={Input} placeholder="Enter Address" className="mt-1" />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Joining Date <span className="text-rose-500">*</span></label>
                  <Field name="joiningDate">
                    {({ field }) => (
                      <DatePicker
                        className="w-full mt-1"
                        format="DD-MM-YYYY"
                        onChange={(date) => setFieldValue("joiningDate", date)}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="joiningDate" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Branch <span className="text-rose-500">*</span></label>
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
                  <ErrorMessage name="branch" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item mt-1">
                  <label className="font-semibold">Department <span className="text-rose-500">*</span></label>
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
                  <ErrorMessage name="department" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Designation <span className="text-rose-500">*</span></label>
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
                  <ErrorMessage name="designation" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Salary <span className="text-rose-500">*</span></label>
                  <Field name="salary" as={Input} placeholder="$" type="text" className="mt-1" />
                  <ErrorMessage name="salary" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
            </Row>
            <h1 className="text-lg font-bold mb-3 mt-4">Bank Details</h1>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Account Holder Name </label>
                  <Field name="accountholder" as={Input} placeholder="John Doe" className="mt-1" />
                  <ErrorMessage name="accountholder" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Account Number </label>
                  <Field name="accountnumber" as={Input} placeholder="123456789" type="number" className="mt-1" />
                  <ErrorMessage name="accountnumber" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Bank Name </label>
                  <Field name="bankname" as={Input} placeholder="Bank Name" className="mt-1" />
                  <ErrorMessage name="bankname" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Bank Location </label>
                  <Field name="banklocation" as={Input} placeholder="Bank Location" className="mt-1" />
                  <ErrorMessage name="banklocation" component="div" className="text-red-500 text-sm" />
                </div>
              </Col>
            </Row>

            <Col span={24} className="mt-4">
              <div className="flex justify-between items-center">
                <label className="text-lg font-bold mb-3 mt-4">Salary Details</label>
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
                      <label className="font-semibold">Payroll Type </label>
                      <Field name="payroll">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full mt-1"
                            placeholder="Select Payroll Type"
                            onChange={(value) => setFieldValue("payroll", value)}
                          >
                            <Option value="monthly">Monthly</Option>
                            <Option value="hourly">Hourly</Option>
                            <Option value="weekly">Weekly</Option>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage name="payroll" component="div" className="text-red-500 text-sm" />
                    </div>
                  </Col>

                  <Col span={12}>
                    <div className="form-item">
                      <label className="font-semibold">Currency </label>
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
                      <ErrorMessage name="currency" component="div" className="text-red-500 text-sm" />
                    </div>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <div className="form-item">
                      <label className="font-semibold">Net Salary </label>
                      <Field
                        name="netSalary"
                        as={Input}
                        type="number"
                        className="w-full mt-1"
                        placeholder="Enter Net Salary Amount"
                      />
                      <ErrorMessage name="netSalary" component="div" className="text-red-500 text-sm" />
                    </div>
                  </Col>

                  <Col span={12}>
                    <div className="form-item">
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
                      <ErrorMessage name="status" component="div" className="text-red-500 text-sm" />
                    </div>
                  </Col>
                </Row>
              </>
            )}
            <div className="text-right mt-6">
              <Button type="default" className="mr-2" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="bg-blue-600 hover:bg-blue-500"
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
    </div>
  );
};

export default EditEmployee;
