import React from 'react';
import { Card, Row, Col, Switch, Button, message } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  // Razorpay Validation
  razorpayEnabled: Yup.boolean(),
  razorpayKeyId: Yup.string().when('razorpayEnabled', {
    is: true,
    then: Yup.string().required('Key ID is required')
  }),
  razorpaySecretKey: Yup.string().when('razorpayEnabled', {
    is: true,
    then: Yup.string().required('Secret Key is required')
  }),
  
  // PhonePay Validation
  phonePayEnabled: Yup.boolean(),
  phonePayMerchantId: Yup.string().when('phonePayEnabled', {
    is: true,
    then: Yup.string().required('Merchant ID is required')
  }),
  phonePaySecretKey: Yup.string().when('phonePayEnabled', {
    is: true,
    then: Yup.string().required('Secret Key is required')
  })
});

const PaymentList = () => {
  const initialValues = {
    razorpayEnabled: false,
    razorpayKeyId: '',
    razorpaySecretKey: '',
    phonePayEnabled: false,
    phonePayMerchantId: '',
    phonePaySecretKey: ''
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Form Values:', values);
    message.success('Payment settings updated successfully');
    setSubmitting(false);
  };

  return (
    <div className="p-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <Row gutter={[24, 24]}>
              {/* Razorpay Section */}
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Razorpay Settings</span>
                      <Switch
                        checked={values.razorpayEnabled}
                        onChange={(checked) => setFieldValue('razorpayEnabled', checked)}
                        className={`${values.razorpayEnabled ? '!bg-blue-500' : '!bg-gray-300'}`}
                      />
                    </div>
                  }
                  className="h-full shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Key ID
                      </label>
                      <Field
                        name="razorpayKeyId"
                        type="text"
                        disabled={!values.razorpayEnabled}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          !values.razorpayEnabled ? 'bg-gray-100' : 'bg-white'
                        } ${
                          errors.razorpayKeyId && touched.razorpayKeyId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.razorpayKeyId && touched.razorpayKeyId && (
                        <div className="text-red-500 text-sm mt-1">{errors.razorpayKeyId}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secret Key
                      </label>
                      <Field
                        name="razorpaySecretKey"
                        type="password"
                        disabled={!values.razorpayEnabled}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          !values.razorpayEnabled ? 'bg-gray-100' : 'bg-white'
                        } ${
                          errors.razorpaySecretKey && touched.razorpaySecretKey ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.razorpaySecretKey && touched.razorpaySecretKey && (
                        <div className="text-red-500 text-sm mt-1">{errors.razorpaySecretKey}</div>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>

              {/* PhonePay Section */}
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">PhonePay Settings</span>
                      <Switch
                        checked={values.phonePayEnabled}
                        onChange={(checked) => setFieldValue('phonePayEnabled', checked)}
                        className={`${values.phonePayEnabled ? '!bg-blue-500' : '!bg-gray-300'}`}
                      />
                    </div>
                  }
                  className="h-full shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Merchant ID
                      </label>
                      <Field
                        name="phonePayMerchantId"
                        type="text"
                        disabled={!values.phonePayEnabled}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          !values.phonePayEnabled ? 'bg-gray-100' : 'bg-white'
                        } ${
                          errors.phonePayMerchantId && touched.phonePayMerchantId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phonePayMerchantId && touched.phonePayMerchantId && (
                        <div className="text-red-500 text-sm mt-1">{errors.phonePayMerchantId}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secret Key
                      </label>
                      <Field
                        name="phonePaySecretKey"
                        type="password"
                        disabled={!values.phonePayEnabled}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          !values.phonePayEnabled ? 'bg-gray-100' : 'bg-white'
                        } ${
                          errors.phonePaySecretKey && touched.phonePaySecretKey ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phonePaySecretKey && touched.phonePaySecretKey && (
                        <div className="text-red-500 text-sm mt-1">{errors.phonePaySecretKey}</div>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Save Changes
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PaymentList;
