import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal, Select, DatePicker } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
// import { Card, Table,  Badge, Menu, Tag,Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import OrderListData from 'assets/data/order-list.data.json';
import Flex from 'components/shared-components/Flex'
import utils from 'utils';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import userData from 'assets/data/user-list.data.json';
import dayjs from 'dayjs';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddInvoice = () => {
    const [users, setUsers] = useState(userData);
    // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // const [list, setList] = useState(OrderListData);


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
        navigate('/apps/sales/invoice/');
    };

    const initialValues = {
        invoiceNumber: '',
        invoiceDate: null,
        duedate: null,
        currency: '',
        exchangerate: '',
        refnumber: '',
    };

    const validationSchema = Yup.object({
        invoiceNumber: Yup.string().required('Please enter invoice number.'),
        invoiceDate: Yup.date().nullable().required('Invoice Date is required.'),
        duedate: Yup.date().nullable().required('Due Date is required.'),
        currency: Yup.string().required('Please select currency.'),
        exchangerate: Yup.string().required('Please enter exchange rate.'),
        refnumber: Yup.string().required('Please enter a ref number.'),
    });


    // Search functionality
    // const onSearch = (e) => {
    //     const value = e.currentTarget.value;
    //     const searchArray = value ? list : OrderListData;
    //     const data = utils.wildCardSearch(searchArray, value);
    //     setList(data);
    //     setSelectedRowKeys([]);
    // };



    return (
        <>
            <div>
                <div className='bg-gray-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
                    <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
                    <Card className="border-0 mt-4">
                        <div className="">
                            <div className=" p-2">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={onSubmit}
                                >
                                    {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                                        <Form className="formik-form" onSubmit={handleSubmit}>
                                            <Row gutter={16}>
                                                <Col span={7}>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Invoice Number</label>
                                                        <div className='flex'>
                                                            <span className='border py-2 rounded-s-lg bg-[#f5f5f5] px-3'>INV#0</span>
                                                            <Field name="invoiceNumber" as={Input} placeholder="Enter Invoice Number" onBlur={() => setFieldTouched("invoiceNumber", true)} className=' rounded-e-lg rounded-s-none' />
                                                        </div>
                                                        <ErrorMessage name="invoiceNumber" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={4} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Invoice Date</label>
                                                        <DatePicker
                                                            className="w-full"
                                                            format="DD-MM-YYYY"
                                                            value={values.invoiceDate}
                                                            onChange={(invoiceDate) => setFieldValue('invoiceDate', invoiceDate)}
                                                            onBlur={() => setFieldTouched("invoiceDate", true)}
                                                        />
                                                        <ErrorMessage name="invoiceDate" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={4} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Due Date</label>
                                                        <DatePicker
                                                            className="w-full"
                                                            format="DD-MM-YYYY"
                                                            value={values.duedate}
                                                            onChange={(duedate) => setFieldValue('duedate', duedate)}
                                                            onBlur={() => setFieldTouched("duedate", true)}
                                                        />
                                                        <ErrorMessage name="duedate" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={5} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Currency</label>
                                                        <Field name="currency">
                                                            {({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    className="w-full"
                                                                    placeholder="Select Currency"
                                                                    onChange={(value) => setFieldValue('currency', value)}
                                                                    value={values.currency}
                                                                    onBlur={() => setFieldTouched("currency", true)}
                                                                >
                                                                    <Option value="usd$">USD($)</Option>
                                                                    <Option value="inr">INR(₹)</Option>
                                                                </Select>
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name="currency" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                                <Col span={4} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Exchange Rate</label>
                                                        <Field name="exchangerate" as={Input} placeholder="Enter Exchange Rate" />
                                                        <h6>( GBP To USD )</h6>
                                                        <ErrorMessage name="exchangerate" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                                {/* <Col span={8} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Category</label>
                                                        <Field name="category">
                                                            {({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    className="w-full"
                                                                    placeholder="Select Category"
                                                                    onChange={(value) => setFieldValue('category', value)}
                                                                    value={values.category}
                                                                    onBlur={() => setFieldTouched("category", true)}
                                                                >
                                                                    <Option value="xyz">XYZ</Option>
                                                                    <Option value="abc">ABC</Option>
                                                                </Select>
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name="category" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col> */}
                                            </Row>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </Card>

                    <Col span={24}>
                        <h4 className='ms-4 font-semibold text-lg mb-3'>Product & Services</h4>
                    </Col>

                    <Card>
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
                                                        {/* <input
                                                    type="text"
                                                    placeholder="Tax (%)"
                                                    className="w-full p-2 border rounded"
                                                /> */}
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

                            {/* Summary Section */}
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
                    </Card>

                    <div className="form-buttons text-right">
                        <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/estimates')}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Create</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddInvoice;

