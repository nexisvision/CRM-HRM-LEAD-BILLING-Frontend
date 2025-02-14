import React, { useEffect, useState } from 'react';
import { Input, Button, Switch, Row, Col, message, Menu, Dropdown, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CreatePlan, GetPlan } from './PlanReducers/PlanSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getcurren } from '../setting/currencies/currenciesSlice/currenciesSlice';
// import { getallcurrencies } from '../setting/currencies/currenciesreducer/currenciesSlice';

const { Option } = Select;

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter the plan name!'),
  price: Yup.string().required('Please enter the plan price!'),
  duration: Yup.string().required('Please select a duration!'),
  max_users: Yup.string().required('Please enter the maximum users!'),
  max_customers: Yup.string().required('Please enter the maximum customers!'),
  max_vendors: Yup.string().required('Please enter the maximum vendors!'),
  max_clients: Yup.string().required('Please enter the maximum clients!'),
  storage_limit: Yup.string().required('Please enter the storage limit!'),
  description: Yup.string().required('Please enter a description!'),
  trial_period: Yup.string().when('trial', {
    is: true,
    then: Yup.string().required('Please enter trial period!')
  })
});

const AddPlan = ({ onClose }) => {
  const [isTrialEnabled, setIsTrialEnabled] = useState(false);

  const [featureStates, setFeatureStates] = useState({
    CRM: false,
    Project: false,
    HRM: false,
    Account: false,
    POS: false,
    ChatGPT: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [durationType, setDurationType] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const handleMenuClick = (e) => {
    if (e.key === 'Lifetime') {
      setDurationType('Lifetime');
      setSelectedMonth(null);
      setSelectedYear(null);
    }
  };

  useEffect(() => {
    dispatch(getcurren());
  }, []);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;


  const yearlyMenu = (
    <Menu onClick={({ key }) => {
      setDurationType('Yearly');
      setSelectedYear(key);
    }}>
      <Menu.Item className='w-full'>
        <Input 
          placeholder="Enter years"
          type="number"
          onChange={(e) => {
            const value = e.target.value;
            setSelectedYear(value);
          }}
        />
      </Menu.Item>
    </Menu>
  );

  const monthlyMenu = (
    <Menu onClick={({ key }) => {
      setDurationType('Monthly');
      setSelectedMonth(key);
    }}>
      {Array.from({ length: 12 }, (_, i) => (
        <Menu.Item key={i + 1}>{`${i + 1} Month${i + 1 > 1 ? 's' : ''}`}</Menu.Item>
      ))}
    </Menu>
  );

  const mainMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="Lifetime">Lifetime</Menu.Item>
      <Menu.SubMenu key="Yearly" title="Yearly">
        {yearlyMenu}
      </Menu.SubMenu>
      <Menu.SubMenu key="Monthly" title="Monthly">
        {monthlyMenu}
      </Menu.SubMenu>
    </Menu>
  );

  const initialValues = {
    name: '',
    price: '',
    duration: '',
    max_users: '',
    max_customers: '',
    max_vendors: '',
    max_clients: '',
    storage_limit: '',
    description: '',
    trial: false,
    trial_period: ''
  };

  const handleSubmit = (values, { resetForm }) => {
    const payload = { ...values, features: featureStates };

    dispatch(CreatePlan(payload))
      .then(() => {
        dispatch(GetPlan());
        onClose();
        setIsTrialEnabled(false);
        message.success('Plan added successfully!');
        resetForm();
        navigate('/app/superadmin/plan');
      })
      .catch((error) => {
        message.error('Failed to add plan.');
        console.error('Add API error:', error);
      });
  };

  const handleTrialToggle = (checked) => {
    setIsTrialEnabled(checked);
  };

  const handleFeatureToggle = (feature, checked) => {
    setFeatureStates((prev) => ({ ...prev, [feature]: checked }));
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, handleChange }) => {
          const handleMonthlySelect = ({ key }) => {
            setDurationType('Monthly');
            setSelectedMonth(key);
            setFieldValue('duration', 'Monthly');
            setFieldValue('monthCount', key);
          };

          const handleYearlyInputChange = ({ key }) => {
            setDurationType('Yearly');
            setSelectedYear(key);
            setFieldValue('duration', 'Yearly');
            setFieldValue('yearCount', key);
          };

          return (
            <Form>
              <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

              <Row gutter={16}>
                <Col span={12}>
                  <div className="form-group">
                    <label>Name</label>
                    <Field name="name">
                      {({ field }) => (
                        <Input 
                          {...field} 
                          placeholder="Enter Plan Name" 
                        />
                      )}
                    </Field>
                    {errors.name && touched.name && (
                      <div className="error-message">{errors.name}</div>
                    )}
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-group">
                    <label>Price</label>
                    <Field name="price">
                      {({ field }) => (
                        <Input 
                          {...field} 
                          placeholder="Enter Plan Price" 
                        />
                      )}
                    </Field>
                    {errors.price && touched.price && (
                      <div className="error-message">{errors.price}</div>
                    )}
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-group">
                    <label>Duration</label>
                    <Dropdown 
                      overlay={mainMenu} 
                      trigger={['click']} 
                      className='w-full'
                    >
                      <Button>
                        {durationType === 'Monthly' && selectedMonth
                          ? `${selectedMonth} Month${selectedMonth > 1 ? 's' : ''}`
                          : durationType === 'Yearly' && selectedYear
                            ? `${selectedYear} Year${selectedYear > 1 ? 's' : ''}`
                            : durationType === 'Lifetime'
                              ? 'Lifetime'
                              : 'Select Duration'}
                      </Button>
                    </Dropdown>
                    {errors.duration && touched.duration && (
                      <div className="error-message">{errors.duration}</div>
                    )}
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-group">
                    <label>Maximum Users</label>
                    <Field name="max_users">
                      {({ field }) => (
                        <Input 
                          {...field} 
                          placeholder="Enter Maximum Users" 
                        />
                      )}
                    </Field>
                    {errors.max_users && touched.max_users && (
                      <div className="error-message">{errors.max_users}</div>
                    )}
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-group">
                    <label>Maximum Customers</label>
                    <Field name="max_customers">
                      {({ field }) => (
                        <Input 
                          {...field} 
                          placeholder="Enter Maximum Customers" 
                        />
                      )}
                    </Field>
                    {errors.max_customers && touched.max_customers && (
                      <div className="error-message">{errors.max_customers}</div>
                    )}
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-group">
                    <label>Maximum Vendors</label>
                    <Field name="max_vendors">
                      {({ field }) => (
                        <Input 
                          {...field} 
                          placeholder="Enter Maximum Vendors" 
                        />
                      )}
                    </Field>
                    {errors.max_vendors && touched.max_vendors && (
                      <div className="error-message">{errors.max_vendors}</div>
                    )}
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-group">
                    <label>Maximum Clients</label>
                    <Field name="max_clients">
                      {({ field }) => (
                        <Input 
                          {...field} 
                          placeholder="Enter Maximum Clients" 
                        />
                      )}
                    </Field>
                    {errors.max_clients && touched.max_clients && (
                      <div className="error-message">{errors.max_clients}</div>
                    )}
                  </div>
                </Col>

                <Col span={12}>
                  <div className="form-group">
                    <label>Storage Limit (MB)</label>
                    <Field name="storage_limit">
                      {({ field }) => (
                        <Input 
                          {...field} 
                          placeholder="Maximum Storage Limit" 
                          suffix="MB" 
                        />
                      )}
                    </Field>
                    {errors.storage_limit && touched.storage_limit && (
                      <div className="error-message">{errors.storage_limit}</div>
                    )}
                  </div>
                </Col>

                <Col span={24} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">currency</label>
                    <Field name="currency">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full mt-2"
                          placeholder="Select currency"
                          onChange={(value) => setFieldValue("currency", value)}
                          value={values.currency}
                        >
                          {fnddatass && fnddatass?.length > 0 ? (
                            fnddatass?.map((client) => (
                              <Option key={client.id} value={client?.id}>
                                {client?.currencyIcon ||
                                  client?.currencyCode ||
                                  "Unnamed currency"}
                              </Option>
                            ))
                          ) : (
                            <Option value="" disabled>
                              No currency Available
                            </Option>
                          )}
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="currency"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
              </Row>

              <div className="form-group">
                <label>Description</label>
                <Field name="description">
                  {({ field }) => (
                    <Input.TextArea 
                      {...field} 
                      placeholder="Enter Description" 
                      rows={4} 
                    />
                  )}
                </Field>
                {errors.description && touched.description && (
                  <div className="error-message">{errors.description}</div>
                )}
              </div>

              <div className="form-group">
                <label>Trial is enabled (on/off)</label>
                <Field name="trial">
                  {({ field }) => (
                    <Switch 
                      checked={field.value}
                      onChange={(checked) => {
                        setFieldValue('trial', checked);
                        handleTrialToggle(checked);
                      }}
                    />
                  )}
                </Field>
              </div>

              {isTrialEnabled && durationType !== 'Lifetime' && (
                <div className="form-group">
                  <label>Trial Days</label>
                  <Field name="trial_period">
                    {({ field }) => (
                      <Input 
                        {...field} 
                        placeholder="Enter Number of Trial Days" 
                      />
                    )}
                  </Field>
                  {errors.trial_period && touched.trial_period && (
                    <div className="error-message">{errors.trial_period}</div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button style={{ marginRight: '8px' }} onClick={() => {
                  onClose();
                  setIsTrialEnabled(false);
                }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddPlan;
