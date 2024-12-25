import React from 'react';
import {  Input, Button, DatePicker, Select, TimePicker, message, Row, Col } from 'antd';
import moment from 'moment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddInterview = ({ onAddInterview }) => {
  // const [form] = Form.useForm();

  const onSubmit = (values) => {
    const formattedData = {
      id: Date.now(),
      title: values.title,
      interviewer: values.interviewer,
      date: values.interviewDate.format('YYYY-MM-DD'),
      time: values.interviewTime.format('HH:mm'),
    };

    onAddInterview(formattedData);
    message.success('Interview scheduled successfully!');
  };

  const initialValues = {
    title: '',
    interviewer: '',
    interviewDate: null,
    interviewTime: null,
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Please enter a interview title.'),
    interviewer: Yup.string().required('Please select a interviewer.'),
    interviewDate: Yup.date().nullable().required(' Event Start Date is required.'),
    interviewTime: Yup.date().nullable().required('Interview Time is required.'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
        <Form
          className="formik-form" onSubmit={handleSubmit}
        >
          <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

          <Row gutter={16}>
            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Interview Title"</label>
                <Field name="title" as={Input} placeholder="Event Title" />
                <ErrorMessage name="title" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

           
            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Interviewer</label>
                <Field name="interviewer">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select Interviewer"
                      onChange={(value) => setFieldValue('interviewer', value)}
                      value={values.interviewer}
                      onBlur={() => setFieldTouched("interviewer", true)}
                    >
                      <Option value="Candice">Candice</Option>
                      <Option value="John Doe">John Doe</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="interviewer" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Interview Date</label>
                <DatePicker
                  className="w-full"
                  format="DD-MM-YYYY"
                  value={values.interviewDate}
                  onChange={(interviewDate) => setFieldValue('interviewDate', interviewDate)}
                  onBlur={() => setFieldTouched("interviewDate", true)}
                />
                <ErrorMessage name="interviewDate" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>


            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Interview Time</label>
                <TimePicker
                  className="w-full"
                  format="HH:mm"
                  value={values.interviewTime}
                  onChange={(interviewTime) => setFieldValue('interviewTime', interviewTime)}
                  onBlur={() => setFieldTouched("interviewTime", true)}
                />
                <ErrorMessage name="interviewTime" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

          </Row>
        
            <Button type="primary" htmlType="submit" className='mt-3'>
              Add Interview
            </Button>
          
        </Form>
      )}
    </Formik>
  );
};

export default AddInterview;












// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, TimePicker, message, Row, Col } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import 'react-quill/dist/quill.snow.css';

// const { Option } = Select;

// const AddInterview = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Interview scheduled successfully!');
//     navigate('/app/hrm/interviews');
//   };

//   return (
//     <div className="add-interview-form">
//       <h2 className="mb-4">Create New Interview Schedule</h2>
//       <Form
//         layout="vertical"
//         form={form}
//         name="add-interview"
//         onFinish={onFinish}
//       >
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="interviewTo"
//               label="Interview To"
//               rules={[{ required: true, message: 'Please select who to interview.' }]}
//             >
//               <Select placeholder="Select Interviewee">
//                 <Option value="candidate1">Candidate 1</Option>
//                 <Option value="candidate2">Candidate 2</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="interviewer"
//               label="Interviewer"
//               rules={[{ required: true, message: 'Please select an interviewer.' }]}
//             >
//               <Select placeholder="Select Interviewer">
//                 <Option value="interviewer1">Interviewer 1</Option>
//                 <Option value="interviewer2">Interviewer 2</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="interviewDate"
//               label="Interview Date"
//               rules={[{ required: true, message: 'Please select an interview date.' }]}
//             >
//               <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="interviewTime"
//               label="Interview Time"
//               rules={[{ required: true, message: 'Please select an interview time.' }]}
//             >
//               <TimePicker style={{ width: '100%' }} format="HH:mm" />
//             </Form.Item>
//           </Col>

//           <Col span={24}>
//             <Form.Item name="comment" label="Comment">
//               <Input.TextArea placeholder="Add any comments or details about the interview..." />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item>
//           <div className="form-buttons text-right">
//             <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/interviews')}>Cancel</Button>
//             <Button type="primary" htmlType="submit">Create</Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default AddInterview;
