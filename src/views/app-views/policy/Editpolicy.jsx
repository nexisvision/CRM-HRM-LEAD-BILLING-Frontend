import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  message,
  Row,
  Col,
  Upload,
} from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import { editpolicys, getpolicys } from "./policyReducer/policySlice";
import { UploadOutlined } from '@ant-design/icons';

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Title must not exceed 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  file: Yup.mixed().nullable()
});

const EditpolicyList = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getpolicys());
  }, [dispatch]);

  const allpolicy = useSelector((state) => state.policy);
  const fndpolicy = allpolicy.policy.data;

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    file: null
  });

  useEffect(() => {
    if (fndpolicy) {
      const findPolicyData = fndpolicy.find((item) => item.id === idd);
      if (findPolicyData) {
        setInitialValues({
          title: findPolicyData.title,
          description: findPolicyData.description,
        });
      }
    }
  }, [fndpolicy, idd]);

  const onSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("title", values.title.trim());
      formData.append("description", values.description.trim());

      if (values.file) {
        formData.append("file", values.file);
      }

      await dispatch(editpolicys({ idd, formData })).unwrap();
      await dispatch(getpolicys());
      
      message.success('Policy updated successfully!');
      onClose();
    } catch (error) {
      message.error(error?.message || "An error occurred while updating the policy.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-3 border-b pb-1 font-medium"></div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            style={{
              padding: "20px",
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Title <span className="text-red-500">*</span></label>
                  <Field
                    name="title"
                    as={Input}
                    placeholder="Enter Title"
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
                        placeholder="Enter Description"
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
                  <label className="block mb-1 font-semibold">Upload File</label>
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
                      Choose File
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
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditpolicyList;
