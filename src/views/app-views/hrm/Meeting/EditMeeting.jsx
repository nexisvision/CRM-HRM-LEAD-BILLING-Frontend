import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  TimePicker,
} from "antd";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import moment from "moment";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { EditMeet, MeetData } from "./MeetingReducer/MeetingSlice";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

const EditMeeting = ({ editData, meetid, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(MeetData());
  }, [dispatch]);

  const tabledata = useSelector((state) => state.Meeting);

  const dataM = tabledata.Meeting.data.find((item) => item.id === meetid);

  const [initialValues, setInitialValues] = useState({
    title: "",
    date: null,
    startTime: null,
    description: "",
  });

  useEffect(() => {
    if (dataM) {
      setInitialValues({
        title: dataM.title || "",
        date: dataM.date ? moment(dataM.date, "DD-MM-YYYY") : null,
        startTime: dataM.startTime ? moment(dataM.startTime, "HH:mm") : null,
        description: dataM.description || "",
      });
    }
  }, [dataM]);

  const onSubmit = (values) => {
    dispatch(EditMeet({ meetid, values }))
      .then(() => {
        dispatch(MeetData());
        message.success("Meeting details updated successfully!");
        onClose();
        navigate("/app/hrm/meeting");
      })
      .catch((error) => {
        message.error("Failed to update Meeting.");
        console.error("Edit API error:", error);
      });
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Please enter a meeting title."),
    date: Yup.date().nullable().required("Meeting date is required."),
    startTime: Yup.date().nullable().required("Meeting time is required."),
    description: Yup.string().required("Please enter a description."),
  });

  return (
    <div className="edit-meeting-form">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

            <Row gutter={16}>
              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Meeting Title</label>
                  <Field name="title" as={Input} placeholder="Meeting Title" />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Meeting Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.date}
                    onChange={(date) => setFieldValue("date", date)}
                    onBlur={() => setFieldTouched("date", true)}
                  />
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Meeting Time</label>
                  <TimePicker
                    className="w-full"
                    format="HH:mm"
                    value={values.startTime}
                    onChange={(startTime) =>
                      setFieldValue("startTime", startTime)
                    }
                    onBlur={() => setFieldTouched("startTime", true)}
                  />
                  <ErrorMessage
                    name="startTime"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Meeting Note</label>
                  <Field name="description">
                    {({ field }) => (
                      <ReactQuill
                        {...field}
                        value={values.description}
                        onChange={(value) =>
                          setFieldValue("description", value)
                        }
                        onBlur={() => setFieldTouched("description", true)}
                        placeholder="Write here..."
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-2">
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

export default EditMeeting;
