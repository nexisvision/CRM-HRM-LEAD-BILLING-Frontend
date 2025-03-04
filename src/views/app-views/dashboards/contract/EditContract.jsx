import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, Select, message, Row, Col, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import utils from "utils";
import OrderListData from "assets/data/order-list.data.json";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { ContaractData, Editcon } from "./ContractReducers/ContractSlice";
import { useDispatch } from "react-redux";
import moment from "moment";
import { getcurren } from "../../setting/currencies/currenciesSlice/currenciesSlice";
import { getallcountries } from "views/app-views/setting/countries/countriesreducer/countriesSlice";
import { GetLable, AddLable } from "../sales/LableReducer/LableSlice";
import AddCurrencies from '../../setting/currencies/AddCurrencies';
import AddCountries from "views/app-views/setting/countries/AddCountries";

const { Option } = Select;

const EditContract = ({ id, onClose }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const allloggeduser = useSelector((state)=>state.user.loggedInUser.username)


  const countries = useSelector((state) => state.countries.countries);
  const { currencies } = useSelector((state) => state.currencies);

  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

  const [isContracttypeModalVisible, setIsContracttypeModalVisible] = useState(false);
  const [newContracttype, setNewContracttype] = useState("");
  const [contracttypes, setContracttypes] = useState([]);
  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);

  const [filteredProjects, setFilteredProjects] = useState([]);
  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const getInitialCurrency = () => {
    if (fnddatass?.length > 0) {
      const usdCurrency = fnddatass.find(c => c.currencyCode === 'USD');
      return usdCurrency?.id || fnddatass[0]?.id;
    }
    return '';
  };

  const getInitialCountry = () => {
    if (countries?.length > 0) {
      const indiaCode = countries.find(c => c.countryCode === 'IN');
      return indiaCode?.phoneCode || "+91";
    }
    return "+91";
  };

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getcurren());
  }, []);

  useEffect(() => {
    fetchLables("contracttype", setContracttypes);
  }, []);

 

  const [initialValues, setInitialValues] = useState({
    subject: "",
    client: "",
    project: "",
    type: "",
    startDate: null,
    endDate: null,
    value: "",
    description: "",
    phone: "",
    phoneCode: getInitialCountry(),
    // contract_number: "",
    currency: getInitialCurrency(),
    address: "",
    city: "",
    country: "",
    state: "",
    zipcode: "",
    notes: "",
    // options: [],
  });
  const validationSchema = Yup.object({
    subject: Yup.string().required("Please enter a Subject Name."),
    client: Yup.string().required("Please select Client."),
    project: Yup.string().required("Please select Projects."),
    type: Yup.string().required("Please select Contract Type."),
    startDate: Yup.date().nullable().required("Start date is required."),
    endDate: Yup.date().nullable().required("End date is required."),
    value: Yup.number()
      .required("Please enter Contract Value.")
      .positive("Contract Value must be positive."),
    description: Yup.string().required("Please enter a Description."),
    phone: Yup.string().required("Please enter a Phone Number."),
    phoneCode: Yup.string().required("Please select Country Code."),
    currency: Yup.string().required("Please select Currency."),
    address: Yup.string().required("Please enter an address."),
    city: Yup.string().required("Please enter a City."),
    country: Yup.string().required("Please select Country."),
    state: Yup.string().required("Please enter a State."),
    zipcode: Yup.string().required("Please enter a Zip Code."),
    notes: Yup.string().required("Please enter Notes."),
  });

  const onSubmit = (values) => {
    // const payload = {
    //   ...values,
    //   startdate: values.startDate ? values.startDate.toISOString() : null,
    //   endDate: values.endDate ? values.endDate.toISOString() : null,
    // };
    // dispatch(Editcon(id, payload));
    // console.log("Submitted values:", payload);

    dispatch(Editcon({ id, values }))
      .then(() => {
        dispatch(ContaractData());
        // message.success("Project added successfully!");
        onClose();
      })
      .catch((error) => {
        // message.error("Failed to update employee.");
        console.error("Edit API error:", error);
      });
  };

  const AllProject = useSelector((state) => state.Project);
  const filPro = AllProject.Project.data;

  const AllSubclient = useSelector((state) => state?.SubClient);
  const filsubc = AllSubclient?.SubClient?.data;

  const AllContract = useSelector((state) => state?.Contract);
  const filcon0 = AllContract?.Contract?.data;

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, '');
    setFieldValue('phone', value);
  };

  const fetchLables = async (lableType, setter) => {
    try {
      const lid = allloggeduser;
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
  };

  const handleAddNewLable = async (lableType, newValue, setter, modalSetter) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
      const lid = allloggeduser;
      const payload = {
        name: newValue.trim(),
        lableType,
      };
      await dispatch(AddLable({ lid, payload }));
      message.success(`${lableType} added successfully.`);
      setter("");
      modalSetter(false);
      await fetchLables(lableType, setContracttypes);
    } catch (error) {
      console.error(`Failed to add ${lableType}:`, error);
      message.error(`Failed to add ${lableType}.`);
    }
  };

  const handleClientChange = (clientId, setFieldValue) => {
    setFieldValue("client", clientId);
    const associatedProjects = filPro.filter(
      (project) => project.client === clientId
    );
    setFilteredProjects(associatedProjects);
    setFieldValue("project", ""); // Reset project selection when client changes
  };

  useEffect(() => {
    const filcon = filcon0.find((item) => item.id === id);
    console.log("ioi", filcon);
    if (filcon) {
      setInitialValues({
        subject: filcon.subject || "",
        client: filcon.client || "",
        project: filcon.project || "",
        type: filcon.type || "",
        startDate: filcon.startDate ? moment(filcon.startDate) : null,
        endDate: filcon.endDate ? moment(filcon.endDate) : null,
        value: filcon.value || "",
        description: filcon.description || "",
        phone: filcon.phone || "",
        phoneCode: filcon.phoneCode || "",
        currency: filcon.currency || "",
        address: filcon.address || "",
        city: filcon.city || "",
        country: filcon.country || "",
        state: filcon.state || "",
        zipcode: filcon.zipcode || "",
        notes: filcon.notes || "",
      });

      // Set filtered projects based on the initial client
      const associatedProjects = filPro.filter(
        (project) => project.client === filcon.client
      );
      setFilteredProjects(associatedProjects);
    }
  }, [id, filcon0, filPro]);


  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, handleSubmit, handleChange,setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <h2 className="mb-4 border-b pb-2 font-medium"></h2>

            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Subject <span className="text-rose-500">*</span></label>
                  <Field
                    name="subject"
                    className="mt-1"
                    as={Input}
                    placeholder="Enter Subject Name"
                    rules={[{ required: true }]}
                  />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Contract Number</label>
                  <Field
                    name="contract_number"
                    as={Input}
                    placeholder="Enter Contract Number"
                  />
                  <ErrorMessage
                    name="contract_number"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}

