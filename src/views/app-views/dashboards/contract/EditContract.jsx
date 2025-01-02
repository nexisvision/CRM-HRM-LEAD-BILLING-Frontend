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

const { Option } = Select;

const EditContract = ({ id, onClose }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = useState({
    subject: "",
    client: "",
    project: "",
    type: "",
    startDate: null,
    endDate: null,
    value: "",
    description: "",
    // options: [],
  });
  const validationSchema = Yup.object({
    subject: Yup.string().optional("Please enter a Subject Name."),
    client: Yup.string().optional("Please select Client."),
    project: Yup.mixed().optional("Please select Projects."),
    type: Yup.string().optional("Please enter Contract Value ."),
    startDate: Yup.date().nullable().optional("Start date is required."),
    endDate: Yup.date().nullable().optional("End date is required."),
    value: Yup.number()
      .optional("Please Select a contractvalue.")
      .positive("Contract Value must be positive."),
    description: Yup.string().optional("Please enter a Description."),
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
        message.success("Project added successfully!");
        onClose();
      })
      .catch((error) => {
        message.error("Failed to update employee.");
        console.error("Edit API error:", error);
      });
  };

  const AllProject = useSelector((state) => state.Project);
  const filPro = AllProject.Project.data;

  const AllSubclient = useSelector((state) => state?.SubClient);
  const filsubc = AllSubclient?.SubClient?.data;

  const AllContract = useSelector((state) => state?.Contract);
  const filcon0 = AllContract?.Contract?.data;

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
              <Col span={24}>
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
                  <label className="font-semibold">Job Description</label>
                  <ReactQuill
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                    placeholder="Enter Job Description"
                  />
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

export default EditContract;
