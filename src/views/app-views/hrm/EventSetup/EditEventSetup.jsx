import React, { useEffect, useState } from "react";
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
import moment from "moment";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchEventsData,
  UpdateEventsetUp,
} from "./EventSetupService/EventSetupSlice";

const { Option } = Select;

const EditEventSetUp = ({ initialEventData, onCancel, id, onSuccess }) => {
  const dispatch = useDispatch();
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const eventData = {
        EventTitle: values.EventTitle,
        EventManager: values.EventManager,
        EventDate: values.EventDate.format("YYYY-MM-DD"),
        EventTime: values.EventTime,
      };

      dispatch(UpdateEventsetUp({ id, eventData })).then(() => {
        dispatch(fetchEventsData());
        message.success("Event updated successfully!");
        onSuccess(); // Close the form/modal
      });
    } catch (error) {
      message.error(error.message || "Failed to update the event.");
    } finally {
      setSubmitting(false);
    }
  };

  const [initialValues, setInitialValues] = useState({
    EventTitle: initialEventData?.EventTitle || "",
    EventManager: initialEventData?.EventManager || "",
    EventDate: initialEventData?.EventDate
      ? moment(initialEventData?.EventDate)
      : null,
    EventTime: initialEventData?.EventTime
      ? moment(initialEventData?.EventTime, "HH:mm")
      : null,
  });

  const validationSchema = Yup.object({
    EventTitle: Yup.string().required("Please enter event title."),
    EventManager: Yup.string().required("Please enter a manager name."),
    EventDate: Yup.date().nullable().required("Event Date is required."),
    EventTime: Yup.date()
      .nullable()
      .required("End Time is required.")
      .test(
        "is-greater",
        "End time should be after start time",
        function (value) {
          const { StartTime } = this.parent;
          if (!StartTime || !value) return true;
          return moment(value).isAfter(moment(StartTime));
        }
      ),
  });

  useEffect(() => {
    dispatch(fetchEventsData());
  }, [dispatch]);

  const tabledata = useSelector((state) => state.EventSetup);
  const events = tabledata?.events || []; // Add safety check for events

  const dataM = events.find((item) => item.id === id); // Use events if it's an array

  useEffect(() => {
    if (dataM) {
      setInitialValues({
        EventTitle: dataM.EventTitle || "",
        EventManager: dataM.EventManager || "",
        EventDate: dataM?.EventDate ? moment(dataM.EventDate) : null, // Convert to moment object
        EventTime: dataM.EventTime,
      });
    }
  }, [dataM]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
        <Form className="formik-form" onSubmit={handleSubmit}>

          <Row gutter={16}>
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Event Title</label>
                <Field name="EventTitle" as={Input} placeholder="Event Title" />
                <ErrorMessage
                  name="EventTitle"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>

            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Event Manager</label>
                <Field name="EventManager">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select Event Manager"
                      onChange={(value) => setFieldValue("EventManager", value)}
                      value={values.EventManager}
                      onBlur={() => setFieldTouched("EventManager", true)}
                    >
                      <Option value="Manager 1">Manager 1</Option>
                      <Option value="Manager 2">Manager 2</Option>
                      <Option value="Manager 3">Manager 3</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="EventManager"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>

            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Event Date</label>
                <DatePicker
                  className="w-full"
                  format="DD-MM-YYYY"
                  value={values.EventDate ? moment(values.EventDate) : null} // Ensure it's a moment object
                  onChange={(EventDate) =>
                    setFieldValue("EventDate", EventDate)
                  }
                  onBlur={() => setFieldTouched("EventDate", true)}
                />
                <ErrorMessage
                  name="EventDate"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>

            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Event Time</label>
                <TimePicker
                  className="w-full"
                  format="HH:mm"
                  value={
                    values.EventTime ? moment(values.EventTime, "HH:mm") : null
                  } // Ensure it's a moment object
                  onChange={(EventTime) =>
                    setFieldValue("EventTime", EventTime)
                  }
                  onBlur={() => setFieldTouched("EventTime", true)}
                />
                <ErrorMessage
                  name="EventTime"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </div>
            </Col>
          </Row>
          <div className="form-buttons text-right mt-2">
            <Button type="default" onClick={onSuccess} className="me-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Edit Event
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditEventSetUp;
