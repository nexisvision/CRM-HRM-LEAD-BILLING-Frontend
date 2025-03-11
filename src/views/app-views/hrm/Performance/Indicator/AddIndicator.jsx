import React, { useEffect, useState } from 'react';
import { Form, Button, Select, Rate, Row, Col, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBranch } from '../../Branch/BranchReducer/BranchSlice';
import { getDept } from '../../Department/DepartmentReducers/DepartmentSlice';
import { getDes } from '../../Designation/DesignationReducers/DesignationSlice';
import { getIndicators, addIndicator } from './IndicatorReducers/indicatorSlice';
import AddBranch from '../../Branch/AddBranch';

const { Option } = Select;


const AddIndicator = ({ onClose }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fndbranchdata = useSelector((state) => state.Branch?.Branch?.data || []);

  const fnddepartmentdata = useSelector((state) => state.Department?.Department?.data || []);


  const fnddesignationdata = useSelector((state) => state.Designation?.Designation?.data || []);


  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);
  const filteredDepartments = fnddepartmentdata.filter((dept) => dept.branch === selectedBranch);
  const filteredDesignations = fnddesignationdata.filter((des) => des.branch === selectedBranch);


  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDept());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDes());
  }, [dispatch]);

  const handleSubmit = (values) => {
    dispatch(addIndicator(values)) // Fixed naming
      .then(() => {
        dispatch(getIndicators());
        // message.success('Indicator added successfully!');
        onClose();
        navigate('/app/hrm/performance/indicator');
      })
      .catch((error) => {
        console.error('Add API error:', error);
      });
  };

  const initialValues = {
    branch: "",
    department: "",
    designation: "",
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

  const openAddBranchModal = () => {
    setIsAddBranchModalVisible(true);
  };

  const closeAddBranchModal = () => {
    setIsAddBranchModalVisible(false);
  };

  return (
    <div className="add-indicator">
      <Form
        layout="vertical"
        form={form}
        name="add-indicator"
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
                  form.setFieldsValue({ department: "", designation: "" });
                }}
                dropdownRender={menu => (
                  <>
                    {menu}
                    <Button
                      type="link"
                      block
                      onClick={openAddBranchModal}
                    >
                      + Add New Branch
                    </Button>
                  </>
                )}
              >
                {fndbranchdata.map((branch) => (
                  <Option key={branch.id} value={branch.id}>
                    {branch.branchName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Department Selection */}
          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please select a department' }]}
            >
              <Select placeholder="Select Department" disabled={!selectedBranch}>
                {filteredDepartments.map((dept) => (
                  <Option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Designation Selection */}
          <Col span={12}>
            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true, message: 'Please select a designation' }]}
            >
              <Select placeholder="Select Designation" disabled={!selectedBranch}>
                {filteredDesignations.map((des) => (
                  <Option key={des.id} value={des.id}>
                    {des.designation_name}
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
              onClick={() => navigate('/app/hrm/indicator')}
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

      <Modal
        title="Add Branch"
        visible={isAddBranchModalVisible}
        onCancel={closeAddBranchModal}
        footer={null}
        width={800}
      >
        <AddBranch onClose={closeAddBranchModal} />
      </Modal>
    </div>
  );
};

export default AddIndicator;

