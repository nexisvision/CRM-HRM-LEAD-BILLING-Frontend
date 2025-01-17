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
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Editpro, GetProject } from "./projectReducer/ProjectSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { GetTagspro, AddTags } from "./tagReducer/TagSlice";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const EditProject = ({ id, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    project_name: "",
    startdate: null,
    enddate: null,
    projectimage: "",
    client: "",
    budget: "",
    estimatedmonths: "",
    project_description: "",
    tag: "",
    status: "",
  };

  const validationSchema = Yup.object({
    project_name: Yup.string().optional("Please enter a Project Name."),
    startdate: Yup.date().nullable().optional("Start date is required."),
    enddate: Yup.date().nullable().optional("End date is required."),
    projectimage: Yup.mixed().optional("Please upload a Project Image."),
    client: Yup.string().optional("Please select Client."),
    budget: Yup.number()
      .optional("Please enter a Project Budget.")
      .positive("Budget must be positive."),
    estimatedmonths: Yup.number()
      .optional("Please enter Estimated Hours.")
      .positive("Hours must be positive."),
    project_description: Yup.string().optional(
      "Please enter a Project Description."
    ),
    tag: Yup.string().optional("Please enter a Tag."),
    status: Yup.string().optional("Please select Status."),
  });

  const onSubmit = (values) => {
    dispatch(Editpro({ id, values }))
      .then(() => {
        dispatch(GetProject());
        message.success("Project updated successfully!");
        onClose();
      })
      .catch((error) => {
        message.error("Failed to update employee.");
        console.error("Edit API error:", error);
      });
  };
  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetProject());
  }, [dispatch]);

  const allempdata = useSelector((state) => state.Project);
  const AllEmployee = useSelector((state) => state.employee);
  const employeedata = AllEmployee.employee.data;

  const projectdata = allempdata.Project.data;
  const [singleEmp, setSingleEmp] = useState(null);

  useEffect(() => {
    if (id && projectdata.length > 0) {
      const project = projectdata.find((item) => item.id === id);
      if (project) {
        setSingleEmp(project);
      }
    }
  }, [id, projectdata]);

  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    dispatch(GetTagspro());
  }, [dispatch]);

  const Tagsdetail = useSelector((state) => state.Tags);
  const AllTags = Tagsdetail?.Tags?.data;

  const handleAddNewTag = async () => {
    if (!newTag.trim()) {
      message.error("Please enter a tag name");
      return;
    }

    try {
      await dispatch(AddTags({ name: newTag }));
      message.success("Tag added successfully");
      setNewTag("");
      setIsTagModalVisible(false);
      dispatch(GetTagspro());
    } catch (error) {
      console.error("Failed to add tag:", error);
      message.error("Failed to add tag");
    }
  };

  return (
    <div className="add-job-form">
      <Formik
        initialValues={singleEmp || initialValues}
        // validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
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
                    value={values.startDate ? moment(values.startDate) : null}
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
                    value={values.endDate ? moment(values.endDate) : null}
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

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Client</label>
                  <Field name="client">
                    {({ field }) => (
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Select User"
                        loading={!employeedata}
                        value={values.client}
                        onChange={(value) => setFieldValue("user", value)}
                        onBlur={() => setFieldTouched("user", true)}
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
                    value={values.project_description}
                    onChange={(value) =>
                      setFieldValue("project_description", value)
                    }
                    placeholder="Enter project_description"
                    onBlur={() => setFieldTouched("project_description", true)}
                  />
                  <ErrorMessage
                    name="project_description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Tag</label>
                  <div className="flex gap-2">
                    <Field name="tag">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full"
                          placeholder="Select or add new tag"
                          onChange={(value) => form.setFieldValue("tag", value)}
                          onBlur={() => form.setFieldTouched("tag", true)}
                          value={values.tag}
                          dropdownRender={(menu) => (
                            <div>
                              {menu}
                              <div
                                style={{
                                  padding: "8px",
                                  borderTop: "1px solid #e8e8e8",
                                }}
                              >
                                <Button
                                  type="link"
                                  icon={<PlusOutlined />}
                                  onClick={() => setIsTagModalVisible(true)}
                                  block
                                >
                                  Add New Tag
                                </Button>
                              </div>
                            </div>
                          )}
                        >
                          {AllTags &&
                            AllTags.map((tag) => (
                              <Option key={tag.id} value={tag.name}>
                                {tag.name}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </Field>
                  </div>
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
                Update Project
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Add Tag Modal */}
      <Modal
        title="Add New Tag"
        visible={isTagModalVisible}
        onCancel={() => setIsTagModalVisible(false)}
        onOk={handleAddNewTag}
        okText="Add Tag"
      >
        <Input
          placeholder="Enter new tag name"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default EditProject;
