import React, { useEffect } from "react";
import {
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Row,
  Col,
  Upload,
} from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import { GetJobdata } from "../JobReducer/JobSlice";
import { getjobapplication } from "../JobApplication/JobapplicationReducer/JobapplicationSlice";
import {
  Addjobofferss,
  getjobofferss,
} from "./jobOfferletterReducer/jobofferlateerSlice";
import { UploadOutlined } from "@ant-design/icons";
import moment from 'moment';
import { getgeneralsettings } from '../../../setting/general/generalReducer/generalSlice';

const { Option } = Select;

const AddJobOfferLetter = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser.username);

  const [companyDetails, setCompanyDetails] = useState({});

  useEffect(() => {
    dispatch(GetJobdata());
    dispatch(getjobapplication());
    dispatch(getgeneralsettings());
  }, [dispatch]);

  const customerdata = useSelector((state) => state.Jobs);
  const fnddata = customerdata.Jobs.data || [];
  const fnd = fnddata.filter((item) => item.created_by === user);

  const customerdatass = useSelector((state) => state.jobapplications);
  const fnddatass = customerdatass.jobapplications.data || [];
  const fnddtaa = fnddatass.filter((item) => item.created_by === user);

  const generalSettings = useSelector((state) => state.generalsetting.generalsetting.data);

  useEffect(() => {
    if (generalSettings && generalSettings.length > 0) {
      setCompanyDetails({
        companyName: generalSettings[0].companyName
      });
    }
  }, [generalSettings]);

  const initialValues = {
    job: "",
    job_applicant: "",
    offer_expiry: null,
    expected_joining_date: null,
    salary: "",
    rate: "",
    description: "",
    file: null,
  };

  const validationSchema = Yup.object({
    job: Yup.string().required("Please select a job"),
    job_applicant: Yup.string().required("Please select a job application"),
    rate: Yup.string().required("Please enter a rate"),
    offer_expiry: Yup.date().required("Please select an offer expiry date"),
    expected_joining_date: Yup.date().required("Please select an expected joining date"),
    salary: Yup.string().required("Please enter a salary"),
    description: Yup.string().required("Please enter a description"),
  });

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleFileChange = ({ fileList: newFileList }) => {
    
    setFileList(newFileList);
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      
      // Only include the required fields
      const requiredFields = {
        job: values.job,
        job_applicant: values.job_applicant,
        offer_expiry: values.offer_expiry ? moment(values.offer_expiry).format('YYYY-MM-DD') : null,
        expected_joining_date: values.expected_joining_date ? moment(values.expected_joining_date).format('YYYY-MM-DD') : null,
        salary: values.salary,
        rate: values.rate,
        description: values.description
      };

      // Append only the required fields to formData
      Object.keys(requiredFields).forEach(key => {
        if (requiredFields[key] !== null && requiredFields[key] !== undefined) {
          formData.append(key, requiredFields[key]);
        }
      });

      // Handle file separately if it exists
      if (values.file) {
        const file = values.file;
        const isValidFileType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
        const isValidFileSize = file.size / 1024 / 1024 < 5;

        if (!isValidFileType) {
          throw new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.');
        }
        if (!isValidFileSize) {
          throw new Error('File size must be less than 5MB.');
        }

        formData.append('file', file);
      }

      await dispatch(Addjobofferss(formData)).unwrap();
      await dispatch(getjobofferss());
      message.success('Job offer letter added successfully');
      onClose();
      resetForm();
    } catch (error) {
      message.error(error?.message || 'Failed to add job offer letter');
    }
  };

  return (
    <div>
      <h2 className="mb-3 border-b pb-1 font-medium"></h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, setFieldTouched, handleSubmit }) => {
          const handleJobSelect = (value) => {
            setFieldValue("job_applicant", value);
            const selectedJobDetails = fnd.find(job => job.id === value);
            setSelectedJob(selectedJobDetails);
          };
          const handleJobApplicationSelect = (value) => {
            setFieldValue("job", value);
            const selectedApp = fnddtaa.find(app => app.id === value);
            setSelectedApplication(selectedApp);

            if (selectedApp) {
              const offerTemplate = `
Dear ${selectedApp.name},

We are pleased to offer you the position of ${selectedApp.job_title || 'the offered position'} at ${selectedApp.company_name || 'our company'}. Following our recent discussions, we would like to extend the following offer:

Position Details:
- Job Title: ${selectedApp.job_title || '[Job Title]'}
- Department: ${selectedApp.department || '[Department]'}
- Reporting to: ${selectedApp.reporting_manager || '[Manager Name]'}

Compensation:
- Base Salary: ${values.salary || '[Salary]'}
- Rate: ${values.rate || '[Rate]'}

Important Dates:
- Offer Valid Until: ${values.offer_expiry ? moment(values.offer_expiry).format('DD MMMM YYYY') : '[Expiry Date]'}
- Expected Start Date: ${values.expected_joining_date ? moment(values.expected_joining_date).format('DD MMMM YYYY') : '[Start Date]'}

Please review the attached documents for complete details about benefits, policies, and employment terms and conditions.

To accept this offer, please sign and return this letter by ${values.offer_expiry ? moment(values.offer_expiry).format('DD MMMM YYYY') : '[Expiry Date]'}.

We are excited about the prospect of you joining our team and believe you will be a great addition to our company.

Best regards,
[Your Name]
[Company Name]
              `;

              setFieldValue("value", offerTemplate);
            }
          };

          return (
            <Form
              onSubmit={handleSubmit}
              style={{
                // padding: "20px",
                background: "#fff",
                borderRadius: "8px",
              }}
            >
              <Row gutter={16}>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Job Application <span className="text-red-500">*</span></label>
                    <Field name="job">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          placeholder="Select job"
                          loading={!fnddtaa}
                          onChange={handleJobApplicationSelect}
                          onBlur={() => setFieldTouched("job", true)}
                        >
                          {fnddtaa?.length > 0 ? (
                            fnddtaa.map((client) => (
                              <Option key={client.id} value={client.id}>
                                {client.name || "Unnamed job"}
                              </Option>
                            ))
                          ) : (
                            <Option value="" disabled>
                              No job applications available
                            </Option>
                          )}
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="job"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Job <span className="text-red-500">*</span></label>
                    <Field name="job_applicant">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          placeholder="Select job"
                          loading={!fnd}
                          onChange={handleJobSelect}
                          onBlur={() => setFieldTouched("job_applicant", true)}
                        >
                          {fnd?.length > 0 ? (
                            fnd.map((client) => (
                              <Option key={client.id} value={client.id}>
                                {client.title || "Unnamed job"}
                              </Option>
                            ))
                          ) : (
                            <Option value="" disabled>
                              No jobs available
                            </Option>
                          )}
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="job_applicant"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>


                <Col span={12} className='mt-3'>
                  <div className="form-item">
                    <label className='font-semibold'>Offer Expire On <span className="text-red-500">*</span></label>
                    <DatePicker
                      className="w-full mt-1"
                      format="DD-MM-YYYY"
                      value={values.offer_expiry}
                      onChange={(date) => {
                        setFieldValue('offer_expiry', date);
                        // Clear expected joining date if it's before the new offer expiry date
                        if (values.expected_joining_date && date && values.expected_joining_date.isBefore(date)) {
                          setFieldValue('expected_joining_date', null);
                        }
                      }}
                      onBlur={() => setFieldTouched("offer_expiry", true)}
                    />
                    <ErrorMessage name="offer_expiry" component="div" className="error-message text-red-500 my-1" />
                  </div>
                </Col>

                <Col span={12} className='mt-3'>
                  <div className="form-item">
                    <label className='font-semibold'>Expected Joining Date <span className="text-red-500">*</span></label>
                    <DatePicker
                      className="w-full mt-1"
                      format="DD-MM-YYYY"
                      value={values.expected_joining_date}
                      onChange={(date) => setFieldValue('expected_joining_date', date)}
                      onBlur={() => setFieldTouched("expected_joining_date", true)}
                      disabledDate={(current) => {
                        // Disable dates before offer expiry date
                        return values.offer_expiry ? current && current < values.offer_expiry.startOf('day') : false;
                      }}
                    />
                    <ErrorMessage name="expected_joining_date" component="div" className="error-message text-red-500 my-1" />
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item mt-3">
                    <label className="font-semibold">Salary <span className="text-red-500">*</span></label>
                    <Field
                      name="salary"
                      as={Input}
                      className="mt-1 w-full"
                      placeholder="Enter Salary"
                    />
                    <ErrorMessage
                      name="salary"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item mt-3">
                    <label className="font-semibold">Rate <span className="text-red-500">*</span></label>
                    <Field
                      name="rate"
                      as={Input}
                      className="mt-1 w-full"
                      placeholder="Enter Rate"
                    />
                    <ErrorMessage
                      name="rate"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={24}>
                  <div className="form-item mt-3">
                    <label className="font-semibold">Description <span className="text-red-500">*</span></label>
                    <ReactQuill
                      theme="snow"
                      className="mt-1 w-full"
                      value={values.description}
                      onChange={(value) => setFieldValue("description", value)}
                      onBlur={() => setFieldTouched("description", true)}
                      placeholder="Enter Description"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={24}>
                  <div className="mt-4 border rounded-lg p-4">
                    <div className="bg-white p-6 rounded border shadow-sm">
                      {/* Company Header */}
                      <div className="text-right mb-8">
                        <h2 className="text-lg font-semibold">
                          {companyDetails.companyName || '[Company_Name]'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                          {moment().format('DD/MM/YYYY')}
                        </p>
                      </div>

                      {/* Offer Letter Title */}
                      <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold">Offer Letter</h1>
                      </div>

                      {/* Letter Content */}
                      <div className="space-y-4">
                        <p>Dear {selectedApplication?.name || '[Employee_Name]'},</p>

                        <p>
                          Congratulations! We are pleased to confirm that you have been selected to work for {companyDetails.companyName || '[Company_Name]'}.
                          We are delighted to make you the following job offer:
                        </p>

                        <p>
                          The position we are offering you is that of {selectedJob?.title || '[Job_Title]'} with an annual cost to company of {values.salary || '0'}.
                        </p>

                        <p>
                          We would like you to start work on {values.expected_joining_date ? moment(values.expected_joining_date).format('DD MMMM YYYY') : '[Employee_Joining_Date]'}.
                          {/* Please report to {selectedApplication?.reporting_manager || '[Manager_Name]'} for documentation and orientation.  */}
                          If this date is not acceptable, please contact me immediately. On joining, you will be invited to our HR tool
                          in which you may be required to upload your documents.
                        </p>

                        <p>
                          Please sign the enclosed copy of this letter and return it to me by {values.offer_expiry ? moment(values.offer_expiry).format('DD MMMM YYYY') : '[Acceptance_Last_Date]'} to
                          indicate your acceptance of this offer.
                        </p>

                        <p>
                          We are confident you will be able to make a significant contribution to the success of {companyDetails.companyName || '[Company_Name]'} and
                          look forward to working with you.
                        </p>

                        <div className="mt-8">
                          <p>Sincerely,</p>
                          <p>{companyDetails.companyName || '[Company_Name]'}</p>
                        </div>

                        {/* Acceptance Section */}
                        <div className="mt-12 pt-4 border-t">
                          <p>Accepted by,</p>
                          <p className="font-semibold">{selectedApplication?.name || '[Employee_Name]'}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </Col>

              </Row>

              <div style={{ textAlign: "right", marginTop: "16px" }}>
                <Button style={{ marginRight: 8 }} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddJobOfferLetter;
