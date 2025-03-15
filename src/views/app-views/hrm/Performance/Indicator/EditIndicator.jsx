import React, { useEffect, useState } from 'react';
import { Form, Button, Select, Rate, Row, Col, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getBranch } from '../../Branch/BranchReducer/BranchSlice';
import { getDept } from '../../Department/DepartmentReducers/DepartmentSlice';
import { getDes } from '../../Designation/DesignationReducers/DesignationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { editIndicator, getIndicators } from './IndicatorReducers/indicatorSlice';
import AddBranch from '../../Branch/AddBranch';

const { Option } = Select;

const EditIndicator = ({ id, onClose }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alldept = useSelector((state) => state.indicator);
  const fndbranchdata = useSelector((state) => state.Branch?.Branch?.data || []);
  const fnddepartmentdata = useSelector((state) => state.Department?.Department?.data || []);
  const fnddesignationdata = useSelector((state) => state.Designation?.Designation?.data || []);
  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);

  useEffect(() => {
    const empData = alldept?.Indicators?.data || [];
    const data = empData.find((item) => item.id === id);

    if (data) {
      form.setFieldsValue({
        branch: data.branch,
        department: data.department,
        designation: data.designation,
        businessProcess: data.businessProcess,
        oralCommunication: data.oralCommunication,
        leadership: data.leadership,
        overallRating: data.overallRating,
        allocatingResources: data.allocatingResources,
        projectManagement: data.projectManagement,
      });
    }
  }, [id, alldept, form]);

  useEffect(() => {
    dispatch(getBranch());
    dispatch(getDept());
    dispatch(getDes());
  }, [dispatch]);

  const onFinish = (values) => {
    if (!id) {
      message.error('Indicator ID is missing.');
      return;
    }
    dispatch(editIndicator({ id, values }))
      .then(() => {
        dispatch(getIndicators());
        onClose();
        navigate('/app/hrm/performance/indicator');
      })
      .catch((error) => {
        console.error('Edit API error:', error);
      });
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
    <div className="edit-indicator">
      <Form
        layout="vertical"
        form={form}
        name="edit-indicator"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
      <div className="mb-2 border-b pb-[-10px] font-medium"></div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="branch"
              label="Branch"
              rules={[{ required: true, message: 'Please select a branch' }]}
            >
              <Select
                placeholder="Select Branch"
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

          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please select a department' }]}
            >
              <Select placeholder="Select Department">
                {fnddepartmentdata.map((dept) => (
                  <Option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true, message: 'Please select a designation' }]}
            >
              <Select placeholder="Select Designation">
                {fnddesignationdata.map((des) => (
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
              label="Overall Rating"
              rules={[{ required: true, message: 'Please provide a rating for Overall Rating' }]}
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
              Save Changes
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

export default EditIndicator;
