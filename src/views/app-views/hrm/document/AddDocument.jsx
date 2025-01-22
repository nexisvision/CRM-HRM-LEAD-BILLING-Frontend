import React, { useState } from "react";
import { Form, Input, Button, Row, Col, message, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { RxCross2 } from "react-icons/rx";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
// import { AddTrainng, GetallTrainng } from "./TrainingReducer/TrainingSlice";

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
    employee: "",
    title: "",
    deductionOption: "",
    type: "",
    currency: "",
    amount: "",
  };

  const validationSchema = Yup.object({
    employee: Yup.string().required("Please enter employee"),
    title: Yup.string().required("Please enter title"),
    deductionOption: Yup.string().required("Please enter deduction option"),
    type: Yup.string().required("Please enter type"),
    currency: Yup.string().required("Please enter currency"),
    amount: Yup.number().required("Please enter amount").positive().integer(),
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

  const onSubmit = async (values, { resetForm }) => {
    const links = rows.reduce((acc, row, index) => {
      acc[index] = { title: row.title, url: row.link };
      return acc;
    }, {});

    const payload = {
      category: values.category,
      links: links,
    };

    try {
      //   await dispatch(AddTrainng(payload));
      //   await dispatch(GetallTrainng());

      message.success("Training setup added successfully!");
      resetForm();
      setRows([
        {
          id: Date.now(),
          link: "",
          title: "",
        },
      ]);

      onClose();
    } catch (error) {
      message.error("Failed to add training setup!");
    }
  };

  return (
    <div className="add-trainingSetup p-4">
      <hr className="mb-4 border border-gray-300" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit }) => (
          <Form
            layout="vertical"
            form={form}
            name="add-trainingSetup"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Employee" name="employee">
                  <Field name="employee">
                    {({ field }) => (
                      <Input
                        placeholder="Enter Employee"
                        {...field}
                       
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="employee"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Title" name="title">
                  <Field name="title">
                    {({ field }) => (
                      <Input
                        placeholder="Enter Title"
                        {...field}
                     
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Deduction Option" name="deductionOption">
                  <Field name="deductionOption">
                    {({ field }) => (
                      <Input
                        placeholder="Enter Deduction Option"
                        {...field}
                       
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="deductionOption"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Type" name="type">
                  <Field name="type">
                    {({ field }) => (
                      <Input
                        placeholder="Enter Type"
                        {...field}
                      
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Currency" name="currency">
                  <Field name="currency">
                    {({ field }) => (
                      <Input
                        placeholder="Enter Currency"
                        {...field}
                     
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="currency"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Amount" name="amount">
                  <Field name="amount">
                    {({ field }) => (
                      <Input
                        placeholder="Enter Amount"
                        {...field}
                       
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </Form.Item>
              </Col>
              <Col span={24} className="mt-2">
                <span className="block p-2">Add File</span>
                <Upload
                  listType="picture"
                  accept=".pdf"
                  maxCount={1}
                  showUploadList={{ showRemoveIcon: true }}
                  className="border-2 flex justify-center items-center p-10"
                >
                  <span className="text-xl">Choose File</span>
                </Upload>
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
