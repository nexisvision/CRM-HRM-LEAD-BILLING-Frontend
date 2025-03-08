import React from "react";
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
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  createEventData,
  fetchEventsData,
} from "./EventSetupService/EventSetupSlice"; // Make sure the path is correct

const { Option } = Select;

const AddEventSetUp = ({ onSuccess }) => {
  const dispatch = useDispatch();
  

  const onSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        EventTitle: values.EventTitle,
        EventManager: values.EventManager,
        EventDate: moment(values.EventDate).format("YYYY-MM-DD"),
        EventTime: values.EventTime,
      };

      dispatch(createEventData(payload)).then(() => {
        dispatch(fetchEventsData())
          .then(() => {
            message.success("event added successfully!");
            resetForm();
            onSuccess();
          })
          .catch((error) => {
            message.error("Failed to fetch the latest event data.");
            console.error("MeetData API error:", error);
          });
      });
    } catch (error) {
      message.error(error?.message || "Failed to create event");
    }
  };

  const initialValues = {
    EventTitle: "",
    EventManager: "",
    EventDate: "",
    EventTime: "",
    // eventstartdate: null,
    // eventenddate: null,
    // description: '',
  };

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
    // employee: Yup.string().required('Please select a employee.'),
    // title: Yup.string().required('Please enter a title.'),
    // eventstartdate: Yup.date().nullable().required(' Event Start Date is required.'),
    // eventenddate: Yup.date().nullable().required('End Date is required.'),
    // description: Yup.string().required('Please enter a description.'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
        <Form className="formik-form" onSubmit={handleSubmit}>

          <Row gutter={16}>
            {/* <Col span={8}>
            <Form.Item
              name="branch"
              label="Branch"
              rules={[{ required: true, message: 'Please select an Branch.' }]}
            >
              <Select placeholder="Select Branch">
                <Option value="India">India</Option>
                <Option value="Canada">Canada</Option>
                <Option value="France">France</Option>
              </Select>
            </Form.Item>
          </Col> */}

            {/* <Col span={8}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select an Department.' }]}
              >
                <Select placeholder="Select Designation">
                  <Option value="Select Designation">Select Designation</Option>
                </Select>
              </Form.Item>
            </Col> */}

            {/* <Col span={8}>
              <Form.Item
                name="employee"
                label="Employee"
                rules={[{ required: true, message: 'Please select an Employee.' }]}
              >
                <Select placeholder="Select Employee">
                  <Option value="Select Employee">Select Employee</Option>
                </Select>
              </Form.Item>
            </Col> */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Event Title"</label>
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

            {/* <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Event Manager"</label>
                <Field name="EventManager" as={Input} placeholder="Event Title" />
                <ErrorMessage name="EventManager" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col> */}

            {/* <Col span={24}>
              <Form.Item
                name="title"
                label="Event Title"
                rules={[{ required: true, message: 'Please provide a title for the event.' }]}
              >
                <Input placeholder="Event Title" />
              </Form.Item>
            </Col> */}

            {/* <Col span={12}>
            <Form.Item
              name="eventmanager"
              label="EventManager"
              rules={[{ required: true, message: 'Please select an EventManager.' }]}
            >
              <Select placeholder="Select EventManager">
                <Option value="Candice">Candice</Option>
                <Option value="John Doe">John Doe</Option>
              </Select>
            </Form.Item>
          </Col> */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Event Date</label>
                <DatePicker
                  className="w-full"
                  format="DD-MM-YYYY"
                  value={values.EventDate}
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
                  format="HH:mm:ss"
                  value={values.EventTime}
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
            {/* <Col span={12}>
              <Form.Item
                name="eventstartdate"
                label="Event Start Date"
                rules={[{ required: true, message: 'Please select an event date.' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="eventenddate"
                label="Event End Date"
                rules={[{ required: true, message: 'Please select an event date.' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col> */}
            {/* <Col span={24} className='mt-2'>
              <label className='font-semibold'>Event Select Color</label>
            
              <div>
                <Button htmlType="" className='me-1 bg-cyan-500'></Button>
                <Button htmlType="" className='me-1 bg-orange-400'></Button>
                <Button htmlType="" className='me-1 bg-rose-500'></Button>
                <Button htmlType="" className='me-1 bg-lime-400'></Button>
                <Button htmlType="" className='bg-blue-800'></Button>
              </div>

            </Col> */}

            {/* <Col span={24} className='mt-2'>
              <div className="form-item">
                <label className="font-semibold">Event Description</label>
                <Field name="description">
                  {({ field }) => (
                    <ReactQuill
                      {...field}
                      value={values.description}
                      onChange={(value) => setFieldValue('description', value)}
                      onBlur={() => setFieldTouched("description", true)}
                      placeholder="Event Description"
                    />
                  )}
                </Field>
                <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col> */}

            {/* <Col span={24}>
              <Form.Item name="description" label="Event Description" rules={[{ required: true }]}>
                <ReactQuill placeholder="Enter Event Description" />
              </Form.Item>
            </Col> */}
          </Row>
          <div className="form-buttons text-right mt-2">
            <Button type="default" htmlType="submit" className="me-2">
              Cancel Event
            </Button>
            <Button type="primary" htmlType="submit">
              Add Event
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddEventSetUp;
