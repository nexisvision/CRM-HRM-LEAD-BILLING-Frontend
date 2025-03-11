import React, { useEffect, useState } from 'react';
import { Form, Button, Select, message, Row, Col, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
import { addAppraisals, getAppraisals } from './AppraisalReducers/AppraisalSlice';
import { useDispatch, useSelector } from 'react-redux';

import { getBranch } from '../../Branch/BranchReducer/BranchSlice';
import { empdata } from '../../Employee/EmployeeReducers/EmployeeSlice';
const { Option } = Select;

const AddAppraisal = ({ onClose }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.loggedInUser.username);

  const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
  const fndbranchdata = branchData.filter((item) => item.created_by === user);


  const [selectedBranch, setSelectedBranch] = useState(null);

  const { data: employeee } = useSelector((state) => state.employee.employee);

  const filteredEmployees = employeee.filter((emp) => emp.branch === selectedBranch);

  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);


  const handleSubmit = (values) => {
    dispatch(addAppraisals(values)) // Fixed naming
      .then(() => {
        dispatch(getAppraisals());
        onClose(); // Optional if provided
        navigate('/app/hrm/performance/appraisal');
      })
      .catch((error) => {
        console.error('Add API error:', error);
      });
  };

  const initialValues = {
    branch: "",
    employee: "",
    businessProcess: "",
    oralCommunication: "",
    leadership: "",
    overallRating: "",
    allocatingResources: "",
    projectManagement: "",

  };

  const onFinishFailed = (errorInfo) => {
    console.error('Form submission failed:', errorInfo);
    message.error('Please fill out all required fields.');
  };

  return (
    <div className="add-appraisal">
      <Form
        layout="vertical"
        form={form}
        name="add-appriasal"
        initialValues={initialValues}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
      >
        <div className="mb-3 border-b pb-1 font-medium"></div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="branch"
              label="Branch"
              rules={[{ required: true, message: 'Please select a branch' }]}
            >
              <Select
                placeholder="Select Branch"
                onChange={(value) => {
                  setSelectedBranch(value);
                  form.setFieldsValue({ employee: "" }); // Reset department & designation
                }}
              >
                {fndbranchdata.map((branch) => (
                  <Option key={branch.id} value={branch.id}>
                    {branch.branchName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>



          <Col span={12}>
            <Form.Item
              name="employee"
              label="Employee"
              rules={[{ required: true, message: 'Please select a employee' }]}
            >
              <Select placeholder="Select Employee" disabled={!selectedBranch}>
                {filteredEmployees.map((emp) => (
                  <Option key={emp.id} value={emp.id}>
                    {emp.username}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

        </Row>

        <h1 className="text-lg font-semibold mb-3">Behavioral Competencies</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="businessProcess"
              label="Business Process"
              rules={[{ required: true, message: 'Please provide a rating for Business Process' }]}
            >
              <Rate />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="oralCommunication"
              label="Oral Communication"
              rules={[{ required: true, message: 'Please provide a rating for Oral Communication' }]}
            >
              <Rate />
            </Form.Item>
          </Col>
        </Row>

        <h1 className="text-lg font-semibold mb-3">Organizational Competencies</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="leadership"
              label="Leadership"
              rules={[{ required: true, message: 'Please provide a rating for Leadership' }]}
            >
              <Rate />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="projectManagement"
              label="Project Management"
              rules={[{ required: true, message: 'Please provide a rating for Project Management' }]}
            >
              <Rate />
            </Form.Item>
          </Col>
        </Row>

        <h1 className="text-lg font-semibold mb-3">Technical Competencies</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="allocatingResources"
              label="Allocating Resources"
              rules={[{ required: true, message: 'Please provide a rating for Allocating Resources' }]}
            >
              <Rate />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="overallRating"
              label="overall Rating"
              rules={[{ required: true, message: 'Please provide a rating for overall Rating' }]}
            >
              <Rate />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <div className="text-right">
            <Button
              type="default"
              onClick={() => navigate('/app/hrm/appraisal')}
              style={{ marginRight: '10px' }}
            >
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

export default AddAppraisal;






