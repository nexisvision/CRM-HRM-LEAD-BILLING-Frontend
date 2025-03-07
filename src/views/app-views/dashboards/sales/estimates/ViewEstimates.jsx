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

                // Convert items object to array
                const itemsArray = Object.entries(itemsObj).map(([key, item]) => ({
                    key,
                    ...item
                }));

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
            title: "Discount ",
            dataIndex: "discount",
            key: "discount",
            render: (discount) => (
                <NumberFormat
                    displayType="text"
                    value={discount || 0}
                    // prefix="₹"
                    suffix="%"
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
        <div className="bg-white rounded-lg">
             <h2 className="mb-3 border-b pb-[5px] font-medium"></h2>
            <div className="">
                <Card bordered={false} >
                    {/* Header Section */}
                    <div className="mb-6">

                        {/* Quotation Info */}
                            <div className="flex justify-end gap-8">
                            <div className="space-y-3 ">
                                <div className="flex items-center text-lg">
                                    <span className="text-gray-600 font-semibold ">Quotation Number:</span>
                                    <span className="font-medium text-gray-800">
                                        {currentQuotation.salesQuotationNumber}
                                    </span>
                                </div>
                                <div className="flex items-center text-lg">
                                    <span className="text-gray-600 font-semibold ">Issue Date:</span>
                                    <span className="font-medium text-gray-800">
                                        {dayjs(currentQuotation.issueDate).format('DD/MM/YYYY')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="table-responsive mt-3">
                        <Table
                            columns={tableColumns}
                            dataSource={tableData}
                            pagination={false}
                            rowKey="key"
                            bordered
                            className="bg-white rounded-lg"
                            scroll={{ x: 'max-content' }}
                        />
                    </div>

                    {/* Summary Section */}
                    <div className="flex justify-end mt-8">
                        <div className="w-64 rounded-lg pb-4">
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal:</span>
                                    <NumberFormat
                                        displayType="text"
                                        value={tableData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)}
                                        prefix="₹"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        className="font-medium"
                                    />
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Discount:</span>
                                    <NumberFormat
                                        displayType="text"
                                        value={currentQuotation.discount || 0}
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
                                        value={currentQuotation.tax || 0}
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
                                            value={currentQuotation.total || 0}
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
                </Card>
            </div>
        </div>
    );
}

export default ViewEstimates;
