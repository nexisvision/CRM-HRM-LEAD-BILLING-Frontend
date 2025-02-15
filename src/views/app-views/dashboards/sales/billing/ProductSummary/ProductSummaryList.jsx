import React, { useState, useEffect } from 'react';
// import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';

function ProductSummaryList({ billingId }) {
    const [billingData, setBillingData] = useState([]);
    const [totals, setTotals] = useState({
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0
    });

    // Get billing data from Redux store
    const allBillingItems = useSelector((state) => state.salesbilling?.salesbilling?.data || []);

    useEffect(() => {
        if (billingId && allBillingItems.length > 0) {
            // Find the specific billing item
            const selectedBilling = allBillingItems.find(item => item.id === billingId);
            
            if (selectedBilling) {
                try {
                    // Parse description if it's a string
                    const description = typeof selectedBilling.discription === 'string' 
                        ? JSON.parse(selectedBilling.discription) 
                        : selectedBilling.discription;

                    // Check if description and items exist
                    if (description && Array.isArray(description.items)) {
                        const items = description.items.map((item, index) => ({
                            id: index,
                            billNumber: selectedBilling.billNumber,
                            billDate: selectedBilling.billDate,
                            vendor: selectedBilling.vendor,
                            product: item.name,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            tax: item.tax,
                            tax_name: item.tax_name,
                            amount: item.amount
                        }));
                        
                        setBillingData(items);
                        calculateTotals(selectedBilling);
                    } else {
                        // If no items, set empty array
                        setBillingData([]);
                        console.warn('No items found in billing description');
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
            subtotal: billing.total + billing.discount || 0,
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
            render: (tax_name) => tax_name || 'N/A'
        },
        // <Table.Column
        //                         title="GST Name"
        //                         key="GST Name"
        //                         render={(record) => {
        //                             return record?.tax_name || 'N/A';
        //                         }}
        //                     />

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
                        <div className="text-center">
                            <div className="border-bottom">
                                <p className="mb-2">
                                    <span className='font-weight-semibold'>Sub-Total : </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={totals.subtotal}
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
                            <h2 className=" mt-3">
                                <span className="mr-1 font-weight-semibold">Final Total: </span>
                                <NumberFormat
                                    displayType="text"
                                    value={totals.total}
                                    prefix="₹"
                                    thousandSeparator={true}
                                />
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default ProductSummaryList;
