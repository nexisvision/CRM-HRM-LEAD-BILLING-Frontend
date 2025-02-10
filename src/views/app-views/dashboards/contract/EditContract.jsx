import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, Select, message, Row, Col } from "antd";
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

const { Option } = Select;

const EditContract = ({ id, onClose }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const countries = useSelector((state) => state.countries.countries);
  const { currencies } = useSelector((state) => state.currencies);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getcurren());
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
    phoneCode: "",
    // contract_number: "",
    currency: "",
    address: "",
    city: "",
    country: "",
    state: "",
    zipcode: "",
    notes: "",
    // options: [],
  });
  const validationSchema = Yup.object({
    subject: Yup.string().optional("Please enter a Subject Name."),
    client: Yup.string().optional("Please select Client."),
    project: Yup.mixed().optional("Please select Projects."),
    type: Yup.string().optional("Please enter Contract Value ."),
    startDate: Yup.date().nullable().optional("Start date is required."),
    endDate: Yup.date().nullable().optional("End date is required."),
    // contract_number: Yup.string().optional("Please enter a Contract Number."),
    value: Yup.number()
      .optional("Please Select a contractvalue.")
      .positive("Contract Value must be positive."),
    description: Yup.string().optional("Please enter a Description."),
    phone: Yup.string().optional("Please enter a Phone Number."),
    phoneCode: Yup.string().optional("Please select Country Code."),
    currency: Yup.string().optional("Please select Currency."),
    address: Yup.string().optional("Please enter a Address."),
    city: Yup.string().optional("Please enter a City."),
    country: Yup.string().optional("Please select Country."),
    state: Yup.string().optional("Please enter a State."),
    zipcode: Yup.string().optional("Please enter a Zip Code."),
    notes: Yup.string().optional("Please enter a Notes."),
    // options: Yup.array().min(1, 'Please select at least one option.'),
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
        // contract_number: filcon.contract_number || "",
        currency: filcon.currency || "",
        address: filcon.address || "",
        city: filcon.city || "",
        country: filcon.country || "",

        state: filcon.state || "",
        zipcode: filcon.zipcode || "",
        notes: filcon.notes || "",
      });
    }
  }, [id, filcon0]);


  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, handleSubmit, handleChange }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <h2 className="mb-4 border-b pb-2 font-medium"></h2>

            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Subject</label>
                  <Field
                    name="subject"
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
                <div className="form-item">
                  <label className="font-semibold">Phone</label>
                  <div className="flex">
                    <Select
                      style={{ width: '30%', marginRight: '8px' }}
                      placeholder="Code"
                      name="phoneCode"
                      value={values.phoneCode}
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

              <Col span={24} className="mt-4">
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
                        {filsubc && filsubc.length > 0 ? (
                          filsubc.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.username ||
                                client?.username ||
                                "Unnamed Client"}
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
                  <label className="font-semibold">Currency</label>
                  <div className="flex gap-2">
                    <Field name="currency">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full"
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
                        className="w-full"
                        placeholder="Select Projects"
                        onChange={(value) => setFieldValue("project", value)}
                        value={values.project}
                      >
                        {filPro && filPro.length > 0 ? (
                          filPro.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.project_name ||
                                client?.username ||
                                "Unnamed Client"}
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
                    name="user"
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
                    placeholder="Enter Contract Value "
                    type="number"
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
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.startDate}
                    onChange={(date) => setFieldValue("startDate", date)}
                  />
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
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.endDate}
                    onChange={(date) => setFieldValue("endDate", date)}
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
                  <label className="font-semibold">Description</label>
                  <ReactQuill
                    value={values.description}
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
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditContract;
