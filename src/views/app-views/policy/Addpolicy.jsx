import React, { useEffect, useState } from "react";
import { Input, Button, Select, message, Row, Col, Upload } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import { Addpolicys, getpolicys } from "./policyReducer/policySlice";
import { getBranch } from "../hrm/Branch/BranchReducer/BranchSlice";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddpolicyList = ({ onClose }) => {
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch branches on component mount
  useEffect(() => {
    dispatch(getBranch())
      .unwrap()
      .catch(() => message.error("Failed to fetch branches"));
  }, [dispatch]);

  const branches = useSelector((state) => state.Branch.Branch?.data || []);

  const initialValues = {
    branch: "",
    title: "",
    description: "",
    file: null
  };

  const validationSchema = Yup.object({
    branch: Yup.string().required("Branch is required"),
    title: Yup.string()
      .required("Title is required")
      .max(100, "Title must not exceed 100 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    file: Yup.mixed().nullable()
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Add form fields to formData
      formData.append("branch", values.branch);
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
    <div className="p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Branch</label>
                  <Field name="branch">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Branch"
                        onChange={(value) => setFieldValue("branch", value)}
                      >
                        {branches.map((branch) => (
                          <Option key={branch.id} value={branch.id}>
                            {branch.branchName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="branch"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Title</label>
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
                  <label className="block font-medium mb-1">Description</label>
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
                  <label className="block font-medium mb-1">Upload File</label>
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
                </div>
              </Col>
            </Row>

            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddpolicyList;
