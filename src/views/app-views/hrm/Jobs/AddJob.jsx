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
import {
  AddLable,
  GetLable,
} from "views/app-views/dashboards/project/milestone/LableReducer/LableSlice";
import { AddJobs, GetJobdata } from "./JobReducer/JobSlice";

const { Option } = Select;

const AddJob = ({ onClose }) => {
  const navigate = useNavigate();
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);

  const { currencies } = useSelector((state) => state.currencies);
  const dispatch = useDispatch();

  const AllLoggeddtaa = useSelector((state) => state.user);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState([]);

  const [isTagModalVisible, setIsTagModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getallcurrencies());
  }, [dispatch]);
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
    category: Yup.number().required("Please enter Job Category."),
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
    // Transforming skills and interviewRounds into the desired object structure
    const transformedValues = {
      ...values,
      skills: { Skills: values.skills },
      interviewRounds: { InterviewRounds: values.interviewRounds },
    };

    dispatch(AddJobs(transformedValues));
    dispatch(GetJobdata());
    onClose();
    console.log("Submitted values:", transformedValues);
    message.success("Job added successfully!");
    resetForm();
  };

  useEffect(() => {
    const lid = AllLoggeddtaa.loggedInUser.id;
    GetLable(lid);
  }, []);

  const fetchTags = async () => {
    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const response = await dispatch(GetLable(lid));

      if (response.payload && response.payload.data) {
        const uniqueTags = response.payload.data
          .filter((label) => label && label.name) // Filter out invalid labels
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t.name === label.name)
          ); // Remove duplicates

        setTags(uniqueTags);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      message.error("Failed to load tags");
    }
  };

  const handleAddNewTag = async () => {
    if (!newTag.trim()) {
      message.error("Please enter a tag name");
      return;
    }

    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const payload = {
        name: newTag.trim(),
      };

      await dispatch(AddLable({ lid, payload }));
      message.success("Tag added successfully");
      setNewTag("");
      setIsTagModalVisible(false);

      // Fetch updated tags
      await fetchTags();
    } catch (error) {
      console.error("Failed to add tag:", error);
      message.error("Failed to add tag");
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
              <Col span={8}>
                <div className="form-item">
                  <label className="font-semibold">Job Title</label>
                  <Field
                    className="mt-2"
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

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Job Category</label>
                  <div className="flex gap-2">
                    <Field name="category">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full"
                          placeholder="Select or add new tag"
                          onChange={(value) => {
                            form.setFieldValue("category", value);
                          }}
                          onBlur={() => form.setFieldTouched("category", true)}
                          dropdownRender={(menu) => (
                            <div>
                              {menu}
                              <div
                                style={{
                                  padding: "8px",
                                  borderTop: "1px solid #e8e8e8",
                                }}
                              >
                                <Button
                                  type="link"
                                  //   icon={<PlusOutlined />}
                                  onClick={() => setIsTagModalVisible(true)}
                                  block
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
                      )}
                    </Field>
                  </div>
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
                    name="category"
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
                        placeholder="Select location"
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
                    name="invoiceDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold mb-2">Interview Rounds</label>
                  <Field name="interview rounds">
                    {({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        placeholder="Select InterviewRounds"
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
                    name="duedate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={8} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Start Date </label>
                  <DatePicker
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
                  <label className="font-semibold">Recuiter</label>
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
                          placeholder="Select jobType"
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
                      name="jon types"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </div>
              </Col>

              <Col span={8} className="mt-2">
                <div className="mt-4 w-full">
                  <div className="form-item">
                    <label className="font-semibold">Work Experence</label>
                    <Field name="workExperience">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select workExperience"
                          className="w-full mt-2"
                          onChange={(value) =>
                            setFieldValue("workExperience", value)
                          }
                          value={values.workexperence}
                          onBlur={() => setFieldTouched("workExperience", true)}
                          allowClear={false}
                        >
                          <Option value="xyz">XYZ</Option>
                          <Option value="abc">ABC</Option>
                        </Select>
                      )}
                    </Field>
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
                    <label className="font-semibold">Curreney</label>
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
                      value={values.endDate}
                      onChange={(value) => setFieldValue("description", value)}
                      placeholder="Enter discription"
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
                      placeholder="Enter expectedSalary"
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
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <Modal
        title="Add New Tag"
        open={isTagModalVisible}
        onCancel={() => setIsTagModalVisible(false)}
        onOk={handleAddNewTag}
        okText="Add Tag"
      >
        <Input
          placeholder="Enter new tag name"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
      </Modal>
    </div>
  );
};
export default AddJob;
