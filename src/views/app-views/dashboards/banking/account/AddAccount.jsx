import React from 'react';
import { Form, Input, Button, DatePicker, Select, Row, Col, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addAccount, getAccounts } from './AccountReducer/AccountSlice';
import { useDispatch } from 'react-redux';
const { Option } = Select;

const AddAccount = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialValues = {
    bankHolderName: '',
    bankName: '',
    accountNumber: '',
    openingBalance: '',
    contactNumber: '',
    bankAddress: '',
  };

  const validationSchema = Yup.object({
    bankHolderName: Yup.string().required('Please enter a bank holder name.'),
    bankName: Yup.string().required('Please enter a bank name.'),
    accountNumber: Yup.string().required('Please enter a account number.'),
    openingBalance: Yup.string().required('Please enter a opening balance.'),
    contactNumber: Yup.string().required('Please enter a contact number.'),
    bankAddress: Yup.string().required('Please enter a bank address.'),
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
        {({ handleSubmit, isSubmitting, setFieldValue }) => (
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
                <div className="form-group mt-2">
                  <label className="font-semibold">Contact Number <span className="text-red-500">*</span></label>
                  <Field name="contactNumber">
                    {({ field }) => (
                      <Input {...field} placeholder="Enter contact number" className="w-full mt-1" />
                    )}
                  </Field>
                  <ErrorMessage
                    name="contactNumber"
                    component="div"
                    className="text-red-500 mt-1"
                  />
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
    </div>
  );
};

export default AddAccount;