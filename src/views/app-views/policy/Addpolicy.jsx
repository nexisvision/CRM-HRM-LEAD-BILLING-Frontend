import React from 'react';
import { Input, Button, Select, Radio, message, Row, Col, Upload ,    DatePicker,} from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import ReactQuill from "react-quill";
const { Option } = Select;


const  AddpolicyList = ({ onClose }) => {
  const dispatch = useDispatch();
  const onSubmit = async (values) => {
    // console.log("Form submitted:", values);
    // try {
    //   dispatch(Addjobapplication(values)).then(() => {
    //     dispatch(getjobapplication());
    //     onClose();
    //     message.success("Form submitted successfully");
    //   });
    //   message.success("Job application added successfully!");
    // } catch (error) {
    //   console.error("Submission error:", error);
    //   message.error("An error occurred while submitting the job application.");
    // }
  };
  const initialValues = {
    branch: "",
    title: "",
    description: "",
  };
  const validationSchema = Yup.object({
    branch: Yup.string().required("Please select a Branch."),
    title: Yup.string().required("Please enter a Title."),
    description: Yup.string().required("Please enter a description."),
  });
  return (
    <div>
      <hr style={{ marginBottom: "15px", border: "1px solid #E8E8E8" }} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
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

              <Col span={12}>
                <div className="form-item ">
                  <label className="font-semibold">Branch</label>
                  <Select

                    placeholder="Select Branch"
                    value={values.branch}
                    onChange={(value) => setFieldValue("branch", value)}
                    onBlur={() => setFieldTouched("branch", true)}
                    className="w-full"
                  >
                    <Option value="All">All</Option>
                    <Option value="Branch1">Branch1</Option>
                  </Select>
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
                  <Field name="jobapplication" as={Input} placeholder="Enter Title" />
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
                  <Upload
                    listType="picture"
                    accept=".pdf"
                    maxCount={1}
                    showUploadList={{ showRemoveIcon: true }}
                    className="border-2 flex justify-center items-center p-10 "
                  >
                    <span className="text-xl">Choose File</span>
                    {/* <CloudUploadOutlined className='text-4xl' /> */}
                  </Upload>
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

export default AddpolicyList;
