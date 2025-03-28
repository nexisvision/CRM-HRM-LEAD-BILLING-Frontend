import React, { useEffect, useState } from 'react';
import { PrinterOutlined, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { Table, Button, Select } from 'antd';
import dayjs from 'dayjs';
import { getAllInvoices } from "../invoice/invoicereducer/InvoiceSlice";
import NumberFormat from 'react-number-format';
import html2pdf from 'html2pdf.js';
import { useDispatch, useSelector } from 'react-redux';
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice"
import { getsignaturesss } from 'views/app-views/setting/esignature/EsignatureReducers/EsignatureSlice';
import { getgeneralsettings } from '../../../setting/general/generalReducer/generalSlice';

import { useParams } from 'react-router-dom';
const { Option } = Select;

const InvoiceView = ({ idd, onClose, email, invoiceData }) => {

    const dispatch = useDispatch();
    const [template, setTemplate] = useState('rendertemplate');
    const { id } = useParams();
    const { invoices, loading, error } = useSelector((state) => state.invoice);
    const invoiceDataa = invoices.find(invoice => invoice.id === idd);
    const [parsedInvoice, setParsedInvoice] = useState({ items: [] });
    const [generalSettings, setGeneralSettings] = useState(null);
    const allloggeduser = useSelector((state) => state.user.loggedInUser)
    const allclient = useSelector((state) => state.SubClient.SubClient.data);
    const [selectedSignature, setSelectedSignature] = useState(null);
    const [selectedSignatureName, setSelectedSignatureName] = useState(null);
    const [isSignatureConfirmed, setIsSignatureConfirmed] = useState(false);
    const signatures = useSelector((state) => state?.esignature?.esignature?.data);
    const clientDataa = allclient.find((SubClient) => SubClient.id === invoiceDataa?.client);
    const generalSettingsData = useSelector((state) => state.generalsetting.generalsetting.data);
    useEffect(() => {
        dispatch(getgeneralsettings());
    }, [dispatch]);

    useEffect(() => {
        dispatch(ClientData());
    }, [dispatch]);


    useEffect(() => {
        dispatch(getAllInvoices(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (generalSettingsData && generalSettingsData.length > 0) {
            setGeneralSettings(generalSettingsData[0]);
        }
    }, [generalSettingsData]);


    useEffect(() => {
        if (invoiceData?.items) {
            try {
                const items = typeof invoiceData.items === "string"
                    ? JSON.parse(invoiceData.items)
                    : invoiceData.items;

                setParsedInvoice({
                    ...invoiceData,
                    items: Object.values(items),
                    discount: invoiceData.discount || 0,
                    tax: invoiceData.tax ?? 0
                });
            } catch (error) {
                console.error('Error parsing items:', error);
            }
        }
    }, [invoiceData]);

    useEffect(() => {
        dispatch(getsignaturesss());
    }, [dispatch]);

    const handleSignatureSelect = (value) => {
        const sig = signatures.find(s => s.esignature_name === value);
        setSelectedSignatureName(value);
        setSelectedSignature(sig?.e_signatures || null);
        setIsSignatureConfirmed(false);
    };

    const handleConfirmSignature = () => {
        setIsSignatureConfirmed(true);
    };

    const handleRemoveSignature = () => {
        setSelectedSignature(null);
        setSelectedSignatureName(null);
        setIsSignatureConfirmed(false);
    };

    const renderSignatureSection = () => (
        <div>
            <div className="flex justify-end items-center gap-4">
                {!isSignatureConfirmed && (
                    <div className="flex flex-col">
                        <h4 className="font-semibold text-lg mb-2">Select Signature:</h4>
                        <Select
                            style={{ width: 200 }}
                            placeholder="Select a signature"
                            value={selectedSignatureName}
                            onChange={handleSignatureSelect}
                        >
                            {signatures?.map((sig) => (
                                <Option key={sig.id} value={sig.esignature_name}>
                                    {sig.esignature_name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                )}
                {selectedSignature && (
                    <div className='flex flex-col relative'>
                        <h4 className="font-semibold text-lg mb-2">Signature:</h4>
                        <div className='w-36 h-28 flex flex-col items-center justify-center relative'>
                            <img
                                src={selectedSignature}
                                alt="Digital Signature"
                                className='w-full h-full object-contain border-0'
                            />
                            {!isSignatureConfirmed && (
                                <>
                                    <button
                                        onClick={handleRemoveSignature}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full ps-3 pe-3 pt-1 pb-1 hover:bg-red-600 transition-colors border-0"
                                        title="Remove signature"
                                    >
                                        <CloseOutlined style={{ fontSize: '10px' }} />
                                    </button>
                                    <button
                                        onClick={handleConfirmSignature}
                                        className="bg-green-500 text-white rounded-md px-4 py-1 hover:bg-green-600 transition-colors mt-4"
                                    >
                                        Confirm
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return <div>Loading invoices...</div>;
    }

    if (error) {
        return <div>Error loading invoices. Please try again later.</div>;
    }

    if (!invoiceDataa) {
        return <div>Invoice not found</div>;
    }

    const handlePrint = () => {
        const printStyles = `
            @media print {
                body * {
                    visibility: hidden;
                }
                #printable-content, #printable-content * {
                    visibility: visible;
                }
                #printable-content {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .no-print {
                    display: none !important;
                }
                @page {
                    size: A4;
                    // margin: 10mm;
                }
                .ant-table {
                    width: 100% !important;
                }
                .ant-table-thead > tr > th {
                    background-color: #f5f5f5 !important;
                    color: #000000 !important;
                }
                .signature-image {
                    display: block !important;
                }
            }
        `;

        // Add print styles
        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = printStyles;
        document.head.appendChild(styleSheet);

        // Print the specific content
        window.print();

        // Remove the print styles
        document.head.removeChild(styleSheet);
    };


    const handleDownload = () => {
        const element = document.getElementById('printable-content');
        const opt = {
            margin: 1,
            filename: 'invoice.pdf',
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

        html2pdf().set(opt).from(element).save();
    };




    const calculateSubtotal = () => {
        if (!parsedInvoice?.items) return 0;
        return Object.values(parsedInvoice.items).reduce((sum, item) =>
            sum + parseFloat(item.final_amount || 0), 0
        );
    };

    const renderModernTemplate = () => {
        return (
            <div className="bg-white p-6">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 mb-6 rounded-lg">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl text-gray-700">Invoice</h1>
                        <div className="flex items-center">
                            {generalSettings?.companylogo ? (
                                <img
                                    src={generalSettings.companylogo}
                                    alt="Company Logo"
                                    className="h-16 mx-auto"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-indigo-600">Company Logo</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mb-8">
                    <div>
                        <div className='flex items-center'>
                            <span className=" me-2 font-weight-semibold ">Invoice Num:</span>
                            <p className='text-right'>{invoiceDataa?.invoiceNumber}</p>
                        </div>
                        <div className='flex items-center'>
                            <span className="me-2 font-weight-semibold">Issue Date:</span>
                            <p>{invoiceDataa?.issueDate ? dayjs(invoiceDataa.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex items-center'>
                            <span className="me-2 font-weight-semibold">Due Date:</span>
                            <p>{invoiceDataa?.dueDate ? dayjs(invoiceDataa.dueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                    </div>
                </div>

                {/* Customer Info Section */}
                <div className="mb-8">

                    <div className="grid grid-cols-2 gap-x-20 gap-y-4">
                        <div className='text-left'>
                            <address>
                                <p>

                                    <span className="font-weight-semibold text-dark font-size-lg">Billed By:</span><br />
                                    {allloggeduser ? (
                                        <>
                                            <p>
                                                <span className="font-weight-semibold">Address:</span> {allloggeduser?.address}, {allloggeduser?.city}, {allloggeduser?.state}, {allloggeduser?.zip}, {allloggeduser?.country}
                                            </p>
                                            <p> <span className="font-weight-semibold ">Email: </span> {allloggeduser?.email}</p>
                                            <p> <span className="font-weight-semibold ">Website: </span> {allloggeduser?.website}</p>
                                            <p> <span className="font-weight-semibold ">Phone: </span> {allloggeduser?.phone}</p>
                                            <p> <span className="font-weight-semibold ">GstIn: </span> {allloggeduser?.gstIn}</p>
                                        </>
                                    ) : (
                                        <>
                                            <span>Address not found</span><br />
                                            <span>City not found</span><br />
                                            <p>Email: Email not found</p>
                                            <p>Phone: Phone not found</p>
                                        </>
                                    )}
                                </p>
                            </address>
                        </div>

                        {/* Company Details Section */}
                        <div>
                            <span className="font-weight-bold text-dark font-size-lg">Billed To:</span><br />
                            {clientDataa ? (
                                <address>
                                    <p>
                                        <span> <span className="font-weight-semibold  ">Name: </span>{clientDataa.firstName}</span>
                                        <p>
                                            <span className="font-weight-semibold">Address:</span> {clientDataa.address}
                                        </p>
                                        <p> <span className="font-weight-semibold">Email: </span> {clientDataa.email}</p>
                                        <p> <span className="font-weight-semibold  ">Phone: </span> {clientDataa.phone}</p>
                                        <p> <span className="font-weight-semibold  ">GstIn: </span> {clientDataa.gstIn}</p>
                                    </p>
                                </address>
                            ) : (
                                <p>Loading client data...</p>
                            )}
                        </div>

                    </div>
                </div>

                {/* Items Table */}
                <div className="">
                    {parsedInvoice && parsedInvoice.items && (
                        <Table
                            dataSource={parsedInvoice.items}
                            pagination={false}
                            className="mb-2"
                        // scroll={{ x: 1000 }}
                        >
                            <Table.Column
                                title="No."
                                key="key"
                                render={(text, record, index) => index + 1}
                            />
                            <Table.Column
                                title="Product"
                                dataIndex="item"
                                key="item"
                            />
                            <Table.Column
                                title="Quantity"
                                dataIndex="quantity"
                                key="quantity"
                            />
                            <Table.Column
                                title="Original Price"
                                render={(record) => (
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round(record.price * 100) / 100}
                                        // prefix="$"
                                        thousandSeparator={true}
                                    />
                                )}
                                key="price"
                            />
                            <Table.Column
                                title="HSN/SAC"
                                key="hsn_sac"
                                render={(record) => {
                                    return `${record?.hsn_sac || "--"}`;
                                }}
                            />
                            <Table.Column
                                title="GST Name"
                                key="tax_name"
                                render={(record) => {
                                    return record?.tax_name || 'N/A';
                                }}
                            />

                            <Table.Column
                                title="Discount (%)"
                                render={(record) => `${record.discount_percentage || 0}%`}
                                key="discount_percentage"
                            />
                            <Table.Column
                                title="Tax (%)"
                                render={(record) => `${record.tax_percentage || 0}%`}
                                key="tax_percentage"
                            />
                            <Table.Column
                                title="Amount"
                                render={(record) => (
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round((record.final_amount || 0))}
                                        // prefix="$"
                                        thousandSeparator={true}
                                    />
                                )}
                                key="amount"
                            />
                        </Table>
                    )}

                    {/* Invoice Summary */}
                    {parsedInvoice && (
                        <div className="d-flex justify-content-end mb-3 mt-3">
                            <div className="text-start">
                                <div className="border-bottom">
                                    <p >
                                        <span className="font-weight-semibold ">Sub-Total : </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={calculateSubtotal()}
                                            thousandSeparator={true}
                                        />
                                    </p>
                                    <p>
                                        <span className="font-weight-semibold ">Total Discount : </span>
                                        {`${parsedInvoice.discount || 0}%`}
                                    </p>
                                    <p>
                                        <span className="font-weight-semibold ">Total Discount Amount: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={Object.values(parsedInvoice.items).reduce((sum, item) => sum + (item.discount_amount || 0), 0)}
                                            thousandSeparator={true}
                                        />
                                    </p>
                                    <p>
                                        <span className="font-weight-semibold ">Total Tax Amount: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={Object.values(parsedInvoice.items).reduce((sum, item) => sum + (item.tax_amount || 0), 0)}
                                            thousandSeparator={true}
                                        />
                                    </p>
                                </div>
                                <h2 className="mt-3">
                                    <span className="mr-1 font-weight-semibold ">Final Total: </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={parsedInvoice.total}
                                        thousandSeparator={true}
                                    />
                                </h2>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex gap-4">
                        <div className='flex'>
                        </div>
                        <div>
                            <h4 className="font-weight-semibold text-lg mb-2">Payment Info:</h4>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>Account Holder Name : </p>
                                <p>{clientDataa?.accountholder || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>

                                <p className='font-weight-semibold'>Account Number : </p>
                                <p>{clientDataa?.accountnumber || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>IFSC : </p>
                                <p>{clientDataa?.ifsc || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>Account Type : </p>
                                <p>{clientDataa?.branch || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>Bank Name : </p>
                                <p>{clientDataa?.bankname || 'N/A'}</p>
                            </div>

                        </div>
                    </div>
                    <div>
                        <div className="flex justify-end items-center">
                            <div className=" rounded-lg p-8">

                                {renderSignatureSection()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    <h4 className="font-weight-semibold text-lg mb-2">Terms & Conditions:</h4>
                    {generalSettings?.termsandconditions ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: generalSettings.termsandconditions
                            }}
                            className="text-gray-600 text-sm"
                        />
                    ) : (
                        <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
                            <li>This is a GST based invoice bill,Which is applicable for TDS Deduction</li>
                            <li>We are not the manufactures, company will stand for warranty as per their terms and conditions.</li>
                        </ol>
                    )}
                </div>

                <div className="text-center mt-8">
                    <p>Thanks for your Business</p>
                </div>
            </div>
        );
    };

    const renderTemplate = () => {
        // Add checks for required data
        if (!invoiceDataa || !parsedInvoice) {
            return <div>Loading invoice data...</div>;
        }

        return (
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div>
                    {generalSettings?.companylogo ? (
                        <img
                            src={generalSettings.companylogo}
                            alt="Company Logo"
                            className="h-16 "
                        />
                    ) : (
                        <span className="text-2xl font-bold text-indigo-600">Company Logo</span>
                    )}
                </div>
                <div className="d-md-flex justify-content-md-between">
                    {/* Company Details Section */}
                    <div className='text-left'>
                        <address>
                            <p>

                                <span className="font-weight-semibold text-dark font-size-lg">Billed By:</span><br />
                                {allloggeduser ? (
                                    <>
                                        <p>
                                            <span className="font-weight-semibold">Address:</span> {allloggeduser?.address}, {allloggeduser?.city}, {allloggeduser?.state}, {allloggeduser?.zip}, {allloggeduser?.country}
                                        </p>
                                        <p> <span className="font-weight-semibold ">Email: </span> {allloggeduser?.email}</p>
                                        <p> <span className="font-weight-semibold ">Website: </span> {allloggeduser?.website}</p>
                                        <p> <span className="font-weight-semibold ">Phone: </span> {allloggeduser?.phone}</p>
                                        <p> <span className="font-weight-semibold">GstIn: </span> {allloggeduser?.gstIn}</p>
                                    </>
                                ) : (
                                    <>
                                        <span>Address not found</span><br />
                                        <span>City not found</span><br />
                                        <p>Email: Email not found</p>
                                        <p>Phone: Phone not found</p>
                                    </>
                                )}
                            </p>
                        </address>
                    </div>
                    {/* Client Details Section */}
                    <div>
                        <span className="font-weight-bold text-dark font-size-lg">Billed To:</span><br />
                        {clientDataa ? (
                            <address>
                                <p>
                                    <span> <span className="font-weight-semibold  ">Name: </span>{clientDataa.firstName}</span>
                                    <p>
                                        <span className="font-weight-semibold">Address:</span> {clientDataa.address}
                                    </p>
                                    <p> <span className="font-weight-semibold ">Email: </span> {clientDataa.email}</p>
                                    <p> <span className="font-weight-semibold  ">Phone: </span> {clientDataa.phone}</p>
                                    <p> <span className="font-weight-semibold  ">GstIn: </span> {clientDataa.gstIn}</p>
                                </p>
                            </address>
                        ) : (
                            <p>Loading client data...</p>
                        )}
                    </div>

                    {/* Invoice Details Section */}
                    <div>
                        <div className='flex items-center'>
                            <span className=" me-2 font-weight-semibold">Invoice Num:</span>
                            <p className='text-right'>{invoiceDataa?.invoiceNumber}</p>
                        </div>
                        <div className='flex items-center'>
                            <span className="me-2 font-weight-semibold ">Issue Date:</span>
                            <p>{invoiceDataa?.issueDate ? dayjs(invoiceDataa.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex items-center'>
                            <span className="me-2 font-weight-semibold ">Due Date:</span>
                            <p>{invoiceDataa?.dueDate ? dayjs(invoiceDataa.dueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    {parsedInvoice && parsedInvoice.items && (
                        <Table
                            dataSource={parsedInvoice.items}
                            pagination={false}
                            className="mb-2"
                        >
                            <Table.Column
                                title="No."
                                key="key"
                                render={(text, record, index) => index + 1}
                            />
                            <Table.Column
                                title="Product"
                                dataIndex="item"
                                key="item"
                            />
                            <Table.Column
                                title="Quantity"
                                dataIndex="quantity"
                                key="quantity"
                            />
                            <Table.Column
                                title="Original Price"
                                render={(record) => (
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round(record.price * 100) / 100}
                                        thousandSeparator={true}
                                    />
                                )}
                                key="price"
                            />
                            <Table.Column
                                title="HSN/SAC"
                                key="hsn_sac"
                                render={(record) => {
                                    return `${record?.hsn_sac || "--"}`;
                                }}
                            />
                            <Table.Column
                                title="GST Name"
                                key="tax_name"
                                render={(record) => {
                                    return record?.tax_name || 'N/A';
                                }}
                            />
                            <Table.Column
                                title="Discount (%)"
                                render={(record) => `${record.discount_percentage || 0}%`}
                                key="discount_percentage"
                            />
                            <Table.Column
                                title="Tax (%)"
                                render={(record) => `${record.tax_percentage || 0}%`}
                                key="tax_percentage"
                            />
                            <Table.Column
                                title="Amount"
                                render={(record) => (
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round((record.final_amount || 0))}
                                        thousandSeparator={true}
                                    />
                                )}
                                key="amount"
                            />
                        </Table>
                    )}

                    {/* Invoice Summary */}
                    {parsedInvoice && (
                        <div className="d-flex justify-content-end mb-3 mt-3">
                            <div className="text-start">
                                <div className="border-bottom">
                                    <p >
                                        <span className="font-weight-semibold ">Sub-Total : </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={calculateSubtotal()}
                                            thousandSeparator={true}
                                        />
                                    </p>
                                    <p>
                                        <span className="font-weight-semibold ">Total Discount : </span>
                                        {`${parsedInvoice.discount || 0}%`}
                                    </p>
                                    <p>
                                        <span className="font-weight-semibold ">Total Discount Amount: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={Object.values(parsedInvoice.items).reduce((sum, item) => sum + (item.discount_amount || 0), 0)}
                                            thousandSeparator={true}
                                        />
                                    </p>
                                    <p>
                                        <span className="font-weight-semibold ">Total Tax Amount: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={Object.values(parsedInvoice.items).reduce((sum, item) => sum + (item.tax_amount || 0), 0)}
                                            thousandSeparator={true}
                                        />
                                    </p>
                                </div>
                                <h2 className="mt-3">
                                    <span className="mr-1 font-weight-semibold ">Final Total: </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={parsedInvoice.total}
                                        thousandSeparator={true}
                                    />
                                </h2>
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment Information & Terms */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex gap-4">
                        <div className='flex'>
                        </div>
                        <div>
                            <h4 className="font-weight-semibold text-lg mb-2">Payment Info:</h4>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>Account Holder Name : </p>
                                <p>{clientDataa?.accountholder || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>

                                <p className='font-weight-semibold'>Account Number : </p>
                                <p>{clientDataa?.accountnumber || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>IFSC : </p>
                                <p>{clientDataa?.ifsc || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>Account Type : </p>
                                <p>{clientDataa?.branch || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>Bank Name : </p>
                                <p>{clientDataa?.bankname || 'N/A'}</p>
                            </div>

                        </div>
                    </div>
                    <div>
                        <div className="flex justify-end items-center">
                            <div className=" rounded-lg p-8">
                                {renderSignatureSection()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    <h4 className="font-weight-semibold text-lg mb-2">Terms & Conditions:</h4>
                    {generalSettings?.termsandconditions ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: generalSettings.termsandconditions
                            }}
                            className="text-gray-600 text-sm"
                        />
                    ) : (
                        <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
                            <li>This is a GST based invoice bill,Which is applicable for TDS Deduction</li>
                            <li>We are not the manufactures, company will stand for warranty as per their terms and conditions.</li>
                        </ol>
                    )}
                </div>

                <div className="text-center font-semibold mt-8">
                    <p>Thanks for your Business</p>
                </div>
            </div>
        );
    };

    const renderClassicTemplate = () => {
        if (!parsedInvoice) return null;

        return (
            <div className="bg-white p-8 border-2 border-gray-200">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div>
                        {generalSettings?.companylogo ? (
                            <img
                                src={generalSettings.companylogo}
                                alt="Company Logo"
                                className="h-16 mx-auto"
                            />
                        ) : (
                            <span className="text-2xl font-bold text-indigo-600">Company Logo</span>
                        )}
                    </div>
                    <div className="text-gray-600 mt-4">
                        <div className='flex items-center'>
                            <span className=" me-2 font-weight-semibold ">Invoice Num:</span>
                            <p className='text-right'>{invoiceDataa?.invoiceNumber}</p>
                        </div>
                        <div className='flex items-center'>
                            <span className="me-2 font-weight-semibold ">Issue Date:</span>
                            <p>{invoiceDataa?.issueDate ? dayjs(invoiceDataa.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex items-center'>
                            <span className="me-2 font-weight-semibold ">Due Date:</span>
                            <p>{invoiceDataa?.dueDate ? dayjs(invoiceDataa.dueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                    </div>
                </div>


                {/* Address Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="border-r pr-8 text-left">
                        <div className='text-left'>
                            <address>
                                <p>

                                    <span className="font-weight-semibold text-dark font-size-lg">Billed By:</span><br />
                                    {allloggeduser ? (
                                        <>
                                            <p>
                                                <span className="font-weight-semibold">Address:</span> {allloggeduser?.address}, {allloggeduser?.city}, {allloggeduser?.state}, {allloggeduser?.zip}, {allloggeduser?.country}
                                            </p>
                                            <p> <span className="font-weight-semibold ">Email: </span> {allloggeduser?.email}</p>
                                            <p> <span className="font-weight-semibold ">Website: </span> {allloggeduser?.website}</p>
                                            <p> <span className="font-weight-semibold ">Phone: </span> {allloggeduser?.phone}</p>
                                            <p> <span className="font-weight-semibold ">GstIn: </span> {allloggeduser?.gstIn}</p>
                                        </>
                                    ) : (
                                        <>
                                            <span>Address not found</span><br />
                                            <span>City not found</span><br />
                                            <p>Email: Email not found</p>
                                            <p>Phone: Phone not found</p>
                                        </>
                                    )}
                                </p>
                            </address>
                        </div>


                    </div>
                    <div className="text-left">
                        {/* Company Details Section */}
                        <div>
                            <span className="font-weight-bold text-dark font-size-lg">Billed To:</span><br />
                            {clientDataa ? (
                                <address>
                                    <p>
                                        <span> <span className="font-weight-semibold ">Name: </span>{clientDataa.firstName}</span><br />
                                        <p>
                                            <span className="font-weight-semibold">Address:</span> {clientDataa.address}
                                        </p>
                                        <p> <span className="font-weight-semibold ">Email: </span> {clientDataa.email}</p>
                                        <p> <span className="font-weight-semibold  ">Phone: </span> {clientDataa.phone}</p>
                                        <p> <span className="font-weight-semibold  ">GstIn: </span> {clientDataa.gstIn}</p>
                                    </p>
                                </address>
                            ) : (
                                <p>Loading client data...</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="">
                    <div className="">
                        <Table dataSource={parsedInvoice.items} pagination={false} className="mb-2">
                            <Table.Column title="No." key="key" render={(text, record, index) => index + 1} />
                            <Table.Column title="Product" dataIndex="item" key="item" />
                            <Table.Column title="Quantity" dataIndex="quantity" key="quantity" />
                            <Table.Column
                                title="Original Price"
                                render={(record) => (
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round(record.price * 100) / 100}
                                        thousandSeparator={true}
                                    />
                                )}
                                key="price"
                            />
                            <Table.Column
                                title="HSN/SAC"
                                key="hsn_sac"
                                render={(record) => {
                                    return `${record?.hsn_sac || "--"}`;
                                }}
                            />
                            <Table.Column
                                title="GST Name"
                                key="tax_name"
                                render={(record) => {
                                    return record?.tax_name || 'N/A';
                                }}
                            />
                            <Table.Column
                                title="Discount (%)"
                                render={(record) => `${record.discount_percentage || 0}%`}
                                key="discount_percentage"
                            />

                            <Table.Column
                                title="Tax (%)"
                                render={(record) => `${record.tax_percentage || 0}%`}
                                key="tax_percentage"
                            />
                            <Table.Column
                                title="Amount"
                                render={(record) => (
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round((record.final_amount))}
                                        thousandSeparator={true}
                                    />
                                )}
                                key="amount"
                            />
                        </Table>

                        {/* Invoice Summary */}
                        {parsedInvoice && (
                            <div className="d-flex justify-content-end mb-3 mt-3">
                                <div className="text-start">
                                    <div className="border-bottom">
                                        <p >
                                            <span className="font-weight-semibold ">Sub-Total : </span>
                                            <NumberFormat
                                                displayType="text"
                                                value={calculateSubtotal()}
                                                // prefix="$"
                                                thousandSeparator={true}
                                            />
                                        </p>
                                        <p>
                                            <span className="font-weight-semibold ">Total Discount : </span>
                                            {`${parsedInvoice.discount || 0}%`}
                                        </p>
                                        <p>
                                            <span className="font-weight-semibold ">Total Discount Amount: </span>
                                            <NumberFormat
                                                displayType="text"
                                                value={Object.values(parsedInvoice.items).reduce((sum, item) => sum + (item.discount_amount || 0), 0)}
                                                // prefix="₹"
                                                thousandSeparator={true}
                                            />
                                        </p>
                                        <p>
                                            <span className="font-weight-semibold ">Total Tax Amount: </span>
                                            <NumberFormat
                                                displayType="text"
                                                value={Object.values(parsedInvoice.items).reduce((sum, item) => sum + (item.tax_amount || 0), 0)}
                                                thousandSeparator={true}
                                            />
                                        </p>
                                    </div>
                                    <h2 className="mt-3">
                                        <span className="mr-1 font-weight-semibold ">Final Total: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={parsedInvoice.total}
                                            // prefix="₹"
                                            thousandSeparator={true}
                                        />
                                    </h2>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex gap-4">
                        <div className='flex'>
                        </div>
                        <div>
                            <h4 className="font-weight-semibold text-lg mb-2">Payment Info:</h4>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>Account Holder Name : </p>
                                <p>{clientDataa?.accountholder || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>

                                <p className='font-weight-semibold'>Account Number : </p>
                                <p>{clientDataa?.accountnumber || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>IFSC : </p>
                                <p>{clientDataa?.ifsc || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>Account Type : </p>
                                <p>{clientDataa?.branch || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>Bank Name : </p>
                                <p>{clientDataa?.bankname || 'N/A'}</p>
                            </div>

                        </div>
                    </div>
                    <div>
                        <div className="flex justify-end items-center">
                            <div className=" rounded-lg p-8">
                                {renderSignatureSection()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    <h4 className="font-weight-semibold text-lg mb-2">Terms & Conditions:</h4>
                    {generalSettings?.termsandconditions ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: generalSettings.termsandconditions
                            }}
                            className="text-gray-600 text-sm"
                        />
                    ) : (
                        <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
                            <li>This is a GST based invoice bill,Which is applicable for TDS Deduction</li>
                            <li>We are not the manufactures, company will stand for warranty as per their terms and conditions.</li>
                        </ol>
                    )}
                </div>
                <div className="text-center font-semibold mt-8">
                    <p>Thanks for your Business</p>
                </div>
            </div>
        );
    };

    const renderMinimalTemplate = () => {
        if (!parsedInvoice) return null;

        return (
            <div className="bg-white p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div className='text-left'>
                        <div>
                            {generalSettings?.companylogo ? (
                                <img
                                    src={generalSettings.companylogo}
                                    alt="Company Logo"
                                    className="h-16"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-indigo-600">Company Logo</span>
                            )}
                        </div>
                        <div className="text-gray-600 mt-2">
                            <div className='flex items-center'>
                                <span className=" me-2 font-weight-semibold ">Invoice Num:</span>
                                <p className='text-right'>{invoiceDataa?.invoiceNumber}</p>
                            </div>
                            <div className='flex items-center'>
                                <span className="me-2 font-weight-semibold ">Issue Date:</span>
                                <p>{invoiceDataa?.issueDate ? dayjs(invoiceDataa.issueDate).format('DD MMMM, YYYY') : ''}</p>
                            </div>
                            <div className='flex items-center'>
                                <span className="me-2 font-weight-semibold ">Due Date:</span>
                                <p>{invoiceDataa?.dueDate ? dayjs(invoiceDataa.dueDate).format('DD MMMM, YYYY') : ''}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dates & Addresses */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div className="border-r pr-8 text-left">
                        <div className='text-left'>
                            <address>
                                <p>

                                    <span className="font-weight-semibold text-dark font-size-lg">Billed By:</span><br />
                                    {allloggeduser ? (
                                        <>
                                            <p>
                                                <span className="font-weight-semibold">Address:</span> {allloggeduser?.address}, {allloggeduser?.city}, {allloggeduser?.state}, {allloggeduser?.zip}, {allloggeduser?.country}
                                            </p>
                                            <p> <span className="font-weight-semibold ">Email: </span> {allloggeduser?.email}</p>
                                            <p> <span className="font-weight-semibold ">Website: </span> {allloggeduser?.website}</p>
                                            <p> <span className="font-weight-semibold ">Phone: </span> {allloggeduser?.phone}</p>
                                            <p> <span className="font-weight-semibold ">GstIn: </span> {allloggeduser?.gstIn}</p>
                                        </>
                                    ) : (
                                        <>
                                            <span>Address not found</span><br />
                                            <span>City not found</span><br />
                                            <p>Email: Email not found</p>
                                            <p>Phone: Phone not found</p>
                                        </>
                                    )}
                                </p>
                            </address>
                        </div>

                    </div>
                    <div className="text-left">
                        {/* Client Details Section */}
                        <div>
                            <span className="font-weight-bold text-dark font-size-lg">Billed To:</span><br />
                            {clientDataa ? (
                                <address>
                                    <p>
                                        <span> <span className="font-weight-semibold">Name: </span>{clientDataa.firstName}</span>
                                        <p>
                                            <span className="font-weight-semibold">Address:</span> {clientDataa.address}
                                        </p>
                                        <p> <span className="font-weight-semibold">Email: </span> {clientDataa.email}</p>
                                        <p> <span className="font-weight-semibold">Phone: </span> {clientDataa.phone}</p>
                                        <p> <span className="font-weight-semibold">GstIn: </span> {clientDataa.gstIn}</p>
                                    </p>
                                </address>
                            ) : (
                                <p>Loading client data...</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="">
                    <div className="">
                        <Table dataSource={parsedInvoice.items} pagination={false} className="mb-2">
                            <Table.Column title="No." key="key" render={(text, record, index) => index + 1} />
                            <Table.Column title="Product" dataIndex="item" key="item" />
                            <Table.Column title="Quantity" dataIndex="quantity" key="quantity" />
                            <Table.Column
                                title="Original Price"
                                render={(record) => (
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round(record.price * 100) / 100}
                                        thousandSeparator={true}
                                    />
                                )}
                                key="price"
                            />
                            <Table.Column
                                title="HSN/SAC"
                                key="hsn_sac"
                                render={(record) => {
                                    return `${record?.hsn_sac || "--"}`;
                                }}
                            />
                            <Table.Column
                                title="GST Name"
                                key="tax_name"
                                render={(record) => {
                                    return record?.tax_name || 'N/A';
                                }}
                            />
                            <Table.Column
                                title="Discount (%)"
                                render={(record) => `${record.discount_percentage || 0}%`}
                                key="discount_percentage"
                            />

                            <Table.Column
                                title="Tax (%)"
                                render={(record) => `${record.tax_percentage || 0}%`}
                                key="tax_percentage"
                            />
                            <Table.Column
                                title="Amount"
                                render={(record) => (
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round((record.final_amount))}
                                        thousandSeparator={true}
                                    />
                                )}
                                key="amount"
                            />
                        </Table>

                        {/* Invoice Summary */}
                        {parsedInvoice && (
                            <div className="d-flex justify-content-end mb-3 mt-3">
                                <div className="text-start">
                                    <div className="border-bottom">
                                        <p >
                                            <span className="font-weight-semibold ">Sub-Total : </span>
                                            <NumberFormat
                                                displayType="text"
                                                value={calculateSubtotal()}
                                                // prefix="$"
                                                thousandSeparator={true}
                                            />
                                        </p>
                                        <p>
                                            <span className="font-weight-semibold ">Total Discount : </span>
                                            {`${parsedInvoice.discount || 0}%`}
                                        </p>
                                        <p>
                                            <span className="font-weight-semibold ">Total Discount Amount: </span>
                                            <NumberFormat
                                                displayType="text"
                                                value={Object.values(parsedInvoice.items).reduce((sum, item) => sum + (item.discount_amount || 0), 0)}
                                                // prefix="₹"
                                                thousandSeparator={true}
                                            />
                                        </p>
                                        <p>
                                            <span className="font-weight-semibold ">Total Tax Amount: </span>
                                            <NumberFormat
                                                displayType="text"
                                                value={Object.values(parsedInvoice.items).reduce((sum, item) => sum + (item.tax_amount || 0), 0)}
                                                thousandSeparator={true}
                                            />
                                        </p>
                                    </div>
                                    <h2 className="mt-3">
                                        <span className="mr-1 font-weight-semibold ">Final Total: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={parsedInvoice.total}
                                            // prefix="₹"
                                            thousandSeparator={true}
                                        />
                                    </h2>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex gap-4">
                        <div className='flex'>
                        </div>
                        <div>
                            <h4 className="font-weight-semibold text-lg mb-2">Payment Info:</h4>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>Account Holder Name : </p>
                                <p>{clientDataa?.accountholder || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>

                                <p className='font-weight-semibold'>Account Number : </p>
                                <p>{clientDataa?.accountnumber || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>IFSC : </p>
                                <p>{clientDataa?.ifsc || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>Account Type : </p>
                                <p>{clientDataa?.branch || 'N/A'}</p>
                            </div>
                            <div className='flex gap-2'>
                                <p className='font-weight-semibold'>Bank Name : </p>
                                <p>{clientDataa?.bankname || 'N/A'}</p>
                            </div>

                        </div>
                    </div>
                    <div>
                        <div className="flex justify-end items-center">
                            <div className=" rounded-lg p-8">
                                {renderSignatureSection()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    <h4 className="font-weight-semibold text-lg mb-2">Terms & Conditions:</h4>
                    {generalSettings?.termsandconditions ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: generalSettings.termsandconditions
                            }}
                            className="text-gray-600 text-sm"
                        />
                    ) : (
                        <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
                            <li>This is a GST based invoice bill,Which is applicable for TDS Deduction</li>
                            <li>We are not the manufactures, company will stand for warranty as per their terms and conditions.</li>
                        </ol>
                    )}
                </div>
                <div className="text-center font-semibold mt-8">
                    <p>Thanks for your Business</p>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="text-left">
                <div className="max-w-6xl mx-auto mt-6 mb-6 flex justify-between items-center">
                    <Select
                        defaultValue={template}
                        onChange={(value) => setTemplate(value)}
                        className="w-48"
                    >
                        <Option value="rendertemplate">Render Template</Option>
                        <Option value="modern">Modern Template</Option>
                        <Option value="classic">Classic Template</Option>
                        <Option value="minimal">Minimal Template</Option>
                    </Select>

                    <div className="space-x-4">
                        <Button type="primary" onClick={handlePrint}>
                            <PrinterOutlined />
                            <span className="ml-1">Print</span>
                        </Button>
                        <Button type="primary" onClick={handleDownload}>
                            <DownloadOutlined />
                            <span className="ml-1">Download</span>
                        </Button>
                    </div>
                </div>

                <div id="printable-content" className="max-w-6xl mx-auto" >
                    {template === 'rendertemplate' && renderTemplate()}
                    {template === 'modern' && renderModernTemplate()}
                    {template === 'classic' && renderClassicTemplate()}
                    {template === 'minimal' && renderMinimalTemplate()}
                </div>
            </div>
        </div>
    );
};

export default InvoiceView;