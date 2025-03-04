import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, Row, Col, Checkbox, message,Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import { PlusOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { addAccount, getAccounts } from './AccountReducer/AccountSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getallcountries } from 'views/app-views/setting/countries/countriesreducer/countriesSlice';
import AddCountries from "views/app-views/setting/countries/AddCountries";
const { Option } = Select;

const AddAccount = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const initialValues = {
    bankHolderName: '',
    bankName: '',
    accountNumber: '',
    openingBalance: '',
    contactNumber: '',
    bankAddress: '',
    phoneCode: getInitialCountry(),
  };

  const validationSchema = Yup.object({
    bankHolderName: Yup.string().required('Please enter a bank holder name.'),
    bankName: Yup.string().required('Please enter a bank name.'),
    accountNumber: Yup.string().required('Please enter a account number.'),
    openingBalance: Yup.string().required('Please enter a opening balance.'),
    contactNumber: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Please enter a contact number'),
    bankAddress: Yup.string().required('Please enter a bank address.'),
    phoneCode: Yup.string().required('Please select country code'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      // Add your API call here
      // console.log('Form values:', values);
      dispatch(addAccount(values)).then((result) => {
        // console.log('Result:', result);
        if (result.payload.success) {
          // message.success(result.payload.message);
          dispatch(getAccounts());
          onClose();
        } else {
          // message.error(result.payload.message);
        }
      });
    } catch (error) {
      message.error('Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-account-form">
      {/* <h2>Create Job</h2> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
          <FormikForm onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-group">
                  <label className="font-semibold">Bank Holder Name <span className="text-red-500">*</span></label>
                  <Field
                    name="bankHolderName"
                    as={Input}
                    className="w-full mt-1"
                    placeholder="Enter bank holder name"
                  />
                  <ErrorMessage
                    name="bankHolderName"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-group">
                  <label className="font-semibold">Bank Name <span className="text-red-500">*</span></label>
                  <Field
                    name="bankName"
                    as={Input}
                    className="w-full mt-1"
                    placeholder="Enter bank name"
                  />
                  <ErrorMessage
                    name="bankName"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-group mt-2">
                  <label className="font-semibold">Account Number <span className="text-red-500">*</span></label>
                  <Field name="accountNumber">
                    {({ field }) => (
                      <Input {...field} placeholder="Enter account number" className="w-full mt-1" />
                    )}
                  </Field>
                  <ErrorMessage
                    name="accountNumber"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-group mt-2">
                  <label className="font-semibold">Opening Balance <span className="text-red-500">*</span></label>
                  <Field name="openingBalance">
                    {({ field }) => (
                      <Input {...field} type="number" placeholder="Enter opening balance" className="w-full mt-1" />
                    )}
                  </Field>
                  <ErrorMessage
                    name="openingBalance"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-group">
                  <label className="text-gray-600 font-semibold mb-2 block">Phone<span className="text-red-500">*</span></label>
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
                <div className="form-group mt-2">
                  <label className="font-semibold">Bank Address <span className="text-red-500">*</span></label>
                  <Field
                    name="bankAddress"
                    as={Input.TextArea}
                    rows={4}
                    placeholder="Enter bank address"
                    className="w-full mt-1"
                  />
                  <ErrorMessage
                    name="bankAddress"
                    component="div"
                    className="text-red-500 mt-1"
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

export default AddAccount;