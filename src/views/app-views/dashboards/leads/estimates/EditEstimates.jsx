import React, { useState, useEffect } from 'react';
import { Card, Form, Menu, Row, Col, Tag, Input, message, Button, Upload, Select, DatePicker, Modal } from 'antd';
import { DeleteOutlined, CloudUploadOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, FilterOutlined, EditOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { getestimateById, updateestimate } from './estimatesReducer/EstimatesSlice';
import { getcurren } from 'views/app-views/setting/currencies/currenciesSlice/currenciesSlice';
import * as Yup from 'yup';
import { GetLeads } from '../../leads/LeadReducers/LeadSlice';
import { getAllTaxes } from 'views/app-views/setting/tax/taxreducer/taxSlice';

const { Option } = Select;

const EditEstimates = ({ idd, onClose }) => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [selectedTaxDetails, setSelectedTaxDetails] = useState({});

    // console.log("sddsdfsd",idd)

    const user = useSelector((state) => state.user.loggedInUser.username);


    // Get current estimate and currencies from Redux store
    const currentEstimatee = useSelector((state) => state.estimate.estimates || []);


    const currentEstimate = currentEstimatee.find((item) => item.id === idd);

    // console.log("sdfdsf",currentEstimate);

    const { currencies } = useSelector((state) => state.currencies);
    const condata = currencies.data || [];

    const { taxes } = useSelector((state) => state.tax);

    // const subClients = useSelector((state) => state.SubClient);
    // const sub = subClients?.SubClient?.data;

    // const allproject = useSelector((state) => state.Project);
    // const fndrewduxxdaa = allproject.Project.data
    // const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);

    // const client = fnddata?.client;

    // const subClientData = sub?.find((subClient) => subClient?.id === client);


    const { data: Leads, isLoading: isLeadsLoading, error: leadsError } = useSelector((state) => state.Leads.Leads || []);

    const allleads = useSelector((state) => state.Leads);
    const fndrewduxxdaa = allleads.Leads.data
    const fnddata = fndrewduxxdaa?.find((lead) => lead?.id === id);
 // Get leads data and find the selected lead
 const allLeads = useSelector((state) => state.Leads);
 const leadsData = allLeads.Leads.data || [];
 const selectedLead = leadsData?.find((lead) => lead?.id === id);

  const leadTitle = selectedLead?.leadTitle || 'N/A'

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


    // console.log("asdasdsfsdfsddas",leadDetails)

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

    

    const [discountRate, setDiscountRate] = useState(10);
    const [totals, setTotals] = useState({
        subtotal: 0,
        discount: 0,
        totalTax: 0,
        finalTotal: 0,
    });

    // Fetch estimate and currencies data
    useEffect(() => {
        dispatch(getcurren());
        if (id) {
            dispatch(getestimateById(id));
        }
    }, [dispatch]);


    useEffect(() => {
        dispatch(GetLeads());
        dispatch(getAllTaxes());
    }, [dispatch]);


    // Populate form when currentEstimate changes
    useEffect(() => {
        const fetchAndSetEstimateData = async () => {
            if (currentEstimate) {
                try {
                    console.log("Current Estimate:", currentEstimate);

                    // Set basic form fields
                    form.setFieldsValue({
                        valid_till: dayjs(currentEstimate.valid_till),
                        currency: currentEstimate.currency,
                        leadTitle: leadTitle,
                        lead: id,
                        // client: currentEstimate.client,
                        calculatedTax: currentEstimate.calculatedTax,
                        // projectName: fnddata?.project_name
                    });

                    // Parse and set items
                    if (currentEstimate.items) {
                        let parsedItems;
                        try {
                            // Parse items if it's a string
                            parsedItems = typeof currentEstimate.items === 'string' 
                                ? JSON.parse(currentEstimate.items)
                                : currentEstimate.items;
                            
                            console.log("Parsed Items:", parsedItems);

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
                                tax: Number(item.tax_percentage || item.tax) || 0,
                                tax_name: item.tax_name || '',
                                amount: Number(item.final_amount || item.amount) || 0,
                                description: item.description || '',
                                base_amount: Number(item.base_amount) || 0,
                                tax_amount: Number(item.tax_amount) || 0,
                                discount_percentage: Number(item.discount_percentage) || 0,
                                discount_amount: Number(item.discount_amount) || 0
                            }));

                            console.log("Formatted Items:", formattedItems);
                            setTableData(formattedItems);

                            // Set tax details for each item
                            formattedItems.forEach(item => {
                                if (item.tax && item.tax_name) {
                                    setSelectedTaxDetails(prev => ({
                                        ...prev,
                                        [item.id]: {
                                            gstName: item.tax_name,
                                            gstPercentage: item.tax
                                        }
                                    }));
                                }
                            });

                            // Calculate and set totals
                            const subtotal = formattedItems.reduce((sum, item) => 
                                sum + (Number(item.base_amount) || 0), 0);
                            
                            const totalTax = formattedItems.reduce((sum, item) => 
                                sum + (Number(item.tax_amount) || 0), 0);

                            setTotals({
                                subtotal: subtotal,
                                itemDiscount: Number(currentEstimate.discount) || 0,
                                totalTax: totalTax,
                                finalTotal: Number(currentEstimate.total) || 0
                            });

                            // Set discount rate
                            setDiscountRate(Number(currentEstimate.discountRate) || 0);

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
    }, [currentEstimate, form, leadDetails,leadTitle,id]);

    // Add debug logging
    useEffect(() => {
        console.log("Current Table Data:", tableData);
    }, [tableData]);

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

    const calculateSubTotal = () => {
        return tableData.reduce((sum, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const price = parseFloat(row.price) || 0;
            return sum + (quantity * price);
        }, 0);
    };

    // Handle form submission
    const handleFinish = async (values) => {
        try {
            setLoading(true);

            // Convert items array to object with numeric keys
            const formattedItems = tableData.reduce((acc, item, index) => {
                acc[index] = {
                    id: item.id,
                    item: item.item || '',
                    quantity: parseFloat(item.quantity) || 0,
                    price: parseFloat(item.price) || 0,
                    tax: parseFloat(item.tax) || 0,
                    amount: parseFloat(item.amount) || 0,
                    description: item.description || '',
                    tax_name: selectedTaxDetails[item.id]?.gstName || ''
                };
                return acc;
            }, {});

            const subtotal = calculateSubTotal();
            const discountAmount = (subtotal * discountRate) / 100;

            const estimateData = {
                id: idd,
                valid_till: values.valid_till.format('YYYY-MM-DD'),
                currency: values.currency,
                lead: values.lead,
                // client: values.client,
                discount: discountAmount,
                discountRate: discountRate,
                calculatedTax: parseFloat(values.calculatedTax) || 0,
                items: formattedItems, // Now it's an object instead of an array
                tax: parseFloat(totals.totalTax),
                total: parseFloat(totals.finalTotal),
                related_id: id
            };

            await dispatch(updateestimate({
                idd: idd,
                data: estimateData
            })).unwrap();

            message.success('Estimate updated successfully');
            onClose();
            // navigate("/app/dashboards/project/list");
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
            calculateTotal(updatedData, discountRate);
        } else {
            message.warning('At least one item is required');
        }
    };

    const itemsArray = Object.values(currentEstimate.items || {});


    // Handle table data changes
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

                                    {/* <Col span={12}>
                                        <Form.Item
                                            name="client"
                                            label="Client Name"
                                            initialValue={subClientData?.username}
                                            rules={[{ required: true, message: "Please enter the client name" }]}
                                        >
                                            <Input placeholder="Enter client name" disabled />
                                        </Form.Item>
                                       
                                        <Form.Item name="client" initialValue={fnddata?.client} hidden>
                                            <Input type="hidden" />
                                        </Form.Item>
                                    </Col> */}

                                    {/* <Col span={12}>
                                      
                                        <Form.Item
                                            name="projectName"
                                            label="Project Name"
                                            initialValue={fnddata?.project_name}
                                            rules={[{ required: true, message: "Please enter the project name" }]}
                                        >
                                            <Input placeholder="Enter project name" disabled />
                                        </Form.Item>

                                       
                                        <Form.Item name="project" initialValue={fnddata?.id} hidden>
                                            <Input type="hidden" />
                                        </Form.Item>
                                    </Col> */}

                                    <Col span={12}>
                                        <Form.Item
                                            name="calculatedTax"
                                            label="Calculate Tax"
                                            type="number"
                                            rules={[{ required: true, message: "Please enter the Calculate Tax " }]}
                                        >
                                            <Input placeholder="Enter Calculate Tax" />
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

                        <Form.Item>
                            <Row justify="end" gutter={16} cl>
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

