import React, { useState } from 'react';
import { Form, Input, Button, Select, Switch, Row, Col, message, Menu, Dropdown } from 'antd';
import { useDispatch } from 'react-redux';
import { CreatePlan, GetPlan } from './PlanReducers/PlanSlice';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddPlan = ({ onClose }) => {
  const [form] = Form.useForm();
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
    console.log('Selected:', e.key);
  };


  // Nested menus for Yearly and Monthly options
  // Update handlers
const handleMonthlySelect = ({ key }) => {
  setDurationType('Monthly');
  setSelectedMonth(key);
  form.setFieldsValue({ 
    durationType: 'Monthly',
    monthCount: key 
  });
};

const handleYearlyInputChange = ({ key }) => {
  setDurationType('Yearly');
  setSelectedYear(key);
  form.setFieldsValue({ 
    durationType: 'Yearly',
    monthCount: key 
  });
  // setYearlyValue(e.target.value);
  // form.setFieldsValue({ 
  //   durationType: 'Yearly',
  //   yearCount: e.target.value 
  // });
};

// Update the menus
const yearlyMenu = (
  <Menu onClick={handleYearlyInputChange}>
    <Menu.Item className='w-full'>
      <Input 
        placeholder="Enter years"
        type="number"
        // min={1}
        // max={10}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedYear(value);
          form.setFieldsValue({ 
            durationType: 'Yearly',
            yearCount: value 
          });
        }}
        // onClick={(e) => e.stopPropagation()}
      />
    </Menu.Item>
  </Menu>
);

const monthlyMenu = (
  <Menu onClick={handleMonthlySelect} >
    {Array.from({ length: 12 }, (_, i) => (
      <Menu.Item key={i + 1}>{`${i + 1} Month${i + 1 > 1 ? 's' : ''}`}</Menu.Item>
    ))}
  </Menu>
);

  // Main menu
  const mainMenu = (
    <Menu>
      <Menu.Item key="Lifetime">Lifetime</Menu.Item>
      <Menu.SubMenu key="Yearly" title="Yearly">
        {yearlyMenu}
      </Menu.SubMenu>
      <Menu.SubMenu key="Monthly" title="Monthly">
        {monthlyMenu}
      </Menu.SubMenu>
    </Menu>
  );

  const handleSubmit = (values) => {
    // Include the featureStates as part of the payload
    const payload = { ...values, features: featureStates };

    dispatch(CreatePlan(payload))
      .then(() => {
        dispatch(GetPlan()); // Refresh leave data
        onClose();
        setIsTrialEnabled(false);
        message.success('Plan added successfully!');
        form.resetFields(); // Reset form fields
        navigate('/app/superadmin/plan'); // Redirect to leave page
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

  const cancel = () => {
    form.resetFields();
    onClose();
    setIsTrialEnabled(false);
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ duration: 'Lifetime', trial: false }}
        onValuesChange={(changedValues) => {
          if ('trial' in changedValues) {
            handleTrialToggle(changedValues.trial);
          }
        }}
      >
        <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter the plan name!' }]}
            >
              <Input placeholder="Enter Plan Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter the plan price!' }]}
            >
              <Input placeholder="Enter Plan Price" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="duration"
              label="Duration"
              rules={[{ required: true, message: 'Please select a duration!' }]}
            >
              <Dropdown overlay={mainMenu} trigger={['click']} className='w-full'>
                <Button>
                  {durationType === 'Monthly' && selectedMonth
                    ? `${selectedMonth} Month${selectedMonth > 1 ? 's' : ''}`
                    : durationType === 'Yearly' && selectedYear
                      ? `${selectedYear} Year${selectedYear > 1 ? 's' : ''}`
                      : 'Select Duration'}
                </Button>
              </Dropdown>
            </Form.Item>
          </Col>
          

          {/* <Col span={12}>
            <Form.Item
              name="duration"
              label="Duration"
              rules={[{ required: true, message: 'Please select a duration!' }]}
            >
              <Select>
                <Option value="Lifetime">Lifetime</Option>
                <Option value="Yearly">Yearly</Option>
                <Option value="Monthly">Monthly</Option>
              </Select>
            </Form.Item>
          </Col> */}

          <Col span={12}>
            <Form.Item
              name="max_users"
              label="Maximum Users"
              rules={[{ required: true, message: 'Please enter the maximum users!' }]}
            >
              <Input placeholder="Enter Maximum Users" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="max_customers"
              label="Maximum Customers"
              rules={[{ required: true, message: 'Please enter the maximum customers!' }]}
            >
              <Input placeholder="Enter Maximum Customers" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="max_vendors"
              label="Maximum Vendors"
              rules={[{ required: true, message: 'Please enter the maximum vendors!' }]}
            >
              <Input placeholder="Enter Maximum Vendors" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="max_clients"
              label="Maximum Clients"
              rules={[{ required: true, message: 'Please enter the maximum clients!' }]}
            >
              <Input placeholder="Enter Maximum Clients" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="storage_limit"
              label="Storage Limit (MB)"
              rules={[{ required: true, message: 'Please enter the storage limit!' }]}
            >
              <Input placeholder="Maximum Storage Limit" suffix="MB" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description!' }]}
        >
          <Input.TextArea placeholder="Enter Description" rows={4} />
        </Form.Item>

        <Form.Item name="trial" label="Trial is enabled (on/off)" valuePropName="checked">
          <Switch />
        </Form.Item>

        {isTrialEnabled && (
          <Form.Item
            name="trial_period"
            label="Trial Days"
            rules={[{ required: false }]}
          >
            <Input placeholder="Enter Number of Trial Days" />
          </Form.Item>
        )}

        {/* <Form.Item label="Features"> */}
        {/* <Row gutter={16}>
            {Object.keys(featureStates).map((feature) => (
              <Col span={4} key={feature}>
                <Switch
                  checked={featureStates[feature]}
                  onChange={(checked) => handleFeatureToggle(feature, checked)}
                />
                {feature}
              </Col>
            ))}
          </Row> */}
        {/* </Form.Item> */}

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button style={{ marginRight: '8px' }} onClick={() => cancel()}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPlan;
