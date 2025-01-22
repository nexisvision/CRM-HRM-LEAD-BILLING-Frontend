import React, { useState } from "react";
import { Form, Input, Button, Row, Col, message, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { RxCross2 } from "react-icons/rx";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import ReactQuill from "react-quill";
// import { AddTrainng, GetallTrainng } from "./TrainingReducer/TrainingSlice";

const EditProposal = ({ onClose }) => {
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
        leadtitle: "",
        dealtitle: "",
        vaildtill: "",
        currency: "",
        calculatedtax: "",
        item:"",
        discount:"",
        tax:"",
        total:"",   
        description: "",
    };

    const validationSchema = Yup.object({
        leadtitle: Yup.string().required("Please enter Lead Title"),
        dealtitle: Yup.string().required("Please enter Deal Title"),
        vaildtill: Yup.string().required("Please enter Vaild Till"),
        currency: Yup.string().required("Please enter currency"),
        calculatedtax: Yup.string().required("Please enter Calculated Tax"),
        item: Yup.string().required("Please enter Item"),
        discount: Yup.string().required("Please enter Discount"),
        tax: Yup.string().required("Please enter  Tax"),
        total: Yup.string().required("Please enter Total"),
        description: Yup.number().required("Please enter Description").positive().integer(),
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
                {({ handleSubmit ,values,setFieldValue,setFieldTouched}) => (
                    <Form
                        layout="vertical"
                        form={form}
                        name="add-trainingSetup"
                        onFinish={handleSubmit}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Lead Title" name="leadtitle">
                                    <Field name="leadtitle">
                                        {({ field }) => (
                                            <Input
                                                placeholder="Enter Lead Title"
                                                {...field}

                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="leadtitle"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Deal Title" name="dealtitle">
                                    <Field name="dealtitle">
                                        {({ field }) => (
                                            <Input
                                                placeholder="Enter Deal Title"
                                                {...field}

                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="dealtitle"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Vaild Till" name="vaildtill">
                                    <Field name="vaildtill">
                                        {({ field }) => (
                                            <Input
                                                placeholder="Enter Vaild Till"
                                                {...field}

                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="vaildtill"
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
                                <Form.Item label="Calculated Tax" name="calculatedtax">
                                    <Field name="calculatedtax">
                                        {({ field }) => (
                                            <Input
                                                placeholder="Enter Calculated Tax"
                                                {...field}

                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="calculatedtax"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Item" name="item">
                                    <Field name="item">
                                        {({ field }) => (
                                            <Input
                                                placeholder="Enter Item"
                                                {...field}

                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="item"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Discount" name="discount">
                                    <Field name="discount">
                                        {({ field }) => (
                                            <Input
                                                placeholder="Enter Discount"
                                                {...field}

                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="discount"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Tax" name="tax">
                                    <Field name="tax">
                                        {({ field }) => (
                                            <Input
                                                placeholder="Enter Tax"
                                                {...field}

                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="tax"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Total" name="total">
                                    <Field name="total">
                                        {({ field }) => (
                                            <Input
                                                placeholder="Enter Total"
                                                {...field}

                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="total"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} className="mt-2">
                                <div className="form-item">
                                    <label className="">Description</label>
                                    <Field name="description">
                                        {({ field }) => (
                                            <ReactQuill
                                                {...field}
                                                 className="mt-2"
                                                placeholder="Enter Description"
                                                value={values.description}
                                                onChange={(value) =>
                                                    setFieldValue("description", value)
                                                }
                                                onBlur={() =>
                                                    setFieldTouched("description", true)
                                                }
                                            />
                                        )}
                                    </Field>
                                </div>
                            </Col>
                        </Row>

                        <Form.Item>
                            <div className="text-right mt-3">
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

export default EditProposal;
