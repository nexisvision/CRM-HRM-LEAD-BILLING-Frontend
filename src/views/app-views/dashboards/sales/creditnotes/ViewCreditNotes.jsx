import React, { useEffect } from 'react';
// import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import CreditSummaryList from './CreditSummary/CreditSummaryList';
import ReceiptSummaryList from './Receipt Summary/ReceiptSummaryList';
import ProductSummaryList from "./ProductSummary/ProductSummaryList"
import { useSelector, useDispatch } from 'react-redux';
import { getInvoice } from '../invoice/InvoiceReducer/InvoiceSlice';

const ViewCreditNotes = ({ creditNoteId, onClose }) => {
    const dispatch = useDispatch();
    
    const selectedCreditNote = useSelector((state) => 
        state.creditnotes.creditnotes.data?.find(note => note.id === creditNoteId)
    );
    
    const relatedInvoice = useSelector((state) => 
        state.salesInvoices.salesInvoices.data?.find(inv => inv.id === selectedCreditNote?.invoice)
    );

    useEffect(() => {
        dispatch(getInvoice());
    }, [dispatch]);

    if (!selectedCreditNote || !relatedInvoice) {
        return <div>Loading...</div>;
    }

    return (
        
            <ProductSummaryList 
                selectedCreditNote={selectedCreditNote} 
                invoiceData={relatedInvoice}
            />
    );
};

export default ViewCreditNotes;


