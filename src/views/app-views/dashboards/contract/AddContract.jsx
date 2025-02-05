import React, { useEffect } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
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

const { Option } = Select;

const AddContract = ({ onClose }) => {
  const dispatch = useDispatch();

  const countries = useSelector((state) => state.countries.countries);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

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
    startDate: null,
    endDate: null,
    value: "",
    notes: "",
    description: "",
    contract_number: "",
  };

  const validationSchema = Yup.object({
    subject: Yup.string().required("Please enter a Subject Name."),
    client: Yup.string().required("Please select a Client."),
    project: Yup.string().required("Please select a Project."),
    type: Yup.string().required("Please enter Contract Type."),
    address: Yup.string().required("Please enter a Address."),
    phoneCode: Yup.string().required("Please select a Country."),
    phone: Yup.string().required("Please enter a Phone Number."),
    city: Yup.string().required("Please enter a City."),
    notes: Yup.string().required("Please enter a Notes."),
    contract_number: Yup.string().required("Please enter a Contract Number."),
    country: Yup.string().required("Please select a Country."),
    state: Yup.string().required("Please enter a State."),
    currency: Yup.string().required("Please enter Contract currency."),
    startDate: Yup.date().nullable().required("Start date is required."),
    endDate: Yup.date().nullable().required("End date is required."),
    zipcode: Yup.string().required("Please enter a Zip Code."),
    value: Yup.number()
      .required("Please enter a Contract Value.")
      .positive("Contract Value must be positive."),
    description: Yup.string().required("Please enter a Description."),
  });

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddCon(values))
      .then(() => {
        dispatch(ContaractData());
        message.success("Contract added successfully!");
        resetForm();
        onClose();
      })
      .catch((error) => {
        message.error("Failed to add Contract.");
        console.error("Add API error:", error);
      });
  };

  const Clientdata = useSelector((state) => state.SubClient);
  const filtersubclient = Clientdata.SubClient.data;
  const { currencies } = useSelector((state) => state.currencies);
  const Projectdtaa = useSelector((state) => state.Project);
  const filterprojectdata = Projectdtaa.Project.data;
  // const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getcurren());
  }, []);

  useEffect(() => {
    dispatch(GetProject());
    dispatch(ClientData());
  }, [dispatch]);

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, '');
    setFieldValue('phone', value);
  };

  return (
    <div className="add-contract-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Subject</label>
                  <Field
                    name="subject"
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
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Phone</label>
                  <div className="flex">
                    <Select
                      style={{ width: '30%', marginRight: '8px' }}
                      placeholder="Code"
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

              <Col span={24} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Address</label>
                    <Field name="billing_address" as={Input} placeholder="Enter Address" />
                    <ErrorMessage
                      name="billing_address"

                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">City</label>
                  <Field
                    name="city"
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
                  <label className="font-semibold">Country</label>
                  <Select
                    className="w-full"
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
                  <label className="font-semibold">State</label>
                  <Field
                    name="state"
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
                  <label className="font-semibold">Zip Code</label>
                  <Field
                    name="zipcode"
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
                  <label className="font-semibold">Client</label>
                  <Field name="client">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Client"
                        onChange={(value) => setFieldValue("client", value)}
                        value={values.client}
                      >
                        {filtersubclient && filtersubclient.length > 0 ? (
                          filtersubclient.map((client) => (
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
                  <label className="font-semibold mb-2">Currency</label>
                  <div className="flex gap-2">
                    <Field name="currency">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-2"
                          placeholder="Select Currency"
                          onChange={(value) => {
                            const selectedCurrency = Array.isArray(currencies?.data) && 
                              currencies?.data?.find((c) => c.id === value);
                            form.setFieldValue(
                              "currency",
                              selectedCurrency?.currencyCode || ""
                            );
                          }}
                        >
                          {Array.isArray(currencies?.data) && currencies?.data?.length > 0 ? (
                            currencies.data.map((currency) => (
                              <Option key={currency.id} value={currency.id}>
                                {currency.currencyCode}
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
                  <label className="font-semibold">Projects</label>
                  <Field name="project">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        placeholder="Select Projects"
                        onChange={(value) => setFieldValue("project", value)}
                        value={values.project}
                      >
                        {filterprojectdata && filterprojectdata.length > 0 ? (
                          filterprojectdata.map((project) => (
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
                  <label className="font-semibold">Contract Type</label>
                  <Field name="type">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Contract Type"
                        onChange={(value) => setFieldValue("type", value)}
                        value={values.type}
                      >
                        <Option value="Marketing">Marketing</Option>
                        <Option value="Planning">Planning</Option>
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
                  <label className="font-semibold">Contract Value</label>
                  <Field
                    name="value"
                    as={Input}
                    placeholder="Enter Contract Value"
                    type="text"
                  />
                  <ErrorMessage
                    name="value"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Start Date</label>
                  <Field name="startDate">
                    {({ field }) => (
                      <DatePicker
                        className="w-full"
                        format="DD-MM-YYYY"
                        onChange={(date) => setFieldValue("startDate", date)}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="startDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">End Date</label>
                  <Field name="endDate">
                    {({ field }) => (
                      <DatePicker
                        className="w-full"
                        format="DD-MM-YYYY"
                        onChange={(date) => setFieldValue("endDate", date)}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="endDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Description</label>
                  <Field name="description">
                    {({ field }) => (
                      <ReactQuill
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
                    <label className="font-semibold">Notes</label>
                    <Field name="notes">
                      {({ field }) => (
                        <ReactQuill
                          {...field}
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
    </div>
  );
};

export default AddContract;
