import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Switch,
  Upload,
  Modal,
  Checkbox,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

import { useNavigate, useParams } from "react-router-dom";

import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { EditTasks, GetTasks } from "./TaskReducer/TaskSlice";
import { useDispatch } from "react-redux";
import moment from "moment";
import { AddLable, GetLable } from "./LableReducer/LableSlice";

const { Option } = Select;

const EditTask = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
  const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);

  const { id } = useParams();

    const [isPriorityModalVisible, setIsPriorityModalVisible] = useState(false);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [newPriority, setNewPriority] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newStatus, setNewStatus] = useState("");
    // const [priorites, setTags] = useState([]);
  
    const [priorities, setPriorities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);


  // const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const [initialValues, setInitialValues] = useState({
    taskTitle: "",
    TaskCategory: "",
    projectName: "",
    taskDate: null,
    dueDate: null,
    AssignTo: [],
    taskDescription: "",
  });

  const validationSchema = Yup.object({
    taskTitle: Yup.string().required("Please enter TaskName."),
    TaskCategory: Yup.string().required("Please enter TaskCategory."),
    projectName: Yup.string().required("Please enter Project."),
    taskDate: Yup.date().nullable().required("Date is required."),
    dueDate: Yup.date().nullable().required("Date is required."),
    AssignTo: Yup.array().min(1, "Please select at least one AssignTo."),
    taskDescription: Yup.string().required("Please enter a Description."),
  });

  const allempdata = useSelector((state) => state.Tasks);
  const Expensedata = allempdata?.Tasks?.data || [];

 const AllLoggedData = useSelector((state) => state.user);


  useEffect(() => {
    if (idd) {
      const milestone = Expensedata.find((item) => item.id === idd);

      if (milestone) {
        const updatedValues = {
          taskName: milestone.taskName || "",
          category: milestone.category || "",
          projectName: milestone.projectName || "",
          startDate: milestone.startDate ? moment(milestone.startDate) : null, // Ensure date values are compatible with DatePicker
          dueDate: milestone.dueDate ? moment(milestone.dueDate) : null,
          AssignTo: milestone.AssignTo || [],
          description: milestone.description || "",
          status: milestone.status || "",
          priority: milestone.priority || "",
        };

        setInitialValues(updatedValues); // Update the initial values state
      } else {
        message.error("Task not found!");
      }
    }
  }, [idd, Expensedata]); // Dependencies ensure this runs when `idd` or `Expensedata` changes




  const fetchLables = async (lableType, setter) => {
    try {
      const lid = AllLoggedData.loggedInUser.id; // User ID to fetch specific labels
      const response = await dispatch(GetLable(id)); // Fetch all labels
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
    fetchLables("priority", setPriorities);
    fetchLables("category", setCategories);
    fetchLables("status", setStatuses);
  }, []);





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
      await dispatch(AddLable({ id, payload })); // Add new label
      message.success(`${lableType} added successfully.`);
      setter(""); // Reset input field
      modalSetter(false); // Close modal
      await fetchLables(lableType, lableType === "priority" ? setPriorities : lableType === "category" ? setCategories : setStatuses); // Re-fetch labels
    } catch (error) {
      console.error(`Failed to add ${lableType}:`, error);
      message.error(`Failed to add ${lableType}.`);
    }
  };




  const onSubmit = (values, { resetForm }) => {
    dispatch(EditTasks({ idd, values }))
      .then(() => {
        dispatch(GetTasks());
        message.success("Expenses added successfully!");

        onClose();
      })
      .catch((error) => {
        message.error("Failed to update Employee.");
        console.error("Edit API error:", error);
      });
  };

  const handleCheckboxChange = () => {
    setIsWithoutDueDate(!isWithoutDueDate);
  };

  const toggleOtherDetails = () => {
    setIsOtherDetailsVisible(!isOtherDetailsVisible);
  };

  return (
    <div className="add-expenses-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Task Name</label>
                  <Field
                    name="taskTitle"
                    as={Input}
                    // value={values.taskName}
                    placeholder="Enter taskTitle"
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="taskTitle"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Task Category</label>
                  <Field name="TaskCategory">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select TaskCategory"
                        className="w-full mt-2"
                        onChange={(value) =>
                          setFieldValue("TaskCategory", value)
                        }
                        value={values.category}
                        onBlur={() => setFieldTouched("TaskCategory", true)}
                        allowClear={false}
                      >
                        <Option value="Task Category">Task Category</Option>
                        <Option value="Task Category">Task Category</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="TaskCategory"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}



<Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Category</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new category"
                    value={values.category}
                    onChange={(value) => setFieldValue("category", value)}
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



              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Project</label>
                  <Field
                    name="projectName"
                    as={Input}
                    placeholder="Enter projectName"
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="projectName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={8} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold ">StartDate</label>
                  <DatePicker
                    name="taskDate"
                    className="w-full mt-2"
                    placeholder="Select taskDate"
                    onChange={(value) => setFieldValue("taskDate", value)}
                    // value={values.startDate}
                    onBlur={() => setFieldTouched("taskDate", true)}
                  />
                  <ErrorMessage
                    name="taskDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={8} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold ">DueDate</label>
                  <DatePicker
                    name="dueDate"
                    className="w-full mt-2"
                    placeholder="Select DueDate"
                    onChange={(value) => setFieldValue("dueDate", value)}
                    // value={values.dueDate}
                    onBlur={() => setFieldTouched("dueDate", true)}
                  />
                  <ErrorMessage
                    name="dueDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">AssignTo</label>
                  <Field name="AssignTo">
                    {({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        placeholder="Select AssignTo"
                        className="w-full mt-2"
                        onChange={(value) => setFieldValue("AssignTo", value)}
                        value={values.AssignTo}
                        onBlur={() => setFieldTouched("AssignTo", true)}
                        allowClear={false}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="AssignTo"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Description</label>
                  <ReactQuill
                    value={values.description}
                    onChange={(value) =>
                      setFieldValue("taskDescription", value)
                    }
                    placeholder="Enter taskDescription"
                    onBlur={() => setFieldTouched("taskDescription", true)}
                  />
                  <ErrorMessage
                    name="taskDescription"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* <Col span={9}>
                <div className="form-item">
                  <label className="font-semibold mb-2">Status</label>
                  <Field name="taskStatus">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        onChange={(value) => setFieldValue("taskStatus", value)}
                        value={values.status}
                      >
                        <Option value="Incomplete">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                            Incomplete
                          </div>
                        </Option>
                        <Option value="To Do">To Do</Option>
                        <Option value="In Progress">Doing</Option>
                        <Option value="Completed">Completed</Option>
                        <Option value="On Hold">Waiting Approval</Option>
                      </Select>
                    )}
                  </Field>
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



              {/* <Col span={10}>
                <div className="form-item">
                  <label className="font-semibold">Priority</label>
                  <Field name="taskPriority">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        onChange={(value) =>
                          setFieldValue("taskPriority", value)
                        }
                        value={values.priority}
                      >
                        <Option value="Medium">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                            Medium
                          </div>
                        </Option>
                        <Option value="High">High</Option>
                        <Option value="Low">Low</Option>
                      </Select>
                    )}
                  </Field>
                </div>
              </Col> */}

<Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Priority</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new Priority"
                    value={values.priority}
                    onChange={(value) => setFieldValue("priority", value)}
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={() => setIsPriorityModalVisible(true)}
                          >
                            Add New priority
                          </Button>
                        </div>
                      </div>
                    )}
                  >
                    {priorities.map((priority) => (
                      <Option key={priority.id} value={priority.name}>
                        {priority.name}
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage name="tag" component="div" className="error-message text-red-500 my-1" />
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

 <Modal
                    title="Add New priority"
                    open={isPriorityModalVisible}
                    onCancel={() => setIsPriorityModalVisible(false)}
                    onOk={() => handleAddNewLable("priority", newPriority, setNewPriority, setIsPriorityModalVisible)}
                    okText="Add priority"
                  >
                    <Input
                      placeholder="Enter new priority name"
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
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

export default EditTask;
