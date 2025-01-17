import React, { useState, useEffect } from 'react';
import { Card, Form, Menu, Row, Col, Tag, Input, message, Button, Upload, Select, DatePicker, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, CloudUploadOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, FilterOutlined, EditOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { getallcurrencies } from '../../../setting/currencies/currenciesreducer/currenciesSlice';
import OrderListData from 'assets/data/order-list.data.json';
import Flex from 'components/shared-components/Flex';
import { Getmins } from '../../../dashboards/project/milestone/minestoneReducer/minestoneSlice';
import { useSelector, useDispatch } from 'react-redux';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
import { createInvoice } from '../../../dashboards/project/invoice/invoicereducer/InvoiceSlice';
import * as Yup from 'yup';

const { Option } = Select;

const AddInvoice = ({ onClose }) => {

    const { id } = useParams();
    const [discountType, setDiscountType] = useState("%");
    const [loading, setLoading] = useState(false);
    const [discountValue, setDiscountValue] = useState(0);
    const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
    const [list, setList] = useState(OrderListData)
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [showFields, setShowFields] = useState(false);
    const { data: milestones } = useSelector((state) => state.Milestone.Milestone);


    // const [selectedProject, setSelectedProject] = useState(null);
    // const [clientOptions, setClientOptions] = useState([]);

    const { currencies } = useSelector((state) => state.currencies);
    const [discountRate, setDiscountRate] = useState(10);
    const dispatch = useDispatch();


    const subClients = useSelector((state) => state.SubClient);
const sub = subClients?.SubClient?.data;

    const allproject = useSelector((state) => state.Project);
    const fndrewduxxdaa = allproject.Project.data
    const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);
    
    const client = fnddata?.client;
    
    const subClientData = sub?.find((subClient) => subClient?.id === client);


    // console.log("SubClient Data:", subClientData.username);

    // const { subClients } = useSelector((state) => state.SubClient.SubClient.data); 

    const [form] = Form.useForm();
    const [totals, setTotals] = useState({
        subtotal: 0,
        discount: 0,
        totalTax: 0,
        finalTotal: 0,
    });

  


    //   const handleProjectChange = (projectId) => {
    //     setSelectedProject(projectId);
    
    //     // Find associated clients for the selected project
    //     const relatedClients = subClients.filter(
    //       (client) => client.projectId === projectId
    //     );
    
    //     // Update client dropdown options
    //     setClientOptions(relatedClients);
    //   };



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

    // Fetch currencies
    useEffect(() => {
        dispatch(getallcurrencies());
    }, [dispatch]);


    // Fetch milestones when product changes
    useEffect(() => {
        dispatch(Getmins(id));
    }, [dispatch]);


    // Handle product selection
    const handleProductChange = (value) => {
        setSelectedProduct(value);
        setSelectedMilestone(null); // Reset milestone selection
        setTableData([{  // Reset table data
            id: Date.now(),
            item: "",
            quantity: 1,
            price: "",
            tax: 0,
            amount: "0",
            description: "",
        }]);
    };
    // Handle milestone selection
    const handleMilestoneChange = (value) => {
        const selectedMile = milestones?.find(m => m.id === value);
        setSelectedMilestone(value);

        if (selectedMile) {
            // Update table data with milestone information
            setTableData([
                {
                    id: Date.now(),
                    item: selectedMile.milestone_title,
                    quantity: 1,
                    price: selectedMile.milestone_cost,
                    tax: 0,
                    amount: selectedMile.milestone_cost.toString(),
                    description: selectedMile.milestone_summary
                }
            ]);
        }
    };


    const handleFinish = async (values) => {
        try {
            setLoading(true);

            const subTotal = calculateSubTotal();
            const totalTax = calculateTotalTax();
            // const discount = calculateDiscount();
            // const totalAmount = calculateTotal();
            const discount = (subTotal * discountRate) / 100; // Discount calculation
            const totalAmount = subTotal - discount + totalTax; // Final total calculation

            const invoiceData = {
                product_id: id,
                issueDate: values.issueDate.format('YYYY-MM-DD'),
                dueDate: values.dueDate.format('YYYY-MM-DD'),
                currency: values.currency,
                client: values.client,
                project: values.project,
                tax_calculation: values.calctax,
                items: tableData.map(item => ({
                    description: item.item,
                    quantity: parseFloat(item.quantity),
                    price: parseFloat(item.price),
                    tax: parseFloat(item.tax),
                    amount: parseFloat(item.amount),
                    description: item.description
                })),
                sub_total: subTotal.toFixed(2),
                discount: discount.toFixed(2),
                total_tax: totalTax.toFixed(2),
                total: totalAmount.toFixed(2),
                status: 'pending'
            };

            // console.log('Invoice Data:', invoiceData);

            // Dispatch create invoice action
            const result = await dispatch(createInvoice({ id, invoiceData })).unwrap();

            if (result) {
                message.success('Invoice created successfully');
                form.resetFields();
                onClose();
            }
        } catch (error) {
            message.error('Failed to create invoice: ' + error.message);
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

        const initialValues = {
            issueDate: null,
            dueDate: null,
            currency: '',
            client: fnddata?.client || "",
            project: fnddata?.id || "",
            calctax: '',
        };

    const validationSchema = Yup.object({
        issueDate: Yup.date().nullable().required('Invoice Date is required.'),
        dueDate: Yup.date().nullable().required('Due Date is required.'),
        currency: Yup.string().required('Please select currency.'),
        client: Yup.string().required('Please enter client name.'),
        project: Yup.string().required('Please enter project name.'),
        calctax: Yup.string().required('Please select tax.'),
    });


    return (
        <>
            <div>
                <div className=' ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
                    <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                validationSchema={validationSchema}

                initialValues={initialValues}

                        // initialValues={{
                        //     loginEnabled: true,
                        // }}
                    >
                        {/* <Card className="border-0 mt-2"> */}
                        <div className="">
                            <div className=" p-2">
                                {/* <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={onSubmit}
                                >
                                    {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                                        <Form className="formik-form" onSubmit={handleSubmit}>
                                            <Row gutter={16}>

                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Invoice Date</label>
                                                        <DatePicker
                                                            className="w-full"
                                                            format="DD-MM-YYYY"
                                                            name="invoicedate"
                                                            value={values.invoicedate}
                                                            onChange={(invoicedate) => setFieldValue('invoicedate', invoicedate)}
                                                            onBlur={() => setFieldTouched("invoicedate", true)}
                                                        />
                                                        <ErrorMessage name="invoicedate" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Due Date</label>
                                                        <DatePicker
                                                            className="w-full"
                                                            format="DD-MM-YYYY"
                                                            name="duedate"
                                                            value={values.duedate}
                                                            onChange={(duedate) => setFieldValue('duedate', duedate)}
                                                            onBlur={() => setFieldTouched("duedate", true)}
                                                        />
                                                        <ErrorMessage name="duedate" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={12} className="mt-4">
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Currency</label>
                                                        <div className="flex gap-2">
                                                            <Field name="currency">
                                                                {({ field, form }) => (
                                                                    <Select
                                                                        {...field}
                                                                        className="w-full"
                                                                        placeholder="Select Currency"
                                                                        onChange={(value) => {
                                                                            const selectedCurrency = currencies.find(c => c.id === value);
                                                                            form.setFieldValue("currency", selectedCurrency?.currencyCode || '');
                                                                        }}
                                                                    >
                                                                        {currencies?.map((currency) => (
                                                                            <Option
                                                                                key={currency.id}
                                                                                value={currency.id}
                                                                            >
                                                                                {currency.currencyCode}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                )}
                                                            </Field>
                                                        </div>
                                                        <ErrorMessage
                                                            name="currency"
                                                            component="div"
                                                            className="error-message text-red-500 my-1"
                                                        />
                                                    </div>
                                                </Col>

                                                <Col span={12} className='mt-4'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Client</label>
                                                        <Field name="client" as={Input} placeholder="Enter Client Name" />
                                                        <ErrorMessage name="client" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={12} className='mt-4'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Project</label>
                                                        <Field name="project" as={Input} placeholder="Website Copier Project" />
                                                        <ErrorMessage name="project" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={12} className='mt-4'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Calculate Tax</label>
                                                        <Field name="calctax">
                                                            {({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    className="w-full"
                                                                    placeholder="Select Tax"
                                                                    onChange={(value) => setFieldValue('calctax', value)}
                                                                    value={values.calctax}
                                                                    onBlur={() => setFieldTouched("calctax", true)}
                                                                >
                                                                    <Option value="after">After Discount</Option>
                                                                    <Option value="before">Before Discount</Option>
                                                                </Select>
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name="calctax" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                            </Row>
                                        </Form>
                                    )}
                                </Formik> */}

                                {/* <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} /> */}

                                <Row gutter={16}>

                                    <Col span={12}>
                                        <Form.Item
                                            name="issueDate"
                                            label="Issue Date"
                                            rules={[{ required: true, message: "Please select the issue date" }]}
                                        >
                                            <DatePicker className="w-full" format="DD-MM-YYYY" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="dueDate"
                                            label="Due Date"
                                            rules={[{ required: true, message: "Please select the due date" }]}
                                        >
                                            <DatePicker className="w-full" format="DD-MM-YYYY" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="currency"
                                            label="Currency"
                                            rules={[{ required: true, message: "Please select a currency" }]}
                                        >
                                            <Select
                                                className="w-full mt-2"
                                                placeholder="Select Currency"
                                                onChange={(value) => {
                                                    const selectedCurrency = currencies.find(c => c.id === value);
                                                    form.setFieldValue("currency", selectedCurrency?.currencyCode || '');
                                                }}
                                            >
                                                {currencies?.map((currency) => (
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
        name="clientName"
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
                                            name="calctax"
                                            label="Calculate Tax"
                                            rules={[{ required: true, message: "Please select a tax calculation method" }]}
                                        >
                                            <Select placeholder="Select Tax Calculation Method">
                                                <Option value="after">After Discount</Option>
                                                <Option value="before">Before Discount</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* <Form.Item>
                                        <Row justify="end" gutter={16}>
                                            <Col>
                                                <Button onClick={() => navigate("/app/dashboards/project/list")}>Cancel</Button>
                                            </Col>
                                            <Col>
                                                <Button type="primary" htmlType="submit">
                                                    Create
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Item> */}
                                {/* </Form> */}
                            </div>
                        </div>
                        {/* </Card> */}

                        {/* <Card> */}
                        <div>
                            <div className="overflow-x-auto">
                                <Flex alignItems="center" mobileFlex={false} className='flex mb-4 gap-4'>
                                    <Flex className="flex " mobileFlex={false}>
                                        <div className="w-full flex gap-4">
                                            <div>
                                                <Select
                                                    value={selectedProduct}
                                                    onChange={handleProductChange}
                                                    className="w-full !rounded-none"
                                                    placeholder="Select Product"
                                                    rootClassName="!rounded-none"
                                                >
                                                    <Option value="smart_speakers">Smart Speakers</Option>
                                                    <Option value="electric_kettle">Electric Kettle</Option>
                                                    <Option value="headphones">Headphones</Option>
                                                </Select>
                                            </div>

                                        </div>

                                    </Flex>
                                    <Flex gap="7px" className="flex">
                                        <div className="w-full flex gap-4">
                                            <div>
                                                <Select
                                                    value={selectedMilestone}
                                                    onChange={handleMilestoneChange}
                                                    className="w-full !rounded-none"
                                                    placeholder="Select Milestone"
                                                    rootClassName="!rounded-none"
                                                    loading={loading}
                                                >
                                                    {milestones?.map((milestone) => (
                                                        <Option key={milestone.id} value={milestone.id}>
                                                            {milestone.milestone_title}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    </Flex>
                                </Flex>

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

                                    {/* Terms and Conditions */}
                                </table>
                            </div>
                            <div className="pt-4 text-right">
                                <h3 className="font-medium">Terms and Conditions</h3>
                                <p className="text-sm text-gray-600">Thank you for your business.</p>
                            </div>
                            <div className='mt-4'>
                                <span className='block mb-2'>Add File</span>
                                <Col span={24} >
                                    <Upload
                                        action="http://localhost:5500/api/users/upload-cv"
                                        listType="picture"
                                        accept=".pdf"
                                        maxCount={1}
                                        showUploadList={{ showRemoveIcon: true }}
                                        className='border-2 flex justify-center items-center p-10'

                                    >
                                        <span className='text-xl'>Choose File</span>
                                        {/* <CloudUploadOutlined className='text-4xl' /> */}
                                    </Upload>
                                </Col>
                            </div>
                        </div>

                        {/* <div className='mt-4'>
                            <Checkbox onChange={handleCheckboxChange}>
                                I Have Received Payment
                            </Checkbox>

                            {showFields && (
                                <div style={{ marginTop: '20px' }}>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <label>Payment Gateway</label>
                                            <Select placeholder="Select an option" className="w-full">
                                                <Option value="--">--</Option>
                                                <Option value="offline">Offline Payment</Option>
                                                <Option value="online">Online Payment</Option>
                                            </Select>
                                        </Col>
                                        <Col span={12}>
                                            <label>Transaction ID</label>
                                            <Input placeholder="Enter Transaction ID" />
                                        </Col>

                                    </Row>
                                </div>
                            )}
                        </div> */}

                        {/* </Card> */}

                        {/* <div className="form-buttons text-right">
                        <Button type="default" className="mr-2" onClick={() => navigate('/app/dashboards/project/list')}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Create</Button>
                    </div> */}
                        <Form.Item>
                            <Row justify="end" gutter={16}>
                                <Col>
                                    <Button onClick={onClose}>Cancel</Button>
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
            {/* <Modal
                title="Product Create"
                visible={isAddProductModalVisible}
                onCancel={closeAddProductModal}
                footer={null}
                width={1000}
                className='mt-[-70px]'
            >
                <AddProduct onClose={closeAddProductModal} />
            </Modal> */}
        </>
    );
};

export default AddInvoice;










// import React, { useState, useEffect } from 'react';
// import { Card, Form, Menu, Row, Col, Tag, Input, message, Button, Upload, Select, DatePicker, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, CloudUploadOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, FilterOutlined, EditOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import 'react-quill/dist/quill.snow.css';
// import { getallcurrencies } from '../../../setting/currencies/currenciesreducer/currenciesSlice';
// import OrderListData from 'assets/data/order-list.data.json';
// import Flex from 'components/shared-components/Flex';
// import { Getmins } from '../../../dashboards/project/milestone/minestoneReducer/minestoneSlice';
// import { useSelector, useDispatch } from 'react-redux';
// // import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { createInvoice } from '../../../dashboards/project/invoice/invoicereducer/InvoiceSlice';
// import * as Yup from 'yup';

// const { Option } = Select;

// const AddInvoice = ({ onClose }) => {

//     const { id } = useParams();
//     const [discountType, setDiscountType] = useState("%");
//     const [loading, setLoading] = useState(false);
//     const [discountValue, setDiscountValue] = useState(0);
//     const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
//     const [list, setList] = useState(OrderListData)
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [selectedMilestone, setSelectedMilestone] = useState(null);
//     const [showFields, setShowFields] = useState(false);
//     const { data: milestones } = useSelector((state) => state.Milestone.Milestone);
//     const { currencies } = useSelector((state) => state.currencies);
//     const [discountRate, setDiscountRate] = useState(10);
//     const dispatch = useDispatch();
//     const [form] = Form.useForm();
//     const [totals, setTotals] = useState({
//         subtotal: 0,
//         discount: 0,
//         totalTax: 0,
//         finalTotal: 0,
//     });


//     const [tableData, setTableData] = useState([
//         {
//             id: Date.now(),
//             item: "",
//             quantity: 1,
//             price: "",
//             tax: 0,
//             amount: "0",
//             description: "",
//         }
//     ]);

//     // Fetch currencies
//     useEffect(() => {
//         dispatch(getallcurrencies());
//     }, [dispatch]);


//     // Fetch milestones when product changes
//     useEffect(() => {
//         dispatch(Getmins(id));
//     }, [dispatch]);


//     // Handle product selection
//     const handleProductChange = (value) => {
//         setSelectedProduct(value);
//         setSelectedMilestone(null); // Reset milestone selection
//         setTableData([{  // Reset table data
//             id: Date.now(),
//             item: "",
//             quantity: 1,
//             price: "",
//             tax: 0,
//             amount: "0",
//             description: "",
//         }]);
//     };
//     // Handle milestone selection
//     const handleMilestoneChange = (value) => {
//         const selectedMile = milestones?.find(m => m.id === value);
//         setSelectedMilestone(value);

//         if (selectedMile) {
//             // Update table data with milestone information
//             setTableData([
//                 {
//                     id: Date.now(),
//                     item: selectedMile.milestone_title,
//                     quantity: 1,
//                     price: selectedMile.milestone_cost,
//                     tax: 0,
//                     amount: selectedMile.milestone_cost.toString(),
//                     description: selectedMile.milestone_summary
//                 }
//             ]);
//         }
//     };


//     const handleFinish = async (values) => {
//         try {
//             setLoading(true);

//             const subTotal = calculateSubTotal();
//             const totalTax = calculateTotalTax();
//             // const discount = calculateDiscount();
//             // const totalAmount = calculateTotal();
//             const discount = (subTotal * discountRate) / 100; // Discount calculation
//             const totalAmount = subTotal - discount + totalTax; // Final total calculation

//             const invoiceData = {
//                 product_id: id,
//                 issueDate: values.issueDate.format('YYYY-MM-DD'),
//                 dueDate: values.dueDate.format('YYYY-MM-DD'),
//                 currency: values.currency,
//                 client: values.client,
//                 project: values.project,
//                 tax_calculation: values.calctax,
//                 items: tableData.map(item => ({
//                     description: item.item,
//                     quantity: parseFloat(item.quantity),
//                     price: parseFloat(item.price),
//                     tax: parseFloat(item.tax),
//                     amount: parseFloat(item.amount),
//                     description: item.description
//                 })),
//                 sub_total: subTotal.toFixed(2),
//                 discount: discount.toFixed(2),
//                 total_tax: totalTax.toFixed(2),
//                 total: totalAmount.toFixed(2),
//                 status: 'pending'
//             };

//             console.log('Invoice Data:', invoiceData);

//             // Dispatch create invoice action
//             const result = await dispatch(createInvoice({ id, invoiceData })).unwrap();

//             if (result) {
//                 message.success('Invoice created successfully');
//                 form.resetFields();
//                 navigate('/app/dashboards/project/list');
//             }
//         } catch (error) {
//             message.error('Failed to create invoice: ' + error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

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
//             isNew: false,
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
//                 isNew: true,
//             },
//         ]);
//     };

//     // Delete row
//     const handleDeleteRow = (id) => {
//         if (rows.length > 1) {
//             setRows(rows.filter(row => row.id !== id));
//         } else {
//             message.warning('At least one item is required');
//         }
//     };

//     const navigate = useNavigate();


//     // Calculate discount amount
//     const calculateDiscount = () => {
//         const subTotal = calculateSubTotal();
//         if (discountType === '%') {
//             return subTotal * (parseFloat(discountValue) || 0) / 100;
//         }
//         return parseFloat(discountValue) || 0;
//     };

//     // Calculate total tax
//     const calculateTotalTax = () => {
//         const subTotal = calculateSubTotal();
//         const discount = calculateDiscount();
//         const taxableAmount = form.getFieldValue('calctax') === 'before'
//             ? subTotal
//             : (subTotal - discount);

//         return tableData.reduce((sum, row) => {
//             const quantity = parseFloat(row.quantity) || 0;
//             const price = parseFloat(row.price) || 0;
//             const tax = parseFloat(row.tax) || 0;
//             const rowAmount = quantity * price;
//             return sum + (rowAmount * (tax / 100));
//         }, 0);
//     };

//     // Calculate subtotal (sum of all row amounts before discount)
//     const calculateSubTotal = () => {
//         return rows.reduce((sum, row) => {
//             const quantity = parseFloat(row.quantity || 0);
//             const price = parseFloat(row.price || 0);
//             return sum + (quantity * price);
//         }, 0);
//     };


//     const calculateTotal = (data, discountRate) => {
//         let subtotal = 0;
//         let totalTax = 0;

//         data.forEach((row) => {
//             const amount = row.quantity * row.price;
//             const taxAmount = (amount * row.tax) / 100;

//             row.amount = amount; // Update the row's amount
//             subtotal += amount;
//             totalTax += taxAmount;
//         });

//         const discount = (subtotal * discountRate) / 100;
//         const finalTotal = subtotal - discount + totalTax;

//         setTotals({ subtotal, discount, totalTax, finalTotal });
//     };

//     const handleTableDataChange = (id, field, value) => {
//         const updatedData = tableData.map((row) =>
//             row.id === id ? { ...row, [field]: field === 'quantity' || field === 'price' || field === 'tax' ? parseFloat(value) || 0 : value } : row
//         );

//         setTableData(updatedData);
//         calculateTotal(updatedData, discountRate); // Recalculate totals
//     };

//     const initialValues = {
//         issueDate: null,
//         dueDate: null,
//         currency: '',
//         client: '',
//         project: '',
//         calctax: '',
//     };

//     const validationSchema = Yup.object({
//         issueDate: Yup.date().nullable().required('Invoice Date is required.'),
//         dueDate: Yup.date().nullable().required('Due Date is required.'),
//         currency: Yup.string().required('Please select currency.'),
//         client: Yup.string().required('Please enter client name.'),
//         project: Yup.string().required('Please enter project name.'),
//         calctax: Yup.string().required('Please select tax.'),
//     });


//     return (
//         <>
//             <div>
//                 <div className=' ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
//                     <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
//                     <Form
//                         form={form}
//                         layout="vertical"
//                         onFinish={handleFinish}
//                         initialValues={{
//                             loginEnabled: true,
//                         }}
//                     >
//                         {/* <Card className="border-0 mt-2"> */}
//                         <div className="">
//                             <div className=" p-2">
//                                 {/* <Formik
//                                     initialValues={initialValues}
//                                     validationSchema={validationSchema}
//                                     onSubmit={onSubmit}
//                                 >
//                                     {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
//                                         <Form className="formik-form" onSubmit={handleSubmit}>
//                                             <Row gutter={16}>

//                                                 <Col span={12} className='mt-2'>
//                                                     <div className="form-item">
//                                                         <label className='font-semibold mb-2'>Invoice Date</label>
//                                                         <DatePicker
//                                                             className="w-full"
//                                                             format="DD-MM-YYYY"
//                                                             name="invoicedate"
//                                                             value={values.invoicedate}
//                                                             onChange={(invoicedate) => setFieldValue('invoicedate', invoicedate)}
//                                                             onBlur={() => setFieldTouched("invoicedate", true)}
//                                                         />
//                                                         <ErrorMessage name="invoicedate" component="div" className="error-message text-red-500 my-1" />
//                                                     </div>
//                                                 </Col>
//                                                 <Col span={12} className='mt-2'>
//                                                     <div className="form-item">
//                                                         <label className='font-semibold mb-2'>Due Date</label>
//                                                         <DatePicker
//                                                             className="w-full"
//                                                             format="DD-MM-YYYY"
//                                                             name="duedate"
//                                                             value={values.duedate}
//                                                             onChange={(duedate) => setFieldValue('duedate', duedate)}
//                                                             onBlur={() => setFieldTouched("duedate", true)}
//                                                         />
//                                                         <ErrorMessage name="duedate" component="div" className="error-message text-red-500 my-1" />
//                                                     </div>
//                                                 </Col>
//                                                 <Col span={12} className="mt-4">
//                                                     <div className="form-item">
//                                                         <label className='font-semibold mb-2'>Currency</label>
//                                                         <div className="flex gap-2">
//                                                             <Field name="currency">
//                                                                 {({ field, form }) => (
//                                                                     <Select
//                                                                         {...field}
//                                                                         className="w-full"
//                                                                         placeholder="Select Currency"
//                                                                         onChange={(value) => {
//                                                                             const selectedCurrency = currencies.find(c => c.id === value);
//                                                                             form.setFieldValue("currency", selectedCurrency?.currencyCode || '');
//                                                                         }}
//                                                                     >
//                                                                         {currencies?.map((currency) => (
//                                                                             <Option
//                                                                                 key={currency.id}
//                                                                                 value={currency.id}
//                                                                             >
//                                                                                 {currency.currencyCode}
//                                                                             </Option>
//                                                                         ))}
//                                                                     </Select>
//                                                                 )}
//                                                             </Field>
//                                                         </div>
//                                                         <ErrorMessage
//                                                             name="currency"
//                                                             component="div"
//                                                             className="error-message text-red-500 my-1"
//                                                         />
//                                                     </div>
//                                                 </Col>

//                                                 <Col span={12} className='mt-4'>
//                                                     <div className="form-item">
//                                                         <label className='font-semibold mb-2'>Client</label>
//                                                         <Field name="client" as={Input} placeholder="Enter Client Name" />
//                                                         <ErrorMessage name="client" component="div" className="error-message text-red-500 my-1" />
//                                                     </div>
//                                                 </Col>
//                                                 <Col span={12} className='mt-4'>
//                                                     <div className="form-item">
//                                                         <label className='font-semibold mb-2'>Project</label>
//                                                         <Field name="project" as={Input} placeholder="Website Copier Project" />
//                                                         <ErrorMessage name="project" component="div" className="error-message text-red-500 my-1" />
//                                                     </div>
//                                                 </Col>
//                                                 <Col span={12} className='mt-4'>
//                                                     <div className="form-item">
//                                                         <label className='font-semibold mb-2'>Calculate Tax</label>
//                                                         <Field name="calctax">
//                                                             {({ field }) => (
//                                                                 <Select
//                                                                     {...field}
//                                                                     className="w-full"
//                                                                     placeholder="Select Tax"
//                                                                     onChange={(value) => setFieldValue('calctax', value)}
//                                                                     value={values.calctax}
//                                                                     onBlur={() => setFieldTouched("calctax", true)}
//                                                                 >
//                                                                     <Option value="after">After Discount</Option>
//                                                                     <Option value="before">Before Discount</Option>
//                                                                 </Select>
//                                                             )}
//                                                         </Field>
//                                                         <ErrorMessage name="calctax" component="div" className="error-message text-red-500 my-1" />
//                                                     </div>
//                                                 </Col>

//                                             </Row>
//                                         </Form>
//                                     )}
//                                 </Formik> */}

//                                 {/* <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} /> */}

//                                 <Row gutter={16}>

//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="issueDate"
//                                             label="Issue Date"
//                                             rules={[{ required: true, message: "Please select the issue date" }]}
//                                         >
//                                             <DatePicker className="w-full" format="DD-MM-YYYY" />
//                                         </Form.Item>
//                                     </Col>

//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="dueDate"
//                                             label="Due Date"
//                                             rules={[{ required: true, message: "Please select the due date" }]}
//                                         >
//                                             <DatePicker className="w-full" format="DD-MM-YYYY" />
//                                         </Form.Item>
//                                     </Col>

//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="currency"
//                                             label="Currency"
//                                             rules={[{ required: true, message: "Please select a currency" }]}
//                                         >
//                                             <Select
//                                                 className="w-full mt-2"
//                                                 placeholder="Select Currency"
//                                                 onChange={(value) => {
//                                                     const selectedCurrency = currencies.find(c => c.id === value);
//                                                     form.setFieldValue("currency", selectedCurrency?.currencyCode || '');
//                                                 }}
//                                             >
//                                                 {currencies?.map((currency) => (
//                                                     <Option
//                                                         key={currency.id}
//                                                         value={currency.id}
//                                                     >
//                                                         {currency.currencyCode}
//                                                     </Option>
//                                                 ))}
//                                             </Select>
//                                         </Form.Item>
//                                     </Col>
//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="client"
//                                             label="Client Name"
//                                             rules={[{ required: true, message: "Please enter the client name" }]}
//                                         >
//                                             <Input placeholder="Enter client name" />
//                                         </Form.Item>
//                                     </Col>

//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="project"
//                                             label="Project"
//                                             rules={[{ required: true, message: "Please enter the project name" }]}
//                                         >
//                                             <Input placeholder="Enter project name" />
//                                         </Form.Item>
//                                     </Col>

//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="calctax"
//                                             label="Calculate Tax"
//                                             rules={[{ required: true, message: "Please select a tax calculation method" }]}
//                                         >
//                                             <Select placeholder="Select Tax Calculation Method">
//                                                 <Option value="after">After Discount</Option>
//                                                 <Option value="before">Before Discount</Option>
//                                             </Select>
//                                         </Form.Item>
//                                     </Col>
//                                 </Row>

//                                 {/* <Form.Item>
//                                         <Row justify="end" gutter={16}>
//                                             <Col>
//                                                 <Button onClick={() => navigate("/app/dashboards/project/list")}>Cancel</Button>
//                                             </Col>
//                                             <Col>
//                                                 <Button type="primary" htmlType="submit">
//                                                     Create
//                                                 </Button>
//                                             </Col>
//                                         </Row>
//                                     </Form.Item> */}
//                                 {/* </Form> */}
//                             </div>
//                         </div>
//                         {/* </Card> */}

//                         {/* <Card> */}
//                         <div>
//                             <div className="overflow-x-auto">
//                                 <Flex alignItems="center" mobileFlex={false} className='flex mb-4 gap-4'>
//                                     <Flex className="flex " mobileFlex={false}>
//                                         <div className="w-full flex gap-4">
//                                             <div>
//                                                 <Select
//                                                     value={selectedProduct}
//                                                     onChange={handleProductChange}
//                                                     className="w-full !rounded-none"
//                                                     placeholder="Select Product"
//                                                     rootClassName="!rounded-none"
//                                                 >
//                                                     <Option value="smart_speakers">Smart Speakers</Option>
//                                                     <Option value="electric_kettle">Electric Kettle</Option>
//                                                     <Option value="headphones">Headphones</Option>
//                                                 </Select>
//                                             </div>

//                                         </div>

//                                     </Flex>
//                                     <Flex gap="7px" className="flex">
//                                         <div className="w-full flex gap-4">
//                                             <div>
//                                                 <Select
//                                                     value={selectedMilestone}
//                                                     onChange={handleMilestoneChange}
//                                                     className="w-full !rounded-none"
//                                                     placeholder="Select Milestone"
//                                                     rootClassName="!rounded-none"
//                                                     loading={loading}
//                                                 >
//                                                     {milestones?.map((milestone) => (
//                                                         <Option key={milestone.id} value={milestone.id}>
//                                                             {milestone.milestone_title}
//                                                         </Option>
//                                                     ))}
//                                                 </Select>
//                                             </div>
//                                         </div>
//                                     </Flex>
//                                 </Flex>

//                                 <table className="w-full border border-gray-200 bg-white">
//                                     <thead className="bg-gray-100">
//                                         <tr>
//                                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                                 Description<span className="text-red-500">*</span>
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                                 Quantity<span className="text-red-500">*</span>
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                                 Unit Price <span className="text-red-500">*</span>
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                                 TAX (%)
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                                 Amount<span className="text-red-500">*</span>
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {tableData.map((row) => (
//                                             <React.Fragment key={row.id}>
//                                                 <tr>
//                                                     <td className="px-4 py-2 border-b">
//                                                         <input
//                                                             type="text"
//                                                             value={row.item}
//                                                             onChange={(e) => handleTableDataChange(row.id, 'item', e.target.value)}
//                                                             placeholder="Item Name"
//                                                             className="w-full p-2 border rounded-s"
//                                                         />
//                                                     </td>
//                                                     <td className="px-4 py-2 border-b">
//                                                         <input
//                                                             type="number"
//                                                             value={row.quantity}
//                                                             onChange={(e) => handleTableDataChange(row.id, 'quantity', e.target.value)}
//                                                             placeholder="Qty"
//                                                             className="w-full p-2 border rounded"
//                                                         />
//                                                     </td>
//                                                     <td className="px-4 py-2 border-b">
//                                                         <input
//                                                             type="number"
//                                                             value={row.price}
//                                                             onChange={(e) => handleTableDataChange(row.id, 'price', e.target.value)}
//                                                             placeholder="Price"
//                                                             className="w-full p-2 border rounded-s"
//                                                         />
//                                                     </td>
//                                                     <td className="px-4 py-2 border-b">
//                                                         <select
//                                                             value={row.tax}
//                                                             onChange={(e) => handleTableDataChange(row.id, 'tax', e.target.value)}
//                                                             className="w-full p-2 border"
//                                                         >
//                                                             <option value="0">Nothing Selected</option>
//                                                             <option value="10">GST:10%</option>
//                                                             <option value="18">CGST:18%</option>
//                                                             <option value="10">VAT:10%</option>
//                                                             <option value="10">IGST:10%</option>
//                                                             <option value="10">UTGST:10%</option>
//                                                         </select>
//                                                     </td>
//                                                     <td className="px-4 py-2 border-b">
//                                                         <span>{row.amount}</span>
//                                                     </td>
//                                                     <td className="px-2 py-1 border-b text-center">
//                                                         <Button
//                                                             danger
//                                                             onClick={() => handleDeleteRow(row.id)}
//                                                         >
//                                                             <DeleteOutlined />
//                                                         </Button>
//                                                     </td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td colSpan={6} className="px-4 py-2 border-b">
//                                                         <textarea
//                                                             rows={2}
//                                                             value={row.description}
//                                                             onChange={(e) => handleTableDataChange(row.id, 'description', e.target.value)}
//                                                             placeholder="Description"
//                                                             className="w-[70%] p-2 border"
//                                                         />
//                                                     </td>
//                                                 </tr>
//                                             </React.Fragment>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className="form-buttons text-left mt-2">
//                                 <Button className='border-0 text-blue-500' onClick={handleAddRow}>
//                                     <PlusOutlined />  Add Items
//                                 </Button>
//                             </div>

//                             {/* Summary Section */}
//                             <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
//                                 <table className='w-full lg:w-[50%] p-2'>
//                                     {/* Sub Total */}
//                                     <tr className="flex justify-between px-2 py-2 border-x-2">
//                                         <td className="font-medium">Sub Total</td>
//                                         <td className="font-medium px-4 py-2">
//                                             ₹{totals.subtotal.toFixed(2)}
//                                         </td>
//                                     </tr>

//                                     {/* Discount */}
//                                     <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
//                                         <td className="font-medium">Discount</td>
//                                         <td className='flex items-center space-x-2'>
//                                             <div className="mb-4">
//                                                 <label className="block text-sm font-medium text-gray-700">
//                                                     Discount Rate (%)
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     value={discountRate}
//                                                     onChange={(e) => {
//                                                         setDiscountRate(parseFloat(e.target.value) || 0);
//                                                         calculateTotal(tableData, parseFloat(e.target.value) || 0); // Recalculate with new discount rate
//                                                     }}
//                                                     className="mt-1 block w-full p-2 border rounded"
//                                                 />
//                                             </div>
//                                         </td>
//                                     </tr>

//                                     {/* Tax */}
//                                     <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
//                                         <td className="font-medium">Total Tax</td>
//                                         <td className="font-medium px-4 py-2">
//                                             ₹{totals.totalTax.toFixed(2)}
//                                         </td>
//                                     </tr>

//                                     {/* Total */}
//                                     <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
//                                         <td className="font-bold text-lg">Total Amount</td>
//                                         <td className="font-bold text-lg px-4">
//                                             ₹{totals.finalTotal.toFixed(2)}
//                                         </td>
//                                     </tr>

//                                     {/* Terms and Conditions */}
//                                 </table>
//                             </div>
//                             <div className="pt-4 text-right">
//                                 <h3 className="font-medium">Terms and Conditions</h3>
//                                 <p className="text-sm text-gray-600">Thank you for your business.</p>
//                             </div>
//                             <div className='mt-4'>
//                                 <span className='block mb-2'>Add File</span>
//                                 <Col span={24} >
//                                     <Upload
//                                         action="http://localhost:5500/api/users/upload-cv"
//                                         listType="picture"
//                                         accept=".pdf"
//                                         maxCount={1}
//                                         showUploadList={{ showRemoveIcon: true }}
//                                         className='border-2 flex justify-center items-center p-10'

//                                     >
//                                         <span className='text-xl'>Choose File</span>
//                                         {/* <CloudUploadOutlined className='text-4xl' /> */}
//                                     </Upload>
//                                 </Col>
//                             </div>
//                         </div>

//                         {/* <div className='mt-4'>
//                             <Checkbox onChange={handleCheckboxChange}>
//                                 I Have Received Payment
//                             </Checkbox>

//                             {showFields && (
//                                 <div style={{ marginTop: '20px' }}>
//                                     <Row gutter={16}>
//                                         <Col span={12}>
//                                             <label>Payment Gateway</label>
//                                             <Select placeholder="Select an option" className="w-full">
//                                                 <Option value="--">--</Option>
//                                                 <Option value="offline">Offline Payment</Option>
//                                                 <Option value="online">Online Payment</Option>
//                                             </Select>
//                                         </Col>
//                                         <Col span={12}>
//                                             <label>Transaction ID</label>
//                                             <Input placeholder="Enter Transaction ID" />
//                                         </Col>

//                                     </Row>
//                                 </div>
//                             )}
//                         </div> */}

//                         {/* </Card> */}

//                         {/* <div className="form-buttons text-right">
//                         <Button type="default" className="mr-2" onClick={() => navigate('/app/dashboards/project/list')}>Cancel</Button>
//                         <Button type="primary" htmlType="submit">Create</Button>
//                     </div> */}
//                         <Form.Item>
//                             <Row justify="end" gutter={16}>
//                                 <Col>
//                                     <Button onClick={() => navigate("/app/dashboards/project/list")}>Cancel</Button>
//                                 </Col>
//                                 <Col>
//                                     <Button type="primary" htmlType="submit">
//                                         Create
//                                     </Button>
//                                 </Col>
//                             </Row>
//                         </Form.Item>
//                     </Form>
//                 </div>
//             </div>
//             {/* <Modal
//                 title="Product Create"
//                 visible={isAddProductModalVisible}
//                 onCancel={closeAddProductModal}
//                 footer={null}
//                 width={1000}
//                 className='mt-[-70px]'
//             >
//                 <AddProduct onClose={closeAddProductModal} />
//             </Modal> */}
//         </>
//     );
// };

// export default AddInvoice;

