import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  message,
  Upload,
} from "antd";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { AddTickets, getAllTicket } from "./TicketReducer/TicketSlice";
import { useDispatch, useSelector } from "react-redux";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";

const { Option } = Select;

const AddTicket = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata());
  }, []);

  const alldata = useSelector((state) => state.employee);
  const fnddata = alldata.employee.data;

  const initialValues = {
    ticketSubject: "",
    requestor: "",
    priority: "Low",
    status: "Open",
    endDate: null,
    description: "",
    attachment: null,
  };

  const validationSchema = Yup.object({
    ticketSubject: Yup.string().required("Please enter a subject."),
    requestor: Yup.string().required("Please select a user."),
    priority: Yup.string().required("Please select priority."),
    status: Yup.string().required("Please select status."),
    endDate: Yup.date().required("Please select an end date."),
    description: Yup.string().required("Please enter a description."),
  });

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddTickets(values));
    dispatch(getAllTicket());
    dispatch(getAllTicket());
    onClose();
    resetForm();
    console.log("Submitted values:", values);
    message.success("Ticket created successfully!");
  };

  return (
    <div className="create-ticket-form">
      {/* <h2>Create Support Ticket</h2> */}
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values, resetForm }) => (
          <FormikForm>
            <Row gutter={[16, 16]}>
              {/* Subject */}
              <Col span={24}>
                <Field name="ticketSubject">
                  {({ field }) => (
                    <Form.Item label="Subject" required>
                      <Input {...field} placeholder="Enter Subject" />
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* <Col span={12}>
                <Field name="requestor">
                  {({ field }) => (
                    <Form.Item label="Support for Employee" required>
                      <Select
                        {...field}
                        onChange={(value) => setFieldValue("requestor", value)}
                        placeholder="Select User"
                      >
                        <Option value="Buffy Walter">Buffy Walter</Option>
                        <Option value="John Doe">John Doe</Option>
                      </Select>
                    </Form.Item>
                  )}
                </Field>
              </Col> */}

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Employee</label>
                  <Field name="requestor">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select requestor"
                        loading={!fnddata} // Loading state
                        onChange={(value) => setFieldValue("requestor", value)}
                        value={values.customer}
                      >
                        {fnddata && fnddata.length > 0 ? (
                          fnddata.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.username || "Unnamed requestor"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Employee available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="requestor"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Priority */}
              <Col span={12}>
                <Field name="priority">
                  {({ field }) => (
                    <Form.Item label="Priority" required>
                      <Select
                        {...field}
                        onChange={(value) => setFieldValue("priority", value)}
                        placeholder="Select Priority"
                      >
                        <Option value="Low">Low</Option>
                        <Option value="Medium">Medium</Option>
                        <Option value="High">High</Option>
                      </Select>
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Status */}
              <Col span={12}>
                <Field name="status">
                  {({ field }) => (
                    <Form.Item label="Status" required>
                      <Select
                        {...field}
                        onChange={(value) => setFieldValue("status", value)}
                        placeholder="Select Status"
                      >
                        <Option value="Open">Open</Option>
                        <Option value="In Progress">In Progress</Option>
                        <Option value="Closed">Closed</Option>
                      </Select>
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* End Date */}
              {/* <Col span={12}>
                <Field name="endDate">
                  {({ field }) => (
                    <Form.Item label="End Date" required>
                      <DatePicker
                        {...field}
                        style={{ width: "100%" }}
                        format="DD-MM-YYYY"
                        onChange={(date, dateString) =>
                          setFieldValue("endDate", dateString)
                        }
                      />
                    </Form.Item>
                  )}
                </Field>
              </Col> */}

              <Col span={8} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">End Date</label>

                  <DatePicker
                    className="w-full mt-2"
                    format="DD-MM-YYYY"
                    value={values.endDate}
                    onChange={(date) => setFieldValue("endDate", date)}
                  />
                  <ErrorMessage
                    name="endDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Description */}
              <Col span={24}>
                <Field name="description">
                  {({ field }) => (
                    <Form.Item label="Description" required>
                      <Input.TextArea
                        {...field}
                        rows={4}
                        placeholder="Enter Description"
                      />
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Attachment */}
              <Col span={24}>
                <Field name="attachment">
                  {({ field }) => (
                    <Form.Item label="Attachment">
                      <Upload
                        beforeUpload={(file) => {
                          setFieldValue("attachment", file);
                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />}>Choose File</Button>
                      </Upload>
                    </Form.Item>
                  )}
                </Field>
              </Col>
            </Row>

            {/* Form Actions */}
            <Form.Item>
              <div style={{ textAlign: "right" }}>
                <Button
                  type="default"
                  onClick={onClose}
                  style={{ marginRight: 10 }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </div>
            </Form.Item>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default AddTicket;
