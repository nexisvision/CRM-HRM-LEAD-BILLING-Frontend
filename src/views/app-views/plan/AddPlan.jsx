import React, { useEffect, useState } from 'react';
import { Input, Button, Switch, Row, Col, message, Menu, Dropdown, Select, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CreatePlan, GetPlan } from './PlanReducers/PlanSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getcurren } from '../setting/currencies/currenciesSlice/currenciesSlice';
import { PlusOutlined } from '@ant-design/icons';
import AddCurrencies from '../setting/currencies/AddCurrencies';
// import { getallcurrencies } from '../setting/currencies/currenciesreducer/currenciesSlice';
const { Option } = Select;
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter the plan name!'),
  price: Yup.string().required('Please enter the plan price!'),
  // duration: Yup.string().required('Please select a duration!'),
  max_users: Yup.string().required('Please enter the maximum users!'),
  max_customers: Yup.string().required('Please enter the maximum customers!'),
  max_vendors: Yup.string().required('Please enter the maximum vendors!'),
  max_clients: Yup.string().required('Please enter the maximum clients!'),
  storage_limit: Yup.string().required('Please enter the storage limit!'),
  description: Yup.string().required('Please enter a description!'),
  trial_period: Yup.string().when('trial', {
    is: true,
    then: Yup.string()
      .required('Please enter trial period!')
      .matches(/^[0-9]+$/, 'Must be a number')
      .min(1, 'Must be at least 1 day')
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
  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getcurren());
  }, []);
  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

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
    let formattedDuration = 'Lifetime';
    
    if (durationType === 'Monthly' && selectedMonth) {
      formattedDuration = `${selectedMonth} Month${selectedMonth > 1 ? 's' : ''}`;
    } else if (durationType === 'Yearly' && selectedYear) {
      formattedDuration = `${selectedYear} Year${selectedYear > 1 ? 's' : ''}`;
    }
                      
    const payload = { 
      ...values, 
      duration: formattedDuration,
      features: featureStates 
    };


    console.log('Payload:', payload); // Log payload before dispatching API request

    
    dispatch(CreatePlan(payload))
      .then(() => {
        dispatch(GetPlan());
        onClose();
        setIsTrialEnabled(false);
        resetForm();
        navigate('/app/superadmin/plan');
      })
      .catch((error) => {
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
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, handleChange }) => {
          const handleMenuClick = (e) => {
            if (e.key === 'Lifetime') {
              setDurationType('Lifetime');
              setSelectedMonth(null);
              setSelectedYear(null);
              setFieldValue('duration', 'Lifetime');
            }
          };

          const yearlyMenu = (
            <Menu onClick={({ key }) => {
              setDurationType('Yearly');
              setSelectedYear(key);
              setFieldValue('duration', 'Per Year');
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
              setFieldValue('duration', 'Per Month');
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
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Name <span style={{ color: 'red' }}>*</span></label>
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
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Price <span style={{ color: 'red' }}>*</span></label>
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
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Duration <span style={{ color: 'red' }}>*</span></label>
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
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Maximum Users <span style={{ color: 'red' }}>*</span></label>
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
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Maximum Customers <span style={{ color: 'red' }}>*</span></label>
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
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Maximum Vendors <span style={{ color: 'red' }}>*</span></label>
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
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Maximum Clients <span style={{ color: 'red' }}>*</span></label>
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
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Storage Limit (MB) <span style={{ color: 'red' }}>*</span></label>
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

                <Col span={24}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Currency <span style={{ color: 'red' }}>*</span></label>
                    <div className="flex gap-2">
                      <Field name="currency">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full mt-2"
                            placeholder="Select currency"
                            onChange={(value) => setFieldValue("currency", value)}
                            value={values.currency}
                            dropdownRender={(menu) => (
                              <>
                                {menu}
                                <div
                                  style={{
                                    padding: '8px',
                                    borderTop: '1px solid #e8e8e8',
                                  }}
                                >
                                  <Button
                                    type="text"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsAddCurrencyModalVisible(true)}
                                    block
                                  >
                                    Add New Currency
                                  </Button>
                                </div>
                              </>
                            )}
                          >
                            {fnddatass && fnddatass?.length > 0 ? (
                              fnddatass?.map((client) => (
                                <Option key={client.id} value={client?.id}>
                                  {client?.currencyIcon} {client?.currencyCode || "Unnamed currency"}
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
                    </div>
                    <ErrorMessage
                      name="currency"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Trial Period</label>
                    <div className="d-flex align-items-center">
                      <Switch
                        checked={values.trial}
                        onChange={(checked) => {
                          setFieldValue('trial', checked);
                          if (!checked) {
                            setFieldValue('trial_period', '');
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="ml-2">Enable Trial Period</span>
                    </div>
                  </div>
                </Col>
                {values.trial && (
                  <Col span={12}>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label>Trial Period (Days) <span style={{ color: 'red' }}>*</span></label>
                      <Field name="trial_period">
                        {({ field }) => (
                          <Input
                            {...field}
                            
                            min="1"
                            placeholder="Enter trial period in days"
                            suffix="Days"
                          />
                        )}
                      </Field>
                      {errors.trial_period && touched.trial_period && (
                        <div className="error-message" style={{ color: 'red' }}>
                          {errors.trial_period}
                        </div>
                      )}
                    </div>
                  </Col>
                )}
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
              
              <div className='mt-4'>
                <Switch
                  checked={isTrialEnabled}
                  onChange={handleTrialToggle}
                />
                <span> Trial Period</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }} className='mt-4'>
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

      {/* Add Currency Modal */}
      <Modal
        title="Add New Currency"
        visible={isAddCurrencyModalVisible}
        onCancel={() => setIsAddCurrencyModalVisible(false)}
        footer={null}
        width={600}
      >
        <AddCurrencies
          onClose={() => {
            setIsAddCurrencyModalVisible(false);
            dispatch(getcurren()); // Refresh currency list after adding
          }}
        />
      </Modal>
    </div>
  );
};
export default AddPlan;
