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

const { Option } = Select;

const AddContract = ({ onClose }) => {
  const dispatch = useDispatch();

  const initialValues = {
    subject: "",
    client: "",
    project: "",
    type: "",
    currency: "",
    startDate: null,
    endDate: null,
    value: "",
    description: "",
  };

  const validationSchema = Yup.object({
    subject: Yup.string().required("Please enter a Subject Name."),
    client: Yup.string().required("Please select a Client."),
    project: Yup.string().required("Please select a Project."),
    type: Yup.string().required("Please enter Contract Type."),
    type: Yup.string().required("Please enter Contract Type."),
    currency: Yup.string().required("Please enter Contract currency."),
    startDate: Yup.date().nullable().required("Start date is required."),
    endDate: Yup.date().nullable().required("End date is required."),
    value: Yup.number()
      .required("Please enter a Contract Value.")
      .positive("Contract Value must be positive."),
    description: Yup.string().required("Please enter a Description."),
  });

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddCon(values))
      .then(() => {
        dispatch(ContaractData()); // Refresh contract data
        message.success("Contract added successfully!");
        resetForm();
        onClose(); // Close modal
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
    dispatch(GetProject());
    dispatch(ClientData());
  }, [dispatch]);

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

              <Col span={12} className="">
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
                              {client.username || "Unnamed Client"}
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

              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Currency</label>
                  <Field name="currency">
                    {({ field, form }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        placeholder="Select Currency"
                        onChange={(value) => {
                          const selectedCurrency = currencies.find(c => c.id === value);
                          form.setFieldValue("currency", selectedCurrency?.currencyCode || '');
                        }}
                      >
                        {currencies?.map((currency) => (
                          <Option key={currency.id} value={currency.id}>
                            {currency.currencyCode}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="currency"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
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
