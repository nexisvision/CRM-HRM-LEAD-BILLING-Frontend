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
import { AddJobs, EditJobs, GetJobdata } from "./JobReducer/JobSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";

const { Option } = Select;

const EditJob = ({ idd, onClose }) => {
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
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState([]);

  const [isTagModalVisible, setIsTagModalVisible] = useState(false);

  const alldept = useSelector((state) => state.Jobs);
  const [singleEmp, setSingleEmp] = useState(null);

  useEffect(() => {

    const empData = alldept?.Jobs?.data || [];
    const data = empData.find((item) => item.id === idd);
    setSingleEmp(data || null);
  }, [idd, alldept]);


  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);
  const initialValues = {
    title: singleEmp ? singleEmp.title : "",
    category: singleEmp ? singleEmp.category : "",
    skillss: singleEmp ? singleEmp.skillss : "",
    location: singleEmp ? singleEmp.location : "",
    interviewRounds: singleEmp ? singleEmp.interviewRounds : [],
    startDate: singleEmp ? singleEmp.startDate : "",
    endDate: singleEmp ? singleEmp.endDate : "",
    recruiter: singleEmp ? singleEmp.recruiter : "",
    jobType: singleEmp ? singleEmp.jobType : "",
    workExperience: singleEmp ? singleEmp.workExperience : "",
    currency: singleEmp ? singleEmp.currency : "",
    description: singleEmp ? singleEmp.description : "",
    status: singleEmp ? singleEmp.status : "",
    expectedSalary: singleEmp ? singleEmp.expectedSalary : "", // files: '',
  };
  const validationSchema = Yup.object({
    title: Yup.string().optional("Please enter Job Title."),
    category: Yup.number().optional("Please enter Job Category."),
    skillss: Yup.string().optional("Please enter Skills."),
    location: Yup.string().optional("Please enter Location."),
    interviewRounds: Yup.array().optional("please enter Interview Rounds"),
    startDate: Yup.string().optional("Please enter Satrt Date."),
    endDate: Yup.string().optional("Please enter End Date."),
    recruiter: Yup.string().optional("Please enter Recuiter."),
    jobType: Yup.string().optional("Please enter Job Type."),
    workExperience: Yup.string().optional("Please enter Work Expernce."),
    currency: Yup.string().optional("Please enter Curreney"),
    description: Yup.string().optional("Please enter Job Discription."),
    status: Yup.string().optional("Please enter Status."),
    expectedSalary: Yup.string().optional("Please enter Expect Salary."),

    // files: Yup.string().required('Please enter Files.'),
  });

  const onSubmit = (values, { resetForm }) => {
    // Transforming skills and interviewRounds into the desired object structure
    const transformedValues = {
      ...values,
      skills: { Skills: values.skills },
      interviewRounds: { InterviewRounds: values.interviewRounds },
    };

    dispatch(EditJobs({ idd, transformedValues }));
    dispatch(GetJobdata());
    onClose();
    // console.log("Submitted values:", transformedValues);
    // message.success("Job added successfully!");
    resetForm();
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

  return (
    <div className="add-expenses-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
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
                  <DatePicker
                    className="w-full mt-1"
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

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">End Date <span className="text-red-500">*</span></label>

                  <DatePicker
                    className="w-full mt-1"
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
    </div>
  );
};
export default EditJob;
