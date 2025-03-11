import React from "react";
import {
  Input,
  Button,
  TimePicker,
  message,
  Modal,
  Form,
} from "antd";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { AddTask, GetTaskdata } from "./TaskCalendarReducer/TaskCalendarSlice";
import moment from 'moment';

const AddTaskcalendar = ({ open, onCancel, selectedDate }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      const taskData = {
        taskName: values.title,
        taskDate: selectedDate,
        taskTime: moment(values.start).format('HH:mm'),
        taskDescription: values.taskDescription,
      };

console.log("dfdfdfgdfdfgdf",taskData);

      await dispatch(AddTask(taskData));
      await dispatch(GetTaskdata());
      message.success('Task added successfully');
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error('Failed to add task');
    }
  };

  return (
    <Modal
      title="New Task"
      open={open}
      footer={null}
      destroyOnClose={true}
      onCancel={onCancel}
    >
      <h2 className="mb-4 border-b pb-2 font-medium"></h2>
      <Form form={form} layout="vertical" name="new-task" preserve={false} onFinish={onSubmit}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the task title!' }]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="start"
          label="Time"
          rules={[{ required: true, message: 'Please select time!' }]}
        >
          <TimePicker className="w-100" format="HH:mm" />
        </Form.Item>

        <Form.Item
          name="taskDescription"
          label="Task Description"
          rules={[{ required: true, message: 'Please enter task description!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item className="text-right mb-0">
          <Button type="default" onClick={onCancel} className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Create Task
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTaskcalendar;
