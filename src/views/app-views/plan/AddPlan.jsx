import React, { useEffect, useState } from 'react';
import { Input, Button, Switch, Row, Col, Menu, Dropdown, Select, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CreatePlan, GetPlan } from './PlanReducers/PlanSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { getcurren } from '../setting/currencies/currenciesSlice/currenciesSlice';
import { PlusOutlined } from '@ant-design/icons';
import AddCurrencies from '../setting/currencies/AddCurrencies';
const { Option } = Select;

// Add this component for duration selection
const DurationSelector = ({ value, onChange }) => {
  const [selectedType, setSelectedType] = useState('Lifetime');
  const [customValue, setCustomValue] = useState('');

  useEffect(() => {
    // Set initial value
    onChange('Lifetime');
  }, []);

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

const AddPlan = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [durationType, setDurationType] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);
  const [storageUnit, setStorageUnit] = useState('MB');
  const formikRef = React.useRef();

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

  // Updated initial values to match backend schema
  const initialValues = {
    name: '',
    currency: getInitialCurrency(),
    price: '',
    duration: '',
    trial_period: '',
    max_users: '',
    max_clients: '',
    max_customers: '',
    max_vendors: '',
    storage_limit: '',
    features: {},
    is_default: false,
    status: 'active',
    trial: false // for UI toggle
  };

  const handleSubmit = (values, { resetForm }) => {
    const payload = {
      ...values,
      max_users: String(values.max_users || ''),
      max_customers: String(values.max_customers || ''),
      max_vendors: String(values.max_vendors || ''),
      max_clients: String(values.max_clients || ''),
      storage_limit: String(values.storage_limit || ''),
      price: String(values.price || ''),
      trial_period: values.trial ? (values.trial_period || null) : null,
      features: values.features || {},
      is_default: values.is_default || false,
      status: values.status || 'active'
    };

    dispatch(CreatePlan(payload))
      .then(() => {
        dispatch(GetPlan());
        onClose();
        resetForm();
        navigate('/app/superadmin/plan');
      })
      .catch((error) => {
        console.error('Add API error:', error);
      });
  };

  return (
    <div>
      <div className="mb-3 border-b pb-1 font-medium"></div>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        innerRef={formikRef}
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
                        <label className="text-gray-600 mb-2 block">Make Default Plan</label>
                        <Switch
                          checked={values.is_default}
                          onChange={(checked) => setFieldValue('is_default', checked)}
                          className="mr-2"
                        />
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
                        <label className="text-gray-600 mb-2 block">
                          Duration <span className="text-red-500">*</span>
                        </label>
                        <Field name="duration">
                          {({ field, form }) => (
                            <DurationSelector
                              value={field.value}
                              onChange={(value) => form.setFieldValue('duration', value)}
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
                                  const mbValue = storageUnit === 'GB' ? String(Number(value) * 1024) : value;
                                  form.setFieldValue('storage_limit', mbValue);
                                }}
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
                  <Button type="primary" htmlType="submit">
                    Create Plan
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>

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
export default AddPlan;
