import React, { useEffect, useState } from 'react';
import { PrinterOutlined, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { Table, Button, Select } from 'antd';
import NumberFormat from 'react-number-format';
import html2pdf from 'html2pdf.js';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { getInvoice } from './InvoiceReducer/InvoiceSlice';
import { Getcus } from '../customer/CustomerReducer/CustomerSlice';
import { getsignaturesss } from 'views/app-views/setting/esignature/EsignatureReducers/EsignatureSlice';
import { getgeneralsettings } from '../../../setting/general/generalReducer/generalSlice';


const { Option } = Select;

const ViewInvoice = ({ idd, onClose }) => {
    const dispatch = useDispatch();
    const [template, setTemplate] = useState('rendertemplate');
    const [parsedInvoice, setParsedInvoice] = useState({ items: [] });
    const [customerData, setCustomerData] = useState({});
    const [generalSettings, setGeneralSettings] = useState(null);
    useEffect(() => {
        dispatch(Getcus())
    }, [dispatch])

    useEffect(() => {
        dispatch(getgeneralsettings());
    }, [dispatch]);


    const allInvoices = useSelector((state) => state?.salesInvoices?.salesInvoices?.data);
    const invoiceData = allInvoices.find(inv => inv.id === idd);
    const allCustomers = useSelector((state) => state?.customers?.customers?.data);
    const generalSettingsData = useSelector((state) => state.generalsetting.generalsetting.data);
    const loggedInUser = useSelector((state) => state?.user?.loggedInUser);
    const [selectedSignature, setSelectedSignature] = useState(null);
    const [selectedSignatureName, setSelectedSignatureName] = useState(null);
    const signatures = useSelector((state) => state?.esignature?.esignature?.data);

    const [isSignatureConfirmed, setIsSignatureConfirmed] = useState(false);

    useEffect(() => {
        dispatch(getInvoice());
    }, [dispatch]);

    useEffect(() => {
        dispatch(Getcus());
    }, [dispatch]);

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
                console.error("Error parsing items:", error);
            }
        }
    }, [invoiceData]);

    useEffect(() => {
        if (parsedInvoice && allCustomers) {
            const customer = allCustomers.find(cust => cust.id === parsedInvoice.customer);
            if (customer) {
                setCustomerData(customer);
            }
        }
    }, [parsedInvoice, allCustomers]);

    useEffect(() => {
        dispatch(getsignaturesss());
    }, [dispatch]);

    const handleSignatureSelect = (value) => {
        const sig = signatures.find(s => s.esignature_name === value);
        setSelectedSignatureName(value);
        setSelectedSignature(sig?.e_signatures || null);
    };

    const handleConfirmSignature = () => {
        setIsSignatureConfirmed(true);
    };

    const handleRemoveSignature = () => {
        setSelectedSignature(null);
        setSelectedSignatureName(null);
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

        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = printStyles;
        document.head.appendChild(styleSheet);

        window.print();

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


    const billingAddress = customerData?.billing_address
        ? JSON.parse(customerData.billing_address)
        : {};

    const cleanStreet = billingAddress.street ? billingAddress.street.replace(/<\/?p>/g, '') : '';

    const renderModernTemplate = () => {

        if (!parsedInvoice) return null;

        return (
            <div className="bg-white p-6">
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

                {/* Company & Invoice Details */}
                <div className="flex justify-end mb-8">
                    <div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Invoice Num:</span>
                            <p className='text-right'>{invoiceData?.salesInvoiceNumber}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Issue Date:</span>
                            <p>{invoiceData?.issueDate ? dayjs(invoiceData.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Due Date:</span>
                            <p>{invoiceData?.dueDate ? dayjs(invoiceData.dueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                    </div>
                </div>

                {/* Customer Info Section */}
                <div className="mb-8">

                    <div className="grid grid-cols-2 gap-x-20 gap-y-4">
                        <div className='text-left'>
                            <address>
                                <p>
                                    <span className="font-weight-semibold text-dark font-size-md">
                                        Billed By:</span><br />
                                    <span>
                                        <span className="font-weight-semibold">Address:</span> {loggedInUser?.Address}</span><br />
                                    <p><span className="font-weight-semibold">Email:</span> {loggedInUser?.email}</p>
                                    <p><span className="font-weight-semibold">Phone:</span> {loggedInUser?.phone}</p>
                                    <span><span className="font-weight-semibold">GstNumber:</span> {loggedInUser?.gstIn}</span><br />
                                </p>
                            </address>
                        </div>

                        {/* Customer Details Section */}
                        <div>
                            <span className="font-weight-semibold text-dark font-size-md">Billed To:</span><br />
                            <address>
                                <p>
                                    <p>
                                        <span>
                                            <span className='font-weight-semibold'>Address: </span>
                                            {cleanStreet && `${cleanStreet}, `}
                                            {billingAddress?.city && `${billingAddress.city}, `}
                                            {billingAddress?.state && `${billingAddress.state}, `}
                                            {billingAddress?.zip && `${billingAddress.zip}, `}
                                            {billingAddress?.country || 'N/A'}
                                        </span><br />
                                    </p>

                                    <span> <span className="font-weight-semibold  ">Name: </span>{customerData.name}</span><br />
                                    <p> <span className="font-weight-semibold">Email: </span> {customerData.email}</p>
                                    <p> <span className="font-weight-semibold  ">Phone: </span> {customerData.contact}</p>
                                    <p> <span className="font-weight-semibold  ">GstIn: </span> {customerData.gstIn}</p>
                                </p>
                            </address>
                        </div>

                    </div>
                </div>

                {/* Items Table */}
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
                                        prefix="$"
                                        thousandSeparator={true}
                                    />
                                )}
                                key="price"
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
                                title="Gst Name"
                                render={(record) => `${record.tax_name || "--"}`}
                                key="tax_name"
                            />
                            <Table.Column
                                title="Amount"
                                render={(record) => (
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round((record.final_amount))}
                                        prefix="$"
                                        thousandSeparator={true}
                                    />
                                )}
                                key="amount"
                            />
                        </Table>
                        <div className="d-flex justify-content-end mb-3">
                            <div className="text-start">
                                <div className="border-bottom">
                                    <p className="mb-2">
                                        <span className="font-weight-semibold">Sub-Total : </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={calculateSubtotal()}
                                            prefix="$"
                                            thousandSeparator={true}
                                        />
                                    </p>

                                    <p className="mb-2">
                                        <span className="font-weight-semibold">Discount : </span>
                                        {`₹${parsedInvoice.discount || 0}`}
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-weight-semibold">Total Discount Amount: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={Object.values(parsedInvoice.items).reduce((sum, item) => sum + (item.discount_amount || 0), 0)}
                                            prefix="₹"
                                            thousandSeparator={true}
                                        />
                                    </p>
                                    <p>
                                        <span className="font-weight-semibold">Total Tax Amount: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={parsedInvoice.tax
                                                || 0}  // Using the tax field directly
                                            prefix="₹"
                                            thousandSeparator={true}
                                        />
                                    </p>
                                </div>
                                <h2 className="font-weight-semibold mt-3">
                                    <span className="mr-1">Final Total: </span>
                                    <NumberFormat
                                        displayType="text"
                                        value={parsedInvoice.total}
                                        prefix="₹"
                                        thousandSeparator={true}
                                    />
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-end items-center">
                            <div className=" rounded-lg p-8">
                                {renderSignatureSection()}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Terms & Conditions:</h4>
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
                    </div>
                    <div className="text-center font-semibold mt-8">
                        <p>Thanks for your Business</p>
                    </div>
                </div>
            </div>
        );
    };


    const renderTemplate = () => {
        if (!parsedInvoice) return null;

        return (
            <div className="bg-white rounded-lg shadow-lg p-8">
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
                <div className="d-md-flex justify-content-md-between mt-4">
                    {/* Company Details Section */}
                    <div className='text-left'>
                        <address>
                            <p>

                                <span className="font-weight-semibold text-dark font-size-md">Billed By:</span><br />
                                <span><span className="font-weight-semibold">Address:</span> {loggedInUser?.Address}</span><br />
                                <p><span className="font-weight-semibold">Email:</span> {loggedInUser?.email}</p>
                                <p><span className="font-weight-semibold">Phone:</span> {loggedInUser?.phone}</p>
                                <p><span className="font-weight-semibold">GstNumber:</span> {loggedInUser?.gstIn}</p>
                            </p>
                        </address>
                    </div>
                    {/* Customer Details Section */}
                    <div>
                        <span className="font-weight-semibold text-dark font-size-md">Billed To:</span><br />
                        <address>
                            <p>
                                <span><span className="font-weight-semibold">Name:</span> {customerData.name}</span><br />
                                <p>
                                    <span className="font-weight-semibold">Address:</span> {cleanStreet}, <br />
                                    <span className="font-weight-semibold">City:</span> {billingAddress.city}, <br />
                                    <span className="font-weight-semibold">State:</span> {billingAddress.state}, <br />
                                    <span className="font-weight-semibold">Zip:</span> {billingAddress.zip}, <br />
                                    <span className="font-weight-semibold">Country:</span> {billingAddress.country}
                                </p>
                                <p><span className="font-weight-semibold">Email:</span> {customerData.email}</p>
                                <p><span className="font-weight-semibold">Phone:</span> {customerData.contact}</p>
                            </p>
                        </address>
                    </div>

                    {/* Invoice Details Section */}
                    <div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Invoice Num:</span>
                            <p className='text-right'>{invoiceData?.salesInvoiceNumber}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Issue Date:</span>
                            <p>{invoiceData?.issueDate ? dayjs(invoiceData.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Due Date:</span>
                            <p>{invoiceData?.dueDate ? dayjs(invoiceData.dueDate).format('DD MMMM, YYYY') : ''}</p>
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
                                        prefix="$"
                                        thousandSeparator={true}
                                    />
                                )}
                                key="price"
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
                                title="Gst Name"
                                render={(record) => `${record.tax_name || "--"}`}
                                key="tax_name"
                            />
                            <Table.Column
                                title="Amount"
                                render={(record) => (
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round((record.final_amount))}
                                        prefix="$"
                                        thousandSeparator={true}
                                    />
                                )}
                                key="amount"
                            />
                        </Table>

                        {/* Invoice Summary */}
                        <div className="d-flex justify-content-end mb-3">
                            <div className="text-start">
                                <div className="border-bottom">
                                    <p className="mb-2">
                                        <span className="font-weight-semibold">Sub-Total : </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={calculateSubtotal()}
                                            prefix="$"
                                            thousandSeparator={true}
                                        />
                                    </p>

                                    <p className="mb-2">
                                        <span className="font-weight-semibold">Discount : </span>
                                        {`₹${parsedInvoice.discount || 0}`}
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-weight-semibold">Total Discount Amount: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={Object.values(parsedInvoice.items).reduce((sum, item) => sum + (item.discount_amount || 0), 0)}
                                            prefix="₹"
                                            thousandSeparator={true}
                                        />
                                    </p>
                                    <p>
                                        <span className="font-weight-semibold">Total Tax Amount: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={parsedInvoice.tax
                                                || 0}  // Using the tax field directly
                                            prefix="₹"
                                            thousandSeparator={true}
                                        />
                                    </p>
                                </div>
                                <h2 className="font-weight-semibold mt-3">
                                    <span className="mr-1"><span className="font-weight-semibold">Final Total: </span></span>
                                    <NumberFormat
                                        displayType="text"
                                        value={parsedInvoice.total}
                                        prefix="₹"
                                        thousandSeparator={true}
                                    />
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-end items-center">
                            <div className=" rounded-lg p-8">
                                {renderSignatureSection()}
                            </div>
                        </div>
                        {/* </div> */}
                        <div>
                            <h4><span className="font-weight-semibold text-lg">Terms & Conditions:</span></h4>
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
                    </div>
                    <div className="text-center font-semibold mt-8">
                        <p>Thanks for your Business</p>
                    </div>
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
                    <div className="text-gray-600 mt-2">
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Invoice Number :</span>
                            <p>{invoiceData?.salesInvoiceNumber}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Issue Date:</span>
                            <p>{invoiceData?.issueDate ? dayjs(invoiceData.issueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                        <div className='flex'>
                            <span className="mb-1 me-2 font-weight-semibold">Due Date:</span>
                            <p>{invoiceData?.dueDate ? dayjs(invoiceData.dueDate).format('DD MMMM, YYYY') : ''}</p>
                        </div>
                    </div>
                </div>


                {/* Address Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="border-r pr-8 text-left">
                        <div className='text-left'>
                            <address>
                                <p>

                                    <span className="font-weight-semibold text-dark font-size-md">Billed By:</span><br />
                                    <span><span className="font-weight-semibold">Address:</span> {loggedInUser?.Address}</span><br />
                                    <p><span className="font-weight-semibold">Email:</span> {loggedInUser?.email}</p>
                                    <p><span className="font-weight-semibold">Phone:</span> {loggedInUser?.phone}</p>
                                    <span><span className="font-weight-semibold">GstNumber:</span> {loggedInUser?.gstIn}</span><br />
                                </p>
                            </address>
                        </div>


                    </div>
                    <div className="text-left">
                        {/* Company Details Section */}
                        <div>
                            <span className="font-weight-semibold text-dark font-size-md">Billed To:</span><br />
                            <address>
                                <p>
                                    <span><span className="font-weight-semibold">Name:</span> {customerData.name}</span><br />
                                    <p>
                                        <span className="font-weight-semibold">Address:</span> {cleanStreet}, <br />
                                        <span className="font-weight-semibold">City:</span> {billingAddress.city}, <br />
                                        <span className="font-weight-semibold">State:</span> {billingAddress.state}, <br />
                                        <span className="font-weight-semibold">Zip:</span> {billingAddress.zip}, <br />
                                        <span className="font-weight-semibold">Country:</span> {billingAddress.country}
                                    </p>
                                    <p><span className="font-weight-semibold">Email:</span> {customerData.email}</p>
                                    <p><span className="font-weight-semibold">Phone:</span> {customerData.contact}</p>
                                </p>
                            </address>
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
                                        prefix="$"
                                        thousandSeparator={true}
                                    />
                                )}
                                key="price"
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
                                title="Gst Name"
                                render={(record) => `${record.tax_name || "--"}`}
                                key="tax_name"
                            />

                            <Table.Column
                                title="Amount"
                                render={(record) => (
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round((record.final_amount))}
                                        prefix="$"
                                        thousandSeparator={true}
                                    />
                                )}
                                key="amount"
                            />
                        </Table>

                        {/* Invoice Summary */}
                        <div className="d-flex justify-content-end mb-3">
                            <div className="text-start">
                                <div className="border-bottom">
                                    <p className="mb-2">
                                        <span className="font-weight-semibold">Sub-Total : </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={calculateSubtotal()}
                                            prefix="$"
                                            thousandSeparator={true}
                                        />
                                    </p>

                                    <p className="mb-2">
                                        <span className="font-weight-semibold">Discount : </span>
                                        {`₹${parsedInvoice.discount || 0}`}
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-weight-semibold">Total Discount Amount: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={Object.values(parsedInvoice.items).reduce((sum, item) => sum + (item.discount_amount || 0), 0)}
                                            prefix="₹"
                                            thousandSeparator={true}
                                        />
                                    </p>
                                    <p>
                                        <span className="font-weight-semibold">Total Tax Amount: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={parsedInvoice.tax
                                                || 0}  // Using the tax field directly
                                            prefix="₹"
                                            thousandSeparator={true}
                                        />
                                    </p>
                                </div>
                                <h2 className="font-weight-semibold mt-3">
                                    <span className="mr-1"><span className="font-weight-semibold">Final Total: </span></span>
                                    <NumberFormat
                                        displayType="text"
                                        value={parsedInvoice.total}
                                        prefix="₹"
                                        thousandSeparator={true}
                                    />
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-end items-center">
                            <div className=" rounded-lg  p-8">
                                {renderSignatureSection()}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className=""><span className="font-weight-semibold text-lg">Terms & Conditions:</span></h4>
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
                            <div className='flex'>
                                <span className="mb-1 me-2 font-weight-semibold">Invoice Number:</span>
                                <p>{invoiceData?.salesInvoiceNumber}</p>
                            </div>
                            <div className='flex'>
                                <span className="mb-1 me-2 font-weight-semibold">Issue Date:</span>
                                <p>{invoiceData?.issueDate ? dayjs(invoiceData.issueDate).format('DD MMMM, YYYY') : ''}</p>
                            </div>
                            <div className='flex'>
                                <span className="mb-1 me-2 font-weight-semibold">Due Date:</span>
                                <p>{invoiceData?.dueDate ? dayjs(invoiceData.dueDate).format('DD MMMM, YYYY') : ''}</p>
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

                                    <span className="font-weight-semibold text-dark font-size-md">Billed By:</span><br />
                                    <span><span className="font-weight-semibold">Address:</span> {loggedInUser?.Address}</span><br />
                                    <p><span className="font-weight-semibold">Email:</span> {loggedInUser?.email}</p>
                                    <p><span className="font-weight-semibold">Phone:</span> {loggedInUser?.phone}</p>
                                    <span><span className="font-weight-semibold">GstNumber:</span> {loggedInUser?.gstIn}</span><br />
                                </p>
                            </address>
                        </div>

                    </div>
                    <div className="text-left">
                        {/* Client Details Section */}
                        <div>
                            <span className="font-weight-semibold text-dark font-size-md">Billed To:</span><br />
                            <address>
                                <p>
                                    <span><span className="font-weight-semibold">Name:</span> {customerData.name}</span><br />
                                    <span><span className="font-weight-semibold">customerNumber:</span> {customerData.customerNumber}</span><br />
                                    <p>
                                        <span className="font-weight-semibold">Address:</span> {cleanStreet}, <br />
                                        <span className="font-weight-semibold">City:</span> {billingAddress.city}, <br />
                                        <span className="font-weight-semibold">State:</span> {billingAddress.state}, <br />
                                        <span className="font-weight-semibold">Zip:</span> {billingAddress.zip}, <br />
                                        <span className="font-weight-semibold">Country:</span> {billingAddress.country}
                                    </p>
                                    <p><span className="font-weight-semibold">  Email:</span> {customerData.email}</p>
                                    <p><span className="font-weight-semibold">Phone:</span> {customerData.contact}</p>
                                </p>
                            </address>
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
                                        prefix="$"
                                        thousandSeparator={true}
                                    />
                                )}
                                key="price"
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
                                title="Gst Name"
                                render={(record) => `${record.tax_name || "--"}`}
                                key="tax_name"
                            />

                            <Table.Column
                                title="Amount"
                                render={(record) => (
                                    <NumberFormat
                                        displayType="text"
                                        value={Math.round((record.final_amount))}
                                        prefix="$"
                                        thousandSeparator={true}
                                    />
                                )}
                                key="amount"
                            />
                        </Table>

                        {/* Invoice Summary */}
                        <div className="d-flex justify-content-end mb-3">
                            <div className="text-start">
                                <div className="border-bottom">
                                    <p className="mb-2">
                                        <span className="font-weight-semibold">Sub-Total : </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={calculateSubtotal()}
                                            thousandSeparator={true}
                                        />
                                    </p>

                                    <p className="mb-2">
                                        <span className="font-weight-semibold">Discount : </span>
                                        {`₹${parsedInvoice.discount || 0}`}
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-weight-semibold">Total Discount Amount: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={Object.values(parsedInvoice.items).reduce((sum, item) => sum + (item.discount_amount || 0), 0)}
                                            prefix="₹"
                                            thousandSeparator={true}
                                        />
                                    </p>
                                    <p>
                                        <span className="font-weight-semibold">Total Tax Amount: </span>
                                        <NumberFormat
                                            displayType="text"
                                            value={parsedInvoice.tax
                                                || 0}  // Using the tax field directly
                                            prefix="₹"
                                            thousandSeparator={true}
                                        />
                                    </p>
                                </div>
                                <h2 className="font-weight-semibold mt-3">
                                    <span className="mr-1"><span className="font-weight-semibold">Final Total: </span></span>
                                    <NumberFormat
                                        displayType="text"
                                        value={parsedInvoice.total}
                                        prefix="₹"
                                        thousandSeparator={true}
                                    />
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div className="flex justify-end items-center">
                                <div className=" rounded-lg p-8">
                                    {renderSignatureSection()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4><span className="font-weight-semibold text-lg">Terms & Conditions:</span></h4>
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

export default ViewInvoice
