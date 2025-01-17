import React, { useState, useEffect } from 'react';
import { Card, Form, Menu, Row, Col, Tag, Input, message, Button, Upload, Select, DatePicker, Modal } from 'antd';
import { DeleteOutlined, CloudUploadOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, FilterOutlined, EditOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { getallcurrencies } from '../../../setting/currencies/currenciesreducer/currenciesSlice';
import { useSelector, useDispatch } from 'react-redux';
import { updatequotation, getquotationsById, getallquotations } from './estimatesReducer/EstimatesSlice';
import dayjs from 'dayjs';
import * as Yup from 'yup';

const { Option } = Select;

const EditEstimates = ({ onClose, idd, setInitialValues }) => {

    // const {id} = useParams();

    const [discountType, setDiscountType] = useState("%");
    const [loading, setLoading] = useState(false);
    const [discountValue, setDiscountValue] = useState(0);
    const [discountRate, setDiscountRate] = useState(10);
    const dispatch = useDispatch();
    const allempdata = useSelector((state) => state.salesquotations);
    const quotationData = allempdata.salesquotations.data;
    const [form] = Form.useForm();
    const [totals, setTotals] = useState({
        subtotal: 0,
        discount: 0,
        totalTax: 0,
        finalTotal: 0,
    });

    const [tableData, setTableData] = useState([
        {
            id: Date.now(),
            item: "",
            quantity: 1,
            price: "",
            tax: 0,
            amount: "0",
            description: "",
        }
    ]);

    useEffect(() => {
        // Fetch expense data if not already available
        if (!quotationData.length) {
            dispatch(getallquotations());
        }
    }, [dispatch]);

    useEffect(() => {
        if (quotationData.length > 0 && idd) {
            const quodata = quotationData.find((item) => item.id === idd);

            if (quodata) {
                const itemsObject = tableData.reduce((acc, item, index) => {
                    acc[`item_${index + 1}`] = {
                        description: item.item,
                        quantity: parseFloat(item.quantity) || 0,
                        price: parseFloat(item.price) || 0,
                        tax: parseFloat(item.tax) || 0,
                        amount: parseFloat(item.amount) || 0,
                    };
                    return acc;
                }, {});

                setInitialValues({
                    id: idd,
                    customer: quodata.customer || "",
                    category: quodata.category || "",
                    issueDate: quodata.issueDate ? dayjs(quodata.issueDate).format('YYYY-MM-DD') : null,
                    items: itemsObject,
                });
            } else {
                message.error("Estimate not found!");
                navigate("/app/dashboards/sales/estimates");
            }
        }
    }, [idd]);

    const handleFinish = async (values) => {
            // Ensure valid_till is properly formatted
            const updatedValues = {
                ...values,
                issueDate: values.issueDate
                    ? dayjs(values.issueDate).format("YYYY-MM-DD")
                    : null,
            };
        
            console.log("Form Values:", values);
            // console.log("Updated Values:", updatedValues);
        
            try {
                setLoading(true);
                await dispatch(updatequotation({ id: idd, values: updatedValues })).unwrap();
                message.success("Estimate updated successfully!");
                dispatch(getallquotations());
                onClose();
            } catch (error) {
                message.error("Failed to update estimate: " + (error.message || "Unknown error"));
            } finally {
                setLoading(false);
            }
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

    // Delete row
    const handleDeleteRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        } else {
            message.warning('At least one item is required');
        }
    };

    const navigate = useNavigate();

    // Calculate discount amount
    const calculateDiscount = () => {
        const subTotal = calculateSubTotal();
        if (discountType === '%') {
            return subTotal * (parseFloat(discountValue) || 0) / 100;
        }
        return parseFloat(discountValue) || 0;
    };

    // Calculate total tax
    const calculateTotalTax = () => {
        const subTotal = calculateSubTotal();
        const discount = calculateDiscount();
        const taxableAmount = form.getFieldValue('calctax') === 'before'
            ? subTotal
            : (subTotal - discount);

        return tableData.reduce((sum, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const price = parseFloat(row.price) || 0;
            const tax = parseFloat(row.tax) || 0;
            const rowAmount = quantity * price;
            return sum + (rowAmount * (tax / 100));
        }, 0);
    };

    // Calculate subtotal (sum of all row amounts before discount)
    const calculateSubTotal = () => {
        return rows.reduce((sum, row) => {
            const quantity = parseFloat(row.quantity || 0);
            const price = parseFloat(row.price || 0);
            return sum + (quantity * price);
        }, 0);
    };


    const calculateTotal = (data, discountRate) => {
        let subtotal = 0;
        let totalTax = 0;

        data.forEach((row) => {
            const amount = row.quantity * row.price;
            const taxAmount = (amount * row.tax) / 100;

            row.amount = amount; // Update the row's amount
            subtotal += amount;
            totalTax += taxAmount;
        });

        const discount = (subtotal * discountRate) / 100;
        const finalTotal = subtotal - discount + totalTax;

        setTotals({ subtotal, discount, totalTax, finalTotal });
    };

    const handleTableDataChange = (id, field, value) => {
        const updatedData = tableData.map((row) =>
            row.id === id ? { ...row, [field]: field === 'quantity' || field === 'price' || field === 'tax' ? parseFloat(value) || 0 : value } : row
        );

        setTableData(updatedData);
        calculateTotal(updatedData, discountRate); // Recalculate totals
    };

    return (
        <>
            <div>
                <div className=' ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
                    <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        initialValues={{
                            loginEnabled: true,
                        }}
                    >
                        {/* <Card className="border-0 mt-2"> */}
                        <div className="">
                            <div className=" p-2">

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="customer"
                                            label="Customer Name"
                                            rules={[{ required: true, message: "Please enter the customer name" }]}
                                        >
                                            <Input placeholder="Enter customer name" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="issueDate"
                                            label="Issue Date"
                                            rules={[{ required: true, message: "Please select the date" }]}
                                        >
                                            <DatePicker className="w-full" format="DD-MM-YYYY" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="category"
                                            label="Category"
                                            rules={[{ required: true, message: "Please select a Category" }]}
                                        >
                                            <Select placeholder="Select Category">
                                                <Option value="abc">abc</Option>
                                                <Option value="xyz">xyz</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                </Row>

                            </div>
                        </div>
                        <div>
                            <div className="overflow-x-auto">

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
                                        {tableData.map((row) => (
                                            <React.Fragment key={row.id}>
                                                <tr>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="text"
                                                            value={row.item}
                                                            onChange={(e) => handleTableDataChange(row.id, 'item', e.target.value)}
                                                            placeholder="Item Name"
                                                            className="w-full p-2 border rounded-s"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="number"
                                                            value={row.quantity}
                                                            onChange={(e) => handleTableDataChange(row.id, 'quantity', e.target.value)}
                                                            placeholder="Qty"
                                                            className="w-full p-2 border rounded"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="number"
                                                            value={row.price}
                                                            onChange={(e) => handleTableDataChange(row.id, 'price', e.target.value)}
                                                            placeholder="Price"
                                                            className="w-full p-2 border rounded-s"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <select
                                                            value={row.tax}
                                                            onChange={(e) => handleTableDataChange(row.id, 'tax', e.target.value)}
                                                            className="w-full p-2 border"
                                                        >
                                                            <option value="0">Nothing Selected</option>
                                                            <option value="10">GST:10%</option>
                                                            <option value="18">CGST:18%</option>
                                                            <option value="10">VAT:10%</option>
                                                            <option value="10">IGST:10%</option>
                                                            <option value="10">UTGST:10%</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <span>{row.amount}</span>
                                                    </td>
                                                    <td className="px-2 py-1 border-b text-center">
                                                        <Button
                                                            danger
                                                            onClick={() => handleDeleteRow(row.id)}
                                                        >
                                                            <DeleteOutlined />
                                                        </Button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={6} className="px-4 py-2 border-b">
                                                        <textarea
                                                            rows={2}
                                                            value={row.description}
                                                            onChange={(e) => handleTableDataChange(row.id, 'description', e.target.value)}
                                                            placeholder="Description"
                                                            className="w-[70%] p-2 border"
                                                        />
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
                            <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
                                <table className='w-full lg:w-[50%] p-2'>
                                    {/* Sub Total */}
                                    <tr className="flex justify-between px-2 py-2 border-x-2">
                                        <td className="font-medium">Sub Total</td>
                                        <td className="font-medium px-4 py-2">
                                            ₹{totals.subtotal.toFixed(2)}
                                        </td>
                                    </tr>

                                    {/* Discount */}
                                    <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
                                        <td className="font-medium">Discount</td>
                                        <td className='flex items-center space-x-2'>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Discount Rate (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={discountRate}
                                                    onChange={(e) => {
                                                        setDiscountRate(parseFloat(e.target.value) || 0);
                                                        calculateTotal(tableData, parseFloat(e.target.value) || 0); // Recalculate with new discount rate
                                                    }}
                                                    className="mt-1 block w-full p-2 border rounded"
                                                />
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Tax */}
                                    <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                                        <td className="font-medium">Total Tax</td>
                                        <td className="font-medium px-4 py-2">
                                            ₹{totals.totalTax.toFixed(2)}
                                        </td>
                                    </tr>

                                    {/* Total */}
                                    <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
                                        <td className="font-bold text-lg">Total Amount</td>
                                        <td className="font-bold text-lg px-4">
                                            ₹{totals.finalTotal.toFixed(2)}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>

                        <Form.Item className='mt-4'>
                            <Row justify="end" gutter={16}>
                                <Col>
                                    <Button onClick={() => navigate("/app/dashboards/sales/estimates")}>Cancel</Button>
                                </Col>
                                <Col>
                                    <Button type="primary" htmlType="submit">
                                        Update
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default EditEstimates;













// import React, { useState } from 'react';
// import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal, Select, DatePicker } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
// // import { Card, Table,  Badge, Menu, Tag,Modal } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';
// import OrderListData from 'assets/data/order-list.data.json';
// import Flex from 'components/shared-components/Flex'
// import utils from 'utils';
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import userData from 'assets/data/user-list.data.json';
// import dayjs from 'dayjs';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// const { Option } = Select;

// const EditEstimates = () => {
//     const [users, setUsers] = useState(userData);
//     // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//     // const [list, setList] = useState(OrderListData);

//     const initialValues = {
//         customer: '',
//         date: null,
//         category: '',
//         proposalnumber: '',
//         };
    
//         const validationSchema = Yup.object({
//             customer: Yup.string().required('Please select customer.'),
//             date: Yup.date().nullable().required('Date is required.'),
//             category: Yup.string().required('Please select category.'),
//             proposalnumber: Yup.string().required('Please enter a proposal number.'),
//         });

//     const [rows, setRows] = useState([
//         {
//             id: Date.now(),
//             item: "",
//             quantity: "",
//             price: "",
//             discount: "",
//             tax: "",
//             amount: "0",
//             description: "",

//         },
//     ]);

//     // Function to handle adding a new row
//     const handleAddRow = () => {
//         setRows([
//             ...rows,
//             {
//                 id: Date.now(),
//                 item: "",
//                 quantity: "",
//                 price: "",
//                 discount: "",
//                 tax: "",
//                 amount: "0",
//                 description: "",
//             },
//         ]);
//     };

//     // Function to handle deleting a row
//     const handleDeleteRow = (id) => {
//         const updatedRows = rows.filter((row) => row.id !== id);
//         setRows(updatedRows);
//         alert("Are you sure you want to delete this element?")
//         // calculateTotals(updatedRows);
//     };
//     const navigate = useNavigate();

//     const onSubmit = (values) => {
//         console.log('Submitted values:', values);
//         message.success('Job added successfully!');
//         navigate('/apps/sales/estimates/');
//     };

//     const tableColumns = [
//         {
//             title: 'Items',
//             dataIndex: 'items',
//         },
//         {
//             title: 'Quantity',
//             dataIndex: 'quantity',
//         },
//         {
//             title: 'Price',
//             dataIndex: 'price',
//         },
//         {
//             title: 'Discount',
//             dataIndex: 'discount',
//         },
//         {
//             title: 'Tax(%)',
//             dataIndex: 'tax',
//         },
//         {
//             title: 'Amount',
//             dataIndex: 'amount',
//         },
//     ];

//     // Search functionality
//     // const onSearch = (e) => {
//     //     const value = e.currentTarget.value;
//     //     const searchArray = value ? list : OrderListData;
//     //     const data = utils.wildCardSearch(searchArray, value);
//     //     setList(data);
//     //     setSelectedRowKeys([]);
//     // };

//     return (
//         <>
//         <div>
//             <div className='bg-gray-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4' >
            
//                 {/* <h4 className='ms-4 font-medium'>Update Estimate</h4> */}
//                 <h2 className="mb-2 border-b pb-[30px] font-medium"></h2>

//             <Card className="border-0 mt-4">
//                             <div className="">
//                                 <div className=" p-2">
//                                 <Formik
//                             initialValues={initialValues}
//                             validationSchema={validationSchema}
//                             onSubmit={onSubmit}
//                         >
//                             {({ values, setFieldValue, handleSubmit,setFieldTouched }) => (
//                                 <Form className="formik-form" onSubmit={handleSubmit}>
//                                     <Row gutter={16}>
//                                     <Col span={8} className='mt-2'>
//                                             <div className="form-item">
//                                                 <label className='font-semibold'>Customer</label>
//                                                 <Field name="customer">
//                                                     {({ field }) => (
//                                                         <Select
//                                                             {...field}
//                                                             className="w-full"
//                                                             placeholder="Select Customer"
//                                                             onChange={(value) => setFieldValue('customer', value)}
//                                                             value={values.customer}
//                                                             onBlur={() => setFieldTouched("customer", true)}
//                                                         >
//                                                             <Option value="xyz">XYZ</Option>
//                                                             <Option value="abc">ABC</Option>
//                                                         </Select>
//                                                     )}
//                                                 </Field>
//                                                 <ErrorMessage name="customer" component="div" className="error-message text-red-500 my-1" />
//                                             </div>
//                                         </Col>
            
//                                         <Col span={8} className='mt-2'>
//                                             <div className="form-item">
//                                                 <label className='font-semibold'>Issue Date</label>
//                                                 <DatePicker
//                                                     className="w-full"
//                                                     format="DD-MM-YYYY"
//                                                     value={values.date}
//                                                     onChange={(date) => setFieldValue('date', date)}
//                                                     onBlur={() => setFieldTouched("date", true)}
//                                                 />
//                                                 <ErrorMessage name="date" component="div" className="error-message text-red-500 my-1" />
//                                             </div>
//                                         </Col>
            
//                                         <Col span={8} className='mt-2'>
//                                             <div className="form-item">
//                                                 <label className='font-semibold'>Category</label>
//                                                 <Field name="category">
//                                                     {({ field }) => (
//                                                         <Select
//                                                             {...field}
//                                                             className="w-full"
//                                                             placeholder="Select Category"
//                                                             onChange={(value) => setFieldValue('category', value)}
//                                                             value={values.category}
//                                                             onBlur={() => setFieldTouched("category", true)}
//                                                         >
//                                                             <Option value="xyz">XYZ</Option>
//                                                             <Option value="abc">ABC</Option>
//                                                         </Select>
//                                                     )}
//                                                 </Field>
//                                                 <ErrorMessage name="category" component="div" className="error-message text-red-500 my-1" />
//                                             </div>
//                                         </Col>
            
//                                         <Col span={8} className='mt-2'>
//                                             <div className="form-item">
//                                                 <label className='font-semibold'>Proposal Number</label>
//                                                 <Field name="proposalnumber" as={Input} placeholder="Enter Proposal Number" />
//                                                 <ErrorMessage name="proposalnumber" component="div" className="error-message text-red-500 my-1" />
//                                             </div>
//                                         </Col>
            
                                    
            
//                                     </Row>
            
//                                     <div className="form-buttons text-right mt-4">
//                                         <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/expenses')}>Cancel</Button>
//                                         <Button type="primary" htmlType="submit">Update</Button>
//                                     </div>
            
//                                     {/* <Modal
//                                         title="Upload Receipt"
//                                         visible={uploadModalVisible}
//                                         onCancel={() => setUploadModalVisible(false)}
//                                         footer={null}
//                                     >
//                                         <Upload beforeUpload={() => false}>
//                                             <Button icon={<UploadOutlined />}>Click to Upload</Button>
//                                         </Upload>
//                                     </Modal> */}
//                                 </Form>
//                             )}
//                         </Formik>
//                                 </div>
//                             </div>
//                         </Card>
//             <Col span={24}>
//                 <h4 className='ms-4 font-bold mb-2 text-lg'>Product & Services</h4>
//             </Col>

//             <Card>
//                 <div>
//                     <div className="overflow-x-auto">
//                         <div className="form-buttons text-right mb-2">
//                             <Button type="primary" onClick={handleAddRow}>
//                                 <PlusOutlined />  Add Items
//                             </Button>
//                         </div>
//                         <table className="w-full border border-gray-200 bg-white">
//                             <thead className="bg-gray-100">
//                                 <tr>
//                                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                         ITEMS<span className="text-red-500">*</span>
//                                     </th>
//                                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                         QUANTITY<span className="text-red-500">*</span>
//                                     </th>
//                                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                         PRICE<span className="text-red-500">*</span>
//                                     </th>
//                                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                         DISCOUNT<span className="text-red-500">*</span>
//                                     </th>
//                                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                         TAX (%)
//                                     </th>
//                                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                         AMOUNT
//                                         <br />
//                                         <span className="text-red-500 text-xs">AFTER TAX & DISCOUNT</span>
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {rows.map((row, index) => (
//                                     <React.Fragment key={row.id}>
//                                         <tr>
//                                             <td className="px-4 py-2 border-b">
//                                                 <select className="w-full p-2 border rounded">
//                                                     <option value="">--</option>
//                                                     <option value="item1">Item 1</option>
//                                                     <option value="item2">Item 2</option>
//                                                 </select>
//                                             </td>
//                                             <td className="px-4 py-2 border-b">
//                                                 <input
//                                                     type="number"
//                                                     placeholder="Qty"
//                                                     className="w-full p-2 border rounded"
//                                                 />
//                                             </td>
//                                             <td className="px-4 py-2 border-b">
//                                                 <div className="flex items-center">
//                                                     <input
//                                                         type="number"
//                                                         placeholder="Price"
//                                                         className="w-full p-2 border rounded-s"
//                                                     />
//                                                     <span className=" text-gray-500 border border-s rounded-e px-3 py-2">
//                                                         $
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-2 border-b">
//                                                 <div className="flex items-center">
//                                                     <input
//                                                         type="number"
//                                                         placeholder="Discount"
//                                                         className="w-full p-2 border rounded-s"
//                                                     />
//                                                     <span className=" text-gray-500 border border-s rounded-e px-3 py-2">
//                                                         $
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-2 flex border-b">
//                                                 <Button type="primary" className='text-xs rounded-sm p-1'>CGST (10%)</Button>
//                                                 <Button type="primary" className='text-xs rounded-sm p-1'>SGST (5%)</Button>
//                                             </td>
//                                             <td className="px-4 py-2 border-b text-center">0</td>
//                                             <td className="px-2 py-1 border-b text-center">
//                                                 <Button
//                                                     danger
//                                                     onClick={() => handleDeleteRow(row.id)}
//                                                 >
//                                                     <DeleteOutlined />
//                                                 </Button>
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan={6} className="px-4 py-2 border-b">
//                                                 <textarea
//                                                     rows={2}
//                                                     placeholder="Description"
//                                                     className="w-[70%] p-2 border rounded"
//                                                 ></textarea>
//                                             </td>
//                                         </tr>
//                                     </React.Fragment>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Summary Section */}
//                     <div className="mt-3 flex flex-col items-end space-y-2">
//                         <div className="flex justify-between w-full sm:w-1/2 border-b pb-2">
//                             <span className="text-gray-700">Sub Total ($):</span>
//                             <span className="text-gray-700">NaN</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/2 border-b pb-2">
//                             <span className="text-gray-700">Discount ($):</span>
//                             <span className="text-gray-700">NaN</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/2 border-b pb-2">
//                             <span className="text-gray-700">Tax ($):</span>
//                             <span className="text-gray-700">0.00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/2">
//                             <span className="font-semibold text-gray-700">Total Amount ($):</span>
//                             <span className="font-semibold text-gray-700">0.00</span>
//                         </div>
//                     </div>
//                 </div>
//             </Card>


//             <div className="form-buttons text-right">
//                 <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/estimates')}>Cancel</Button>
//                 <Button type="primary" htmlType="submit">Update</Button>
//             </div>
//             </div>
//         </div>
//         </>
//     );
// };

// export default EditEstimates;



