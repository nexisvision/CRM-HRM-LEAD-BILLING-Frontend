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
import { AddTaskk, GetTasks } from "./TaskReducer/TaskSlice";
import { useDispatch, useSelector } from "react-redux";
import useSelection from "antd/es/table/hooks/useSelection";
import { assign, values } from "lodash";
import { AddLable, GetLable } from "./LableReducer/LableSlice";
import { GetLeads } from '../../leads/LeadReducers/LeadSlice';
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";



const { Option } = Select;

const AddTask = ({ onClose }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
  const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);

   const [isPriorityModalVisible, setIsPriorityModalVisible] = useState(false);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [newPriority, setNewPriority] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newStatus, setNewStatus] = useState("");
  
    const [priorities, setPriorities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const [fileList, setFileList] = useState([]);


  const { id } = useParams();

  const user = useSelector((state) => state.user.loggedInUser.username);

  const { data: Leads, isLoading: isLeadsLoading, error: leadsError } = useSelector((state) => state.Leads.Leads || []);

  const allproject = useSelector((state) => state.Project);
  const fndrewduxxdaa = allproject.Project.data
  const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);
  
  const AllLoggedData = useSelector((state) => state.user);

  const allempdata = useSelector((state) => state.Users);
  const empData = allempdata?.Users?.data || [];
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const roles = useSelector((state) => state.role?.role?.data);
  const userRole = roles?.find(role => role.id === loggedInUser.role_id);

  const fnduserdatas = empData.filter(emp => {
    if (userRole?.role_name === 'client') {
      return emp.client_id === loggedInUser.id;
    } else {
      return emp.client_id === loggedInUser.client_id;
    }
  });

  const loggeduser = useSelector((state)=>state.user.loggedInUser.username);

  const [selectedLead, setSelectedLead] = useState(null);

  const initialValues = {
    taskName: "",
    category: "",
    project: fnddata?.id || "", 
    lead:"",
    startDate: null,
    dueDate: null,
    assignTo: [],
    description: "",
    task_reporter: "",
    files: [] // Add files to initial values
  };

  const validationSchema = Yup.object({
    taskName: Yup.string().required("Task Name is required"),
    category: Yup.string().required("Category is required"),
    project: Yup.string().required("Project is required"),
    startDate: Yup.date()
      .nullable()
      .required("Start Date is required"),
    dueDate: Yup.date()
      .nullable()
      .required("Due Date is required")
      .min(
        Yup.ref('startDate'),
        'Due Date must be after Start Date'
      ),
    assignTo: Yup.array()
      .min(1, "Please select at least one assignee")
      .required("Please assign the task to someone"),
    description: Yup.string()
      .required("Description is required"),
    priority: Yup.string()
      .required("Priority is required"),
    status: Yup.string()
      .required("Status is required"),
      task_reporter: Yup.string().required("Please select a Task Reporter."),
  });

    useEffect(() => {
    dispatch(GetUsers());

         dispatch(GetLeads());

    }, [dispatch]);


  const fetchLables = async (lableType, setter) => {
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
  };
  
  useEffect(() => {
    fetchLables("category", setCategories);
    fetchLables("priority", setPriorities);
    fetchLables("status", setStatuses);
  }, []);





  
  const handleAddNewLable = async (lableType, newValue, setter, modalSetter, setFieldValue) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }
  
    try {
      const payload = {
        name: newValue.trim(),
        lableType
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

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false; // Prevent automatic upload
    },
    fileList,
    multiple: true,
  };

  const onSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    
    Object.keys(values).forEach(key => {
      if (key !== 'files') {
        formData.append(key, values[key]);
      }
    });

    fileList.forEach((file) => {
      formData.append('task_file', file);
    });

    dispatch(AddTaskk({ id, values })).then(() => {
        dispatch(GetTasks(id))
          .then(() => {
            resetForm();
            setFileList([]); // Reset file list
            onClose();
          })
          .catch((error) => {
            console.error("Task API error:", error);
          });
      })
      .catch((error) => {
        message.error("Failed to add Task.");
        console.error("AddTask API error:", error);
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
      <h2 className="border-b pb-[-10px] mb-[10px] font-medium"></h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <>
            <Form className="formik-form" onSubmit={handleSubmit}>
              <Row gutter={16}>
                <Col span={24}>
                  <div className="form-item">
                    <label className="font-semibold">Task Name <span className="text-red-500">*</span></label>
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
                    <label className="font-semibold ">StartDate <span className="text-red-500">*</span></label>
                    <DatePicker
                      name="startDate"
                      className="w-full mt-1"
                      placeholder="Select startDate"
                      format="DD-MM-YYYY"
                      onChange={(date) => {
                        setFieldValue("startDate", date);
                        if (values.dueDate && date && values.dueDate.isBefore(date)) {
                          setFieldValue("dueDate", null);
                        }
                      }}
                      value={values.startDate}
                      onBlur={() => setFieldTouched("startDate", true)}
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
                    <label className="font-semibold ">DueDate <span className="text-red-500">*</span></label>
                    <DatePicker
                      name="dueDate"
                      className="w-full mt-1"
                      placeholder="Select DueDate"
                      onChange={(value) => setFieldValue("dueDate", value)}
                      value={values.dueDate}
                         format="DD-MM-YYYY"
                      onBlur={() => setFieldTouched("dueDate", true)}
                      disabledDate={(current) => {
                        return values.startDate ? current && current < values.startDate.startOf('day') : false;
                      }}
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
                    <label className="font-semibold">AssignTo <span className="text-red-500">*</span></label>
                    <Field name="assignTo">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
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
                              No Employee Available
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

                <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Task Reporter <span className="text-rose-500">*</span></label>
                  <Field name="task_reporter">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Task Reporter"
                        onChange={(value) => setFieldValue("task_reporter", value)}
                        value={values.task_reporter}
                      >
                        {Array.isArray(fnduserdatas) && fnduserdatas.length > 0 ? (
                          fnduserdatas.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.firstName || client.username || "Unnamed Client"}
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

                <Col span={24} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Status <span className="text-red-500">*</span></label>
                    <Select
                      style={{ width: "100%" }}
                      className="mt-1"
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
                               className="w-full mt-2"
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
                               className="w-full mt-2"
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

                
                <Col span={24} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Description <span className="text-red-500">*</span></label>
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

                <Col span={24} className="mt-4">
                  <div className="form-item">
                    <label className="text-sm font-semibold mb-2 block">Attachments <span className="text-red-500">*</span></label>
                    <Upload
                      {...uploadProps}
                      className="mt-2"
                    >
                      <Button icon={<UploadOutlined />} className="hover:bg-gray-50">Click to Upload</Button>
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

            <Modal
              title="Add New priority"
              open={isPriorityModalVisible}
              onCancel={() => setIsPriorityModalVisible(false)}
              onOk={() => handleAddNewLable("priority", newPriority, setNewPriority, setIsPriorityModalVisible, setFieldValue)}
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
              onOk={() => handleAddNewLable("category", newCategory, setNewCategory, setIsCategoryModalVisible, setFieldValue)}
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
              onOk={() => handleAddNewLable("status", newStatus, setNewStatus, setIsStatusModalVisible, setFieldValue)}
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


