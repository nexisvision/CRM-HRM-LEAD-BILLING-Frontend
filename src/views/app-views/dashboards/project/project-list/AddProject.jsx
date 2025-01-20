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
import utils from "utils";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddPro, GetProject } from "./projectReducer/ProjectSlice";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { PlusOutlined } from "@ant-design/icons";
import { GetTagspro, AddTags } from "./tagReducer/TagSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { AddLablee, GetLablee } from "../milestone/LableReducer/LableSlice";

const { Option } = Select;

const AddProject = ({ onClose }) => {
  const navigate = useNavigate();
  const [list, setList] = useState();
  const dispatch = useDispatch();
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [tags, setTags] = useState([]);

  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
 
 
  const AllLoggedData = useSelector((state) => state.user);


  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetTagspro());
  }, [dispatch]);

  const Tagsdetail = useSelector((state) => state.Tags);
  const AllTags = Tagsdetail?.Tags?.data;

  const Allclient = useSelector((state) => state.ClientData);
  const clientdata = Allclient.ClientData.data;
  

  const AllEmployee = useSelector((state) => state.employee);
  const employeedata = AllEmployee.employee.data;

  const AllLoggeddtaa = useSelector((state) => state.user);

  

  const initialValues = {
    project_name: "",
    project_category: "",
    startDate: null,
    endDate: null,
    // projectimage: "",
    client: "",
    user: "",
    budget: "",
    estimatedmonths: "",
    estimatedhours: "",
    project_description: "",
    tag: "",
    status: "",
  };

  const validationSchema = Yup.object({
    project_name: Yup.string().required("Please enter a Project Name."),

    project_category: Yup.string().required("Please enter a Category."),
    startDate: Yup.date().nullable().required("Start date is required."),
    endDate: Yup.date().nullable().required("End date is required."),
    // projectimage: Yup.mixed().required("Please upload a Project Image."),
    // client: Yup.string().required("Please select Client."),
    user: Yup.string().required("Please select User."),
    budget: Yup.number()
      .required("Please enter a Project Budget.")
      .positive("Budget must be positive."),
    estimatedmonths: Yup.number()
      .required("Please enter Estimated Months.")
      .positive("Months must be positive.")
      .integer("Months must be a whole number"),
    estimatedhours: Yup.number()
      .required("Please enter Estimated Hours.")
      .positive("Hours must be positive.")
      .integer("Hours must be a whole number"),
    project_description: Yup.string().required(
      "Please enter a Project Description."
    ),
    tag: Yup.string().required("Please enter a Tag."),
    status: Yup.string().required("Please select Status."),
  });

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddPro(values))
      .then(() => {
        dispatch(GetProject())
          .then(() => {
            message.success("Project added successfully!");
            resetForm();
            onClose();
          })
          .catch((error) => {
            message.error("Failed to fetch the latest project data.");
            console.error("Project Data API error:", error);
          });
      })
      .catch((error) => {
        message.error("Failed to add project.");
        console.error("AddProject API error:", error);
      });
  };

  useEffect(() => {
    const lid = AllLoggeddtaa.loggedInUser.id;
    GetLablee(lid);
  }, []);


  // const fetchLabels = async (labelType, setter) => {
  //   try {
  //     const lid = AllLoggedData.loggedInUser.id;
  //     const response = await dispatch(GetLablee(lid));
  //     if (response.payload && response.payload.data) {
  //       const filteredLabels = response.payload.data
  //         .filter((label) => label.labelType === labelType)
  //         .map((label) => ({ id: label.id, name: label.name.trim() }));
  //       setter(filteredLabels);
  //     }
  //   } catch (error) {
  //     console.error(`Failed to fetch ${labelType}:`, error);
  //     message.error(`Failed to load ${labelType}`);
  //   }
  // };

  // useEffect(() => {
  //   fetchLabels("tag", setTags);
  //   fetchLabels("category", setCategories);
  //   fetchLabels("status", setStatuses);
  // }, []);





  const fetchLables = async (lableType, setter) => {
    try {
      const lid = AllLoggedData.loggedInUser.id; // User ID to fetch specific labels
      const response = await dispatch(GetLablee(lid)); // Fetch all labels
      if (response.payload && response.payload.data) {
        const filteredLables = response.payload.data
          .filter((lable) => lable.lableType === lableType) // Filter by labelType
          .map((lable) => ({ id: lable.id, name: lable.name.trim() })); // Trim and format
        setter(filteredLables); // Update state
      }
    } catch (error) {
      console.error(`Failed to fetch ${lableType}:`, error);
      message.error(`Failed to load ${lableType}`);
    }
  };
  
  // Call fetchLabels for each labelType on mount
  useEffect(() => {
    fetchLables("tag", setTags);
    fetchLables("category", setCategories);
    fetchLables("status", setStatuses);
  }, []);






  // const handleAddNewLabel = async (labelType, newValue, setter, modalSetter) => {
  //   if (!newValue.trim()) {
  //     message.error(`Please enter a ${labelType} name.`);
  //     return;
  //   }

  //   try {
  //     const lid = AllLoggedData.loggedInUser.id;
  //     const payload = {
  //       name: newValue.trim(),
  //       labelType,
  //     };
  //     await dispatch(AddLablee({ lid, payload }));
  //     message.success(`${labelType} added successfully.`);
  //     setter("");
  //     modalSetter(false);
  //     await fetchLabels(labelType, labelType === "tag" ? setTags : labelType === "category" ? setCategories : setStatuses);
  //   } catch (error) {
  //     console.error(`Failed to add ${labelType}:`, error);
  //     message.error(`Failed to add ${labelType}.`);
  //   }
  // };







  const handleAddNewLable = async (lableType, newValue, setter, modalSetter) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }
  
    try {
      const lid = AllLoggedData.loggedInUser.id; // User ID
      const payload = {
        name: newValue.trim(), // Label name
        lableType, // Dynamic labelType
      };
      await dispatch(AddLablee({ lid, payload })); // Add new label
      message.success(`${lableType} added successfully.`);
      setter(""); // Reset input field
      modalSetter(false); // Close modal
      await fetchLables(lableType, lableType === "tag" ? setTags : lableType === "category" ? setCategories : setStatuses); // Re-fetch labels
    } catch (error) {
      console.error(`Failed to add ${lableType}:`, error);
      message.error(`Failed to add ${lableType}.`);
    }
  };







  // const fetchTags = async () => {
  //   try {
  //     const lid = AllLoggeddtaa.loggedInUser.id;
  //     const response = await dispatch(GetLablee(lid));

  //     if (response.payload && response.payload.data) {
  //       const uniqueTags = response.payload.data
  //         .filter((label) => label && label.name) // Filter out invalid labels
  //         .map((label) => ({
  //           id: label.id,
  //           name: label.name.trim(),
  //         }))
  //         .filter(
  //           (label, index, self) =>
  //             index === self.findIndex((t) => t.name === label.name)
  //         ); // Remove duplicates

  //       setTags(uniqueTags);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch tags:", error);
  //     message.error("Failed to load tags");
  //   }
  // };

  // const handleAddNewTag = async () => {
  //   if (!newTag.trim()) {
  //     message.error("Please enter a tag name");
  //     return;
  //   }

  //   try {
  //     const lid = AllLoggeddtaa.loggedInUser.id;
  //     const payload = {
  //       name: newTag.trim(),
  //       labelType: "tag",

  //     };

  //     await dispatch(AddLablee({ lid, payload }));
  //     message.success("Tag added successfully");
  //     setNewTag("");
  //     setIsTagModalVisible(false);

  //     // Fetch updated tags
  //     await fetchTags();
  //   } catch (error) {
  //     console.error("Failed to add tag:", error);
  //     message.error("Failed to add tag");
  //   }
  // };

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

              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Category</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new category"
                    value={values.project_category}
                    onChange={(value) => setFieldValue("project_category", value)}
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={() => setIsCategoryModalVisible(true)}
                          >
                            Add New Category
                          </Button>
                        </div>
                      </div>
                    )}
                  >
                    {categories.map((category) => (
                      <Option key={category.id} value={category.name}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage
                    name="project_category"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>








              {/* <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Category</label>
                  <Field
                    name="project_category"
                    as={Input}
                    placeholder="Enter Project project_category"
                    rules={[{ required: true }]}
                  />
                  <ErrorMessage
                    name="project_category"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Start Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.startDate}
                    onChange={(date) => setFieldValue("startDate", date)}
                    onBlur={() => setFieldTouched("startDate", true)}
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
                    onBlur={() => setFieldTouched("endDate", true)}
                  />
                  <ErrorMessage
                    name="endDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>



              <Col span={12} className="mt-4">
  <div className="form-item">
    <label className="font-semibold">Client</label>
    <Select
      style={{ width: "100%" }}
      placeholder="Select Client"
      loading={!clientdata}
      value={values.client} // Bind value to Formik's field
      // value="sdfsdf"
      onChange={(value) => setFieldValue("client", value)} // Update Formik's field value
      onBlur={() => setFieldTouched("client", true)} // Set touched state
    >
      {clientdata && clientdata.length > 0 ? (
        clientdata
          .filter(client => client.created_by === AllLoggedData.loggedInUser.username) // Filter clients based on created_by
          .map((client) => (
            <Option key={client.id} value={client.id}>
              {client.firstName || client.username || "Unnamed Client"}
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









              {/* <Col span={12} className="mt-4">
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
              </Col> */}

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
                          {employee.username || "Unnamed User"}
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

              <Col span={8} className="mt-4">
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

              <Col span={8} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Estimated Months</label>
                  <Field
                    name="estimatedmonths"
                    as={Input}
                    type="number"
                    placeholder="Enter Estimated Months"
                  />
                  <ErrorMessage
                    name="estimatedmonths"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={8} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Estimated Hours</label>
                  <Field
                    name="estimatedhours"
                    as={Input}
                    type="number"
                    placeholder="Enter Estimated Hours"
                  />
                  <ErrorMessage
                    name="estimatedhours"
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



              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Tag</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new tag"
                    value={values.tag}
                    onChange={(value) => setFieldValue("tag", value)}
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={() => setIsTagModalVisible(true)}
                          >
                            Add New Tag
                          </Button>
                        </div>
                      </div>
                    )}
                  >
                    {tags.map((tag) => (
                      <Option key={tag.id} value={tag.name}>
                        {tag.name}
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage name="tag" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>








              {/* <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Tag</label>
                  <div className="flex gap-2">
                    <Field name="tag">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full"
                          placeholder="Select or add new tag"
                          onChange={(value) => {
                            form.setFieldValue("tag", value);
                          }}
                          onBlur={() => form.setFieldTouched("tag", true)}
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
                          {tags.map((tag) => (
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
              </Col> */}

<Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Status</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new status"
                    value={values.status}
                    onChange={(value) => setFieldValue("status", value)}
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={() => setIsStatusModalVisible(true)}
                          >
                            Add New Status
                          </Button>
                        </div>
                      </div>
                    )}
                  >
                    {statuses.map((status) => (
                      <Option key={status.id} value={status.name}>
                        {status.name}
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>








              {/* <Col span={12} className="mt-4">
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
                        <Option value="pending">pending</Option>
                        <Option value="in_progress">in_progress</Option>
                        <Option value="completed">completed</Option>
                        <Option value="onhold">On Hold</Option>
                      </Select>
                    )}
                  </Field>

                  <ErrorMessage
                    name="status"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}
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

      {/* Add Tag Modal */}
      <Modal
              title="Add New Tag"
              open={isTagModalVisible}
              onCancel={() => setIsTagModalVisible(false)}
              onOk={() => handleAddNewLable("tag", newTag, setNewTag, setIsTagModalVisible)}
              okText="Add Tag"
            >
              <Input
                placeholder="Enter new tag name"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
            </Modal>

            {/* Add Category Modal */}
            <Modal
              title="Add New Category"
              open={isCategoryModalVisible}
              onCancel={() => setIsCategoryModalVisible(false)}
              onOk={() => handleAddNewLable("category", newCategory, setNewCategory, setIsCategoryModalVisible)}
              okText="Add Category"
            >
              <Input
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </Modal>

            {/* Add Status Modal */}
            <Modal
              title="Add New Status"
              open={isStatusModalVisible}
              onCancel={() => setIsStatusModalVisible(false)}
              onOk={() => handleAddNewLable("status", newStatus, setNewStatus, setIsStatusModalVisible)}
              okText="Add Status"
            >
              <Input
                placeholder="Enter new status name"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
            </Modal>
    </div>
  );
};

export default AddProject;
