import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  message,
  Upload,
} from "antd";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UploadOutlined } from "@ant-design/icons";
import { AddTickets, getAllTicket } from "./TicketReducer/TicketSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const AddTicket = ({ onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetUsers());
  }, [dispatch]);

  const allempdata = useSelector((state) => state.Users);
  const empData = allempdata?.Users?.data || [];
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const roles = useSelector((state) => state.role?.role?.data);
  const userRole = roles?.find(role => role.id === loggedInUser.role_id);

  const fnddatass = empData.filter(emp => {
    if (userRole?.role_name === 'client') {
      return emp.client_id === loggedInUser.id;
    } else {
      return emp.client_id === loggedInUser.client_id;
    }
  });

  const initialValues = {
    ticketSubject: "",
    requestor: "",
    priority: "",
    status: "",
    endDate: "",
    description: "",
    file: null,
  };

  const validationSchema = Yup.object().shape({
    ticketSubject: Yup.string().required("Subject is required"),
    requestor: Yup.string().required("Employee selection is required"),
    priority: Yup.string().required("Priority is required"),
    status: Yup.string().required("Status is required"),
    endDate: Yup.string().required("End date is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (values[key] !== null) {
          if (key === 'endDate') {
            formData.append(key, values[key]); // Use the date string directly
          } else if (key === 'file' && values[key]) {
            formData.append(key, values[key]);
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      await dispatch(AddTickets(formData)).unwrap();
      dispatch(getAllTicket());
      onClose();
      resetForm();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      <div className="border-b pb-[-10px] font-medium"></div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, setFieldValue, setFieldTouched }) => (
          <Form layout="vertical" onFinish={handleSubmit} className="space-y-4">
            <Row gutter={16}>
              {/* Subject */}
              <Col span={24}>
                <div className=" mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <Field name="ticketSubject">
                    {({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter subject"
                        className="w-full rounded-md"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="ticketSubject"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              {/* Employee Selection */}
              <Col span={12}>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee <span className="text-red-500">*</span>
                  </label>
                  <Field name="requestor">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select employee"
                        onChange={(value) => setFieldValue("requestor", value)}
                      >
                        {fnddatass?.map((employee) => (
                          <Option key={employee.id} value={employee.id}>
                            {employee.username || "Unnamed Employee"}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="requestor"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              {/* Priority */}
              <Col span={12}>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <Field name="priority">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        onChange={(value) => setFieldValue("priority", value)}
                      >
                        <Option value="Low">Low</Option>
                        <Option value="Medium">Medium</Option>
                        <Option value="High">High</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="priority"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              {/* Status */}
              <Col span={12}>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Field name="status">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        onChange={(value) => setFieldValue("status", value)}
                      >
                        <Option value="Open">Open</Option>
                        <Option value="In Progress">In Progress</Option>
                        <Option value="Closed">Closed</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              {/* End Date */}
              <Col span={12}>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <Field name="endDate">
                    {({ field }) => (
                      <input 
                        type="date"
                        className="w-full mt-1 p-2 border rounded"
                        value={field.value || ''}
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          setFieldValue('endDate', selectedDate);
                        }}
                        onBlur={() => setFieldTouched("endDate", true)}
                        min={dayjs().format('YYYY-MM-DD')}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="endDate"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              {/* Description */}
              <Col span={24}>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Field name="description">
                    {({ field }) => (
                      <TextArea
                        {...field}
                        rows={4}
                        className="w-full rounded-md"
                        placeholder="Enter description"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              {/* File Upload */}
              <Col span={24}>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment
                  </label>
                  <Upload
                    beforeUpload={(file) => {
                      const isValidFileType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
                      const isValidFileSize = file.size / 1024 / 1024 < 5;

                      if (!isValidFileType) {
                        message.error('You can only upload JPG/PNG/PDF files!');
                        return Upload.LIST_IGNORE;
                      }
                      if (!isValidFileSize) {
                        message.error('File must be smaller than 5MB!');
                        return Upload.LIST_IGNORE;
                      }

                      setFieldValue("file", file);
                      return false;
                    }}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />} className="bg-white">
                      Select File
                    </Button>
                  </Upload>
                </div>
              </Col>
            </Row>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Ticket
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTicket;
