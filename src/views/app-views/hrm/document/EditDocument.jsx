import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, message, Upload, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { RxCross2 } from "react-icons/rx";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import { AddDocu, editDocu, getDocu } from "./DocumentReducers/documentSlice";
import { getRoles } from '../RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice';
// import { AddTrainng, GetallTrainng } from "./TrainingReducer/TrainingSlice";
const { Option } = Select;
const EditDocument = ({ idd, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDocu());
  }, []);

  const alladatas = useSelector((state) => state.Documents);
  const fnddtaas = alladatas.Documents.data;

  const { role } = useSelector((state) => state.role);

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  useEffect(() => {
    if (fnddtaas) {
      const fdd = fnddtaas.find((item) => item.id === idd);
      if (fdd) {
        setinitialValues({
          name: fdd.name,
          role: fdd.role,
          description: fdd.description,
          file: null,
        });
      }
    }
  }, [fnddtaas, idd]);

  const [rows, setRows] = useState([
    {
      id: Date.now(),
      link: "",
      title: "",
    },
  ]);
  const [initialValues, setinitialValues] = useState({
    name: "",
    role: "",
    description: "",
    file: null,
  });
  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter Name"),
    role: Yup.string().required("Please enter Role"),
    description: Yup.string().required("Please enter Description"),
  });
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
  // const onSubmit = async (values, { resetForm }) => {
  //   const links = rows.reduce((acc, row, index) => {
  //     acc[index] = { title: row.title, url: row.link };
  //     return acc;
  //   }, {});
  //   const payload = {
  //     category: values.category,
  //     links: links,
  //   };
  //   try {
  //     await dispatch(AddDocu(payload));
  //     await dispatch(getDocu());
  //     message.success("Training setup added successfully!");
  //     resetForm();
  //     setRows([
  //       {
  //         id: Date.now(),
  //         link: "",
  //         title: "",
  //       },
  //     ]);
  //     onClose();
  //   } catch (error) {
  //     message.error("Failed to add training setup!");
  //   }
  // };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (values[key] !== null) {
          if (key === 'file' && values[key]) {
            formData.append(key, values[key]);
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      await dispatch(editDocu({ idd, formData }));
      message.success('Document updated successfully!');
      dispatch(getDocu());
      onClose();
      resetForm();
    } catch (error) {
      message.error(error?.message || 'Failed to update document');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-trainingSetup">
      <hr className="mb-4 border border-gray-300" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ handleSubmit, setFieldValue, setFieldTouched, values }) => (
          <Form
            layout="vertical"
            form={form}
            name="add-trainingSetup"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
              <label className="font-semibold">Name <span className="text-red-500">*</span></label>
                  <Field name="name">
                    {({ field }) => (
                      <Input placeholder="Enter Name" {...field} className="mt-2" />
                    )}
                  </Field>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
           
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Role <span className="text-red-500">*</span></label>
                  <Field name="role">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select role"
                        className="w-full mt-1"
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
              <div className="mt-2 w-full">
                <Col span={24} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Description <span className="text-red-500">*</span></label>
                    <ReactQuill
                      value={values.description}
                      onChange={(value) => setFieldValue("description", value)}
                      placeholder="Enter description"
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
export default EditDocument;
