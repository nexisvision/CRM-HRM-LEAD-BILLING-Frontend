import React, { useEffect, useState } from 'react';
import { Input, Button, Select, Row, Col, message, Modal } from 'antd';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getAccounts } from '../account/AccountReducer/AccountSlice';
import { eidttransfer, transferdatas } from './transferReducers/transferSlice';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import AddAccount from '../account/AddAccount';
const { Option } = Select;

const EditTransfer = ({ onClose, initialData, idd }) => {
    const dispatch = useDispatch();
    const [isAddAccountModalVisible, setIsAddAccountModalVisible] = useState(false);

    const [initialValues, setInitialValues] = useState({
        date: initialData?.date ? moment(initialData.date) : null,
        fromAccount: initialData?.fromAccount || '',
        toAccount: initialData?.toAccount || '',
        amount: initialData?.amount || '',
        description: initialData?.description || '',
    });

    const validationSchema = Yup.object({
        date: Yup.string().required('Please enter a date.'),
        fromAccount: Yup.string().required('Please enter a from account.'),
        toAccount: Yup.string().required('Please enter a to account.'),
        amount: Yup.string().required('Please enter a amount.'),
        description: Yup.string().required('Please enter a description.'),
    });

    useEffect(() => {
        dispatch(getAccounts());
    }, [dispatch]);

    useEffect(() => {
        dispatch(transferdatas());
    }, [dispatch]);

    const alldata = useSelector((state) => state?.transfer?.transfer?.data);
    const loggeddata = useSelector((state) => state?.user?.loggedInUser?.username);

    const fnsadadata = alldata?.filter((item) => item?.created_by === loggeddata);

    useEffect(() => {
        const data = fnsadadata?.find((item) => item?.id === idd);
        if (data) {
            setInitialValues({
                date: data?.date ? moment(data.date) : null,
                fromAccount: data?.fromAccount || '',
                toAccount: data?.toAccount || '',
                amount: data?.amount || '',
                description: data?.description || '',
            });
        }
    }, [fnsadadata, idd]);

    const accountdata = useSelector((state) => state.account.account.data);

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const formattedValues = {
                ...values,
                date: values.date ? moment(values.date).format('YYYY-MM-DD') : null,
            };

            dispatch(eidttransfer({ idd, values: formattedValues }))
                .then(() => {
                    onClose();
                    resetForm();
                    dispatch(transferdatas());
                });
        } catch (error) {
            message.error('Failed to update account');
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

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize={true}
            >
                {({ handleSubmit, isSubmitting, setFieldValue, values, setFieldTouched }) => (
                    <FormikForm onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12} className="">
                                <div className="form-item">
                                    <label className="font-semibold">Date <span className="text-red-500">*</span></label>
                                    <Field name="date">
                                        {({ field }) => (
                                            <input
                                                {...field}
                                                type="date"
                                                className="w-full mt-2 p-2 border rounded"
                                                value={values.date ? moment(values.date).format('YYYY-MM-DD') : ''}
                                                onChange={(e) => setFieldValue('date', e.target.value)}
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
                                <div className="form-group">
                                    <label className="font-semibold">From Account <span className="text-red-500">*</span></label>
                                    <Field name="fromAccount">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                onChange={(value) => {
                                                    setFieldValue('fromAccount', value);
                                                    setFieldValue('toAccount', value);
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
                                                {accountdata && accountdata?.map((account) => (
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

                            <Col span={12}>
                                <div className="form-group mt-2">
                                    <label className="font-semibold">To Account <span className="text-red-500">*</span></label>
                                    <Field name="toAccount">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                disabled={true}
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
                                                {accountdata && accountdata.map((account) => (
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
                                <div className="form-group mt-2">
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

export default EditTransfer;