import React, { useEffect } from 'react';
import { Form, Button, Select, message, Row, Col, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { editAppraisal, getAppraisals } from './AppraisalReducers/AppraisalSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getBranch } from '../../Branch/BranchReducer/BranchSlice';
import { empdata } from '../../Employee/EmployeeReducers/EmployeeSlice';

const { Option } = Select;



const EditAppraisal = ({ id, onClose }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const alldept = useSelector((state) => state.appraisal);
  const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
  const { data: employee } = useSelector((state) => state.employee.employee);


  useEffect(() => {
    const empData = alldept?.Appraisals?.data || [];
    const data = empData.find((item) => item.id === id);
    if (data) {
      form.setFieldsValue({
        branch: data.branch,
        employee: data.employee,
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
    dispatch(empdata());
  }, [dispatch]);

  const onFinish = (values) => {
    if (!id) {
      message.error('Appraisal ID is missing.');
      return;
    }
    dispatch(editAppraisal({ id, values }))
      .then(() => {
        dispatch(getAppraisals());
        onClose();
        navigate('/app/hrm/performance/appraisal');
      })
      .catch((error) => {
        console.error('Edit API error:', error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Form submission failed:', errorInfo);
    message.error('Please fill out all required fields.');
  };


  return (
    <div className="add-appraisal">

      <Formik>
        {({ values, setFieldValue }) => (
          <Form
            layout="vertical"
            form={form}
            name="edit-indicator"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className="mb-3 border-b pb-1 font-medium"></div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="branch"
                  label="Branch"
                  rules={[{ required: true, message: 'Please select a branch' }]}
                  disabled
                >
                  <Select placeholder="Select Branch">
                    {branchData.map((branch) => (
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
                  <Select
                    className="w-full"
                    placeholder="Select Employee"
                    onChange={(value) => {
                      const selectedEmployee =
                        Array.isArray(employee) &&
                        employee.find((e) => e.id === value);
                      form.setFieldValue(
                        "employee",
                        selectedEmployee?.username || ""
                      );
                    }}
                  >
                    {Array.isArray(employee) &&
                      employee.map((emp) => (
                        <Option key={emp.id} value={emp.id}>
                          {emp.username}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>

            </Row >
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
              <div className="text-right mt-3">
                <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/appraisal')}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </div>
            </Form.Item>
          </Form >
        )}
      </Formik >


    </div >
  );
};
export default EditAppraisal;







