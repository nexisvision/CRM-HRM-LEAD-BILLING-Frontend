import React, { useEffect, useState } from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import { Input, Button, message, Row, Col, Select, DatePicker, TimePicker, Modal } from 'antd';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { addAnnounce, GetAnn } from './AnnouncementReducer/AnnouncementSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getBranch } from '../Branch/BranchReducer/BranchSlice';
import ReactQuill from 'react-quill';
import AddBranch from '../Branch/AddBranch';
import dayjs from 'dayjs';

const { Option } = Select;

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

  const branches = useSelector((state) => state.Branch?.Branch?.data || []);

  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);

  const handleSubmit = (values, { resetForm }) => {
    if (!values.date || !values.time) {
      message.error('Date and time are required');
      return;
    }

    const dateObj = values.date.toDate();
    const formattedTime = values.time.format('HH:mm:ss');

    const payload = {
      title: values.title,
      description: values.description,
      date: dateObj,
      time: formattedTime,
      branch: {
        branches: values.branch
      }
    };


    dispatch(addAnnounce(payload))
      .then(() => {
        message.success('Announcement added successfully');
        dispatch(GetAnn());
        resetForm();
        onClose();
        navigate('/app/hrm/announcement');
      })
      .catch((error) => {
        console.error('Add API error:', error);
        message.error('Failed to add announcement: ' + error.message);
      });
  };

  return (
    <div className="add-attendance-form">
      <div className="mb-3 border-b pb-1 font-medium"></div>


      <Formik
        initialValues={{
          title: '',
          description: '',
          date: null,
          time: null,
          branch: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleSubmit, resetForm, setFieldTouched, values, setFieldValue }) => (
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
                  <Field name="date">
                    {({ field }) => (
                      <input
                        type="date"
                        {...field}
                        className="w-full mt-1 p-2 border rounded"
                        value={values.date ? dayjs(values.date).format('YYYY-MM-DD') : ''}
                        onChange={(e) => {
                          const date = dayjs(e.target.value);
                          setFieldValue('date', date);
                        }}
                        onBlur={() => setFieldTouched("date", true)}
                      />
                    )}
                  </Field>
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
                    format="HH:mm:ss"
                    value={values.time ? dayjs(values.time, 'HH:mm:ss') : null}
                    onChange={(time) => setFieldValue("time", time)}
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

            <div className="text-right mt-3">
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

export default AddAnnouncement;

