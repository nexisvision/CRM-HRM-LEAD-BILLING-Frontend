import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  Upload,
} from "antd";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { Editicket, getAllTicket } from "./TicketReducer/TicketSlice";
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";

const { Option } = Select;
const { TextArea } = Input;

const validationSchema = Yup.object().shape({
  ticketSubject: Yup.string().required("Subject is required"),
  requestor: Yup.string().required("Employee selection is required"),
  priority: Yup.string().required("Priority is required"),
  status: Yup.string().required("Status is required"),
  endDate: Yup.date().required("End date is required"),
  description: Yup.string().required("Description is required"),
});

const EditTicket = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const { ticketId } = useParams();

  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);


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

  const alldatat = useSelector((state) => state.Ticket);
  const fndfdata = alldatat.Ticket.data;
 

  useEffect(() => {
    dispatch(GetUsers());
  }, [dispatch]);

  const perfectdata = fndfdata.find((item) => item.id === idd);

  const initialValues = {
    ticketSubject: perfectdata?.ticketSubject || "",
    requestor: perfectdata?.requestor || "",
    priority: perfectdata?.priority || "Low",
    status: perfectdata?.status || "Open",
    endDate: perfectdata?.endDate ? moment(perfectdata.endDate) : null,
    description: perfectdata?.description || "",
    file: null
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      
      if (values.file) {
        formData.append('file', values.file);
      }

      Object.keys(values).forEach(key => {
        if (key !== 'file' && values[key] !== null) {
          if (key === 'endDate') {
            formData.append(key, values[key].format('YYYY-MM-DD'));
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      await dispatch(Editicket({ idd, formData })).unwrap();
      dispatch(getAllTicket());
      onClose();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      <div className="border-b border-gray-200 mb-2"></div>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleSubmit, setFieldValue, isSubmitting }) => (
          <Form layout="vertical" onFinish={handleSubmit} className="space-y-4">
            <Row gutter={16}>
              {/* Subject */}
              <Col span={24}>
                <div className="mt-3">
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
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.endDate ? dayjs(values.endDate) : null}
                    onChange={(date) => setFieldValue("endDate", date)}
                  />
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
                    fileList={fileList}
                    beforeUpload={(file) => {
                      setFieldValue("file", file);
                      setFileList([{
                        uid: '-1',
                        name: file.name,
                        status: 'done',
                        originFileObj: file
                      }]);
                      return false;
                    }}
                    onRemove={() => {
                      setFieldValue("file", null);
                      setFileList([]);
                    }}
                  >
                    <Button 
                      icon={<UploadOutlined />} 
                      className="bg-white"
                      disabled={fileList.length > 0}
                    >
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
                loading={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Update Ticket
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditTicket;
