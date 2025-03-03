import React, { useState } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { RxCross2 } from "react-icons/rx";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import { AddTrainng, GetallTrainng } from "./TrainingReducer/TrainingSlice";

const AddTrainingSetup = ({ onClose }) => {
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

  const handleDeleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    message.success("Row deleted successfully!");
  };

  const initialValues = {
    category: "",
  };

  const validationSchema = Yup.object({
    category: Yup.string().required("Please enter category"),
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
      await dispatch(AddTrainng(payload));
      await dispatch(GetallTrainng());

      message.success("Training setup added successfully!");
      form.setFieldsValue(initialValues);
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
    <div className="add-trainingSetup">
       <hr className="mt-3 border border-gray-300" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, resetForm }) => (
          <Form
            layout="vertical"
            form={form}
            name="add-trainingSetup"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Category" name="category" className="mt-3 font-semibold">
                  <Input
                    placeholder="Enter Category"
                    value={values.category}
                    onChange={(e) => setFieldValue("category", e.target.value)}
                  />
                </Form.Item>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                {rows.map((row) => (
                  <Row gutter={24} key={row.id} className="mb-4">
                    <Col span={10}>
                      <label className="font-medium text-gray-700">Title</label>
                      <Input
                        placeholder="Enter Title"
                        className="mb-4"
                        value={row.title}
                        onChange={(e) =>
                          setRows(
                            rows.map((r) =>
                              r.id === row.id
                                ? { ...r, title: e.target.value }
                                : r
                            )
                          )
                        }
                      />
                    </Col>
                    <Col span={10}>
                      <label className="font-medium text-gray-700">Link</label>
                      <Input
                        placeholder="Enter Link"
                        className="mb-4"
                        value={row.link}
                        onChange={(e) =>
                          setRows(
                            rows.map((r) =>
                              r.id === row.id
                                ? { ...r, link: e.target.value }
                                : r
                            )
                          )
                        }
                      />
                    </Col>
                    <Col span={4} className="flex justify-end">
                      {rows.length > 1 && (
                        <Button
                          danger
                          icon={<RxCross2 />}
                          onClick={() => handleDeleteRow(row.id)}
                          className="text-red-500 bg-red-100 hover:bg-red-200 p-2 flex items-center justify-center mt-4"
                        />
                      )}
                    </Col>
                  </Row>
                ))}
              </Col>
            </Row>

            <div className="form-buttons text-left">
              <Button
                className="border-0 text-blue-500 hover:text-blue-700 focus:outline-none"
                onClick={handleAddRow}
              >
                <PlusOutlined /> Add Row
              </Button>
            </div>

            <Form.Item>
              <div className="text-right">
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

export default AddTrainingSetup;
