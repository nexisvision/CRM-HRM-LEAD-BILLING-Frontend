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
  price: Yup.number()
    .typeError('Price must be a number')
    .required('Please enter the plan price!')
    .min(0, 'Price cannot be negative')
    .test(
      'decimal',
      'Price cannot have more than 2 decimal places',
      (value) => {
        if (!value) return true;
        return /^\d*\.?\d{0,2}$/.test(value.toString());
      }
    ),
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [durationType, setDurationType] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const getInitialCurrency = () => {
    if (fnddatass?.length > 0) {
      const inrCurrency = fnddatass.find(c => c.currencyCode === 'INR');
      return inrCurrency?.id || fnddatass[0]?.id;
    }
    return '';
  };

  const initialValues = {
    name: '',
    price: '',
    duration: '',
    max_users: '',
    max_customers: '',
    max_vendors: '',
    max_clients: '',
    storage_limit: '',
    currency: getInitialCurrency(),
    trial: false,
    trial_period: '',
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
      max_users: String(values.max_users),
      max_customers: String(values.max_customers),
      max_vendors: String(values.max_vendors),
      max_clients: String(values.max_clients),
      storage_limit: String(values.storage_limit),
      price: String(values.price),
      trial_period: values.trial ? String(values.trial_period) : ''
    };


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

  return (
    <div>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
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
              <div className="bg-white p-6 rounded-lg">
                {/* Basic Plan Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Plan Details</h3>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Plan Name <span className="text-red-500">*</span></label>
                        <Field name="name">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter Plan Name"
                              className="w-full rounded-md"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="name" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>
                    </Col>

                    <Col span={12}>
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Price & Currency <span className="text-red-500">*</span></label>
                        <div className="flex gap-0">
                          <Field name="currency">
                            {({ field }) => (
                              <Select
                                {...field}
                                className="currency-select"
                                style={{
                                  width: '60px',
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0,
                                  borderRight: 0,
                                  backgroundColor: '#f8fafc',
                                }}
                                placeholder={<span className="text-gray-400">₹</span>}
                                onChange={(value) => {
                                  if (value === 'add_new') {
                                    setIsAddCurrencyModalVisible(true);
                                  } else {
                                    setFieldValue("currency", value);
                                  }
                                }}
                                value={values.currency}
                                dropdownStyle={{ minWidth: '180px' }}
                                suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
                                loading={!fnddatass}
                                dropdownRender={menu => (
                                  <div>
                                    <div
                                      className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
                                      onClick={() => setIsAddCurrencyModalVisible(true)}
                                    >
                                      <PlusOutlined className="mr-2" />
                                      <span className="text-sm">Add New</span>
                                    </div>
                                    {menu}
                                  </div>
                                )}
                              >
                                {fnddatass?.map((currency) => (
                                  <Option key={currency.id} value={currency.id}>
                                    <div className="flex items-center w-full px-1">
                                      <span className="text-base min-w-[24px]">{currency.currencyIcon}</span>
                                      <span className="text-gray-600 text-sm ml-3">{currency.currencyName}</span>
                                      <span className="text-gray-400 text-xs ml-auto">{currency.currencyCode}</span>
                                    </div>
                                  </Option>
                                ))}
                              </Select>
                            )}
                          </Field>
                          <Field name="price">
                            {({ field, form }) => (
                              <Input
                                {...field}
                                className="price-input"
                                style={{
                                  borderTopLeftRadius: 0,
                                  borderBottomLeftRadius: 0,
                                  borderLeft: '1px solid #d9d9d9',
                                  width: 'calc(100% - 100px)'
                                }}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                    form.setFieldValue('price', value);
                                  }
                                }}
                                onKeyPress={(e) => {
                                  const charCode = e.which ? e.which : e.keyCode;
                                  if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                                    e.preventDefault();
                                  }
                                  if (charCode === 46 && field.value.includes('.')) {
                                    e.preventDefault();
                                  }
                                }}
                                prefix={
                                  values.currency && (
                                    <span className="text-gray-600 font-medium mr-1">
                                      {fnddatass?.find(c => c.id === values.currency)?.currencyIcon}
                                    </span>
                                  )
                                }
                              />
                            )}
                          </Field>
                        </div>
                        <ErrorMessage name="price" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>
                    </Col>

                    <Col span={12}>
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Duration <span className="text-red-500">*</span></label>
                        <Dropdown
                          overlay={mainMenu}
                          trigger={['click']}
                          className="w-full"
                        >
                          <Button className="w-full flex justify-between items-center">
                            <span>
                              {durationType === 'Monthly' && selectedMonth
                                ? `${selectedMonth} Month${selectedMonth > 1 ? 's' : ''}`
                                : durationType === 'Yearly' && selectedYear
                                  ? `${selectedYear} Year${selectedYear > 1 ? 's' : ''}`
                                  : durationType === 'Lifetime'
                                    ? 'Lifetime'
                                    : 'Select Duration'}
                            </span>
                            <span className="text-gray-400">▼</span>
                          </Button>
                        </Dropdown>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Usage Limits */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Usage Limits</h3>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Maximum Users <span className="text-red-500">*</span></label>
                        <Field name="max_users">
                          {({ field, form }) => (
                            <Input
                              {...field}
                              placeholder="Enter Maximum Users"
                              type="number"
                              min="1"
                              className="w-full rounded-md"
                              onChange={(e) => {
                                form.setFieldValue('max_users', String(e.target.value));
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="max_users" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>
                    </Col>

                    <Col span={12}>
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Maximum Customers <span className="text-red-500">*</span></label>
                        <Field name="max_customers">
                          {({ field, form }) => (
                            <Input
                              {...field}
                              placeholder="Enter Maximum Customers"
                              type="number"
                              min="1"
                              className="w-full rounded-md"
                              onChange={(e) => {
                                form.setFieldValue('max_customers', String(e.target.value));
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="max_customers" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>
                    </Col>

                    <Col span={12}>
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Maximum Vendors <span className="text-red-500">*</span></label>
                        <Field name="max_vendors">
                          {({ field, form }) => (
                            <Input
                              {...field}
                              placeholder="Enter Maximum Vendors"
                              type="number"
                              min="1"
                              className="w-full rounded-md"
                              onChange={(e) => {
                                form.setFieldValue('max_vendors', String(e.target.value));
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="max_vendors" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>
                    </Col>

                    <Col span={12}>
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Maximum Clients <span className="text-red-500">*</span></label>
                        <Field name="max_clients">
                          {({ field, form }) => (
                            <Input
                              {...field}
                              placeholder="Enter Maximum Clients"
                              type="number"
                              min="1"
                              className="w-full rounded-md"
                              onChange={(e) => {
                                form.setFieldValue('max_clients', String(e.target.value));
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="max_clients" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>
                    </Col>

                    <Col span={12}>
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Storage Limit (MB) <span className="text-red-500">*</span></label>
                        <Field name="storage_limit">
                          {({ field, form }) => (
                            <Input
                              {...field}
                              placeholder="Maximum Storage Limit"
                              type="number"
                              min="1"
                              suffix="MB"
                              className="w-full rounded-md"
                              onChange={(e) => {
                                form.setFieldValue('storage_limit', String(e.target.value));
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="storage_limit" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Trial Period */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Trial Period</h3>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="form-group mb-4">
                        <Switch
                          checked={values.trial}
                          onChange={(checked) => {
                            setFieldValue('trial', checked);
                            if (!checked) setFieldValue('trial_period', '');
                          }}
                          className="mr-2"
                        />
                        <span className="text-gray-600">Enable Trial Period</span>
                      </div>
                    </Col>
                    {values.trial && (
                      <Col span={12}>
                        <div className="form-group mb-4">
                          <Field name="trial_period">
                            {({ field, form }) => (
                              <Input
                                {...field}
                                placeholder="Enter trial period in days"
                                type="number"
                                min="1"
                                suffix="Days"
                                className="w-full rounded-md"
                                onChange={(e) => {
                                  form.setFieldValue('trial_period', String(e.target.value));
                                }}
                              />
                            )}
                          </Field>
                          <ErrorMessage name="trial_period" component="div" className="text-red-500 mt-1 text-sm" />
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-2">
                  <Button onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Create Plan
                  </Button>
                </div>
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

      {/* Custom render for selected value */}
      <style jsx>{`
        .currency-select .ant-select-selection-item {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 16px !important;
        }

        .currency-select .ant-select-selection-item > div {
          display: flex !important;
          align-items: center !important;
        }

        .currency-select .ant-select-selection-item span:not(:first-child) {
          display: none !important;
        }

        .ant-select-dropdown .ant-select-item {
          padding: 8px 12px !important;
        }

        .ant-select-dropdown .ant-select-item-option-content > div {
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
        }
      `}</style>
    </div>
  );
};
export default AddPlan;
