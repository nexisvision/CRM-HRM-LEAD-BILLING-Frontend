import React, { useState,useEffect } from 'react';
import { Card, Checkbox, Menu, Row, Col, Tag, Input, message, Button, Upload, Select, DatePicker, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, CloudUploadOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, FilterOutlined, EditOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
// import { Card, Table,  Badge, Menu, Tag,Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from 'react-quill';
import OrderListData from 'assets/data/order-list.data.json';
import Flex from 'components/shared-components/Flex'
import utils from 'utils';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import userData from 'assets/data/user-list.data.json';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { getallcurrencies } from '../../../setting/currencies/currenciesreducer/currenciesSlice';
import * as Yup from 'yup';

const { Option } = Select;

const EditInvoice = () => {
    const [users, setUsers] = useState(userData);
    // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // const [list, setList] = useState(OrderListData);
    const [isExpanded, setIsExpanded] = useState(false);

    const [discountType, setDiscountType] = useState("%");
    const [discountValue, setDiscountValue] = useState(0);
    const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
    const [list, setList] = useState(OrderListData)
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showFields, setShowFields] = useState(false);
    const { currencies } = useSelector((state) => state.currencies);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getallcurrencies());
    }, [dispatch]);

    const handleCheckboxChange = (e) => {
        setShowFields(e.target.checked);
    };



    const handleProductChange = (value) => {
        setSelectedProduct(value);
        console.log('Selected product:', value);
    };

    const handleMilestoneChange = (value) => {
        setSelectedMilestone(value);
        console.log('Selected Milestone:', value);
    };
 

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
        message.success('Invoice added successfully!');
        navigate('/app/dashboards/project/list');
    };

    const initialValues = {
        invoiceDate: null,
        duedate: null,
        currency: '',
        client: '',
        project: '',
        tax: '',
    };

    const validationSchema = Yup.object({
        invoiceDate: Yup.date().nullable().required('Invoice Date is required.'),
        duedate: Yup.date().nullable().required('Due Date is required.'),
        currency: Yup.string().required('Please select currency.'),
        client: Yup.string().required('Please enter client name.'),
        project: Yup.string().required('Please enter project name.'),
        tax: Yup.string().required('Please select tax.'),
    });

    const handleShowStatus = value => {
        if (value !== 'All') {
            const key = 'orderStatus'
            const data = utils.filterArray(OrderListData, key, value)
            setList(data)
        } else {
            setList(OrderListData)
        }
    }

    const getShippingStatus = orderStatus => {
        if (orderStatus === 'Ready') {
            return 'blue'
        }
        if (orderStatus === 'Shipped') {
            return 'cyan'
        }
        return ''
    }
    const invoiceStatusList = ['Ready', 'Shipped']

    const onSearch = e => {
        const value = e.currentTarget.value
        const searchArray = e.currentTarget.value ? list : OrderListData
        const data = utils.wildCardSearch(searchArray, value)
        setList(data)
        setSelectedRowKeys([])
    }

    const CurrencyField = () => (
        <Col span={8} className="">
            <div className="form-item">
                <div className="flex gap-2">
                    <Field name="currency">
                        {({ field, form }) => (
                            <Select
                                {...field}
                                className="w-full mt-2"
                                placeholder="Select Currency"
                                onChange={(value) => {
                                    const selectedCurrency = currencies.find(c => c.id === value);
                                    form.setFieldValue("currency", selectedCurrency?.currencyCode || '');
                                }}
                            >
                                {currencies?.map((currency) => (
                                    <Option
                                        key={currency.id}
                                        value={currency.id}
                                    >
                                        {currency.currencyCode}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </Field>
                </div>
                <ErrorMessage
                    name="currency"
                    component="div"
                    className="error-message text-red-500 my-1"
                />
            </div>
        </Col>
    );


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
                                                {/* <Col span={7}>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Invoice Number</label>
                                                        <div className='flex'>
                                                            <span className='border py-2 rounded-s-lg bg-[#f5f5f5] px-3'>INV#0</span>
                                                            <Field name="invoiceNumber" as={Input} placeholder="Enter Invoice Number" onBlur={() => setFieldTouched("invoiceNumber", true)} className=' rounded-e-lg rounded-s-none' />
                                                        </div>
                                                        <ErrorMessage name="invoiceNumber" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col> */}
                                                <Col span={12} className='mt-2'>
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
                                                <Col span={12} className='mt-2'>
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
                                                <Col span={24} className="mt-4">
                                                <div className="form-item">
                                                    <label className="font-semibold">Currency</label>
                                                    <Field name="currency" component={CurrencyField} />
                                                    <ErrorMessage
                                                        name="currency"
                                                        component="div"
                                                        className="error-message text-red-500 my-1"
                                                    />
                                                </div>
                                                </Col>

                                                {/* <Col span={4} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Exchange Rate</label>
                                                        <Field name="exchangerate" as={Input} placeholder="Enter Exchange Rate" />
                                                        <h6>( GBP To USD )</h6>
                                                        <ErrorMessage name="exchangerate" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col> */}
                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Client</label>
                                                        <Field name="client" as={Input} placeholder="Enter Client Name" />
                                                        <ErrorMessage name="client" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Project</label>
                                                        <Field name="project" as={Input} placeholder="Website Copier Project" />
                                                        <ErrorMessage name="project" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Calculate Tax</label>
                                                        <Field name="tax">
                                                            {({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    className="w-full"
                                                                    placeholder="Select Tax"
                                                                    onChange={(value) => setFieldValue('tax', value)}
                                                                    value={values.tax}
                                                                    onBlur={() => setFieldTouched("tax", true)}
                                                                >
                                                                    <Option value="after">After Discount</Option>
                                                                    <Option value="before">Before Discount</Option>
                                                                </Select>
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name="tax" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                            </Row>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </Card>


                    <Card>
                        <div>
                            <div className="overflow-x-auto">
                                <Flex alignItems="center"  mobileFlex={false} className='flex mb-4 gap-4'>
                                    <Flex className="flex " mobileFlex={false}>
                                        <div className="w-full flex gap-4">
                                            <div>
                                                <Select
                                                    value={selectedProduct}
                                                    onChange={handleProductChange}
                                                    className="w-full !rounded-none"
                                                    placeholder="Select Milestone"
                                                    rootClassName="!rounded-none"
                                                >
                                                    <Option value="smart_speakers">Smart Speakers</Option>
                                                    <Option value="electric_kettle">Electric Kettle</Option>
                                                    <Option value="headphones">Headphones</Option>
                                                </Select>
                                            </div>


                                        </div>

                                    </Flex>
                                    <Flex gap="7px" className="flex">
                                        <div className="w-full flex gap-4">
                                            <div>
                                                <Select
                                                    value={selectedMilestone}
                                                    onChange={handleMilestoneChange}
                                                    className="w-full !rounded-none"
                                                    placeholder="Select Milestone"
                                                    rootClassName="!rounded-none"
                                                >
                                                    <Option value="smart_speakers">Milestone 1</Option>
                                                    <Option value="electric_kettle">Milestone 2</Option>
                                                    <Option value="headphones">Milestone 3</Option>
                                                </Select>
                                            </div>

                                        </div>
                                    </Flex>
                                </Flex>

                                <table className="w-full border border-gray-200 bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                                Description<span className="text-red-500">*</span>
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                                Quantity<span className="text-red-500">*</span>
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                                Unit Price <span className="text-red-500">*</span>
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                                TAX (%)
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                                Amount<span className="text-red-500">*</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <React.Fragment key={row.id}>
                                                <tr>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="text"
                                                            placeholder="Item Name"
                                                            className="w-full p-2 border rounded-s"
                                                        />
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

                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <div className="flex items-center">
                                                            <select className="w-full p-2 border">
                                                                <option value="">Nothing Selected</option>
                                                                <option value="">GST:10%</option>
                                                                <option value="item1">CGST:18%</option>
                                                                <option value="item2">VAT:10%</option>
                                                                <option value="item1">IGST:10%</option>
                                                                <option value="item1">UTGST:10%</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <span>0</span>
                                                        {/* <input
                                                    type="text"
                                                    placeholder="Tax (%)"
                                                    className="w-full p-2 border rounded"
                                                /> */}
                                                    </td>
                                                    {/* <td className="px-4 py-2 border-b text-center">0</td> */}
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
                                                    <td colSpan={4} className="px-4 py-2 border-b">
                                                        <textarea
                                                            rows={2}
                                                            placeholder="Description"
                                                            className="w-[70%] p-2 border"
                                                        ></textarea>
                                                    </td>
                                                    
                                                    <td className='hidden'>
                                                        <span>0</span>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="form-buttons text-left mt-2">
                                <Button className='border-0 text-blue-500' onClick={handleAddRow}>
                                    <PlusOutlined />  Add Items
                                </Button>
                            </div>

                            {/* Summary Section */}
                            <div className="mt-3 flex flex-col justify-end items-end space-y-2 border-t-2">
                                <table className='w-full lg:w-[50%] p-2'>
                                    {/* Sub Total */}
                                    <tr className="flex justify-between px-2  py-2 border-b-2 border-x-2">
                                        <td className="font-medium ">Sub Total</td>
                                        <td className="font-medium px-4 py-2">0.00</td>
                                    </tr>

                                    {/* Discount */}
                                    <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-b-2">
                                        <td className="font-medium">Discount</td>
                                        <td className='flex items-center space-x-2'>
                                            <input
                                                type="number"
                                                value={discountValue}
                                                onChange={(e) => setDiscountValue(e.target.value)}
                                                className="w-16 p-1 border focus:outline-none focus:ring"
                                            />
                                            <select
                                                value={discountType}
                                                onChange={(e) => setDiscountType(e.target.value)}
                                                className="p-1 border focus:outline-none focus:ring"
                                            >
                                                <option value="%">%</option>
                                                <option value="$">Amount</option>
                                            </select>
                                        </td>
                                        <td className="font-medium px-4 py-2">0.00</td>
                                    </tr>

                                    {/* Tax */}
                                    <tr className="flex justify-between px-2 py-2 border-b border-x-2">
                                        <td className="font-medium">Tax</td>
                                        <td className="font-medium">0.00</td>
                                    </tr>

                                    {/* Total */}
                                    <tr className="flex justify-between px-2 py-4 border-b bg-gray-100">
                                        <td className="font-bold text-lg">Total</td>
                                        <td className="font-bold text-lg">0.00</td>
                                    </tr>

                                    {/* Terms and Conditions */}
                                </table>
                            </div>
                            <div className="pt-4 text-right">
                                <h3 className="font-medium">Terms and Conditions</h3>
                                <p className="text-sm text-gray-600">Thank you for your business.</p>
                            </div>
                            <div className='mt-4'>
                                <span className='block mb-2'>Add File</span>
                                <Col span={24} >
                                    <Upload
                                        action="http://localhost:5500/api/users/upload-cv"
                                        listType="picture"
                                        accept=".pdf"
                                        maxCount={1}
                                        showUploadList={{ showRemoveIcon: true }}
                                        className='border-2 flex justify-center items-center p-10'

                                    >
                                        <span className='text-xl'>Choose File</span>
                                        {/* <CloudUploadOutlined className='text-4xl' /> */}
                                    </Upload>
                                </Col>
                            </div>
                        </div>



                    </Card>

                    <div className="form-buttons text-right">
                        <Button type="default" className="mr-2" onClick={() => navigate('/app/dashboards/project/list')}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Update</Button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default EditInvoice;

