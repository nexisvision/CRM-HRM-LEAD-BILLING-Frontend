import React, { useState, useEffect } from "react";
import {
    Input,
    Button,
    DatePicker,
    Select,
    message,
    Row,
    Col,
    Switch,
    Upload,
    Modal,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Addexp, Getexp } from "./Expencereducer/ExpenseSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import AddCurrencies from '../../../setting/currencies/AddCurrencies';

const { Option } = Select;

const AddExpenses = ({ onClose }) => {
    const navigate = useNavigate();

    const { id } = useParams();

    const dispatch = useDispatch();

    const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

    const user = useSelector((state) => state.user.loggedInUser.username);

    const { currencies } = useSelector((state) => state.currencies);

    const curren = currencies?.data || [];

    const allproject = useSelector((state) => state.Project);
    const fndrewduxxdaa = allproject.Project.data
    const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);

    const allempdatass = useSelector((state) => state.currencies);
    const fnddatass = allempdatass?.currencies?.data;

    const getInitialCurrency = () => {
        if (fnddatass?.length > 0) {
            const inrCurrency = fnddatass.find(c => c.currencyCode === 'INR');
            return inrCurrency?.id || fnddatass[0]?.id;
        }
        return '';
    };

    useEffect(() => {
        dispatch(getcurren());
    }, [dispatch]);

    const initialValues = {
        item: "",
        currency: getInitialCurrency(),
        ExchangeRate: "",
        price: "",
        purchase_date: "",
        project: id || "",
        ExpenseCategory: "",
        PurchasedFrom: "",
        BankAccount: "",
        Description: "",
        bill: "",
    };
    const validationSchema = Yup.object({
        item: Yup.string().required("Please enter item."),
        currency: Yup.string().required("Please enter Currency."),
        price: Yup.string().required("Please enter Price."),
        purchase_date: Yup.date().nullable().required("Date is required."),
        project: Yup.mixed().required("Please enter Project."),
        PurchasedFrom: Yup.string().required("Please enter Purchased From."),
        description: Yup.string().optional(),
        bill: Yup.mixed().optional()
    });

    const [fileList, setFileList] = useState([]);

    const onSubmit = (values, { resetForm }) => {
        const formData = new FormData();

        formData.append('project', id || values.project || '');

        Object.keys(values).forEach(key => {
            if (key !== 'bill' && key !== 'project' && values[key]) {
                formData.append(key, values[key]);
            }
        });

        if (fileList[0]?.originFileObj) {
            formData.append('bill', fileList[0].originFileObj);
        }

        dispatch(Addexp({ id, values: formData }))
            .then(() => {
                dispatch(Getexp(id));
                onClose();
                message.success("Expenses added successfully!");
                resetForm();
                setFileList([]);
            })
            .catch((error) => {
                console.error("Submission Error:", error);
                message.error("Failed to add expenses. Please try again.");
            });
    };

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    return (
        <div className="add-expenses-form">
  <h2 className="border-b pb-[-10px] mb-[10px] font-medium"></h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="form-item">
                                    <label className="font-semibold">ItemName <span className="text-red-500">*</span></label>
                                    <Field name="item" as={Input} placeholder="Enter item" className="mt-1" />
                                    <ErrorMessage
                                        name="item"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="form-group">
                                    <label className="text-gray-600 font-semibold mb-1 block">Currency <span className="text-red-500">*</span></label>
                                    <div className="flex gap-0">
                                        <Field name="currency">
                                            {({ field }) => (
                                                <Select
                                                    {...field}
                                                    className="currency-select"
                                                    style={{
                                                        width: '80px',
                                                        height: '40px',
                                                        borderTopRightRadius: 0,
                                                        borderBottomRightRadius: 0,
                                                        borderRight: 0,
                                                        backgroundColor: '#f8fafc',
                                                    }}
                                                    placeholder={<span className="text-gray-400">₹</span>}
                                                    onChange={(value) => {
                                                        if (value === 'add_new') {
                                                            setIsAddCurrencyModalVisible(true);
                                                        } else {
                                                            setFieldValue("currency", value);
                                                        }
                                                    }}
                                                    value={values.currency}
                                                    dropdownStyle={{ minWidth: '180px' }}
                                                    suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
                                                    loading={!fnddatass}
                                                    dropdownRender={menu => (
                                                        <div>
                                                            <div
                                                                className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
                                                                onClick={() => setIsAddCurrencyModalVisible(true)}
                                                            >
                                                                <PlusOutlined className="mr-2" />
                                                                <span className="text-sm">Add New</span>
                                                            </div>
                                                            {menu}
                                                        </div>
                                                    )}
                                                >
                                                    {fnddatass?.map((currency) => (
                                                        <Option key={currency.id} value={currency.id}>
                                                            <div className="flex items-center w-full px-1">
                                                                <span className="text-base min-w-[24px]">{currency.currencyIcon}</span>
                                                                <span className="text-gray-600 text-sm ml-3">{currency.currencyName}</span>
                                                                <span className="text-gray-400 text-xs ml-auto">{currency.currencyCode}</span>
                                                            </div>
                                                        </Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </Field>
                                        <Field name="price">
                                            {({ field, form }) => (
                                                <Input
                                                    {...field}
                                                    className="price-input"
                                                    style={{
                                                        height: '40px',
                                                        borderTopLeftRadius: 0,
                                                        borderBottomLeftRadius: 0,
                                                        borderLeft: '1px solid #d9d9d9',
                                                        width: 'calc(100% - 80px)'
                                                    }}
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                                            form.setFieldValue('price', value);
                                                        }
                                                    }}
                                                    onKeyPress={(e) => {
                                                        const charCode = e.which ? e.which : e.keyCode;
                                                        if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                                                            e.preventDefault();
                                                        }
                                                        if (charCode === 46 && field.value.includes('.')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    prefix={
                                                        values.currency && (
                                                            <span className="text-gray-600 font-medium mr-1">
                                                                {fnddatass?.find(c => c.id === values.currency)?.currencyIcon}
                                                            </span>
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <ErrorMessage name="price" component="div" className="text-red-500 mt-1 text-sm" />
                                </div>
                            </Col>
                          
                            <Col span={12} className="mt-4">
                                <div className="form-item">
                                    <label className="font-semibold">Purchase Date <span className="text-red-500">*</span></label>

                                    <DatePicker
                                        className="w-full mt-1"
                                        format="DD-MM-YYYY"
                                        value={values.purchase_date}
                                        onChange={(date) => setFieldValue("purchase_date", date)}
                                        onBlur={() => setFieldTouched("purchase_date", true)}
                                    />
                                    <ErrorMessage
                                        name="purchase_date"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                          
                            <Col span={12} className="mt-4">
                                <div className="form-item">
                                    <label className="font-semibold">Project <span className="text-red-500">*</span></label>

                                    <Input
                                        className="mt-1"
                                        defaultValue={fnddata?.project_name}
                                        placeholder="Enter project"
                                        disabled
                                    />
                                    <ErrorMessage
                                        name="project"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>

                            <Col span={12} className="mt-4">
                                <div className="form-item">
                                    <label className="font-semibold">Purchased From <span className="text-red-500">*</span></label>

                                    <Field
                                        name="PurchasedFrom"
                                        as={Input}
                                        placeholder="Enter PurchasedFrom"
                                        className="mt-1"
                                    />
                                    <ErrorMessage
                                        name="PurchasedFrom"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                            <Col span={24} className="mt-4">
                                <div className="form-item">
                                    <label className="font-semibold">Description</label>
                                    <ReactQuill
                                        className="mt-1"
                                        value={values.description}
                                        onChange={(value) => setFieldValue("description", value)}
                                        placeholder="Enter Description"
                                        onBlur={() => setFieldTouched("description", true)}
                                    />
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                            <div className="mt-4 w-full">
                                <span className="block font-semibold p-2">Bill</span>
                                <Col span={24}>
                                    <Upload
                                        beforeUpload={() => false}
                                        listType="picture"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        maxCount={1}
                                        fileList={fileList}
                                        onChange={handleFileChange}
                                        showUploadList={{
                                            showRemoveIcon: true,
                                            showPreviewIcon: true,
                                            className: "upload-list-inline"
                                        }}
                                        className="border-2 flex flex-col justify-center items-center p-10"
                                    >
                                        <Button icon={<UploadOutlined />}>Choose File</Button>
                                    </Upload>
                                </Col>
                            </div>
                        </Row>
                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Create
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>


            {/* Add Currency Modal */}
            <Modal
                title="Add New Currency"
                visible={isAddCurrencyModalVisible}
                onCancel={() => setIsAddCurrencyModalVisible(false)}
                footer={null}
                width={600}
            >
                <AddCurrencies
                    onClose={() => {
                        setIsAddCurrencyModalVisible(false);
                        dispatch(getcurren()); // Refresh currency list after adding
                    }}
                />
            </Modal>

            {/* Custom render for selected value */}
            <style jsx>{`
        .currency-select .ant-select-selector {
            height: 40px !important;
            padding-top: 4px !important;
            padding-bottom: 4px !important;
            display: flex !important;
            align-items: center !important;
        }

        .currency-select .ant-select-selection-item {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 16px !important;
            line-height: 32px !important;
        }

        .currency-select .ant-select-selection-item > div {
            display: flex !important;
            align-items: center !important;
        }

        .currency-select .ant-select-selection-item span:not(:first-child) {
            display: none !important;
        }

        .price-input {
            height: 40px !important;
        }

        .ant-select-dropdown .ant-select-item {
            padding: 8px 12px !important;
        }

        .ant-select-dropdown .ant-select-item-option-content > div {
            display: flex !important;
            align-items: center !important;
            width: 100% !important;
        }

        .ant-input-number-input {
            height: 40px !important;
            line-height: 40px !important;
        }

        // .ant-select-selector, .ant-input {
        //     border-radius: 6px !important;
        // }
      `}</style>
        </div>
    );
};
export default AddExpenses;


