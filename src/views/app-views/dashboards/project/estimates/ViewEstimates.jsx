import React, { useEffect, useState } from 'react';
import { Card, Table, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getestimateById } from './estimatesReducer/EstimatesSlice';
import dayjs from 'dayjs';
import NumberFormat from 'react-number-format';

function ViewEstimates({ estimateId, onClose }) {
    const dispatch = useDispatch();
    
    // Get data from Redux store
    const estimate = useSelector((state) => 
        state.estimate.estimates.find(est => est.id === estimateId)
    );
    console.log('Current Estimate:', estimate); // Debug log
    
    const [tableData, setTableData] = useState([]);

    // Process items data when estimate changes
    useEffect(() => {
        if (estimate?.items) {
            try {
                // Parse the items string to object if needed
                const itemsObj = typeof estimate.items === 'string' ? 
                    JSON.parse(estimate.items) : estimate.items;
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
    }, [estimate]);

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
                    prefix='₹'
                    // prefix={`${estimate?.currency || '₹'} `}
                    thousandSeparator={true}
                    decimalScale={2}
                />
            )
        },
        {
            title: "Discount (%)",
            dataIndex: "discount",
            key: "discount",
            render: (discount) => `${discount || 0}%`
        },
        {
            title: "Tax (%)",
            dataIndex: "tax",
            key: "tax",
            render: (tax) => `${tax || 0}%`
        },
        {
            title: "Gst Name",
            dataIndex: "tax_name",
            key: "tax_name"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => (
                <NumberFormat
                    displayType="text"
                    value={amount || 0}
                    prefix='₹'
                    // prefix={`${estimate?.currency || '₹'} `}
                    thousandSeparator={true}
                    decimalScale={2}
                />
            )
        }
    ];

    if (!estimate) {
        return (
            <div className="flex justify-center items-center h-full">
                <p>No estimate data found</p>
            </div>
        );
    }

    return (
        <div className='ml-[-24px] mr-[-24px] mt-[-52px] mb-[-24px] bg-gray-50 rounded-t-lg rounded-b-lg'>   
            <div className="p-4">
                <h2 className="border-b pb-[30px] font-medium"></h2>
                <Card bordered={false} className='mt-3'>
                    {/* Header Information */}
                    <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-lg mb-2">
                                    <strong>Quotation Number:</strong> {estimate.quotationNumber}
                                </p>
                                <p className="text-lg mb-2">
                                    <strong>Date:</strong> {dayjs(estimate.createdAt).format('DD/MM/YYYY')}
                                </p>
                                {/* <p className="text-lg mb-2">
                                    <strong>Valid Till:</strong> {dayjs(estimate.valid_till).format('DD/MM/YYYY')}
                                </p>
                                <p className="text-lg mb-2">
                                    <strong>Client:</strong> {estimate.client}
                                </p> */}
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-6">
                        <Table
                            columns={tableColumns}
                            dataSource={tableData}
                            pagination={false}
                            bordered
                        />
                    </div>

                    {/* Summary Section */}
                    <div className="flex justify-end mt-4">
                        <div className="w-72">
                            <div className="p-4 rounded">
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Subtotal:</span>
                                    <NumberFormat
                                        displayType="text"
                                        value={tableData.reduce((sum, item) => 
                                            sum + parseFloat(item.amount || 0), 0
                                        )}
                                        prefix='₹'
                                        // prefix={`${estimate.currency || '₹'} `}
                                        thousandSeparator={true}
                                        decimalScale={2}
                                    />
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Discount:</span>
                                    <NumberFormat
                                        displayType="text"
                                        value={estimate.discount || 0}
                                        // suffix="%"
                                        prefix='₹'
                                        thousandSeparator={true}
                                        decimalScale={2}
                                    />
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Tax:</span>
                                    <NumberFormat
                                        displayType="text"
                                        value={estimate.tax || 0}
                                         prefix='₹'
                                        // prefix={`${estimate.currency || '₹'} `}
                                        thousandSeparator={true}
                                        decimalScale={2}
                                    />
                                </div>
                                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                    <span>Total:</span>
                                    <NumberFormat
                                        displayType="text"
                                        value={estimate.total || 0}
                                         prefix='₹'
                                        // prefix={`${estimate.currency || '₹'} `}
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
