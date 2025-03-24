import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Switch, Row, Dropdown, Menu, Col, message } from 'antd';
import { Editplan, GetPlan } from './PlanReducers/PlanSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getcurren } from '../setting/currencies/currenciesSlice/currenciesSlice';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const DurationSelector = ({ value, onChange, initialDuration }) => {
  const [selectedType, setSelectedType] = useState(() => {
    if (initialDuration?.toLowerCase().includes('month')) return 'Monthly';
    if (initialDuration?.toLowerCase().includes('year')) return 'Yearly';
    return 'Lifetime';
  });

  const [customValue, setCustomValue] = useState(() => {
    const match = initialDuration?.match(/(\d+)/);
    return match ? match[1] : '';
  });

  useEffect(() => {
    // Set initial value
    if (initialDuration) {
      onChange(initialDuration);
    }
  }, [initialDuration]);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCustomValue(''); // Reset value when changing type
    if (type === 'Lifetime') {
      onChange('Lifetime');
    }
  };

  const handleCustomValueChange = (val, type) => {
    // For monthly, limit to 11
    if (type === 'Month' && Number(val) > 11) {
      return;
    }
    
    // Ensure value is positive and not zero
    if (val && Number(val) > 0) {
      setCustomValue(val);
      const formattedValue = `${val} ${type}${Number(val) > 1 ? 's' : ''}`;
      onChange(formattedValue);
    } else {
      setCustomValue('');
      onChange(''); // Clear the value if invalid
    }
  };

  return (
    <div className="duration-selector">
      <div className="flex gap-4 mb-4">
        <Button
          type={selectedType === 'Lifetime' ? 'primary' : 'default'}
          onClick={() => handleTypeChange('Lifetime')}
          className="flex-1 h-10"
        >
          Lifetime
        </Button>
        <Button
          type={selectedType === 'Monthly' ? 'primary' : 'default'}
          onClick={() => handleTypeChange('Monthly')}
          className="flex-1 h-10"
        >
          Monthly
        </Button>
        <Button
          type={selectedType === 'Yearly' ? 'primary' : 'default'}
          onClick={() => handleTypeChange('Yearly')}
          className="flex-1 h-10"
        >
          Yearly
        </Button>
      </div>

      {selectedType !== 'Lifetime' && (
        <div className="mt-4">
          <Input
            type="number"
            min="1"
            max={selectedType === 'Monthly' ? "11" : undefined}
            placeholder={`Enter number of ${selectedType === 'Monthly' ? 'months (max 11)' : 'years'}`}
            value={customValue}
            onChange={(e) => handleCustomValueChange(e.target.value, selectedType === 'Monthly' ? 'Month' : 'Year')}
            className="w-full h-10 rounded-md"
            suffix={selectedType === 'Monthly' ? 'Months' : 'Years'}
            onKeyPress={(e) => {
              // Prevent negative numbers and decimals
              if (e.key === '-' || e.key === '.' || e.key === 'e') {
                e.preventDefault();
              }
            }}
          />
          {selectedType === 'Monthly' && (
            <div className="text-xs text-gray-500 mt-1">
              For durations longer than 11 months, please use yearly option
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const EditPlan = ({ planData, onUpdate, id, onClose }) => {
  const allPlans = useSelector((state) => state.Plan.Plan || []);
  const currentPlan = allPlans.find(plan => plan.id === id) || {};

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;
  const formikRef = React.useRef();

  const [storageUnit, setStorageUnit] = useState(() => {
    // Initialize based on current value
    const currentValue = Number(currentPlan?.storage_limit || 0);
    return currentValue >= 1024 ? 'GB' : 'MB';
  });

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

  // Update initial values to include is_default
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
    trial_period: currentPlan?.trial_period || '',
    trial: Boolean(currentPlan?.trial_period),
    is_default: currentPlan?.is_default || false,
    status: currentPlan?.status || 'active'
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().optional(),
    price: Yup.string().optional(),
    duration: Yup.string().optional(),
    max_users: Yup.string().optional(),
    max_customers: Yup.string().optional(),
    max_vendors: Yup.string().optional(),
    max_clients: Yup.string().optional(),
    storage_limit: Yup.string().optional(),
    currency: Yup.string().optional(),
    trial_period: Yup.string().optional(),
    trial: Yup.boolean(),
    is_default: Yup.boolean(),
  });

  const handleSubmit = (values) => {
    const submitValues = {
      ...values,
      trial_period: values.trial ? String(values.trial_period) : null,
      status: currentPlan.status,
      is_default: values.is_default
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
      <div className="mb-3 border-b pb-1 font-medium"></div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        innerRef={formikRef}
      >
        {({ values, handleSubmit, setFieldValue, errors, touched }) => {
          return (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
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

                    {/* Add Default Plan Switch */}
                    <Col span={12}>
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Make Default Plan</label>
                        <div className="flex items-center">
                          <Switch
                            checked={values.is_default}
                            onChange={(checked) => setFieldValue('is_default', checked)}
                            className={`${values.is_default ? 'bg-blue-600' : 'bg-gray-200'} mr-2`}
                          />
                          <span className="text-sm text-gray-600">
                            {values.is_default ? 'Default plan for new users' : 'Not default'}
                          </span>
                        </div>
                        {values.is_default && (
                          <div className="text-xs text-gray-500 mt-1">
                            This will remove default status from any other plan
                          </div>
                        )}
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
                        <label className="text-gray-600 mb-2 block">
                          Duration <span className="text-red-500">*</span>
                        </label>
                        <Field name="duration">
                          {({ field, form }) => (
                            <DurationSelector
                              value={field.value}
                              onChange={(value) => form.setFieldValue('duration', value)}
                              initialDuration={currentPlan?.duration}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="duration"
                          component="div"
                          className="text-red-500 mt-1 text-sm"
                        />
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
                      <div className="form-group mb-4">
                        <label className="text-gray-600 mb-2 block">Storage Limit</label>
                        <div className="flex gap-2">
                          <Field name="storage_limit">
                            {({ field, form }) => (
                              <Input
                                {...field}
                                placeholder="Enter Storage Limit"
                                type="number"
                                min="1"
                                className="w-full rounded-md"
                                style={{ width: 'calc(100% - 100px)' }}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Convert to MB if GB is selected
                                  const mbValue = storageUnit === 'GB' ? String(Number(value) * 1024) : value;
                                  form.setFieldValue('storage_limit', mbValue);
                                }}
                                // Show the input value in selected unit
                                value={storageUnit === 'GB' ? 
                                  field.value ? String(Number(field.value) / 1024) : '' 
                                  : field.value
                                }
                              />
                            )}
                          </Field>
                          <Select
                            value={storageUnit}
                            onChange={(value) => {
                              setStorageUnit(value);
                              // Convert existing value when unit changes
                              const currentValue = formikRef.current?.values.storage_limit;
                              if (currentValue) {
                                const newValue = value === 'GB' 
                                  ? String(Number(currentValue) / 1024)
                                  : String(Number(currentValue) * 1024);
                                formikRef.current?.setFieldValue('storage_limit', newValue);
                              }
                            }}
                            style={{ width: '90px' }}
                            className="rounded-md"
                          >
                            <Option value="MB">MB</Option>
                            <Option value="GB">GB</Option>
                          </Select>
                        </div>
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

        .duration-selector .ant-btn {
          border-radius: 6px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .duration-selector .ant-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .duration-selector .ant-btn-primary {
          background-color: #4169E1;
          border-color: #4169E1;
        }

        .duration-selector .ant-btn-primary:hover {
          background-color: #3154b3;
          border-color: #3154b3;
        }

        .duration-selector .ant-input-number,
        .duration-selector .ant-input {
          width: 100%;
          border-radius: 6px;
        }

        .duration-selector .ant-input-number:hover,
        .duration-selector .ant-input:hover {
          border-color: #4169E1;
        }

        .duration-selector .ant-input-number:focus,
        .duration-selector .ant-input:focus {
          border-color: #4169E1;
          box-shadow: 0 0 0 2px rgba(65, 105, 225, 0.2);
        }

        .duration-selector .ant-input-number-handler-wrap {
          border-radius: 0 6px 6px 0;
        }
      `}</style>
    </div>
  );
};

export default EditPlan;
