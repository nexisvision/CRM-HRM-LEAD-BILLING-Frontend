import React, { useState, useEffect, useCallback } from "react";
import { Input, Button, Select, message, Row, Col, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { GetLeads, LeadsAdd } from "./LeadReducers/LeadSlice";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { GetLable, AddLablee } from "../project/milestone/LableReducer/LableSlice";
import { getstages } from "../systemsetup/LeadStages/LeadsReducer/LeadsstageSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { getallcountries } from "views/app-views/setting/countries/countriesreducer/countriesSlice";
import AddLeadStages from "../systemsetup/LeadStages/AddLeadStages";
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";
import AddCurrencies from "views/app-views/setting/currencies/AddCurrencies";
import AddCountries from "views/app-views/setting/countries/AddCountries";

const { Option } = Select;

const validationSchema = Yup.object().shape({
  leadTitle: Yup.string()
    .trim()
    .required('Lead title is required')
    .min(3, 'Lead title must be at least 3 characters')
    .max(100, 'Lead title must not exceed 100 characters'),
  firstName: Yup.string()
    .trim()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: Yup.string()
    .trim()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  email: Yup.string()
    .trim()
    .email('Invalid email format')
    .max(100, 'Email must not exceed 100 characters'),
  phoneCode: Yup.string()
    .required('Country code is required'),
  telephone: Yup.string()
    .trim()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  company_name: Yup.string()
    .trim()
    .max(100, 'Company name must not exceed 100 characters'),
  leadStage: Yup.string()
    .required('Lead stage is required'),
  leadValue: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, 'Lead value must be greater than or equal to 0')
    .nullable(),
  currency: Yup.string()
    .when(['leadValue'], {
      is: (leadValue) => leadValue && leadValue > 0,
      then: () => Yup.string().required('Currency is required when lead value is provided'),
      otherwise: () => Yup.string().nullable()
    }),
  employee: Yup.string()
    .nullable(),
  status: Yup.string()
    .trim()
    .required('Status is required'),
  source: Yup.string()
    .nullable(),
  category: Yup.string()
    .nullable(),
  tag: Yup.string()
    .nullable(),
});

const initialValues = {
  leadTitle: "",
  firstName: "",
  lastName: "",
  email: "",
  company_name: "",
  phoneCode: "+91",
  telephone: "",
  leadStage: "",
  currency: "",
  leadValue: "",
  employee: "",
  source: "",
  status: "",
  category: "",
  tag: "",
};

