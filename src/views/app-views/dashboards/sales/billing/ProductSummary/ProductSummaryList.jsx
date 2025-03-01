import React, { useState, useEffect } from 'react';
// import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import NumberFormat from 'react-number-format';
import { useSelector, useDispatch } from 'react-redux';
import { getAllPayment } from "../paymentReducer/PaymentSlice";
import { getAllDebitNotes } from "../../../Purchase/debitnotes/debitReducer/DebitSlice";

function ProductSummaryList({ billingId }) {
    const [billingData, setBillingData] = useState([]);
    const [totals, setTotals] = useState({
        discount: 0,
        tax: 0,
        total: 0,
        amount: 0,
        debitNote: 0,
        updated_total: 0
    });
    
    const dispatch = useDispatch();
    const payments = useSelector((state) => state.payment?.payment || []);
    const debitNotes = useSelector((state) => state.debitNotes?.debitNotes || []);

    useEffect(() => {
        dispatch(getAllPayment());
        dispatch(getAllDebitNotes());
    }, [dispatch]);

    useEffect(() => {
        if (billingId && payments.length > 0) {
            // Filter payments for current billing
            const currentBillingPayments = payments.filter(
                payment => payment.bill === billingId  // Changed from billing_id to bill to match API data
            );

            // Filter debit notes for current billing
            const currentBillingDebitNotes = debitNotes.filter(
                note => note.bill === billingId
            );

            // Calculate total paid amount
            const totalPaidAmount = currentBillingPayments.reduce(
                (sum, payment) => sum + Number(payment.amount || 0), 
                0
            );

            // Calculate total debit note amount
            const totalDebitNoteAmount = currentBillingDebitNotes.reduce(
                (sum, note) => sum + Number(note.amount || 0),
                0
            );

            // Update totals with both paid and debit note amounts
            setTotals(prev => ({
                ...prev,
                amount: totalPaidAmount,
                debitNote: totalDebitNoteAmount,
                updated_total: prev.total - totalPaidAmount - totalDebitNoteAmount // Subtract both payments and debit notes
            }));
        }
    }, [billingId, payments, debitNotes]);

    // Get billing data from Redux store
    const allBillingItems = useSelector((state) => state.salesbilling?.salesbilling?.data || []);

    useEffect(() => {
        if (billingId && allBillingItems.length > 0) {
            // Find the specific billing item
            const selectedBilling = allBillingItems.find(item => item.id === billingId);
            

console.log("selectedBilertretling",selectedBilling);

            if (selectedBilling) {
                try {
                    // Parse description if it's a string
                    const description = typeof selectedBilling.discription === 'string' 
                        ? JSON.parse(selectedBilling.discription) 
                        : selectedBilling.discription;

                    // Check if description exists
                    if (description) {
                        const items = [];
                        
                        // Handle both single item and array of items
                        if (Array.isArray(description.items)) {
                            items.push(...description.items.map((item, index) => ({
                                id: index,
                                billNumber: selectedBilling.billNumber,
                                billDate: selectedBilling.billDate,
                                vendor: selectedBilling.vendor,
                                product: item.name,
                                quantity: item.quantity,
                                unitPrice: item.unitPrice,
                                tax: item.tax,
                                tax_name: item.tax_name,
                                amount: item.amount,
                                // Add any additional fields from database
                                ...item
                            })));
                        } else {
                            // If it's a single item
                            items.push({
                                id: 0,
                                billNumber: selectedBilling.billNumber,
                                billDate: selectedBilling.billDate,
                                vendor: selectedBilling.vendor,
                                product: description.name,
                                quantity: description.quantity,
                                unitPrice: description.unitPrice,
                                tax: description.tax,
                                tax_name: description.tax_name,
                                amount: description.amount,
                                // Add any additional fields from database
                                ...description
                            });
                        }
                        
                        setBillingData(items);
                        calculateTotals(selectedBilling);
                    } else {
                        setBillingData([]);
                        console.warn('No description found in billing data');
                    }
                } catch (error) {
                    console.error('Error processing billing data:', error);
                    setBillingData([]);
                }
            }
        }
    }, [billingId, allBillingItems]);

    const calculateTotals = (billing) => {
        if (!billing) return;

        setTotals({
            // subtotal: billing.total - billing.discount + billing.tax || 0,
            discount: billing.discount || 0,
            tax: billing.tax || 0,
            total: billing.total || 0
        });
    };

    const columns = [
        {
            title: "No.",
            key: "index",
            render: (text, record, index) => index + 1
        },
        {
            title: "Bill Number",
            dataIndex: "billNumber",
            key: "billNumber"
        },
        {
            title: "Bill Date",
            dataIndex: "billDate",
            key: "billDate",
            render: (date) => dayjs(date).format('DD/MM/YYYY')
        },
        // {
        //     title: "Vendor",
        //     dataIndex: "vendor",
        //     key: "vendor"
        // },
        {
            title: "Product",
            dataIndex: "product",
            key: "product"
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity"
        },
        {
            title: "Unit Price",
            dataIndex: "unitPrice",
            key: "unitPrice",
            render: (price) => (
                <NumberFormat
                    displayType="text"
                    value={price || 0}
                    prefix="₹"
                    thousandSeparator={true}
                />
            )
        },
        {
            title: "Tax (%)",
            dataIndex: "tax",
            key: "tax",
            render: (tax) => `${tax || 0}%`
        },
        {
            title: "GST Name",
            dataIndex: "tax_name",
            key: "tax_name",
            render: (tax_name) => tax_name || '--'
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => (
                <NumberFormat
                    displayType="text"
                    value={amount || 0}
                    prefix="₹"
                    thousandSeparator={true}
                />
            )
        }
    ];

    return (
      
            <div className="p-2">
                <h1 className="text-sm font-medium mb-1">Product Summary</h1>
                {/* <p className="text-xs text-gray-500 mb-2">
                    Billing details for selected item
                </p> */}

                <div className="">
                    <Table 
                        dataSource={billingData} 
                        columns={columns}
                        pagination={false} 
                        className="mb-2"
                        rowKey="id"
                    />

                    {/* Summary Section */}
                    <div className="d-flex justify-content-end mb-3">
                        <div className="text-left">
                            <div>
                                <p className="mb-2">
                                    <span className='font-weight-semibold'>Sub-Total : </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={billingData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)}
                                        prefix="₹"
                                        thousandSeparator={true}
                                    />
                                </p>
                                <p className="mb-2">
                                    <span className='font-weight-semibold'>Total Discount : </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={totals.discount}
                                        suffix="%"
                                        thousandSeparator={true}
                                    />
                                </p>
                                <p>
                                    <span className='font-weight-semibold'>Total Tax : </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={totals.tax}
                                        prefix="₹"
                                        thousandSeparator={true}
                                    />
                                </p>
                            </div>
                            <h2 className="mt-2">
                                <span className="font-weight-semibold"> Total: </span>
                                <NumberFormat
                                    displayType="text"
                                    value={totals.total}
                                    prefix="₹"
                                    thousandSeparator={true}
                                />
                            </h2>
                            <div className=" mt-2">
                                <p className="mb-2">
                                    <span className='font-weight-semibold'>Paid : </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={totals.amount}
                                        prefix="₹"
                                        thousandSeparator={true}
                                        // className="text-success"  // Added success color for paid amount
                                    />
                                </p>
                                <p className="mb-2 border-bottom">
                                    <span className='font-weight-semibold'>Debit Note : </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={totals.debitNote}
                                        prefix="₹"
                                        thousandSeparator={true}
                                    />
                                </p>
                                <p>
                                    <span className='font-weight-semibold'>Due : </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={totals.updated_total}
                                        prefix="₹"
                                        thousandSeparator={true}
                                        // className={totals.updated_total > 0 ? "text-danger" : "text-success"}  // Added conditional color
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default ProductSummaryList;
