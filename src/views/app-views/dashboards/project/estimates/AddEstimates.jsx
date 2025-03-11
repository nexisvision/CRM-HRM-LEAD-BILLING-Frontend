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


    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState(0);

    const user = useSelector((state) => state.user.loggedInUser.username);

    const { currencies } = useSelector((state) => state.currencies);
    const condata = currencies.data || [];

    const { taxes } = useSelector((state) => state.tax);;

    const subClients = useSelector((state) => state.SubClient);
    const sub = subClients?.SubClient?.data;

    const allproject = useSelector((state) => state.Project);
    const fndrewduxxdaa = allproject.Project.data
    const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);

    const client = fnddata?.client;

    const subClientData = sub?.find((subClient) => subClient?.id === client);

    // console.log("sdsdfdf",subClientData);

    const discountRate = 10;
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
            price: "0",
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



    // Modify the discount input handler
    const handleDiscountChange = (value) => {
        const numValue = value === '' ? 0 : parseFloat(value) || 0;
        setDiscountValue(numValue);
        calculateTotal(tableData, numValue);
    };
    const [selectedCurrency, setSelectedCurrency] = useState({ code: '₹', icon: '₹' }); // Default to rupees

    const handleFinish = async (values) => {
        try {

            const requiredFields = {
                valid_till: values.valid_till,
                currency: values.currency,
                client: values.client
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
            const totalTax = tableData.reduce((sum, item) => {
                const quantity = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.price) || 0;
                const baseAmount = quantity * price;
                const tax = item.tax ? parseFloat(item.tax.gstPercentage) : 0;
                const taxAmount = (baseAmount * tax) / 100;
                return sum + taxAmount;
            }, 0);

            const finalTotal = subtotal - discountAmount;

            // Format items for the database
            const formattedItems = {};
            tableData.forEach((item, index) => {
                const itemKey = `item_${index + 1}`;
                const quantity = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.price) || 0;
                const taxPercentage = item.tax?.gstPercentage || 0;
                const baseAmount = quantity * price;
                const taxAmount = (baseAmount * taxPercentage) / 100;
                const itemTotal = baseAmount + taxAmount;

                formattedItems[itemKey] = {
                    id: (index + 1).toString(),
                    item: item.item || '',
                    quantity: quantity,
                    price: price,
                    tax_name: item.tax?.gstName || '',
                    tax: taxPercentage,
                    base_amount: baseAmount.toFixed(2),
                    tax_amount: taxAmount.toFixed(2),
                    amount: itemTotal.toFixed(2),
                    discount: parseFloat(discountRate) || 0
                };
            });

            const estimateData = {
                valid_till: values.valid_till.format('YYYY-MM-DD'),
                currency: values.currency,
                client: values.client,
                related_id: id,
                subtotal: subtotal.toFixed(2),
                items: formattedItems,
                total: finalTotal.toFixed(2),
                tax: totalTax.toFixed(2),
                discount: discountAmount.toFixed(2),
                discountRate: discountRate,
                created_by: user
            };

            const result = await dispatch(createestimate({ id, estimateData }));

            if (result.payload?.success) {
                form.resetFields();
                onClose();
                dispatch(getallestimate(id));
            }
        } catch (error) {
            console.error("Estimate Creation Error:", error);
            message.error(error.message);
        }
    };
    // Function to handle adding a new row
    const handleAddRow = () => {
        setTableData((prevData) => [
            ...prevData,
            {
                id: Date.now(), // Unique ID for the new item
                item: "",
                quantity: 1,
                price: "0",
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

    const calculateSubTotal = () => {
        return tableData.reduce((sum, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const price = parseFloat(row.price) || 0;
            const baseAmount = quantity * price;
            const tax = row.tax ? parseFloat(row.tax.gstPercentage) : 0;
            const taxAmount = (baseAmount * tax) / 100;
            const totalAmount = baseAmount + taxAmount;
            return sum + totalAmount;
        }, 0);
    };


    const calculateTotal = (data = tableData, discountVal = discountValue, type = discountType) => {
        if (!Array.isArray(data)) {
            console.error('Invalid data passed to calculateTotal');
            return;
        }

        // Calculate subtotal (sum of all item total amounts including their taxes)
        const subtotal = data.reduce((sum, row) => {
            const amount = parseFloat(row.amount) || 0;
            return sum + amount;
        }, 0);

        // Calculate discount amount based on type
        let discountAmount = 0;
        if (type === 'percentage') {
            discountAmount = (subtotal * (parseFloat(discountVal) || 0)) / 100;
        } else {
            discountAmount = parseFloat(discountVal) || 0;
        }

        // Calculate total tax (sum of all item tax amounts)
        const totalTax = data.reduce((sum, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const price = parseFloat(row.price) || 0;
            const tax = row.tax ? parseFloat(row.tax.gstPercentage) : 0;
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
    };

    const handleTableDataChange = (id, field, value) => {
        const updatedData = tableData.map((row) => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };

                // Calculate amount if quantity, price, or tax changes
                if (field === 'quantity' || field === 'price' || field === 'tax') {
                    const quantity = parseFloat(field === 'quantity' ? value : row.quantity) || 0;
                    const price = parseFloat(field === 'price' ? value : row.price) || 0;
                    const tax = field === 'tax' ?
                        (value ? parseFloat(value.gstPercentage) : 0) :
                        (row.tax ? parseFloat(row.tax.gstPercentage) : 0);

                    const baseAmount = quantity * price;
                    const taxAmount = (baseAmount * tax) / 100;
                    const totalAmount = baseAmount + taxAmount; // Item total = base amount + tax amount

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
                                            name="client"
                                            label="Client Name"
                                            initialValue={subClientData?.username}
                                            rules={[{ required: true, message: "Please enter the client name" }]}
                                        >
                                            <Input placeholder="Enter client name" disabled />
                                        </Form.Item>
                                        {/* Hidden field to pass the client ID */}
                                        <Form.Item name="client" initialValue={fnddata?.client} hidden>
                                            <Input type="hidden" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        {/* Display the project name */}
                                        <Form.Item
                                            name="projectName"
                                            label="Project Name"
                                            initialValue={fnddata?.project_name}
                                            rules={[{ required: true, message: "Please enter the project name" }]}
                                        >
                                            <Input placeholder="Enter project name" disabled />
                                        </Form.Item>

                                        {/* Hidden field to pass the project ID */}
                                        <Form.Item name="project" initialValue={fnddata?.id} hidden>
                                            <Input type="hidden" />
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
                                                    const selectedCurr = condata.find(c => c.id === value);
                                                    setSelectedCurrency({
                                                        code: selectedCurr?.currencyCode || '₹',
                                                        icon: selectedCurr?.currencyIcon || '₹'
                                                    });
                                                    form.setFieldValue(
                                                        "currency",
                                                        selectedCurr?.currencyCode || ""
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
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                                Action
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
                                                            className="w-[100px] p-2 border rounded"
                                                            min="1"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <Input
                                                            type="number"
                                                            value={row.price}
                                                            onChange={(e) => handleTableDataChange(row.id, 'price', e.target.value)}
                                                            placeholder="Price"
                                                            className="w-full p-2 border rounded"
                                                            min="0"
                                                            prefix={selectedCurrency.icon}
                                                        />
                                                    </td>

                                                    <td className="px-4 py-2 border-b">
                                                        <Select
                                                            value={row.tax?.gstPercentage ? `${row.tax.gstName}|${row.tax.gstPercentage}` : '0'}
                                                            onChange={(value) => {
                                                                if (!value || value === '0') {
                                                                    handleTableDataChange(row.id, "tax", null);
                                                                    return;
                                                                }
                                                                const [gstName, gstPercentage] = value.split('|');
                                                                handleTableDataChange(row.id, "tax", {
                                                                    gstName,
                                                                    gstPercentage: parseFloat(gstPercentage) || 0
                                                                });
                                                            }}
                                                            placeholder="Select Tax"
                                                            className="w-[150px] p-2"
                                                            allowClear
                                                        >
                                                            {taxes && taxes.data && taxes.data.map(tax => (
                                                                <Option key={tax.id} value={`${tax.gstName}|${tax.gstPercentage}`}>
                                                                    {tax.gstName} ({tax.gstPercentage}%)
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </td>

                                                    <td className="px-4 py-2 border-b">
                                                        <span>{selectedCurrency.icon}{row.amount}</span>
                                                    </td>
                                                    <td className="px-2 py-1 border-b text-center">
                                                        <Button
                                                            danger
                                                            onClick={() => handleDeleteRow(row.id)}
                                                        >
                                                            <DeleteOutlined />
                                                        </Button>
                                                    </td>
                                                </tr >
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
                                            </React.Fragment >
                                        ))}
                                    </tbody >
                                </table >
                            </div >
                            <div className="form-buttons text-left mt-2">
                                <Button type="primary" onClick={handleAddRow}>
                                    <PlusOutlined /> Add Items
                                </Button>
                            </div>

                            {/* Summary Section */}
                            <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
                                <table className='w-full lg:w-[50%] p-2'>
                                    {/* Sub Total */}
                                    <tr className="flex justify-between px-2 py-2 border-x-2">
                                        <td className="font-medium">Sub Total</td>
                                        <td className="font-medium px-4 py-2">
                                            {selectedCurrency.icon}{totals.subtotal}
                                        </td>
                                    </tr>

                                    {/* Discount */}
                                    <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
                                        <td className="font-medium">Discount</td>
                                        <td className="flex items-center space-x-2">
                                            <Select
                                                value={discountType}
                                                onChange={(value) => {
                                                    setDiscountType(value);
                                                    calculateTotal(tableData, discountValue, value);
                                                }}
                                                style={{ width: 120 }}
                                            >
                                                <Option value="percentage">Percentage (%)</Option>
                                                <Option value="fixed">Fixed Amount</Option>
                                            </Select>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={discountValue || 0}
                                                onChange={(e) => handleDiscountChange(e.target.value)}
                                                style={{ width: 120 }}
                                                prefix={discountType === 'fixed' ? selectedCurrency.icon : ''}
                                                suffix={discountType === 'percentage' ? '%' : ''}
                                            />
                                        </td>
                                    </tr>

                                    {/* Tax */}
                                    <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                                        <td className="font-medium">Total Tax</td>
                                        <td className="font-medium px-4 py-2">
                                            {selectedCurrency.icon}{totals.totalTax}
                                        </td>
                                    </tr>

                                    {/* Total */}
                                    <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
                                        <td className="font-bold text-lg">Total Amount</td>
                                        <td className="font-bold text-lg px-4">
                                            {selectedCurrency.icon}{totals.finalTotal}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div >

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
                    </Form >
                </div >
            </div >
        </>
    );
};

export default AddEstimates;

