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
                <div className="form-item">
                  <label className="font-semibold">Phone <span className="text-rose-500">*</span></label>
                  <div className="flex">
                    <Select
                      style={{ width: '30%', marginRight: '8px' }}
                      placeholder="Code"
                      className="mt-1"
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
                          className="mt-1"
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
                  <label className="font-semibold">Currency <span className="text-rose-500">*</span></label>
                  <div className="flex gap-2">
                    <Field name="currency">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
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
                  <label className="font-semibold">Contract Type <span className="text-rose-500">*</span></label>
                  <Field name="type">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
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
    </div>
  );
};

export default EditContract;
