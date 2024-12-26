import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  TimePicker,
  Select,
  message,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { EditTask, GetTaskdata } from "./TaskCalendarReducer/TaskCalendarSlice";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

const { Option } = Select;

const EditTaskcalendar = ({ idd, onAddTask, onCancel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const AllTaskData = useSelector((state) => state.TaskCalander);

  const dataM = AllTaskData.TaskCalander.data.find((item) => item.id === idd);

  const [initialValues, setInitialValues] = useState({
    taskName: "",
    taskDate: null,
    taskTime: null,
    taskDescription: "",
  });

  useEffect(() => {
    if (dataM) {
      setInitialValues({
        taskName: dataM.taskName || "",
        taskDate: dataM.taskDate ? moment(dataM.taskDate, "DD-MM-YYYY") : null,
        taskTime: dataM.taskTime ? moment(dataM.taskTime, "HH:mm") : null,
        taskDescription: dataM.taskDescription || "",
      });
    }
  }, [dataM]);

  const validationSchema = Yup.object({
    taskName: Yup.string().required("Please enter a title."),
    taskDescription: Yup.string().required("Please select tasker."),
    taskDate: Yup.date().nullable().required("Task Calender Date is required."),
    taskTime: Yup.string().required("Task Time is required."),
  });

  const onSubmit = (values) => {
    dispatch(EditTask({ idd, values }))
      .then(() => {
        dispatch(GetTaskdata());
        message.success("Task updated successfully!");
        onCancel();
      })
      .catch((error) => {
        message.error("Failed to update Employee.");
        console.error("Edit API error:", error);
      });
  };

  useEffect(() => {
    dispatch(GetTaskdata());
  }, [dispatch]);

  return (
    <div className="add-job-form">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Task Title</label>
                  <Field
                    name="taskName"
                    as={Input}
                    placeholder="Enter Task Name"
                  />
                  <ErrorMessage
                    name="taskName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Description</label>
                  <Field
                    name="taskDescription"
                    as={Input}
                    placeholder="Enter Task Description"
                    rules={[{ required: true }]}
                  />
                  <ErrorMessage
                    name="taskDescription"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Task Calender Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.taskDate}
                    onChange={(date) => setFieldValue("taskDate", date)}
                  />
                  <ErrorMessage
                    name="taskDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Task Time</label>
                  <TimePicker
                    className="w-full"
                    format="HH:mm"
                    value={values.taskTime}
                    onChange={(time) => setFieldValue("taskTime", time)}
                  />
                  <ErrorMessage
                    name="taskTime"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-4">
              <Button type="default" className="mr-2" onClick={onCancel}>
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

export default EditTaskcalendar;
