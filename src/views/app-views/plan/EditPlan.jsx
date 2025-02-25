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
  const [isTrialEnabled, setIsTrialEnabled] = useState(planData?.trial || false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [durationType, setDurationType] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;
  
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
    // trialDays: Yup.string().when('trial', {
    //   is: true,
    //   then: (schema) => schema.required('Please enter the number of trial days!'),
    //   otherwise: (schema) => schema.notRequired(),
    // })
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
    // trialDays: '',
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

              <Col span={24} >
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>currency <span style={{ color: 'red' }}>*</span></label>
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


            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ marginRight: '8px' }} onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
             Save Changes
              </Button>
            </div>
          </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default EditPlan;
