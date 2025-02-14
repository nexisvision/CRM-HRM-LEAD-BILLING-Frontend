import React,{useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Qr from '../../../../../../assets/svg/Qr.png'
import { Getcus } from '../../customer/CustomerReducer/CustomerSlice';

const BillInformationList = () => {
    const dispatch = useDispatch();
    const [customerData, setCustomerData] = useState({});
    const allCustomers = useSelector((state) => state?.customers?.customers?.data);
    // Get billing data from the salesbilling slice
    const billingData = useSelector((state) => state?.salesbilling?.salesbilling?.data?.[0]);

    useEffect(()=>{
        dispatch(Getcus())
    },[])

    // Get logged in user data
    const loggedInUser = useSelector((state) => state?.user?.loggedInUser);
    const billingAddress = customerData?.billing_address
        ? JSON.parse(customerData.billing_address)
        : {};

    const cleanStreet = billingAddress.street ? billingAddress.street.replace(/<\/?p>/g, '') : '';
    return (
        <div className="">

            <div className=" p-4">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Bill</h2>
                    <p className="text-sm font-semibold text-gray-700">
                        {billingData?.billNumber || 'N/A'}
                    </p>
                </div>

                {/* Billing and Shipping Details */}
                <div className="grid grid-cols-3 gap-20">
                    {/* Billed To */}
                    <div> 
                        <address>
                            <p>

                                <span className="font-weight-semibold text-dark font-size-md">Billed By:</span><br />
                                        
                                <span>
                                    <span className="font-weight-semibold ">Name:</span>
                                            {loggedInUser?.username}
                                </span><br />
                                <span>
                                    <span className="font-weight-semibold ">Address:</span>
                                            {loggedInUser?.address}
                                </span><br />
                                <span>
                                    <span className="font-weight-semibold ">Email:</span>
                                            {loggedInUser?.email}
                                </span><br />
                                <span>
                                    <span className="font-weight-semibold ">Phone:</span>
                                            {loggedInUser?.phone}
                                </span><br />
                                <span>
                                        <span className="font-weight-semibold ">GSTIN:</span>
                                            {loggedInUser?.gstin}
                                </span><br />
                            </p>
                        </address>
                        </div>
                    {/* Shipped To */}
                    <div>
                            <span className="font-weight-semibold text-dark font-size-md">Shipping To:</span><br />
                            <address>
                                <p>
                                <span> <span className='font-weight-semibold'>Name: </span>{customerData.name}
                                </span><br />
                                <span> <span className='font-weight-semibold'>customerNumber: </span>{customerData.customerNumber}
                                </span><br />
                                <span>  <span className='font-weight-semibold'>Address: </span>
                                        {cleanStreet}, <br />
                                        {billingAddress.city && `${billingAddress.city}, `}
                                        {billingAddress.state && `${billingAddress.state}, `}
                                        {billingAddress.zip && `${billingAddress.zip}, `}
                                        {billingAddress.country}
                                </span> <br />
                                <span> 
                                    <span className='font-weight-semibold'>Email: </span>
                                    {customerData.email}
                                </span><br />
                                    <span> 
                                        <span className='font-weight-semibold'>Phone: </span>
                                        {customerData.contact}
                                    </span><br />
                                    <span className='font-weight-semibold'>GstIn: </span>
                                    {customerData.gstIn}
                                </p>
                            </address>
                        </div>
                    <div className='flex justify-end'>
                        <img src={Qr} alt="Image not show" className='w-28 h-28' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillInformationList
