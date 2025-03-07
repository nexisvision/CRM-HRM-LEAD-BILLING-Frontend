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
  const [form] = Form.useForm(); // Ensure this is called at the top
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser.username);

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
        onClose(); // Optional if provided
        navigate('/app/hrm/performance/indicator');
      })
      .catch((error) => {
        // message.error('Failed to add indicator.');
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
        
        <h2 className="mb-3 border-b pb-1 font-medium"></h2>
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












// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// const AddIndicator = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Indicator added successfully!');
//     navigate('app/hrm/indicator')
//     // Navigate or perform additional actions here
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };

  

//   return (
//     <div className="add-employee">
//       {/* <h2 className="mb-4">Add New Indicator</h2> */}
//       

//       <Form
//         layout="vertical"
//         form={form}
//         name="add-employee"
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//       >
//         {/* User Information */}
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="firstName"
//               label="First Name"
//               rules={[{ required: true, message: 'First Name is required' }]}
//             >
//               <Input placeholder="John" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="lastName"
//               label="Last Name"
//               rules={[{ required: true, message: 'Last Name is required' }]}
//             >
//               <Input placeholder="Doe" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="username"
//               label="User Name"
//               rules={[{ required: true, message: 'User Name is required' }]}
//             >
//               <Input placeholder="john_doe" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="password"
//               label="Password"
//               rules={[{ required: true, message: 'Password is required' }]}
//             >
//               <Input.Password placeholder="Strong Password" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="email"
//               label="Email"
//               rules={[
//                 { required: true, message: 'Email is required' },
//                 { type: 'email', message: 'Please enter a valid email' },
//               ]}
//             >
//               <Input placeholder="johndoe@example.com" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="phone"
//               label="Phone"
//               rules={[{ required: true, message: 'Phone is required' }]}
//             >
//               <Input placeholder="01500000000" />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* Address Information */}
//         {/* <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="street"
//               label="Street"
//               rules={[{ required: true, message: 'Street is required' }]}
//             >
//               <Input placeholder="123 Main Street" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="city"
//               label="City"
//               rules={[{ required: true, message: 'City is required' }]}
//             >
//               <Input placeholder="Los Angeles" />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item
//               name="state"
//               label="State"
//               rules={[{ required: true, message: 'State is required' }]}
//             >
//               <Input placeholder="CA" />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item
//               name="zipCode"
//               label="Zip Code"
//               rules={[{ required: true, message: 'Zip Code is required' }]}
//             >
//               <Input placeholder="90211" />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item
//               name="country"
//               label="Country"
//               rules={[{ required: true, message: 'Country is required' }]}
//             >
//               <Input placeholder="USA" />
//             </Form.Item>
//           </Col>
//         </Row> */}

//         {/* Employee Information */}
//         {/* <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="joiningDate"
//               label="Joining Date"
//               rules={[{ required: true, message: 'Joining Date is required' }]}
//             >
//               <DatePicker style={{ width: '100%' }} />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item name="leaveDate" label="Leave Date">
//               <DatePicker style={{ width: '100%' }} />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="employeeId"
//               label="Employee ID"
//               rules={[{ required: true, message: 'Employee ID is required' }]}
//             >
//               <Input placeholder="OE-012" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="bloodGroup"
//               label="Blood Group"
//               rules={[{ required: true, message: 'Blood Group is required' }]}
//             >
//               <Select placeholder="Select Blood Group">
//                 <Option value="A+">A+</Option>
//                 <Option value="A-">A-</Option>
//                 <Option value="B+">B+</Option>
//                 <Option value="B-">B-</Option>
//                 <Option value="O+">O+</Option>
//                 <Option value="O-">O-</Option>
//                 <Option value="AB+">AB+</Option>
//                 <Option value="AB-">AB-</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row> */}

//         {/* Designation & Salary Information */}
//         {/* <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="designation"
//               label="Designation"
//               rules={[{ required: true, message: 'Designation is required' }]}
//             >
//               <Select placeholder="Select Designation">
//                 <Option value="Manager">Manager</Option>
//                 <Option value="Developer">Developer</Option>
//                 <Option value="Designer">Designer</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="salary"
//               label="Salary"
//               rules={[{ required: true, message: 'Salary is required' }]}
//             >
//               <Input placeholder="$" type="number" />
//             </Form.Item>
//           </Col>
//         </Row> */}

//         <Form.Item>
//           <div className="text-right">
//             <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/employee')}>
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default AddIndicator;
