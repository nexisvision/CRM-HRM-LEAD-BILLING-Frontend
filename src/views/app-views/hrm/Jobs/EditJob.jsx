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
import { CloudUploadOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { getallcurrencies } from "views/app-views/setting/currencies/currenciesreducer/currenciesSlice";
import moment from "moment";
import { EditJobs, GetJobdata } from "./JobReducer/JobSlice";
// import { getallcurrencies } from '../../../setting/currencies/currenciesreducer/currenciesSlice';

const { Option } = Select;

const EditJob = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);

  const { currencies } = useSelector((state) => state.currencies);
  const dispatch = useDispatch();

  const allempdata = useSelector((state) => state.Jobs);
  const Expensedata = allempdata?.Jobs?.data || [];

  useEffect(() => {
    if (idd) {
      const milestone = Expensedata.find((item) => item.id === idd);

      if (milestone) {
        const updatedValues = {
          title: milestone.title || "",
          category: milestone.category || "",
          skills: milestone.skills || "",
          location: milestone.location || "",
          interviewRounds: milestone.interviewRounds || "",
          recruiter: milestone.recruiter || "",
          startDate: milestone.startDate ? moment(milestone.startDate) : null,
          endDate: milestone.endDate ? moment(milestone.endDate) : null,
          jobType: milestone.jobType || "",
          workExperience: milestone.workExperience || "",
          currency: milestone.currency || "",
          description: milestone.description || "",
          status: milestone.status || "",
          expectedSalary: milestone.expectedSalary || "",
        };

        setInitialValues(updatedValues); // Update the initial values state
      } else {
        message.error("Task not found!");
      }
    }
  }, [idd, Expensedata]); // Dependencies ensure this runs when `idd` or `Expensedata` changes

  useEffect(() => {
    dispatch(getallcurrencies());
  }, [dispatch]);
  // const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: "",
    category: "",
    skills: "",
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
  });
  const validationSchema = Yup.object({
    title: Yup.string().required("Please enter Job Title."),
    category: Yup.string().required("Please enter Job Category."),
    skills: Yup.string().required("Please enter Skills."),
    location: Yup.string().required("Please enter Location."),
    interviewRounds: Yup.array().required("please enter Interview Rounds"),
    startDate: Yup.string().required("Please enter Satrt Date."),
    endDate: Yup.string().required("Please enter End Date."),
    recruiter: Yup.string().required("Please enter recruiter."),
    jobType: Yup.string().required("Please enter Job Type."),
    workExperience: Yup.string().required("Please enter Work Expernce."),
    currency: Yup.string().required("Please enter currency"),
    description: Yup.string().required("Please enter Job Discription."),
    status: Yup.string().required("Please enter status."),
    expectedSalary: Yup.string().required("Please enter Expect Salary."),

    // files: Yup.string().required('Please enter Files.'),
  });
  // const onSubmit = (values, { resetForm }) => {
  //   console.log("Submitted values:", values);
  //   message.success("Payment added successfully!");
  //   resetForm();
  //   navigate("/app/dashboards/project/list");
  // };

  const onSubmit = (values, { resetForm }) => {
    dispatch(EditJobs({ idd, values }))
      .then(() => {
        dispatch(GetJobdata());
        message.success("Expenses added successfully!");
        onClose();
      })
      .catch((error) => {
        message.error("Failed to update Employee.");
        console.error("Edit API error:", error);
      });
  };
  return (
    <div className="add-expenses-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={8}>
                <div className="form-item">
                  <label className="font-semibold">Job Title</label>
                  <Field
                    className="mt-2"
                    name="title"
                    as={Input}
                    placeholder="Enter job title"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={8}>
                <div className="form-item">
                  <label className="font-semibold">Job Category</label>
                  <Field name="category">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select job category"
                        className="w-full mt-2"
                        onChange={(value) => setFieldValue("category", value)}
                        value={values.category}
                        onBlur={() => setFieldTouched("category", true)}
                        allowClear={false}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
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
              <Col span={8}>
                <div className="form-item">
                  <label className="font-semibold">Skill</label>
                  <Field name="skills">
                    {({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        placeholder="Select skills"
                        className="w-full mt-2"
                        onChange={(value) => setFieldValue("skills", value)}
                        value={values.skills}
                        onBlur={() => setFieldTouched("skills", true)}
                        allowClear={false}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="skills"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold mb-2">Location</label>
                  <Field name="location">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="location"
                        className="w-full mt-2"
                        onChange={(value) => setFieldValue("location", value)}
                        value={values.location}
                        onBlur={() => setFieldTouched("location", true)}
                        allowClear={false}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold mb-2">Interview Rounds</label>
                  <Field name="interviewRounds">
                    {({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        placeholder=" Select interviewRounds"
                        className="w-full mt-2"
                        onChange={(value) =>
                          setFieldValue("interviewRounds", value)
                        }
                        value={values.interviewRounds}
                        onBlur={() => setFieldTouched("interviewRounds", true)}
                        allowClear={false}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="interviewRounds"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={8} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Start Date </label>
                  <DatePicker
                    name="startDate"
                    className="w-full mt-2"
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

              <Col span={8} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">End Date</label>

                  <DatePicker
                    name="endDate"
                    className="w-full mt-2"
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

              <Col span={8} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">recruiter</label>
                  <Field name="recruiter">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select recruiter"
                        className="w-full mt-2"
                        onChange={(value) => setFieldValue("recruiter", value)}
                        value={values.recruiter}
                        onBlur={() => setFieldTouched("recruiter", true)}
                        allowClear={false}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="recruiter"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={8} className="mt-2">
                <div className="mt-4 w-full">
                  <div className="form-item">
                    <label className="font-semibold">Job Types</label>
                    <Field name="jobType">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select job types"
                          className="w-full mt-2"
                          onChange={(value) => setFieldValue("jobType", value)}
                          value={values.jobTypes}
                          onBlur={() => setFieldTouched("jobType", true)}
                          allowClear={false}
                        >
                          <Option value="xyz">XYZ</Option>
                          <Option value="abc">ABC</Option>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="jobType"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </div>
              </Col>

              <Col span={8} className="mt-2">
                <div className="mt-4 w-full">
                  <div className="form-item">
                    <label className="font-semibold">Work Experience</label>
                    <Field
                      className="mt-2"
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

              <Col span={8} className="mt-2">
                <div className="mt-4 w-full">
                  <div className="form-item">
                    <label className="font-semibold">Currency</label>
                    <Field name="currency">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select currency"
                          className="w-full mt-2"
                          onChange={(value) => setFieldValue("currency", value)}
                          value={values.currency}
                          onBlur={() => setFieldTouched("currency", true)}
                          allowClear={false}
                        >
                          <Option value="xyz">XYZ</Option>
                          <Option value="abc">ABC</Option>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="currency"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </div>
              </Col>

              <div className="mt-4 w-full">
                <Col span={24} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Job Discription</label>

                    <ReactQuill
                      name="description    "
                      value={values.description}
                      onChange={(value) => setFieldValue("description", value)}
                      placeholder="Enter description"
                      onBlur={() => setFieldTouched("description", true)}
                      className="mt-2"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
              </div>

              <div className="mt-4 w-full">
                <Col span={24} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Status</label>
                    <Field
                      className="mt-2"
                      name="status"
                      as={Input}
                      placeholder="Enter status"
                    />
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
              </div>

              <div className="mt-4 w-full">
                <Col span={24} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Expect Salary</label>
                    <Field
                      className="mt-2"
                      name="expectedSalary"
                      as={Input}
                      placeholder="Enter expect salary"
                    />
                    <ErrorMessage
                      name="expectedSalary"
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
    </div>
  );
};
export default EditJob;
