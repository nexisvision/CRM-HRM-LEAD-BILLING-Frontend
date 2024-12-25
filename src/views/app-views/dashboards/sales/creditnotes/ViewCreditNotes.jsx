
import React, { useState } from 'react';
// import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import CreditSummaryList from './CreditSummary/CreditSummaryList';
import ReceiptSummaryList from './Receipt Summary/ReceiptSummaryList';
import ProductSummaryList from "./ProductSummary/ProductSummaryList"

function ViewCreditNotes() {

    return (
        <>
        <div className=''>
            <div className='bg-gray-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg pt-3'>
            <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
                
            <div className='p-10 pt-3 pb-3'>
                <ProductSummaryList />
            </div>
            
            <div className='px-10 pb-3'>
                <ReceiptSummaryList />
            </div>

            <div className='px-10 pb-3'>
                <CreditSummaryList />
            </div>
            </div>
            </div>

        </>
    )
}

export default ViewCreditNotes;


