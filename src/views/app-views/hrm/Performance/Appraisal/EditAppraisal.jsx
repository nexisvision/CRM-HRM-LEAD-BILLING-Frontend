import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, message, Row, Col, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, Formik } from 'formik';
import { PlusOutlined } from "@ant-design/icons";
import { editAppraisal, getAppraisals } from './AppraisalReducers/AppraisalSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getBranch } from '../../Branch/BranchReducer/BranchSlice';
import { empdata } from '../../Employee/EmployeeReducers/EmployeeSlice';

const { Option } = Select;
const { TextArea } = Input;


const EditAppraisal = ({ id , onClose }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const alldept = useSelector((state) => state.appraisal);
  const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
   const employeeData = useSelector((state) => 
        (state.employee?.employee?.data || []).filter((employee) => employee.employeeId)
      );

      const { data: employee } = useSelector((state) => state.employee.employee);
  
  const [singleEmp, setSingleEmp] = useState(null);

  useEffect(() => {
    // Find the specific indicator data by ID
    const empData = alldept?.Appraisals?.data || [];
    const data = empData.find((item) => item.id === id);
    setSingleEmp(data || null);

    // Update form values when singleEmp is set
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

  // Dispatch initial data
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
            // message.success('Appraisal updated successfully!');
            onClose();
            navigate('/app/hrm/performance/appraisal');
          })
          .catch((error) => {
            // message.error('Failed to update appraisal.');
            console.error('Edit API error:', error);
          });
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Form submission failed:', errorInfo);
    message.error('Please fill out all required fields.');
  };


  return (
    <div className="add-appraisal">
      
      <Formik
        // initialValues={{ branch: '', employee: '', businessProcess: '', oralCommunication: '', 
        //   leadership: '', overallRating: '', allocatingResources: '', projectManagement: '' }}
       
      >
        {({ values, setFieldValue }) => (
          <Form 
                  layout="vertical"
                  form={form}
                  name="edit-indicator"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
          >
            <h2 className="mb-3 border-b pb-1 font-medium"></h2>
            <Row gutter={16}>
              {/* Branch Dropdown */}
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
              {/* Employee Dropdown */}
              {/* <Col span={12}>
                          <Form.Item
                          disabled
                            name="employee"
                            label="Employee"
                            rules={[{ required: true, message: 'Please select a employee' }]}
                          >
                            <Select placeholder="Select Employee">
                              {employeeData.map((emp) => (
                                <Option key={emp.id} value={emp.id}>
                                  {emp.username}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col> */}

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

              {/* Select Month */}
              {/* <Col span={12}>
                <Form.Item
                  name="month"
                  label="Select Month"
                  rules={[{ required: true, message: 'Month is required' }]}
                >
                  <DatePicker picker="month" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              {/* Award Dropdown */}
              
              {/* <Col span={24}>
                <Form.Item name="remarks" label="Remarks">
                  <TextArea rows={4} placeholder="Enter remark" />
                </Form.Item>
              </Col> */} 
            </Row>
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
          </Form>
        )}
      </Formik>
    
    
    </div>
  );
};
export default EditAppraisal;







