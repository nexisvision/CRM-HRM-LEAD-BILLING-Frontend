import React, { useEffect, useState } from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import { Input, Button, message, Row, Col, Select, DatePicker, TimePicker, Modal } from 'antd';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { editAnnounce, GetAnn } from './AnnouncementReducer/AnnouncementSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getBranch } from '../Branch/BranchReducer/BranchSlice';
import ReactQuill from 'react-quill';
import AddBranch from '../Branch/AddBranch';

const { Option } = Select;

// Update validation schema to include branch
const validationSchema = Yup.object().shape({
  title: Yup.string().required('title is required'),
  description: Yup.string().required('description is required'),
  date: Yup.string().required('date is required'),
  time: Yup.string().required('time is required'),
  branch: Yup.array().required('Branch is required'),
});

const EditAnnouncement = ({ onClose, announcementData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get branches from Redux store
  const branches = useSelector((state) => state.Branch?.Branch?.data || []);

  // Fetch branches when component mounts
  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);

  const handleSubmit = (values, { resetForm }) => {
    const payload = {
      ...values,
      branch: {
        branch: values.branch,
      },
    };

    dispatch(editAnnounce(payload))
      .then(() => {
        dispatch(GetAnn());
        resetForm();
        onClose();
        navigate('/app/hrm/announcement');
      })
      .catch((error) => {
        console.error('Edit API error:', error);
      });
  };

  return (
    <div className="edit-announcement-form">
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Formik
        initialValues={{
          title: announcementData.title || '',
          description: announcementData.description || '',
          date: announcementData.date || '',
          time: announcementData.time || '',
          branch: announcementData.branch || [],
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
                    dropdownRender={menu => (
                      <>
                        {menu}
                        <Button 
                          type="link" 
                          block
                          onClick={() => setIsAddBranchModalVisible(true)}
                        >
                          + Add New Branch
                        </Button>
                      </>
                    )}
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

      {/* Add Branch Modal */}
      <Modal
        title="Add Branch"
        visible={isAddBranchModalVisible}
        onCancel={() => setIsAddBranchModalVisible(false)}
        footer={null}
        width={800}
      >
        <AddBranch onClose={() => setIsAddBranchModalVisible(false)} />
      </Modal>
    </div>
  );
};

export default EditAnnouncement;
