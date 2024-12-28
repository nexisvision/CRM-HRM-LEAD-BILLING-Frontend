import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
    Card,
    Input,
    Select,
    Button,
    Switch,
    Row,
    Col
} from 'antd';

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
    const initialValues = {
        appName: '',
        email: '',
        phone: '',
        planExpireNotification: '',
        address: '',
        defaultLanguage: '',
        userDefaultLanguage: '',
        defaultCountryCode: '',
        defaultCurrencyFormat: '',
        affiliationAmount: '',
        affiliationType: '',
        timezone: '',
        dateTimeFormat: '',
        showCurrencyBehind: false,
        enablePhoneValidation: true,
        allowEditVCardURL: false,
        hideDecimalValues: false
    };

    const handleSubmit = (values, { setSubmitting }) => {
        setTimeout(() => {
            console.log('Form values:', values);
            setSubmitting(false);
        }, 500);
    };

    return (
        <div className="add-job-form">
            <div className="ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
                <h1 className="mb-4 border-b pb-4 font-medium"></h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                        <Form className="formik-form" onSubmit={handleSubmit}>
                            <Row gutter={[16, 16]}>

                                <Col span={8}>
                                    <div className="form-item">
                                        <label className="font-semibold">App Name</label>
                                        <Field name="appName" as={Input} placeholder="Enter App Name" />
                                        <ErrorMessage name="appName" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>

                                <Col span={8}>
                                    <div className="form-item">
                                        <label className="font-semibold">Email</label>
                                        <Field name="email" as={Input} placeholder="Enter Email" />
                                        <ErrorMessage name="email" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>

                                <Col span={8}>
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

                                <Col span={8}>
                                    <div className="form-item">
                                        <label className="font-semibold">Default Language</label>
                                        <Field name="defaultLanguage">
                                            {({ field }) => (
                                                <Select {...field} className="w-full"
                                                placeholder="Select Default Language"
                                                onChange={(value) => setFieldValue('defaultLanguage', value)}
                                                value={values.defaultLanguage}
                                                onBlur={() => setFieldTouched("defaultLanguage", true)}>
                                                    <Option value="English">English</Option>
                                                    <Option value="Spanish">Spanish</Option>
                                                    <Option value="French">French</Option>
                                                </Select>
                                            )}
                                        </Field>
                                        <ErrorMessage name="defaultLanguage" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>

                                <Col span={8} className='mt-2'>
                                    <div className="form-item">
                                        <label className='font-semibold'>User Default Language</label>
                                        <Field name="userDefaultLanguage">
                                            {({ field }) => (
                                                <Select
                                                    {...field}
                                                    className="w-full"
                                                    placeholder="Select User Default Language"
                                                    onChange={(value) => setFieldValue('userDefaultLanguage', value)}
                                                    value={values.userDefaultLanguage}
                                                    onBlur={() => setFieldTouched("userDefaultLanguage", true)}
                                                >
                                                    <Option value="English">English</Option>
                                                    <Option value="Spanish">Spanish</Option>
                                                    <Option value="French">French</Option>
                                                </Select>
                                            )}
                                        </Field>
                                        <ErrorMessage name="userDefaultLanguage" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>

                                {/* <Col span={8}>
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
                    <ErrorMessage name="billing_address" component="div" className="error-message text-red-500 my-1" />
                  </div>
                </Col> */}

                                <Col span={8}>
                                    <div className="form-item">
                                        <label className="font-semibold">Default Country Code</label>
                                        <Field name="defaultCountryCode">
                                            {({ field }) => (
                                                <Select {...field} className="w-full"
                                                placeholder="Select Default Country Code"
                                                onChange={(value) => setFieldValue('defaultCountryCode', value)}
                                                value={values.defaultCountryCode}
                                                onBlur={() => setFieldTouched("defaultCountryCode", true)}
                                                >
                                                    <Option value="+91 India (भारत)+91">+91 India (भारत)+91</Option>
                                                    <Option value="+1 USA">+1 USA</Option>
                                                    <Option value="+44 UK">+44 UK</Option>
                                                </Select>
                                            )}
                                        </Field>
                                        <ErrorMessage name="defaultCountryCode" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>

                                <Col span={8}>
                                    <div className="form-item">
                                        <label className="font-semibold">Default Currency Format</label>
                                        <Field name="defaultCurrencyFormat">
                                            {({ field }) => (
                                                <Select {...field} className="w-full"
                                                placeholder="Select Default Currency Format"
                                                onChange={(value) => setFieldValue('defaultCurrencyFormat', value)}
                                                value={values.defaultCurrencyFormat}
                                                onBlur={() => setFieldTouched("defaultCurrencyFormat", true)}>
                                                    <Option value="$ - USD US Dollar">$ - USD US Dollar</Option>
                                                    <Option value="€ - EUR Euro">€ - EUR Euro</Option>
                                                    <Option value="£ - GBP British Pound">£ - GBP British Pound</Option>
                                                </Select>
                                            )}
                                        </Field>
                                        <ErrorMessage name="defaultCurrencyFormat" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>

                                <Col span={8}>
                                    <div className="form-item">
                                        <label className="font-semibold">Affiliation Amount Or Percentage</label>
                                        <Field name="affiliationAmount" as={Input} type="number" placeholder="Enter Amount" />
                                        <ErrorMessage name="affiliationAmount" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>

                                <Col span={8}>
                                    <div className="form-item">
                                        <label className="font-semibold">Affiliation Type</label>
                                        <Field name="affiliationType">
                                            {({ field }) => (
                                                <Select {...field} className="w-full"
                                                placeholder="Select Affiliation Type"
                                                onChange={(value) => setFieldValue('affiliationType', value)}
                                                value={values.affiliationType}
                                                onBlur={() => setFieldTouched("affiliationType", true)}>
                                                    <Option value="Fix Amount">Fix Amount</Option>
                                                    <Option value="Percentage">Percentage</Option>
                                                </Select>
                                            )}
                                        </Field>
                                        <ErrorMessage name="affiliationType" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>

                                <Col span={8}>
                                    <div className="form-item">
                                        <label className="font-semibold">Timezone</label>
                                        <Field name="timezone">
                                            {({ field }) => (
                                                <Select {...field} className="w-full"
                                                placeholder="Select Timezone"
                                                onChange={(value) => setFieldValue('timezone', value)}
                                                value={values.timezone}
                                                onBlur={() => setFieldTouched("timezone", true)}>
                                                    <Option value="UTC">UTC</Option>
                                                    <Option value="GMT">GMT</Option>
                                                    <Option value="EST">EST</Option>
                                                </Select>
                                            )}
                                        </Field>
                                        <ErrorMessage name="timezone" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>

                                <Col span={8}>
                                    <div className="form-item">
                                        <label className="font-semibold">Date-Time Format</label>
                                        <Field name="dateTimeFormat">
                                            {({ field }) => (
                                                <Select {...field} className="w-full"
                                                placeholder="Select Date-Time Format"
                                                onChange={(value) => setFieldValue('dateTimeFormat', value)}
                                                value={values.dateTimeFormat}
                                                onBlur={() => setFieldTouched("dateTimeFormat", true)}>
                                                    <Option value="Month Day, Year">Month Day, Year</Option>
                                                    <Option value="Day Month, Year">Day Month, Year</Option>
                                                    <Option value="Year Month Day">Year Month Day</Option>
                                                </Select>
                                            )}
                                        </Field>
                                        <ErrorMessage name="dateTimeFormat" component="div" className="error-message text-red-500 my-1" />
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