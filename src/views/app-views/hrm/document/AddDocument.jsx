import React, { useState } from "react";
import { Form, Input, Button, Row, Col, message, Upload, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { RxCross2 } from "react-icons/rx";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import ReactQuill from "react-quill";
import { AddDocu, getDocu } from "./DocumentReducers/documentSlice";
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
    role: "",
    description: "",
  };
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

  const onSubmit = async (values, { resetForm }) => {
    // dispatch(AddDocu(values)).then(() => {
    //   dispatch(getDocu());
     
    // });

    const formData = new FormData();
    for (const key in values) {
        formData.append(key, values[key]);
    }

    
    dispatch(AddDocu(formData)).then((res)=>{
     
      dispatch(getDocu());
      message.success("Document added successfully!");
      resetForm();
      onClose();
    })
  };

  return (
    <div className="add-trainingSetup p-4">
      <hr className="mb-4 border border-gray-300" />
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
              <Col span={12}>
                <Form.Item label="Name" name="name">
                  <Field name="name">
                    {({ field }) => (
                      <Input placeholder="Enter Name" {...field} />
                    )}
                  </Field>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </Form.Item>
              </Col>
              <Col span={8} className="">
                <div className="form-item">
                  <label className="">Role</label>
                  <Field name="role">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select role"
                        className="w-full mt-2"
                        onChange={(value) => setFieldValue("role", value)}
                        value={values.role}
                        onBlur={() => setFieldTouched("role", true)}
                        allowClear={false}
                      >
                        <Option value="cilent">Cilent</Option>
                        <Option value="sub client">Sub Client</Option>
                        <Option value="user">User</Option>
                        <Option value="employee">Employee</Option>
                        <Option value="super admin">Super Admin</Option>
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
                    <label className="">Description</label>
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
              <Col span={24}>
                <Field name="file">
                       {({ field }) => (
                           <Form.Item label="Attachment">
                               <Upload
                                   beforeUpload={(file) => {
                                       setFieldValue("file", file); // Set the uploaded file in Formik state
                                       return false; // Prevent automatic upload
                                   }}
                                   showUploadList={false} // Hide the default upload list
                               >
                                   <Button icon={<UploadOutlined />}>Choose File</Button>
                               </Upload>
                           </Form.Item>
                       )}
                   </Field>
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
