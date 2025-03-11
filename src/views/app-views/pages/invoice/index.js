import React, { useState } from 'react';
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import { Table, Button, Select } from 'antd';
import Qr from '../../../../assets/svg/Qr.png';
import NumberFormat from 'react-number-format';
import html2pdf from 'html2pdf.js';

const { Column } = Table;
const { Option } = Select;

const Invoice = ({ invoiceData = [] }) => { 
    const [template, setTemplate] = useState('rendertemplate');

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
        if (!Array.isArray(invoiceData)) return 0;  // Ensure invoiceData is an array
        return invoiceData.reduce((acc, elm) => acc + elm.price, 0);
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
                        <h2 className="mb-1 font-weight-semibold">Invoice #{invoiceData.invoiceNumber}</h2>
                        <p>{invoiceData.issueDate}</p>
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
                            <div className='flex'>
                                <img src={Qr} className='w-28 h-28' alt="QR code for payment" />
                            </div>
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
                        {/* <Option value="modern">Modern Template</Option>
                        <Option value="classic">Classic Template</Option>
                        <Option value="minimal">Minimal Template</Option> */}
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

                <div id="printable-content" className="max-w-6xl mx-auto">
                    {template === 'rendertemplate' && renderTemplate()}
                    {/* {template === 'modern' && renderModernTemplate()}
                    {template === 'classic' && renderClassicTemplate()}
                    {template === 'minimal' && renderMinimalTemplate()} */}
                </div>
            </div>
        </div>
    );
};

export default Invoice;

