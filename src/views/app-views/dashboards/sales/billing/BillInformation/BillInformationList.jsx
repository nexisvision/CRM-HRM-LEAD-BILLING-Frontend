import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Qr from '../../../../../../assets/svg/Qr.png';
import { Getcus } from '../../customer/CustomerReducer/CustomerSlice';

const BillInformationList = ({ billingId, onStatusUpdate }) => {
    const dispatch = useDispatch();
    const [customerData, setCustomerData] = useState(null);
    
    const billingData = useSelector((state) => state?.salesbilling?.salesbilling?.data || []);
    const customers = useSelector((state) => state?.customers?.customers?.data);
    const loggedInUser = useSelector((state) => state?.user?.loggedInUser);
    const payments = useSelector((state) => state?.payment?.payment || []); // Get payments data

    const selectedBill = Array.isArray(billingData) 
        ? billingData.find(bill => bill.id === billingId)
        : null;

    useEffect(() => {
        if (selectedBill?.bill_status) {
            onStatusUpdate(selectedBill.bill_status.toLowerCase());
        }
    }, [selectedBill, onStatusUpdate]);

    const calculatePaymentStatus = () => {
        if (!selectedBill || !payments) return 'Pending';

        const billPayments = payments.filter(
            payment => payment.bill === selectedBill.id
        );

        const totalPaid = billPayments.reduce(
            (sum, payment) => sum + parseFloat(payment.amount), 
            0
        );

        const billTotal = parseFloat(selectedBill.updated_total);
        
        if (totalPaid >= billTotal) {
            onStatusUpdate('paid'); 
            return 'Paid';
        } else if (totalPaid > 0) {
            return 'Partially Paid';
        } else {
            return 'Pending';
        }
    };
    useEffect(() => {
        dispatch(Getcus());
    }, [dispatch]);

    useEffect(() => {
        if (selectedBill && customers && customers.length > 0) {
            const foundCustomer = customers.find(
                customer => String(customer._id) === String(selectedBill.customer_id)
            );
            
            if (foundCustomer) {
                setCustomerData(foundCustomer);
            }
        }
    }, [selectedBill, customers]);

    const billingAddress = React.useMemo(() => {
        if (!customerData?.billing_address) return {};
        try {
            return typeof customerData.billing_address === 'string' 
                ? JSON.parse(customerData.billing_address)
                : customerData.billing_address;
        } catch (error) {
            console.error('Error parsing billing address:', error);
            return {};
        }
    }, [customerData]);

    const cleanStreet = billingAddress?.street ? billingAddress.street.replace(/<\/?p>/g, '') : '';

    const getStatusBadgeStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'partially_paid':
                return 'bg-orange-100 text-orange-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const formatStatusText = (status) => {
        if (!status) return 'N/A';
        return status
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };


    return (
        <div className="">
            <div className="p-4">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Bill</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">
                            {selectedBill?.billNumber || 'N/A'}
                        </p>   
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-20">
                    <div>
                        <address>
                            <p>
                                <span className="font-weight-semibold text-dark font-size-md">Billed By:</span><br />
                                <span>
                                    <span className="font-weight-semibold">Name: </span>
                                    {loggedInUser?.username || 'N/A'}
                                </span><br />
                                <span>
                                    <span className="font-weight-semibold">Address: </span>
                                    {loggedInUser?.address || 'N/A'}
                                </span><br />
                                <span>
                                    <span className="font-weight-semibold">Email: </span>
                                    {loggedInUser?.email || 'N/A'}
                                </span><br />
                                <span>
                                    <span className="font-weight-semibold">Phone: </span>
                                    {loggedInUser?.phone || 'N/A'}
                                </span><br />
                                <span>
                                    <span className="font-weight-semibold">GSTIN: </span>
                                    {loggedInUser?.gstin || 'N/A'}
                                </span><br />
                                <span>
                                    <span className="font-weight-semibold">Bill Status: </span><br/>
                                    <span className={`px-2 py-1 mt-1 rounded-lg text-sm ${getStatusBadgeStyle(selectedBill?.bill_status)}`}>
                                        {formatStatusText(selectedBill?.bill_status)}
                                    </span>
                                </span>
                            </p>
                        </address>
                    </div>

                    <div>
                        <span className="font-weight-semibold text-dark font-size-md">Shipping To:</span><br />
                        <address>
                            <p>
                                <span>
                                    <span className='font-weight-semibold'>Name: </span>
                                    {customerData?.name || 'N/A'}
                                </span><br />
                                <span>
                                    <span className='font-weight-semibold'>Address: </span>
                                    {cleanStreet && `${cleanStreet}, `}
                                    {billingAddress?.city && `${billingAddress.city}, `}
                                    {billingAddress?.state && `${billingAddress.state}, `}
                                    {billingAddress?.zip && `${billingAddress.zip}, `}
                                    {billingAddress?.country || 'N/A'}
                                </span><br />
                                <span>
                                    <span className='font-weight-semibold'>Email: </span>
                                    {customerData?.email || 'N/A'}
                                </span><br />
                                <span>
                                    <span className='font-weight-semibold'>Phone: </span>
                                    {customerData?.contact || 'N/A'}
                                </span><br />
                                <span>
                                    <span className='font-weight-semibold'>GSTIN: </span>
                                    {customerData?.gstIn || 'N/A'}
                                </span>
                            </p>
                        </address>
                    </div>

                    <div className='flex justify-end'>
                        <img src={Qr} alt="QR Code" className='w-28 h-28' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillInformationList;
