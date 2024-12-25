import React, { useState } from 'react';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { InfoCircleOutlined, MailOutlined } from "@ant-design/icons";
import DebitSummaryList from './DebitSummary/DebitSummaryList';
import ProductSummaryList from "./ProductSummary/ProductSummaryList";
import PaymentSummaryList from './PaymentSummary/PaymentSummaryList';
import BillingDetailsList from './BillingDetails/BillingDetailsList';
import BillInformationList from './BillInformation/BillInformationList';
import AddDebitBill from './AddDebitBill';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

function ViewBilling() {
    const [isAddBillingModalVisible, setIsAddBillingModalVisible] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Modal functions
    const openAddBillingModal = () => setIsAddBillingModalVisible(true);
    const closeAddBillingModal = () => setIsAddBillingModalVisible(false);

    // Function to handle bill resend
    const handleResendBill = async () => {
        try {
            setIsResending(true);
            const response = await axios.post('/api/bills/resend', {
                billId: 'BILL123',
                recipientEmail: 'customer@example.com'
            });

            if (response.status === 200) {
                message.success('Bill has been resent successfully!');
            }
        } catch (error) {
            console.error('Error resending bill:', error);
            if (error.response) {
                switch (error.response.status) {
                    case 404:
                        message.error('Bill not found');
                        break;
                    case 429:
                        message.warning('Please wait before resending the bill again');
                        break;
                    default:
                        message.error('Failed to resend bill. Please try again later.');
                }
            } else {
                message.error('Network error. Please check your connection.');
            }
        } finally {
            setIsResending(false);
        }
    };

    // Confirmation modal before resending
    const showResendConfirmation = () => {
        Modal.confirm({
            title: 'Resend Bill',
            content: 'Are you sure you want to resend this bill?',
            okText: 'Yes, Resend',
            cancelText: 'Cancel',
            onOk: handleResendBill,
            okButtonProps: {
                className: 'bg-blue-500 hover:bg-blue-600',
                loading: isResending
            }
        });
    };

    // Function to handle PDF download of billing information and product summary
    const handleDownloadPDF = async () => {
        try {
            setIsDownloading(true);
            
            // Get the container with both sections
            const element = document.getElementById('download-sections');
            
            if (!element) {
                throw new Error('Content sections not found');
            }

            const opt = {
                margin: [10, 10, 10, 10],
                filename: `Bill-Information-and-Products-${Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    logging: false
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait'
                }
            };

            await html2pdf().set(opt).from(element).save();
            message.success('Bill information and products downloaded successfully!');
        } catch (error) {
            console.error('Error downloading content:', error);
            message.error('Failed to download content. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <div className='bg-gray-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg pt-3'>
                <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>

                <div className='p-10 pt-3 pb-3'>
                    <BillingDetailsList />
                </div>

                <div className="flex justify-end space-x-4 mb-2 mr-10">
                    {/* Add Debit Note Button */}
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors" 
                        onClick={openAddBillingModal}
                    >
                        Add Debit Note
                    </button>

                    {/* Resend Button */}
                    <button
                        onClick={showResendConfirmation}
                        disabled={isResending}
                        className={`
                            px-4 py-2 rounded-md
                            flex items-center space-x-2
                            ${isResending 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600'
                            }
                            text-white transition-colors duration-200
                        `}
                    >
                        <MailOutlined className={`${isResending ? 'animate-spin' : ''}`} />
                        <span>{isResending ? 'Resending...' : 'Resend Bill'}</span>
                    </button>

                    {/* Download Information Button */}
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className={`
                            px-4 py-2 rounded-md
                            flex items-center space-x-2
                            ${isDownloading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600'
                            }
                            text-white transition-colors duration-200
                        `}
                    >
                        <span>{isDownloading ? 'Downloading...' : 'Download Bill & Products'}</span>
                    </button>
                </div>

                {/* Container for sections to be downloaded */}
                <div id="download-sections">
                    {/* Billing Information Section */}
                    <div className='p-10 pt-3 pb-3'>
                        <BillInformationList />
                    </div>

                    {/* Product Summary Section */}
                    <div className='p-10 pt-3 pb-3'>
                        <ProductSummaryList />
                    </div>
                </div>

                <div className='px-10 pb-3'>
                    <PaymentSummaryList />
                </div>

                <div className='px-10 pb-3'>
                    <DebitSummaryList />
                </div>
            </div>

            {/* Add Billing Modal */}
            <Modal
                title="Create Debit Note"
                visible={isAddBillingModalVisible}
                onCancel={closeAddBillingModal}
                footer={null}
                width={800}
                className='mt-[-70px]'
            >
                <AddDebitBill onClose={closeAddBillingModal} />
            </Modal>
        </>
    );
}

export default ViewBilling;