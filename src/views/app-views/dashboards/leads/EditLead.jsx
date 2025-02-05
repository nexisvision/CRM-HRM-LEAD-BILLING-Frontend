import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  message,
  Card,
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import { useSelector } from "react-redux";
import { GetLeads, LeadsEdit } from "./LeadReducers/LeadSlice";
import { useDispatch } from "react-redux";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { GetLable,AddLable } from "../project/milestone/LableReducer/LableSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { getallcountries } from "views/app-views/setting/countries/countriesreducer/countriesSlice";
const { Option } = Select;

const EditLead = ({ onUpdateLead, id, onClose }) => {
  const navigate = useNavigate();
  const [details, setDetails] = useState(false);
  const [info, setInfo] = useState(false);
  const [organisation, setorganisation] = useState(false);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const dispatch = useDispatch();

  const allempdata = useSelector((state) => state.Leads);
  const datleads = allempdata.Leads.data;

  const project = datleads.find((item) => item.id === id);
  const currenciesState = useSelector((state) => state.currencies);
  const currencies = currenciesState?.currencies?.data || [];
  const { data: employee } = useSelector((state) => state.employee.employee);
  const countries = useSelector((state) => state.countries.countries);
  const alltagdata = useSelector((state) => state.Lable);
  const datas = alltagdata.Lable.data || [];
  const user = useSelector((state) => state.user.loggedInUser);
  const lid = user?.id;

  // Add state for lead value and currency
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const AllLoggedData = useSelector((state) => state.user);
  const loggedInUserId = AllLoggedData?.loggedInUser?.id;

  // Define initialValues using the project data
  const initialValues = {
    leadTitle: project?.leadTitle || "",
    firstName: project?.firstName || "",
    lastName: project?.lastName || "",
    phoneCode: project?.phoneCode || "",
    telephone: project?.telephone || "",
    email: project?.email || "",
    leadValue: project?.leadValue || "",
    currencyId: project?.currencyId || "",
    employee: project?.employee || "",
    status: project?.status || "",
    notes: project?.notes || "",
    source: project?.source || "",
    category: project?.category || "",
    tags: project?.tags || [],
    lastContacted: project?.lastContacted ? moment(project.lastContacted) : null,
    totalBudget: project?.totalBudget || "",
    targetDate: project?.targetDate ? moment(project.targetDate) : null,
    contentType: project?.contentType || "",
    brandName: project?.brandName || "",
    companyName: project?.companyName || "",
    street: project?.street || "",
    city: project?.city || "",
    state: project?.state || ""
  };

  // Define validation schema
  const validationSchema = Yup.object({
    leadTitle: Yup.string().required("Lead Title is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    telephone: Yup.string(),
    email: Yup.string().email("Invalid email format"),
    leadValue: Yup.number().nullable(),
    currencyId: Yup.string().nullable(),
    employee: Yup.string(),
    status: Yup.string().required("Status is required"),
    notes: Yup.string(),
    source: Yup.string(),
    category: Yup.string(),
    tags: Yup.array(),
    lastContacted: Yup.date().nullable(),
    totalBudget: Yup.string(),
    targetDate: Yup.date().nullable(),
    contentType: Yup.string(),
    brandName: Yup.string(),
    companyName: Yup.string(),
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string()
  });

  useEffect(() => {
    if (project) {
      setDetails(
        !!project.notes ||
        !!project.source ||
        !!project.category ||
        !!project.lastContacted
      );
      setInfo(
        !!project.totalBudget ||
        !!project.targetDate ||
        !!project.contentType ||
        !!project.brandName
      );
      setorganisation(
        !!project.companyName ||
        !!project.street ||
        !!project.city ||
        !!project.state
      );
    }
  }, [project]);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);


  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    if (lid) {
      dispatch(GetLable(lid));
    }
  }, [dispatch, lid]);

  useEffect(() => {
    if (loggedInUserId) {
      fetchLables("tag", setTags);
      fetchLables("category", setCategories);
      fetchLables("status", setStatuses);
    }
  }, [loggedInUserId]);

  const onSubmit = (values) => {
    const formData = {
      ...values,
      leadValue: values.leadValue ? String(values.leadValue) : null,
      currencyId: values.currencyId || null,
      currencyIcon: selectedCurrency?.currencyIcon || null,
    };
    dispatch(LeadsEdit({ id, values: formData }))
      .then(() => {
        dispatch(GetLeads());
        message.success("Lead updated successfully!");
        onClose();
      })
      .catch((error) => {
        message.error("Failed to update Lead.");
        console.error("Edit API error:", error);
      });
    const updatedLead = {
      ...project,
      ...values,
    };
    onUpdateLead(updatedLead);
  };

  const LeadValueField = ({ field, form }) => (
    <Col span={24} className="mt-2">
      <div className="form-item">
        <div className="flex gap-2">
          <Field
            name="leadValue"
            type="number"
            as={Input}
            placeholder="Enter Lead Value"
            className="w-full"
          />
          <Field name="currencyId">
            {({ field, form }) => (
              <Select
                {...field}
                className="w-full"
                placeholder="Currency"
                onChange={(value) => {
                  form.setFieldValue("currencyId", value);
                  const selected = currencies.find(c => c.id === value);
                  setSelectedCurrency(selected);
                }}
                value={field.value}
              >
                {Array.isArray(currencies) && currencies.length > 0 ? (
                  currencies.map((currency) => (
                    <Option
                      key={currency.id}
                      value={currency.id}
                    >
                      {currency.currencyCode} ({currency.currencyIcon})
                    </Option>
                  ))
                ) : (
                  <Option value="" disabled>
                    Loading currencies...
                  </Option>
                )}
              </Select>
            )}
          </Field>
        </div>
        <ErrorMessage
          name="leadValue"
          component="div"
          className="error-message text-red-500 my-1"
        />
        <ErrorMessage
          name="currencyId"
          component="div"
          className="error-message text-red-500 my-1"
        />
      </div>
    </Col>
  );

  const fetchLables = async (lableType, setter) => {
    try {
      const response = await dispatch(GetLable(loggedInUserId));
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

  const handleAddNewLable = async (lableType, newValue, setter, modalSetter) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
      const payload = {
        name: newValue.trim(),
        lableType,
        userId: loggedInUserId,
      };
      await dispatch(AddLable({ id: loggedInUserId, payload }));
      message.success(`${lableType} added successfully.`);
      setter("");
      modalSetter(false);
      await fetchLables(lableType, lableType === "tag" ? setTags : lableType === "category" ? setCategories : setStatuses);
    } catch (error) {
      console.error(`Failed to add ${lableType}:`, error);
      message.error(`Failed to add ${lableType}.`);
    }
  };

  return (
    <div className="edit-lead-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form onSubmit={handleSubmit}>

            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold flex">
                    Lead Title <h1 className="text-rose-500">*</h1>
                  </label>
                  <Field
                    name="leadTitle"
                    as={Input}
                    placeholder="Enter Lead Title"
                  />
                  <ErrorMessage
                    name="leadTitle"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold flex">
                    First Name<h1 className="text-rose-500">*</h1>
                  </label>
                  <Field
                    name="firstName"
                    as={Input}
                    placeholder="Enter First Name"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold flex">
                    Last Name<h1 className="text-rose-500">*</h1>
                  </label>
                  <Field
                    name="lastName"
                    as={Input}
                    placeholder="Enter Last Name"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Telephone</label>
                    <div className="flex">
                      <Select
                        style={{ width: '30%', marginRight: '8px' }}
                        placeholder="Code"
                        name="telephone"
                        onChange={(value) => setFieldValue('telephone', value)}
                      >
                        {countries.map((country) => (
                          <Option key={country.id} value={country.phoneCode}>
                            (+{country.phoneCode})
                          </Option>
                        ))}
                      </Select>
                      <Field
                        name="telephone"
                        as={Input}
                        style={{ width: '70%' }}
                        placeholder="Enter Telephone"
                      />
                    </div>
                    <ErrorMessage
                      name="telephone"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Email Address</label>
                  <Field
                    name="email"
                    as={Input}
                    placeholder="Enter Email Address"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="">
                <div className="form-item">
                  <label className="font-semibold">Lead Value</label>
                  <Field name="leadValue" component={LeadValueField} />
                  <ErrorMessage
                    name="leadValue.amount"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                  <ErrorMessage
                    name="leadValue.currencyId"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold mb-2">Assigned</label>
                  <div className="flex gap-2">
                    <Field name="employee">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-2"
                          placeholder="Select Employee"
                          onChange={(value) => {
                            const selectedEmployee =
                              Array.isArray(employee) &&
                              employee.find((e) => e.id === value);
                            form.setFieldValue(
                              "employee",
                              selectedEmployee?.username || ""
                            );
                          }}
                        >
                          {Array.isArray(employee) &&
                            employee.map((emp) => (
                              <Option key={emp.id} value={emp.id}>
                                {emp.username}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="employee"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold flex">
                    Status <h1 className="text-rose-500">*</h1>
                  </label>
                  <Field name="status">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select or add new status"
                        onChange={(value) => setFieldValue("status", value)}
                        value={values.status}
                        onBlur={() => setFieldTouched("status", true)}
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
                          <Option key={status.id} value={status.id}>
                            {status.name}
                          </Option>
                        ))}
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

              <Col span={24} className="mt-4 ">
                <div className="flex justify-between items-center">
                  <label className="font-semibold">Details</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={details}
                      onChange={(e) => setDetails(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                {details && (
                  <>
                    <Col span={24}>
                      <div className="mt-2">
                        <label className="font-semibold">Notes</label>
                        <ReactQuill
                          value={values.notes}
                          onChange={(value) => setFieldValue("notes", value)}
                          placeholder="Enter Notes"
                          onBlur={() => setFieldTouched("notes", true)}
                          className="mt-2 bg-white rounded-md"
                        />
                        <ErrorMessage
                          name="notes"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={24} className="mt-4">
                      <label className="font-semibold">Source</label>
                      <Select
                        placeholder="Select Source"
                        className="w-full"
                        onChange={(value) => console.log("Selected:", value)}
                      >
                        {datas.map((source) => (
                          <Option key={source.id} value={source.name}>
                            {source.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={24}>
                      <div className="form-item mt-2">
                        <label className="font-semibold">category</label>
                        <Field name="category">
                          {({ field }) => (
                            <Select
                              {...field}
                              className="w-full"
                              placeholder="Select or add new category"
                              onChange={(value) =>
                                setFieldValue("category", value)
                              }
                              value={values.category}
                              onBlur={() => setFieldTouched("category", true)}
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
                                <Option key={category.id} value={category.id}>
                                  {category.name}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="form-item mt-2">
                        <label className="font-semibold">Tags</label>
                        <Field name="tags">
                          {({ field }) => (
                            <Select
                              mode="multiple"
                              {...field}
                              className="w-full"
                              placeholder="Select or add new tags"
                              onChange={(value) => setFieldValue("tags", value)}
                              value={values.tags}
                              onBlur={() => setFieldTouched("tags", true)}
                              dropdownRender={(menu) => (
                                <div>
                                  {menu}
                                  <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                                    <Button
                                      type="link"
                                      icon={<PlusOutlined />}
                                      className="w-full mt-2"
                                      onClick={() => setIsTagModalVisible(true)}
                                    >
                                      Add New Tag
                                    </Button>
                                  </div>
                                </div>
                              )}
                            >
                              {tags.map((tag) => (
                                <Option key={tag.id} value={tag.id}>
                                  {tag.name}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="tags"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="form-item  mt-2 border-b pb-3">
                        <label className="font-semibold">
                          Last lastContacted
                        </label>
                        <DatePicker
                          className="w-full"
                          format="DD-MM-YYYY"
                          value={values.lastContacted}
                          onChange={(date) =>
                            setFieldValue("lastContacted", date)
                          }
                          onBlur={() => setFieldTouched("lastContacted", true)}
                        />
                        <ErrorMessage
                          name="lastContacted"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                  </>
                )}
              </Col>

              <Col span={24} className="mt-4 ">
                <div className="flex justify-between items-center">
                  <label className="font-semibold">More Information</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={info}
                      onChange={(e) => setInfo(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                {info && (
                  <>
                    <div className="mt-2">
                      <Col span={24}>
                        <Card className="w-full border-l-4 border-l-cyan-300 rounded-sm ">
                          <div>
                            <div className="flex gap-2">
                              <ExclamationCircleOutlined className="text-xl text-cyan-300" />
                              <h1 className="text-xl text-cyan-300">
                                Demo Info
                              </h1>
                            </div>
                            <div>
                              <p>
                                These are custom fields. You can change them or
                                create your own.
                              </p>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">Total Budget</label>
                          <Field
                            name="totalBudget"
                            as={Input}
                            placeholder="Enter Total Budget"
                          />
                          <ErrorMessage
                            name="totalBudget"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24}>
                        <div className="form-item mt-2">
                          <label className="font-semibold">Target Date</label>
                          <DatePicker
                            className="w-full"
                            format="DD-MM-YYYY"
                            value={values.targetDate}
                            onChange={(date) =>
                              setFieldValue("targetDate", date)
                            }
                            onBlur={() => setFieldTouched("targetDate", true)}
                          />
                          <ErrorMessage
                            name="targetDate"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div>
                      <Col span={24} className="mt-2">
                        <div className="form-item mt-2">
                          <label className="font-semibold">Content Type</label>
                          <Field name="contentType">
                            {({ field }) => (
                              <Select
                                {...field}
                                className="w-full"
                                placeholder="Select Content Type"
                                onChange={(value) =>
                                  setFieldValue("contentType", value)
                                }
                                value={values.contentType}
                                onBlur={() =>
                                  setFieldTouched("contentType", true)
                                }
                              >
                                <Option value="Article">Article</Option>
                                <Option value="blog">Blog Post</Option>
                                <Option value="script">Script</Option>
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage
                            name="category"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24} className="mt-2 border-b pb-3">
                        <div className="form-item">
                          <label className="font-semibold">Brand Name</label>
                          <Field
                            name="brandName"
                            as={Input}
                            placeholder="Enter Brand Name"
                            className="w-full"
                          />
                          <ErrorMessage
                            name="brandName"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                  </>
                )}
              </Col>

              <Col className="mt-2">
                <h5 className="flex">
                  <h1 className="text-rose-500">*</h1> Required
                </h5>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-4">
              <Button
                type="default"
                className="mr-2"
                onClick={() => navigate("/leads")}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleSubmit}
              >
                Update
              </Button>
            </div>

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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditLead;

