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

const EditInvoice = () => {
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
            invoicenub:'',
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
                                              {({ values, setFieldValue, handleSubmit,setFieldTouched  }) => (
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

            

            <div className="form-buttons text-right">
                <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/estimates')}>Cancel</Button>
                <Button type="primary" htmlType="submit">Update</Button>
            </div>
  </div>
</div>

        </>
    );
};

export default EditInvoice;


// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, Row, Col, message } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// const EditInvoice = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted Invoice:', values);
//     message.success('Invoice updated successfully!');
//     navigate('/app/invoices');
//   };

//   return (
//     <div className="edit-invoice-form">
//       <h2 className="mb-4">Edit Invoice</h2>
//       <Form layout="vertical" form={form} name="edit-invoice" onFinish={onFinish}>
//         <Row gutter={16}>
//           {/* Customer */}
//           <Col span={12}>
//             <Form.Item
//               name="customer"
//               label="Customer"
//               rules={[{ required: true, message: 'Please select a customer.' }]}
//             >
//               <Select placeholder="Select Customer">
//                 <Option value="customer1">Customer 1</Option>
//                 <Option value="customer2">Customer 2</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Issue Date */}
//           <Col span={12}>
//             <Form.Item
//               name="issueDate"
//               label="Issue Date"
//               rules={[{ required: true, message: 'Please select the issue date.' }]}
//             >
//               <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
//             </Form.Item>
//           </Col>

//           {/* Due Date */}
//           <Col span={12}>
//             <Form.Item
//               name="dueDate"
//               label="Due Date"
//               rules={[{ required: true, message: 'Please select the due date.' }]}
//             >
//               <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
//             </Form.Item>
//           </Col>

//           {/* Invoice Number */}
//           <Col span={12}>
//             <Form.Item name="invoiceNumber" label="Invoice Number">
//               <Input placeholder="Enter Invoice Number" disabled />
//             </Form.Item>
//           </Col>

//           {/* Category */}
//           <Col span={12}>
//             <Form.Item
//               name="category"
//               label="Category"
//               rules={[{ required: true, message: 'Please select a category.' }]}
//             >
//               <Select placeholder="Select Category">
//                 <Option value="maintenance">Maintenance Sales</Option>
//                 <Option value="general">General Sales</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Reference Number */}
//           <Col span={12}>
//             <Form.Item name="refNumber" label="Ref Number">
//               <Input placeholder="Enter Ref Number" />
//             </Form.Item>
//           </Col>

//           {/* Product Items */}
//           <Col span={24}>
//             <Form.Item label="Product & Services">
//               {/* Render dynamic product rows here */}
//               <Input.TextArea rows={4} placeholder="Add product details" />
//             </Form.Item>
//           </Col>

//           {/* Amount Details */}
//           <Col span={12}>
//             <Form.Item name="subTotal" label="Sub Total">
//               <Input placeholder="0.00" disabled />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item name="tax" label="Tax">
//               <Input placeholder="0.00" disabled />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item name="totalAmount" label="Total Amount">
//               <Input placeholder="0.00" disabled />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item>
//           <div className="form-buttons text-right">
//             <Button type="default" className="mr-2" onClick={() => navigate('/app/invoices')}>
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Update
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default EditInvoice;
