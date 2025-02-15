import React, { useState, useEffect } from 'react';
import { Card, Form, Menu, Row, Col, Tag, Input, message, Button, Upload, Select, DatePicker, Modal } from 'antd';
import {  DeleteOutlined, CloudUploadOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, FilterOutlined, EditOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
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

const EditEstimates = ({ idd,onClose }) => {
    const { id } = useParams(); 
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // console.log("sddsdfsd",idd)

    const user = useSelector((state) => state.user.loggedInUser.username);


    // Get current estimate and currencies from Redux store
    const currentEstimatee  = useSelector((state) => state.estimate.estimates || []);


    const currentEstimate = currentEstimatee.find((item) => item.id === idd);

    // console.log("sdfdsf",currentEstimate);

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

    // Add new state variables
    const [discountType, setDiscountType] = useState("%");
    const [discountValue, setDiscountValue] = useState(0);
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
        if (currentEstimate && leadDetails) {
            form.setFieldsValue({
                valid_till: dayjs(currentEstimate.valid_till),
                currency: currentEstimate.currency,
                lead: leadDetails?.leadTitle || '',
                client: currentEstimate.client,
                calculatedTax: currentEstimate.calculatedTax,
            });
            
            // Convert items object to array if needed
            const itemsArray = Object.values(currentEstimate.items || {});
            setTableData(itemsArray);
        }
    }, [currentEstimate, form, leadDetails]);

    // Calculate totals
    const calculateSubTotal = () => {
        return tableData.reduce((sum, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const price = parseFloat(row.price) || 0;
            return sum + (quantity * price);
        }, 0);
    };

    const calculateTotalTax = () => {
        return tableData.reduce((sum, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const price = parseFloat(row.price) || 0;
            const tax = parseFloat(row.tax) || 0;
            const rowAmount = quantity * price;
            return sum + (rowAmount * (tax / 100));
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

    // Handle form submission
    const handleFinish = async (values) => {
        try {
            setLoading(true);

            // Format items as object with string key-value pairs
            const formattedItems = {};
            tableData.forEach((item, index) => {
                const itemKey = `item_${index + 1}`;
                formattedItems[itemKey] = {
                    id: (index + 1).toString(),
                    item: item.item || '',
                    quantity: (parseFloat(item.quantity) || 0).toString(),
                    price: (parseFloat(item.price) || 0).toString(),
                    tax: (parseFloat(item.tax) || 0).toString(),
                    amount: (parseFloat(item.amount) || 0).toString(),
                    description: item.description || ''
                };
            });

            const subTotal = calculateSubTotal();
            const totalTax = calculateTotalTax();
            const total = subTotal + totalTax;

            const estimateData = {
                valid_till: values.valid_till.format('YYYY-MM-DD'),
                currency: values.currency,
                lead: leadDetails.leadTitle,
                client: values.client,
                calculatedTax: parseFloat(values.calculatedTax) || 0,
                items: formattedItems,
                tax: parseFloat(totalTax.toFixed(2)) || 0,
                total: parseFloat(total.toFixed(2)) || 0,
                related_id: id
            };

            await dispatch(updateestimate({ 
                idd: id, 
                data: estimateData 
            })).unwrap();

            message.success('Estimate updated successfully');
            onClose();
            navigate("/app/dashboards/project/list");
        } catch (error) {
            message.error('Failed to update estimate: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const itemsArray = Object.values(currentEstimate.items || {});


    // Handle table data changes
    const handleTableDataChange = (id, field, value) => {
        if (field === 'delete') {
            if (tableData.length > 1) {
                setTableData(tableData.filter(row => row.id !== id));
            } else {
                message.warning('At least one item is required');
            }
            return;
        }

        if (field === 'add') {
            setTableData([...tableData, {
                id: Date.now(),
                item: "",
                quantity: 1,
                price: "",
                tax: 0,
                amount: "0",
                description: "",
            }]);
            return;
        }

        const updatedData = tableData.map((row) =>
            row.id === id ? { 
                ...row, 
                [field]: field === 'quantity' || field === 'price' || field === 'tax' 
                    ? parseFloat(value) || 0 
                    : value,
                amount: field === 'quantity' || field === 'price' 
                    ? ((parseFloat(field === 'quantity' ? value : row.quantity) || 0) * 
                       (parseFloat(field === 'price' ? value : row.price) || 0)).toString()
                    : row.amount
            } : row
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
        name="lead"
        label="Lead Title"
        rules={[
            {
                required: true,
                message: "Please select a Lead Title"
            }
        ]}
    >
        <Select
            className="w-full"
            placeholder="Select Lead Title"
            disabled
            value={leadDetails?.leadTitle || undefined}
        >
            {Array.isArray(lead) && lead.map((lead) => (
                <Option
                    key={lead.id}
                    value={lead.id}
                >
                    {lead.leadTitle}
                </Option>
            ))}
        </Select>
    </Form.Item>
</Col> 

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
                                        {itemsArray.map((row) => (
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
                                                        <Select
                                                            value={row.tax}
                                                            onChange={(value) => handleTableDataChange(row.id, "tax", value)}
                                                            className="w-full"
                                                            placeholder="Select Tax"
                                                        >
                                                            <Option value="0">No Tax</Option>
                                                            {taxes?.data?.map((tax) => (
                                                                <Option key={tax.id} value={tax.gstPercentage}>
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
                                                            onClick={() => handleTableDataChange(row.id, 'delete', true)}
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
                                <Button className='border-0 text-blue-500' onClick={() => handleTableDataChange(Date.now(), 'add', true)}>
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
                                                        calculateTotal(tableData, parseFloat(e.target.value) || 0);
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

                        <Form.Item>
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

