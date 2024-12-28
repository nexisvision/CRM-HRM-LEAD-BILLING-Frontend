import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  Card,
  Input,
  Select,
  Button,
  Switch,
  Row,
  Col,
  message,
  Spin
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGeneralSettings, updateGeneralSettings } from 'store/slices/generalSettings';

const { Option } = Select;

// Validation schema
const validationSchema = Yup.object().shape({
  appName: Yup.string()
    .required('App Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^\+\d{1,3}\s\d+$/, 'Invalid phone number format')
    .required('Phone number is required'),
  planExpireNotification: Yup.number()
    .min(1, 'Must be at least 1 day')
    .required('Plan expiration notification days is required'),
  address: Yup.string()
    .required('Address is required'),
  affiliationAmount: Yup.number()
    .min(0, 'Must be a positive number')
    .required('Affiliation amount is required')
});

const GeneralList = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.generalSettings);

  useEffect(() => {
    dispatch(fetchGeneralSettings());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateGeneralSettings(values)).unwrap();
      message.success('Settings updated successfully');
    } catch (err) {
      message.error('Failed to update settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !data) {
    return <Spin size="large" className="flex justify-center my-8" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="add-job-form">
      <div className="ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
        <h1 className="mb-4 border-b pb-4 font-medium"></h1>
        <Formik
          initialValues={data || {
            appName: '',
            email: '',
            phone: '',
            planExpireNotification: 5,
            address: '',
            defaultLanguage: 'English',
            userDefaultLanguage: 'English',
            defaultCountryCode: '+91 India (भारत)+91',
            defaultCurrencyFormat: '$ - USD US Dollar',
            affiliationAmount: 100,
            affiliationType: 'Fix Amount',
            timezone: 'UTC',
            dateTimeFormat: 'Month Day, Year',
            showCurrencyBehind: false,
            enablePhoneValidation: true,
            allowEditVCardURL: false,
            hideDecimalValues: false
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
            <Form className="formik-form" onSubmit={handleSubmit}>
              <Row gutter={[24, 16]}>
                <Col span={24}>
                  <h1 className="font-semibold text-lg">General Settings</h1>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">App Name</label>
                    <Field name="appName" as={Input} placeholder="Enter App Name" />
                    <ErrorMessage name="appName" component="div" className="error-message text-red-500 my-1" />
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Email</label>
                    <Field name="email" as={Input} placeholder="Enter Email" />
                    <ErrorMessage name="email" component="div" className="error-message text-red-500 my-1" />
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Phone</label>
                    <Field name="phone" as={Input} placeholder="Enter Phone" />
                    <ErrorMessage name="phone" component="div" className="error-message text-red-500 my-1" />
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Plan Expire Notification (in Days)</label>
                    <Field name="planExpireNotification" as={Input} type="number" placeholder="Enter Days" />
                    <ErrorMessage name="planExpireNotification" component="div" className="error-message text-red-500 my-1" />
                  </div>
                </Col>

                <Col span={24}>
                  <div className="form-item">
                    <label className="font-semibold">Address</label>
                    <Field name="address" as={Input} placeholder="Enter Address" />
                    <ErrorMessage name="address" component="div" className="error-message text-red-500 my-1" />
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Default Language</label>
                    <Field name="defaultLanguage">
                      {({ field }) => (
                        <Select {...field} className="w-full">
                          <Option value="English">English</Option>
                          <Option value="Spanish">Spanish</Option>
                          <Option value="French">French</Option>
                        </Select>
                      )}
                    </Field>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">User Default Language</label>
                    <Field name="userDefaultLanguage">
                      {({ field }) => (
                        <Select {...field} className="w-full">
                          <Option value="English">English</Option>
                          <Option value="Spanish">Spanish</Option>
                          <Option value="French">French</Option>
                        </Select>
                      )}
                    </Field>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Default Country Code</label>
                    <Field name="defaultCountryCode">
                      {({ field }) => (
                        <Select {...field} className="w-full">
                          <Option value="+91 India (भारत)+91">+91 India (भारत)+91</Option>
                          <Option value="+1 USA">+1 USA</Option>
                          <Option value="+44 UK">+44 UK</Option>
                        </Select>
                      )}
                    </Field>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Default Currency Format</label>
                    <Field name="defaultCurrencyFormat">
                      {({ field }) => (
                        <Select {...field} className="w-full">
                          <Option value="$ - USD US Dollar">$ - USD US Dollar</Option>
                          <Option value="€ - EUR Euro">€ - EUR Euro</Option>
                          <Option value="£ - GBP British Pound">£ - GBP British Pound</Option>
                        </Select>
                      )}
                    </Field>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Affiliation Amount Or Percentage</label>
                    <Field name="affiliationAmount" as={Input} type="number" placeholder="Enter Amount" />
                    <ErrorMessage name="affiliationAmount" component="div" className="error-message text-red-500 my-1" />
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Affiliation Type</label>
                    <Field name="affiliationType">
                      {({ field }) => (
                        <Select {...field} className="w-full">
                          <Option value="Fix Amount">Fix Amount</Option>
                          <Option value="Percentage">Percentage</Option>
                        </Select>
                      )}
                    </Field>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Timezone</label>
                    <Field name="timezone">
                      {({ field }) => (
                        <Select {...field} className="w-full">
                          <Option value="UTC">UTC</Option>
                          <Option value="GMT">GMT</Option>
                          <Option value="EST">EST</Option>
                        </Select>
                      )}
                    </Field>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Date-Time Format</label>
                    <Field name="dateTimeFormat">
                      {({ field }) => (
                        <Select {...field} className="w-full">
                          <Option value="Month Day, Year">Month Day, Year</Option>
                          <Option value="Day Month, Year">Day Month, Year</Option>
                          <Option value="Year Month Day">Year Month Day</Option>
                        </Select>
                      )}
                    </Field>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <Switch
                      checked={values.showCurrencyBehind}
                      onChange={(checked) => setFieldValue('showCurrencyBehind', checked)}
                    />
                    <span className="ml-2">Show Currency Behind</span>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <Switch
                      checked={values.enablePhoneValidation}
                      onChange={(checked) => setFieldValue('enablePhoneValidation', checked)}
                    />
                    <span className="ml-2">Enable Phone Number Input Validation</span>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <Switch
                      checked={values.allowEditVCardURL}
                      onChange={(checked) => setFieldValue('allowEditVCardURL', checked)}
                    />
                    <span className="ml-2">Allow to edit vCard URL Alias</span>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-item">
                    <Switch
                      checked={values.hideDecimalValues}
                      onChange={(checked) => setFieldValue('hideDecimalValues', checked)}
                    />
                    <span className="ml-2">Hide Decimal Values</span>
                  </div>
                </Col>
              </Row>

              <div className="form-buttons text-right mt-2">
                <Button type="default" className="mr-2">
                  Discard
                </Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default GeneralList; 