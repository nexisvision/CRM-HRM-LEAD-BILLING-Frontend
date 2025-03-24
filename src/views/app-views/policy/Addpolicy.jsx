import React, { useState } from "react";
import { Input, Button, message, Row, Col, Upload } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import ReactQuill from "react-quill";
import { Addpolicys, getpolicys } from "./policyReducer/policySlice";
import { UploadOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Title must not exceed 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  file: Yup.mixed().nullable()
});

const AddpolicyList = ({ onClose }) => {
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    title: "",
    description: "",
    file: null
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);

      if (values.file) {
        formData.append("file", values.file);
      }

      await dispatch(Addpolicys(formData)).unwrap();
      await dispatch(getpolicys());

      message.success("Policy added successfully");
      resetForm();
      setFileList([]);
      onClose();
    } catch (error) {
      message.error(error.message || "Failed to add policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="mb-3 border-b pb-1 font-medium"></div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <Row gutter={16}>
              <Col span={24}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Title <span className="text-red-500">*</span></label>
                  <Field
                    name="title"
                    as={Input}
                    placeholder="Enter title"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={24}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Description <span className="text-red-500">*</span></label>
                  <Field name="description">
                    {({ field }) => (
                      <ReactQuill
                        value={field.value}
                        onChange={(value) => setFieldValue("description", value)}
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

              <Col span={24}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Upload File <span className="text-red-500">*</span></label>
                  <Upload
                    fileList={fileList}
                    beforeUpload={(file) => {
                      setFieldValue("file", file);
                      setFileList([file]);
                      return false;
                    }}
                    onRemove={() => {
                      setFieldValue("file", null);
                      setFileList([]);
                    }}
                  >
                    <Button icon={<UploadOutlined />} disabled={fileList.length > 0}>
                      Select File
                    </Button>
                  </Upload>
                  <ErrorMessage
                    name="file"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={onClose}
                disabled={loading}
                style={{ marginRight: '8px' }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddpolicyList;
