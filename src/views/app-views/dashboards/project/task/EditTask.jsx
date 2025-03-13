import React, { useCallback, useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Upload,
  Modal,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

import { useParams } from "react-router-dom";

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
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isPriorityModalVisible, setIsPriorityModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [priorities, setPriorities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [initialValues, setInitialValues] = useState({
    taskTitle: "",
    category: "",
    project: "",
    taskDate: null,
    dueDate: null,
    assignTo: [],
    description: "",
    status: "",
    priority: "",
    addfile: ""
  });

  const validationSchema = Yup.object({
    taskTitle: Yup.string().required("Please enter TaskName."),
    taskDate: Yup.date().nullable(),
    dueDate: Yup.date().nullable(),
    assignTo: Yup.array().min(1, "Please select at least one AssignTo."),
    description: Yup.string().required("Please enter a Description."),
    addfile: Yup.mixed().required("Please upload a file."),
  });
  const allempdatass = useSelector((state) => state.employee);
  const empData = allempdatass?.employee?.data || [];
  const loggeduser = useSelector((state) => state.user.loggedInUser.username || []);
  const fnduserdatas = empData.filter((item) => item.created_by === loggeduser);
  const allproject = useSelector((state) => state.Project);
  const fndrewduxxdaa = allproject.Project.data || [];
  const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    dispatch(GetTasks(id))
  }, [dispatch, id])

  const taskadata = useSelector((state) => state.Tasks.Tasks.data)

  useEffect(() => {
    if (idd) {
      const milestone = taskadata.find((item) => item.id === idd);


      if (milestone) {
        const assignToArray = typeof milestone.assignTo === 'string'
          ? JSON.parse(milestone.assignTo)
          : milestone.assignTo || [];

        const updatedValues = {
          taskTitle: milestone.taskName || "",
          category: milestone.category || "",
          project: milestone.project || "",
          taskDate: milestone.startDate ? moment(milestone.startDate) : null,
          dueDate: milestone.dueDate ? moment(milestone.dueDate) : null,
          assignTo: assignToArray,
          description: milestone.description || "",
          status: milestone.status || "",
          priority: milestone.priority || "",
        };

        setInitialValues(updatedValues);
      } else {
        message.error("Task not found!");
      }
    }
  }, [idd, taskadata]);




  const fetchLables = useCallback(async (lableType, setter) => {
    try {
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
  }, [dispatch, id]);

  useEffect(() => {
    fetchLables("priority", setPriorities);
    fetchLables("category", setCategories);
    fetchLables("status", setStatuses);
  }, [fetchLables]);


  const handleAddNewLable = async (lableType, newValue, setter, modalSetter) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
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

  // Handle file upload changes
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };


  const onSubmit = (values, { resetForm }) => {

    const formData = {
      taskName: values.taskTitle,
      category: values.category,
      project: values.project,
      startDate: values.taskDate ? values.taskDate.format('YYYY-MM-DD') : null,
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
      assignTo: values.assignTo,
      description: values.description,
      status: values.status,
      priority: values.priority,
    };

    Object.keys(values).forEach(key => {
      if (key !== 'Add File') {
        formData.append(key, values[key]);
      }
    });

    if (fileList[0]?.originFileObj) {
      formData.append('Add File', fileList[0].originFileObj);
    }

    dispatch(EditTasks({ idd, values: formData }))
      .then(() => {
        dispatch(GetTasks(id));
        message.success("Task updated successfully!");
        onClose();
      })
      .catch((error) => {
        message.error(error?.response?.data?.message || "Failed to update task.");
        console.error("Edit API error:", error);
      });
  };

  return (
    <div className="add-expenses-form">

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <div className="mb-3 border-b pb-[-10px] font-medium"></div>
            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Task Name <span className="text-red-500">*</span></label>
                  <Field
                    name="taskTitle"
                    as={Input}
                    value={values.taskTitle}
                    placeholder="Enter Task Title"
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="taskTitle"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>




              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Category <span className="text-red-500">*</span></label>
                  <Select
                    style={{ width: "100%" }}
                    className="mt-1"
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
                    name="category"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>



              {fnddata?.project_name && (
                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Project <span className="text-red-500">*</span></label>
                    <Field
                      value={fnddata.project_name}
                      name="project"
                      as={Input}
                      placeholder="Enter projectName"
                      className="mt-1"
                      disabled
                    />
                    <ErrorMessage
                      name="project"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
              )}

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Start Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    name="taskDate"
                    className="w-full mt-1"
                    placeholder="Select Start Date"
                    onChange={(value) => setFieldValue("taskDate", value)}
                    value={values.taskDate}
                    onBlur={() => setFieldTouched("taskDate", true)}
                  />
                  <ErrorMessage
                    name="taskDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Due Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    name="dueDate"
                    className="w-full mt-1"
                    placeholder="Select Due Date"
                    onChange={(value) => setFieldValue("dueDate", value)}
                    value={values.dueDate}
                    onBlur={() => setFieldTouched("dueDate", true)}
                  />
                  <ErrorMessage
                    name="dueDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">AssignTo</label>
                  <Field name="assignTo">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        mode="multiple"
                        placeholder="Select AddProjectMember"
                        onChange={(value) => setFieldValue("assignTo", value)}
                        value={values.assignTo}
                        onBlur={() => setFieldTouched("assignTo", true)}
                      >
                        {fnduserdatas && fnduserdatas.length > 0 ? (
                          fnduserdatas.map((client) => (
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
                    )}
                  </Field>
                  <ErrorMessage
                    name="assignTo"
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
                    className="mt-1"
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
                  <label className="font-semibold">Status <span className="text-red-500">*</span></label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new status"
                    value={values.status}
                    className="mt-1"
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





              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Priority <span className="text-red-500">*</span></label>
                  <Select
                    style={{ width: "100%" }}
                    className="mt-1"
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
                  <ErrorMessage name="priority" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <div className="mt-4 w-full">
                <span className="block font-semibold p-2">Add File</span>
                <Col span={24}>
                  <Upload
                    beforeUpload={() => false} // Prevent auto upload
                    listType="picture"
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxCount={1}
                    fileList={fileList}
                    onChange={handleFileChange}
                    showUploadList={{
                      showRemoveIcon: true,
                      showPreviewIcon: true,
                      className: "upload-list-inline"
                    }}
                    className="border-2 flex flex-col justify-center items-center p-10"
                  >
                    <Button icon={<UploadOutlined />}>Choose File</Button>
                  </Upload>
                </Col>
              </div>



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
