import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, Select, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import utils from "utils";
import OrderListData from "assets/data/order-list.data.json";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddPro, GetProject } from "./projectReducer/ProjectSlice";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { ClientData } from "views/app-views/company/CompanyReducers/CompanySlice";

const { Option } = Select;

const AddProject = ({ onClose }) => {
  const navigate = useNavigate();
  const [list, setList] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  const Allclient = useSelector((state) => state.ClientData);
  const clientdata = Allclient.ClientData.data;

  const AllEmployee = useSelector((state) => state.employee);
  const employeedata = AllEmployee.employee.data;

  const initialValues = {
    project_name: "",
    startdate: null,
    enddate: null,
    // projectimage: "",
    client: "",
    user: "",
    budget: "",
    estimatedmonths: "",
    description: "",
    tag: "",
    status: "",
  };

  const validationSchema = Yup.object({
    project_name: Yup.string().required("Please enter a Project Name."),
    startdate: Yup.date().nullable().required("Start date is required."),
    enddate: Yup.date().nullable().required("End date is required."),
    // projectimage: Yup.mixed().required("Please upload a Project Image."),
    client: Yup.string().required("Please select Client."),
    user: Yup.string().required("Please select User."),
    budget: Yup.number()
      .required("Please enter a Project Budget.")
      .positive("Budget must be positive."),
    estimatedmonths: Yup.number()
      .required("Please enter Estimated Hours.")
      .positive("Hours must be positive."),
    description: Yup.string().required("Please enter a Project Description."),
    tag: Yup.string().required("Please enter a Tag."),
    status: Yup.string().required("Please select Status."),
  });

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddPro(values));
    resetForm();
    onClose();
    dispatch(GetProject());
    console.log("Submitted values:", values);
    message.success("Project added successfully!");
    navigate("/app/dashboards/project/list");
  };

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
          resetForm,
        }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <h2 className="mb-4 border-b pb-2 font-medium"></h2>

            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Project Name</label>
                  <Field
                    name="project_name"
                    as={Input}
                    placeholder="Enter Project Name"
                    rules={[{ required: true }]}
                  />
                  <ErrorMessage
                    name="project_name"
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
                    value={values.startdate}
                    onChange={(date) => setFieldValue("startdate", date)}
                    onBlur={() => setFieldTouched("startdate", true)}
                  />
                  <ErrorMessage
                    name="startdate"
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
                    value={values.enddate}
                    onChange={(date) => setFieldValue("enddate", date)}
                    onBlur={() => setFieldTouched("enddate", true)}
                  />
                  <ErrorMessage
                    name="enddate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Project Image</label>
                  <Input
                    type="file"
                    onChange={(event) =>
                      setFieldValue(
                        "projectimage",
                        event.currentTarget.files[0]
                      )
                    }
                    onBlur={() => setFieldTouched("projectimage", true)}
                  />
                  <ErrorMessage
                    name="projectimage"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Client</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select Client"
                    loading={!clientdata}
                    value={values.client} // Bind value to Formik's field
                    onChange={(value) => setFieldValue("client", value)} // Update Formik's field value
                    onBlur={() => setFieldTouched("client", true)} // Set touched state
                  >
                    {clientdata && clientdata.length > 0 ? (
                      clientdata.map((client) => (
                        <Option key={client.id} value={client.id}>
                          {client.firstName ||
                            client.username ||
                            "Unnamed Client"}
                        </Option>
                      ))
                    ) : (
                      <Option value="" disabled>
                        No Clients Available
                      </Option>
                    )}
                  </Select>
                  <ErrorMessage
                    name="client"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">User</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select User"
                    loading={!employeedata}
                    value={values.user} // Bind value to Formik's field
                    onChange={(value) => setFieldValue("user", value)} // Update Formik's field value
                    onBlur={() => setFieldTouched("user", true)} // Set touched state
                  >
                    {employeedata && employeedata.length > 0 ? (
                      employeedata.map((employee) => (
                        <Option key={employee.id} value={employee.id}>
                          {employee.firstName || "Unnamed User"}
                        </Option>
                      ))
                    ) : (
                      <Option value="" disabled>
                        No Users Available
                      </Option>
                    )}
                  </Select>
                  <ErrorMessage
                    name="user"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Budget</label>
                  <Field
                    name="budget"
                    as={Input}
                    type="number"
                    placeholder="Enter Project Budget"
                  />
                  <ErrorMessage
                    name="budget"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Estimated Hours</label>
                  <Field
                    name="estimatedmonths"
                    as={Input}
                    type="number"
                    placeholder="Enter Estimated Hours"
                  />
                  <ErrorMessage
                    name="estimatedmonths"
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
                    onBlur={() => setFieldTouched("description", true)}
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
                  <label className="font-semibold">Tag</label>
                  <Field
                    name="tag"
                    as={Input}
                    placeholder="Enter Project Tag"
                  />
                  <ErrorMessage
                    name="tag"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Status</label>
                  <Field name="status">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Status"
                        onChange={(value) => setFieldValue("status", value)}
                        value={values.status}
                        onBlur={() => setFieldTouched("status", true)}
                      >
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
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

export default AddProject;
