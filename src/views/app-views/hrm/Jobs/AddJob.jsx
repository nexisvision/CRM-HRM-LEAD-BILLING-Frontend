import React, { useState, useEffect } from "react";
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
} from "antd";
import { CloudUploadOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
// import { getallcurrencies } from "views/app-views/setting/currencies/currenciesreducer/currenciesSlice";
import {
  AddLable,
  AddLablee,
  GetLable,
  GetLablee,
} from "views/app-views/dashboards/project/milestone/LableReducer/LableSlice";
import { AddJobs, GetJobdata } from "./JobReducer/JobSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { getInterview } from "./Interview/interviewReducer/interviewSlice";


const { Option } = Select;

const AddJob = ({ onClose }) => {
  const navigate = useNavigate();
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [jobCategories, setJobCategories] = useState([]);
  const [jobSkills, setJobSkills] = useState([]);
  const [jobStatuses, setJobStatuses] = useState([]);
  const [isJobCategoryModalVisible, setIsJobCategoryModalVisible] = useState(false);
  const [isJobSkillModalVisible, setIsJobSkillModalVisible] = useState(false);
  const [isJobStatusModalVisible, setIsJobStatusModalVisible] = useState(false);
  const [newJobCategory, setNewJobCategory] = useState("");
  const [newJobSkill, setNewJobSkill] = useState("");
  const [newJobStatus, setNewJobStatus] = useState("");

  const { currencies } = useSelector((state) => state.currencies);
  const dispatch = useDispatch();

  const AllLoggeddtaa = useSelector((state) => state.user);


  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getInterview());
  }, [dispatch]);

  const allinterview = useSelector((state) => state.Interviews.Interviews.data);



  const initialValues = {
    title: "",
    category: "",
    skillss: "",
    location: "",
    interviewRounds: [],
    startDate: "",
    endDate: "",
    recruiter: "",
    jobType: "",
    workExperience: "",
    currency: "",
    description: "",
    status: "",
    expectedSalary: "", // files: '',
  };
  const validationSchema = Yup.object({
    title: Yup.string().required("Please enter Job Title."),
    category: Yup.string().required("Please enter Job Category."),
    skillss: Yup.string().required("Please enter Skills."),
    location: Yup.string().required("Please enter Location."),
    interviewRounds: Yup.array().required("please enter Interview Rounds"),
    startDate: Yup.string().required("Please enter Satrt Date."),
    endDate: Yup.string().required("Please enter End Date."),
    recruiter: Yup.string().required("Please enter Recuiter."),
    jobType: Yup.string().required("Please enter Job Type."),
    workExperience: Yup.string().required("Please enter Work Expernce."),
    currency: Yup.string().required("Please enter Curreney"),
    description: Yup.string().required("Please enter Job Discription."),
    status: Yup.string().required("Please enter Status."),
    expectedSalary: Yup.string().required("Please enter Expect Salary."),

    // files: Yup.string().required('Please enter Files.'),
  });

  const onSubmit = (values, { resetForm }) => {
    // Check if all required fields are filled
    const requiredFields = [
      'title',
      'category', 
      'skillss',
      'location',
      'interviewRounds',
      'startDate',
      'endDate',
      'recruiter',
      'jobType',
      'workExperience',
      'currency',
      'description',
      'status',
      'expectedSalary'
    ];

    const missingFields = requiredFields.filter(field => !values[field]);
    
    if (missingFields.length > 0) {
      message.error('Please fill in all required fields');
      return;
    }

    // Transforming skills and interviewRounds into the desired object structure
    const transformedValues = {
      ...values,
      skills: { Skills: values.skillss }, // Send as object
      interviewRounds: { InterviewRounds: values.interviewRounds }, // Send as object, not JSON string
      startDate: values.startDate ? values.startDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
      endDate: values.endDate ? values.endDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
    };

    // Remove the skillss field as we've transformed it to skills
    delete transformedValues.skillss;

    dispatch(AddJobs(transformedValues)).then(() => {
      dispatch(GetJobdata());
      message.success("Job added successfully!");
      onClose(); // Close modal after successful submission
      resetForm();
    }).catch((error) => {
      console.error('Error adding job:', error);
      message.error("Failed to add job");
    });
  };

  useEffect(() => {
    const lid = AllLoggeddtaa.loggedInUser.id;
    GetLable(lid);
  }, []);


  const fetchLabels = async (lableType, setter) => {
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
  };

  // Call the function for different label types when the component mounts
  useEffect(() => {
    fetchLabels("jobcategory", setJobCategories);
    fetchLabels("jobskill", setJobSkills);
    fetchLabels("jobstatus", setJobStatuses);
  }, []);


  const handleAddNewLabel = async (lableType, newValue, setter, modalSetter, setFieldValue) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const payload = {
        name: newValue.trim(),
        lableType,
      };

      await dispatch(AddLablee({ lid, payload }));
      message.success(`${lableType} added successfully.`);
      setter(""); // Reset input field
      modalSetter(false); // Close modal

      // Fetch updated labels and update the form field
      const response = await dispatch(GetLablee(lid));
      if (response.payload && response.payload.data) {
        const filteredLabels = response.payload.data
          .filter((label) => label.lableType === lableType)
          .map((label) => ({ id: label.id, name: label.name.trim() }));
        
        if (lableType === "jobcategory") {
          setJobCategories(filteredLabels);
          setFieldValue("category", newValue.trim());
        } else if (lableType === "jobskill") {
          setJobSkills(filteredLabels);
          setFieldValue("skillss", newValue.trim());
        } else if (lableType === "jobstatus") {
          setJobStatuses(filteredLabels);
          setFieldValue("status", newValue.trim());
        }
      }
    } catch (error) {
      console.error(`Failed to add ${lableType}:`, error);
      message.error(`Failed to add ${lableType}`);
    }
  };
  return (
    <div className="add-expenses-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <>
            <Form className="formik-form" onSubmit={handleSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Job Title <span className="text-red-500">*</span>  </label>
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
                      className="w-full mt-1"
                      value={values.category}
                      onChange={(value) => setFieldValue("category", value)}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                            <Button
                              type="link"
                              icon={<PlusOutlined />}
                              onClick={() => setIsJobCategoryModalVisible(true)}
                              block
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
                  <div className="form-item mt-3">
                    <label className="font-semibold">Job Skill <span className="text-red-500">*</span></label>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select or add new job skill"
                      value={values.skillss}
                      className="w-full mt-1"
                      onChange={(value) => setFieldValue("skillss", value)}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                            <Button
                              type="link"
                              // icon={<PlusOutlined />}
                              className="w-full"
                              onClick={() => setIsJobSkillModalVisible(true)}
                            >
                              + Add New Job Skill
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
                <Col span={12} className="mt-3">
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
                    <DatePicker
                      className="w-full mt-1"
                      format="DD-MM-YYYY"
                      value={values.startDate}
                      onChange={(date) => {
                        setFieldValue("startDate", date);
                        // Clear end date if it's before the new start date
                        if (values.endDate && date && values.endDate.isBefore(date)) {
                          setFieldValue("endDate", null);
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

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">End Date <span className="text-red-500">*</span></label>

                    <DatePicker
                      className="w-full mt-1"
                      format="DD-MM-YYYY"
                      value={values.endDate}
                      onChange={(date) => setFieldValue("endDate", date)}
                      onBlur={() => setFieldTouched("endDate", true)}
                      disabledDate={(current) => {
                        // Disable dates before start date
                        return values.startDate ? current && current < values.startDate.startOf('day') : false;
                      }}
                    />
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
                  <div className=" w-full">
                    <div className="form-item">
                      <label className="font-semibold">Work Experence <span className="text-red-500">*</span></label>
                      <Field
                        className="mt-1"
                        name="workExperience"
                        as={Input}
                        placeholder="Enter work experence"
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
                  <div className="form-item">
                    <label className="font-semibold mb-2">Currency <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <Field name="currency">
                        {({ field, form }) => (
                          <Select
                            {...field}
                            className="w-full mt-1"
                            placeholder="Select Currency"
                            onChange={(value) => {
                              const selectedCurrency = currencies?.data?.find(
                                (c) => c.id === value
                              );
                              form.setFieldValue(
                                "currency",
                                selectedCurrency?.currencyCode || ""
                              );
                            }}
                          >
                            {currencies?.data?.map((currency) => (
                              <Option key={currency.id} value={currency.id}>
                                {currency.currencyCode}
                                ({currency.currencyIcon})
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Field>
                    </div>
                    <ErrorMessage
                      name="currency"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
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
                              className="w-full"
                              onClick={() => setIsJobStatusModalVisible(true)}
                            >
                              + Add New Job Status
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


                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Expect Salary <span className="text-red-500">*</span></label>
                    <Field
                      className="mt-1"
                      name="expectedSalary"
                      as={Input}
                      placeholder="Enter expectedSalary"
                    />
                    <ErrorMessage
                      name="expectedSalary"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <div className="mt-2 w-full">
                  <Col span={24} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold">Description <span className="text-red-500">*</span></label>
                      <ReactQuill
                        value={values.description}
                        className="w-full mt-1"
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
                </div>
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

            {/* Modals */}
            <Modal
              title="Add New Job Category"
              open={isJobCategoryModalVisible}
              onCancel={() => setIsJobCategoryModalVisible(false)}
              onOk={() => handleAddNewLabel("jobcategory", newJobCategory, setNewJobCategory, setIsJobCategoryModalVisible, setFieldValue)}
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
              onOk={() => handleAddNewLabel("jobskill", newJobSkill, setNewJobSkill, setIsJobSkillModalVisible, setFieldValue)}
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
              onOk={() => handleAddNewLabel("jobstatus", newJobStatus, setNewJobStatus, setIsJobStatusModalVisible, setFieldValue)}
              okText="Add Status"
            >
              <Input
                placeholder="Enter new job status name"
                value={newJobStatus}
                onChange={(e) => setNewJobStatus(e.target.value)}
              />
            </Modal>
          </>
        )}
      </Formik>
    </div>
  );
};
export default AddJob;
