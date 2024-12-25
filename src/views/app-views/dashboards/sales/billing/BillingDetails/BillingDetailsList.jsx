import React,{useState} from "react";
import { PlusOutlined, MailOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { BsCurrencyDollar } from "react-icons/bs";
import { Row, Card, Col, Table, Select, Input, Button, Badge, Menu, Modal, Tag } from 'antd';
import EditBilling from '../EditBilling';
import AddBilling from '../AddBilling';

const BillingDetailsList = () => {
    const [isAddBillingModalVisible, setIsAddBillingModalVisible] = useState(false);
    const [isEditBillingModalVisible, setIsEditBillingModalVisible] = useState(false);

    // Open Add Job Modal
    const openAddBillingModal = () => {
        setIsAddBillingModalVisible(true);
    };

    // Close Add Job Modal
    const closeAddBillingModal = () => {
        setIsAddBillingModalVisible(false);
    };

    // Open Add Job Modal
    const openEditBillingModal = () => {
        setIsEditBillingModalVisible(true);
    };

    // Close Add Job Modal
    const closeEditBillingModal = () => {
        setIsEditBillingModalVisible(false);
    };


    return (
        <>
            <div className="bg-white rounded-md p-6">
                <div className="w-full">
                    {/* Progress Steps Section */}
                    <div className="flex flex-col space-y-8">
                        {/* Status Timeline */}
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 w-full">
                            {/* Create Bill Stage */}
                            <div className="flex flex-col items-center text-center md:w-1/3">
                                <div className="text-green-500 mb-2 text-3xl">
                                    <PlusOutlined />
                                </div>
                                <h3 className="text-green-500 font-medium text-lg mt-2">Create Bill</h3>
                                <p className="text-sm text-gray-500 flex items-center justify-center mt-2 text-center">
                                    <ClockCircleOutlined className="mr-1" />
                                    Created on 05-01-2024
                                </p>
                                <Button type="primary" className="mt-4 px-4 bg-blue-500 text-white rounded-md text-sm" onClick= {openEditBillingModal}>
                                    <span className="ml-2">Edit</span>
                                </Button>
                                {/* <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md text-sm">
                Edit
              </button> */}
                            </div>

                            {/* Connector Line */}
                            <div className="hidden md:block w-56 h-0.5 bg-gray-300"></div>

                            {/* Send Bill Stage */}
                            <div className="flex flex-col items-center text-center md:w-1/3 pb-16 ">
                                <div className="text-orange-500 mb-2 text-3xl mt-2">
                                    <MailOutlined />
                                </div>
                                <h3 className="text-orange-500 font-medium text-lg mt-2">Send Bill</h3>
                                <p className="text-sm text-gray-500 flex items-center justify-center mt-2">
                                    <ClockCircleOutlined className="mr-1" />
                                    Sent on 05-01-2024
                                </p>
                            </div>

                            {/* Connector Line */}
                            <div className="hidden md:block lg:block w-0 h-0 md:w-56 md:h-0.5 bg-gray-300"></div>

                            {/* Get Paid Stage */}
                            <div className="flex flex-col items-center text-center md:w-1/3">
                                <div className="text-cyan-500 mb-2 text-3xl">
                                    <BsCurrencyDollar />
                                </div>
                                <h3 className="text-cyan-500 font-medium text-lg mt-2">Get Paid</h3>
                                <p className="text-sm text-gray-500 mt-2">Status: Awaiting payment</p>
                                <Button type="primary" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md text-sm" onClick={openAddBillingModal}>
                                    <PlusOutlined />
                                    <span className="ml-2">Add Payment</span>
                                </Button>
                                {/* <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md text-sm">
                                    Add Payment
                                </button> */}
                            </div>
                        </div>

                        {/* Responsive Connector Lines */}
                        {/* <div className="block md:hidden  items-center justify-center space-x-4">
            <div className="w-10 h-0.5 bg-gray-300"></div>
            <div className="w-10 h-0.5 bg-gray-300"></div>
          </div> */}
                    </div>
                </div>
            </div>

            <Modal
                title="Create Billing"
                visible={isAddBillingModalVisible}
                onCancel={closeAddBillingModal}
                footer={null}
                width={1000}
                className='mt-[-70px]'
            >
                <AddBilling onClose={closeAddBillingModal} />
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
