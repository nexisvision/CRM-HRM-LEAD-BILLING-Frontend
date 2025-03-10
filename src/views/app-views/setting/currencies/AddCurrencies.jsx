import React from "react";
import { Input, Button, message } from "antd";
import { useDispatch } from 'react-redux';
import { addcurren, getcurren } from "./currenciesSlice/currenciesSlice";
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Row, Col } from 'antd';

const validationSchema = Yup.object().shape({
  currencyName: Yup.string().required('Please enter currency name'),
  currencyIcon: Yup.string().required('Please enter currency icon'),
  currencyCode: Yup.string().required('Please enter currency code')
});

const AddCurrencies = ({ onClose }) => {
  const dispatch = useDispatch();

  const initialValues = {
    currencyName: '',
    currencyIcon: '',
    currencyCode: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(addcurren(values)).unwrap();
      await dispatch(getcurren());
     
      message.success('Currency added successfully.');
      resetForm();
      onClose();
    } catch (error) {
    
      message.error('Failed to add currency.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
 <h2 className="mb-3 border-b pb-1 font-medium"></h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Currency Name <span className="text-red-500">*</span></label>
                  <Field
                    name="currencyName"
                    as={Input}
                    placeholder="Enter currency name"
                  />
                  <ErrorMessage
                    name="currencyName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Currency Icon <span className="text-red-500">*</span></label>
                  <Field
                    name="currencyIcon"
                    as={Input}
                    placeholder="Enter currency icon"
                  />
                  <ErrorMessage
                    name="currencyIcon"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Currency Code <span className="text-red-500">*</span></label>
                  <Field
                    name="currencyCode"
                    as={Input}
                    placeholder="Enter currency code"
                  />
                  <ErrorMessage
                    name="currencyCode"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="default"
                onClick={onClose}
                style={{ marginRight: '8px' }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
              >
                Create
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AddCurrencies;
