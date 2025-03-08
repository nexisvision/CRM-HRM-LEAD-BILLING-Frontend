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

    const [discountType, setDiscountType] = useState('percentage');
    const [loading, setLoading] = useState(false);
    const [discountValue, setDiscountValue] = useState(0);
    const [discountRate, setDiscountRate] = useState(10);
    const dispatch = useDispatch();
    

    // Safely access the Redux state with default values
    const allempdata = useSelector((state) => state.salesquotation) || {};
    const quotationData = allempdata?.salesquotations || [];
    
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

                        let formattedTableData = []; // Define the variable here

                        // Parse items JSON string and convert to array format
                        if (quodata.items) {
                            try {
                                const parsedItems = JSON.parse(quodata.items);
                                formattedTableData = Object.entries(parsedItems).map(([key, item]) => ({
                                    id: Date.now() + Math.random(), // Generate unique ID
                                    item: item.item || '',
                                    description: item.description || '',
                                    quantity: Number(item.quantity) || 0,
                                    price: Number(item.price) || 0,
                                    tax_name: item.tax_name || '',
                                    tax: Number(item.tax) || 0,
                                    amount: Number(item.amount) || 0,
                                    discount: Number(item.discount) || 0
                                }));

                                setTableData(formattedTableData);

                                // Calculate totals
                                calculateTotal(formattedTableData, Number(quodata.discount) || 0);
                            } catch (error) {
                                console.error("Error parsing items:", error);
                                message.error("Failed to parse items data");
                            }
                        }

                        // Set discount
                        setDiscountRate(Number(quodata.discount) || 0);

                        // Set totals
                        setTotals({
                            subtotal: formattedTableData.reduce((sum, item) => sum + Number(item.amount), 0),
                            totalTax: Number(quodata.tax) || 0,
                            finalTotal: Number(quodata.total) || 0
                        });

                        // Set discount type and value
                        setDiscountType(quodata.discountType || 'percentage');
                        setDiscountValue(quodata.discountValue || 0);
                    }
                } catch (error) {
                    console.error("Error fetching quotation details:", error);
                    // message.error('Failed to fetch quotation details');
                }
            }
        };

        fetchAndSetData();
    }, [idd, quotationData, form]);

    const handleFinish = async (values) => {
    try {
        setLoading(true);
        
        // Create items object without stringifying
        const items = {};
        tableData.forEach((item, index) => {
            items[`item_${index + 1}`] = {
                item: item.item,
                description: item.description || '',
                quantity: parseFloat(item.quantity) || 0,
                price: parseFloat(item.price) || 0,
                tax_name: selectedTaxDetails[item.id]?.gstName || '',
                tax: parseFloat(item.tax) || 0,
                amount: parseFloat(item.amount) || 0
            };
        });

        const updatedValues = {
            ...values,
            issueDate: values.issueDate.format('YYYY-MM-DD'),
            items: items, // Remove JSON.stringify - keep as object
            discountType: discountType,
            discountValue: parseFloat(discountValue) || 0,
            discount: parseFloat(totals.discount) || 0,
            discountAmount: parseFloat(totals.discount) || 0,
            tax: parseFloat(totals.totalTax) || 0,
            total: parseFloat(totals.finalTotal) || 0
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

    const calculateTotal = (data = tableData, discountVal = discountValue, type = discountType) => {
        if (!Array.isArray(data)) {
          console.error('Invalid data passed to calculateTotal');
          return;
        }
    
        // Calculate subtotal
        const subtotal = data.reduce((sum, row) => {
          return sum + (parseFloat(row.amount) || 0);
        }, 0);
    
        // Calculate discount based on type
        const discountAmount = type === 'percentage' 
          ? (subtotal * (parseFloat(discountVal) || 0)) / 100
          : parseFloat(discountVal) || 0;
    
        // Calculate total tax
        const totalTax = data.reduce((sum, row) => {
          const quantity = parseFloat(row.quantity) || 0;
          const price = parseFloat(row.price) || 0;
          const tax = parseFloat(row.tax) || 0;
          const baseAmount = quantity * price;
          const taxAmount = (baseAmount * tax) / 100;
          return sum + taxAmount;
        }, 0);
    
        // Calculate final total
        const finalTotal = subtotal - discountAmount + totalTax;
    
        setTotals({
          subtotal: subtotal.toFixed(2),
          discount: discountVal ? discountAmount.toFixed(2) : '',
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
        calculateTotal(updatedData, discountValue, discountType);
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
                                            Item<span className="text-red-500">*</span>
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
                                        <td className="flex items-center space-x-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Select
                                                    value={discountType}
                                                    onChange={(value) => {
                                                        setDiscountType(value);
                                                        setDiscountValue(0);
                                                        calculateTotal(tableData, 0, value);
                                                    }}
                                                    style={{ width: 120 }}
                                                >
                                                    <Option value="percentage">Percentage</Option>
                                                    <Option value="fixed">Fixed Amount</Option>
                                                </Select>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={discountType === 'percentage' ? 100 : undefined}
                                                    value={discountValue || ''}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                                        setDiscountValue(newValue);
                                                        calculateTotal(tableData, newValue, discountType);
                                                    }}
                                                    className="mt-1 block p-2 border rounded"
                                                    placeholder="Enter discount"
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



