import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Qr from '../../../../../../assets/svg/Qr.png';
import { Getcus } from '../../customer/CustomerReducer/CustomerSlice';

const BillInformationList = () => {
    const dispatch = useDispatch();
    const [customerData, setCustomerData] = useState(null);
    
    // Get data from Redux store
    const billingData = useSelector((state) => state?.salesbilling?.salesbilling?.data?.[0]);
    const customers = useSelector((state) => state?.customers?.customers?.data);
    const loggedInUser = useSelector((state) => state?.user?.loggedInUser);
    const payments = useSelector((state) => state?.payment?.payment || []); // Get payments data

    // Calculate payment status
    const calculatePaymentStatus = () => {
        if (!billingData || !payments) return 'Pending';

        // Get all payments for this bill
        const billPayments = payments.filter(
            payment => payment.bill === billingData.id
        );

        // Calculate total paid amount
        const totalPaid = billPayments.reduce(
            (sum, payment) => sum + parseFloat(payment.amount), 
            0
        );

        // Compare with bill total
        const billTotal = parseFloat(billingData.total);
        
        if (totalPaid >= billTotal) {
            return 'Paid';
        } else if (totalPaid > 0) {
            return 'Partially Paid';
        } else {
            return 'Pending';
        }
    };

    // Get current payment status
    const paymentStatus = calculatePaymentStatus();

    // Fetch customers on component mount
    useEffect(() => {
        dispatch(Getcus());
    }, [dispatch]);

    // Find and set customer data when billing data and customers are available
    useEffect(() => {
        if (billingData && customers && customers.length > 0) {
            const foundCustomer = customers.find(
                customer => String(customer._id) === String(billingData.customer_id)
            );
            
            if (foundCustomer) {
                setCustomerData(foundCustomer);
            }
        }
    }, [billingData, customers]);

    // Parse billing address safely
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

    return (
        <div className="">
            <div className="p-4">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Bill</h2>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">
                            {billingData?.billNumber || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Billing and Shipping Details */}
                <div className="grid grid-cols-3 gap-20">
                    {/* Billed By */}
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
                                {/* <p className={`text-sm font-semibold ${paymentStatus === 'Paid' ? 'text-green-600' :
                                        paymentStatus === 'Partially Paid' ? 'text-orange-600' :
                                            'text-red-600'
                                    }`}>
                                    Status: {paymentStatus}
                                </p> */}
                                <span>
                                    <span className="font-weight-semibold">Bill Status: </span>
                                    <p >
                                        { billingData?.bill_status || 'N/A'}
                                    </p>
                                </span>
                            </p>
                        </address>
                    </div>

                    {/* Shipped To */}
                    <div>
                        <span className="font-weight-semibold text-dark font-size-md">Shipping To:</span><br />
                        <address>
                            <p>
                                <span>
                                    <span className='font-weight-semibold'>Name: </span>
                                    {customerData?.name || 'N/A'}
                                </span><br />
                                <span>
                                    <span className='font-weight-semibold'>Customer Number: </span>
                                    {customerData?.customerNumber || 'N/A'}
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

                    {/* QR Code */}
                    <div className='flex justify-end'>
                        <img src={Qr} alt="QR Code" className='w-28 h-28' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillInformationList;
