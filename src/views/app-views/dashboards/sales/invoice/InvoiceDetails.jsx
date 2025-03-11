import React, { useState } from 'react';
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import { Table, Button, Select } from 'antd';
import { invoiceData } from '../../../pages/invoice/invoiceData';
import NumberFormat from 'react-number-format';
import html2pdf from 'html2pdf.js';
import { useSelector } from 'react-redux';

const { Column } = Table;
const { Option } = Select;

const InvoiceDetails = ({ idd, onClose }) => {
    const [template, setTemplate] = useState('rendertemplate');
    const { invoices } = useSelector((state) => state.invoice);
    const invoiceDataa = invoices.find(invoice => invoice.id === idd);

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

    const total = () => {
        let total = 0;
        invoiceData.forEach((elm) => {
            total += elm.price;
        });
        return total;
    };

    const renderModernTemplate = () => {
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
                <div className="flex justify-between mb-8">
                    <div>
                        <h2 className="font-bold text-lg mb-1">Dreamguys Technologies PVT Ltd</h2>
                        <p className="text-gray-600">Address: 15 Hodges Mews,High Wycomb HP123JL,United Kingdom</p>
                    </div>
                    <div className="text-right">
                        <p>Invoice Num: {invoiceDataa?.invoiceNumber}</p>
                        <p>Invoice Date: {invoiceDataa?.issueDate}</p>
                    </div>
                </div>

                {/* Customer Info Section */}
                <div className="mb-8">
                    <div className="bg-gray-50 p-2 mb-4">
                        <h3 className="text-gray-700">Customer Info</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-x-20 gap-y-4">
                        <div>
                            <p className="text-gray-600 mb-2">Invoice To :</p>
                            <p>Walter Roberson</p>
                            <p>299 Star Trek Drive, Panama City,</p>
                            <p>Florida, 32405,</p>
                            <p>USA.</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-2">Pay To :</p>
                            <p>Walter Roberson</p>
                            <p>299 Star Trek Drive, Panama City,</p>
                            <p>Florida, 32405,</p>
                            <p>USA.</p>
                        </div>
                        <div className="text-left bg-gray-100 p-3">
                            <p className="text-gray-600">Due Date</p>
                            <p>{invoiceDataa?.dueDate}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mt-4">
                    <Table dataSource={invoiceData} pagination={false} className="mb-5">
                        <Column title="No." dataIndex="key" key="key" />
                        <Column title="Product" dataIndex="product" key="product" />
                        <Column title="Quantity" dataIndex="quantity" key="quantity" />
                        <Column title="Price"
                            render={(text) => (
                                <NumberFormat
                                    displayType={'text'}
                                    value={(Math.round(text.price * 100) / 100).toFixed(2)}
                                    prefix={'$'}
                                    thousandSeparator={true}
                                />
                            )}
                            key="price"
                        />
                        <Column
                            title="Total"
                            render={(text) => (
                                <NumberFormat
                                    displayType={'text'}
                                    value={(Math.round((text.price * text.quantity) * 100) / 100).toFixed(2)}
                                    prefix={'$'}
                                    thousandSeparator={true}
                                />
                            )}
                            key="total"
                        />
                    </Table>
                    <div className="d-flex justify-content-end">
                        <div className="text-center">
                            <div className="border-bottom">
                                <p className="mb-2">
                                    <span>Sub - Total amount: </span>
                                    <NumberFormat
                                        displayType={'text'}
                                        value={(Math.round((total()) * 100) / 100).toFixed(2)}
                                        prefix={'$'}
                                        thousandSeparator={true}
                                    />
                                </p>
                                <p>vat (10%) : {(Math.round(((total() / 100) * 10) * 100) / 100).toFixed(2)}</p>
                            </div>
                            <h2 className="font-weight-semibold mt-3">
                                <span className="mr-1">Grand Total: </span>
                                <NumberFormat
                                    displayType={'text'}
                                    value={((Math.round((total()) * 100) / 100) - (total() / 100) * 10).toFixed(2)}
                                    prefix={'$'}
                                    thousandSeparator={true}
                                />
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex gap-4">

                        <div>
                            <h4 className="font-medium mb-2">Payment Info:</h4>
                            <p>Debit Card : 465 ************645</p>
                            <p>Amount : $1,815</p>
                            <p className="text-sm text-gray-500 mt-1">Scan to View Receipt</p>
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
        return (
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="d-md-flex justify-content-md-between">
                    <div className='text-left'>
                        <span className="text-2xl font-bold text-indigo-600">Nexis Vision</span>
                        <address>
                            <p>
                                <span>9498 Harvard Street</span><br />
                                <span>Fairfield, Chicago Town 06824</span><br />
                                <abbr className="text-dark" title="Phone">Phone:</abbr>
                                <span>(123) 456-7890</span>
                            </p>
                        </address>
                    </div>
                    <div className="mt-3 text-left">
                        <h2 className="mb-1 font-weight-semibold">Invoice Num: {invoiceDataa?.invoiceNumber}</h2>
                        <p>{invoiceDataa?.issueDate}</p>
                        <address>
                            <p>
                                <span className="font-weight-semibold text-dark font-size-md">Genting Holdings.</span><br />
                                <span>8626 Maiden Dr. </span><br />
                                <span>Niagara Falls, New York 14304</span>
                            </p>
                        </address>
                    </div>
                </div>
                <div className="mt-4">
                    <Table dataSource={invoiceData} pagination={false} className="mb-5">
                        <Column title="No." dataIndex="key" key="key" />
                        <Column title="Product" dataIndex="product" key="product" />
                        <Column title="Quantity" dataIndex="quantity" key="quantity" />
                        <Column title="Price"
                            render={(text) => (
                                <NumberFormat
                                    displayType={'text'}
                                    value={(Math.round(text.price * 100) / 100).toFixed(2)}
                                    prefix={'$'}
                                    thousandSeparator={true}
                                />
                            )}
                            key="price"
                        />
                        <Column
                            title="Total"
                            render={(text) => (
                                <NumberFormat
                                    displayType={'text'}
                                    value={(Math.round((text.price * text.quantity) * 100) / 100).toFixed(2)}
                                    prefix={'$'}
                                    thousandSeparator={true}
                                />
                            )}
                            key="total"
                        />
                    </Table>
                    <div className="d-flex justify-content-end">
                        <div className="text-center">
                            <div className="border-bottom">
                                <p className="mb-2">
                                    <span>Sub - Total amount: </span>
                                    <NumberFormat
                                        displayType={'text'}
                                        value={(Math.round((total()) * 100) / 100).toFixed(2)}
                                        prefix={'$'}
                                        thousandSeparator={true}
                                    />
                                </p>
                                <p>vat (10%) : {(Math.round(((total() / 100) * 10) * 100) / 100).toFixed(2)}</p>
                            </div>
                            <h2 className="font-weight-semibold mt-3">
                                <span className="mr-1">Grand Total: </span>
                                <NumberFormat
                                    displayType={'text'}
                                    value={((Math.round((total()) * 100) / 100) - (total() / 100) * 10).toFixed(2)}
                                    prefix={'$'}
                                    thousandSeparator={true}
                                />
                            </h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex gap-4">

                            <div>
                                <h4 className="font-medium mb-2">Payment Info:</h4>
                                <p>Debit Card : 465 ************645</p>
                                <p>Amount : $1,815</p>
                                <p className="text-sm text-gray-500 mt-1">Scan to View Receipt</p>
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

    const renderClassicTemplate = () => {
        return (
            <div className="bg-white p-8 border-2 border-gray-200">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <span className="text-2xl font-bold text-indigo-600">Nexis Vision</span>
                    <div className="text-gray-600 mt-2">
                        <p>Invoice Num: {invoiceDataa?.invoiceNumber}</p>
                        <p>Invoice Date: {invoiceDataa?.issueDate}</p>
                        <p>Due Date: 07-12-2023</p>
                    </div>
                </div>

                {/* Address Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="border-r pr-8 text-left">
                        <h3 className="text-lg font-serif mb-2">From:</h3>
                        <div className="text-gray-600">
                            <p className="font-semibold">Dreamguys Technologies Pvt Ltd</p>
                            <p>15 Hodges Mews</p>
                            <p>High Wycombe HP12 3JL</p>
                            <p>United Kingdom</p>
                        </div>
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-serif mb-2">Bill To:</h3>
                        <div className="text-gray-600">
                            <p className="font-semibold">John Williams</p>
                            <p>Star Trek Drive</p>
                            <p>Panama City 299</p>
                            <p>Florida, 32405, USA</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <Table dataSource={invoiceData} pagination={false} className="mb-5">
                        <Column title="No." dataIndex="key" key="key" />
                        <Column title="Product" dataIndex="product" key="product" />
                        <Column title="Quantity" dataIndex="quantity" key="quantity" />
                        <Column title="Price"
                            render={(text) => (
                                <NumberFormat
                                    displayType={'text'}
                                    value={(Math.round(text.price * 100) / 100).toFixed(2)}
                                    prefix={'$'}
                                    thousandSeparator={true}
                                />
                            )}
                            key="price"
                        />
                        <Column
                            title="Total"
                            render={(text) => (
                                <NumberFormat
                                    displayType={'text'}
                                    value={(Math.round((text.price * text.quantity) * 100) / 100).toFixed(2)}
                                    prefix={'$'}
                                    thousandSeparator={true}
                                />
                            )}
                            key="total"
                        />
                    </Table>
                    <div className="d-flex justify-content-end">
                        <div className="text-center">
                            <div className="border-bottom">
                                <p className="mb-2">
                                    <span>Sub - Total amount: </span>
                                    <NumberFormat
                                        displayType={'text'}
                                        value={(Math.round((total()) * 100) / 100).toFixed(2)}
                                        prefix={'$'}
                                        thousandSeparator={true}
                                    />
                                </p>
                                <p>vat (10%) : {(Math.round(((total() / 100) * 10) * 100) / 100).toFixed(2)}</p>
                            </div>
                            <h2 className="font-weight-semibold mt-3">
                                <span className="mr-1">Grand Total: </span>
                                <NumberFormat
                                    displayType={'text'}
                                    value={((Math.round((total()) * 100) / 100) - (total() / 100) * 10).toFixed(2)}
                                    prefix={'$'}
                                    thousandSeparator={true}
                                />
                            </h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex gap-4">

                            <div>
                                <h4 className="font-medium mb-2">Payment Info:</h4>
                                <p>Debit Card : 465 ************645</p>
                                <p>Amount : $1,815</p>
                                <p className="text-sm text-gray-500 mt-1">Scan to View Receipt</p>
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
                        <h1 className="text-4xl font-light text-gray-700">INVOICE</h1>
                        <p className="text-gray-500 mt-1">{invoiceDataa?.invoiceNumber}</p>
                    </div>
                </div>

                {/* Dates & Addresses */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div className='text-left'>
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4 font-semibold">From</h3>
                        <p className="font-medium">Dreamguys Technologies Pvt Ltd</p>
                        <p className="text-gray-600">15 Hodges Mews</p>
                        <p className="text-gray-600">High Wycombe HP12 3JL, UK</p>
                    </div>
                    <div className='text-left'>
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4 font-semibold">Bill To</h3>
                        <p className="font-medium">John Williams</p>
                        <p className="text-gray-600">Star Trek Drive</p>
                        <p className="text-gray-600">Panama City 299, Florida</p>
                    </div>
                </div>

                <div className="mt-4">
                    <Table dataSource={invoiceData} pagination={false} className="mb-5">
                        <Column title="No." dataIndex="key" key="key" />
                        <Column title="Product" dataIndex="product" key="product" />
                        <Column title="Quantity" dataIndex="quantity" key="quantity" />
                        <Column title="Price"
                            render={(text) => (
                                <NumberFormat
                                    displayType={'text'}
                                    value={(Math.round(text.price * 100) / 100).toFixed(2)}
                                    prefix={'$'}
                                    thousandSeparator={true}
                                />
                            )}
                            key="price"
                        />
                        <Column
                            title="Total"
                            render={(text) => (
                                <NumberFormat
                                    displayType={'text'}
                                    value={(Math.round((text.price * text.quantity) * 100) / 100).toFixed(2)}
                                    prefix={'$'}
                                    thousandSeparator={true}
                                />
                            )}
                            key="total"
                        />
                    </Table>
                    <div className="d-flex justify-content-end">
                        <div className="text-center">
                            <div className="border-bottom">
                                <p className="mb-2">
                                    <span>Sub - Total amount: </span>
                                    <NumberFormat
                                        displayType={'text'}
                                        value={(Math.round((total()) * 100) / 100).toFixed(2)}
                                        prefix={'$'}
                                        thousandSeparator={true}
                                    />
                                </p>
                                <p>vat (10%) : {(Math.round(((total() / 100) * 10) * 100) / 100).toFixed(2)}</p>
                            </div>
                            <h2 className="font-weight-semibold mt-3">
                                <span className="mr-1">Grand Total: </span>
                                <NumberFormat
                                    displayType={'text'}
                                    value={((Math.round((total()) * 100) / 100) - (total() / 100) * 10).toFixed(2)}
                                    prefix={'$'}
                                    thousandSeparator={true}
                                />
                            </h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex gap-4">
                            <div>
                                <h4 className="font-medium mb-2">Payment Info:</h4>
                                <p>Debit Card : 465 ************645</p>
                                <p>Amount : $1,815</p>
                                <p className="text-sm text-gray-500 mt-1">Scan to View Receipt</p>
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

export default InvoiceDetails;
