import React, { useEffect, useState } from 'react';
import { Input, Button, Select, Row, Col, message,Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { editAccount, getAccounts } from './AccountReducer/AccountSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { getallcountries } from 'views/app-views/setting/countries/countriesreducer/countriesSlice';
import AddCountries from "views/app-views/setting/countries/AddCountries";
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

  const countries = useSelector((state) => state.countries?.countries);

  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);
  
  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  const getInitialCountry = () => {
    if (countries?.length > 0) {
      const indiaCode = countries.find(c => c.countryCode === 'IN');
      return indiaCode?.phoneCode || "+91";
    }
    return "+91";
  };

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 15) {
      setFieldValue('contactNumber', value);
    }
  };

  const [initialValues, setInitialValues] = useState({
    bankHolderName: '',
    bankName: '',
    accountNumber: '',
    openingBalance: '',
    contactNumber: '',
    bankAddress: '',
    phoneCode: getInitialCountry(),
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
      // message.success('Account updated successfully!');
      dispatch(getAccounts()); // Refresh the accounts list
      onClose();
    } catch (error) {
      // message.error('Failed to update account');
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
                <div className="form-group">
                  <label className="text-gray-600 font-semibold mb-2 block">Phone <span className="text-red-500">*</span></label>
                  <div className="flex gap-0">
                    <Field name="phoneCode">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="phone-code-select"
                          style={{
                            width: '80px',
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderRight: 0,
                            backgroundColor: '#f8fafc',
                          }}
                          placeholder={<span className="text-gray-400">+91</span>}
                          // defaultValue={getInitialPhoneCode()}
                          onChange={(value) => {
                            if (value === 'add_new') {
                              setIsAddPhoneCodeModalVisible(true);
                            } else {
                              setFieldValue('phoneCode', value);
                            }
                          }}
                          value={values.phoneCode}
                          dropdownStyle={{ minWidth: '180px' }}
                          suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
                          dropdownRender={menu => (
                            <div>
                              <div
                                className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
                                onClick={() => setIsAddPhoneCodeModalVisible(true)}
                              >
                                <PlusOutlined className="mr-2" />
                                <span className="text-sm">Add New</span>
                              </div>
                              {menu}
                            </div>
                          )}
                        >
                          {countries?.map((country) => (
                            <Option key={country.id} value={country.phoneCode}>
                              <div className="flex items-center w-full px-1">
                                <span className="text-base min-w-[40px]">{country.phoneCode}</span>
                                <span className="text-gray-600 text-sm ml-3">{country.countryName}</span>
                                <span className="text-gray-400 text-xs ml-auto">{country.countryCode}</span>
                              </div>
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                    <Field name="contactNumber">
                      {({ field }) => (
                        <Input
                          {...field}
                          className="phone-input"
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderLeft: '1px solid #d9d9d9',
                            width: 'calc(100% - 80px)'
                          }}
                          type="tel"
                          placeholder="Enter 10-digit number"
                          onChange={(e) => handlePhoneNumberChange(e, setFieldValue)}
                          maxLength={15}
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage name="contactNumber" component="div" className="text-red-500 mt-1 text-sm" />
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

      <Modal
        title="Add New Country"
        visible={isAddPhoneCodeModalVisible}
        onCancel={() => setIsAddPhoneCodeModalVisible(false)}
        footer={null}
        width={600}
      >
        <AddCountries
          onClose={() => {
            setIsAddPhoneCodeModalVisible(false);
            dispatch(getallcountries());
          }}
        />
      </Modal>

      <style jsx>{`

        .ant-select-dropdown .ant-select-item {
          padding: 8px 12px !important;
        }

        .ant-select-dropdown .ant-select-item-option-content > div {
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
        }

        //    .contract-select .ant-select-selection-item {
        //   display: flex !important;
        //   align-items: center !important;
        //   justify-content: center !important;
        //   font-size: 16px !important;
        // }

        // .contract-select .ant-select-selection-item > div {
        //   display: flex !important;
        //   align-items: center !important;
        // }

        // .contract-select .ant-select-selection-item span:not(:first-child) {
        //   display: none !important;
        // }

        .phone-code-select .ant-select-selector {
          // height: 32px !important;
          // padding: 0 8px !important;
          background-color: #f8fafc !important;
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          border-right: 0 !important;
        }

        .phone-code-select .ant-select-selection-item {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 16px !important;
        }

        .phone-code-select .ant-select-selection-item > div {
          display: flex !important;
          align-items: center !important;
        }

        .phone-code-select .ant-select-selection-item span:not(:first-child) {
          display: none !important;
        }

        // .phone-input::-webkit-inner-spin-button,
        // .phone-input::-webkit-outer-spin-button {
        //   -webkit-appearance: none;
        //   margin: 0;
        // }

        // .phone-input {
        //   -moz-appearance: textfield;
        // }
      `}</style>

    </div>
  );
};

export default EditAccount;