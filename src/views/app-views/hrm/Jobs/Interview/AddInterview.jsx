import React, { useEffect } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  TimePicker,
  message,
  Row,
  Col,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AddInterviews, getInterview } from "./interviewReducer/interviewSlice";
import { GetJobdata } from "../JobReducer/JobSlice";
import { getjobapplication } from "../JobApplication/JobapplicationReducer/JobapplicationSlice";
const { Option } = Select;
const AddInterview = ({ onClose, onAddInterview }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetJobdata());
  }, []);

  const customerdata = useSelector((state) => state.Jobs);
  const fnddata = customerdata.Jobs.data;

  useEffect(() => {
    dispatch(getjobapplication());
  }, []);

  const allappdata = useSelector((state) => state.jobapplications);
  const datafnd = allappdata.jobapplications.data;

  const onSubmit = (values, { resetForm }) => {
    const formattedData = {
      id: Date.now(),
      job: values.job,
      candidate: values.candidate,
      interviewer: values.interviewer,
      round: values.round,
      interviewType: values.interviewType,
      startOn: values.startOn.format("YYYY-MM-DD"),
      startTime: values.startTime.format("HH:mm"),
      commentForInterviewer: values.commentForInterviewer,
      commentForCandidate: values.commentForCandidate,
    };
    onAddInterview(formattedData);
    dispatch(AddInterviews(formattedData)).then(() => {
      dispatch(getInterview());
      resetForm();
      onClose();
      message.success("Interview scheduled successfully!");
    });
    message.success("Interview scheduled successfully!");
  };
  const initialValues = {
    job: "",
    candidate: "",
    interviewer: "",
    round: "",
    interviewType: "",
    startOn: null,
    startTime: null,
    commentForInterviewer: "",
    commentForCandidate: "",
  };
  const validationSchema = Yup.object({
    job: Yup.string().required("Please select a job."),
    candidate: Yup.string().required("Please select a candidate."),
    interviewer: Yup.string().required("Please select an interviewer."),
    round: Yup.string().required("Please select a round."),
    interviewType: Yup.string().required("Please select an interview type."),
    startOn: Yup.date().nullable().required("Start date is required."),
    startTime: Yup.date().nullable().required("Start time is required."),
    commentForInterviewer: Yup.string().required(
      "Please enter a comment for the interviewer."
    ),
    commentForCandidate: Yup.string().required(
      "Please enter a comment for the candidate."
    ),
  });
  return (
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
        resetForm,
      }) => (
        <Form onSubmit={handleSubmit}>
          <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
          <Row gutter={16}>
            {/* Job Dropdown */}

            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">job</label>
                <Field name="job">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select job"
                      loading={!fnddata} // Loading state
                      onChange={(value) => setFieldValue("job", value)}
                      value={values.customer}
                      onBlur={() => setFieldTouched("job", true)}
                    >
                      {fnddata && fnddata.length > 0 ? (
                        fnddata.map((client) => (
                          <Option key={client.id} value={client.id}>
                            {client.title || "Unnamed job"}
                          </Option>
                        ))
                      ) : (
                        <Option value="" disabled>
                          No customers available
                        </Option>
                      )}
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="customer"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>

            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">candidate</label>
                <Field name="candidate">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select candidate"
                      loading={!fnddata} // Loading state
                      onChange={(value) => setFieldValue("candidate", value)}
                      value={values.customer}
                      onBlur={() => setFieldTouched("candidate", true)}
                    >
                      {datafnd && datafnd.length > 0 ? (
                        datafnd.map((client) => (
                          <Option key={client.id} value={client.id}>
                            {client.name || "Unnamed candidate"}
                          </Option>
                        ))
                      ) : (
                        <Option value="" disabled>
                          No customers available
                        </Option>
                      )}
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="customer"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>
            {/* Interviewer Dropdown */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Interviewer</label>
                <Field name="interviewer">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select Interviewer"
                      onChange={(value) => setFieldValue("interviewer", value)}
                      onBlur={() => setFieldTouched("interviewer", true)}
                    >
                      <Option value="John">John</Option>
                      <Option value="Jane">Jane</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="interviewer"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>
            {/* Round Dropdown */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Round</label>
                <Field name="round">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select Round"
                      onChange={(value) => setFieldValue("round", value)}
                      onBlur={() => setFieldTouched("round", true)}
                    >
                      <Option value="Technical">Technical</Option>
                      <Option value="HR">HR</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="round"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>
            {/* Interview Type Dropdown */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Interview Type</label>
                <Field name="interviewType">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select Interview Type"
                      onChange={(value) =>
                        setFieldValue("interviewType", value)
                      }
                      onBlur={() => setFieldTouched("interviewType", true)}
                    >
                      <Option value="In-Person">In-Person</Option>
                      <Option value="Virtual">Virtual</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="interviewType"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>
            {/* Start On */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Start On</label>
                <DatePicker
                  className="w-full"
                  format="DD-MM-YYYY"
                  value={values.startOn}
                  onChange={(date) => setFieldValue("startOn", date)}
                  onBlur={() => setFieldTouched("startOn", true)}
                />
                <ErrorMessage
                  name="startOn"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>
            {/* Start Time */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Start Time</label>
                <TimePicker
                  className="w-full"
                  format="HH:mm"
                  value={values.startTime}
                  onChange={(time) => setFieldValue("startTime", time)}
                  onBlur={() => setFieldTouched("startTime", true)}
                />
                <ErrorMessage
                  name="startTime"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>
            {/* Comment for Interviewer */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Comment for Interviewer</label>
                <Field
                  name="commentForInterviewer"
                  as={Input.TextArea}
                  placeholder="Enter comment for interviewer"
                />
                <ErrorMessage
                  name="commentForInterviewer"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>
            {/* Comment for Candidate */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Comment for Candidate</label>
                <Field
                  name="commentForCandidate"
                  as={Input.TextArea}
                  placeholder="Enter comment for candidate"
                />
                <ErrorMessage
                  name="commentForCandidate"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit" className="mt-3">
            Add Interview
          </Button>
        </Form>
      )}
    </Formik>
  );
};
export default AddInterview;
