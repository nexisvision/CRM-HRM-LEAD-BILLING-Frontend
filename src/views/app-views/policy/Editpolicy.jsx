import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Select,
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
import { getBranch } from "../hrm/Branch/BranchReducer/BranchSlice";
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;

const EditpolicyList = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getpolicys());
  }, [dispatch]);

  const allbranch = useSelector((state) => state.Branch);
  const fndbranch = allbranch.Branch.data;

  const allpolicy = useSelector((state) => state.policy);
  const fndpolicy = allpolicy.policy.data;

  useEffect(() => {
    if (fndpolicy) {
      const findofferdatas = fndpolicy.find((item) => item.id === idd);
      if (findofferdatas) {
        setInitialValues({
          branch: findofferdatas.branch,
          title: findofferdatas.title,
          description: findofferdatas.description,
        });
      }
    }
  }, [fndpolicy, idd]);

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach(key => {
        if (key === 'file' && values[key]) {
          formData.append('file', values[key]);
        } else if (values[key]) {
          formData.append(key, values[key]);
        }
      });

      const response = await dispatch(editpolicys({ idd, formData })).unwrap();

      if (response) {
        message.success('Policy added successfully!');
        dispatch(getpolicys());
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error("Submission error:", error);
      message.error(error?.message || "An error occurred while adding the policy.");
    } finally {
      setSubmitting(false);
    }
  };
  const [initialValues, setInitialValues] = useState({
    branch: "",
    title: "",
    description: "",
  });
  const validationSchema = Yup.object({
    branch: Yup.string().required("Please select a Branch."),
    title: Yup.string().required("Please enter a Title."),
    description: Yup.string().required("Please enter a description."),
  });
  return (
    <div>
      <div className="mb-3 border-b pb-1 font-medium"></div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, setFieldTouched, handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            style={{
              padding: "20px",
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <Row gutter={16}>
              <Col span={12} className="mb-4">
                <div className="form-item">
                  <label className="font-semibold">Branch</label>
                  <Field name="branch">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Branch"
                        onChange={(value) => setFieldValue("branch", value)}
                        value={values.branch}
                        onBlur={() => setFieldTouched("branch", true)}
                      >
                        {fndbranch?.map((branch) => (
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
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item ">
                  <label className="font-semibold ">Title</label>
                  <Field name="title" as={Input} placeholder="Enter Title" />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error-message text-red-500  my-1"
                  />
                </div>
              </Col>

              <Col span={24}>
                <div className="form-item mt-4">
                  <label className="font-semibold">Description</label>
                  <ReactQuill
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                    onBlur={() => setFieldTouched("description", true)}
                    placeholder="Enter Description"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <div className="mt-4 w-full">
                <span className="block  font-semibold p-2">Add File</span>
                <Col span={24}>
                  <Field name="file">
                    {({ field }) => (
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
                    )}
                  </Field>
                </Col>
              </div>
            </Row>
            <div style={{ textAlign: "right", marginTop: "16px" }}>
              <Button style={{ marginRight: 8 }} onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditpolicyList;
