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
import moment from "moment";

const { Option } = Select;

const AddContract = ({ onClose }) => {
  const dispatch = useDispatch();


  const allloggeduser = useSelector((state)=>state.user.loggedInUser.username)

  const countries = useSelector((state) => state.countries?.countries);

  // const countrydata = countries?.filter((item) => item.created_by === allloggeduser);
 
  const { currencies } = useSelector((state) => state.currencies);

  const curr = currencies?.data || [];
  
  // const curren = curr?.filter((item) => item.created_by === allloggeduser);

  const user = useSelector((state) => state.user.loggedInUser.username);

  // const AllProject = useSelector((state) => state.Project);
  // const properdata = AllProject.Project.data;

  // const projectdata = properdata?.filter((item) => item.created_by === user);

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
    startDate: "",
    endDate: "",
    value: "",
    notes: "",
    description: "",
    // contract_number: "",
  };

  const validationSchema = Yup.object({
    subject: Yup.string().required("Please enter a Subject Name."),
    client: Yup.string().required("Please select a Client."),
    project: Yup.string().required("Please select a Project."),
    type: Yup.string().required("Please enter Contract Type."),
    address: Yup.string().required("Please enter a Address."),
    phoneCode: Yup.string().required("Please select a Country Code."),
    phone: Yup.string()
      .required("Please enter a Phone Number.")
      .matches(/^\d+$/, "Phone number must contain only digits"),
    city: Yup.string().required("Please enter a City."),
    notes: Yup.string().required("Please enter Notes."),
    contract_number: Yup.string().required("Please enter a Contract Number."),
    country: Yup.string().required("Please select a Country."),
    state: Yup.string().required("Please enter a State."),
    currency: Yup.string().required("Please select Contract currency."),
    startDate: Yup.date()
      .required("Start date is required.")
      .nullable()
      .test("startDate", "Start date cannot be in the past", function(value) {
        if (!value) return true;
        return moment(value).startOf('day').isSameOrAfter(moment().startOf('day'));
      }),
    endDate: Yup.date()
      .required("End date is required.")
      .nullable()
      .test("endDate", "End date must be after start date", function(value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        return moment(value).isAfter(moment(startDate));
      }),
    zipcode: Yup.number()
      .required("Please enter a Zip Code."),
    value: Yup.number()
      .required("Please enter a Contract Value.")
      .positive("Contract Value must be positive.")
      .typeError("Contract Value must be a number"),
    description: Yup.string()
      .required("Please enter a Description.")
      .min(10, "Description must be at least 10 characters long"),
  });

  const onSubmit = (values, { resetForm }) => {
    // Format dates to ISO string before sending
    const formattedValues = {
      ...values,
      startDate: values.startDate ? values.startDate.toISOString() : null,
      endDate: values.endDate ? values.endDate.toISOString() : null,
      phone: values.phoneCode + values.phone,
      // Ensure value is properly converted to number and not null
      value: values.value ? parseFloat(values.value) : 0
    };

    console.log("Submitting values:", formattedValues);
    
    dispatch(AddCon(formattedValues))
      .unwrap()
      .then(() => {
        dispatch(ContaractData());
        // message.success("Contract added successfully!");
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
  // const { currencies } = useSelector((state) => state.currencies);
  const Projectdtaa = useSelector((state) => state.Project);
  const filterprojectdata = Projectdtaa.Project.data || [];

  const projectdata = filterprojectdata?.filter((item) => item.created_by === allloggeduser);
  // const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getcurren());
    dispatch(getallcountries());
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
       <h2 className="mb-4 border-b pb-2 font-medium"></h2>

      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, setFieldValue, values }) => (
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
                        onChange={(value) => setFieldValue("client", value)}
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
                        {projectdata && projectdata.length > 0 ? (
                          projectdata.map((project) => (
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

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Start Date <span className="text-red-500">*</span></label>
                  <Field name="startDate">
                    {({ field }) => (
                      <DatePicker
                        className="w-full"
                        format="YYYY-MM-DD"
                        onChange={(date) => {
                          const formattedDate = date ? date.toDate() : null;
                          setFieldValue("startDate", formattedDate);
                        }}
                        value={values.startDate ? moment(values.startDate) : null}
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
                  <label className="font-semibold">End Date <span className="text-red-500">*</span></label>
                  <Field name="endDate">
                    {({ field }) => (
                      <DatePicker
                        className="w-full mt-1"
                        format="YYYY-MM-DD"
                        onChange={(date) => {
                          const formattedDate = date ? date.toDate() : null;
                          setFieldValue("endDate", formattedDate);
                        }}
                        value={values.endDate ? moment(values.endDate) : null}
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
    </div>
  );
};

export default AddContract;
