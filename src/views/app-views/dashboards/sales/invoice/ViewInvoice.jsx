import React, { useEffect, useState } from 'react';
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import { Card, Table, Button, Select } from 'antd';
import { invoiceData } from '../../../pages/invoice/invoiceData';
// import Qr from '../../../../assets/svg/Qr.png';
import NumberFormat from 'react-number-format';
import html2pdf from 'html2pdf.js';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { ClientData } from 'views/app-views/Users/client-list/CompanyReducers/CompanySlice';
import { getInvoice } from './InvoiceReducer/InvoiceSlice';
import { Getcus } from '../customer/CustomerReducer/CustomerSlice';


const { Column } = Table;
const { Option } = Select;

const ViewInvoice = ({idd, onClose}) => {

    const dispatch = useDispatch();
    
    const [template, setTemplate] = useState('rendertemplate');
    const [parsedInvoice, setParsedInvoice] = useState(null);

    // const { id } = useParams();
    // const [idd, setIdd] = useState("");

    console.log(idd, "idd");
    // console.log(id,"iddddddddddddd");

    useEffect(()=>{
        dispatch(Getcus())
    },[])
    

  // Get invoice data
  const allInvoices = useSelector((state) => state?.salesInvoices?.salesInvoices?.data || []);
  const invoiceData = allInvoices.find(inv => inv.id === idd);

  // Get customer data
  const allCustomers = useSelector((state) => state?.customers?.customers?.data || []);
  const customerData = allCustomers.find(cust => cust.id === invoiceData?.customer);

  console.log(customerData, "customerData");

  // Get logged in user data
  const loggedInUser = useSelector((state) => state?.user?.loggedInUser);

    // useEffect(() => {
    //     console.log('Fetching data...'); // Debug log
    //     dispatch(getInvoice())
    //         .then(response => console.log('Invoices Response:', response))
    //         .catch(error => console.error('Invoices Error:', error));
            
    //     dispatch(ClientData())
    //         .then(response => console.log('Clients Response:', response))
    //         .catch(error => console.error('Clients Error:', error));
    // }, [dispatch]);

    
     useEffect(() => {
        // console.log("Fetching invoices for ID:", id);
        dispatch(getInvoice());
      }, [dispatch]);

      useEffect(() => {
    dispatch(Getcus());
  }, []);

  useEffect(() => {
    if (invoiceData?.items) {
        try {
            const items = typeof invoiceData.items === 'string' 
                ? JSON.parse(invoiceData.items) 
                : invoiceData.items;
            setParsedInvoice({
                ...invoiceData,
                items: Array.isArray(items) ? items : [items]
            });
        } catch (error) {
            console.error('Error parsing items:', error);
        }
    }
}, [invoiceData]);

    const handlePrint = () => {
        const printContent = document.getElementById('printable-content');
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Invoice</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.13/antd.min.css">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
                    <style>
                        body {
                            padding: 20px;
                            background: white !important;
                        }
                        @media print {
                            body {
                                padding: 0;
                            }
                            .ant-table {
                                font-size: 12px;
                            }
                            * {
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                            .d-print-none {
                                display: none !important;
                            }
                        }
                        .bg-gradient-to-r {
                            background-image: linear-gradient(to right, var(--tw-gradient-stops));
                        }
                        .from-blue-50 {
                            --tw-gradient-from: #eff6ff;
                            --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgb(239 246 255 / 0));
                        }
                        .to-purple-50 {
                            --tw-gradient-to: #f5f3ff;
                        }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    const handleDownload = () => {
        const element = document.getElementById('printable-content');
        const opt = {
            margin: 1,
            filename: 'invoice.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };

        html2pdf().set(opt).from(element).save();
    };

    const calculateSubtotal = (items) => {
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    // Function to calculate VAT (10%)
    const calculateVAT = (subtotal) => {
        return (subtotal / 100) * 10;
    };

    // Function to calculate Grand Total
    const calculateFinalTotal = (subtotal, vat) => {
        return subtotal - vat;
    };
    // if (!invoiceData) return <div>Loading invoice data...</div>;
    // if (!parsedInvoice) return <div>Processing invoice details...</div>;

    const renderModernTemplate = () => {
        // console.log(invoiceDataa, "invoiceDataa");
        // console.log(allclient, "allclient");
        // console.log(allloggeduser, "allloggeduser");

        if (!parsedInvoice) return null;

        const subtotal = calculateSubtotal(parsedInvoice.items);
        const vat = calculateVAT(subtotal);
        const finalTotal = calculateFinalTotal(subtotal, vat);

        return (
            <div className="bg-white p-6">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 mb-6 rounded-lg">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl text-gray-700">Invoice</h1>
                        <div className="flex items-center">
                            <span className="text-xl ml-2 text-indigo-500">Nexis Vision</span>
                        </div>
                    </div>
                </div>

                {/* Company & Invoice Details */}
                <div className="flex justify-end mb-8">
                    {/* <div>
                        <h2 className="font-bold text-lg mb-1">Dreamguys Technologies PVT Ltd</h2>
                        <p className="text-gray-600">Address: 15 Hodges Mews,High Wycomb HP123JL,United Kingdom</p>
                    </div> */}
                    <div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Invoice Num:</span>
                            <p className='text-right'>{invoiceData?.invoiceNumber}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Issue Date:</span>
                            <p>{invoiceData?.issueDate ? dayjs(invoiceData.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Due Date:</span>
                            <p>{invoiceData?.dueDate ? dayjs(invoiceData.dueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                    </div>
                </div>

                {/* Customer Info Section */}
                <div className="mb-8">

                    <div className="grid grid-cols-2 gap-x-20 gap-y-4">
                        <div className='text-left'>
                        <address>
                            <p>

                                <span className="font-weight-semibold text-dark font-size-md">Billed By:</span><br />
                                        <span>created_by:{loggedInUser?.created_by}</span><br />
                                        <span>Name:{loggedInUser?.username}</span><br />
                                        <p>Email: {loggedInUser?.email}</p>
                                        <p>Phone: {loggedInUser?.phone}</p>
                            </p>
                        </address>
                        </div>

                        {/* Company Details Section */}
                        <div>
                            <span className="font-weight-semibold text-dark font-size-md">Billed To:</span><br />
                            <address>
                                <p>
                                    <span>Name: {customerData.name}</span><br />
                                    <span>customerNumber: {customerData.customerNumber}</span><br />
                                    <p>Email: {customerData.email}</p>
                                    <p>Phone: {customerData.contact}</p>
                                </p>
                            </address>
                        </div>

                    </div>
                </div>

                {/* Items Table */}
                <div className="">
                    <Table
                        dataSource={parsedInvoice.items}
                        pagination={false}
                        className="mb-2"
                    >
                        <Table.Column
                            title="No."
                            key="key"
                            render={(text, record, index) => index + 1}
                        />
                        <Table.Column
                            title="Product"
                            dataIndex="item"
                            key="item"
                            render={(text, record) => {
                                // Display the milestone title stored in item field
                                return <span>{record.item || 'N/A'}</span>;
                            }}
                        />
                        <Table.Column
                            title="Quantity"
                            dataIndex="quantity"
                            key="quantity"
                        />
                        <Table.Column
                            title="Price"
                            render={(record) => (
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(record.price * 100) / 100}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            )}
                            key="price"
                        />
                        <Table.Column
                            title="Amount"
                            render={(record) => (
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(record.price * record.quantity * 100) / 100}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            )}
                            key="amount"
                        />
                    </Table>

                    {/* Invoice Summary */}
                    <div className="d-flex justify-content-end mb-3">
                        <div className="text-center">
                            <div className="border-bottom">
                                <p className="mb-2">
                                    <span>Sub-Total : </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round(subtotal * 100) / 100}
                                        prefix="$"
                                        thousandSeparator={true}
                                    />
                                </p>
                                <p>
                                    VAT :{" "}
                                    {Math.round(vat * 100) / 100}
                                </p>
                            </div>
                            <h2 className="font-weight-semibold mt-3">
                                <span className="mr-1">Final Total: </span>
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(finalTotal * 100) / 100}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex gap-4">
                        <div className='flex'>
                            {/* <img src={Qr} alt="Image not show" className='w-28 h-28' /> */}
                        </div>
                        {/* <div>
                            <h4 className="font-medium mb-2">Payment Info:</h4>
                            <div className='flex gap-2'>
                                <p className='font-normal text-black'>Account Holder Name : </p>
                                <p>{clientDataa.accountholder}</p>
                            </div>
                            <div className='flex gap-2'>

                                <p className='font-normal text-black'>Account Number : </p>
                                <p> {clientDataa.accountnumber}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-normal text-black'>IFSC : </p>
                                <p> {clientDataa.ifsc}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-normal text-black'>Account Type : </p>
                                <p> {clientDataa.branch}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-normal text-black'>Bank Name : </p>
                                <p>{clientDataa.bankname}</p>
                            </div>
                        </div> */}
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">Terms & Conditions:</h4>
                        <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
                            <li>This is a GST based invoice bill,Which is applicable for TDS Deduction</li>
                            <li>We are not the manufactures, company will stand for warranty as per their terms and conditions.</li>
                        </ol>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p>Thanks for your Business</p>
                </div>
            </div>
        );
    };

    const renderTemplate = () => {
        if (!parsedInvoice) return null;

        const subtotal = calculateSubtotal(parsedInvoice.items);
        const vat = calculateVAT(subtotal);
        const finalTotal = calculateFinalTotal(subtotal, vat);

        return (
            <div className="bg-white rounded-lg shadow-lg p-8">
                <span className="text-2xl font-bold text-indigo-600">Nexis Vision</span>
                <div className="d-md-flex justify-content-md-between">
                    {/* Company Details Section */}
                    <div className='text-left'>
                        <address>
                            <p>

                                <span className="font-weight-semibold text-dark font-size-md">Billed By:</span><br />
                                        <span>created_by:{loggedInUser?.created_by}</span><br />
                                        <span>Name:{loggedInUser?.username}</span><br />
                                        <p>Email: {loggedInUser?.email}</p>
                                        <p>Phone: {loggedInUser?.phone}</p>
                            </p>
                        </address>
                    </div>
                    {/* Client Details Section */}
                    <div>
                        <span className="font-weight-semibold text-dark font-size-md">Billed To:</span><br />
                        
                            <address>
                                <p>
                                    <span>Name: {customerData.name}</span><br/>
                                    <span>customerNumber: {customerData.customerNumber}</span><br />
                                    <p>Email: {customerData.email}</p>
                                    <p>Phone: {customerData.contact}</p>
                                </p>
                            </address>
                    </div>

                    {/* Invoice Details Section */}
                    <div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Invoice Num:</span>
                            <p className='text-right'>{invoiceData?.invoiceNumber}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Issue Date:</span>
                            <p>{invoiceData?.issueDate ? dayjs(invoiceData.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Due Date:</span>
                            <p>{invoiceData?.dueDate ? dayjs(invoiceData.dueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                    </div>
                </div>

                <div className="">
                    <Table
                        dataSource={parsedInvoice.items}
                        pagination={false}
                        className="mb-2"
                    >
                        <Table.Column
                            title="No."
                            key="key"
                            render={(text, record, index) => index + 1}
                        />
                        <Table.Column
                            title="Product"
                            dataIndex="item"
                            key="item"
                            render={(text, record) => {
                                // Display the milestone title stored in item field
                                return <span>{record.item || 'N/A'}</span>;
                            }}
                        />
                        <Table.Column
                            title="Quantity"
                            dataIndex="quantity"
                            key="quantity"
                        />
                        <Table.Column
                            title="Price"
                            render={(record) => (
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(record.price * 100) / 100}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            )}
                            key="price"
                        />
                        <Table.Column
                            title="Amount"
                            render={(record) => (
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(record.price * record.quantity * 100) / 100}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            )}
                            key="amount"
                        />
                    </Table>

                    {/* Invoice Summary */}
                    <div className="d-flex justify-content-end mb-3">
                        <div className="text-center">
                            <div className="border-bottom">
                                <p className="mb-2">
                                    <span>Sub-Total : </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round(subtotal * 100) / 100}
                                        prefix="$"
                                        thousandSeparator={true}
                                    />
                                </p>
                                <p>
                                    VAT :{" "}
                                    {Math.round(vat * 100) / 100}
                                </p>
                            </div>
                            <h2 className="font-weight-semibold mt-3">
                                <span className="mr-1">Final Total: </span>
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(finalTotal * 100) / 100}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Payment Information & Terms */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex gap-4">
                        <div className='flex'>
                            {/* <img src={Qr} alt="Image not show" className='w-28 h-28' /> */}
                        </div>
                        {/* <div>
                            <h4 className="font-medium mb-2">Payment Info:</h4>
                            <div className='flex gap-2'>
                                <p className='font-normal text-black'>Account Holder Name : </p>
                                <p>{customerData.accountholder}</p>
                            </div>
                            <div className='flex gap-2'>

                                <p className='font-normal text-black'>Account Number : </p>
                                <p> {customersDataa.accountnumber}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-normal text-black'>IFSC : </p>
                                <p> {customersDataa.ifsc}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-normal text-black'>Account Type : </p>
                                <p> {customersDataa.branch}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-normal text-black'>Bank Name : </p>
                                <p>{customersDataa.bankname}</p>
                            </div>

                        </div> */}
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">Terms & Conditions:</h4>
                        <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
                            <li>This is a GST-based invoice bill, which is applicable for TDS Deduction.</li>
                            <li>We are not the manufacturers; the company will stand for warranty as per their terms and conditions.</li>
                        </ol>
                    </div>
                </div>

                <div className="text-center font-semibold mt-8">
                    <p>Thanks for your Business</p>
                </div>
            </div>
        );
    };

    const renderClassicTemplate = () => {
        if (!parsedInvoice) return null;

        const subtotal = calculateSubtotal(parsedInvoice.items);
        const vat = calculateVAT(subtotal);
        const finalTotal = calculateFinalTotal(subtotal, vat);

        return (
            <div className="bg-white p-8 border-2 border-gray-200">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <span className="text-2xl font-bold text-indigo-600">Nexis Vision</span>
                    <div className="text-gray-600 mt-2">
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Invoice Number :</span>
                            <p>{invoiceData?.invoiceNumber}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Issue Date:</span>
                            <p>{invoiceData?.issueDate ? dayjs(invoiceData.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Due Date:</span>
                            <p>{invoiceData?.dueDate ? dayjs(invoiceData.dueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                    </div>
                </div>


                {/* Address Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="border-r pr-8 text-left">
                        <div className='text-left'>
                        <address>
                            <p>

                                <span className="font-weight-semibold text-dark font-size-md">Billed By:</span><br />
                                        <span>created_by:{loggedInUser?.created_by}</span><br />
                                        <span>Name:{loggedInUser?.username}</span><br />
                                        <p>Email: {loggedInUser?.email}</p>
                                        <p>Phone: {loggedInUser?.phone}</p>
                            </p>
                        </address>
                        </div>


                    </div>
                    <div className="text-left">
                        {/* Company Details Section */}
                        <div>
                            <span className="font-weight-semibold text-dark font-size-md">Billed To:</span><br />
                            <address>
                                <p>
                                    <span>Name: {customerData.name}</span><br />
                                    <span>customerNumber: {customerData.customerNumber}</span><br />
                                    <p>Email: {customerData.email}</p>
                                    <p>Phone: {customerData.contact}</p>
                                </p>
                            </address>
                        </div>
                    </div>
                </div>

                <div className="">
                    <Table
                        dataSource={parsedInvoice.items}
                        pagination={false}
                        className="mb-2"
                    >
                        <Table.Column
                            title="No."
                            key="key"
                            render={(text, record, index) => index + 1}
                        />
                        <Table.Column
                            title="Product"
                            dataIndex="item"
                            key="item"
                            render={(text, record) => {
                                // Display the milestone title stored in item field
                                return <span>{record.item || 'N/A'}</span>;
                            }}
                        />
                        <Table.Column
                            title="Quantity"
                            dataIndex="quantity"
                            key="quantity"
                        />
                        <Table.Column
                            title="Price"
                            render={(record) => (
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(record.price * 100) / 100}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            )}
                            key="price"
                        />
                        <Table.Column
                            title="Amount"
                            render={(record) => (
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(record.price * record.quantity * 100) / 100}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            )}
                            key="amount"
                        />
                    </Table>

                    {/* Invoice Summary */}
                    <div className="d-flex justify-content-end mb-3">
                        <div className="text-center">
                            <div className="border-bottom">
                                <p className="mb-2">
                                    <span>Sub-Total : </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round(subtotal * 100) / 100}
                                        prefix="$"
                                        thousandSeparator={true}
                                    />
                                </p>
                                <p>
                                    VAT :{" "}
                                    {Math.round(vat * 100) / 100}
                                </p>
                            </div>
                            <h2 className="font-weight-semibold mt-3">
                                <span className="mr-1">Final Total: </span>
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(finalTotal * 100) / 100}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderMinimalTemplate = () => {
        if (!parsedInvoice) return null;

        const subtotal = calculateSubtotal(parsedInvoice.items);
        const vat = calculateVAT(subtotal);
        const finalTotal = calculateFinalTotal(subtotal, vat);

        return (
            <div className="bg-white p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div className='text-left'>
                        <h1 className="text-3xl font-light text-gray-700">INVOICE</h1>
                        <div className="text-gray-600 mt-2">
                            <div className='flex'>
                                <span className="mb-1 me-2 font-weight-semibold">Invoice Number:</span>
                                <p>{invoiceData?.invoiceNumber}</p>
                            </div>
                            <div className='flex'>
                                <span className="mb-1 me-2 font-weight-semibold">Issue Date:</span>
                                <p>{invoiceData?.issueDate ? dayjs(invoiceData.issueDate).format('DD MMMM, YYYY') : ''}</p>
                            </div>
                            <div className='flex'>
                                <span className="mb-1 me-2 font-weight-semibold">Due Date:</span>
                                <p>{invoiceData?.dueDate ? dayjs(invoiceData.dueDate).format('DD MMMM, YYYY') : ''}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dates & Addresses */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div className="border-r pr-8 text-left">
                        <div className='text-left'>
                        <address>
                            <p>

                                <span className="font-weight-semibold text-dark font-size-md">Billed By:</span><br />
                                        <span>created_by:{loggedInUser?.created_by}</span><br />
                                        <span>Name:{loggedInUser?.username}</span><br />
                                        <p>Email: {loggedInUser?.email}</p>
                                        <p>Phone: {loggedInUser?.phone}</p>
                            </p>
                        </address>
                        </div>

                    </div>
                    <div className="text-left">
                        {/* Client Details Section */}
                        <div>
                            <span className="font-weight-semibold text-dark font-size-md">Billed To:</span><br />
                            <address>
                                <p>
                                    <span>Name: {customerData.name}</span><br />
                                    <span>customerNumber: {customerData.customerNumber}</span><br />
                                    <p>Email: {customerData.email}</p>
                                    <p>Phone: {customerData.contact}</p>
                                </p>
                            </address>
                        </div>
                    </div>
                </div>

                <div className="">
                    <Table
                        dataSource={parsedInvoice.items}
                        pagination={false}
                        className="mb-2"
                    >
                        <Table.Column
                            title="No."
                            key="key"
                            render={(text, record, index) => index + 1}
                        />
                        <Table.Column
                            title="Product"
                            dataIndex="item"
                            key="item"
                            render={(text, record) => {
                                // Display the milestone title stored in item field
                                return <span>{record.item || 'N/A'}</span>;
                            }}
                        />
                        <Table.Column
                            title="Quantity"
                            dataIndex="quantity"
                            key="quantity"
                        />
                        <Table.Column
                            title="Price"
                            render={(record) => (
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(record.price * 100) / 100}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            )}
                            key="price"
                        />
                        <Table.Column
                            title="Amount"
                            render={(record) => (
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(record.price * record.quantity * 100) / 100}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            )}
                            key="amount"
                        />
                    </Table>

                    {/* Invoice Summary */}
                    <div className="d-flex justify-content-end mb-3">
                        <div className="text-center">
                            <div className="border-bottom">
                                <p className="mb-2">
                                    <span>Sub-Total : </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round(subtotal * 100) / 100}
                                        prefix="$"
                                        thousandSeparator={true}
                                    />
                                </p>
                                <p>
                                    VAT :{" "}
                                    {Math.round(vat * 100) / 100}
                                </p>
                            </div>
                            <h2 className="font-weight-semibold mt-3">
                                <span className="mr-1">Final Total: </span>
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(finalTotal * 100) / 100}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="text-left">
                <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
                    <Select
                        defaultValue={template}
                        onChange={(value) => setTemplate(value)}
                        className="w-48"
                    >
                        <Option value="rendertemplate">Render Template</Option>
                        <Option value="modern">Modern Template</Option>
                        <Option value="classic">Classic Template</Option>
                        <Option value="minimal">Minimal Template</Option>
                    </Select>

                    <div className="space-x-4">
                        <Button type="primary" onClick={handlePrint}>
                            <PrinterOutlined />
                            <span className="ml-1">Print</span>
                        </Button>
                        <Button type="primary" onClick={handleDownload}>
                            <DownloadOutlined />
                            <span className="ml-1">Download</span>
                        </Button>
                    </div>
                </div>

                <div id="printable-content" className="max-w-6xl mx-auto" >
                    {template === 'rendertemplate' && renderTemplate()}
                    {template === 'modern' && renderModernTemplate()}
                     {template === 'classic' && renderClassicTemplate()}
                   {template === 'minimal' && renderMinimalTemplate()} 
                </div>
            </div>
        </div>
    );
};

export default ViewInvoice;



// import React, { useState } from 'react';
// // import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
// import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
// import UserView from '../../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import userData from 'assets/data/user-list.data.json';
// import OrderListData from 'assets/data/order-list.data.json';
// import AddInvoice from './AddInvoice';
// import ViewEditInvoice from './ViewEditInvoice';


// function ViewInvoice() {
//     // const [dealStatisticViewData] = useState(DealStatisticViewData);

//     const [users, setUsers] = useState(userData);
//     const [list, setList] = useState(OrderListData);
//     const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//     const [userProfileVisible, setUserProfileVisible] = useState(false);
//     //   const [customerVisible,setCustomerVisible] = useState(false)
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] = useState(false);
//     const [isViewCustomerModalVisible, setIsViewCustomerModalVisible] = useState(false);
//     const [isEditInvoiceModalVisible, setIsEditInvoiceModalVisible] = useState(false);


//     // Open Add Job Modal
//     const openAddCustomerModal = () => {
//         setIsAddCustomerModalVisible(true);
//     };

//     // Close Add Job Modal
//     const closeAddCustomerModal = () => {
//         setIsAddCustomerModalVisible(false);
//     };


//     const openviewCustomerModal = () => {
//         setIsViewCustomerModalVisible(true);
//     };

//     // Close Add Job Modal
//     const closeViewCustomerModal = () => {
//         setIsViewCustomerModalVisible(false);
//     };


//     // Open Add Job Modal
//     const openEditInvoiceModal = () => {
//         setIsEditInvoiceModalVisible(true);
//     };

//     // Close Add Job Modal
//     const closeEditInvoiceModal = () => {
//         setIsEditInvoiceModalVisible(false);
//     };


//     // Delete user
//     const deleteUser = (userId) => {
//         setUsers(users.filter((item) => item.id !== userId));
//         message.success({ content: `Deleted user ${userId}`, duration: 2 });
//     };

    

//     // Close user profile
//     const closeUserProfile = () => {
//         setSelectedUser(null);
//         setUserProfileVisible(false);
//     };

//     const dropdownMenu = (elm) => (
//         <Menu>
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     <Button
//                         type=""
//                         className=""
//                         icon={<DeleteOutlined />}
//                         onClick={() => deleteUser(elm.id)}
//                         size="small"
//                     >
//                         {/* <span className="">Delete</span> */}
//                     </Button>
//                 </Flex>
//             </Menu.Item>
//         </Menu>
//     );

//     const dropdownMenus = (elm) => (
//         <Menu>
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     <Button
//                         type=""
//                         className=""
//                         icon={<EditOutlined />}
//                         onClick={openEditInvoiceModal}
//                         size="small"
//                     >
//                         <span className="">Edit</span>
//                     </Button>
//                 </Flex>
//             </Menu.Item>
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     <Button
//                         type=""
//                         className=""
//                         icon={<DeleteOutlined />}
//                         onClick={() => deleteUser(elm.id)}
//                         size="small"
//                     >
//                         <span className="">Delete</span>
//                     </Button>
//                 </Flex>
//             </Menu.Item>
//         </Menu>
//     );

//     const tableColumns = [
//         {
//             title: 'Payment Receipt',
//             dataIndex: 'paymentreceipt',
//             sorter: {
//                 compare: (a, b) => a.branch.length - b.branch.length,
//             },
//         },
//         {
//             title: 'Date',
//             dataIndex: 'date',
//             sorter: {
//                 compare: (a, b) => a.title.length - b.title.length,
//             },
//         },
//         {
//             title: 'Amount',
//             dataIndex: 'amount',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Reference',
//             dataIndex: 'Reference',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Description',
//             dataIndex: 'description',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Receipt',
//             dataIndex: 'receipt',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'OrderId',
//             dataIndex: 'orderId',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Action',
//             dataIndex: 'actions',
//             render: (_, elm) => (
//                 <div className="text-center">
//                     <EllipsisDropdown menu={dropdownMenu(elm)} />
//                 </div>
//             ),
//         },
//     ];


//     const invoiceTable = [
//         {
//             title: 'Date',
//             dataIndex: 'date',
//             sorter: {
//                 compare: (a, b) => a.title.length - b.title.length,
//             },
//         },
//         {
//             title: 'Amount',
//             dataIndex: 'amount',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Description',
//             dataIndex: 'description',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Action',
//             dataIndex: 'actions',
//             render: (_, elm) => (
//                 <div className="text-center">
//                     <EllipsisDropdown menu={dropdownMenus(elm)} />
//                 </div>
//             ),
//         },
//     ];


//     return (
//         <>
//             <Card className='border-0'>

//                 <div className="p-6 bg-gray-50">
//                     {/* Heading */}
//                     <h1 className="text-sm font-medium mb-1">Product Summary</h1>
//                     <p className="text-xs text-gray-500 mb-2">
//                         All items here cannot be deleted.
//                     </p>

//                     {/* Table */}
//                     <div className="overflow-x-auto">
//                         <table className="w-full border border-gray-300 bg-white text-center text-xs">
//                             <thead className="bg-gray-100">
//                                 <tr>
//                                     <th className="px-4 py-2">#</th>
//                                     <th className="px-4 py-2">Product</th>
//                                     <th className="px-4 py-2">Quantity</th>
//                                     <th className="px-4 py-2">Rate</th>
//                                     <th className="px-4 py-2">Discount</th>
//                                     <th className="px-4 py-2">Tax</th>
//                                     <th className="px-4 py-2">Description</th>
//                                     <th className="px-4 py-2">
//                                         <span>Price</span>
//                                         <br />
//                                         <span className="text-red-500">(after tax & discount)</span>

//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {/* Row 1 */}
//                                 <tr>
//                                     <td className="px-4 py-2">1</td>
//                                     <td className="px-4 py-2">Refrigerator</td>
//                                     <td className="px-4 py-2">1 (Piece)</td>
//                                     <td className="px-4 py-2">USD 90.000,00</td>
//                                     <td className="px-4 py-2">USD 0.00</td>
//                                     <td className="px-4 py-2 text-center">
//                                         <tr><p className='flex'>CGST (10%):USD  9.000,00</p></tr>
//                                         <tr><p>SGST (5%):USD  4.500,00</p></tr>
//                                     </td>
//                                     <td className="border px-4 py-2">
//                                         Giving information on its origins.
//                                     </td>
//                                     <td className="px-4 py-2">USD 103.500,00</td>
//                                 </tr>
//                                 {/* Total Row */}
//                                 <tr className="bg-gray-100 font-semibold">
//                                     <td className="px-4 py-2 text-center" colSpan="3">
//                                         Total
//                                     </td>
//                                     <td className="px-4 py-2">USD 90.000,00</td>
//                                     <td className="px-4 py-2">USD 0,00</td>
//                                     <td className="px-4 py-2">USD  13.500,00</td>
//                                     <td className="px-4 py-2"></td>
//                                     <td className="px-4 py-2"></td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Summary Details */}
//                     <div className="mt-3 flex flex-col items-end space-y-2 text-xs">
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Sub Total</span>
//                             <span className="text-gray-700">USD 90.000,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Discount</span>
//                             <span className="text-gray-700">USD 0,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">CGST</span>
//                             <span className="text-gray-700">USD 9.000,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">SGST</span>
//                             <span className="text-gray-700">USD 4.500,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Total</span>
//                             <span className="text-gray-700">USD 103.500,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Paid</span>
//                             <span className="text-gray-700">USD 3.260,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Credit Note</span>
//                             <span className="text-gray-700">USD 100.240,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3">
//                             <span className="text-gray-700">Due</span>
//                             <span className="text-gray-700">USD  0,00</span>
//                         </div>
//                     </div>
//                 </div>
//             </Card>

//             <Card bodyStyle={{ padding: '-3px' }}>
//                 <Col span={24}>
//                     <h4 className='font-medium'>Receipt Summary</h4>
//                 </Col>
//                 {/* <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
//                     <Flex className="mb-1" mobileFlex={false}>
//                         <div className="mr-md-3 mb-3">
//                             <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
//                         </div>
//                     </Flex>
//                     <Flex gap="7px">
//                         <Button type="primary" className="ml-2" onClick={openAddCustomerModal}>
//                             <PlusOutlined />
//                             <span>New</span>
//                         </Button>
//                         <Button type="primary" icon={<FileExcelOutlined />} block>
//                             Export All
//                         </Button>
//                     </Flex>
//                 </Flex> */}
//                 <div className="table-responsive mt-2">
//                     <Table
//                         columns={tableColumns}
//                         dataSource={users}
//                         rowKey="id"
//                         scroll={{ x: 1200 }}
//                     />
//                 </div>
//                 <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

//                 {/* Add Job Modal */}
//                 <Modal
//                     title=""
//                     visible={isAddCustomerModalVisible}
//                     onCancel={closeAddCustomerModal}
//                     footer={null}
//                     width={800}
//                 >
//                     <AddInvoice onClose={closeAddCustomerModal} />
//                 </Modal>

//                 <Modal
//                     title=""
//                     visible={isViewCustomerModalVisible}
//                     onCancel={closeViewCustomerModal}
//                     footer={null}
//                     width={1200}
//                 >
//                     <ViewInvoice onClose={closeViewCustomerModal} />
//                 </Modal>

//                 {/* <Modal
//                title=""
//                visible={isEditCustomerModalVisible}
//                onCancel={closeEditCustomerModal}
//                footer={null}
//                width={800}
//             >
//                <EditCustomer onClose={closeEditCustomerModal} />
//             </Modal> */}
//             </Card>

//             <Card bodyStyle={{ padding: '-3px' }}>
//                 <Col span={24}>
//                     <h4 className='font-medium'>Credit Note Summary</h4>
//                 </Col>
//                 <div className="table-responsive mt-2 text-center">
//                     <Table
//                         columns={invoiceTable}
//                         dataSource={users}
//                         rowKey="id"
//                     // scroll={{ x: 800 }}
//                     />
//                 </div>
//                 {/* <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} /> */}


//                 <Modal
//                     title=""
//                     visible={isEditInvoiceModalVisible}
//                     onCancel={closeEditInvoiceModal}
//                     footer={null}
//                     width={500}
//                     className='mt-[-70px]'
//                 >
//                     <ViewEditInvoice onClose={closeEditInvoiceModal} />
//                 </Modal>
//             </Card>
//         </>
//     )
// }

// export default ViewInvoice;
