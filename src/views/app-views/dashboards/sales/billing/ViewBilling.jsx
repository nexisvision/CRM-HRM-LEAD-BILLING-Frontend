import React, { useState } from 'react';
import { Card, Modal } from 'antd';
import ProductSummaryList from "./ProductSummary/ProductSummaryList";
import BillingDetailsList from './BillingDetails/BillingDetailsList';
import BillInformationList from './BillInformation/BillInformationList';
import AddDebitBill from './AddDebitBill';

function ViewBilling({ billingId }) {
    const [isAddBillingModalVisible, setIsAddBillingModalVisible] = useState(false);
    const [billStatus, setBillStatus] = useState(null);
    const closeAddBillingModal = () => setIsAddBillingModalVisible(false);
    const handleStatusUpdate = (status) => {
        setBillStatus(status);
    };

    return (
        <>
            <div className='bg-gray-50 ml-[-51px] mr-[-24px] mt-[-52px] mb-[-30px] rounded-t-lg rounded-b-lg p-10'>
                <hr className="mb-6 border-b  font-medium"></hr>

                {billStatus !== 'paid' && (
                    <div className='p-10 pt-3 pb-3'>
                        <BillingDetailsList billingId={billingId} />
                    </div>
                )}

                <Card className=''>
                    <div id="download-sections">
                        <div className='pt-3 pb-3'>
                            <BillInformationList
                                billingId={billingId}
                                onStatusUpdate={handleStatusUpdate}
                            />
                        </div>
                        <div className='pb-3'>
                            <ProductSummaryList billingId={billingId} />
                        </div>
                    </div>
                </Card>
            </div>
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