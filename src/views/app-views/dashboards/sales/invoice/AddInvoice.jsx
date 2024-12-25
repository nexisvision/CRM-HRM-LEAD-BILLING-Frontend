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
        navigate('/apps/sales/estimates/');
    };

    const initialValues = {
        customer: '',
        issuedate: null,
        duedate: null,
        invoicenub: '',
        category: '',
        refnumber: '',
    };

    const validationSchema = Yup.object({
        customer: Yup.string().required('Please select customer.'),
        issuedate: Yup.date().nullable().required('Date is required.'),
        duedate: Yup.date().nullable().required('Date is required.'),
        invoicenub: Yup.string().required('Please enter invoicenub.'),
        category: Yup.string().required('Please select category.'),
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
                                                <Col span={8} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Customer</label>
                                                        <Field name="customer">
                                                            {({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    className="w-full"
                                                                    placeholder="Select Customer"
                                                                    onChange={(value) => setFieldValue('customer', value)}
                                                                    value={values.customer}
                                                                    onBlur={() => setFieldTouched("customer", true)}
                                                                >
                                                                    <Option value="xyz">XYZ</Option>
                                                                    <Option value="abc">ABC</Option>
                                                                </Select>
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name="customer" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                                <Col span={8} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Issue Date</label>
                                                        <DatePicker
                                                            className="w-full"
                                                            format="DD-MM-YYYY"
                                                            value={values.issuedate}
                                                            onChange={(issuedate) => setFieldValue('issuedate', issuedate)}
                                                            onBlur={() => setFieldTouched("issuedate", true)}
                                                        />
                                                        <ErrorMessage name="issuedate" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                                <Col span={8} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Due Date</label>
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

                                                <Col span={8} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Invoice Number</label>
                                                        <Field name="invoicenub" as={Input} placeholder="Enter Invoice Number" />
                                                        <ErrorMessage name="invoicenub" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                                <Col span={8} className='mt-2'>
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
                                                </Col>

                                                <Col span={8} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Ref Number</label>
                                                        <Field name="refnumber" as={Input} placeholder="Enter Ref Number" />
                                                        <ErrorMessage name="refnumber" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
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

                    {/* <Card>
                <div className="">
                    <div className="overflow-x-auto">
                        <div className="form-buttons text-right mb-2">
                            <Button type="primary" htmlType="submit">Add Items</Button>
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
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                        AMOUNT
                                        <br />
                                        <span className="text-red-500">AFTER TAX & DISCOUNT</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
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
                                            type="number"
                                            placeholder="Qty"
                                            className="w-full p-2 border rounded"
                                        />
                                    </td>

                                 
                                    <td className="px-4 py-2 border-b">
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                className="w-full p-2 border rounded-s"
                                            />
                                            <span className="text-gray-500 border border-s rounded-e p-2">$</span>
                                        </div>
                                    </td>

                                    
                                    <td className="px-4 py-2 border-b">
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                placeholder="Discount"
                                                className="w-full p-2 border rounded-s"
                                            />
                                            <span className=" text-gray-500 border rounded-e p-2">$</span>
                                        </div>
                                    </td>

                                  
                                    <td className="px-4 py-2 border-b">
                                        <input
                                            type="number"
                                            placeholder="Tax (%)"
                                            className="w-full p-2 border rounded"
                                        />
                                    </td>

                                    <td className="px-4 py-2 border-b text-center">0</td>
                                </tr>

                               
                                <tr>
                                    <td colSpan={6} className="px-4 py-2 border-b">
                                        <textarea
                                            rows={2}
                                            placeholder="Description"
                                            className="w-full p-2 border rounded"
                                        ></textarea>
                                    </td>
                                </tr>
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


// import React, { useState } from 'react';
// import { Formik, Form as FormikForm, Field } from 'formik';
// import { Input, Select, DatePicker, Button, Switch, Typography, Space, Divider } from 'antd';
// import * as Yup from 'yup';

// const { Option } = Select;

// // Validation Schema using Yup
// const validationSchema = Yup.object().shape({
//   client: Yup.string().required('Please select a client'),
//   invoiceDate: Yup.date().required('Please select an invoice date').nullable(),
//   dueDate: Yup.date()
//     .required('Please select a due date')
//     .min(Yup.ref('invoiceDate'), 'Due date must be after the invoice date')
//     .nullable(),
//   category: Yup.string().required('Please select a category'),
//   additionalInfoDetails: Yup.string().when('additionalInfo', {
//     is: true,
//     then: Yup.string().required('Additional information is required'),
//   }),
// });

// const AddInvoice = () => {
//   const [additionalInfo, setAdditionalInfo] = useState(false);

//   return (
//     <div style={{ padding: '10px' }}>
//       <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

//       <Formik
//         initialValues={{
//           client: '',
//           project: '',
//           invoiceDate: null,
//           dueDate: null,
//           category: 'Default',
//           additionalInfo: false,
//           additionalInfoDetails: '',
//         }}
//         validationSchema={validationSchema}
//         onSubmit={(values) => {
//           console.log('Form Data:', values);
//         }}
//       >
//         {({ errors, touched, setFieldValue, values }) => (
//           <FormikForm>
//             {/* Client */}
//             <div style={{ marginBottom: '10px' }}>
//               <label>Client*</label>
//               <Field
//                 as={Select}
//                 name="client"
//                 placeholder="Select Client"
//                 onChange={(value) => setFieldValue('client', value)}
//                 style={{ width: '100%' }}
//               >
//                 <Option value="client1">Client 1</Option>
//                 <Option value="client2">Client 2</Option>
//               </Field>
//               {errors.client && touched.client ? (
//                 <div style={{ color: 'red', fontSize: '12px' }}>{errors.client}</div>
//               ) : null}
//             </div>

//             {/* Project */}
//             <div style={{ marginBottom: '10px' }}>
//               <label>Project</label>
//               <Field
//                 as={Select}
//                 name="project"
//                 placeholder="Select Project"
//                 disabled
//                 style={{ width: '100%' }}
//               >
//                 <Option value="project1">Project 1</Option>
//               </Field>
//             </div>

//             {/* New/Existing Client */}
//             <Space style={{ marginBottom: '10px' }}>
//               <Button type="link">New Client</Button>
//               <Divider type="vertical" />
//               <Button type="link">Existing Client</Button>
//             </Space>

//             {/* Invoice Date */}
//             <div style={{ marginBottom: '10px' }}>
//               <label>Invoice Date*</label>
//               <DatePicker
//                 name="invoiceDate"
//                 onChange={(date) => setFieldValue('invoiceDate', date)}
//                 style={{ width: '100%' }}
//                 format="DD-MM-YYYY"
//               />
//               {errors.invoiceDate && touched.invoiceDate ? (
//                 <div style={{ color: 'red', fontSize: '12px' }}>{errors.invoiceDate}</div>
//               ) : null}
//             </div>

//             {/* Due Date */}
//             <div style={{ marginBottom: '10px' }}>
//               <label>Due Date*</label>
//               <DatePicker
//                 name="dueDate"
//                 onChange={(date) => setFieldValue('dueDate', date)}
//                 style={{ width: '100%' }}
//                 format="DD-MM-YYYY"
//               />
//               {errors.dueDate && touched.dueDate ? (
//                 <div style={{ color: 'red', fontSize: '12px' }}>{errors.dueDate}</div>
//               ) : null}
//             </div>

//             {/* Category */}
//             <div style={{ marginBottom: '10px' }}>
//               <label>Category*</label>
//               <Field
//                 as={Select}
//                 name="category"
//                 onChange={(value) => setFieldValue('category', value)}
//                 style={{ width: '100%' }}
//               >
//                 <Option value="Default">Default</Option>
//                 <Option value="Category1">Category 1</Option>
//               </Field>
//               {errors.category && touched.category ? (
//                 <div style={{ color: 'red', fontSize: '12px' }}>{errors.category}</div>
//               ) : null}
//             </div>

//             {/* Additional Information */}
//             <div style={{ marginBottom: '10px' }}>
//               <label>Additional Information</label>
//               <Switch
//                 checked={additionalInfo}
//                 onChange={(checked) => {
//                   setAdditionalInfo(checked);
//                   setFieldValue('additionalInfo', checked);
//                 }}
//               />
//             </div>

//             {additionalInfo && (
//               <div style={{ marginBottom: '10px' }}>
//                 <Field
//                   as={Input.TextArea}
//                   name="additionalInfoDetails"
//                   placeholder="Enter additional information"
//                   rows={4}
//                 />
//                 {errors.additionalInfoDetails && touched.additionalInfoDetails ? (
//                   <div style={{ color: 'red', fontSize: '12px' }}>{errors.additionalInfoDetails}</div>
//                 ) : null}
//               </div>
//             )}

//             {/* Submit Buttons */}
//             <div style={{ marginTop: '20px' }}>
//               <Space>
//                 <Button type="default" htmlType="button">
//                   Close
//                 </Button>
//                 <Button type="primary" htmlType="submit">
//                   Submit
//                 </Button>
//               </Space>
//             </div>
//           </FormikForm>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default AddInvoice;













// // import React, { useState } from 'react';
// // import { Form, Input, Select, DatePicker, Button, Switch, Typography, Space, Divider } from 'antd';

// // const { Option } = Select;
// // const { Text } = Typography;

// // const AddInvoice = () => {
// //   const [additionalInfo, setAdditionalInfo] = useState(false);

// //   const onFinish = (values) => {
// //     console.log('Form Data:', values);
// //   };

// //   return (
// //     <div style={{ padding: '10px' }}>
// //       {/* <Typography.Title level={4}>Create A New Invoice</Typography.Title> */}
// //       <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

// //       <Form
// //         layout="vertical"
// //         onFinish={onFinish}
// //         initialValues={{ category: 'Default' }}
// //       >
// //         <Form.Item
// //           label="Client*"
// //           name="client"
// //           rules={[{ required: true, message: 'Please select a client' }]}
// //         >
// //           <Select placeholder="Select Client">
// //             <Option value="client1">Client 1</Option>
// //             <Option value="client2">Client 2</Option>
// //           </Select>
// //         </Form.Item>

// //         <Form.Item
// //           label="Project"
// //           name="project"
// //         >
// //           <Select placeholder="Select Project" disabled>
// //             <Option value="project1">Project 1</Option>
// //           </Select>
// //         </Form.Item>

// //         <Space style={{ marginBottom: '10px' }}>
// //           <Button type="link">New Client</Button>
// //           <Divider type="vertical" />
// //           <Button type="link">Existing Client</Button>
// //         </Space>

// //         <Form.Item
// //           label="Invoice Date*"
// //           name="invoiceDate"
// //           rules={[{ required: true, message: 'Please select an invoice date' }]}
// //         >
// //           <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
// //         </Form.Item>

// //         <Form.Item
// //           label="Due Date*"
// //           name="dueDate"
// //           rules={[{ required: true, message: 'Please select a due date' }]}
// //         >
// //           <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
// //         </Form.Item>

// //         <Form.Item
// //           label="Category*"
// //           name="category"
// //           rules={[{ required: true, message: 'Please select a category' }]}
// //         >
// //           <Select>
// //             <Option value="Default">Default</Option>
// //             <Option value="Category1">Category 1</Option>
// //           </Select>
// //         </Form.Item>

// //         <Form.Item label="Additional Information">
// //           <Switch onChange={setAdditionalInfo} />
// //         </Form.Item>

// //         {additionalInfo && (
// //           <Form.Item name="additionalInfoDetails">
// //             <Input.TextArea placeholder="Enter additional information" rows={4} />
// //           </Form.Item>
// //         )}

// //         {/* <Text type="warning">
// //           🔄 Recurring invoice options are available after an invoice has been created
// //         </Text> */}

// //         <Form.Item style={{ marginTop: '20px' }}>
// //           <Space>
// //             <Button type="default" htmlType="button">
// //               Close
// //             </Button>
// //             <Button type="primary" htmlType="submit">
// //               Submit
// //             </Button>
// //           </Space>
// //         </Form.Item>
// //       </Form>
// //     </div>
// //   );
// // };

// // export default AddInvoice;
















// // import React, { useState } from 'react';
// // import { Form, Input, Select, DatePicker, Button, InputNumber, Row, Col, Table, Space } from 'antd';
// // import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// // const { Option } = Select;

// // const AddInvoice = () => {
// //   const [form] = Form.useForm();
// //   const [items, setItems] = useState([]);

// //   const columns = [
// //     {
// //       title: 'ITEMS',
// //       dataIndex: 'item',
// //       render: (_, record) => (
// //         <Select
// //           placeholder="Select Item"
// //           style={{ width: '100%' }}
// //           onChange={(value) => handleItemChange(record.key, 'item', value)}
// //         >
// //           <Option value="Stool">Stool</Option>
// //           <Option value="Jackets">Jackets</Option>
// //           <Option value="Sweater">Sweater</Option>
// //         </Select>
// //       ),
// //     },
// //     {
// //       title: 'QUANTITY',
// //       dataIndex: 'quantity',
// //       render: (_, record) => (
// //         <InputNumber
// //           min={1}
// //           defaultValue={1}
// //           onChange={(value) => handleItemChange(record.key, 'quantity', value)}
// //         />
// //       ),
// //     },
// //     {
// //       title: 'PRICE',
// //       dataIndex: 'price',
// //       render: (_, record) => (
// //         <InputNumber
// //           min={0}
// //           defaultValue={0}
// //           onChange={(value) => handleItemChange(record.key, 'price', value)}
// //         />
// //       ),
// //     },
// //     {
// //       title: 'DISCOUNT (%)',
// //       dataIndex: 'discount',
// //       render: (_, record) => (
// //         <InputNumber
// //           min={0}
// //           max={100}
// //           defaultValue={0}
// //           onChange={(value) => handleItemChange(record.key, 'discount', value)}
// //         />
// //       ),
// //     },
// //     {
// //       title: 'TAX (%)',
// //       dataIndex: 'tax',
// //       render: (_, record) => (
// //         <InputNumber
// //           min={0}
// //           max={100}
// //           defaultValue={0}
// //           onChange={(value) => handleItemChange(record.key, 'tax', value)}
// //         />
// //       ),
// //     },
// //     {
// //       title: 'AMOUNT',
// //       dataIndex: 'amount',
// //       render: (_, record) => (
// //         <Input
// //           readOnly
// //           value={calculateAmount(record.price, record.quantity, record.discount, record.tax)}
// //         />
// //       ),
// //     },
// //     {
// //       title: 'ACTION',
// //       dataIndex: 'action',
// //       render: (_, record) => (
// //         <Button
// //           type="link"
// //           danger
// //           icon={<DeleteOutlined />}
// //           onClick={() => handleRemoveItem(record.key)}
// //         />
// //       ),
// //     },
// //   ];

// //   const handleItemChange = (key, field, value) => {
// //     setItems(
// //       items.map((item) =>
// //         item.key === key ? { ...item, [field]: value } : item
// //       )
// //     );
// //   };

// //   const handleAddItem = () => {
// //     const newItem = { key: items.length + 1, item: '', quantity: 1, price: 0, discount: 0, tax: 0 };
// //     setItems([...items, newItem]);
// //   };

// //   const handleRemoveItem = (key) => {
// //     setItems(items.filter((item) => item.key !== key));
// //   };

// //   const calculateAmount = (price = 0, quantity = 1, discount = 0, tax = 0) => {
// //     const discountedPrice = price - (price * discount) / 100;
// //     const taxedPrice = discountedPrice + (discountedPrice * tax) / 100;
// //     return (taxedPrice * quantity).toFixed(2);
// //   };

// //   const calculateTotal = (type) => {
// //     return items.reduce((acc, item) => {
// //       const amount = parseFloat(calculateAmount(item.price, item.quantity, item.discount, item.tax));
// //       return acc + amount;
// //     }, 0);
// //   };

// //   return (
// //     <div className='w-[1100px]'>
// //       {/* <h2>Invoice Create</h2> */}
// //       <hr style={{ marginBottom: '20px', border: '2px solid #e8e8e8' }} />

// //       <Form form={form} layout="vertical">
// //         <Row gutter={16}>
// //           <Col span={12}>
// //             <Form.Item label="Customer" name="customer" rules={[{ required: true }]}>
// //               <Select placeholder="Select Customer">
// //                 <Option value="customer1">Customer 1</Option>
// //                 <Option value="customer2">Customer 2</Option>
// //               </Select>
// //             </Form.Item>
// //           </Col>
// //           <Col span={12}>
// //             <Form.Item label="Issue Date" name="issueDate" rules={[{ required: true }]}>
// //               <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
// //             </Form.Item>
// //           </Col>
// //           <Col span={12}>
// //             <Form.Item label="Due Date" name="dueDate" rules={[{ required: true }]}>
// //               <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
// //             </Form.Item>
// //           </Col>
// //           <Col span={12}>
// //             <Form.Item label="Category" name="category" rules={[{ required: true }]}>
// //               <Select placeholder="Select Category">
// //                 <Option value="category1">Category 1</Option>
// //                 <Option value="category2">Category 2</Option>
// //               </Select>
// //             </Form.Item>
// //           </Col>
// //         </Row>
// //         <hr style={{ marginBottom: '20px', border: '2px solid #e8e8e8' }} />

// //         <h2 className='font-semibold'>Product & Services</h2>

// //         <Table
// //           columns={columns}
// //           dataSource={items}
// //           pagination={false}
// //           footer={() => (
// //             <Button
// //               type="dashed"
// //               onClick={handleAddItem}
// //               icon={<PlusOutlined />}
// //               style={{ width: '100%' }}
// //             >
// //               Add Item
// //             </Button>
// //           )}
// //         />

// //         <Row gutter={16} justify="end" className="mt-4">
// //           <Col>
// //             <p>Subtotal: {calculateTotal().toFixed(2)}</p>
// //           </Col>
// //         </Row>

// //         <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
// //           <Button type="default">Cancel</Button>
// //           <Button type="primary" htmlType="submit">
// //             Create
// //           </Button>
// //         </Space>
// //       </Form>
// //     </div>
// //   );
// // };

// // export default AddInvoice;
