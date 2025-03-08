import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, message, Upload, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { RxCross2 } from "react-icons/rx";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import { AddDocu, getDocu } from "./DocumentReducers/documentSlice";
import { getRoles } from '../RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice';
// import { AddTrainng, GetallTrainng } from "./TrainingReducer/TrainingSlice";
const { Option } = Select;
const AddDocument = ({ onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rows, setRows] = useState([
    {
      id: Date.now(),
      link: "",
      title: "",
    },
  ]);
  const initialValues = {
    name: "",
    role: null,
    description: "",
    file: null,
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter Name"),
    role: Yup.string().required("Please enter Role"),
    description: Yup.string().required("Please enter Description"),
  });
  const { role } = useSelector((state) => state.role);

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        link: "",
        title: "",
      },
    ]);
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      // Only append non-null values
      Object.keys(values).forEach(key => {
        if (key === 'file') {
          // Only append file if it exists
          if (values[key]) {
            formData.append(key, values[key]);
          }
        } else if (values[key] !== null && values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      // Add required fields validation
      if (!values.name || !values.role || !values.description) {
        throw new Error('Please fill in all required fields');
      }

      await dispatch(AddDocu(formData));
      message.success('Document created successfully!');
      dispatch(getDocu());
      onClose();
      resetForm();
    } catch (error) {
      message.error(error?.message || 'Failed to create document');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-trainingSetup">
      <h2 className="mb-3 border-b pb-1 font-medium"></h2>  
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, setFieldValue, setFieldTouched, values }) => (
          <Form
            layout="vertical"
            form={form}
            name="add-trainingSetup"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12} className="mt-3">
                <label className="font-semibold">Name <span className="text-red-500">*</span></label>
                <Field name="name" className="w-full mt-1">
                  {({ field }) => (
                    <Input placeholder="Enter Name" {...field} />
                  )}
                </Field>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message text-red-500 my-1"
                />

              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Role <span className="text-red-500">*</span></label>
                  <Field name="role">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select role"
                        className="w-full"
                        onChange={(value, option) => {
                          setFieldValue("role", option.children);
                        }}
                        value={values.role}
                        onBlur={() => setFieldTouched("role", true)}
                        allowClear={false}
                      >
                        {role?.data?.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.role_name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <div className=" w-full">
                <Col span={24} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Description <span className="text-red-500">*</span></label>
                    <ReactQuill
                      value={values.description}
                      onChange={(value) => setFieldValue("description", value)}
                      placeholder="Enter description"
                      className="mt-1"
                      onBlur={() => setFieldTouched("description", true)}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
              </div>
              <Col span={24} className="mt-3">
                <div className="mb-4">
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
                    onRemove={() => {
                      setFieldValue("file", null);
                    }}
                  >
                    <Button icon={<UploadOutlined />} className="bg-white">
                      Select File
                    </Button>
                  </Upload>
                </div>
              </Col>
            </Row>
            <Form.Item>
              <div className="text-right mt-2">
                <Button type="default" className="mr-2" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default AddDocument;
