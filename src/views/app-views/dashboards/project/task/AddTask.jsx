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
  Tag,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AddTaskk, GetTasks } from "./TaskReducer/TaskSlice";
import { useDispatch, useSelector } from "react-redux";
import { AddLable, GetLable } from "./LableReducer/LableSlice";
import { GetLeads } from "../../leads/LeadReducers/LeadSlice";
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";
import dayjs from "dayjs";

const { Option } = Select;

const AddTask = ({ onClose }) => {
  const dispatch = useDispatch();
  const [isPriorityModalVisible, setIsPriorityModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [setPriorities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [setStatuses] = useState([]);
  const [fileList, setFileList] = useState([]);
  const { id } = useParams();
  useSelector((state) => state.Leads.Leads || []);
  const allproject = useSelector((state) => state.Project);
  const fndrewduxxdaa = allproject.Project.data;
  const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);
  const allempdata = useSelector((state) => state.Users);
  const empData = allempdata?.Users?.data || [];
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const roles = useSelector((state) => state.role?.role?.data);
  const userRole = roles?.find((role) => role.id === loggedInUser.role_id);

  const fnduserdatas = empData.filter((emp) => {
    if (userRole?.role_name === "client") {
      return emp.client_id === loggedInUser.id;
    } else {
      return emp.client_id === loggedInUser.client_id;
    }
  });
  const initialValues = {
    taskName: "",
    category: "",
    project: fnddata?.id || "",
    lead: "",
    startDate: "",
    dueDate: "",
    assignTo: [],
    description: "",
    task_reporter: "",
    file: [],
    status: "To Do",
    priority: "Medium",
  };

  const validationSchema = Yup.object({
    taskName: Yup.string().required("Task Name is required"),
    category: Yup.string().required("Category is required"),
    project: Yup.string().required("Project is required"),
    startDate: Yup.date().nullable().required("Start Date is required"),
    dueDate: Yup.date()
      .nullable()
      .required("Due Date is required")
      .min(Yup.ref("startDate"), "Due Date must be after Start Date"),
    assignTo: Yup.array()
      .min(1, "Please select at least one assignee")
      .required("Please assign the task to someone"),
    description: Yup.string().required("Description is required"),
    priority: Yup.string().required("Priority is required"),
    status: Yup.string().required("Status is required"),
    task_reporter: Yup.string().required("Please select a Task Reporter."),
  });

  useEffect(() => {
    dispatch(GetUsers());

    dispatch(GetLeads());
  }, [dispatch]);

  const fetchLables = useCallback(
    async (lableType, setter) => {
      try {
        const response = await dispatch(GetLable(id));
        if (response.payload && response.payload.data) {
          const filteredLables = response.payload.data
            .filter((lable) => lable.lableType === lableType)
            .map((lable) => ({ id: lable.id, name: lable.name.trim() }));
          setter(filteredLables);
        }
      } catch (error) {
        console.error(`Failed to fetch ${lableType}:`, error);
        message.error(`Failed to load ${lableType}`);
      }
    },
    [dispatch, id]
  );
  useEffect(() => {
    fetchLables("category", setCategories);
    fetchLables("priority", setPriorities);
    fetchLables("status", setStatuses);
  }, [fetchLables]);

  const handleAddNewLable = async (
    lableType,
    newValue,
    setter,
    modalSetter,
    setFieldValue
  ) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
      const payload = {
        name: newValue.trim(),
        lableType,
      };
      await dispatch(AddLable({ id, payload }));
      message.success(`${lableType} added successfully.`);
      setter("");
      modalSetter(false);

      const response = await dispatch(GetLable(id));
      if (response.payload && response.payload.data) {
        const filteredLables = response.payload.data
          .filter((lable) => lable.lableType === lableType)
          .map((lable) => ({ id: lable.id, name: lable.name.trim() }));

        if (lableType === "category") {
          setCategories(filteredLables);
          setFieldValue("category", newValue.trim());
        } else if (lableType === "priority") {
          setPriorities(filteredLables);
          setFieldValue("priority", newValue.trim());
        } else if (lableType === "status") {
          setStatuses(filteredLables);
          setFieldValue("status", newValue.trim());
        }
      }
    } catch (error) {
      console.error(`Failed to add ${lableType}:`, error);
      message.error(`Failed to add ${lableType}.`);
    }
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      // Create assignTo object
      const assignToObject = {
        assignedUsers: Array.isArray(values.assignTo)
          ? values.assignTo.filter((id) => id && id.trim() !== "")
          : [],
      };

      // Format file data from fileList state
      const formattedFiles = fileList.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        // If you have a base64 or URL of the file, include it here
        // url: file.url || file.thumbUrl,
        status: "done",
      }));

      // Create the main payload object
      const payload = {
        taskName: values.taskName,
        category: values.category,
        project: values.project,
        lead: values.lead || "",
        startDate: values.startDate,
        dueDate: values.dueDate,
        assignTo: assignToObject,
        description: values.description,
        task_reporter: values.task_reporter,
        status: values.status,
        priority: values.priority,
        file: formattedFiles,
      };

      // Log the payload for debugging
      console.log("Submitting Task with payload:", payload);

      // Dispatch AddTaskk with payload
      dispatch(AddTaskk({ id, payload }))
        .then(() => {
          dispatch(GetTasks(id))
            .then(() => {
              message.success("Task added successfully!");
              resetForm();
              setFileList([]); // Reset file list
              onClose();
            })
            .catch((error) => {
              console.error("Failed to fetch tasks:", error);
              message.error("Failed to fetch the latest task data.");
            });
        })
        .catch((error) => {
          console.error("Failed to add task:", error);
          message.error("Failed to add task.");
        });
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("An error occurred while processing the form.");
    }
  };

  // Add uploadProps configuration
  const uploadProps = {
    name: "file",
    multiple: true,
    maxCount: 5,
    showUploadList: true,
    accept: ".jpg,.jpeg,.png,.pdf",
    customRequest: ({ onSuccess }) => {
      // Since we're handling the file list manually, just call onSuccess
      onSuccess();
    },
  };

  return (
    <div className="add-expenses-form">
      <Formik
        initialValues={{
          ...initialValues,
          files: [], // Add files to initial values
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <>
            <Form className="formik-form" onSubmit={handleSubmit}>
              <div className="mb-3 border-b pb-[-10px] font-medium"></div>
              <Row gutter={16}>
                <Col span={24}>
                  <div className="form-item">
                    <label className="font-semibold">
                      Task Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="taskName"
                      className="mt-1"
                      as={Input}
                      placeholder="Enter taskTitle"
                    />
                    <ErrorMessage
                      name="taskName"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={24} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Select
                      style={{ width: "100%" }}
                      className="mt-1"
                      placeholder="Select or add new category"
                      value={values.category}
                      onChange={(value) => setFieldValue("category", value)}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <div
                            style={{
                              padding: 8,
                              borderTop: "1px solid #e8e8e8",
                            }}
                          >
                            <Button
                              type="link"
                              icon={<PlusOutlined />}
                              className="w-full mt-2"
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
                  <Col span={24} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold">
                        Project <span className="text-red-500">*</span>
                      </label>
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
                    <label className="font-semibold">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full mt-1 p-2 border rounded"
                      value={values.startDate || ""}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        setFieldValue("startDate", selectedDate);

                        if (
                          values.dueDate &&
                          dayjs(values.dueDate).isBefore(selectedDate)
                        ) {
                          setFieldValue("dueDate", "");
                        }
                      }}
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
                    <label className="font-semibold">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full mt-1 p-2 border rounded"
                      value={values.dueDate || ""}
                      min={values.startDate || ""}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        setFieldValue("dueDate", selectedDate);
                      }}
                      onBlur={() => setFieldTouched("dueDate", true)}
                    />
                    <ErrorMessage
                      name="dueDate"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={24} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">
                      AssignTo <span className="text-rose-500">*</span>
                    </label>
                    <Field name="assignTo">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          mode="multiple"
                          placeholder="Select AddProjectMember"
                          onChange={(value) => {
                            const arrayValue = Array.isArray(value)
                              ? value
                              : [value];
                            setFieldValue("assignTo", arrayValue);
                          }}
                          value={values.assignTo}
                          onBlur={() => setFieldTouched("assignTo", true)}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) => {
                            if (!option?.children) return false;
                            return option.children
                              .toLowerCase()
                              .includes(input.toLowerCase());
                          }}
                        >
                          {Array.isArray(fnduserdatas) &&
                          fnduserdatas.length > 0 ? (
                            fnduserdatas.map((client) => {
                              const displayName =
                                client.firstName ||
                                client.username ||
                                "Unnamed Client";
                              return (
                                <Option key={client.id} value={client.id}>
                                  {displayName}
                                </Option>
                              );
                            })
                          ) : (
                            <Option value="" disabled>
                              No Members Available
                            </Option>
                          )}
                        </Select>
                      )}
                    </Field>
                    {/* Display selected users as tags */}
                    <div className="mt-2">
                      {Array.isArray(values.assignTo) &&
                        values.assignTo.length > 0 && (
                          <div className="selected-users">
                            {values.assignTo.map((userId) => {
                              const user = fnduserdatas.find(
                                (u) => u.id === userId
                              );
                              return (
                                user && (
                                  <Tag key={userId} className="mb-1 mr-1">
                                    {user.firstName ||
                                      user.username ||
                                      "Unnamed Client"}
                                  </Tag>
                                )
                              );
                            })}
                          </div>
                        )}
                    </div>
                    <ErrorMessage
                      name="assignTo"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">
                      Task Reporter <span className="text-rose-500">*</span>
                    </label>
                    <Field name="task_reporter">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          placeholder="Select Task Reporter"
                          onChange={(value) =>
                            setFieldValue("task_reporter", value)
                          }
                          value={values.task_reporter}
                        >
                          {Array.isArray(fnduserdatas) &&
                          fnduserdatas.length > 0 ? (
                            fnduserdatas.map((client) => (
                              <Option key={client.id} value={client.id}>
                                {client.firstName ||
                                  client.username ||
                                  "Unnamed Client"}
                              </Option>
                            ))
                          ) : (
                            <Option value="" disabled>
                              No Employee Available
                            </Option>
                          )}
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="task_reporter"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold mb-2">
                      Status <span className="text-rose-500">*</span>
                    </label>
                    <Field name="status">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          onChange={(value) => setFieldValue("status", value)}
                          value={values.status}
                        >
                          <Option value="Incomplete">
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                              Incomplete
                            </div>
                          </Option>
                          <Option value="To Do">
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                              To Do
                            </div>
                          </Option>
                          <Option value="In Progress">
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
                              In Progress
                            </div>
                          </Option>
                          <Option value="Completed">
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                              Completed
                            </div>
                          </Option>
                          <Option value="On Hold">
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                              Waiting Approval
                            </div>
                          </Option>
                        </Select>
                        // </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">
                      Priority <span className="text-rose-500">*</span>
                    </label>
                    <Field name="priority">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          onChange={(value) => setFieldValue("priority", value)}
                          value={values.priority}
                        >
                          <Option value="Medium">
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                              Medium
                            </div>
                          </Option>
                          <Option value="High">
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                              High
                            </div>
                          </Option>
                          <Option value="Low">
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                              Low
                            </div>
                          </Option>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="priority"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={24} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <ReactQuill
                      value={values.description}
                      className="mt-1"
                      onChange={(value) => setFieldValue("description", value)}
                      placeholder="Enter description"
                      onBlur={() => setFieldTouched("description", true)}
                    />
                    <ErrorMessage
                      name="description"
                      component="div mt-2"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                {/* File upload component */}
                <Col span={24}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attachment (Optional)
                    </label>
                    <Upload
                      {...uploadProps}
                      fileList={fileList}
                      onChange={({ fileList: newFileList }) => {
                        // Update fileList state when files are added or removed
                        setFileList(newFileList);
                      }}
                      beforeUpload={(file) => {
                        const isValidFileType = [
                          "image/jpeg",
                          "image/png",
                          "application/pdf",
                        ].includes(file.type);
                        const isValidFileSize = file.size / 1024 / 1024 < 5;

                        if (!isValidFileType) {
                          message.error(
                            "You can only upload JPG/PNG/PDF files!"
                          );
                          return Upload.LIST_IGNORE;
                        }
                        if (!isValidFileSize) {
                          message.error("File must be smaller than 5MB!");
                          return Upload.LIST_IGNORE;
                        }

                        // Don't actually upload, just add to fileList
                        return false;
                      }}
                      multiple={true}
                      maxCount={5}
                    >
                      <Button icon={<UploadOutlined />} className="bg-white">
                        Select File
                      </Button>
                      <span className="ml-2 text-gray-500 text-sm">
                        Supports: JPG, PNG, PDF (Max: 5MB)
                      </span>
                    </Upload>
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

            {/* Move Modals inside Formik render props to access setFieldValue */}
            <Modal
              title="Add New priority"
              open={isPriorityModalVisible}
              onCancel={() => setIsPriorityModalVisible(false)}
              onOk={() =>
                handleAddNewLable(
                  "priority",
                  newPriority,
                  setNewPriority,
                  setIsPriorityModalVisible,
                  setFieldValue
                )
              }
              okText="Add priority"
            >
              <Input
                placeholder="Enter new priority name"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              />
            </Modal>

            <Modal
              title="Add New Category"
              open={isCategoryModalVisible}
              onCancel={() => setIsCategoryModalVisible(false)}
              onOk={() =>
                handleAddNewLable(
                  "category",
                  newCategory,
                  setNewCategory,
                  setIsCategoryModalVisible,
                  setFieldValue
                )
              }
              okText="Add Category"
            >
              <Input
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </Modal>

            <Modal
              title="Add New Status"
              open={isStatusModalVisible}
              onCancel={() => setIsStatusModalVisible(false)}
              onOk={() =>
                handleAddNewLable(
                  "status",
                  newStatus,
                  setNewStatus,
                  setIsStatusModalVisible,
                  setFieldValue
                )
              }
              okText="Add Status"
            >
              <Input
                placeholder="Enter new status name"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
            </Modal>
          </>
        )}
      </Formik>
    </div>
  );
};

export default AddTask;
