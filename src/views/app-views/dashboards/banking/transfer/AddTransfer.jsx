import React, { useEffect, useState } from 'react';
import { Input, Button, Select, Row, Col, message, Modal } from 'antd';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addaccountsss, transferdatas } from './transferReducers/transferSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getAccounts } from '../account/AccountReducer/AccountSlice';
import { PlusOutlined } from '@ant-design/icons';
import AddAccount from '../account/AddAccount';
const { Option } = Select;

const AddTransfer = ({ onClose }) => {
    const dispatch = useDispatch();
    const [isAddAccountModalVisible, setIsAddAccountModalVisible] = useState(false);

    const initialValues = {
        date: '',
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: '',
    };

    const validationSchema = Yup.object({
        date: Yup.date()
            .required('Please enter a date.')
            .typeError('Please enter a valid date.'),
        fromAccount: Yup.string().required('Please enter a from account.'),
        toAccount: Yup.string().required('Please enter a to account.'),
        amount: Yup.string().required('Please enter a amount.'),
        description: Yup.string().required('Please enter a description.'),
    });

    useEffect(() => {
        dispatch(getAccounts())
    }, [dispatch])

    const accountdata = useSelector((state) => state.account.account.data);



    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            dispatch(addaccountsss(values))
                .then(() => {
                    onClose();
                    resetForm();
                    dispatch(transferdatas())
                })

        } catch (error) {
            message.error('Failed to create account');
        } finally {
            setSubmitting(false);
        }
    };

    const openAddAccountModal = () => {
        setIsAddAccountModalVisible(true);
    };

    const closeAddAccountModal = () => {
        setIsAddAccountModalVisible(false);
    };

    return (
        <div className="create-account-form">
            <div className="border-b mb-2 pb-[-10px] font-medium"></div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ handleSubmit, isSubmitting, setFieldValue, values, setFieldTouched, resetForm }) => (
                    <FormikForm onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12} className="mt-2">
                                <div className="form-item">
                                    <label className="font-semibold">Date <span className="text-red-500">*</span></label>
                                    <Field name="date">
                                        {({ field }) => (
                                            <input
                                                {...field}
                                                type="date"
                                                className="w-full mt-1 p-2 border rounded"
                                                onChange={(e) => {
                                                    setFieldValue('date', e.target.value);
                                                }}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="date"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="form-group mt-2">
                                    <label className="font-semibold">From Account <span className="text-red-500">*</span></label>
                                    <Field name="fromAccount">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                onChange={(value) => {
                                                    setFieldValue('fromAccount', value);
                                                    if (value === values.toAccount) {
                                                        setFieldValue('toAccount', '');
                                                    }
                                                }}
                                                placeholder="Select from account"
                                                className="w-full mt-1"
                                                dropdownRender={menu => (
                                                    <>
                                                        {menu}
                                                        <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
                                                            <Button
                                                                type="link"
                                                                icon={<PlusOutlined />}
                                                                onClick={openAddAccountModal}
                                                            >
                                                                Add Account
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            >
                                                {accountdata && accountdata.map((account) => (
                                                    <Option key={account.id} value={account.id}>
                                                        {account.bankName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="fromAccount"
                                        component="div"
                                        className="text-red-500 mt-1"
                                    />
                                </div>
                            </Col>

                            <Col span={12} className="mt-3">
                                <div className="form-group">
                                    <label className="font-semibold">To Account <span className="text-red-500">*</span></label>
                                    <Field name="toAccount">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                onChange={(value) => {
                                                    setFieldValue('toAccount', value);
                                                }}
                                                placeholder="Select to account"
                                                className="w-full mt-1"
                                                dropdownRender={menu => (
                                                    <>
                                                        {menu}
                                                        <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
                                                            <Button
                                                                type="link"
                                                                icon={<PlusOutlined />}
                                                                onClick={openAddAccountModal}
                                                            >
                                                                Add Account
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            >
                                                {accountdata && accountdata
                                                    .filter(account => account.id !== values.fromAccount) // Filter out the selected fromAccount
                                                    .map((account) => (
                                                        <Option key={account.id} value={account.id}>
                                                            {account.bankName}
                                                        </Option>
                                                    ))}
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="toAccount"
                                        component="div"
                                        className="text-red-500 mt-1"
                                    />
                                </div>
                            </Col>

                            <Col span={12}>
                                <div className="form-group mt-3">
                                    <label className="font-semibold">Amount <span className="text-red-500">*</span></label>
                                    <Field name="amount">
                                        {({ field }) => (
                                            <Input {...field} type="number" placeholder="Enter amount" className="w-full mt-1" />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="amount"
                                        component="div"
                                        className="text-red-500 mt-1"
                                    />
                                </div>
                            </Col>

                            <Col span={24} className="">
                                <div className="form-item mt-3">
                                    <label className="font-semibold">Description <span className="text-red-500">*</span></label>
                                    <Field name="description">
                                        {({ field }) => (
                                            <ReactQuill
                                                {...field}
                                                className="mt-2"
                                                placeholder="Enter Description"
                                                value={values.description}
                                                onChange={(value) => setFieldValue("description", value)}
                                                onBlur={() => setFieldTouched("description", true)}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                        </Row>

                        <div className="text-right mt-4">
                            <Button type="default" onClick={onClose} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                Submit
                            </Button>
                        </div>
                    </FormikForm>
                )}
            </Formik>

            {/* AddAccount Modal */}
            <Modal
                title="Add Account"
                visible={isAddAccountModalVisible}
                onCancel={closeAddAccountModal}
                footer={null}
                width={1000}
            >
                <AddAccount onClose={closeAddAccountModal} />
            </Modal>
        </div>
    );
};

export default AddTransfer;