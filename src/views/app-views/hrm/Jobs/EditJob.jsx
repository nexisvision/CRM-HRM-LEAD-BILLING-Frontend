import React, { useState, useEffect } from "react";
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
import { PlusOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector, useDispatch } from "react-redux";
import {
  AddLablee,
  GetLable,
  GetLablee,
} from "views/app-views/dashboards/project/milestone/LableReducer/LableSlice";
import { EditJobs, GetJobdata } from "./JobReducer/JobSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import dayjs from "dayjs";
import AddCurrencies from "../../setting/currencies/AddCurrencies";

const { Option } = Select;

const EditJob = ({ idd, onClose }) => {
  const [jobCategories, setJobCategories] = useState([]);
  const [jobSkills, setJobSkills] = useState([]);
  const [jobStatuses, setJobStatuses] = useState([]);
  const [isJobCategoryModalVisible, setIsJobCategoryModalVisible] = useState(false);
  const [isJobSkillModalVisible, setIsJobSkillModalVisible] = useState(false);
  const [isJobStatusModalVisible, setIsJobStatusModalVisible] = useState(false);
  const [newJobCategory, setNewJobCategory] = useState("");
  const [newJobSkill, setNewJobSkill] = useState("");
  const [newJobStatus, setNewJobStatus] = useState("");
  const dispatch = useDispatch();
  const AllLoggeddtaa = useSelector((state) => state.user);
  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);
  const alldept = useSelector((state) => state.Jobs);
  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;


  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);


  const onSubmit = (values, { resetForm }) => {
    const transformedValues = {
      ...values,
      skills: { Skills: values.skillss },
      interviewRounds: { InterviewRounds: values.interviewRounds }
    };

    dispatch(EditJobs({ idd, transformedValues }));
    dispatch(GetJobdata());
    onClose();
    resetForm();
  };

  useEffect(() => {
    const lid = AllLoggeddtaa.loggedInUser.id;
    GetLable(lid);
  }, [AllLoggeddtaa.loggedInUser.id]);

  const fetchLabels = React.useCallback(async (lableType, setter) => {
    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const response = await dispatch(GetLablee(lid));

      if (response.payload && response.payload.data) {
        const uniqueLabels = response.payload.data
          .filter((label) => label && label.name && label.lableType === lableType) // Filter by lableType
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t.name === label.name) // Remove duplicates
          );

        setter(uniqueLabels);
      }
    } catch (error) {
      console.error(`Failed to fetch ${lableType}:`, error);
      message.error(`Failed to load ${lableType}`);
    }
  }, [AllLoggeddtaa.loggedInUser.id, dispatch]);

  useEffect(() => {
    fetchLabels("jobcategory", setJobCategories);
    fetchLabels("jobskill", setJobSkills);
    fetchLabels("jobstatus", setJobStatuses);
  }, [fetchLabels]);

  const handleAddNewLabel = async (lableType, newValue, setter, modalSetter) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const payload = {
        name: newValue.trim(),
        lableType, // Send the correct label type
      };

      await dispatch(AddLablee({ lid, payload }));
      message.success(`${lableType} added successfully.`);
      setter(""); // Reset input field
      modalSetter(false); // Close modal

      // Re-fetch updated labels
      await fetchLabels(lableType, lableType === "jobcategory" ? setJobCategories :
        lableType === "jobskill" ? setJobSkills : setJobStatuses);
    } catch (error) {
      console.error(`Failed to add ${lableType}:`, error);
      message.error(`Failed to add ${lableType}`);
    }
  };

  useEffect(() => {
    const empData = alldept?.Jobs?.data || [];
    const data = empData.find((item) => item.id === idd);
    if (data) {
      const formik = formikRef.current;
      if (formik) {
        formik.setFieldValue('title', data.title || '');
        formik.setFieldValue('category', data.category || '');
        formik.setFieldValue('skillss',
          data.skills && data.skills !== "{}"
            ? JSON.parse(data.skills)?.Skills || ""
            : "");
        formik.setFieldValue('location', data.location || '');
        formik.setFieldValue('interviewRounds',
          data.interviewRounds ? JSON.parse(data.interviewRounds)?.InterviewRounds || [] : []);
        formik.setFieldValue('startDate', data.startDate ? dayjs(data.startDate) : null);
        formik.setFieldValue('endDate', data.endDate ? dayjs(data.endDate) : null);
        formik.setFieldValue('recruiter', data.recruiter || '');
        formik.setFieldValue('jobType', data.jobType || '');
        formik.setFieldValue('workExperience', data.workExperience || '');
        formik.setFieldValue('currency', data.currency || '');
        formik.setFieldValue('description', data.description || '');
        formik.setFieldValue('status', data.status || '');
        formik.setFieldValue('expectedSalary', data.expectedSalary || '');
      }
    }
  }, [idd, alldept]);

  // Add formikRef to access Formik instance
  const formikRef = React.useRef(null);

  return (
    <div className="add-expenses-form">
      <div className="mb-3 border-b pb-1 font-medium"></div>
      <Formik
        innerRef={formikRef}  // Add this line to get Formik reference
        initialValues={{
          title: '',
          category: '',
          skillss: '',
          location: '',
          interviewRounds: [],
          startDate: null,
          endDate: null,
          recruiter: '',
          jobType: '',
          workExperience: '',
          currency: '',
          description: '',
          status: '',
          expectedSalary: '',
        }}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Job Title <span className="text-red-500">*</span></label>
                  <Field
                    className="mt-1"
                    name="title"
                    as={Input}
                    placeholder="Enter title"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Job Category <span className="text-red-500">*</span></label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new job category"
                    value={values.category}
                    className="w-full mt-1"
                    onChange={(value) => setFieldValue("category", value)}
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={() => setIsJobCategoryModalVisible(true)}
                          >
                            Add New Job Category
                          </Button>
                        </div>
                      </div>
                    )}
                  >
                    {jobCategories.map((category) => (
                      <Option key={category.id} value={category.name}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage name="category" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Job Skill <span className="text-red-500">*</span></label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new job skill"
                    className="w-full mt-1"
                    value={values.skillss}
                    onChange={(value) => setFieldValue("skillss", value)}
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={() => setIsJobSkillModalVisible(true)}
                          >
                            Add New Job Skill
                          </Button>
                        </div>
                      </div>
                    )}
                  >
                    {jobSkills.map((skill) => (
                      <Option key={skill.id} value={skill.name}>
                        {skill.name}
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage name="skillss" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold mb-2">Location <span className="text-red-500">*</span></label>
                  <Field
                    className="mt-1"
                    name="location"
                    as={Input}
                    placeholder="Enter location"
                  />

                  <ErrorMessage
                    name="invoiceDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold mb-2">Interview Rounds <span className="text-red-500">*</span></label>
                  <Field name="interview rounds">
                    {({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        placeholder="Select InterviewRounds"
                        className="w-full mt-1"
                        onChange={(value) =>
                          setFieldValue("interviewRounds", value)
                        }
                        value={values.interviewRounds}
                        onBlur={() => setFieldTouched("interviewRounds", true)}
                        allowClear={false}
                      >
                        <Option value="HR">HR</Option>
                        <Option value="Technical">Technical</Option>
                        <Option value="Prectical">Prectical</Option>
                        <Option value="Communication">Communication</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="duedate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Start Date <span className="text-red-500">*</span></label>
                  <Field name="startDate">
                    {({ field }) => (
                      <input
                        type="date"
                        {...field}
                        className="w-full mt-1 p-2 border rounded"
                        value={values.startDate ? values.startDate.format('YYYY-MM-DD') : ''}
                        onChange={(e) => {
                          const date = dayjs(e.target.value);
                          setFieldValue('startDate', date);
                          if (values.endDate && date && values.endDate.isBefore(date)) {
                            setFieldValue('endDate', null);
                          }
                        }}
                        onBlur={() => setFieldTouched("startDate", true)}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="startDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">End Date <span className="text-red-500">*</span></label>
                  <Field name="endDate">
                    {({ field }) => (
                      <input
                        type="date"
                        {...field}
                        className="w-full mt-1 p-2 border rounded"
                        value={values.endDate ? values.endDate.format('YYYY-MM-DD') : ''}
                        onChange={(e) => {
                          const date = dayjs(e.target.value);
                          setFieldValue('endDate', date);
                        }}
                        min={values.startDate ? values.startDate.format('YYYY-MM-DD') : ''}
                        onBlur={() => setFieldTouched("endDate", true)}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="endDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Recruiter <span className="text-red-500">*</span></label>
                  <Field
                    className="mt-1"
                    name="recruiter"
                    as={Input}
                    placeholder="Enter recruiter"


                  />
                  <ErrorMessage
                    name="recruiter"
                    component="div"
                    className="error-message text-red-500 my-1"

                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Job Type <span className="text-red-500">*</span></label>
                  <Field

                    className="mt-1"
                    name="jobType"
                    as={Input}
                    placeholder="Enter job type"

                  />
                  <ErrorMessage
                    name="jobType"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <div className="form-item">
                    <label className="font-semibold">Work Experience <span className="text-red-500">*</span></label>
                    <Field
                      className="mt-1"
                      name="workExperience"
                      as={Input}

                      placeholder="Enter workExperience"
                    />
                    <ErrorMessage
                      name="workExperience"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-group">
                  <label className="text-gray-600 font-semibold mb-2 block">Currency & Expected Salary <span className="text-red-500">*</span></label>
                  <div className="flex gap-0">
                    <Field name="currency">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="currency-select"
                          style={{
                            width: '80px',
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
                    <Field name="expectedSalary">
                      {({ field, form }) => (
                        <Input
                          {...field}
                          className="price-input"
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderLeft: '1px solid #d9d9d9',
                            width: 'calc(100% - 80px)'
                          }}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                              form.setFieldValue('expectedSalary', value);
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
                  <ErrorMessage name="expectedSalary" component="div" className="text-red-500 mt-1 text-sm" />
                </div>
              </Col>



              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Job Status <span className="text-red-500">*</span></label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new job status"
                    value={values.status}
                    className="w-full mt-1"
                    onChange={(value) => setFieldValue("status", value)}
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={() => setIsJobStatusModalVisible(true)}
                          >
                            Add New Job Status
                          </Button>
                        </div>
                      </div>
                    )}
                  >
                    {jobStatuses.map((status) => (
                      <Option key={status.id} value={status.name}>
                        {status.name}
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>





              <div className="mt-2 w-full">
                <Col span={24} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Job Discription <span className="text-red-500">*</span></label>

                    <ReactQuill
                      value={values.description}
                      onChange={(value) => setFieldValue("description", value)}
                      placeholder="Enter description"
                      onBlur={() => setFieldTouched("description", true)}
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
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
        title="Add New Job Category"
        open={isJobCategoryModalVisible}
        onCancel={() => setIsJobCategoryModalVisible(false)}
        onOk={() => handleAddNewLabel("jobcategory", newJobCategory, setNewJobCategory, setIsJobCategoryModalVisible)}
        okText="Add Category"
      >
        <Input
          placeholder="Enter new job category name"
          value={newJobCategory}
          onChange={(e) => setNewJobCategory(e.target.value)}
        />
      </Modal>
      <Modal
        title="Add New Job Skill"
        open={isJobSkillModalVisible}
        onCancel={() => setIsJobSkillModalVisible(false)}
        onOk={() => handleAddNewLabel("jobskill", newJobSkill, setNewJobSkill, setIsJobSkillModalVisible)}
        okText="Add Skill"
      >
        <Input
          placeholder="Enter new job skill name"
          value={newJobSkill}
          onChange={(e) => setNewJobSkill(e.target.value)}
        />
      </Modal>
      <Modal
        title="Add New Job Status"
        open={isJobStatusModalVisible}
        onCancel={() => setIsJobStatusModalVisible(false)}
        onOk={() => handleAddNewLabel("jobstatus", newJobStatus, setNewJobStatus, setIsJobStatusModalVisible)}
        okText="Add Status"
      >
        <Input
          placeholder="Enter new job status name"
          value={newJobStatus}
          onChange={(e) => setNewJobStatus(e.target.value)}
        />
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
      <style jsx>{`
      .currency-select .ant-select-selector {
    height: 40px !important;
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    display: flex !important;
    align-items: center !important;
    background-color: #f8fafc !important;
  }

  .currency-select .ant-select-selection-item {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 16px !important;
    line-height: 32px !important;
  }

  .currency-select .ant-select-selection-item > div {
    display: flex !important;
    align-items: center !important;
  }

  .currency-select .ant-select-selection-item span:not(:first-child) {
    display: none !important;
  }

  // .price-input {
  //   height: 40px !important;
  // }

  /* Remove number input spinners */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none !important;
    margin: 0 !important;
  }

  input[type="number"] {
    -moz-appearance: textfield !important;
  }

  /* Dropdown styles */
  .ant-select-dropdown .ant-select-item {
    padding: 8px 12px !important;
  }

  .ant-select-dropdown .ant-select-item-option-content > div {
    display: flex !important;
    align-items: center !important;
    width: 100% !important;
  }

  /* Make all form fields consistent height */
  
  
  .ant-select-selector,
  .ant-picker,
  .ant-input-number,
  .ant-input-affix-wrapper {
    height: 40px !important;
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    padding: 4px 11px !important;
  }

  .ant-select-selection-search-input {
    height: 38px !important;
  }
      `}</style>
    </div>
  );
};
export default EditJob;
