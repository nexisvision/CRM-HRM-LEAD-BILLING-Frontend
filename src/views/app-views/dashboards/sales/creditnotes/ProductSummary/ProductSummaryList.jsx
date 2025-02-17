import React, { useEffect, useState } from 'react';
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import { Card, Table, Button, Select } from 'antd';
// import { invoiceData } from '../../../pages/invoice/invoiceData';
// import Qr from '../../../../assets/svg/Qr.png';
import NumberFormat from 'react-number-format';
import html2pdf from 'html2pdf.js';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { ClientData } from 'views/app-views/Users/client-list/CompanyReducers/CompanySlice';
import { getInvoice } from '../../invoice/InvoiceReducer/InvoiceSlice';

const { Column } = Table;
const { Option } = Select;

const ProductSummaryList = ({ selectedCreditNote, invoiceData }) => {
    const dispatch = useDispatch();
    const [parsedInvoice, setParsedInvoice] = useState(null);
    const [totals, setTotals] = useState({
        subtotal: 0,
        discountAmount: 0,
        discountPercentage: 0,
        tax: 0,
        total: 0
    });
    
    // Get all invoices from Redux store
    const allInvoices = useSelector((state) => state?.salesInvoices?.salesInvoices?.data);
    console.log('All Invoices:', allInvoices); // Debug log
    console.log('Selected Credit Note:', selectedCreditNote); // Debug log

    useEffect(() => {
        dispatch(getInvoice());
    }, [dispatch]);

    // Find and process the matching invoice
    useEffect(() => {
        if (selectedCreditNote && allInvoices) {
            // Find invoice using related_id from credit note
            const matchingInvoice = allInvoices.find(inv => inv.id === selectedCreditNote.related_id);
            console.log('Matching Invoice:', matchingInvoice); // Debug log

            if (matchingInvoice?.items) {
                try {
                    const parsedItems = typeof matchingInvoice.items === 'string' 
                        ? JSON.parse(matchingInvoice.items) 
                        : matchingInvoice.items;
                    
                    console.log('Parsed Items:', parsedItems); // Debug log

                    // Convert items object to array and set state
                    const itemsArray = Object.entries(parsedItems).map(([key, item]) => ({
                        key,
                        ...item
                    }));

                    setParsedInvoice({
                        ...matchingInvoice,
                        items: itemsArray
                    });
                } catch (error) {
                    console.error('Error parsing invoice items:', error);
                }
            }
        }
    }, [selectedCreditNote, allInvoices]);

    useEffect(() => {
        if (invoiceData?.items) {
            try {
                const parsedItems = typeof invoiceData.items === 'string' 
                    ? JSON.parse(invoiceData.items) 
                    : invoiceData.items;
                
                const itemsArray = Object.entries(parsedItems).map(([key, item]) => ({
                    key,
                    ...item
                }));

                // Calculate totals
                const subtotal = itemsArray.reduce((sum, item) => sum + (parseFloat(item.base_amount) || 0), 0);
                
                // Get discount percentage directly from invoice
                const discountPercentage = invoiceData.discount || 0;
                
                // Calculate discount amount based on subtotal and percentage
                const discountAmount = (subtotal * discountPercentage) / 100;

                const calculatedTotals = {
                    subtotal,
                    discountAmount,
                    discountPercentage,
                    tax: invoiceData.tax || 0,
                    total: invoiceData.total || 0
                };

                setParsedInvoice({
                    ...invoiceData,
                    items: itemsArray
                });
                setTotals(calculatedTotals);
            } catch (error) {
                console.error('Error parsing invoice items:', error);
            }
        }
    }, [invoiceData]);

    const columns = [
        {
            title: 'No.',
            key: 'index',
            width: 70,
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Item',
            dataIndex: 'item',
            key: 'item',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (price) => (
                <NumberFormat
                    displayType="text"
                    value={price || 0}
                    prefix="₹"
                    thousandSeparator={true}
                    decimalScale={2}
                    className="text-gray-700"
                />
            )
        },
        {
            title: 'Discount (%)',
            dataIndex: 'discount_percentage',
            key: 'discount_percentage',
            render: (discount_percentage) => `${discount_percentage || 0}%`
        },
        {
            title: 'Tax (%)',
            dataIndex: 'tax_percentage',
            key: 'tax_percentage',
            render: (tax) => `${tax || 0}%`
        },
        {
            title: 'Gst Name',
            dataIndex: 'tax_name',
            key: 'tax_name',
            render: (tax_name) => `${tax_name || "--"}`
        },
        {
            title: 'Amount',
            dataIndex: 'final_amount',
            key: 'final_amount',
            render: (amount) => (
                <NumberFormat
                    displayType="text"
                    value={amount || 0}
                    prefix="₹"
                    thousandSeparator={true}
                    decimalScale={2}
                />
            )
        }
    ];

    if (!parsedInvoice) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-gray-500">Loading invoice details...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg ">
            {/* Header Section */}
            <h2 className="mb-3 border-b pb-[5px] font-medium"></h2>
                {/* Invoice Info */}
                <div className="flex justify-end gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center text-lg">
                            <span className="text-gray-600 font-semibold ">Invoice Number:</span>
                            <span className="font-medium text-gray-800">{invoiceData.salesInvoiceNumber}</span>
                        </div>
                        <div className="flex items-center text-lg">
                            <span className="text-gray-600 font-semibold ">Issue Date:</span>
                            <span className="font-medium text-gray-800">
                                {dayjs(invoiceData.date).format('DD/MM/YYYY')}
                            </span>
                        </div>
                    </div>
                </div>
           

            {/* Table Section */}
            <div className="table-responsive mt-3">
                <Table
                    columns={columns}
                    dataSource={parsedInvoice.items}
                    pagination={false}
                    rowKey={(record) => record.key}
                    className="mb-6"
                    bordered
                    scroll={{ x: 'max-content' }}
                />

                {/* Summary Section */}
                <div className="flex justify-end">
                    <div className="w-64 rounded-lg pb-4">
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal:</span>
                                <NumberFormat
                                    displayType="text"
                                    value={totals.subtotal}
                                    prefix="₹"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    className="font-medium"
                                />
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Discount ({totals.discountPercentage}%):</span>
                                <NumberFormat
                                    displayType="text"
                                    value={totals.discountAmount}
                                    prefix="₹"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    className="font-medium text-red-500"
                                />
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax:</span>
                                <NumberFormat
                                    displayType="text"
                                    value={totals.tax}
                                    prefix="₹"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    className="font-medium"
                                />
                            </div>
                            <div className="border-t border-gray-200 pt-3 mt-3">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-800">Total:</span>
                                    <NumberFormat
                                        displayType="text"
                                        value={totals.total}
                                        prefix="₹"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        className="font-semibold text-gray-800"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSummaryList;







// import React, { useState, useEffect } from 'react';
// // import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
// import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
// import { useSelector } from 'react-redux';

// function ProductSummaryList() {
//     const [items, setItems] = useState([]);
//     const [totals, setTotals] = useState({
//         subtotal: 0,
//         discount: 0,
//         tax: 0,
//         total: 0
//     });

//     // Get invoice data from Redux store
//     const invoiceData = useSelector((state) => state.salesInvoices?.currentInvoice);
    
//     useEffect(() => {
//         if (invoiceData?.items) {
//             try {
//                 // Parse items if it's a string
//                 const parsedItems = typeof invoiceData.items === 'string' 
//                     ? JSON.parse(invoiceData.items) 
//                     : invoiceData.items;

//                 // Convert items object to array
//                 const itemsArray = Object.entries(parsedItems).map(([key, item]) => ({
//                     id: key,
//                     ...item
//                 }));

//                 setItems(itemsArray);

//                 // Calculate totals
//                 const calculatedTotals = {
//                     subtotal: itemsArray.reduce((sum, item) => sum + item.base_amount, 0),
//                     discount: itemsArray.reduce((sum, item) => sum + item.discount_amount, 0),
//                     tax: itemsArray.reduce((sum, item) => sum + item.tax_amount, 0),
//                     total: invoiceData.total
//                 };

//                 setTotals(calculatedTotals);
//             } catch (error) {
//                 console.error('Error processing items:', error);
//                 setItems([]);
//             }
//         }
//     }, [invoiceData]);

//     return (
//         <>
//             <Card className='border-0'>
//                 <div className="p-2">
//                     {/* Heading */}
//                     <h1 className="text-sm font-medium mb-1">Product Summary</h1>
//                     <p className="text-xs text-gray-500 mb-2">
//                         Invoice Number: {invoiceData?.salesInvoiceNumber}
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
//                                     <th className="px-4 py-2">Discount (%)</th>
//                                     <th className="px-4 py-2">Tax (%)</th>
//                                     <th className="px-4 py-2">Description</th>
//                                     <th className="px-4 py-2">Amount</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {items.map((item, index) => (
//                                     <tr key={item.id}>
//                                         <td className="px-4 py-2">{index + 1}</td>
//                                         <td className="px-4 py-2">{item.item}</td>
//                                         <td className="px-4 py-2">{item.quantity}</td>
//                                         <td className="px-4 py-2">₹ {item.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//                                         <td className="px-4 py-2">{item.discount_percentage}%</td>
//                                         <td className="px-4 py-2">{item.tax_percentage}%</td>
//                                         <td className="px-4 py-2">{item.description}</td>
//                                         <td className="px-4 py-2">₹ {item.final_amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Summary Details */}
//                     <div className="mt-3 flex flex-col items-end space-y-2 text-xs">
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Sub Total</span>
//                             <span className="text-gray-700">₹ {totals.subtotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Discount</span>
//                             <span className="text-gray-700">₹ {totals.discount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Tax</span>
//                             <span className="text-gray-700">₹ {totals.tax?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3">
//                             <span className="font-semibold">Total</span>
//                             <span className="font-semibold">₹ {totals.total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                         </div>
//                     </div>
//                 </div>
//             </Card>
//         </>
//     );
// }

// export default ProductSummaryList;
