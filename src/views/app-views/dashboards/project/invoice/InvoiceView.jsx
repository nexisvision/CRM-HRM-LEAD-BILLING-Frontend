import React, { useEffect, useState } from 'react';
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import { Card, Table, Button, Select } from 'antd';
import dayjs from 'dayjs';
// import { invoiceData } from '../../../pages/invoice/invoiceData'; // Remove this as we fetch data from Redux
import { getAllInvoices } from "../invoice/invoicereducer/InvoiceSlice";
import NumberFormat from 'react-number-format';
import html2pdf from 'html2pdf.js';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from "views/auth-views/auth-reducers/UserSlice"
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice"
// import { SubClient } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice"

import { useParams } from 'react-router-dom';

const { Column } = Table;
const { Option } = Select;

const InvoiceView = ({ idd, onClose, email, invoiceData }) => {

    const dispatch = useDispatch();
    const [template, setTemplate] = useState('rendertemplate');
    const { id } = useParams(); // Get project ID from route
    const { invoices, loading, error } = useSelector((state) => state.invoice);
    const invoiceDataa = invoices.find(invoice => invoice.id === idd);
    // const invoiceDataa = Array.isArray(invoices) ? invoices.find(invoice => invoice.id === idd) : null;

    const [parsedInvoice, setParsedInvoice] = useState(null);


    // console.log("ssssssssss", invoiceDataa, "invoiceDataa");

    const allloggeduser = useSelector((state) => state.user.loggedInUser)
    console.log(allloggeduser, "allloggeduser");

    // Get the client data for the selected ID
    const allclient = useSelector((state) => state.SubClient.SubClient.data);
    const clientDataa = allclient.find((SubClient) => SubClient.id === invoiceDataa?.client);

    // console.log("ppppppppppppp", clientDataa, "clientDataa");
    // const clientDataa = allclient.find((SubClient) => SubClient.id === id);

    // UseEffect to fetch client data
    useEffect(() => {
        dispatch(ClientData()); // Fetch all client data when the component mounts
    }, [dispatch]);


    useEffect(() => {
        dispatch(getAllInvoices(id)); // Fetch all invoices for invoice ID
    }, [dispatch, id]);



    useEffect(() => {
        if (invoiceData && invoiceData.items) {
            try {
                const parsedItems = invoiceData.items && invoiceData.items !== "undefined" && invoiceData.items !== ""
                    ? JSON.parse(invoiceData.items)
                    : [];

                setParsedInvoice({
                    ...invoiceData,
                    items: parsedItems,
                });
            } catch (error) {
                console.error('Error parsing items:', error);
            }
        }
    }, [invoiceData]);

    //error handleing
    useEffect(() => {
        if (error) {
            console.error("Error fetching invoices: ", error)
        }
    }, [error])


    if (loading) {
        return <div>Loading invoices...</div>;
    }

    if (error) {
        return <div>Error loading invoices. Please try again later.</div>;
    }

    if (!invoiceDataa) {
        return <div>Invoice not found</div>;
    }

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

    const renderModernTemplate = () => {
        console.log(invoiceDataa, "invoiceDataa");
        console.log(allclient, "allclient");
        console.log(allloggeduser, "allloggeduser");

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
                            <p className='text-right'>{invoiceDataa?.invoiceNumber}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Issue Date:</span>
                            <p>{invoiceDataa?.issueDate ? dayjs(invoiceDataa.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Due Date:</span>
                            <p>{invoiceDataa?.dueDate ? dayjs(invoiceDataa.dueDate).format('DD MMMM, YYYY') : ''}</p>
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
                                    {allloggeduser ? (
                                        <>
                                            <span>created_by:{allloggeduser?.created_by}</span><br />
                                            <span>username:{allloggeduser?.username}</span><br />
                                            <p>Email: {allloggeduser?.email}</p>
                                            <p>Phone: {allloggeduser?.phone}</p>
                                        </>
                                    ) : (
                                        <>
                                            <span>Address not found</span><br />
                                            <span>City not found</span><br />
                                            <p>Email: Email not found</p>
                                            <p>Phone: Phone not found</p>
                                        </>
                                    )}
                                </p>
                            </address>
                        </div>

                        {/* Company Details Section */}
                        <div>
                            <span className="font-weight-semibold text-dark font-size-md">Billed To:</span><br />
                            {clientDataa ? (
                                <address>
                                    <p>
                                        <span>Created By: {clientDataa.created_by}</span><br />
                                        <span>Username: {clientDataa.username}</span><br />
                                        <p>Email: {clientDataa.email}</p>
                                        <p>Phone: {clientDataa.phone}</p>


                                    </p>
                                </address>
                            ) : (
                                <p>Loading client data...</p>
                            )}
                        </div>
                
                    </div>
                </div>

                {/* Items Table */}
                <div className="mt-4">
                    {parsedInvoice && (
                        <div key={parsedInvoice.id}>
                            {/* Table for Invoice Items */}
                            <Table dataSource={parsedInvoice.items} pagination={false} className="mb-2">
                                <Table.Column
                                    title="No."
                                    key="key"
                                    render={(text, record, index) => index + 1}
                                />
                                <Table.Column
                                    title="Product"
                                    dataIndex="item"
                                    key="item"
                                    render={(text) => (
                                        <div dangerouslySetInnerHTML={{ __html: text }} />
                                    )}
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
                                                value={Math.round(calculateSubtotal(parsedInvoice.items) * 100) / 100}
                                                prefix="$"
                                                thousandSeparator={true}
                                            />
                                        </p>
                                        <p>
                                            VAT :{" "}
                                            {Math.round(calculateVAT(calculateSubtotal(parsedInvoice.items)) * 100) / 100}
                                        </p>
                                    </div>
                                    <h2 className="font-weight-semibold mt-3">
                                        <span className="mr-1">Final Total: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={Math.round(calculateFinalTotal(calculateSubtotal(parsedInvoice.items), calculateVAT(calculateSubtotal(parsedInvoice.items))) * 100) / 100}
                                            prefix="$"
                                            thousandSeparator={true}
                                        />
                                    </h2>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex gap-4">
                        <div className='flex'>
                            {/* <img src={Qr} alt="Image not show" className='w-28 h-28' /> */}
                        </div>
                        <div>
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
                            {/* <p className="text-sm text-gray-500 mt-1">Scan to View Receipt</p> */}

                        </div>
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
                                {allloggeduser ? (
                                    <>
                                        <span>created_by:{allloggeduser?.created_by}</span><br />
                                        <span>username:{allloggeduser?.username}</span><br />
                                        <p>Email: {allloggeduser?.email}</p>
                                        <p>Phone: {allloggeduser?.phone}</p>
                                    </>
                                ) : (
                                    <>
                                        <span>Address not found</span><br />
                                        <span>City not found</span><br />
                                        <p>Email: Email not found</p>
                                        <p>Phone: Phone not found</p>
                                    </>
                                )}
                            </p>
                        </address>
                    </div>
                    {/* Client Details Section */}
                    <div>
                        <span className="font-weight-semibold text-dark font-size-md">Billed To:</span><br />
                        {clientDataa ? (
                            <address>
                                <p>
                                    <span>Created By: {clientDataa.created_by}</span><br />
                                    <span>Username: {clientDataa.username}</span><br />
                                    <p>Email: {clientDataa.email}</p>
                                    <p>Phone: {clientDataa.phone}</p>


                                </p>
                            </address>
                        ) : (
                            <p>Loading client data...</p>
                        )}
                    </div>

                    {/* Invoice Details Section */}
                    <div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Invoice Num:</span>
                            <p className='text-right'>{invoiceDataa?.invoiceNumber}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Issue Date:</span>
                            <p>{invoiceDataa?.issueDate ? dayjs(invoiceDataa.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Due Date:</span>
                            <p>{invoiceDataa?.dueDate ? dayjs(invoiceDataa.dueDate).format('DD MMMM, YYYY') : ''}</p>
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
                            render={(text) => (
                                <div dangerouslySetInnerHTML={{ __html: text }} />
                            )}
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
                        <div>
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
                            {/* <p className="text-sm text-gray-500 mt-1">Scan to View Receipt</p> */}

                        </div>
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
        return (
            <div className="bg-white p-8 border-2 border-gray-200">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <span className="text-2xl font-bold text-indigo-600">Nexis Vision</span>
                    <div className="text-gray-600 mt-2">
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Invoice Number :</span>
                            <p>{invoiceDataa?.invoiceNumber}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Issue Date:</span>
                            <p>{invoiceDataa?.issueDate ? dayjs(invoiceDataa.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Due Date:</span>
                            <p>{invoiceDataa?.dueDate ? dayjs(invoiceDataa.dueDate).format('DD MMMM, YYYY') : ''}</p>
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
                                    {allloggeduser ? (
                                        <>
                                            <span>created_by:{allloggeduser?.created_by}</span><br />
                                            <span>username:{allloggeduser?.username}</span><br />
                                            <p>Email: {allloggeduser?.email}</p>
                                            <p>Phone: {allloggeduser?.phone}</p>
                                        </>
                                    ) : (
                                        <>
                                            <span>Address not found</span><br />
                                            <span>City not found</span><br />
                                            <p>Email: Email not found</p>
                                            <p>Phone: Phone not found</p>
                                        </>
                                    )}
                                </p>
                            </address>
                        </div>


                    </div>
                    <div className="text-left">
                        {/* Company Details Section */}
                        <div>
                            <span className="font-weight-semibold text-dark font-size-md">Billed To:</span><br />
                            {clientDataa ? (
                                <address>
                                    <p>
                                        <span>Created By: {clientDataa.created_by}</span><br />
                                        <span>Username: {clientDataa.username}</span><br />
                                        <p>Email: {clientDataa.email}</p>
                                        <p>Phone: {clientDataa.phone}</p>


                                    </p>
                                </address>
                            ) : (
                                <p>Loading client data...</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    {parsedInvoice && (
                        <div key={parsedInvoice.id}>
                            {/* Table for Invoice Items */}
                            <Table dataSource={parsedInvoice.items} pagination={false} className="mb-2">
                                <Table.Column
                                    title="No."
                                    key="key"
                                    render={(text, record, index) => index + 1}
                                />
                                <Table.Column
                                    title="Product"
                                    dataIndex="item"
                                    key="item"
                                    render={(text) => (
                                        <div dangerouslySetInnerHTML={{ __html: text }} />
                                    )}
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
                                                value={Math.round(calculateSubtotal(parsedInvoice.items) * 100) / 100}
                                                prefix="$"
                                                thousandSeparator={true}
                                            />
                                        </p>
                                        <p>
                                            VAT :{" "}
                                            {Math.round(calculateVAT(calculateSubtotal(parsedInvoice.items)) * 100) / 100}
                                        </p>
                                    </div>
                                    <h2 className="font-weight-semibold mt-3">
                                        <span className="mr-1">Final Total: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={Math.round(calculateFinalTotal(calculateSubtotal(parsedInvoice.items), calculateVAT(calculateSubtotal(parsedInvoice.items))) * 100) / 100}
                                            prefix="$"
                                            thousandSeparator={true}
                                        />
                                    </h2>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex gap-4">
                            <div className='flex'>
                                {/* <img src={Qr} alt="Image not show" className='w-28 h-28' /> */}
                            </div>
                            <div>
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
                                {/* <p className="text-sm text-gray-500 mt-1">Scan to View Receipt</p> */}

                            </div>
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
            </div>
        );
    };

    const renderMinimalTemplate = () => {
        return (
            <div className="bg-white p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div className='text-left'>
                        <h1 className="text-3xl font-light text-gray-700">INVOICE</h1>
                        <div className="text-gray-600 mt-2">
                            <div className='flex'>
                                <span className="mb-1 me-2 font-weight-semibold">Invoice Number:</span>
                                <p>{invoiceDataa?.invoiceNumber}</p>
                            </div>
                            <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Issue Date:</span>
                            <p>{invoiceDataa?.issueDate ? dayjs(invoiceDataa.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Due Date:</span>
                            <p>{invoiceDataa?.dueDate ? dayjs(invoiceDataa.dueDate).format('DD MMMM, YYYY') : ''}</p>
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
                                    {allloggeduser ? (
                                        <>
                                            <span>created_by:{allloggeduser?.created_by}</span><br />
                                            <span>username:{allloggeduser?.username}</span><br />
                                            <p>Email: {allloggeduser?.email}</p>
                                            <p>Phone: {allloggeduser?.phone}</p>
                                        </>
                                    ) : (
                                        <>
                                            <span>Address not found</span><br />
                                            <span>City not found</span><br />
                                            <p>Email: Email not found</p>
                                            <p>Phone: Phone not found</p>
                                        </>
                                    )}
                                </p>
                            </address>
                        </div>

                    </div>
                    <div className="text-left">
                        {/* Client Details Section */}
                        <div>
                            <span className="font-weight-semibold text-dark font-size-md">Billed To:</span><br />
                            {clientDataa ? (
                                <address>
                                    <p>
                                        <span>Created By: {clientDataa.created_by}</span><br />
                                        <span>Username: {clientDataa.username}</span><br />
                                        <p>Email: {clientDataa.email}</p>
                                        <p>Phone: {clientDataa.phone}</p>
                                    </p>
                                </address>
                            ) : (
                                <p>Loading client data...</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    {parsedInvoice && (
                        <div key={parsedInvoice.id}>
                            {/* Table for Invoice Items */}
                            <Table dataSource={parsedInvoice.items} pagination={false} className="mb-2">
                                <Table.Column
                                    title="No."
                                    key="key"
                                    render={(text, record, index) => index + 1}
                                />
                                <Table.Column
                                    title="Product"
                                    dataIndex="item"
                                    key="item"
                                    render={(text) => (
                                        <div dangerouslySetInnerHTML={{ __html: text }} />
                                    )}

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
                                                value={Math.round(calculateSubtotal(parsedInvoice.items) * 100) / 100}
                                                prefix="$"
                                                thousandSeparator={true}
                                            />
                                        </p>
                                        <p>
                                            VAT :{" "}
                                            {Math.round(calculateVAT(calculateSubtotal(parsedInvoice.items)) * 100) / 100}
                                        </p>
                                    </div>
                                    <h2 className="font-weight-semibold mt-3">
                                        <span className="mr-1">Final Total: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={Math.round(calculateFinalTotal(calculateSubtotal(parsedInvoice.items), calculateVAT(calculateSubtotal(parsedInvoice.items))) * 100) / 100}
                                            prefix="$"
                                            thousandSeparator={true}
                                        />
                                    </h2>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex gap-4">
                            <div className='flex'>
                                {/* <img src={Qr} alt="Image not show" className='w-28 h-28' /> */}
                            </div>
                            <div>
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
                                {/* <p className="text-sm text-gray-500 mt-1">Scan to View Receipt</p> */}

                            </div>
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

export default InvoiceView;

















// import React from 'react';

// const InvoiceView = () => {
//     const summaryData = {
//         subTotal: 30644.00,
//         total: 30644.00,
//         totalPaid: 30644.00,
//         totalDue: 0.00,
//     };
//     const invoiceData = {
//         invoiceNumber: 'INV#011',
//         invoiceDate: 'Sun 15 Sep 2024',
//         billedTo: 'Rusty Mills II',
//         email: 'gkautzer@example.net8',
//         company: 'Bartoletti PLC',
//         address: '061 Virginie Summit, Pollichstad, CA 75654',
//         items: [
//             {
//                 description: 'autem',
//                 quantity: 10,
//                 unitPrice: 1604.00,
//                 amount: 16040.00,
//             },
//             {
//                 description: 'dolorem',
//                 quantity: 12,
//                 unitPrice: 1217.00,
//                 amount: 14604.00,
//             },
//         ],
//         subTotal: 30644.00,
//         total: 30644.00,
//         totalPaid: 30644.00,
//         totalDue: 0.00,


//     };

//     return (
//         <div className="bg-gray-50 text-white p-6 rounded-lg">
//             <h1 className='flex justify-end  text-2xl font-semibold '>INVOICE</h1>
//             <div className='flex justify-end mt-4'>
//                 <table className='text-gray-600 text-center border border-gray-700'>
//                     <thead className='text-gray-600 '>
//                         <tr>
//                             <th className='border border-gray-700 p-2 '>Invoice Number</th>
//                             <th className='border border-gray-700 p-2 '>INV#011</th>
//                         </tr>
//                         <tr>
//                             <th className='border border-gray-700  p-2'>Invoice Date</th>
//                             <th className='border border-gray-700 p-2 '>Sun 15 Sep 2024</th>
//                         </tr>
//                     </thead>
//                 </table>
//             </div>


//             {/* <div > 
//         <div className="flex items-center">
//           <span className="mr-2 text-gray-600">Invoice Number:</span>
//           <span className='text-gray-600'>{invoiceData.invoiceNumber}</span>
//         </div>
//       <div className="flex justify-between mb-4">
//         <span className='text-gray-600'>Invoice Date:</span>
//         <span className='text-gray-600'>{invoiceData.invoiceDate}</span>
//       </div>
//       </div> */}
//             <div className="mb-4">
//                 <h3 className="text-lg font-semibold mt-4 ">Billed To:</h3>
//                 <p>
//                     {invoiceData.billedTo}
//                     <br />
//                     {invoiceData.email}
//                 </p>
//                 <p>{invoiceData.company}</p>
//                 <p>{invoiceData.address}</p>
//                 <div className='flex justify-end mb-9'>
//                     <button className='bg-blue-500 text-white p-2 rounded-md'>PAID</button>
//                 </div>
//             </div>

//             <table className="w-full border border-gray-700">
//                 <thead>
//                     <tr>
//                         <th className="border border-gray-700 text-black p-2">Description</th>
//                         <th className="border border-gray-700 text-black p-2">Quantity</th>
//                         <th className="border border-gray-700 text-black p-2">Unit Price (USD)</th>
//                         <th className="border border-gray-700 text-black p-2">Tax</th>
//                         <th className="border border-gray-700 text-black p-2">Amount (USD)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {invoiceData.items.map((item) => (
//                         <tr key={item.description}>
//                             <td className="border border-gray-700 text-gray-600 p-2 text-center   ">{item.description}</td>
//                             <td className="border border-gray-700 text-gray-600 p-2 text-center">{item.quantity}</td>
//                             <td className="border border-gray-700 text-gray-600 p-2 text-center">${item.unitPrice.toFixed(2)}</td>
//                             <td className="border border-gray-700 text-gray-600 p-2 text-center"></td>
//                             <td className="border border-gray-700 text-gray-600 p-2 text-center">${item.amount.toFixed(2)}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <div className="mt-4">
//                 <div className="flex justify-end w-full gap-4">
//                     <p >Sub Total:</p>
//                     <p >${invoiceData.subTotal.toFixed(2)}</p>
//                 </div>
//                 <div className="flex justify-end gap-4  ">
//                     <p >Total:</p>
//                     <p>${invoiceData.total.toFixed(2)}</p>
//                 </div>
//                 <div className="flex justify-end gap-4">
//                     <p  >Total Paid:</p>
//                     <p>${invoiceData.totalPaid.toFixed(2)} USD</p>
//                 </div>
//                 <div className="flex justify-end gap-4">
//                     <p  >Total Due:</p>
//                     <p>${invoiceData.totalDue.toFixed(2)} USD</p>
//                 </div>
//             </div> 

//             {/* <div className="mt-4 border">
//                 <div className="flex justify-end border-x-2 border-top-0" >
//                     <p className="mr-4 ">Sub Total:</p>
//                     <p>${summaryData.subTotal.toFixed(2)}</p>
//                 </div>
//                 <div className="flex justify-end border-x-2 border-y-2 ">
//                     <p className="mr-4">Total:</p>
//                     <p>${summaryData.total.toFixed(2)}</p>
//                 </div>
//                 <div className="flex justify-end border-x-2 border-y-2">
//                     <p className="mr-4">Total Paid:</p>
//                     <p>${summaryData.totalPaid.toFixed(2)} USD</p>
//                 </div>
//                 <div className="flex justify-end border-x-2 border-y-2">
//                     <p className="mr-4">Total Due:</p>
//                     <p>${summaryData.totalDue.toFixed(2)} USD</p>
//                 </div>
//             </div> */}

            

//             <div className="mt-4">
//                 <p>Note:</p>
//             </div>

//             <div className="mt-4">
//                 <p>Terms and Conditions</p>
//                 <p>Thank you for your business.</p>
//             </div>
//         </div>
//     );
// };

// export default InvoiceView;