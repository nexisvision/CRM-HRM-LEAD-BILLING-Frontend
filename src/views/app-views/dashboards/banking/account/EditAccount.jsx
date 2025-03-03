import React, { useEffect, useState } from 'react';
import { Input, Button, Select, Row, Col, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { editAccount, getAccounts } from './AccountReducer/AccountSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const validationSchema = Yup.object().shape({
  bankHolderName: Yup.string().required('Bank holder name is required'),
  bankName: Yup.string().required('Bank name is required'),
  accountNumber: Yup.string().required('Account number is required'),
  openingBalance: Yup.number().required('Opening balance is required'),
  contactNumber: Yup.string().required('Contact number is required'),
  bankAddress: Yup.string().required('Bank address is required'),
});

const EditAccount = ({ onClose, idd }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    bankHolderName: '',
    bankName: '',
    accountNumber: '',
    openingBalance: '',
    contactNumber: '',
    bankAddress: '',
  });

  const allAccounts = useSelector((state) => state.account);
  const accounts = allAccounts.account.data;

  useEffect(() => {
    if (accounts && idd) {
      const accountData = accounts.find((account) => account.id === idd);
      if (accountData) {
        setInitialValues({
          bankHolderName: accountData.bankHolderName,
          bankName: accountData.bankName,
          accountNumber: accountData.accountNumber,
          openingBalance: accountData.openingBalance,
          contactNumber: accountData.contactNumber,
          bankAddress: accountData.bankAddress,
        });
      }
    }
  }, [idd, accounts]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      await dispatch(editAccount({ id: idd, payload: values })).unwrap();
      message.success('Account updated successfully!');
      dispatch(getAccounts());
      onClose();
    } catch (error) {
      message.error('Failed to update account');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-account-form">
        <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-group mt-2">
                  <label className='font-semibold'>Bank Holder Name <span className='text-red-500'>*</span></label>
                  <Field
                    name="bankHolderName"
                    as={Input}
                    className="mt-1"
                    placeholder="Enter bank holder name"
                  />
                  <ErrorMessage
                    name="bankHolderName"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-group mt-2">
                  <label className='font-semibold'>Bank Name <span className='text-red-500'>*</span></label>
                  <Select
                    placeholder="Select bank"
                    value={values.bankName}
                    className="mt-1"
                    onChange={(value) => setFieldValue('bankName', value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="sbi">State Bank of India</Option>
                    <Option value="hdfc">HDFC Bank</Option>
                    <Option value="icici">ICICI Bank</Option>
                    <Option value="axis">Axis Bank</Option>
                  </Select>
                  <ErrorMessage
                    name="bankName"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-group mt-3">
                  <label className='font-semibold'>Account Number <span className='text-red-500'>*</span></label>
                  <Field
                    name="accountNumber"
                    as={Input}
                    className="mt-1"
                    placeholder="Enter account number"
                  />
                  <ErrorMessage
                    name="accountNumber"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-group mt-3">
                  <label className='font-semibold'>Opening Balance <span className='text-red-500'>*</span></label>
                  <Field
                    name="openingBalance"
                    as={Input}
                    type="number"
                    className="mt-1"
                    placeholder="Enter opening balance"
                  />
                  <ErrorMessage
                    name="openingBalance"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-group mt-3">
                  <label className='font-semibold'>Contact Number <span className='text-red-500'>*</span></label>
                  <Field
                    name="contactNumber"
                    as={Input}
                    className="mt-1"
                    placeholder="Enter contact number"
                  />
                  <ErrorMessage
                    name="contactNumber"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </Col>

              <Col span={24}>
                <div className="form-group mt-3">
                  <label className='font-semibold'>Bank Address <span className='text-red-500'>*</span> </label>
                  <Field
                    name="bankAddress"
                    as={Input.TextArea}
                    className="mt-1"
                    rows={4}
                    placeholder="Enter bank address"
                  />
                  <ErrorMessage
                    name="bankAddress"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </Col>
            </Row>

            <div className="text-right mt-4">
              <Button type="default" onClick={onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading || isSubmitting}
              >
                Update Account
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditAccount;