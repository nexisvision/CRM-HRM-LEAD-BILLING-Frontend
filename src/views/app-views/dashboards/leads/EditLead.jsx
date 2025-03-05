import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Switch,
  Upload,
  Card,
  Modal,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import utils from "utils";
import OrderListData from "assets/data/order-list.data.json";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { GetLeads, LeadsAdd, LeadsEdit } from "./LeadReducers/LeadSlice";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { GetLable, AddLable } from "../project/milestone/LableReducer/LableSlice";
import { getstages } from "../systemsetup/LeadStages/LeadsReducer/LeadsstageSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { getallcountries } from "views/app-views/setting/countries/countriesreducer/countriesSlice";
import AddLeadStages from "../systemsetup/LeadStages/AddLeadStages";
import moment from 'moment';
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";
import AddCurrencies from "views/app-views/setting/currencies/AddCurrencies";
import AddCountries from "views/app-views/setting/countries/AddCountries";

const { Option } = Select;

const EditLead = ({ id,onClose }) => {
  const navigate = useNavigate();
  const [details, setDetails] = useState(false);
  const [info, setInfo] = useState(false);
  const [organisation, setorganisation] = useState(false);
  const dispatch = useDispatch();
 
//  const { currencies } = useSelector((state) => state.currencies);
const currenciesState = useSelector((state) => state.currencies);
  const currencies = currenciesState?.currencies?.data || [];

    const countriesss = useSelector((state) => state.countries.countries || []);
  
  // 
  // const { data: employee } = useSelector((state) => state.employee.employee);
  
  useEffect(()=>{
    // dispatch(empdata())
    dispatch(GetUsers())
  },[dispatch])


  const allempdata = useSelector((state) => state.Users);
  const empData = allempdata?.Users?.data || [];
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const roles = useSelector((state) => state.role?.role?.data);
  const userRole = roles?.find(role => role.id === loggedInUser.role_id);

  const employee = empData.filter(emp => {
    if (userRole?.role_name === 'client') {
      return emp.client_id === loggedInUser.id;
    } else {
      return emp.client_id === loggedInUser.client_id;
    }
  });

  // const loggeduser = useSelector((state)=>state.user.loggedInUser.username);

  // const employee = filterdata.filter((item)=>item.created_by === loggeduser)


  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const alltagdata = useSelector((state) => state.Lable);
  const datas = alltagdata.Lable.data || [];
  const user = useSelector((state) => state.user.loggedInUser);

  // Updated state variables
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const AllLoggedData = useSelector((state) => state.user);
  const loggedInUserId = AllLoggedData?.loggedInUser?.id;
  const countries = useSelector((state) => state.countries.countries || []);

  const [isAddLeadStageModalVisible, setIsAddLeadStageModalVisible] = useState(false);
  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);

  const fetchLables = async (lableType, setter) => {
    try {
      const response = await dispatch(GetLable(loggedInUserId));
      if (response.payload && response.payload.data) {
        const filteredLables = response.payload.data
          .filter((lable) => lable.lableType === lableType)
          .map((lable) => ({ id: lable.id, name: lable.name.trim() }));
        setter(filteredLables);
      }
    } catch (error) {
      console.error(`Failed to fetch ${lableType}:`, error);
      message.error(`Failed to load ${lableType}`);
    }
  };

  useEffect(() => {
    if (loggedInUserId) {
      fetchLables("tag", setTags);
      fetchLables("category", setCategories);
      fetchLables("status", setStatuses);
    }
  }, [loggedInUserId]);

  const handleAddNewLable = async (lableType, newValue, setter, modalSetter, setFieldValue) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
      const lid = AllLoggedData.loggedInUser.id;
      const payload = {
        name: newValue.trim(),
        lableType,
      };
      
      const response = await dispatch(AddLable({ lid, payload }));
      
      if (response.payload && response.payload.success) {
        message.success(`${lableType} added successfully.`);
        
        // Refresh the labels immediately after adding
        const labelsResponse = await dispatch(GetLable(lid));
        if (labelsResponse.payload && labelsResponse.payload.data) {
          const filteredLables = labelsResponse.payload.data
            .filter((lable) => lable.lableType === lableType)
            .map((lable) => ({ id: lable.id, name: lable.name.trim() }));
          
          if (lableType === "category") {
            setCategories(filteredLables);
            // Update form field value with the new category
            setFieldValue("category", newValue.trim());
          } else if (lableType === "tag") {
            setTags(filteredLables);
            setFieldValue("tag", newValue.trim());
          } else if (lableType === "status") {
            setStatuses(filteredLables);
            setFieldValue("status", newValue.trim());
          }
        }
        
        // Reset input and close modal
        setter("");
        modalSetter(false);
      } else {
        throw new Error('Failed to add label');
      }
    } catch (error) {
      console.error(`Failed to add ${lableType}:`, error);
      message.error(`Failed to add ${lableType}. Please try again.`);
    }
  };

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getstages());
    dispatch(getallcountries());
  }, []);

    // const alllogeddata =  useSelector((state)=>state.user.loggedInUser.username)

  const allstagedata = useSelector((state) => state.StagesLeadsDeals);
  const filterdatas = allstagedata?.StagesLeadsDeals?.data?.filter(item => item.stageType === "lead") || [];

  // const filterdatas = fndata.filter((item)=>item.created_by === alllogeddata)

  const allcurrency = useSelector((state) => state.currencies);
  const fndcurr = allcurrency?.currencies?.data || [];

  const allcountry = useSelector((state) => state.countries);
  const fndcountry = allcountry?.countries?.data || [];

  const [initialValues,setInitialValues] = useState({
    leadTitle: "",
    firstName: "",
    lastName: "",
    telephone: "",
    email: "",
    leadStage: "",
    leadValue: "",
    currencyIcon: "",
    assigned: "",
    status: "",
    notes: "",
    source: "",
    category: "",
    lastContacted: null,
    totalBudget: "",
    targetDate: null,
    contentType: "",
    brandName: "",
    tags: [],
    company_name: "",
  });

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const validationSchema = Yup.object({
    leadTitle: Yup.string().required("Lead Title is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last Name is required"),
    telephone: Yup.string()
      .required("Please enter a valid number")
      .nullable(),
    email: Yup.string().optional("Please enter a valid email address").nullable(),
    leadStage: Yup.string().required("Lead Stage is required"),
    leadValue: Yup.number().optional("Lead Value must be a number").nullable(),
    currencyIcon: Yup.string().nullable(),
    employee: Yup.string().required("Employee is required"),
    category: Yup.string().required("Category is required"),
    assigned: Yup.string().optional("Assigned is required"),
    status: Yup.string().required("Status is required"),

    // Details section
    notes: Yup.string().when("details", {
      is: true,
      then: Yup.string().required("Notes are required"),
    }),
    source: Yup.string().when("details", {
      is: true,
      then: Yup.string().required("Source is required"),
    }),
    // category: Yup.string().required("Category is required"),
    lastContacted: Yup.date().nullable(),

    // Info section
    totalBudget: Yup.string().when("info", {
      is: true,
      then: Yup.string().required("Total Budget is required"),
    }),
    targetDate: Yup.date().nullable(),
    contentType: Yup.string().when("info", {
      is: true,
      then: Yup.string().required("Content type is required"),
    }),
    brandName: Yup.string().when("info", {
      is: true,
      then: Yup.string().required("Brand name is required"),
    }),
    tags: Yup.array().min(1, "At least one tag is required"),
  });

  const onSubmit = (values, { resetForm }) => {
    // Check if all required fields are filled
    const requiredFields = [
      'leadTitle',
      'firstName', 
      'lastName',
      'telephone',
      'leadStage',
      'employee',
      'category',
      'status'
    ];

    const missingFields = requiredFields.filter(field => !values[field]);

    if (missingFields.length > 0) {
      message.error('Please fill in all required fields');
      return;
    }

    const formData = {
      ...values,
      leadValue: values.leadValue ? String(values.leadValue) : null,
      currencyIcon: values.currencyIcon || null,
      lastContacted: values.lastContacted ? moment(values.lastContacted).format('YYYY-MM-DD') : null,
      targetDate: values.targetDate ? moment(values.targetDate).format('YYYY-MM-DD') : null
    };

    dispatch(LeadsEdit({id, formData}))
      .then(() => {
        dispatch(GetLeads()); // Refresh leads data
        resetForm();
        onClose(); // Close modal
      })
      .catch((error) => {
        message.error("Failed to update Lead. Please try again.");
        console.error("Edit API error:", error);
      });
  };

  const alldatas = useSelector((state)=>state.Leads.Leads.data);

  const fnddata = alldatas.filter((item)=>item.id === id);

  useEffect(()=>{
    setInitialValues({
      leadTitle: fnddata[0].leadTitle,
      firstName: fnddata[0].firstName,
      lastName: fnddata[0].lastName,
      telephone: fnddata[0].telephone,
      email: fnddata[0].email,
      leadStage: fnddata[0].leadStage,
      leadValue: fnddata[0].leadValue,  
      currencyIcon: fnddata[0].currencyIcon,
      assigned: fnddata[0].assigned,
      status: fnddata[0].status,
      notes: fnddata[0].notes,
      source: fnddata[0].source,
      category: fnddata[0].category,
      company_name: fnddata[0].company_name,
    })
  },[fnddata])

 const LeadValueField = ({ field, form }) => (
  <div className="form-group">
    <div className="flex gap-0">
      <Field name="currency">
        {({ field }) => (
          <Select
            {...field}
            className="currency-select"
            style={{
              width: '60px',
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderRight: 0,
              backgroundColor: '#f8fafc',
            }}
            placeholder={<span className="text-gray-400">$</span>}
            onChange={(value) => {
              if (value === 'add_new') {
                setIsAddCurrencyModalVisible(true);
              } else {
                form.setFieldValue("currency", value);
              }
            }}
            value={form.values.currency}
            dropdownStyle={{ minWidth: '180px' }}
            suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
            loading={!fnddatass}
            dropdownRender={menu => (
              <div>
                <div
                  className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
                  onClick={() => setIsAddCurrencyModalVisible(true)}
                >
                  <PlusOutlined className="mr-2" />
                  <span className="text-sm">Add New</span>
                </div>
                {menu}
              </div>
            )}
          >
            {fnddatass?.map((currency) => (
              <Option key={currency.id} value={currency.id}>
                <div className="flex items-center w-full px-1">
                  <span className="text-base min-w-[24px]">{currency.currencyIcon}</span>
                  <span className="text-gray-600 text-sm ml-3">{currency.currencyName}</span>
                  <span className="text-gray-400 text-xs ml-auto">{currency.currencyCode}</span>
                </div>
              </Option>
            ))}
          </Select>
        )}
      </Field>
      <Field name="leadValue">
        {({ field, form }) => (
          <Input
            {...field}
            className="price-input"
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderLeft: '1px solid #d9d9d9',
              width: 'calc(100% - 100px)'
            }}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                form.setFieldValue('leadValue', value);
              }
            }}
            onKeyPress={(e) => {
              const charCode = e.which ? e.which : e.keyCode;
              if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                e.preventDefault();
              }
              if (charCode === 46 && field.value.includes('.')) {
                e.preventDefault();
              }
            }}
            prefix={
              form.values.currency && (
                <span className="text-gray-600 font-medium mr-1">
                  {fnddatass?.find(c => c.id === form.values.currency)?.currencyIcon}
                </span>
              )
            }
          />
        )}
      </Field>
    </div>
    <ErrorMessage name="leadValue" component="div" className="text-red-500 mt-1 text-sm" />
  </div>
);

  const openAddLeadStageModal = () => {
    setIsAddLeadStageModalVisible(true);
  };

  const closeAddLeadStageModal = () => {
    setIsAddLeadStageModalVisible(false);
  };

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 15) {
      setFieldValue('telephone', value);
    }
  };

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
          resetForm,
        }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <h2 className="mb-2 border-b font-medium"></h2>

            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold flex mt-3">
                    Lead Title <h1 className="text-rose-500">*</h1>
                  </label>
                  <Field
                    name="leadTitle"
                    as={Input}
                    className="mt-1"
                    placeholder="Enter Lead Title"
                  />
                  <ErrorMessage
                    name="leadTitle"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold flex">
                    First Name<h1 className="text-rose-500">*</h1>
                  </label>
                  <Field
                    name="firstName"
                    as={Input}
                    className="mt-1"
                    placeholder="Enter First Name"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold flex">
                    Last Name<h1 className="text-rose-500">*</h1>
                  </label>
                  <Field
                    name="lastName"
                    as={Input}
                    className="mt-1"
                    placeholder="Enter Last Name"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Telephone
                    <span className="text-rose-500">*</span>
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
                    <Field name="telephone">
                      {({ field }) => (
                        <Input
                          {...field}
                          className="phone-input"
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderLeft: 0,
                            width: 'calc(100% - 80px)'
                          }}
                          type="tel"
                          placeholder="Enter 10-digit number"
                          onChange={(e) => handlePhoneNumberChange(e, setFieldValue)}
                          maxLength={15}
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage name="telephone" component="div" className="text-red-500 mt-1 text-sm" />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label
                    htmlFor="leadStage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Lead Stage
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {filterdatas ? (
                      <Field name="leadStage">
                        {({ field, form }) => (
                          <Select
                            {...field}
                            id="leadStage"
                            className="w-full mt-1"
                            placeholder="Select Lead Stage"
                            onChange={(value) =>
                              form.setFieldValue("leadStage", value)
                            }
                            dropdownRender={(menu) => (
                              <div>
                                {menu}
                                <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                                  <Button
                                    type="link"
                                    icon={<PlusOutlined />}
                                    className="w-full mt-2"
                                    onClick={openAddLeadStageModal}
                                  >
                                    Add New Lead Stage
                                  </Button>
                                </div>
                              </div>
                            )}
                          >
                            {filterdatas.map((currency) => (
                              <Option key={currency.id} value={currency.id}>
                                {currency.stageName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Field>
                    ) : (
                      <Field
                        name="leadStage"
                        type="string"
                        as={Input}
                        id="leadStage"
                        placeholder="Enter Lead Value"
                        className="w-full"
                      />
                    )}
                  </div>
                  <ErrorMessage
                    name="leadStage"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Email Address </label>
                  <Field
                    name="email"
                    as={Input}
                    className="mt-2"
                    placeholder="Enter Email Address"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                              <div className="form-item ">
                                <label className="font-semibold">Lead Value <span className="text-rose-500">*</span></label>
                                <Field name="leadValue" component={LeadValueField}  className="mt-2"/>
                                <ErrorMessage
                                  name="leadValue.amount"
                                  component="div"
                                  className="error-message text-red-500 my-1"
                                />
                                <ErrorMessage
                                  name="leadValue.currencyId"
                                  component="div"
                                  className="error-message text-red-500 my-1"
                                />
                              </div>
                            </Col>

              <Col span={24} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold mb-2">Assigned </label>
                  <div className="flex gap-2">
                    <Field name="employee">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          placeholder="Select Employee"
                          onChange={(value) => {
                            const selectedEmployee =
                              Array.isArray(employee) &&
                              employee.find((e) => e.id === value);
                            form.setFieldValue(
                              "employee",
                              selectedEmployee?.username || ""
                            );
                          }}
                        >
                          {Array.isArray(employee) &&
                            employee.map((emp) => (
                              <Option key={emp.id} value={emp.id}>
                                {emp.username}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="employee"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold flex">
                    Status <h1 className="text-rose-500">*</h1>
                  </label>
                  <Field name="status">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1  "
                        placeholder="Select or add new status"
                        onChange={(value) => setFieldValue("status", value)}
                        value={values.status}
                        onBlur={() => setFieldTouched("status", true)}
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
                    )}
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={24}>
                      <div className="form-item mt-3">
                        <label className="font-semibold">Category <span className="text-rose-500">*</span></label>
                        <Field name="category">
                          {({ field }) => (
                            <Select
                              {...field}
                              className="w-full mt-1"
                              placeholder="Select or add new category"
                              onChange={(value) =>
                                setFieldValue("category", value)
                              }
                              value={values.category}
                              onBlur={() => setFieldTouched("category", true)}
                              dropdownRender={(menu) => (
                                <div>
                                  {menu}
                                  <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                                    <Button
                                      type="link"
                                      icon={<PlusOutlined />}
                                      className="w-full mt-2"
                                      onClick={() => setIsCategoryModalVisible(true)}
                                    >
                                      Add New Category
                                    </Button>
                                  </div>
                                </div>
                              )}
                            >
                              {categories.map((category) => (
                                <Option key={category.id} value={category.id}>
                                  {category.name}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="form-item mt-3">
                        <label className="font-semibold">Tags <span className="text-rose-500">*</span></label>
                        <Field name="tags">
                          {({ field }) => (
                            <Select
                              mode="multiple"
                              style={{ width: "100%" }}
                              className="mt-1"
                              // placeholder="Select or add new tags"
                              value={values.tags}
                              onChange={(value) => setFieldValue("tags", value)}
                              dropdownRender={(menu) => (
                                <div>
                                  {menu}
                                  <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                                    <Button
                                      type="link"
                                      icon={<PlusOutlined />}
                                      className="w-full mt-2"
                                      onClick={() => setIsTagModalVisible(true)}
                                    >
                                      Add New Tag
                                    </Button>
                                  </div>
                                </div>
                              )}
                            >
                              {tags.map((tag) => (
                                <Option key={tag.id} value={tag.name}>
                                  {tag.name}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="tags"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="form-item mt-3">
                        <label className="font-semibold">Company Name <span className="text-rose-500">*</span></label>
                        <Field
                          name="company_name"
                          as={Input}
                          placeholder="Enter Company Name"
                          className="mt-1"
                        />
                        <ErrorMessage
                          name="company_name"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
              <Col span={24} className="mt-4 ">
                <div className="flex justify-between items-center">
                  <label className="font-semibold">Details</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={details}
                      onChange={(e) => setDetails(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                {/* Conditionally show Upload field */}
                {details && (
                  <>
                    <Col span={24}>
                      <div className="mt-3">
                        <label className="font-semibold">Notes <span className="text-rose-500">*</span></label>
                        <ReactQuill
                          value={values.notes}
                          onChange={(value) => setFieldValue("notes", value)}
                          placeholder="Enter Notes"
                          onBlur={() => setFieldTouched("notes", true)}
                          className="mt-1 bg-white rounded-md"
                        />
                        <ErrorMessage
                          name="notes"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={24} className="mt-3">
                      <label className="font-semibold">Source <span className="text-rose-500">*</span></label>
                      <Select
                        placeholder="Select Source"
                        className="w-full mt-1"
                        onChange={(value) => console.log("Selected:", value)}
                      >
                        {datas.map((source) => (
                          <Option key={source.id} value={source.name}>
                            {source.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    
                    <Col span={24}>
                      <div className="form-item  mt-3 border-b pb-3">
                        <label className="font-semibold">
                          Last Contacted <span className="text-rose-500">*</span>
                        </label>
                        <DatePicker
                          className="w-full mt-1"
                          format="DD-MM-YYYY"
                          value={values.lastContacted}
                          onChange={(date) =>
                            setFieldValue("lastContacted", date)
                          }
                          onBlur={() => setFieldTouched("lastContacted", true)}
                        />
                        <ErrorMessage
                          name="lastContacted"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                  </>
                )}
              </Col>

              <Col span={24} className="mt-4 ">
                <div className="flex justify-between items-center">
                  <label className="font-semibold">More Information</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={info}
                      onChange={(e) => setInfo(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                {/* Conditionally show Upload field */}
                {info && (
                  <>
                    <div className="mt-2">
                      <Col span={24}>
                        <Card className="w-full border-l-4 border-l-cyan-300 rounded-sm ">
                          <div>
                            <div className="flex gap-2">
                              <ExclamationCircleOutlined className="text-xl text-cyan-300" />
                              <h1 className="text-xl text-cyan-300">
                                Demo Info
                              </h1>
                            </div>
                            <div>
                              <p>
                                These are custom fields. You can change them or
                                create your own.
                              </p>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24} className="mt-3">
                        <div className="form-item">
                          <label className="font-semibold">Total Budget <span className="text-rose-500">*</span></label>
                          <Field
                            name="totalBudget"
                            as={Input}
                                placeholder="Enter Total Budget"
                            className="mt-1"
                          />
                          <ErrorMessage
                            name="totalBudget"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24}>
                        <div className="form-item mt-3  ">
                          <label className="font-semibold">Target Date <span className="text-rose-500">*</span></label>
                          <DatePicker
                            className="w-full mt-1"
                            format="DD-MM-YYYY"
                            value={values.targetDate}
                            onChange={(date) =>
                              setFieldValue("targetDate", date)
                            }
                            onBlur={() => setFieldTouched("targetDate", true)}
                          />
                          <ErrorMessage
                            name="targetDate"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div>
                      <Col span={24} className="mt-3">
                        <div className="form-item mt-3">
                          <label className="font-semibold">Content Type <span className="text-rose-500">*</span></label>
                          <Field name="contentType">
                            {({ field }) => (
                              <Select
                                {...field}
                                className="w-full mt-1"
                                placeholder="Select Content Type"
                                onChange={(value) =>
                                  setFieldValue("contentType", value)
                                }
                                value={values.contentType}
                                onBlur={() =>
                                  setFieldTouched("contentType", true)
                                }
                              >
                                <Option value="Article">Article</Option>
                                <Option value="blog">Blog Post</Option>
                                <Option value="script">Script</Option>
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage
                            name="category"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24} className="mt-3 border-b pb-3">
                        <div className="form-item">
                          <label className="font-semibold">Brand Name <span className="text-rose-500">*</span></label>
                          <Field
                            name="brandName"
                            as={Input}
                            placeholder="Enter Brand Name"
                            className="w-full mt-1"
                          />
                          <ErrorMessage
                            name="brandName"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                  </>
                )}
              </Col>

              <Col className="mt-2">
                <h5 className="flex">
                  <h1 className="text-rose-500">*</h1> Required
                </h5>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-4">
              <Button
                type="default"
                htmlType="submit"
                className="mr-2"
                onClick={() => navigate("/app/apps/project/lead")}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </div>

            {/* Modals */}
            <Modal
              title="Add New Tag"
              open={isTagModalVisible}
              onCancel={() => setIsTagModalVisible(false)}
              onOk={() => handleAddNewLable("tag", newTag, setNewTag, setIsTagModalVisible, setFieldValue)}
              okText="Add Tag"
            >
              <Input
                placeholder="Enter new tag name"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
            </Modal>

            <Modal
              title="Add New Category"
              open={isCategoryModalVisible}
              onCancel={() => setIsCategoryModalVisible(false)}
              onOk={() => handleAddNewLable("category", newCategory, setNewCategory, setIsCategoryModalVisible, setFieldValue)}
              okText="Add Category"
            >
              <Input
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </Modal>

            <Modal
              title="Add New Status"
              open={isStatusModalVisible}
              onCancel={() => setIsStatusModalVisible(false)}
              onOk={() => handleAddNewLable("status", newStatus, setNewStatus, setIsStatusModalVisible, setFieldValue)}
              okText="Add Status"
            >
              <Input
                placeholder="Enter new status name"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
            </Modal>

            <Modal
              title="Add Lead Stage"
              visible={isAddLeadStageModalVisible}
              onCancel={closeAddLeadStageModal}
              footer={null}
              width={700}
            >
              <AddLeadStages onClose={closeAddLeadStageModal} />
            </Modal>

            <Modal
              title="Add New Currency"
              visible={isAddCurrencyModalVisible}
              onCancel={() => setIsAddCurrencyModalVisible(false)}
              footer={null}
              width={600}
            >
              <AddCurrencies
                onClose={() => {
                  setIsAddCurrencyModalVisible(false);
                  dispatch(getcurren()); // Refresh currency list after adding
                }}
              />
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

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditLead;

<style jsx>{`
  .currency-select .ant-select-selection-item {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 16px !important;
  }

  .currency-select .ant-select-selection-item > div {
    display: flex !important;
    align-items: center !important;
  }

  .currency-select .ant-select-selection-item span:not(:first-child) {
    display: none !important;
  }

  .ant-select-dropdown .ant-select-item {
    padding: 8px 12px !important;
  }

  .ant-select-dropdown .ant-select-item-option-content > div {
    display: flex !important;
    align-items: center !important;
    width: 100% !important;
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

  .phone-input {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  .phone-input:focus {
    border-color: #d9d9d9 !important;
    box-shadow: none !important;
  }

  .phone-input:hover {
    border-color: #d9d9d9 !important;
  }
`}</style>

