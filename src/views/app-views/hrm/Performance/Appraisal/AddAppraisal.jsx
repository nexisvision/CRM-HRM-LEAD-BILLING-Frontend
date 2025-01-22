import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, message, Row, Col, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, Formik } from 'formik';
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const AddAppraisal = () => {
  const [awards, setAwards] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAwardName, setNewAwardName] = useState('');
  const navigate = useNavigate();

  const handleAddAward = () => {
    if (newAwardName) {
      setAwards([...awards, { id: awards.length + 1, name: newAwardName }]);
      setNewAwardName('');
      setIsModalVisible(false);
      message.success(`Award "${newAwardName}" added successfully!`);
    } else {
      message.error('Please enter an award name.');
    }
  };

  // onSubmit function for Formik
  const onSubmit = (values, { resetForm }) => {
    console.log(values);
    message.success("Appraisal submitted successfully!");
    resetForm();
    setIsModalVisible(false);
  };

  return (
    <div className="add-appraisal">
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Formik
        initialValues={{ branch: '', employee: '', month: '', award: '', remarks: '' }}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form layout="vertical">
            <Row gutter={16}>
              {/* Branch Dropdown */}
              <Col span={12}>
                <Form.Item
                  name="branch"
                  label="Branch"
                  rules={[{ required: true, message: 'Branch is required' }]} >
                  <Select placeholder="Select Branch">
                    <Option value="branch1">Branch 1</Option>
                    <Option value="branch2">Branch 2</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Employee Dropdown */}
              <Col span={12}>
                <Form.Item
                  name="employee"
                  label="Employee"
                  rules={[{ required: true, message: 'Employee is required' }]} >
                  <Select placeholder="Select Employee">
                    <Option value="employee1">Employee 1</Option>
                    <Option value="employee2">Employee 2</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Select Month */}
              <Col span={12}>
                <Form.Item
                  name="month"
                  label="Select Month"
                  rules={[{ required: true, message: 'Month is required' }]} >
                  <DatePicker picker="month" style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              {/* Award Dropdown */}
              <Col span={12}>
                <Form.Item
                  name="award"
                  label="Award"
                  rules={[{ required: true, message: 'Award is required' }]} >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select or add new Award"
                    value={values.award}
                    onChange={(value) => {
                      if (value === 'add_new') {
                        setIsModalVisible(true);
                      } else {
                        setFieldValue("award", value);
                      }
                    }}>
                    {awards.map((award) => (
                      <Option key={award.id} value={award.name}>
                        {award.name}
                      </Option>
                    ))}
                    <Option value="add_new">
                      <Button type="link" icon={<PlusOutlined />}>
                        Add New Award
                      </Button>
                    </Option>
                  </Select>
                  <ErrorMessage
                    name="award"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="remarks" label="Remarks">
                  <TextArea rows={4} placeholder="Enter remark" />
                </Form.Item>
              </Col>
            </Row>

            {/* Behavioral Competencies */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-xl">
                <h1 className="text-lg font-medium">Behavioral Competencies</h1>
              </div>
              <hr className="mb-4 border border-gray-300" />
              <Row gutter={16}>
                <Col span={12}>
                  <label className="block mb-1">Business Process</label>
                  <label className="block mt-4">Oral Communication</label>
                </Col>
                <Col span={12}>
                  <div className="grid grid-cols-2 gap-3">
                    <Rate />
                    <Rate />
                    <Rate />
                    <Rate />
                  </div>
                </Col>
              </Row>
            </div>

            {/* Organizational Competencies */}
            <div className="flex flex-col gap-4">
              <h1 className="text-lg font-semibold mb-3 mt-6">Organizational Competencies</h1>
              <hr className="mb-4 border border-gray-300" />
              <Row gutter={16}>
                <Col span={12}>
                  <label className="block mb-1">Leadership</label>
                  <label className="block mt-4">Project Management</label>
                </Col>
                <Col span={12}>
                  <div className="grid grid-cols-2 gap-3">
                    <Rate />
                    <Rate />
                    <Rate />
                    <Rate />
                  </div>
                </Col>
              </Row>
            </div>

            {/* Technical Competencies */}
            <div className="flex flex-col gap-4">
              <h1 className="text-lg font-semibold mb-3 mt-6">Technical Competencies</h1>
              <hr className="mb-4 border border-gray-300" />
              <Row gutter={16}>
                <Col span={12}>
                  <label className="block mb-1">Allocating Resources</label>
                </Col>
                <Col span={12}>
                  <div className="grid grid-cols-2 gap-3">
                    <Rate />
                    <Rate />
                  </div>
                </Col>
              </Row>
            </div>

            <Form.Item>
              <div className="text-right mt-3">
                <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/appraisal')}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Formik>

      {/* Modal for Adding New Award */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Award</h2>
            <Input
              placeholder="Enter new award name"
              value={newAwardName}
              onChange={(e) => setNewAwardName(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end">
              <Button type="default" onClick={() => setIsModalVisible(false)} className="mr-2">
                Cancel
              </Button>
              <Button type="primary" onClick={handleAddAward}>
                Add Award
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAppraisal;
