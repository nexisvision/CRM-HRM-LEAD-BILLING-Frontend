import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
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

    const allBillingItems = useSelector((state) => state.salesbilling?.salesbilling?.data || []);

    useEffect(() => {
        if (billingId && allBillingItems.length > 0) {
            const selectedBilling = allBillingItems.find(item => item.id === billingId);

            if (selectedBilling) {
                try {
                    const itemsArray = JSON.parse(selectedBilling.items || '[]');

                    // Transform items to table format
                    const transformedItems = itemsArray.map((item, index) => ({
                        id: index,
                        billNumber: selectedBilling.billNumber,
                        billDate: selectedBilling.billDate,
                        vendor: selectedBilling.vendor,
                        product: item.item,
                        quantity: item.quantity,
                        price: item.price,
                        tax_percentage: item.tax_percentage,
                        tax_name: item.tax_name,
                        amount: item.amount,
                        description: item.description || ''
                    }));

                    setBillingData(transformedItems);

                    // Get current payments and debit notes
                    const currentBillingPayments = payments.filter(
                        payment => payment.bill === billingId
                    );
                    const currentBillingDebitNotes = debitNotes.filter(
                        note => note.bill === billingId
                    );

                    const totalPaidAmount = currentBillingPayments.reduce(
                        (sum, payment) => {
                            const paymentAmount = typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount || '0');
                            return sum + (isNaN(paymentAmount) ? 0 : paymentAmount);
                        },
                        0
                    );

                    const totalDebitNoteAmount = currentBillingDebitNotes.reduce(
                        (sum, note) => {
                            const noteAmount = parseFloat(note.amount || '0');
                            return sum + (isNaN(noteAmount) ? 0 : noteAmount);
                        },
                        0
                    );

                    const billingTotal = selectedBilling.total || 0;

                    const remainingAmount = Math.max(0, billingTotal - totalPaidAmount - totalDebitNoteAmount);


                    setTotals(prev => ({
                        ...prev,
                        discount: selectedBilling.discount || 0,
                        tax: selectedBilling.tax || 0,
                        total: billingTotal,
                        amount: totalPaidAmount,
                        debitNote: totalDebitNoteAmount,
                        updated_total: remainingAmount
                    }));
                } catch (error) {
                    console.error('Error processing billing data:', error);
                    setBillingData([]);
                }
            }
        }
    }, [billingId, allBillingItems, payments, debitNotes]);

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
            dataIndex: "price",
            key: "price",
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
            dataIndex: "tax_percentage",
            key: "tax_percentage",
            render: (tax_percentage) => `${tax_percentage || 0}%`
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
                                    prefix="₹"
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
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                />
                            </p>
                            <p className="mb-2 border-bottom">
                                <span className='font-weight-semibold'>Debit Note : </span>
                                <NumberFormat
                                    displayType="text"
                                    value={totals.debitNote}
                                    prefix="₹"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}

                                />
                            </p>
                            <p>
                                <span className='font-weight-semibold'>Due : </span>
                                <NumberFormat
                                    displayType="text"
                                    value={totals.updated_total}
                                    prefix="₹"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}

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
