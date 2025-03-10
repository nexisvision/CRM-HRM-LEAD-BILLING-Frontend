import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Switch, Row, Dropdown, Menu, Col, message } from 'antd';
import { Editplan, GetPlan } from './PlanReducers/PlanSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getcurren } from '../setting/currencies/currenciesSlice/currenciesSlice';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const EditPlan = ({ planData, onUpdate, id, onClose }) => {
  const allPlans = useSelector((state) => state.Plan.Plan || []);
  const currentPlan = allPlans.find(plan => plan.id === id) || {};

  const [isTrialEnabled, setIsTrialEnabled] = useState(currentPlan?.trial || false);
  const [durationType, setDurationType] = useState(() => {
    if (currentPlan?.duration?.toLowerCase().includes('month')) return 'Monthly';
    if (currentPlan?.duration?.toLowerCase().includes('year')) return 'Yearly';
    if (currentPlan?.duration?.toLowerCase().includes('lifetime')) return 'Lifetime';
    return null;
  });

  const getDurationValue = () => {
    if (!currentPlan?.duration) return null;
    const match = currentPlan.duration.match(/(\d+)/);
    return match ? match[1] : null;
  };

  const [selectedMonth, setSelectedMonth] = useState(() => {
    return durationType === 'Monthly' ? getDurationValue() : null;
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    return durationType === 'Yearly' ? getDurationValue() : null;
  });

  const initialValues = {
    name: currentPlan?.name || '',
    price: currentPlan?.price || '',
    duration: currentPlan?.duration || '',
    max_users: currentPlan?.max_users || '',
    max_customers: currentPlan?.max_customers || '',
    max_vendors: currentPlan?.max_vendors || '',
    max_clients: currentPlan?.max_clients || '',
    storage_limit: currentPlan?.storage_limit || '',
    currency: currentPlan?.currency || getDefaultCurrency(),
    trial: currentPlan?.trial || false,
    trial_period: currentPlan?.trial_period || '',
  };

  useEffect(() => {
    if (formikRef.current) {
      const { setFieldValue } = formikRef.current;
      if (durationType === 'Monthly' && selectedMonth) {
        setFieldValue('duration', `${selectedMonth} Month${selectedMonth > 1 ? 's' : ''}`);
      } else if (durationType === 'Yearly' && selectedYear) {
        setFieldValue('duration', `${selectedYear} Year${selectedYear > 1 ? 's' : ''}`);
      } else if (durationType === 'Lifetime') {
        setFieldValue('duration', 'Lifetime');
      }
    }
  }, [durationType, selectedMonth, selectedYear]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const alldept = useSelector((state) => state.Plan);
  const alldept2 = alldept.Plan.data;

  const formikRef = React.useRef();

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  useEffect(() => {
    if (formikRef.current && fnddatass?.length > 0) {
      const { values, setFieldValue } = formikRef.current;
      if (!values.currency) {
        const inrCurrency = fnddatass.find(c => c.currencyCode === 'INR');
        if (inrCurrency) {
          setFieldValue('currency', inrCurrency.id);
        } else {
          setFieldValue('currency', fnddatass[0].id);
        }
      }
    }
  }, [fnddatass]);

  const getDefaultCurrency = () => {
    if (fnddatass?.length > 0) {
      const inrCurrency = fnddatass.find(c => c.currencyCode === 'INR');
      return inrCurrency?.id || fnddatass[0]?.id || '';
    }
    return '';
  };

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
    trial: Yup.boolean(),
  });

  const handleSubmit = (values) => {
    const submitValues = {
      ...values,
      trial_period: values.trial ? String(values.trial_period) : '',
      status: currentPlan.status
    };

    dispatch(Editplan({ id, values: submitValues }))
      .then(() => {
        dispatch(GetPlan());
        onClose();
        navigate('/app/superadmin/plan');
      })
      .catch((error) => {
        console.error('Edit API error:', error);
      });
  };

  return (
    <div>
      <h2 className="mb-3 border-b pb-1 font-medium"></h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        innerRef={formikRef}
      >
        {({ values, handleSubmit, setFieldValue, errors, touched }) => {
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

          return (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Plan Name <span className="text-blue-600">*</span></label>
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

                    {/* Price & Currency */}
                    <Col span={12}>
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Price & Currency <span className="text-red-500">*</span></label>
                        <div className="flex">
                          <Field name="currency">
                            {({ field }) => (
                              <Select
                                {...field}
                                className="currency-select"
                                style={{
                                  width: '90px',
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0,
                                  borderRight: 0,
                                  backgroundColor: '#f4f6f8',
                                }}
                                placeholder={<span className="text-gray-400">$</span>}
                                onChange={(value) => setFieldValue("currency", value)}
                                value={values.currency || getDefaultCurrency()}
                                dropdownStyle={{ minWidth: '180px' }}
                                suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
                              >
                                {fnddatass?.map((currency) => (
                                  <Option
                                    key={currency.id}
                                    value={currency.id}
                                    className={currency.currencyCode === 'USD' ? 'font-semibold' : ''}
                                  >
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
                                  borderLeft: 0,
                                  width: 'calc(100% - 90px)'
                                }}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                    form.setFieldValue('price', String(value));
                                  }
                                }}
                              />
                            )}
                          </Field>
                        </div>
                        <ErrorMessage name="price" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>
                    </Col>

                    {/* Duration */}
                    <Col span={12}>
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Duration <span className="text-red-500">*</span></label>
                        <Dropdown overlay={mainMenu} trigger={['click']}>
                          <Button className="w-full text-left flex justify-between items-center">
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
                        {errors.duration && touched.duration && (
                          <div className="text-red-500 mt-1 text-sm">{errors.duration}</div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Limits */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Limits</h3>
                  <Row gutter={16}>
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
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-blue-600 hover:bg-blue-700 border-0"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>

      {/* Add the same styles as AddPlan */}
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

export default EditPlan;
