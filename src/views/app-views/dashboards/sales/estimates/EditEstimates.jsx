import React, { useState, useEffect } from 'react';
import { Card, Form, Menu, Row, Col, Tag, Input, message, Button, Upload, Select, DatePicker, Modal } from 'antd';
import { DeleteOutlined, CloudUploadOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, FilterOutlined, EditOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux';
import { updatequotation, getquotationsById, getallquotations } from './estimatesReducer/EstimatesSlice';
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice"
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { Getcus } from '../customer/CustomerReducer/CustomerSlice';
import { AddLable, GetLable } from '../LableReducer/LableSlice';

const { Option } = Select;

const EditEstimates = ({ onClose, idd, setInitialValues }) => {

    // const {id} = useParams();

    const [discountType, setDiscountType] = useState("%");
    const [loading, setLoading] = useState(false);
    const [discountValue, setDiscountValue] = useState(0);
    const [discountRate, setDiscountRate] = useState(10);
    const dispatch = useDispatch();
    
    // Safely access the Redux state with default values
    const allempdata = useSelector((state) => state.estimate) || {};
    const quotationData = allempdata?.salesquotations?.data || [];
    
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        customer: '',
        category: '',
        issueDate: null,
    });

    const { taxes } = useSelector((state) => state.tax);
    const [selectedTaxDetails, setSelectedTaxDetails] = useState({});

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

    // Add new state variables
    const [isTagModalVisible, setIsTagModalVisible] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [tags, setTags] = useState([]);
    const AllLoggeddtaa = useSelector((state) => state.user);

    // Add useEffect for fetching customers
    useEffect(() => {
        dispatch(Getcus());
    }, []);

    const customerdata = useSelector((state) => state.customers);
    const fnddata = customerdata.customers.data;

    // Add tag management functions
    const fetchTags = async () => {
        try {
            const lid = AllLoggeddtaa.loggedInUser.id;
            const response = await dispatch(GetLable(lid));

            if (response.payload && response.payload.data) {
                const uniqueTags = response.payload.data
                    .filter((label) => label && label.name)
                    .map((label) => ({
                        id: label.id,
                        name: label.name.trim(),
                    }))
                    .filter(
                        (label, index, self) =>
                            index === self.findIndex((t) => t.name === label.name)
                    );

                setTags(uniqueTags);
            }
        } catch (error) {
            console.error("Failed to fetch tags:", error);
            message.error("Failed to load tags");
        }
    };

    const handleAddNewTag = async () => {
        if (!newTag.trim()) {
            message.error("Please enter a tag name");
            return;
        }

        try {
            const lid = AllLoggeddtaa.loggedInUser.id;
            const payload = {
                name: newTag.trim(),
                labelType: "status",
            };

            await dispatch(AddLable({ lid, payload }));
            message.success("Status added successfully");
            setNewTag("");
            setIsTagModalVisible(false);
            await fetchTags();
        } catch (error) {
            console.error("Failed to add Status:", error);
            message.error("Failed to add Status");
        }
    };
    useEffect(() => {
        dispatch(getAllTaxes());
      }, []);

    // First useEffect to fetch all quotations
    useEffect(() => {
        const fetchQuotations = async () => {
            try {
                await dispatch(getallquotations()).unwrap();
            } catch (error) {
                message.error('Failed to fetch quotations');
            }
        };
        
        fetchQuotations();
    }, [dispatch]);

    // Second useEffect to handle individual quotation data
    useEffect(() => {
        const fetchAndSetData = async () => {
            if (idd && quotationData) {
                try {
                    const quodata = quotationData.find((item) => item.id === idd);
                    
                    if (quodata) {
                        // Set form fields
                        const formValues = {
                            customer: quodata.customer || '',
                            category: quodata.category || '',
                            issueDate: quodata.issueDate ? dayjs(quodata.issueDate) : null,
                        };

                        // Update form with values
                        form.setFieldsValue(formValues);
                        setFormData(formValues);

                        // Set table data if it exists
                        if (quodata.items && Array.isArray(quodata.items)) {
                            const formattedTableData = quodata.items.map(item => ({
                                id: item.id || Date.now(),
                                item: item.description || '',
                                quantity: parseFloat(item.quantity) || 0,
                                price: parseFloat(item.price) || 0,
                                tax: parseFloat(item.tax) || 0,
                                amount: (parseFloat(item.quantity || 0) * parseFloat(item.price || 0)).toString(),
                                description: item.description || '',
                            }));
                            setTableData(formattedTableData);
                        }

                        // Set discount rate
                        if (quodata.discountRate) {
                            setDiscountRate(parseFloat(quodata.discountRate));
                        }

                        // Calculate totals
                        calculateTotal(quodata.items || [], parseFloat(quodata.discountRate) || 0);
                    }
                } catch (error) {
                    message.error('Failed to fetch quotation details');
                }
            }
        };

        fetchAndSetData();
    }, [idd, quotationData, form]);

    const handleFinish = async (values) => {
    try {
        setLoading(true);
        
        // Format items data as an array instead of an object
        const formattedItems = tableData.map(item => ({
            description: item.item,
            quantity: parseFloat(item.quantity) || 0,
            price: parseFloat(item.price) || 0,
            tax_name: selectedTaxDetails[item.id]?.gstName || '',
            tax: parseFloat(item.tax) || 0,
            amount: parseFloat(item.amount) || 0,
            item_description: item.description || ''
        }));

        const subtotal = calculateSubTotal();
        const discountAmount = (subtotal * discountRate) / 100;

        const updatedValues = {
            ...values,
            issueDate: values.issueDate.format("YYYY-MM-DD"),
            items: formattedItems, // Send items as an array
            discount: discountAmount,
            discountRate: discountRate,
            tax: totals.totalTax,
            total: totals.finalTotal
        };

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

    // const handleFinish = async (values) => {
    //     try {
    //         setLoading(true);
    //         const items = {};
    //         // Calculate totals
    //         // const subTotal = calculateSubTotal();
    //         // const totalTax = calculateTotalTax();
    //         // const discount = calculateDiscount();
    //         // const finalTotal = subTotal - discount + totalTax;

    //         // Format items data similar to AddEstimates
    //         const itemsObject = tableData.reduce((acc, item, index) => {
    //             acc[`item_${index + 1}`] = {
    //                 item: item.item,
    //                 discount: Number(totals.discount),
    //                 quantity: parseFloat(item.quantity) || 0,
    //                 price: parseFloat(item.price) || 0,
    //                 tax_name: selectedTaxDetails[item.id]?.
    //       gstName || '',
    //                 tax: parseFloat(item.tax) || 0,
    //                 amount: parseFloat(item.amount) || 0,
    //                 description: item.description || ''
    //             };
    //             return acc;
    //         }, {});

    //         const subtotal = calculateSubTotal();
    //         const discountAmount = (subtotal * discountRate) / 100;

    //         const updatedValues = {
    //             ...values,
    //             issueDate: values.issueDate.format("YYYY-MM-DD"),
    //             items: itemsObject,
    //             discount: discountAmount, // Store the calculated discount amount
    //             discountRate: discountRate ,
    //             tax: totals.totalTax, 
    //             total: totals.finalTotal
    //         };

    //         await dispatch(updatequotation({ id: idd, values: updatedValues })).unwrap();
    //         message.success("Estimate updated successfully!");
    //         dispatch(getallquotations());
    //         onClose();
    //     } catch (error) {
    //         message.error("Failed to update estimate: " + (error.message || "Unknown error"));
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
        const newRow = {
            id: Date.now(), // Unique ID for the new row
            item: "",
            quantity: 1,
            price: "",
            tax: 0,
            amount: "0",
            description: "",
        };
        
        setTableData([...tableData, newRow]);
    };

    // Function to handle deleting a row
    const handleDeleteRow = (id) => {
        if (tableData.length > 1) {
            const updatedData = tableData.filter(row => row.id !== id);
            setTableData(updatedData);
            calculateTotal(updatedData, discountRate);
        } else {
            message.warning('At least one item is required');
        }
    };

    const navigate = useNavigate();

    // Calculate subtotal (sum of all row amounts before discount)
  const calculateSubTotal = () => {
    return tableData.reduce((sum, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      return sum + (quantity * price);
    }, 0);
  };

    const calculateTotal = (data = tableData, discount = discountRate) => {
        if (!Array.isArray(data)) {
          console.error('Invalid data passed to calculateTotal');
          return;
        }
    
        // Calculate subtotal (sum of all item amounts)
        const subtotal = data.reduce((sum, row) => {
          return sum + (parseFloat(row.amount) || 0);
        }, 0);
    
        // Calculate discount amount
        const discountAmount = (subtotal * (parseFloat(discount) || 0)) / 100;
    
        // Calculate total tax (for display purposes)
        const totalTax = data.reduce((sum, row) => {
          const quantity = parseFloat(row.quantity) || 0;
          const price = parseFloat(row.price) || 0;
          const tax = (parseFloat(row.tax) || 0) ;
          const baseAmount = quantity * price;
          const taxAmount = (baseAmount * tax) / 100;
          return sum + taxAmount;
        }, 0);
    
        // Calculate final total: subtotal - discount
        const finalTotal = subtotal - discountAmount;
    
        setTotals({
          subtotal: subtotal.toFixed(2),
          discount: discountAmount.toFixed(2),
          totalTax: totalTax.toFixed(2),
          finalTotal: finalTotal.toFixed(2)
        });
    
        return {
          subtotal,
          discount: discountAmount,
          totalTax,
          finalTotal
        };
      };

      const handleTableDataChange = (id, field, value) => {
        const updatedData = tableData.map((row) => {
          if (row.id === id) {
            const updatedRow = { ...row, [field]: value };
            
            if (field === 'tax' && taxes?.data) {
              const selectedTax = taxes.data.find(tax => tax.gstPercentage.toString() === value.toString());
              if (selectedTax) {
                setSelectedTaxDetails(prevDetails => ({
                  ...prevDetails,
                  [id]: {
                    gstName: selectedTax.gstName,
                    gstPercentage: selectedTax.gstPercentage
                  }
                }));
              }
            }
            // Calculate amount if quantity, price, or tax changes
            if (field === 'quantity' || field === 'price' || field === 'tax') {
              const quantity = parseFloat(field === 'quantity' ? value : row.quantity) || 0;
              const price = parseFloat(field === 'price' ? value : row.price) || 0;
              const tax = parseFloat(field === 'tax' ? value : row.tax) || 0;
              
              const baseAmount = quantity * price;
              const taxAmount = (baseAmount * tax) / 100;
              const totalAmount = baseAmount + taxAmount;
              
              updatedRow.amount = totalAmount.toFixed(2);
            }
            
            return updatedRow;
          }
          return row;
        });
    
        setTableData(updatedData);
        calculateTotal(updatedData, discountRate);
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
                                    <Col span={24} className="mt-1">
                                        <Form.Item
                                            label="Customer"
                                            name="customer"
                                            rules={[{ required: true, message: "Please select a customer" }]}
                                        >
                                            <Select
                                                style={{ width: "100%" }}
                                                placeholder="Select Client"
                                                loading={!fnddata}
                                            >
                                                {fnddata && fnddata.length > 0 ? (
                                                    fnddata.map((client) => (
                                                        <Option key={client.id} value={client.id}>
                                                            {client.name || "Unnamed Client"}
                                                        </Option>
                                                    ))
                                                ) : (
                                                    <Option value="" disabled>
                                                        No customers available
                                                    </Option>
                                                )}
                                            </Select>
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

                                    <Col span={12} className="">
                                        <Form.Item
                                            label="Category"
                                            name="category"
                                            rules={[{ required: true, message: "Please select or add a category" }]}
                                        >
                                            <Select
                                                placeholder="Select or add new category"
                                                dropdownRender={(menu) => (
                                                    <div>
                                                        {menu}
                                                        <div style={{ padding: "8px", borderTop: "1px solid #e8e8e8" }}>
                                                            <Button type="link" onClick={() => setIsTagModalVisible(true)} block>
                                                                Add New Category
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            >
                                                {tags &&
                                                    tags.map((tag) => (
                                                        <Option key={tag.id} value={tag.name}>
                                                            {tag.name}
                                                        </Option>
                                                    ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                </Row>

                            </div>
                        </div>
                        <div>
                            <div className="overflow-x-auto">

                            <div className="form-buttons text-left mt-2 mb-2 justify-end flex">
                            <Button 
                    type="primary"
                    onClick={handleAddRow}
                    icon={<PlusOutlined />}
                  >
                    Add Items
                  </Button>
                            </div>

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
                                                            min="1"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="number"
                                                            value={row.price}
                                                            onChange={(e) => handleTableDataChange(row.id, 'price', e.target.value)}
                                                            placeholder="Price"
                                                            className="w-full p-2 border rounded-s"
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                          <select
                            value={row.tax}
                            onChange={(e) => handleTableDataChange(row.id, "tax", e.target.value)}
                            className="w-full p-2 border"
                          >
                            <option value="0">Nothing Selected</option>
                            {taxes && taxes.data && taxes.data.map(tax => (
                              <option key={tax.id} value={tax.gstPercentage}>
                                {tax.gstName}: {tax.gstPercentage}%
                              </option>
                            ))}
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
                           

                            {/* Summary Section */}
                            <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
                                <table className='w-full lg:w-[50%] p-2'>
                                    {/* Sub Total */}
                                    <tr className="flex justify-between px-2 py-2 border-x-2">
                                        <td className="font-medium">Sub Total</td>
                                        <td className="font-medium px-4 py-2">
                                            ₹{totals.subtotal}
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
                                            ₹{totals.totalTax}
                                        </td>
                                    </tr>

                                    {/* Total */}
                                    <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
                                        <td className="font-bold text-lg">Total Amount</td>
                                        <td className="font-bold text-lg px-4">
                                            ₹{totals.finalTotal}
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

            {/* Add Modal component at the end of the return statement */}
            <Modal
                title="Add New Category"
                open={isTagModalVisible}
                onCancel={() => setIsTagModalVisible(false)}
                onOk={handleAddNewTag}
                okText="Add Category"
            >
                <Input
                    placeholder="Enter new Category"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                />
            </Modal>
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



