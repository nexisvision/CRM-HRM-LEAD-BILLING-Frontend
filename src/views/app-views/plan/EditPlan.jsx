import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Switch, Row, Col, message } from 'antd';
import { Editplan, GetPlan } from './PlanReducers/PlanSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getcurren } from '../setting/currencies/currenciesSlice/currenciesSlice';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const EditPlan = ({ planData, onUpdate, id, onClose }) => {
  const [isTrialEnabled, setIsTrialEnabled] = useState(planData?.trial || false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies;
  const alldept = useSelector((state) => state.Plan);
  const alldept2 = alldept.Plan.data;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter the plan name!'),
    price: Yup.string().required('Please enter the plan price!'),
    duration: Yup.string().required('Please select a duration!'),
    max_users: Yup.string().required('Please enter the maximum users!'),
    max_customers: Yup.string().required('Please enter the maximum customers!'),
    max_vendors: Yup.string().required('Please enter the maximum vendors!'),
    max_clients: Yup.string().required('Please enter the maximum clients!'),
    storage_limit: Yup.string().required('Please enter the storage limit!'),
    currency: Yup.string().required('Please select a currency!'),
    description: Yup.string().required('Please enter a description!'),
    trial: Yup.boolean(),
    trialDays: Yup.string().when('trial', {
      is: true,
      then: (schema) => schema.required('Please enter the number of trial days!'),
      otherwise: (schema) => schema.notRequired(),
    })
  });

  const initialValues = {
    name: '',
    price: '',
    duration: '',
    max_users: '',
    max_customers: '',
    max_vendors: '',
    max_clients: '',
    storage_limit: '',
    currency: '',
    description: '',
    trial: false,
    trialDays: '',
    ...planData
  };

  const handleSubmit = (values) => {
    const submitValues = {
      ...values,
      trialDays: values.trial ? values.trialDays : ''
    };

    dispatch(Editplan({ id, values: submitValues }))
      .then(() => {
        dispatch(GetPlan());
        message.success("Plan details updated successfully!");
        onClose();
        navigate('/app/superadmin/plan');
      })
      .catch((error) => {
        message.error('Failed to update plan.');
        console.error('Edit API error:', error);
      });
    onUpdate(submitValues);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, setFieldValue, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1">Name <span className="text-red-500">*</span></label>
                  <Field
                    name="name"
                    as={Input}
                    placeholder="Enter Plan Name"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500" />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1">Price <span className="text-red-500">*</span></label>
                  <Field
                    name="price"
                    as={Input}
                    placeholder="Enter Plan Price"
                  />
                  <ErrorMessage name="price" component="div" className="text-red-500" />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1">Duration <span className="text-red-500">*</span></label>
                  <Field name="duration">
                    {({ field }) => (
                      <Select {...field} className="w-full">
                        <Option value="Lifetime">Lifetime</Option>
                        <Option value="Yearly">Yearly</Option>
                        <Option value="Monthly">Monthly</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="duration" component="div" className="text-red-500" />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1">Maximum Users <span className="text-red-500">*</span></label>
                  <Field
                    name="max_users"
                    as={Input}
                    placeholder="Enter Maximum Users"
                  />
                  <ErrorMessage name="max_users" component="div" className="text-red-500" />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1">Maximum Customers <span className="text-red-500">*</span></label>
                  <Field
                    name="max_customers"
                    as={Input}
                    placeholder="Enter Maximum Customers"
                  />
                  <ErrorMessage name="max_customers" component="div" className="text-red-500" />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1">Maximum Vendors <span className="text-red-500">*</span></label>
                  <Field
                    name="max_vendors"
                    as={Input}
                    placeholder="Enter Maximum Vendors"
                  />
                  <ErrorMessage name="max_vendors" component="div" className="text-red-500" />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1">Maximum Clients <span className="text-red-500">*</span></label>
                  <Field
                    name="max_clients"
                    as={Input}
                    placeholder="Enter Maximum Clients"
                  />
                  <ErrorMessage name="max_clients" component="div" className="text-red-500" />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1">Storage Limit (MB) <span className="text-red-500">*</span></label>
                  <Field
                    name="storage_limit"
                    as={Input}
                    placeholder="Maximum Storage Limit"
                    suffix="MB"
                  />
                  <ErrorMessage name="storage_limit" component="div" className="text-red-500" />
                </div>
              </Col>

              <Col span={24}>
                <div className="mb-4">
                  <label className="block mb-1">Currency <span className="text-red-500">*</span></label>
                  <Field name="currency">
                    {({ field }) => (
                      <Select {...field} className="w-full" placeholder="Select Currency">
                        {fnddatass && fnddatass?.length > 0 ? (
                          fnddatass?.map((client) => (
                            <Option key={client.id} value={client?.id}>
                              {client?.currencyIcon || client?.currencyCode || "Unnamed currency"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>No Currencies Available</Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="currency" component="div" className="text-red-500" />
                </div>
              </Col>
            </Row>

            <div className="mb-4">
              <label className="block mb-1">Description <span className="text-red-500">*</span></label>
              <Field
                name="description"
                as={Input.TextArea}
                rows={4}
                placeholder="Enter Description"
              />
              <ErrorMessage name="description" component="div" className="text-red-500" />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Trial is enabled (on/off)</label>
              <Field name="trial">
                {({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={(checked) => {
                      setFieldValue('trial', checked);
                      setIsTrialEnabled(checked);
                    }}
                  />
                )}
              </Field>
            </div>

            {isTrialEnabled && (
              <div className="mb-4">
                <label className="block mb-1">Trial Days <span className="text-red-500">*</span></label>
                <Field
                  name="trialDays"
                  as={Input}
                  placeholder="Enter Number of Trial Days"
                />
                <ErrorMessage name="trialDays" component="div" className="text-red-500" />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ marginRight: '8px' }} onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
             Save Changes
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default EditPlan;
