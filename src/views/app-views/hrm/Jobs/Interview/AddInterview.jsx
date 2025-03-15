import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  TimePicker,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AddInterviews, getInterview } from "./interviewReducer/interviewSlice";
import { GetJobdata } from "../JobReducer/JobSlice";
import { getjobapplication } from "../JobApplication/JobapplicationReducer/JobapplicationSlice";
import moment from "moment";

const { Option } = Select;

const AddInterviewModal = ({ open, onCancel, onAddInterview, initialDate }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const jobsData = useSelector((state) => state.Jobs.Jobs.data) || [];
  const jobApplications =
    useSelector((state) => state.jobapplications.jobapplications.data) || [];

  useEffect(() => {
    dispatch(GetJobdata());
    dispatch(getjobapplication());
  }, [dispatch]);

  useEffect(() => {
    if (open && initialDate) {
      form.setFieldsValue({
        startOn: moment(initialDate),
      });
    }
  }, [open, initialDate, form]);

  const handleFinish = async (values) => {
    try {
      const timeValue = values.startTime
        ? values.startTime.format("HH:mm:ss")
        : null;

      const dataa = {
        ...values,
        startOn: moment(values.startOn).format("YYYY-MM-DD"),
        startTime: timeValue,
      };

      console.log("Time being sent:", timeValue);

      await dispatch(AddInterviews(dataa)).then(() => {
        message.success("Interview added successfully");
        dispatch(getInterview());
        onAddInterview();
        onCancel();
        form.resetFields();
      });
    } catch (error) {
      message.error("Failed to add interview");
    }
  };

  return (
    <Modal
      title="Add Interview"
      visible={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
    >
      <div className="mb-3 border-b pb-1 font-medium"></div>
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item
          name="job"
          label="Job"
          rules={[{ required: true, message: "Please select a job!" }]}
        >
          <Select placeholder="Select a job">
            {jobsData.map((job) => (
              <Option key={job.id} value={job.id}>
                {job.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="candidate"
          label="Candidate"
          rules={[{ required: true, message: "Please select a candidate!" }]}
        >
          <Select placeholder="Select a Candidate">
            {jobApplications.map((application) => (
              <Option key={application.id} value={application.id}>
                {application.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="interviewer"
          label="Interviewer"
          rules={[{ required: true, message: "Please input the interviewer!" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="round"
          label="Round"
          rules={[{ required: true, message: "Please input the round!" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="interviewType"
          label="Interview Type"
          rules={[
            { required: true, message: "Please select the interview type!" },
          ]}
        >
          <Select placeholder="Select interview type">
            <Option value="Online">Online</Option>
            <Option value="Offline">Offline</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="startOn"
          label="Start On"
          rules={[{ required: true, message: "Please select start date!" }]}
        >
          <DatePicker format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item
          name="startTime"
          label="Start Time"
          rules={[{ required: true, message: "Please select start time!" }]}
        >
          <TimePicker
            format="HH:mm:ss"
            use12Hours={false}
            defaultValue={moment("09:00:00", "HH:mm:ss")}
            minuteStep={5}
          />
        </Form.Item>
        <Form.Item name="commentForInterviewer" label="Comment For Interviewer">
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="commentForCandidate" label="Comment For Candidate">
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Interview
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddInterviewModal;
