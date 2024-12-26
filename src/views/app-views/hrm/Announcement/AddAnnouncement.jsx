import React from 'react';
import { Formik, Form as FormikForm, Field } from 'formik';
import { Input, Button, message, Row, Col } from 'antd';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { addAnnounce, GetAnn } from './AnnouncementReducer/AnnouncementSlice';
import { useDispatch } from 'react-redux';

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  title: Yup.string().required('title is required'),
  description: Yup.string().required('description is required'),
});

const AddAnnouncement = ({onClose}) => {
  const navigate = useNavigate();
  
  const dispatch = useDispatch();

  const handleSubmit = (values,{resetForm}) => {
    // dispatch(addAnnounce(values));
    // console.log('Submitted values:', values);
    // message.success('Announcement added successfully!');
    // navigate('/app/hrm/announcement');

    dispatch(addAnnounce(values))
          .then(() => {
            dispatch(GetAnn());
            message.success('Announcement added successfully!');
            resetForm();
            onClose();
            navigate('/app/hrm/announcement');
          })
          .catch((error) => {
            message.error('Failed to add Announcement.');
            console.error('Add API error:', error);
          });
  };

  return (
    <div className="add-attendance-form">
      {/* <h2 className="mb-4 text-center">Add Announcement</h2> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Formik
        initialValues={{
          title: '',
          description: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleSubmit ,resetForm}) => (
          <FormikForm onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                {/* title Field */}
                <div style={{ marginBottom: '16px' }}>
                  <label>title*</label>
                  <Field
                    as={Input}
                    name="title"
                    placeholder="Enter title"
                  />
                  {errors.title && touched.title && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.title}</div>
                  )}
                </div>
              </Col>

              <Col span={12}>
                {/* description Field */}
                <div style={{ marginBottom: '16px' }}>
                  <label>description*</label>
                  <Field
                    as={Input}
                    name="description"
                    placeholder="Enter description"
                  />
                  {errors.description && touched.description && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.description}</div>
                  )}
                </div>
              </Col>
            </Row>

            <div className="text-right">
              <Button
                type="default"
                className="mr-2"
                onClick={onClose}
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
//               name="title"
//               label="title"
//               rules={[{ required: true, message: 'title is required' }]}
//             >
//               <Input placeholder="" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="description"
//               label="description"
//               rules={[{ required: true, message: 'description is required' }]}
//             >
//               <Input placeholder="description" />
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
