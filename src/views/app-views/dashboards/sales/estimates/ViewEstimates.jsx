import React, { useEffect, useState } from 'react';
import { Card, Table, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getquotationsById } from './estimatesReducer/EstimatesSlice';
import dayjs from 'dayjs';
import NumberFormat from 'react-number-format';

function ViewEstimates({ quotationId, onClose }) {
    const dispatch = useDispatch();
    const { currentQuotation, loading } = useSelector((state) => state.estimate || {});
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (quotationId) {
            dispatch(getquotationsById(quotationId));
        }
    }, [dispatch, quotationId]);

    // Process items when currentQuotation changes
    useEffect(() => {
        if (currentQuotation?.items) {
            try {
                // Parse the JSON string into an object
                const itemsObj = JSON.parse(currentQuotation.items);

                // Convert the object into an array
                const itemsArray = Object.values(itemsObj).map((item, index) => ({
                    key: index,
                    item: item.item || '',
                    description: item.description || '',
                    quantity: item.quantity || 0,
                    price: item.price || 0,
                    discount: item.discount || 0,
                    tax: item.tax || 0,
                    amount: item.amount || 0
                }));

                setTableData(itemsArray);
                console.log('Processed Items:', itemsArray); // Debug log
            } catch (error) {
                console.error('Error parsing items:', error);
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
            title: "Price",
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
                    suffix="%"
                    thousandSeparator={true}
                />
            )
        },
        {
            title: "Tax",
            dataIndex: "tax",
            key: "tax",
            render: (tax) => `${tax || 0}%`
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
        return <Spin size="large" />;
    }

    if (!currentQuotation) {
        return <div>No data found</div>;
    }

    return (
        <div >
            <div className="p-4 bg-gray-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg">
            <h2 className="mb-5 border-b pb-[40px] font-medium"></h2>
            <div className="rounded-lg">
                <Card bordered={false}>
                    {/* Header Information */}
                    <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className='text-lg'><strong >Estimate Number:</strong> {currentQuotation?.salesQuotationNumber}</p>
                                <p className='text-lg'><strong>Date:</strong> {dayjs(currentQuotation?.issueDate).format('DD/MM/YYYY')}</p>
                                {/* <p><strong>Customer:</strong> {currentQuotation?.customer}</p> */}
                            </div>
                            {/* <div>
                            <p><strong>Category:</strong> {currentQuotation?.category}</p>
                            <p><strong>Status:</strong> {currentQuotation?.status}</p>
                            <p><strong>Created By:</strong> {currentQuotation?.created_by}</p>
                        </div> */}
                        </div>
                    </div>

                    {/* Items Table */}
                    <Table
                        columns={tableColumns}
                        dataSource={tableData}
                        pagination={false}
                        rowKey="key"
                    />

                    {/* Summary Section */}
                    <div className="flex justify-end">
                        <div className="w-72">
                            <div className=" rounded p-4">
                                <div className="flex justify-between mb-2">
                                    <span className='font-semibold'>Subtotal:</span>
                                    <NumberFormat
                                        displayType="text"
                                        value={(currentQuotation?.total - currentQuotation?.tax) || 0}
                                        prefix="₹"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                    />
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className='font-semibold'>Discount:</span>
                                    <NumberFormat
                                        displayType="text"
                                        value={currentQuotation?.discount || 0}
                                        prefix="₹"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                    />
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className='font-semibold'>Tax:</span>
                                    <NumberFormat
                                        displayType="text"
                                        value={currentQuotation?.tax || 0}
                                        prefix="₹"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                    />
                                </div>
                                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                    <span className='font-semibold'>Total:</span>
                                    <NumberFormat
                                        displayType="text"
                                        value={currentQuotation?.total || 0}
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
        </div>
    );
}

export default ViewEstimates;
