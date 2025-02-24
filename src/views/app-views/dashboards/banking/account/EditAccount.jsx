import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { editAccount, getAccounts } from './AccountReducer/AccountSlice';

const { Option } = Select;

const EditAccount = ({ onClose, idd }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  const allAccounts = useSelector((state) => state.account);
  const accounts = allAccounts.account.data;

  useEffect(() => {
    if (accounts && idd) {
      const accountData = accounts.find((account) => account.id === idd);
      if (accountData) {
        setInitialValues(accountData);
        form.setFieldsValue({
          bankHolderName: accountData.bankHolderName,
          bankName: accountData.bankName,
          accountNumber: accountData.accountNumber,
          openingBalance: accountData.openingBalance,
          contactNumber: accountData.contactNumber,
          bankAddress: accountData.bankAddress,
        });
      }
    }
  }, [idd, accounts, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await dispatch(editAccount({ id: idd, payload: values })).unwrap();
      message.success('Account updated successfully!');
      dispatch(getAccounts()); // Refresh the accounts list
      onClose();
    } catch (error) {
      message.error('Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-account-form">
      <Form
        form={form}
        name="editAccount"
        onFinish={onFinish}
        layout="vertical"
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="bankHolderName"
              label="Bank Holder Name"
              rules={[
                {
                  required: true,
                  message: 'Please enter bank holder name',
                },
              ]}
            >
              <Input placeholder="Enter bank holder name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="bankName"
              label="Bank Name"
              rules={[
                {
                  required: true,
                  message: 'Please select bank name',
                },
              ]}
            >
              <Select placeholder="Select bank">
                <Option value="sbi">State Bank of India</Option>
                <Option value="hdfc">HDFC Bank</Option>
                <Option value="icici">ICICI Bank</Option>
                <Option value="axis">Axis Bank</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="accountNumber"
              label="Account Number"
              rules={[
                {
                  required: true,
                  message: 'Please enter account number',
                },
              ]}
            >
              <Input placeholder="Enter account number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="openingBalance"
              label="Opening Balance"
              rules={[
                {
                  required: true,
                  message: 'Please enter opening balance',
                },
              ]}
            >
              <Input type="number" placeholder="Enter opening balance" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="contactNumber"
              label="Contact Number"
              rules={[
                {
                  required: true,
                  message: 'Please enter contact number',
                },
              ]}
            >
              <Input placeholder="Enter contact number" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="bankAddress"
              label="Bank Address"
              rules={[
                {
                  required: true,
                  message: 'Please enter bank address',
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="Enter bank address" />
            </Form.Item>
          </Col>
        </Row>

        <div className="text-right">
          <Button type="default" onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Account
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditAccount;