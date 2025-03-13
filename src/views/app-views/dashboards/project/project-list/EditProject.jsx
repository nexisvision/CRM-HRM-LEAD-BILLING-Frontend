import React, { useEffect, useState, useCallback } from "react";
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
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Editpro, GetProject } from "./projectReducer/ProjectSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { GetTagspro } from "./tagReducer/TagSlice";
import { PlusOutlined } from "@ant-design/icons";
import { GetLable, AddLable } from "../../sales/LableReducer/LableSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { AddUserss, GetUsers } from "views/app-views/Users/UserReducers/UserSlice";
import AddCurrencies from '../../../setting/currencies/AddCurrencies';
const { Option } = Select;

const EditProject = ({ id, onClose }) => {
  const dispatch = useDispatch();
  const allloggeduser = useSelector((state) => state.user.loggedInUser.username)
  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);
  const AllLoggedData = useSelector((state) => state.user);
  const allempdata = useSelector((state) => state.Project);
  const AllEmployee = useSelector((state) => state.employee);
  const employeedata = AllEmployee.employee.data;
  const alluserdatas = useSelector((state) => state.Users);
  const fnadat = alluserdatas?.Users?.data;
  const fnd = fnadat?.filter((item) => item?.created_by === allloggeduser)
  const fnd2 = employeedata?.filter((item) => item?.created_by === allloggeduser)
  const AllLoggeddtaa = useSelector((state) => state.user);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState([]);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;
  const getInitialCurrency = () => {
    if (fnddatass?.length > 0) {
      const usdCurrency = fnddatass.find(c => c.currencyCode === 'USD');
      return usdCurrency?.id || fnddatass[0]?.id;
    }
    return '';
  };

  const projectdata = allempdata.Project.data;
  const [singleEmp, setSingleEmp] = useState(null);

  const Allclient = useSelector((state) => state.ClientData);
  const clientdata = Allclient.ClientData.data;


  useEffect(() => {
    if (id && projectdata.length > 0) {
      const project = projectdata.find((item) => item.id === id);
      if (project) {
        let members = [];
        if (project.project_members) {
          try {
            if (typeof project.project_members === 'string') {
              const parsed = JSON.parse(project.project_members);
              members = parsed.project_members || [];
            } else if (project.project_members.project_members) {
              members = project.project_members.project_members;
            }
          } catch (e) {
            console.error('Error parsing project members:', e);
          }
        }

        const startDate = project.startDate ? moment(project.startDate) : null;
        const endDate = project.endDate ? moment(project.endDate) : null;

        let estimatedmonths = project.estimatedmonths;
        if (startDate && endDate) {
          const daysDiff = endDate.diff(startDate, 'days');
          if (daysDiff < 30) {
            estimatedmonths = `${daysDiff} day${daysDiff !== 1 ? 's' : ''}`;
          } else {
            const monthsDiff = endDate.diff(startDate, 'months', true);
            const roundedMonths = Math.max(1, Math.ceil(monthsDiff));
            estimatedmonths = `${roundedMonths} month${roundedMonths !== 1 ? 's' : ''}`;
          }
        }

        const clientId = project.client || project.client_id;

        setSingleEmp({
          ...project,
          project_members: members,
          startDate,
          endDate,
          estimatedmonths,
          client: clientId
        });
      }
    }
  }, [id, projectdata, clientdata]);

  useEffect(() => {
    if (fnd2 && fnd2.length > 0 && singleEmp?.client) {
      const clientObj = fnd2.find(client => client.id === singleEmp.client);
      if (clientObj) {
      }
    }
  }, [fnd2, singleEmp]);

  const onSubmit = (values) => {
    const formattedValues = {
      ...values,
      project_members: {
        project_members: values.project_members
      }
    };

    dispatch(Editpro({ id, values: formattedValues }))
      .then(() => {
        dispatch(GetProject());
        message.success("Project updated successfully!");
        onClose();
      })
      .catch((error) => {
        message.error("Failed to update project.");
        console.error("Edit API error:", error);
      });
  };


  useEffect(() => {
    dispatch(GetTagspro());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetProject());
  }, [dispatch]);


  useEffect(() => {
    const lid = AllLoggeddtaa.loggedInUser.id;
    GetLable(lid);
  }, [AllLoggeddtaa]);
  const fetchLables = useCallback(async (lableType, setter) => {
    try {
      const lid = AllLoggedData.loggedInUser.id;
      const response = await dispatch(GetLable(lid));
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
  }, [AllLoggedData.loggedInUser.id, dispatch]);

  useEffect(() => {
    fetchLables("tag", setTags);
    fetchLables("category", setCategories);
    fetchLables("status", setStatuses);
  }, [fetchLables]);

  const handleAddNewLable = async (lableType, newValue, setter, modalSetter, setFieldValue) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
      const lid = AllLoggedData.loggedInUser.id;
      const payload = {
        name: newValue.trim(),
        lableType,
      };

      const response = await dispatch(AddLable({ lid, payload }));

      if (response.payload && response.payload.success) {
        message.success(`${lableType} added successfully.`);

        // Refresh the labels immediately after adding
        const labelsResponse = await dispatch(GetLable(lid));
        if (labelsResponse.payload && labelsResponse.payload.data) {
          const filteredLables = labelsResponse.payload.data
            .filter((lable) => lable.lableType === lableType)
            .map((lable) => ({ id: lable.id, name: lable.name.trim() }));

          // Update the appropriate state based on label type
          switch (lableType) {
            case "tag":
              setTags(filteredLables);
              if (setFieldValue) setFieldValue("tag", newValue.trim());
              break;
            case "category":
              setCategories(filteredLables);
              if (setFieldValue) setFieldValue("project_category", newValue.trim());
              break;
            case "status":
              setStatuses(filteredLables);
              if (setFieldValue) setFieldValue("status", newValue.trim());
              break;
            default:
              break;
          }
        }

        setter("");
        modalSetter(false);
      } else {
        throw new Error('Failed to add label');
      }
    } catch (error) {
      console.error(`Failed to add ${lableType}:`, error);
      message.error(`Failed to add ${lableType}. Please try again.`);
    }
  };

  const initialValues = {
    project_name: "",
    project_category: "",
    startDate: null,
    endDate: null,
    client: "",
    project_members: [],
    currency: getInitialCurrency(),
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
    client: Yup.string().required("Please select Client."),
    project_members: Yup.array().min(1, "Please select at least one project member."),
    currency: Yup.string().required("Please select Currency."),
    budget: Yup.number()
      .required("Please enter a Project Budget.")
      .positive("Budget must be positive."),
    estimatedmonths: Yup.string()
      .required("Please enter Estimated Months."),
    estimatedhours: Yup.number()
      .required("Please enter Estimated Hours.")
      .positive("Hours must be positive.")
      .integer("Hours must be a whole number"),
    project_description: Yup.string().required("Please enter a Project Description."),
    tag: Yup.string().required("Please enter a Tag."),
    status: Yup.string().required("Please select Status."),
  });

  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isAddClientModalVisible, setIsAddClientModalVisible] = useState(false);

  // Add date change handlers
  const handleStartDateChange = (date, setFieldValue, values) => {
    setFieldValue("startDate", date);
    if (date && values.endDate) {
      const daysDiff = moment(values.endDate).diff(date, 'days');
      let displayValue;
      if (daysDiff < 30) {
        displayValue = `${daysDiff} day${daysDiff !== 1 ? 's' : ''}`;
      } else {
        const monthsDiff = moment(values.endDate).diff(date, 'months', true);
        const roundedMonths = Math.max(1, Math.ceil(monthsDiff));
        displayValue = `${roundedMonths} month${roundedMonths !== 1 ? 's' : ''}`;
      }
      setFieldValue("estimatedmonths", displayValue);
    }
  };

  const handleEndDateChange = (date, setFieldValue, values) => {
    setFieldValue("endDate", date);
    if (values.startDate && date) {
      const daysDiff = moment(date).diff(values.startDate, 'days');
      let displayValue;
      if (daysDiff < 30) {
        displayValue = `${daysDiff} day${daysDiff !== 1 ? 's' : ''}`;
      } else {
        const monthsDiff = moment(date).diff(values.startDate, 'months', true);
        const roundedMonths = Math.max(1, Math.ceil(monthsDiff));
        displayValue = `${roundedMonths} month${roundedMonths !== 1 ? 's' : ''}`;
      }
      setFieldValue("estimatedmonths", displayValue);
    }
  };

  return (
    <div className="add-job-form">
      <Formik
        initialValues={singleEmp || initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <>
            <Form className="formik-form" onSubmit={handleSubmit}>
            <div className="mb-3 border-b pb-[-10px] font-medium"></div>

              <Row gutter={16}>
                <Col span={24}>
                  <div className="form-item">
                    <label className="font-semibold">Project Name <span className="text-red-500">*</span></label>
                    <Field
                      name="project_name"
                      as={Input}
                      className="mt-1"
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

                <Col span={24} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Category <span className="text-red-500">*</span></label>
                    <Select
                      style={{ width: "100%" }}
                      className="mt-1"
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

                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Start Date <span className="text-red-500">*</span></label>
                    <DatePicker
                      className="w-full mt-1"
                      format="DD-MM-YYYY"
                      value={values.startDate ? moment(values.startDate) : null}
                      onChange={(date) => handleStartDateChange(date, setFieldValue, values)}
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
                    <label className="font-semibold">End Date <span className="text-red-500">*</span></label>
                    <DatePicker
                      className="w-full mt-1"
                      format="DD-MM-YYYY"
                      value={values.endDate ? moment(values.endDate) : null}
                      onChange={(date) => handleEndDateChange(date, setFieldValue, values)}
                      onBlur={() => setFieldTouched("endDate", true)}
                      disabledDate={(current) => {
                        return values.startDate ? current && current < moment(values.startDate).startOf('day') : false;
                      }}
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
                    <label className="font-semibold">Estimated Duration <span className="text-red-500">*</span></label>
                    <Field
                      name="estimatedmonths"
                      as={Input}
                      className="mt-1"
                      placeholder="Duration will be calculated automatically"
                      disabled={values.startDate && values.endDate}
                    />
                    <ErrorMessage
                      name="estimatedmonths"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Client <span className="text-red-500">*</span></label>
                    <Select
                      style={{ width: "100%" }}
                      className="mt-1"
                      placeholder="Select Client"
                      loading={!clientdata}
                      value={values.client}
                      onChange={(value) => setFieldValue("client", value)}
                      onBlur={() => setFieldTouched("client", true)}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                            <Button
                              type="link"
                              icon={<PlusOutlined />}
                              onClick={() => setIsAddClientModalVisible(true)}
                            >
                              Add New Client
                            </Button>
                          </div>
                        </div>
                      )}
                    >
                      {clientdata && clientdata.length > 0 ? (
                        clientdata
                          .filter(client => client.created_by === AllLoggedData.loggedInUser.username)
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

                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Project Members <span className="text-red-500">*</span></label>
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      className="mt-1"
                      placeholder="Select Project Members"
                      loading={!fnd}
                      value={values.project_members}
                      onChange={(value) => setFieldValue("project_members", value)}
                      onBlur={() => setFieldTouched("project_members", true)}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                            <Button
                              type="link"
                              icon={<PlusOutlined />}
                              onClick={() => setIsAddUserModalVisible(true)}
                            >
                              Add New User
                            </Button>
                          </div>
                        </div>
                      )}
                    >
                      {fnd && fnd.length > 0 ? (
                        fnd.map((employee) => (
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
                      name="project_members"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-4">
                  <div className="form-group">
                    <label className="text-gray-600 font-semibold mb-2 block"> Price & Currency <span className="text-red-500">*</span></label>
                    <div className="flex gap-0">
                      <Field name="currency">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="currency-select"
                            style={{
                              width: '60px',
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                              borderRight: 0,
                              backgroundColor: '#f8fafc',
                            }}
                            placeholder={<span className="text-gray-400">$</span>}
                            onChange={(value) => {
                              if (value === 'add_new') {
                                setIsAddCurrencyModalVisible(true);
                              } else {
                                setFieldValue("currency", value);
                              }
                            }}
                            value={values.currency}
                            dropdownStyle={{ minWidth: '180px' }}
                            suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
                            loading={!fnddatass}
                            dropdownRender={menu => (
                              <div>
                                <div
                                  className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
                                  onClick={() => setIsAddCurrencyModalVisible(true)}
                                >
                                  <PlusOutlined className="mr-2" />
                                  <span className="text-sm">Add New</span>
                                </div>
                                {menu}
                              </div>
                            )}
                          >
                            {fnddatass?.map((currency) => (
                              <Option key={currency.id} value={currency.id}>
                                <div className="flex items-center w-full px-1">
                                  <span className="text-base min-w-[24px]">{currency.currencyIcon}</span>
                                  <span className="text-gray-600 text-sm ml-3">{currency.currencyName}</span>
                                  <span className="text-gray-400 text-xs ml-auto">{currency.currencyCode}</span>
                                </div>
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Field>
                      <Field name="budget">
                        {({ field, form }) => (
                          <Input
                            {...field}
                            className="price-input"
                            style={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                              borderLeft: '1px solid #d9d9d9',
                              width: 'calc(100% - 100px)'
                            }}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                form.setFieldValue('budget', value);
                              }
                            }}
                            onKeyPress={(e) => {
                              const charCode = e.which ? e.which : e.keyCode;
                              if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                                e.preventDefault();
                              }
                              if (charCode === 46 && field.value.includes('.')) {
                                e.preventDefault();
                              }
                            }}
                            prefix={
                              values.currency && (
                                <span className="text-gray-600 font-medium mr-1">
                                  {fnddatass?.find(c => c.id === values.currency)?.currencyIcon}
                                </span>
                              )
                            }
                          />
                        )}
                      </Field>
                    </div>
                    <ErrorMessage name="budget" component="div" className="text-red-500 mt-1 text-sm" />
                  </div>
                </Col>

                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Estimated Hours <span className="text-red-500">*</span></label>
                    <Field
                      name="estimatedhours"
                      as={Input}
                      className="mt-1"
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
                      name="project_description"
                      className="mt-1"
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
                    <label className="font-semibold">Tag </label>
                    <Select
                      style={{ width: "100%" }}
                      className="mt-1"
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

            {/* Add Tag Modal */}
            <Modal
              title="Add New Tag"
              open={isTagModalVisible}
              onCancel={() => setIsTagModalVisible(false)}
              onOk={() => handleAddNewLable("tag", newTag, setNewTag, setIsTagModalVisible, setFieldValue)}
              okText="Add Tag"
            >
              <Input
                placeholder="Enter new tag name"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
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

            {/* Add Status Modal */}
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

            {/* Add User Modal */}
            <Modal
              title="Add User"
              visible={isAddUserModalVisible}
              onCancel={() => setIsAddUserModalVisible(false)}
              footer={null}
              width={1000}
            >
              <AddUserss onClose={() => setIsAddUserModalVisible(false)} />
            </Modal>

            {/* Add Client Modal */}
            <Modal
              title="Add Client"
              visible={isAddClientModalVisible}
              onCancel={() => setIsAddClientModalVisible(false)}
              footer={null}
              width={800}
            >
              <addClient onClose={() => setIsAddClientModalVisible(false)} />
            </Modal>

            {/* Add Currency Modal */}
            <Modal
              title="Add New Currency"
              visible={isAddCurrencyModalVisible}
              onCancel={() => setIsAddCurrencyModalVisible(false)}
              footer={null}
              width={600}
            >
              <AddCurrencies
                onClose={() => {
                  setIsAddCurrencyModalVisible(false);
                  dispatch(getcurren());
                }}
              />
            </Modal>
          </>
        )}
      </Formik>

      {/* Custom render for selected value */}
      <style jsx>{`
        .currency-select .ant-select-selection-item {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 16px !important;
        }

        .currency-select .ant-select-selection-item > div {
          display: flex !important;
          align-items: center !important;
        }

        .currency-select .ant-select-selection-item span:not(:first-child) {
          display: none !important;
        }

        .ant-select-dropdown .ant-select-item {
          padding: 8px 12px !important;
        }

        .ant-select-dropdown .ant-select-item-option-content > div {
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
        }
      `}</style>
    </div>
  );
};

export default EditProject;
