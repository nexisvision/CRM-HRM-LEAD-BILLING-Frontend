import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddCon, ContaractData } from "./ContractReducers/ContractSlice";
import { GetProject } from "../project/project-list/projectReducer/ProjectSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { getcurren } from "../../setting/currencies/currenciesSlice/currenciesSlice";
import { getallcountries } from "views/app-views/setting/countries/countriesreducer/countriesSlice";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import { GetLable, AddLable } from "../sales/LableReducer/LableSlice";

const { Option } = Select;

const AddContract = ({ onClose }) => {
  const dispatch = useDispatch();

  const allloggeduser = useSelector((state)=>state.user.loggedInUser.username)

  const countries = useSelector((state) => state.countries?.countries);

  const { currencies } = useSelector((state) => state.currencies);

  const curr = currencies?.data || [];
  
  const user = useSelector((state) => state.user.loggedInUser.username);

  const [isContracttypeModalVisible, setIsContracttypeModalVisible] = useState(false);
  const [newContracttype, setNewContracttype] = useState("");
  const [contracttypes, setContracttypes] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getcurren());
    dispatch(getallcountries());
  }, []);

  useEffect(() => {
    dispatch(GetProject());
    dispatch(ClientData());
  }, [dispatch]);

  useEffect(() => {
    fetchLables("contracttype", setContracttypes);
  }, []);

  const initialValues = {
    subject: "",
    client: "",
    project: "",
    type: "",
    currency: "",
    phoneCode: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    state: "",
    zipcode: "",
    startDate: "",
    endDate: "",
    value: "",
    notes: "",
    description: "",
  };

  const validationSchema = Yup.object().shape({
    subject: Yup.string().required("Please enter a Subject Name."),
    client: Yup.string().required("Please select a Client."),
    project: Yup.string().required("Please select a Project."),
    type: Yup.string().required("Please enter Contract Type."),
    address: Yup.string().required("Please enter a Address."),
    phoneCode: Yup.string().required("Please select a Country Code."),
    phone: Yup.string()
      .required("Please enter a Phone Number.")
      .matches(/^\d+$/, "Phone number must contain only digits")
      .min(6, "Phone number must be at least 6 digits")
      .max(15, "Phone number must not exceed 15 digits"),
    city: Yup.string().required("Please enter a City."),
    notes: Yup.string().required("Please enter Notes."),
    country: Yup.string().required("Please select a Country."),
    state: Yup.string().required("Please enter a State."),
    currency: Yup.string().required("Please select Contract currency."),
    startDate: Yup.date()
      .required("Start date is required.")
      .nullable()
      .test("startDate", "Start date cannot be in the past", function(value) {
        if (!value) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today;
      }),
    endDate: Yup.date()
      .required("End date is required.")
      .nullable()
      .test("endDate", "End date must be after start date", function(value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        return value > startDate;
      }),
    zipcode: Yup.string()
      .required("Please enter a Zip Code.")
      .matches(/^\d+$/, "Zip code must contain only digits")
      .min(5, "Zip code must be at least 5 digits")
      .max(10, "Zip code must not exceed 10 digits"),
    value: Yup.number()
      .required("Please enter a Contract Value.")
      .positive("Contract Value must be positive.")
      .min(0.01, "Contract Value must be greater than 0")
      .typeError("Contract Value must be a number"),
    description: Yup.string()
      .required("Please enter a Description.")
      .min(10, "Description must be at least 10 characters long"),
  });

  const onSubmit = (values, { resetForm }) => {
    const formattedValues = {
      ...values,
      startDate: values.startDate ? values.startDate.toISOString() : null,
      endDate: values.endDate ? values.endDate.toISOString() : null,
      phone: values.phoneCode + values.phone,
      value: values.value ? parseFloat(values.value) : 0
    };

    console.log("Submitting values:", formattedValues);
    
    dispatch(AddCon(formattedValues))
      .unwrap()
      .then(() => {
        dispatch(ContaractData());
        resetForm();
        onClose();
      })
      .catch((error) => {
        message.error("Failed to add Contract: " + (error.message || "Unknown error"));
        console.error("Add API error:", error);
      });
  };

  const Clientdata = useSelector((state) => state.SubClient);
  const filtersubclient = Clientdata.SubClient.data || [];

  const clientdata = filtersubclient?.filter((item) => item.created_by === allloggeduser);



  const Projectdtaa = useSelector((state) => state.Project);
  const filterprojectdata = Projectdtaa.Project.data || [];


  const projectdata = filterprojectdata?.filter((item) => item.created_by === allloggeduser);


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

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 15) {
      setFieldValue('phone', value);
    }
  };

  const handleClientChange = (clientId, setFieldValue) => {
    setFieldValue("client", clientId);
    const associatedProjects = filterprojectdata.filter(
      (project) => project.client === clientId
    );
    setFilteredProjects(associatedProjects);
    setFieldValue("project", ""); // Reset project selection when client changes
  };

  return (
    <div className="add-contract-form">
       <h2 className="mb-4 border-b pb-2 font-medium"></h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, setFieldValue, values,setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Subject <span className="text-red-500">*</span></label>
                  <Field
                    name="subject"
                    className="mt-1"
                    as={Input}
                    placeholder="Enter Subject Name"
                  />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Phone <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <Select
                      style={{ width: '30%', marginRight: '8px' }}
                      placeholder="Code"
                      className="mt-1"
                      name="phoneCode"
                      onChange={(value) => setFieldValue('phoneCode', value)}
                    >
                      {countries.map((country) => (
                        <Option key={country.id} value={country.phoneCode}>
                          (+{country.phoneCode})
                        </Option>
                      ))}
                    </Select>
                    <Field name="phone">
                      {({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          className="mt-1"
                          style={{ width: '70%' }}
                          placeholder="Enter phone"
                          onChange={(e) => handlePhoneNumberChange(e, setFieldValue)}
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Address <span className="text-red-500">*</span></label>
                    <Field name="address" className="mt-1" as={Input} placeholder="Enter Address" />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">City <span className="text-red-500">*</span></label>
                  <Field
                    name="city"
                    className="mt-1"
                    as={Input}
                    placeholder="Enter City Name"
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
                  <label className="font-semibold">Country <span className="text-red-500">*</span></label>
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
                  <label className="font-semibold">State <span className="text-red-500">*</span></label>
                  <Field
                    name="state"
                    className="mt-1"
                    as={Input}
                    placeholder="Enter State Name"
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
                  <label className="font-semibold">Zip Code <span className="text-red-500">*</span></label>
                  <Field
                    name="zipcode"
                    className="mt-1"
                    type="number"
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
                  <label className="font-semibold">Client <span className="text-red-500">*</span></label>
                  <Field name="client">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Client"
                        onChange={(value) => handleClientChange(value, setFieldValue)}
                        value={values.client}
                      >
                        {clientdata && clientdata.length > 0 ? (
                          clientdata.map((client) => (
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
                            const selectedCurrency = Array.isArray(curr) && 
                            curr.find((c) => c.id === value);
                            form.setFieldValue(
                              "currency",
                              selectedCurrency?.currencyCode || ""
                            );
                          }}
                        >
                          {Array.isArray(curr) && curr?.length > 0 ? (
                            curr.map((currency) => (
                              <Option key={currency.id} value={currency.id}>
                                {currency.currencyCode}
                                ({currency.currencyIcon})
                              </Option>
                            ))
                          ) : (
                            <Option value="" disabled>No Currencies Available</Option>
                          )}
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

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Projects <span className="text-red-500">*</span></label>
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
                                icon={<PlusOutlined /> }
                                onClick={() => setIsContracttypeModalVisible(true)}
                                className="w-full items-center flex"
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

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Contract Value <span className="text-red-500">*</span></label>
                  <Field name="value">
                    {({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        className="mt-1"
                        step="0.01"
                        min="0"
                        placeholder="Enter Contract Value"
                        onChange={(e) => {
                          const value = e.target.value;
                          setFieldValue('value', value ? parseFloat(value) : '');
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="value"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

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
                  <label className="font-semibold">Description <span className="text-red-500">*</span></label>
                  <Field name="description">
                    {({ field }) => (
                      <ReactQuill
                        className="mt-1"
                        value={field.value}
                        onChange={(value) => setFieldValue("description", value)}
                        placeholder="Enter description"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
                    
              <Col span={24} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Notes <span className="text-red-500">*</span></label>
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
                Create
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
    </div>
  );
};

export default AddContract;
