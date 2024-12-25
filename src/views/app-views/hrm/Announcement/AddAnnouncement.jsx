import React from 'react';
import { Formik, Form as FormikForm, Field } from 'formik';
import { Input, Button, message, Row, Col } from 'antd';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  Title: Yup.string().required('Title is required'),
  Description: Yup.string().required('Description is required'),
});

const AddAnnouncement = () => {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    console.log('Submitted values:', values);
    message.success('Announcement added successfully!');
    // Add logic to save data
    navigate('/app/hrm/attendance');
  };

  return (
    <div className="add-attendance-form">
      {/* <h2 className="mb-4 text-center">Add Announcement</h2> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Formik
        initialValues={{
          Title: '',
          Description: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleSubmit }) => (
          <FormikForm onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                {/* Title Field */}
                <div style={{ marginBottom: '16px' }}>
                  <label>Title*</label>
                  <Field
                    as={Input}
                    name="Title"
                    placeholder="Enter Title"
                  />
                  {errors.Title && touched.Title && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.Title}</div>
                  )}
                </div>
              </Col>

              <Col span={12}>
                {/* Description Field */}
                <div style={{ marginBottom: '16px' }}>
                  <label>Description*</label>
                  <Field
                    as={Input}
                    name="Description"
                    placeholder="Enter Description"
                  />
                  {errors.Description && touched.Description && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.Description}</div>
                  )}
                </div>
              </Col>
            </Row>

            <div className="text-right">
              <Button
                type="default"
                className="mr-2"
                onClick={() => navigate('/app/hrm/desigantion')}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default AddAnnouncement;













// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, TimePicker, message, Row, Col } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// const AddAnnouncement = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Announcement added successfully!');
//     // Add logic to save data
//     navigate('/app/hrm/attendance');
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };

//   return (
//     <div className="add-attendance-form">
//       <h2 className="mb-4 text-center">Add Announcement</h2>
//       {/* <p className="text-center text-danger">* Please fill Date and Time</p> */}
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
//               name="Title"
//               label="title"
//               rules={[{ required: true, message: 'Title is required' }]}
//             >
//               <Input placeholder="" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="Description"
//               label="description"
//               rules={[{ required: true, message: 'Description is required' }]}
//             >
//               <Input placeholder="Description" />
//             </Form.Item>
//           </Col>
//         </Row>


//         <Form.Item>
//           <div className="text-right">
//             <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/desigantion')}>
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

// export default AddAnnouncement;
