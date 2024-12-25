import React, { useState } from 'react';
import { Row, Col, Input, message, Button, Select, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import userData from 'assets/data/user-list.data.json';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddCrediteNotes = () => {

    const [rows, setRows] = useState([
        {
            id: Date.now(),
            item: "",
            quantity: "",
            price: "",
            discount: "",
            tax: "",
            amount: "0",
            description: "",
            isNew: false,
        },
    ]);

    // Function to handle adding a new row
    const handleAddRow = () => {
        setRows([
            ...rows,
            {
                id: Date.now(),
                item: "",
                quantity: "",
                price: "",
                discount: "",
                tax: "",
                amount: "0",
                description: "",
                isNew: true,
            },
        ]);
    };

    // Function to handle deleting a row
    const handleDeleteRow = (id) => {
        const updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
        alert("Are you sure you want to delete this element?")
        // calculateTotals(updatedRows);
    };

    const navigate = useNavigate();

    const onSubmit = (values) => {
        console.log('Submitted values:', values);
        message.success('Job added successfully!');
        navigate('/apps/sales/estimates/');
    };

    const initialValues = {
        invoice: '',
        amount: '',
        date: null,
        description: '',
    };

    const validationSchema = Yup.object({
        invoice: Yup.string().required('Please select invoice.'),
        amount: Yup.string().min(1, "please enter minimum 1 amount").required('Please enter a amount.'),
        date: Yup.date().nullable().required('Date is required.'),
        description: Yup.string().required('Please enter a description.'),
    });



    return (
        <>
            <div>
                <div className='' >
                    <h2 className="mb-3 border-b pb-[5px] font-medium"></h2>
                        <div className="">
                            <div className="">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={onSubmit}
                                >
                                    {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                                        <Form className="formik-form" onSubmit={handleSubmit}>
                                            <Row gutter={16}>
                                                <Col span={24} >
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Invoice</label>
                                                        <Field name="invoice">
                                                            {({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    className="w-full"
                                                                    placeholder="Select Invoice"
                                                                    onChange={(value) => setFieldValue('invoice', value)}
                                                                    value={values.invoice}
                                                                    onBlur={() => setFieldTouched("invoice", true)}
                                                                >
                                                                    <Option value="Select Invoice">Select Invoice</Option>
                                                                    <Option value="xyz">xyz</Option>
                                                                    <Option value="abc">ABC</Option>
                                                                </Select>
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name="invoice" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Amount</label>
                                                        <Field name="amount" as={Input} placeholder="Enter Amount" type="number" />
                                                        <ErrorMessage name="amount" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Issue Date</label>
                                                        <DatePicker
                                                            className="w-full"
                                                            format="DD-MM-YYYY"
                                                            value={values.date}
                                                            onChange={(date) => setFieldValue('date', date)}
                                                            onBlur={() => setFieldTouched("date", true)}
                                                        />
                                                        <ErrorMessage name="date" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                                <Col span={24} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className="font-semibold">Description</label>
                                                        <Field name="description">
                                                            {({ field }) => (
                                                                <ReactQuill
                                                                    {...field}
                                                                    placeholder='Enter Description'
                                                                    value={values.description}
                                                                    onChange={(value) => setFieldValue('description', value)}
                                                                    onBlur={() => setFieldTouched("description", true)}
                                                                />
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                            </Row>

                                            <div className="form-buttons text-right mt-4">
                                                <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/expenses')}>Cancel</Button>
                                                <Button type="primary" htmlType="submit">Create</Button>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                   


                    {/* <Card>
                <div>
                    <div className="overflow-x-auto">
                        <div className="form-buttons text-right mb-2">
                            <Button type="primary" onClick={handleAddRow}>
                            <PlusOutlined />  Add Items
                            </Button>
                        </div>
                        <table className="w-full border border-gray-200 bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                        ITEMS<span className="text-red-500">*</span>
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                        QUANTITY<span className="text-red-500">*</span>
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                        PRICE<span className="text-red-500">*</span>
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                        DISCOUNT<span className="text-red-500">*</span>
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                        TAX (%)
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b">
                                        AMOUNT
                                        <br />
                                        <span className="text-red-500 text-[10px]">AFTER TAX & DISCOUNT</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <React.Fragment key={row.id}>
                                        <tr>
                                            <td className="px-4 py-2 border-b">
                                                <select className="w-full p-2 border rounded">
                                                    <option value="">--</option>
                                                    <option value="item1">Item 1</option>
                                                    <option value="item2">Item 2</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                <input
                                                    type="text"
                                                    placeholder="Qty"
                                                    className="w-full p-2 border rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                <div className="flex items-center">
                                                    <input
                                                        type="text"
                                                        placeholder="Price"
                                                        className="w-full p-2 border rounded-s"
                                                    />
                                                    <span className="text-gray-500 border border-s rounded-e px-3 py-2">
                                                        $
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                <div className="flex items-center">
                                                    <input
                                                        type="text"
                                                        placeholder="Discount"
                                                        className="w-full p-2 border rounded-s"
                                                    />
                                                    <span className=" text-gray-500 border border-s rounded-e py-2 px-3">
                                                        $
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                              
                                            </td>
                                            <td className="px-4 py-2 border-b text-center">0</td>
                                            <td className="px-2 py-1 border-b text-center">
                                                {row.isNew && (
                                                    <Button
                                                        danger
                                                        onClick={() => handleDeleteRow(row.id)}
                                                    >
                                                       <DeleteOutlined />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={6} className="px-4 py-2 border-b">
                                                <textarea
                                                    rows={1}
                                                    placeholder="Description"
                                                    className="w-[70%] p-2 border rounded"
                                                ></textarea>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                   
                    <div className="mt-3 flex flex-col items-end space-y-2">
                        <div className="flex justify-between w-full sm:w-1/2 border-b pb-2">
                            <span className="text-gray-700">Sub Total ($):</span>
                            <span className="text-gray-700">NaN</span>
                        </div>
                        <div className="flex justify-between w-full sm:w-1/2 border-b pb-2">
                            <span className="text-gray-700">Discount ($):</span>
                            <span className="text-gray-700">NaN</span>
                        </div>
                        <div className="flex justify-between w-full sm:w-1/2 border-b pb-2">
                            <span className="text-gray-700">Tax ($):</span>
                            <span className="text-gray-700">0.00</span>
                        </div>
                        <div className="flex justify-between w-full sm:w-1/2">
                            <span className="font-semibold text-gray-700">Total Amount ($):</span>
                            <span className="font-semibold text-gray-700">0.00</span>
                        </div>
                    </div>
                </div>
            </Card> */}


                </div>
            </div>
        </>
    );
};

export default AddCrediteNotes;



