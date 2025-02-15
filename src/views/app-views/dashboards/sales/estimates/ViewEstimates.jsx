import React, { useEffect, useState } from 'react';
import { Card, Table, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getquotationsById } from './estimatesReducer/EstimatesSlice';
import dayjs from 'dayjs';
import NumberFormat from 'react-number-format';

function ViewEstimates({ quotationId, onClose }) {
    const dispatch = useDispatch();
    
    // Get data from Redux store
    const { currentQuotation, loading } = useSelector((state) => state.salesquotation);
    console.log('Current Quotation:', currentQuotation); // Debug log
    
    const [tableData, setTableData] = useState([]);

    // Fetch quotation data when component mounts
    useEffect(() => {
        if (quotationId) {
            dispatch(getquotationsById(quotationId));
        }
    }, [dispatch, quotationId]);

    // Process items data when currentQuotation changes
    useEffect(() => {
        if (currentQuotation?.items) {
            try {
                // Parse the items string to object
                const itemsObj = JSON.parse(currentQuotation.items);
                console.log('Parsed Items:', itemsObj); // Debug log

                // Convert items object to array
                const itemsArray = Object.entries(itemsObj).map(([key, item]) => ({
                    key,
                    ...item
                }));

                console.log('Items Array:', itemsArray); // Debug log
                setTableData(itemsArray);
            } catch (error) {
                console.error('Error processing items:', error);
                setTableData([]);
            }
        }
    }, [currentQuotation]);

    const tableColumns = [
        {
            title: "No.",
            key: "index",
            render: (text, record, index) => index + 1
        },
        {
            title: "Item",
            dataIndex: "item",
            key: "item"
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
                    decimalScale={2}
                />
            )
        },
        {
            title: "Discount",
            dataIndex: "discount",
            key: "discount",
            render: (discount) => (
                <NumberFormat
                    displayType="text"
                    value={discount || 0}
                    prefix="₹"
                    thousandSeparator={true}
                    decimalScale={2}
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
            render: (tax_name) => tax_name?.toUpperCase()
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
                    decimalScale={2}
                />
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spin size="large" />
            </div>
        );
    }

    if (!currentQuotation) {
        return (
            <div className="flex justify-center items-center h-full">
                <p>No quotation data found</p>
            </div>
        );
    }

    return (
        <div className='ml-[-24px] mr-[-24px] mt-[-52px] mb-[-24px] bg-gray-50 rounded-t-lg rounded-b-lg'>   
                <div className="p-4">
                <h2 className=" border-b pb-[30px] font-medium"></h2>
            <Card bordered={false} className='mt-5'>
                {/* Header Information */}
                <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-lg mb-2">
                                <strong>Quotation Number:</strong> {currentQuotation.salesQuotationNumber}
                            </p>
                            <p className="text-lg mb-2">
                                <strong>Date:</strong> {dayjs(currentQuotation.issueDate).format('DD/MM/YYYY')}
                            </p>
                            {/* <p className="text-lg mb-2">
                                <strong>Category:</strong> {currentQuotation.category}
                            </p> */}
                            {/* <p className="text-lg mb-2">
                                <strong>Customer ID:</strong> {currentQuotation.customer}
                            </p> */}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-2">
                    <Table
                        columns={tableColumns}
                        dataSource={tableData}
                        pagination={false}
                        rowKey="key"
                        bordered
                    />
                </div>

                {/* Summary Section */}
                <div className="flex justify-end mt-2">
                    <div className="w-72">
                        <div className=" p-4 rounded">
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Subtotal:</span>
                                <NumberFormat
                                    displayType="text"
                                    value={(currentQuotation.total - currentQuotation.tax) || 0}
                                    prefix="₹"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                />
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Discount:</span>
                                <NumberFormat
                                    displayType="text"
                                    value={currentQuotation.discount || 0}
                                    prefix="₹"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                />
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Tax:</span>
                                <NumberFormat
                                    displayType="text"
                                    value={currentQuotation.tax || 0}
                                    prefix="₹"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                />
                            </div>
                            <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                <span>Total:</span>
                                <NumberFormat
                                    displayType="text"
                                    value={currentQuotation.total || 0}
                                    prefix="₹"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            </div>
        </div>
    );
}

export default ViewEstimates;
