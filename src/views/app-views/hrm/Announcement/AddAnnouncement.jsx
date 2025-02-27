import React, { useEffect } from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import { Input, Button, message, Row, Col, Select, DatePicker, TimePicker } from 'antd';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { addAnnounce, GetAnn } from './AnnouncementReducer/AnnouncementSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getBranch } from '../Branch/BranchReducer/BranchSlice';
import ReactQuill from 'react-quill';

const { Option } = Select;

// Update validation schema to include branch
const validationSchema = Yup.object().shape({
  title: Yup.string().required('title is required'),
  description: Yup.string().required('description is required'),
  date: Yup.string().required('date is required'),
  time: Yup.string().required('time is required'),
  branch: Yup.array().required('Branch is required'),
});

const AddAnnouncement = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get branches from Redux store
  const branches = useSelector((state) => state.Branch?.Branch?.data || []);

  // Fetch branches when component mounts
  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  const branchdata = useSelector((state) => state.Branch.Branch.data);

  const handleSubmit = (values, { resetForm }) => {
    const payload = {
      ...values,
      branch: {
        branch: values.branch,
      },
    };

    dispatch(addAnnounce(payload))
      .then(() => {
        dispatch(GetAnn());
        resetForm();
        onClose();
        navigate('/app/hrm/announcement');
      })
      .catch((error) => {
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
          date: '',
          time: '',
          branch: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleSubmit, resetForm, setFieldTouched, values, setFieldValue}) => (
          <FormikForm onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                {/* title Field */}
                <div>
                  <label className="font-semibold">Title <span className="text-red-500">*</span></label>
                  <Field
                    as={Input}
                    name="title"
                    placeholder="Enter title"
                    className="w-full mt-1"
                  />
                  {errors.title && touched.title && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.title}</div>
                  )}
                </div>
              </Col>

              <Col span={12}>
                {/* Branch Field */}
                <div>
                  <label className="font-semibold">Branch <span className="text-red-500">*</span></label>
                  <Field
                    as={Select}
                    name="branch"
                    mode="multiple"
                    placeholder="Select branch"
                    className="w-full mt-1"
                    onChange={(value) => setFieldValue("branch", value)}
                    onBlur={() => setFieldTouched("branch", true)}
                  >
                    {branches.map((branch) => (
                      <Option key={branch.id} value={branch.id}>
                        {branch.branchName}
                      </Option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="branch"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    className="w-full mt-1"
                    format="DD-MM-YYYY"
                    value={values.date}
                    onChange={(date) => setFieldValue("date", date)}
                    onBlur={() => setFieldTouched("date", true)}
                  />
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Time <span className="text-red-500">*</span></label>
                  <TimePicker
                    className="w-full mt-1"
                    format="HH:mm"
                    value={values.time}
                    onChange={(time) =>
                      setFieldValue("time", time)
                    }
                    onBlur={() => setFieldTouched("time", true)}
                  />
                  <ErrorMessage
                    name="time"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Description <span className="text-red-500">*</span></label>
                  <ReactQuill
                    className="mt-1"
                    name="description"
                    value={values.description}
                    onChange={(value) =>
                      setFieldValue("description", value)
                    }
                    placeholder="Enter description"
                    onBlur={() => setFieldTouched("description", true)}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* <Col span={12}>
              
                <div style={{ marginBottom: '16px' }}>
                  <label className="font-semibold">Description <span className="text-red-500">*</span></label>
                  <Field
                    as={Input}
                    name="description"
                    placeholder="Enter description"
                    className="w-full mt-1"
                  />
                  {errors.description && touched.description && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.description}</div>
                  )}
                </div>
              </Col> */}
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
