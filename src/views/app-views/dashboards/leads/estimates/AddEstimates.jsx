import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, message, Button, Select, DatePicker } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux';
import { createestimate, getallestimate } from './estimatesReducer/EstimatesSlice';
import { GetLeads } from '../../leads/LeadReducers/LeadSlice';
import moment from 'moment';
import { getcurren } from 'views/app-views/setting/currencies/currenciesSlice/currenciesSlice';
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice"

const { Option } = Select;

const AddEstimates = ({ onClose }) => {

    const { id } = useParams();
    const user = useSelector((state) => state.user.loggedInUser.username);
    const { currencies } = useSelector((state) => state.currencies);
    const condata = currencies.data || [];
    const { taxes } = useSelector((state) => state.tax);
    const [selectedTaxDetails, setSelectedTaxDetails] = useState({});

    const [discountRate, setDiscountRate] = useState(10);
    const dispatch = useDispatch();
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
            discount: 0,
            tax: 0,
            amount: "0",
            description: "",
        }
    ]);
    useEffect(() => {
        dispatch(getAllTaxes());
    }, [dispatch]);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                await dispatch(getcurren()).unwrap();
            } catch (error) {
                console.error('Failed to fetch currencies:', error);
                message.error('Failed to load currencies');
            }
        };

        fetchCurrencies();
    }, [dispatch]);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                await dispatch(GetLeads()).unwrap();
            } catch (error) {
                console.error('Failed to fetch leads:', error);
                message.error('Failed to load leads');
            }
        };

        fetchLeads();
    }, [dispatch]);

    const allLeads = useSelector((state) => state.Leads);
    const leadsData = allLeads.Leads.data || [];
    const selectedLead = leadsData?.find((lead) => lead?.id === id);

    const leadTitle = selectedLead?.leadTitle || 'N/A';

    useEffect(() => {
        form.setFieldsValue({
            leadTitle: leadTitle,
            lead: id  // Keep the ID in hidden field
        });
    }, [form, leadTitle, id]);


    const handleFinish = async (values) => {
        try {
            const requiredFields = {
                valid_till: values.valid_till,
                currency: values.currency,
                lead: values.lead,
                calculatedTax: values.calculatedTax
            };

            const missingFields = Object.entries(requiredFields)
                .filter(([key, value]) => !value)
                .map(([key]) => key);

            if (missingFields.length > 0) {
                throw new Error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
            }

            if (!tableData || tableData.length === 0 || !tableData[0].item) {
                throw new Error('Please add at least one item to the estimate');
            }

            const subtotal = calculateSubTotal();
            const discountAmount = (subtotal * discountRate) / 100;
            const finalTotal = parseFloat(totals.finalTotal);

            // Format items for the database
            const formattedItems = {};
            tableData.forEach((item, index) => {
                const itemKey = `item_${index + 1}`;
                formattedItems[itemKey] = {
                    id: (index + 1).toString(),
                    item: item.item || '',
                    quantity: parseFloat(item.quantity) || 0,
                    price: parseFloat(item.price) || 0,
                    tax_name: selectedTaxDetails[item.id]?.gstName || '',
                    tax: parseFloat(item.tax) || 0,
                    amount: parseFloat(item.amount) || 0,
                    discount: parseFloat(discountRate) || 0
                };
            });

            const estimateData = {
                valid_till: values.valid_till.format('YYYY-MM-DD'),
                currency: values.currency,
                lead: values.lead,
                related_id: id,
                subtotal: subtotal.toFixed(2),
                calculatedTax: values.calculatedTax,
                items: formattedItems,
                total: finalTotal.toFixed(2),
                tax: totals.totalTax,
                discount: discountAmount,
                discountRate: discountRate,
                created_by: user
            };

            const result = await dispatch(createestimate({ id, estimateData }));

            if (result.payload?.success) {
                form.resetFields();
                onClose();
                dispatch(getallestimate(id));
                message.success('Estimate created successfully');
            } else {
                throw new Error(result.payload?.message || 'Failed to create estimate');
            }
        } catch (error) {
            console.error("Estimate Creation Error:", error);
            message.error(error.message);
        }
    };

    const handleAddRow = () => {
        setTableData((prevData) => [
            ...prevData,
            {
                id: Date.now(), // Unique ID for the new item
                item: "",
                quantity: 1,
                price: "",
                tax: 0,
                amount: "0",
                description: "",
            },
        ]);
    };

    // Delete row
    const handleDeleteRow = (id) => {
        if (tableData.length > 1) {
            const updatedTableData = tableData.filter(row => row.id !== id);
            setTableData(updatedTableData);
            calculateTotal(updatedTableData, discountRate); // Recalculate totals after deletion
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
            const tax = (parseFloat(row.tax) || 0);
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
                    <hr className="mb-4 border-b  font-medium"></hr>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                    // initialValues={initialValues}

                    >
                        <div className="">
                            <div className=" p-2">

                                <Row gutter={16}>


                                    <Col span={12}>
                                        <Form.Item
                                            name="leadTitle"
                                            label="Lead Title"
                                            rules={[{ required: true, message: "Lead title is required" }]}
                                        >
                                            <Input
                                                placeholder="Lead Title"
                                                disabled
                                                value={leadTitle}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="lead"
                                            hidden
                                        >
                                            <Input type="hidden" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="calculatedTax"
                                            label="Calculate Tax"
                                            rules={[{ required: true, message: "Please enter the Calculate Tax" }]}
                                        >
                                            <Input
                                                type="number"
                                                placeholder="Enter Calculate Tax"
                                                min={0}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="currency"
                                            label="Currency"
                                            rules={[{ required: true, message: "Please select a currency" }]}
                                        >
                                            <Select
                                                className="w-full"
                                                placeholder="Select Currency"
                                                onChange={(value) => {
                                                    const selectedCurrency = condata.find(
                                                        (c) => c.id === value
                                                    );
                                                    form.setFieldValue(
                                                        "currency",
                                                        selectedCurrency?.currencyCode || ""
                                                    );
                                                }}
                                            >
                                                {condata.map((currency) => (
                                                    <Option key={currency.id} value={currency.id}>
                                                        {currency.currencyCode}
                                                        ({currency.currencyIcon})
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="valid_till"
                                            label="Valid Till"
                                            rules={[{ required: true, message: "Please select the expiry date" }]}
                                        >
                                            <DatePicker
                                                className="w-full"
                                                format="YYYY-MM-DD"
                                                disabledDate={(current) => {
                                                    return current && current < moment().startOf('day');
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="related_id"
                                            label="Related ID"
                                            initialValue={id}
                                            hidden
                                        >
                                            <Input type="hidden" />
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
                                                            className="w-full p-2 border rounded"
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
                                                            className="w-full p-2 border rounded"
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
                            <div className="form-buttons text-left mt-2">
                                <Button className='border-0 text-blue-500' onClick={handleAddRow}>
                                    <PlusOutlined /> Add Items
                                </Button>
                            </div>

                            <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
                                <table className='w-full lg:w-[50%] p-2'>
                                    <tr className="flex justify-between px-2 py-2 border-x-2">
                                        <td className="font-medium">Sub Total</td>
                                        <td className="font-medium px-4 py-2">
                                            ₹{totals.subtotal}
                                        </td>
                                    </tr>

                                    <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
                                        <td className="font-medium">Discount</td>
                                        <td className="flex items-center space-x-2">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Discount Rate (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={discountRate}
                                                    onChange={(e) => {
                                                        const newRate = parseFloat(e.target.value) || 0;
                                                        setDiscountRate(newRate);
                                                        calculateTotal(tableData, newRate);
                                                    }}
                                                    className="mt-1 block w-full p-2 border rounded"
                                                />
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                                        <td className="font-medium">Total Tax</td>
                                        <td className="font-medium px-4 py-2">
                                            ₹{totals.totalTax}
                                        </td>
                                    </tr>

                                    <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
                                        <td className="font-bold text-lg">Total Amount</td>
                                        <td className="font-bold text-lg px-4">
                                            ₹{totals.finalTotal}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>

                        <Form.Item className="mt-4">
                            <Row justify="end" gutter={16}>
                                <Col>
                                    <Button onClick={() => navigate("/app/dashboards/sales/estimates")}>Cancel</Button>
                                </Col>
                                <Col>
                                    <Button type="primary" htmlType="submit">
                                        Create
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

export default AddEstimates;