const AddLead = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const roles = useSelector((state) => state.role?.role?.data);
  const userRole = roles?.find(role => role.id === loggedInUser.role_id);
  const empData = useSelector((state) => state.Users?.Users?.data || []);
  const countries = useSelector((state) => state.countries.countries || []);
  const currencies = useSelector((state) => state.currencies?.currencies?.data || []);
  const leadStages = useSelector((state) => state.StagesLeadsDeals?.StagesLeadsDeals?.data || []);
  const filterdatas = leadStages.filter(item => item.stageType === "lead");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [sources, setSources] = useState([]);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isAddLeadStageModalVisible, setIsAddLeadStageModalVisible] = useState(false);
  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);
  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);
  const [isAddSourceModalVisible, setIsAddSourceModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newSource, setNewSource] = useState("");

  const employee = empData.filter(emp => {
    if (userRole?.role_name === 'client') {
      return emp.client_id === loggedInUser.id;
    }
    return emp.client_id === loggedInUser.client_id;
  });

  const fetchLables = useCallback(async (lableType, setter) => {
    try {
      const lid = loggedInUser.id;
      const response = await dispatch(GetLable(lid));
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
  }, [dispatch, loggedInUser.id]);

  useEffect(() => {
    const fetchInitialData = async () => {
      await dispatch(empdata());
      await dispatch(GetUsers());
      await dispatch(getstages());
      await dispatch(getallcountries());
      await dispatch(getcurren());
    };
    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    if (loggedInUser?.id) {
      const fetchAllLabels = async () => {
        await fetchLables("tag", setTags);
        await fetchLables("category", setCategories);
        await fetchLables("status", setStatuses);
        await fetchLables("source", setSources);
      };
      fetchAllLabels();
    }
  }, [loggedInUser?.id, fetchLables]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const transformedValues = {
        ...values,
        currency: values.currency || null,
        leadValue: values.leadValue || null,
        employee: values.employee || undefined,
        source: values.source || null,
        category: values.category || null,
        tag: values.tag || null,
        phoneCode: values.phoneCode || "+91",
        leadStage: values.leadStage,
        status: values.status,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        company_name: values.company_name.trim(),
        telephone: values.telephone,
        client_id: loggedInUser.client_id,
        created_by: loggedInUser.username,
        assigned: values.employee
      };

      await dispatch(LeadsAdd(transformedValues));
      message.success("Lead added successfully!");
      resetForm();
      onClose();
      dispatch(GetLeads());
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to add lead");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setFieldValue('telephone', value);
    }
  };

  const handleAddNewLable = async (lableType, newValue, setter, modalSetter, setFieldValue) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
      const lid = loggedInUser.id;
      const payload = {
        name: newValue.trim(),
        lableType,
      };

      const response = await dispatch(AddLablee({ lid, payload }));

      if (response.payload && response.payload.success) {
        message.success(`${lableType} added successfully.`);

        const labelsResponse = await dispatch(GetLable(lid));
        if (labelsResponse.payload && labelsResponse.payload.data) {
          const filteredLables = labelsResponse.payload.data
            .filter((lable) => lable.lableType === lableType)
            .map((lable) => ({ id: lable.id, name: lable.name.trim() }));

          switch (lableType) {
            case "tag":
              setTags(filteredLables);
              if (setFieldValue) setFieldValue("tag", newValue.trim());
              break;
            case "category":
              setCategories(filteredLables);
              if (setFieldValue) setFieldValue("category", newValue.trim());
              break;
            case "status":
              setStatuses(filteredLables);
              if (setFieldValue) setFieldValue("status", newValue.trim());
              break;
            case "source":
              setSources(filteredLables);
              if (setFieldValue) setFieldValue("source", newValue.trim());
              break;
            default:
              break;
          }
        }

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

  const openAddLeadStageModal = () => {
    setIsAddLeadStageModalVisible(true);
  };

  const closeAddLeadStageModal = () => {
    setIsAddLeadStageModalVisible(false);
  };

  const LeadValueField = ({ field, form }) => (
    <div className="form-group mt-1">
      <div className="flex gap-0">
        <Field name="currency">
          {({ field }) => (
            <Select
              {...field}
              className="currency-select"
              style={{
                width: '70px',
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: 0,
                backgroundColor: '#f8fafc',
              }}
              placeholder={<span className="text-gray-400">₹</span>}
              onChange={(value) => {
                if (value === 'add_new') {
                  setIsAddCurrencyModalVisible(true);
                } else {
                  form.setFieldValue("currency", value || null);
                }
              }}
              value={form.values.currency || null}
              allowClear
              dropdownStyle={{ minWidth: '180px' }}
              suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
            >
              {currencies?.map((currency) => (
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
                width: 'calc(100% - 70px)'
              }}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                  form.setFieldValue('leadValue', value || null);
                }
              }}
            />
          )}
        </Field>
      </div>
      <ErrorMessage name="leadValue" component="div" className="text-red-500 mt-1 text-sm" />
      <ErrorMessage name="currency" component="div" className="text-red-500 mt-1 text-sm" />
    </div>
  );

  return (
    <div className="add-job-form">
      
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
          errors,
          touched,
        }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <div className="pb-3 pr-3">
                <h2 className="text-xl font-semibold text-gray-700">Create Lead</h2>
                <div className="mb-2 border-b pb-[10px] font-medium"></div>
            </div>
            
            <div className="bg-white border rounded mb-3">
              <div className="border-b px-4 py-2">
                <h4 className="text-base font-medium text-gray-700">Lead Information</h4>
              </div>
              <div className="p-4">
                <Row gutter={16}>
                  <Col span={24}>
                    <div className="form-item">
                      <label className="font-semibold flex">
                        Lead Title <span className="text-rose-500"> *</span>
                      </label>
                      <Field
                        name="leadTitle"
                        as={Input}
                        className={`mt-1 ${touched.leadTitle && errors.leadTitle ? 'border-red-500' : ''}`}
                        placeholder="Enter Lead Title"
                        onChange={(e) => {
                          setFieldValue('leadTitle', e.target.value);
                          setFieldTouched('leadTitle', true);
                        }}
                      />
                      <ErrorMessage
                        name="leadTitle"
                        component="div"
                        className="error-message text-red-500 text-sm"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-3">
                    <div className="form-item">
                      <label htmlFor="leadStage" className="font-semibold flex">
                        Lead Stage <span className="text-rose-500"> *</span>
                      </label>
                      <Field name="leadStage">
                        {({ field, form }) => (
                          <Select
                            {...field}
                            id="leadStage"
                            className={`w-full mt-1 ${touched.leadStage && errors.leadStage ? 'border-red-500' : ''}`}
                            placeholder="Select Lead Stage"
                            onChange={(value) => {
                              form.setFieldValue("leadStage", value);
                              setFieldTouched("leadStage", true);
                            }}
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
                            {filterdatas.map((stage) => (
                              <Option key={stage.id} value={stage.id}>
                                {stage.stageName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage
                        name="leadStage"
                        component="div"
                        className="error-message text-red-500 text-sm"
                      />
                    </div>
                  </Col>

                  <Col span={12} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold">Lead Value </label>
                      <Field name="leadValue" component={LeadValueField} />
                    </div>
                  </Col>

                  <Col span={24} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold">Assigned </label>
                      <Field name="employee">
                        {({ field, form }) => (
                          <Select
                            {...field}
                            className={`w-full mt-1 ${touched.employee && errors.employee ? 'border-red-500' : ''}`}
                            placeholder="Select Employee"
                            onChange={(value) => {
                              form.setFieldValue("employee", value);
                              setFieldTouched("employee", true);
                            }}
                            value={field.value || undefined}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
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
                      <ErrorMessage
                        name="employee"
                        component="div"
                        className="error-message text-red-500 text-sm"
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="bg-white border rounded mb-3">
              <div className="border-b px-4 py-2">
                <h4 className="text-base font-medium text-gray-700">Contact & Company Information</h4>
              </div>
              <div className="p-4">
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="form-item">
                      <label className="font-semibold flex">
                        First Name <span className="text-rose-500"> *</span>
                      </label>
                      <Field
                        name="firstName"
                        as={Input}
                        className={`mt-1 ${touched.firstName && errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="Enter First Name"
                        onChange={(e) => {
                          setFieldValue('firstName', e.target.value);
                          setFieldTouched('firstName', true);
                        }}
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="error-message text-red-500 text-sm"
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="form-item">
                      <label className="font-semibold flex">
                        Last Name <span className="text-rose-500"> *</span>
                      </label>
                      <Field
                        name="lastName"
                        as={Input}
                        className={`mt-1 ${touched.lastName && errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Enter Last Name"
                        onChange={(e) => {
                          setFieldValue('lastName', e.target.value);
                          setFieldTouched('lastName', true);
                        }}
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="error-message text-red-500 text-sm"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold">Email Address </label>
                      <Field
                        name="email"
                        as={Input}
                        className={`mt-1 ${touched.email && errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter Email Address"
                        onChange={(e) => {
                          setFieldValue('email', e.target.value);
                          setFieldTouched('email', true);
                        }}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="error-message text-red-500 text-sm"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-3">
                    <div className="form-group">
                      <label className="font-semibold">Telephone <span className="text-red-500">*</span></label>
                      <div className="flex gap-0 mt-1">
                        <Field name="phoneCode">
                          {({ field }) => (
                            <Select
                              {...field}
                              className={`currency-select ${touched.phoneCode && errors.phoneCode ? 'border-red-500' : ''}`}
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
                              className={`price-input ${touched.telephone && errors.telephone ? 'border-red-500' : ''}`}
                              style={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                borderLeft: '1px solid #d9d9d9',
                                width: 'calc(100% - 80px)'
                              }}
                              type="number"
                              placeholder="Enter telephone number"
                              onChange={(e) => {
                                handlePhoneNumberChange(e, setFieldValue);
                                setFieldTouched('telephone', true);
                              }}
                            />
                          )}
                        </Field>
                      </div>
                      <ErrorMessage name="telephone" component="div" className="text-red-500 mt-1 text-sm" />
                    </div>
                  </Col>
                  <Col span={24} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold">Company Name </label>
                      <Field
                        name="company_name"
                        as={Input}
                        className={`mt-1 ${touched.company_name && errors.company_name ? 'border-red-500' : ''}`}
                        placeholder="Enter Company Name"
                        onChange={(e) => {
                          setFieldValue('company_name', e.target.value);
                          setFieldTouched('company_name', true);
                        }}
                      />
                      <ErrorMessage
                        name="company_name"
                        component="div"
                        className="error-message text-red-500 text-sm"
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="bg-white border rounded mb-3">
              <div className="border-b px-4 py-2">
                <h4 className="text-base font-medium text-gray-700">Classification & Tags</h4>
              </div>
              <div className="p-4">
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="form-item">
                      <label className="font-semibold flex">
                        Status <span className="text-rose-500">*</span>
                      </label>
                      <Field name="status">
                        {({ field }) => (
                          <Select
                            {...field}
                            className={`w-full mt-1 ${touched.status && errors.status ? 'border-red-500' : ''}`}
                            placeholder="Select or add new status"
                            onChange={(value) => {
                              setFieldValue("status", value);
                              setFieldTouched("status", true);
                            }}
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
                        className="error-message text-red-500 text-sm"
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="form-item">
                      <label className="font-semibold">Source</label>
                      <Field name="source">
                        {({ field }) => (
                          <Select
                            {...field}
                            className={`w-full mt-1 ${touched.source && errors.source ? 'border-red-500' : ''}`}
                            placeholder="Select source"
                            onChange={(value) => {
                              setFieldValue("source", value || null);
                              setFieldTouched("source", true);
                            }}
                            value={values.source || null}
                            allowClear
                            onBlur={() => setFieldTouched("source", true)}
                            dropdownRender={(menu) => (
                              <div>
                                {menu}
                                <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                                  <Button
                                    type="link"
                                    icon={<PlusOutlined />}
                                    className="w-full mt-2"
                                    onClick={() => setIsAddSourceModalVisible(true)}
                                  >
                                    Add New Source
                                  </Button>
                                </div>
                              </div>
                            )}
                          >
                            {sources.map((source) => (
                              <Option key={source.id} value={source.id}>
                                {source.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage
                        name="source"
                        component="div"
                        className="error-message text-red-500 text-sm"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold">Category</label>
                      <Field name="category">
                        {({ field }) => (
                          <Select
                            {...field}
                            className={`w-full mt-1 ${touched.category && errors.category ? 'border-red-500' : ''}`}
                            placeholder="Select or add new category"
                            onChange={(value) => {
                              setFieldValue("category", value);
                              setFieldTouched("category", true);
                            }}
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
                        className="error-message text-red-500 text-sm"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold">Tag</label>
                      <Field name="tag">
                        {({ field }) => (
                          <Select
                            {...field}
                            className={`w-full mt-1 ${touched.tag && errors.tag ? 'border-red-500' : ''}`}
                            placeholder="Select or add new tag"
                            onChange={(value) => {
                              setFieldValue("tag", value);
                              setFieldTouched("tag", true);
                            }}
                            value={values.tag}
                            onBlur={() => setFieldTouched("tag", true)}
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
                        name="tag"
                        component="div"
                        className="error-message text-red-500 text-sm"
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="form-buttons text-right mt-3">
              <Button
                type="default"
                htmlType="button"
                className="mr-2"
                onClick={() => navigate("/app/apps/project/lead")}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </div>

            {/* Modals */}
            <Modal
              title="Add New Tag"
              visible={isTagModalVisible}
              onCancel={() => setIsTagModalVisible(false)}
              onOk={() => handleAddNewLable("tag", newTag, setNewTag, setIsTagModalVisible, setFieldValue)}
              okText="Add Tag"
            >
              <Input
                placeholder="Enter new tag name"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddNewLable("tag", newTag, setNewTag, setIsTagModalVisible, setFieldValue);
                  }
                }}
              />
            </Modal>

            <Modal
              title="Add New Category"
              visible={isCategoryModalVisible}
              onCancel={() => setIsCategoryModalVisible(false)}
              onOk={() => handleAddNewLable("category", newCategory, setNewCategory, setIsCategoryModalVisible, setFieldValue)}
              okText="Add Category"
            >
              <Input
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddNewLable("category", newCategory, setNewCategory, setIsCategoryModalVisible, setFieldValue);
                  }
                }}
              />
            </Modal>

            <Modal
              title="Add New Status"
              visible={isStatusModalVisible}
              onCancel={() => setIsStatusModalVisible(false)}
              onOk={() => handleAddNewLable("status", newStatus, setNewStatus, setIsStatusModalVisible, setFieldValue)}
              okText="Add Status"
            >
              <Input
                placeholder="Enter new status name"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddNewLable("status", newStatus, setNewStatus, setIsStatusModalVisible, setFieldValue);
                  }
                }}
              />
            </Modal>

            <Modal
              title={<div className="text-base">Add Lead Stage</div>}
              visible={isAddLeadStageModalVisible}
              onCancel={closeAddLeadStageModal}
              footer={null}
              width={600}
              bodyStyle={{ padding: '16px' }}
            >
              <AddLeadStages onClose={closeAddLeadStageModal} />
            </Modal>

            <Modal
              title={<div className="text-base">Add Currency</div>}
              visible={isAddCurrencyModalVisible}
              onCancel={() => setIsAddCurrencyModalVisible(false)}
              footer={null}
              width={600}
              bodyStyle={{ padding: '16px' }}
            >
              <AddCurrencies
                onClose={() => {
                  setIsAddCurrencyModalVisible(false);
                  dispatch(getcurren());
                }}
              />
            </Modal>

            <Modal
              title={<div className="text-base">Add Country</div>}
              visible={isAddPhoneCodeModalVisible}
              onCancel={() => setIsAddPhoneCodeModalVisible(false)}
              footer={null}
              width={600}
              bodyStyle={{ padding: '16px' }}
            >
              <AddCountries
                onClose={() => {
                  setIsAddPhoneCodeModalVisible(false);
                  dispatch(getallcountries());
                }}
              />
            </Modal>

            <Modal
              title="Add New Source"
              visible={isAddSourceModalVisible}
              onCancel={() => setIsAddSourceModalVisible(false)}
              onOk={() => handleAddNewLable("source", newSource, setNewSource, setIsAddSourceModalVisible, setFieldValue)}
              okText="Add Source"
            >
              <Input
                placeholder="Enter new source name"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddNewLable("source", newSource, setNewSource, setIsAddSourceModalVisible, setFieldValue);
                  }
                }}
              />
            </Modal>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddLead;

<style jsx>{`
  /* Form field base styles */
  .ant-input,
  .ant-select-selector,
  .ant-picker,
  .ant-input-number,
  .ant-input-affix-wrapper,
  .ant-btn {
    height: 40px !important;
    border-radius: 6px !important;
    display: flex !important;
    align-items: center !important;
  }

  /* Select field styles */
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    height: 40px !important;                                                
    padding: 4px 11px !important;
    display: flex !important;
    align-items: center !important;
  }

  .ant-select-selection-search-input {
    height: 38px !important;
  }

  /* Currency select specific styles */
  .currency-select .ant-select-selector {
    height: 40px !important;
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    background-color: #f8fafc !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-right: 0 !important;
  }

  .currency-select .ant-select-selection-item {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 16px !important;
    line-height: 32px !important;
  }

  /* Price input styles */
  .price-input {
    height: 40px !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  /* Remove number input spinners */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none !important;
    margin: 0 !important;
  }

  input[type="number"] {
    -moz-appearance: textfield !important;
  }

  /* DatePicker styles */
  .ant-picker {
    width: 100% !important;
  }

  /* Dropdown menu styles */
  .ant-select-dropdown {
    padding: 4px !important;
  }

  .ant-select-dropdown .ant-select-item {
    padding: 8px 12px !important;
    border-radius: 4px !important;
  }

  .ant-select-item-option-content {
    display: flex !important;
    align-items: center !important;
  }

  /* Form group spacing */
  .form-group {
    margin-bottom: 16px !important;
  }

  /* Label styles */
  .form-group label {
    display: block !important;
    margin-bottom: 8px !important;
    font-weight: 500 !important;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .ant-input,
    .ant-select-selector,
    .ant-picker,
    .ant-input-number,
    .ant-input-affix-wrapper,
    .ant-btn {
      height: 44px !important; /* Slightly larger on mobile for better touch targets */
    }
  }
`}</style>

