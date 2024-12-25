import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, Rate, Row, Col, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const EditAppraisal = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming the appraisal ID is passed in the URL

  // Simulating fetching existing appraisal data
  useEffect(() => {
    const fetchAppraisalData = async () => {
      // Simulate fetching data by ID
      const existingData = {
        branch: 'China',
        employee: 'Sonya Sims',
        month: '2022-10',
        remarks: 'It is the process of evaluating individual job performance as a basis for making objective personnel decisions.',
        ratings: [
          {
            category: 'Behavioural Competencies',
            items: [
              { name: 'Business Process', indicatorRating: 4, appraisalRating: 4 },
              { name: 'Oral Communication', indicatorRating: 4, appraisalRating: 3 },
            ],
          },
          {
            category: 'Organizational Competencies',
            items: [
              { name: 'Leadership', indicatorRating: 3, appraisalRating: 3 },
              { name: 'Project Management', indicatorRating: 4, appraisalRating: 4 },
            ],
          },
          {
            category: 'Technical Competencies',
            items: [
              { name: 'Allocating Resources', indicatorRating: 2, appraisalRating: 2 },
            ],
          },
        ],
      };

      // Prefill the form with fetched data
      form.setFieldsValue({
        branch: existingData.branch,
        employee: existingData.employee,
        month: dayjs(existingData.month),
        remarks: existingData.remarks,
      });
    };

    fetchAppraisalData();
  }, [id, form]);

  const onFinish = (values) => {
    console.log('Updated values:', values);
    message.success('Appraisal updated successfully!');
    navigate('/app/hrm/appraisal');
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Form submission failed:', errorInfo);
    message.error('Please fill out all required fields.');
  };

  return (
    <div className="edit-appraisal">
      <Form
        layout="vertical"
        form={form}
        name="edit-appraisal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
              <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="branch"
              label="Branch"
              rules={[{ required: true, message: 'Branch is required' }]}
            >
              <Select disabled>
                <Option value="China">China</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="employee"
              label="Employee"
              rules={[{ required: true, message: 'Employee is required' }]}
            >
              <Select disabled>
                <Option value="Sonya Sims">Sonya Sims</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="month"
              label="Select Month"
              rules={[{ required: true, message: 'Month is required' }]}
            >
              <DatePicker picker="month" style={{ width: '100%' }} disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="remarks" label="Remarks">
              <TextArea rows={4} placeholder="Enter remark" />
            </Form.Item>
          </Col>
        </Row>
<div className='flex'>
        <h3 className="font-semibold text-lg mb-2 ml-[350px]">Indicator</h3>
        <h3 className="font-semibold text-lg mb-2 ml-[250px]">Appraisal</h3>
        </div>
        {[
          {
            category: 'Behavioural Competencies',
            items: [
              { name: 'Business Process', indicatorRating: 4, appraisalRating: 4 },
              { name: 'Oral Communication', indicatorRating: 4, appraisalRating: 3 },
            ],
          },
          {
            category: 'Organizational Competencies',
            items: [
              { name: 'Leadership', indicatorRating: 3, appraisalRating: 3 },
              { name: 'Project Management', indicatorRating: 4, appraisalRating: 4 },
            ],
          },
          {
            category: 'Technical Competencies',
            items: [
              { name: 'Allocating Resources', indicatorRating: 2, appraisalRating: 2 },
            ],
          },
        ].map((section, index) => (
          <div key={index} className="mb-4">
            <h4 className="font-semibold text-base mb-2">{section.category}</h4>
            <hr style={{ marginBottom: '20px', border: '0.5px solid #e8e8e8' }} />
            {section.items.map((item, idx) => (
              <Row key={idx} gutter={16} className="mb-2">
                <Col span={8}>{item.name}</Col>
                <Col span={8}><Rate disabled value={item.indicatorRating} /></Col>
                <Col span={8}><Rate value={item.appraisalRating} /></Col>
              </Row>
            ))}
          </div>
        ))}

        <Form.Item>
          <div className="text-right">
            <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/appraisal')}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditAppraisal;








// import React, { useEffect } from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
// import { useNavigate, useParams } from 'react-router-dom';
// import dayjs from 'dayjs';


// const { Option } = Select;
// const { TextArea } = Input;

// const EditAppraisal = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const { id } = useParams(); // Assuming the appraisal ID is passed in the URL

//   // Simulating fetching existing appraisal data
//   useEffect(() => {
//     const fetchAppraisalData = async () => {
//       // Simulate fetching data by ID
//       const existingData = {
//         branch: 'branch1',
//         employee: 'employee1',
//         month: '2023-10',
//         remarks: 'Existing remark for the appraisal',
//       };

//       // Prefill the form with fetched data
//       form.setFieldsValue({
//         branch: existingData.branch,
//         employee: existingData.employee,
//         month: existingData.month ? dayjs(existingData.month) : null,
//         remarks: existingData.remarks,
//       });
//     };

//     fetchAppraisalData();
//   }, [id, form]);

//   const onFinish = (values) => {
//     console.log('Updated values:', values);
//     message.success('Appraisal updated successfully!');
//     navigate('/app/hrm/appraisal');
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };

//   return (
//     <div className="edit-appraisal">
//       <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

//       <Form
//         layout="vertical"
//         form={form}
//         name="edit-appraisal"
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//       >
//         <Row gutter={16}>
//           {/* Branch Dropdown */}
//           <Col span={12}>
//             <Form.Item
//               name="branch"
//               label="Branch"
//               rules={[{ required: true, message: 'Branch is required' }]}
//             >
//               <Select placeholder="Select Branch">
//                 <Option value="branch1">Branch 1</Option>
//                 <Option value="branch2">Branch 2</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Employee Dropdown */}
//           <Col span={12}>
//             <Form.Item
//               name="employee"
//               label="Employee"
//               rules={[{ required: true, message: 'Employee is required' }]}
//             >
//               <Select placeholder="Select Employee">
//                 <Option value="employee1">Employee 1</Option>
//                 <Option value="employee2">Employee 2</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Select Month */}
//           <Col span={12}>
//             <Form.Item
//               name="month"
//               label="Select Month"
//               rules={[{ required: true, message: 'Month is required' }]}
//             >
//               <DatePicker picker="month" style={{ width: '100%' }} />
//             </Form.Item>
//           </Col>

//           {/* Remarks */}
//           <Col span={24}>
//             <Form.Item name="remarks" label="Remarks">
//               <TextArea rows={4} placeholder="Enter remark" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item>
//           <div className="text-right">
//             <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/appraisal')}>
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Update
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default EditAppraisal;
