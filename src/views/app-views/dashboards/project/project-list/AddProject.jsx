import React, { useCallback, useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AddPro, GetProject } from "./projectReducer/ProjectSlice";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { PlusOutlined } from "@ant-design/icons";
import { GetTagspro } from "./tagReducer/TagSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { AddLablee, GetLablee } from "../milestone/LableReducer/LableSlice";
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import AddUser from "views/app-views/Users/user-list/AddUser";
import AddClient from "views/app-views/Users/client-list/AddClient";
import AddCurrencies from '../../../setting/currencies/AddCurrencies';
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const { Option } = Select;

const calculateDuration = (startDate, endDate) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diff = dayjs.duration(end.diff(start));

  const years = diff.years();
  const months = diff.months();
  const days = diff.days();

  let displayValue = '';
  
  // If there are years or months, only show those
  if (years > 0 || months > 0) {
    if (years > 0) {
      displayValue += `${years} year${years > 1 ? 's' : ''} `;
    }
    if (months > 0) {
      displayValue += `${months} month${months > 1 ? 's' : ''}`;
    }
  } else {
    // If no years and months, show only days
    displayValue = `${days} day${days !== 1 ? 's' : ''}`;
  }

  return displayValue.trim();
};

const AddProject = ({ onClose }) => {
  const dispatch = useDispatch();
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isAddClientModalVisible, setIsAddClientModalVisible] = useState(false);
  const AllLoggedData = useSelector((state) => state.user);
  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;
  const getInitialCurrency = () => {
    if (fnddatass?.length > 0) {
      const inrCurrency = fnddatass.find(c => c.currencyCode === 'INR');
      return inrCurrency?.id || fnddatass[0]?.id;
    }
    return '';
  };

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetTagspro());
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetUsers());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(GetProject());
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const allloggeduser = useSelector((state) => state.user.loggedInUser.username)
  const alluserdatas = useSelector((state) => state.Users);
  const fnadat = alluserdatas?.Users?.data;

  const fnd = fnadat?.filter((item) => item?.created_by === allloggeduser)
  const AllEmployee = useSelector((state) => state.SubClient);
  const employeedata = AllEmployee.SubClient.data;
  const fnd2 = employeedata?.filter((item) => item?.created_by === allloggeduser)
  const AllLoggeddtaa = useSelector((state) => state.user);

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

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  const validationSchema = Yup.object({
    project_name: Yup.string().required("Please enter a Project Name."),
    project_category: Yup.string().required("Please enter a Category."),
    startDate: Yup.date().nullable().required("Start date is required."),
    endDate: Yup.date().nullable().required("End date is required."),
    currency: Yup.string().required("Please select Currency."),
    client: Yup.string().required("Please select Client."),
    project_members: Yup.array().min(1, "Please select at least one project member."),
    budget: Yup.number()
      .required("Please enter a Project Budget.")
      .positive("Budget must be positive."),
    estimatedmonths: Yup.string()
      .required("Please enter Estimated Months."),
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
    const payload = {
      ...values,
      project_members: {
        project_members: values.project_members // Send as an object directly, not stringified
      }
    };

    dispatch(AddPro(payload))
      .then(() => {
        dispatch(GetProject())
          .then(() => {

            resetForm();
            onClose();
          })
          .catch((error) => {
            console.error("Project Data API error:", error);

          });
      })
      .catch((error) => {

        console.error("AddProject API error:", error);
      });
  };

  useEffect(() => {

    const lid = AllLoggeddtaa.loggedInUser.role_id;

    GetLablee(lid);
  }, [AllLoggeddtaa]);

  const fetchLables = useCallback(async (lableType, setter) => {
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

      const response = await dispatch(AddLablee({ lid, payload }));

      if (response.payload && response.payload.success) {
        message.success(`${lableType} added successfully.`);

        const labelsResponse = await dispatch(GetLablee(lid));
        if (labelsResponse.payload && labelsResponse.payload.data) {
          const filteredLables = labelsResponse.payload.data
            .filter((lable) => lable.lableType === lableType)
            .map((lable) => ({ id: lable.id, name: lable.name.trim() }));
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

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
        }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
           <div className="mb-3 border-b pb-[-10px] font-medium"></div>

            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Project Name <span className="text-red-500">*</span></label>
                  <Field
                    name="project_name"
                    className="mt-1"
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

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Category <span className="text-red-500">*</span></label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new category"
                    value={values.project_category}
                    className="mt-1"
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
                  <label className="font-semibold">Start Date <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    className="w-full mt-1 p-2 border rounded"
                    value={values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : ''}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setFieldValue("startDate", selectedDate);

                      if (values.endDate && dayjs(values.endDate).isBefore(selectedDate)) {
                        setFieldValue("endDate", null);
                      }

                      if (selectedDate && values.endDate) {
                        const displayValue = calculateDuration(selectedDate, values.endDate);
                        setFieldValue("estimatedmonths", displayValue);
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
                  <label className="font-semibold">End Date <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    className="w-full mt-1 p-2 border rounded"
                    value={values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : ''}
                    min={values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : ''}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setFieldValue("endDate", selectedDate);

                      if (values.startDate && selectedDate) {
                        const displayValue = calculateDuration(values.startDate, selectedDate);
                        setFieldValue("estimatedmonths", displayValue);
                      }
                    }}
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
                  <label className="font-semibold">Estimated Duration <span className="text-red-500">*</span></label>
                  <Field
                    name="estimatedmonths"
                    as={Input}
                    className="mt-1 bg-gray-100"
                    placeholder="Duration will be calculated automatically"
                    disabled={true}
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
                    loading={!fnd2}
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
                    {fnd2 && fnd2?.length > 0 ? (
                      fnd2
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
                  <label className="text-gray-600 font-semibold mb-2 block"> Currency <span className="text-red-500">*</span></label>
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
                    type="number"
                    className="mt-1"
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
                  <label className="font-semibold">Description <span className="text-red-500">*</span></label>
                  <ReactQuill
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
                  <label className="font-semibold"> Tag <span className="text-red-500">*</span></label>
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
                Create
              </Button>
            </div>

            {/* Keep only one set of modals at the bottom of the form */}
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

            <Modal
              title="Add User"
              visible={isAddUserModalVisible}
              onCancel={() => setIsAddUserModalVisible(false)}
              footer={null}
              width={1000}
            >
              <AddUser onClose={() => setIsAddUserModalVisible(false)} />
            </Modal>

            <Modal
              title="Add Client"
              visible={isAddClientModalVisible}
              onCancel={() => setIsAddClientModalVisible(false)}
              footer={null}
              width={800}
            >
              <AddClient onClose={() => setIsAddClientModalVisible(false)} />
            </Modal>

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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProject;
