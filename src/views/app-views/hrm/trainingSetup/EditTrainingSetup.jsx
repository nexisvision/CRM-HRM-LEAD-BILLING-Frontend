import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { RxCross2 } from "react-icons/rx";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  AddTrainng,
  EditTraing,
  GetallTrainng,
} from "./TrainingReducer/TrainingSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
// import { getallcurrencies } from "views/app-views/setting/currencies/currenciesreducer/currenciesSlice";

const EditTrainingSetup = ({ idd, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const allempdata = useSelector((state) => state.Training);
  const Expensedata = allempdata?.Training?.data || [];

  const [initialValues, setInitialValues] = useState({
    category: "",
  });

  useEffect(() => {
    if (idd) {
      const milestone = Expensedata.find((item) => item.id === idd);

      if (milestone) {
        const parsedLinks = milestone.links ? JSON.parse(milestone.links) : {};
        const linkArray = Object.keys(parsedLinks).map((key) => ({
          id: key,
          title: parsedLinks[key].title || "",
          link: parsedLinks[key].url || "",
        }));

        setRows(linkArray);
        setInitialValues({
          category: milestone.category,
        });
      } else {
        message.error("Task not found!");
      }
    }
  }, [idd, Expensedata]);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetallTrainng());
  }, []);

  const handleDeleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    message.success("Row deleted successfully!");
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

  const onSubmit = (values, { resetForm }) => {
    const links = rows.reduce((acc, row, index) => {
      acc[index] = { title: row.title, url: row.link };
      return acc;
    }, {});

    const payload = {
      category: values.category,
      links,
    };

    dispatch(EditTraing({ idd, payload }));
    dispatch(GetallTrainng());
    onClose();
    message.success("Training setup updated successfully!");
  };

  return (
    <div className="add-trainingSetup">
      <Formik
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        initialValues={initialValues}
        enableReinitialize
      >
        {({ values, setFieldValue, handleSubmit, resetForm }) => (
          <Form
            layout="vertical"
            form={form}
            name="Edit-trainingSetup"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={10}>
                <label className="font-medium text-gray-700">category</label>
                <Input
                  placeholder="Enter category"
                  className="mb-4"
                  value={values.category}
                  onChange={(e) => setFieldValue("category", e.target.value)}
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
                  Update
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditTrainingSetup;
