import React, { useState, useEffect } from 'react';
import { Card, Form, Menu, Row, Col, Tag, Input, message, Button, Upload, Select, DatePicker, Modal } from 'antd';
import { DeleteOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, FilterOutlined, EditOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { getestimateById, updateestimate } from './estimatesReducer/EstimatesSlice';
import { getcurren } from 'views/app-views/setting/currencies/currenciesSlice/currenciesSlice';
import { getAllTaxes } from 'views/app-views/setting/tax/taxreducer/taxSlice';


const { Option } = Select;

const EditEstimates = ({ idd, onClose }) => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [selectedTaxDetails, setSelectedTaxDetails] = useState({});


    const user = useSelector((state) => state.user.loggedInUser.username);

    // Get current estimate and currencies from Redux store
    const currentEstimatee = useSelector((state) => state.estimate.estimates || []);

    const currentEstimate = currentEstimatee.find((item) => item.id === idd);

    const { currencies } = useSelector((state) => state.currencies);
    const condata = currencies.data || [];

    const { taxes } = useSelector((state) => state.tax);

    const subClients = useSelector((state) => state.SubClient);
    const sub = subClients?.SubClient?.data;

    const allproject = useSelector((state) => state.Project);
    const fndrewduxxdaa = allproject.Project.data
    const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);

    const client = fnddata?.client;

    const subClientData = sub?.find((subClient) => subClient?.id === client);


    const { data: Leads, isLoading: isLeadsLoading, error: leadsError } = useSelector((state) => state.Leads.Leads || []);

    const lead = Leads?.filter((item) => item.created_by === user) || [];
    const leadDetails = lead?.find((lead) => lead.id === currentEstimate?.lead);

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

    const [discountType, setDiscountType] = useState('');
    const [discountValue, setDiscountValue] = useState(0);

    const [totals, setTotals] = useState({
        subtotal: 0,
        discount: 0,
        totalTax: 0,
        finalTotal: 0,
    });

    const [invoiceType, setInvoiceType] = useState('standard');

    // Fetch estimate and currencies data
    useEffect(() => {
        dispatch(getcurren());
        if (id) {
            dispatch(getestimateById(id));
        }
    }, [dispatch]);


    useEffect(() => {
        dispatch(getAllTaxes());
    }, [dispatch]);

    // Populate form when currentEstimate changes
    useEffect(() => {
        const fetchAndSetEstimateData = async () => {
            if (currentEstimate) {
                try {

                    // Set basic form fields
                    form.setFieldsValue({
                        valid_till: dayjs(currentEstimate.valid_till),
                        currency: currentEstimate.currency,
                        client: currentEstimate.client,
                        calculatedTax: currentEstimate.calculatedTax,
                        projectName: fnddata?.project_name
                    });

                    // Parse and set items
                    if (currentEstimate.items) {
                        try {
                            // Parse items if it's a string
                            const parsedItems = typeof currentEstimate.items === 'string' 
                                ? JSON.parse(currentEstimate.items)
                                : currentEstimate.items;
                            

                            // Convert items object to array if needed
                            const itemsArray = Array.isArray(parsedItems) 
                                ? parsedItems 
                                : Object.values(parsedItems);

                            // Format items for table
                            const formattedItems = itemsArray.map(item => ({
                                id: Date.now() + Math.random(),
                                item: item.item || '',
                                quantity: Number(item.quantity) || 0,
                                price: Number(item.price) || 0,
                                tax: {
                                    gstName: item.tax_name || '',
                                    gstPercentage: Number(item.tax) || 0
                                },
                                tax_name: item.tax_name || '',
                                amount: Number(item.amount) || 0,
                                description: item.description || '',
                                base_amount: Number(item.base_amount) || 0,
                                tax_amount: Number(item.tax_amount) || 0,
                                discount_percentage: Number(item.discount) || 0,
                                discount_amount: Number(item.discount_amount) || 0
                            }));

                            setTableData(formattedItems);

                            // Set totals using the values from database
                            setTotals({
                                subtotal: Number(currentEstimate.subtotal) || 0,
                                discount: Number(currentEstimate.discount) || 0,
                                totalTax: Number(currentEstimate.tax) || 0,
                                finalTotal: Number(currentEstimate.total) || 0
                            });

                            // Set discount value and type
                            const discountAmount = Number(currentEstimate.discount) || 0;
                            setDiscountType(discountAmount <= 100 ? 'percentage' : 'fixed');
                            setDiscountValue(discountAmount);

                        } catch (error) {
                            console.error("Error parsing items:", error);
                            message.error("Error loading estimate items");
                        }
                    }

                } catch (error) {
                    console.error("Error setting estimate data:", error);
                    message.error("Failed to load estimate details");
                }
            }
        };

        fetchAndSetEstimateData();
    }, [currentEstimate, form, fnddata]);

    // Add debug logging
    useEffect(() => {
    }, [tableData]);

    const calculateTotal = (data = tableData, globalDiscountValue, discountType) => {
        // Calculate item-level totals
        const calculations = data.reduce((acc, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const price = parseFloat(row.price) || 0;
            const baseAmount = quantity * price;
            
            // Calculate item discount
            let itemDiscountAmount = 0;
            const discountValue = parseFloat(row.discountValue) || 0;
            if (row.discountType === 'percentage') {
                itemDiscountAmount = (baseAmount * discountValue) / 100;
            } else {
                itemDiscountAmount = Math.min(discountValue, baseAmount);
            }

            // Calculate tax
            const amountAfterDiscount = baseAmount - itemDiscountAmount;
            const taxPercentage = row.tax ? parseFloat(row.tax.gstPercentage) || 0 : 0;
            const taxAmount = (amountAfterDiscount * taxPercentage) / 100;

            return {
                totalBaseAmount: acc.totalBaseAmount + baseAmount,
                totalItemDiscount: acc.totalItemDiscount + itemDiscountAmount,
                totalTax: acc.totalTax + taxAmount,
                subtotal: acc.subtotal + amountAfterDiscount + taxAmount
            };
        }, { totalBaseAmount: 0, totalItemDiscount: 0, totalTax: 0, subtotal: 0 });

        // Calculate global discount
        const validGlobalDiscountValue = parseFloat(globalDiscountValue) || 0;
        let globalDiscountAmount = 0;
        if (discountType === 'percentage') {
            globalDiscountAmount = (calculations.subtotal * validGlobalDiscountValue) / 100;
        } else {
            globalDiscountAmount = validGlobalDiscountValue;
        }

        // Calculate final total
        const finalTotal = Math.max(0, calculations.subtotal - globalDiscountAmount);

        // Update totals state
        setTotals({
            subtotal: calculations.subtotal.toFixed(2),
            itemDiscount: calculations.totalItemDiscount.toFixed(2),
            globalDiscount: globalDiscountAmount.toFixed(2),
            totalTax: calculations.totalTax.toFixed(2),
            finalTotal: finalTotal.toFixed(2)
        });
    };

    // Handle form submission
    const handleFinish = async (values) => {
        try {
            setLoading(true);
            
            const formattedItems = {};
            tableData.forEach((item, index) => {
                const quantity = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.price) || 0;
                const baseAmount = quantity * price;
                
                // Calculate item discount
                let itemDiscountAmount = 0;
                const discountValue = parseFloat(item.discountValue) || 0;
                if (item.discountType === 'percentage') {
                    itemDiscountAmount = (baseAmount * discountValue) / 100;
                } else {
                    itemDiscountAmount = Math.min(discountValue, baseAmount);
                }

                // Calculate tax
                const amountAfterDiscount = baseAmount - itemDiscountAmount;
                const taxPercentage = item.tax ? parseFloat(item.tax.gstPercentage) || 0 : 0;
                const taxAmount = (amountAfterDiscount * taxPercentage) / 100;
                
                formattedItems[`item_${index + 1}`] = {
                    item: item.item,
                    description: item.description || '',
                    quantity: quantity,
                    price: price,
                    tax_name: item.tax?.gstName || '',
                    tax_percentage: taxPercentage,
                    tax_amount: taxAmount,
                    discount_type: item.discountType,
                    discount_percentage: item.discountType === 'percentage' ? discountValue : 0,
                    discount_amount: itemDiscountAmount,
                    base_amount: baseAmount,
                    amount_after_discount: amountAfterDiscount,
                    final_amount: amountAfterDiscount + taxAmount,
                    hsn_sac: item.hsn_sac || ''
                };
            });

            const estimateData = {
                id: idd,
                valid_till: values.valid_till.format('YYYY-MM-DD'),
                currency: values.currency,
                client: values.client,
                invoiceType: invoiceType,
                discount: parseFloat(totals.globalDiscount),
                discountType: discountType,
                discountValue: parseFloat(discountValue),
                calculatedTax: parseFloat(values.calculatedTax) || 0,
                items: formattedItems,
                tax: parseFloat(totals.totalTax),
                total: parseFloat(totals.finalTotal),
                related_id: id
            };

            await dispatch(updateestimate({
                idd: idd,
                data: estimateData
            })).unwrap();

            onClose();
        } catch (error) {
            message.error('Failed to update estimate: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRow = (id) => {
        if (tableData.length > 1) {
            const updatedData = tableData.filter(row => row.id !== id);
            setTableData(updatedData);
            calculateTotal(updatedData, discountValue, discountType);
        } else {
            message.warning('At least one item is required');
        }
    };

    // Handle table data changes
    const handleTableDataChange = (id, field, value) => {
        const updatedData = tableData.map((row) => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };
                
                // Calculate amount if quantity, price, or tax changes
                if (field === 'quantity' || field === 'price' || field === 'tax' || field === 'discountType' || field === 'discountValue') {
                    const quantity = parseFloat(field === 'quantity' ? value : row.quantity) || 0;
                    const price = parseFloat(field === 'price' ? value : row.price) || 0;
                    const baseAmount = quantity * price;
                    
                    // Calculate item discount
                    let itemDiscountAmount = 0;
                    const discountValue = parseFloat(updatedRow.discountValue) || 0;
                    if (updatedRow.discountType === 'percentage') {
                        itemDiscountAmount = (baseAmount * discountValue) / 100;
                    } else {
                        itemDiscountAmount = Math.min(discountValue, baseAmount);
                    }

                    // Calculate tax on amount after discount
                    const amountAfterDiscount = baseAmount - itemDiscountAmount;
                    const tax = field === 'tax' ? 
                        (value ? parseFloat(value.gstPercentage) : 0) : 
                        (row.tax ? parseFloat(row.tax.gstPercentage) : 0);
                    const taxAmount = (amountAfterDiscount * tax) / 100;
                    
                    // Calculate final amount
                    const finalAmount = amountAfterDiscount + taxAmount;
                    updatedRow.amount = finalAmount.toFixed(2);
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
                                                    const selectedCurrency = condata?.find(c => c.id === value);
                                                    form.setFieldValue("currency", selectedCurrency?.currencyCode || '');
                                                }}
                                            >
                                                {Array.isArray(condata) && condata?.map((currency) => (
                                                    <Option
                                                        key={currency.id}
                                                        value={currency.id}
                                                    >
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
                                            label="Date"
                                            rules={[{ required: true, message: "Please select the date" }]}
                                        >
                                            <DatePicker className="w-full" format="DD-MM-YYYY" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="invoiceType"
                                            label="Invoice Type"
                                            rules={[{ required: true, message: "Please select invoice type" }]}
                                        >
                                            <Select
                                                value={invoiceType}
                                                onChange={(value) => setInvoiceType(value)}
                                                placeholder="Select Invoice Type"
                                            >
                                                <Option value="standard">Standard Invoice</Option>
                                                <Option value="proforma">Proforma Invoice</Option>
                                                <Option value="commercial">Commercial Invoice</Option>
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

                                <div className="form-buttons text-left mt-2">
                                    <Button type="primary" onClick={handleAddRow}>
                                        <PlusOutlined /> Add Items
                                    </Button>
                                </div>
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
                                                value={discountValue}
                                                onFocus={(e) => {
                                                    if (discountValue === 0) {
                                                        setDiscountValue('');
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    if (e.target.value === '') {
                                                        setDiscountValue(0);
                                                        calculateTotal(tableData, 0, discountType);
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    setDiscountValue(newValue);
                                                    calculateTotal(tableData, newValue || 0, discountType);
                                                }}
                                                style={{ width: 120 }}
                                                prefix={discountType === 'fixed' ? '₹' : ''}
                                                suffix={discountType === 'percentage' ? '%' : ''}
                                            />
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

                        <Form.Item>
                            <Row justify="end" gutter={16} className="mt-2">
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

