import React,{useState} from "react";
import { PlusOutlined, MailOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { BsCurrencyDollar } from "react-icons/bs";
import { Button, Modal,  } from 'antd';
import EditBilling from '../EditBilling';
import AddBilling from '../AddBilling';
import AddPayment from '../AddPayment';
import { useSelector } from 'react-redux';

const BillingDetailsList = ({ billingId }) => {
    const [isAddBillingModalVisible, setIsAddBillingModalVisible] = useState(false);
    const [isEditBillingModalVisible, setIsEditBillingModalVisible] = useState(false);
    const [isAddPaymentModalVisible, setIsAddPaymentModalVisible] = useState(false);

    const allBillingData = useSelector((state) => state?.salesbilling?.salesbilling?.data || []);
    const currentBill = allBillingData.find(bill => bill.id === billingId);

    const closeEditBillingModal = () => {
        setIsEditBillingModalVisible(false);
    };

    const closeAddPaymentModal = () => {
        setIsAddPaymentModalVisible(false);
    };

    const handleAddPayment = () => {
        setIsAddPaymentModalVisible(true);
    };

    return (
        <>
            <div className="bg-white rounded-md p-6">
                <div className="w-full">
                    <div className="flex flex-col space-y-8">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 w-full">
                            <div className="flex flex-col items-center text-center md:w-1/3">
                                <div className="text-green-500 mb-2 text-3xl">
                                    <PlusOutlined />
                                </div>
                                <h3 className="text-green-500 font-medium text-lg mt-2">Create Bill</h3>
                                <p className="text-sm text-gray-500 flex items-center justify-center mt-2 text-center">
                                    <ClockCircleOutlined className="mr-1" />
                                    Created on 05-01-2024
                                </p>
                            </div>
                            <div className="hidden md:block lg:block w-0 h-0 md:w-56 md:h-0.5 bg-gray-300"></div>
                            <div className="flex flex-col items-center text-center md:w-1/3">
                                <div className="text-orange-500 mb-2 text-3xl mt-2">
                                    <MailOutlined />
                                </div>
                                <h3 className="text-orange-500 font-medium text-lg mt-2">Send Bill</h3>
                                <p className="text-sm text-gray-500 flex items-center justify-center mt-2">
                                    <ClockCircleOutlined className="mr-1" />
                                    Sent on 05-01-2024
                                </p>
                            </div>
                            <div className="hidden md:block lg:block w-0 h-0 md:w-56 md:h-0.5 bg-gray-300"></div>
                            <div className="flex flex-col items-center text-center md:w-1/3">
                                <div className="text-cyan-500 mb-2 text-3xl">
                                    <BsCurrencyDollar />
                                </div>
                                <h3 className="text-cyan-500 font-medium text-lg mt-2">Get Paid</h3>
                                <p className="text-sm text-gray-500 mt-2">Status: Awaiting payment</p>
                                <Button 
                                    type="primary" 
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md text-sm" 
                                    onClick={handleAddPayment}
                                >
                                    <PlusOutlined />
                                    <span className="ml-2">Add Payment</span>
                                </Button>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Add Payment"
                visible={isAddPaymentModalVisible}
                onCancel={closeAddPaymentModal}
                footer={null}
                width={800}
                className='mt-[-70px]'
            >
                <AddPayment 
                    onClose={closeAddPaymentModal} 
                    billNumber={currentBill?.billNumber}
                />
            </Modal>
            <Modal
                title="Edit Billing"
                visible={isEditBillingModalVisible}
                onCancel={closeEditBillingModal}
                footer={null}
                width={1000}
                className='mt-[-70px]'
            >
                <EditBilling onClose={closeEditBillingModal} />
            </Modal>

        </>
    );
};

export default BillingDetailsList;
