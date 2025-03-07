import React from 'react';
import { Input, Button, Row, Col } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ResetPassword = ({ onClose }) => {
  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/\d/, 'Password must have at least one number')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Logic for resetting the password goes here
      resetForm();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" bg-white max-w-2xl mx-auto">
      {/* <h1 className="text-2xl font-bold mb-6">Reset Password</h1> */}
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div className="border-t border-gray-200 my-6"></div>

            <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} >
                <div className="form-item">
                <label className="font-semibold">New Password <span className="text-red-500">*</span></label>
                  <Field name="password">
                    {({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="Enter new password"
                        className="w-full rounded-md mt-1"
                        size="large"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              </Col>

              <Col xs={24} sm={24} >
                <div className="form-item">
                <label className="font-semibold">Confirm Password <span className="text-red-500">*</span></label>
                  <Field name="confirmPassword">
                    {({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="Confirm new password"
                        className="w-full rounded-md mt-1"
                        size="large"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              </Col>
            </Row>

            <div className="flex justify-end space-x-4 mt-6">
            <Button type="default" className="mr-2" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                // size="large"
                className="mr-2"
              >
                Reset Password
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;