<Col span={12}>
                <div className="form-group">
                  <label className="text-gray-600 font-semibold mb-2 block">Phone <span className="text-red-500">*</span></label>
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
                          // defaultValue={getInitialPhoneCode()}
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
                          // prefix={
                          //   values.phoneCode && (
                          //     <span className="text-gray-600 font-medium mr-1">
                          //       {values.phoneCode}
                          //     </span>
                          //   )
                          // }
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage name="phone" component="div" className="text-red-500 mt-1 text-sm" />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">address <span className="text-rose-500">*</span></label>
                    <Field name="address" as={Input} placeholder="Enter address" className="mt-1" />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">City <span className="text-rose-500">*</span></label>
                  <Field
                    name="city"
                    as={Input}
                    placeholder="Enter City Name"
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Country <span className="text-rose-500">*</span></label>
                  <Select
                    className="w-full mt-1"
                    placeholder="Select Country"
                    name="country"
                    onChange={(value) => setFieldValue('country', value)}
                    value={values.country}
                  >
                    {countries.map((country) => (
                      <Option key={country.id} value={country.countryName}>
                        {country.countryName}
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">State <span className="text-rose-500">*</span></label>
                  <Field
                    name="state"
                    as={Input}
                    placeholder="Enter State Name"
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Zip Code <span className="text-rose-500">*</span></label>
                  <Field
                    name="zipcode"
                    className="mt-1"
                    as={Input}
                    placeholder="Enter Zip Code"
                  />

                  <ErrorMessage
                    name="zipcode"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Client <span className="text-rose-500">*</span></label>
                  <Field name="client">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Client"
                        onChange={(value) => handleClientChange(value, setFieldValue)}
                        value={values.client}
                      >
                        {filsubc && filsubc.length > 0 ? (
                          filsubc.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.username || client.name || "Unnamed Client"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Client Available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>

                  <ErrorMessage
                    name="client"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                      <div className="form-group">
                        <label className="text-gray-600 font-semibold mb-2 block"> Currency <span className="text-red-500">*</span></label>
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
                                    setFieldValue("currency", value);
                                  }
                                }}
                                value={values.currency}
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
                          <Field name="value">
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
                                    form.setFieldValue('value', value);
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
                                  values.currency && (
                                    <span className="text-gray-600 font-medium mr-1">
                                      {fnddatass?.find(c => c.id === values.currency)?.currencyIcon}
                                    </span>
                                  )
                                }
                              />
                            )}
                          </Field>
                        </div>
                        <ErrorMessage name="value" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>
                    </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Projects <span className="text-rose-500">*</span></label>
                  <Field name="project">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Projects"
                        onChange={(value) => setFieldValue("project", value)}
                        value={values.project}
                      >
                        {filteredProjects && filteredProjects.length > 0 ? (
                          filteredProjects.map((project) => (
                            <Option key={project.id} value={project.id}>
                              {project.project_name || "Unnamed Project"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Projects Available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>

                  <ErrorMessage
                    name="project"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Contract Type <span className="text-red-500">*</span></label>
                  <Field name="type">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Contract Type"
                        onChange={(value) => setFieldValue("type", value)}
                        value={values.type}
                        dropdownRender={(menu) => (
                          <div>
                            {menu}
                            <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                              <Button
                                type="link"
                                icon={<PlusOutlined />}
                                onClick={() => setIsContracttypeModalVisible(true)}
                              >
                                Add New Type
                              </Button>
                            </div>
                          </div>
                        )}
                      >
                        {contracttypes.map((contracttype) => (
                          <Option key={contracttype.id} value={contracttype.name}>
                            {contracttype.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Contract Value <span className="text-rose-500">*</span></label>
                  <Field
                    name="value"
                    className="mt-1"
                    as={Input}
                    placeholder="Enter Contract Value "
                    type="number"
                  />
                  <ErrorMessage
                    name="value"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold ">StartDate <span className="text-rose-500">*</span></label>
                  <DatePicker
                    name="startDate"
                    className="w-full mt-1"
                    placeholder="Select startDate"
                    onChange={(value) => setFieldValue("startDate", value)}
                    value={values.startDate}
                    onBlur={() => setFieldTouched("startDate", true)}
                  />
                  <ErrorMessage
                    name="startDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                    <label className="font-semibold ">EndDate <span className="text-rose-500">*</span></label>
                  <DatePicker
                    name="endDate"
                    className="w-full mt-1"
                    placeholder="Select endDate"
                    onChange={(value) => setFieldValue("endDate", value)}
                    value={values.endDate}
                    onBlur={() => setFieldTouched("endDate", true)}
                  />
                  <ErrorMessage
                    name="endDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Description <span className="text-rose-500">*</span></label>
                  <ReactQuill
                    value={values.description}
                    className="mt-1"
                    onChange={(value) => setFieldValue("description", value)}
                    placeholder="Enter Description"

                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Notes <span className="text-rose-500">*</span></label>
                    <Field name="notes">
                      {({ field }) => (
                        <ReactQuill
                          {...field}
                          className="mt-1"
                          value={values.notes}
                          onChange={(value) =>
                            setFieldValue("notes", value)
                          }
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="notes"
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
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <Modal
        title="Add New Contract Type"
        visible={isContracttypeModalVisible}
        onCancel={() => setIsContracttypeModalVisible(false)}
        onOk={() => handleAddNewLable("contracttype", newContracttype, setNewContracttype, setIsContracttypeModalVisible)}
        okText="Add Type"
      >
        <Input
          placeholder="Enter new contract type"
          value={newContracttype}
          onChange={(e) => setNewContracttype(e.target.value)}
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


      {/* Add Currency Modal */}
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

      {/* Custom render for selected value */}
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
          // height: 32px !important;
          // padding: 0 8px !important;
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

        // .phone-input::-webkit-inner-spin-button,
        // .phone-input::-webkit-outer-spin-button {
        //   -webkit-appearance: none;
        //   margin: 0;
        // }

        // .phone-input {
        //   -moz-appearance: textfield;
        // }
      `}</style>

    </div>
  );
};

export default EditContract;
