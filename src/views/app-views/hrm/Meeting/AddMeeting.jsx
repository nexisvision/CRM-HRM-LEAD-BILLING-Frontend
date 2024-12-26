import React, { useEffect } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, TimePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { getDept } from '../Department/DepartmentReducers/DepartmentSlice';
import { empdata } from '../Employee/EmployeeReducers/EmployeeSlice';
import { AddMeet, MeetData } from './MeetingReducer/MeetingSlice';

const { Option } = Select;

const AddMeeting = ({onClose}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata()); 
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDept());
  }, [dispatch]);

  const AllDepart = useSelector((state) => state.Department);
  const datadept = AllDepart.Department.data;

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data;

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddMeet(values))
      .then(() => {
        dispatch(MeetData()) 
          .then(() => {
            message.success('Meeting added successfully!');
            resetForm(); 
            onClose(); 
            navigate('/app/hrm/meeting'); 
          })
          .catch((error) => {
            message.error('Failed to fetch the latest meeting data.');
            console.error('MeetData API error:', error);
          });
      })
      .catch((error) => {
        message.error('Failed to add meeting.');
        console.error('AddMeet API error:', error);
      });
  };
  

  const initialValues = {
    department: '',
    employee: '',
    title: '',
    date: null,
    startTime: null,
    description: '',
  };

  const validationSchema = Yup.object({
    department: Yup.string().required('Please Select a department.'), // Required field
    employee: Yup.string().required('Please select an employee.'), // Required field
    title: Yup.string().required('Please enter a meeting title.'), // Required field
    date: Yup.date().nullable().required('Event Start Date is required.'), // Required field (date)
    startTime: Yup.date().nullable().required('Meeting time is required.'), // Required field (time)
    description: Yup.string().required('Please enter a description.') // Required field
  });
  

  return (
    <div className="add-job-form">
     <Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={onSubmit}
  validateOnSubmit={true}  // Ensure validation on submit
>
  {({ values, setFieldValue, handleSubmit, setFieldTouched, isSubmitting, isValid, dirty }) => (
    <Form className="formik-form" onSubmit={handleSubmit}>
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Row gutter={16}>
        {/* Department Field */}
        <Col span={24} className="mt-2">
          <div className="form-item">
            <label className="font-semibold">Department</label>
            <Field name="department">
              {({ field, form }) => (
                <Select
                  style={{ width: "100%" }}
                  {...field}
                  placeholder="Select Department"
                  loading={!datadept}
                  value={form.values.department}
                  onChange={(value) => form.setFieldValue('department', value)}
                  onBlur={() => form.setFieldTouched('department', true)}
                >
                  {datadept && datadept.length > 0 ? (
                    datadept.map((dept) => (
                      <Option key={dept.id} value={dept.id}>
                        {dept.department_name || 'Unnamed Department'}
                      </Option>
                    ))
                  ) : (
                    <Option value="" disabled>
                      No Department Available
                    </Option>
                  )}
                </Select>
              )}
            </Field>
            <ErrorMessage name="department" component="div" className="error-message text-red-500 my-1" />
          </div>
        </Col>

        {/* Employee Field */}
        <Col span={24} className="mt-2">
          <div className="form-item">
            <label className="font-semibold">Employee</label>
            <Field name="employee">
              {({ field, form }) => (
                <Select
                  style={{ width: "100%" }}
                  {...field}
                  placeholder="Select Employee"
                  loading={!empData}
                  value={form.values.employee}
                  onChange={(value) => form.setFieldValue('employee', value)}
                  onBlur={() => form.setFieldTouched('employee', true)}
                >
                  {empData && empData.length > 0 ? (
                    empData.map((emp) => (
                      <Option key={emp.id} value={emp.id}>
                        {emp.firstName || 'Unnamed Employee'}
                      </Option>
                    ))
                  ) : (
                    <Option value="" disabled>
                      No Employees Available
                    </Option>
                  )}
                </Select>
              )}
            </Field>
            <ErrorMessage name="employee" component="div" className="error-message text-red-500 my-1" />
          </div>
        </Col>

        {/* Meeting Title Field */}
        <Col span={24} className="mt-2">
          <div className="form-item">
            <label className="font-semibold">Meeting Title</label>
            <Field name="title" as={Input} placeholder="Event Title" />
            <ErrorMessage name="title" component="div" className="error-message text-red-500 my-1" />
          </div>
        </Col>

        {/* Meeting Date Field */}
        <Col span={12} className="mt-2">
          <div className="form-item">
            <label className="font-semibold">Meeting Date</label>
            <DatePicker
              className="w-full"
              format="DD-MM-YYYY"
              value={values.date}
              onChange={(date) => setFieldValue('date', date)}
              onBlur={() => setFieldTouched("date", true)}
            />
            <ErrorMessage name="date" component="div" className="error-message text-red-500 my-1" />
          </div>
        </Col>

        {/* Meeting Time Field */}
        <Col span={12} className="mt-2">
          <div className="form-item">
            <label className="font-semibold">Meeting Time</label>
            <TimePicker
              className="w-full"
              format="HH:mm"
              value={values.startTime}
              onChange={(startTime) => setFieldValue('startTime', startTime)}
              onBlur={() => setFieldTouched("startTime", true)}
            />
            <ErrorMessage name="startTime" component="div" className="error-message text-red-500 my-1" />
          </div>
        </Col>

        {/* Meeting Notes Field */}
        <Col span={24} className="mt-2">
          <div className="form-item">
            <label className="font-semibold">Meeting Note</label>
            <Field name="description">
              {({ field }) => (
                <ReactQuill
                  {...field}
                  value={values.description}
                  onChange={(value) => setFieldValue('description', value)}
                  onBlur={() => setFieldTouched("description", true)}
                  placeholder="Write here..."
                />
              )}
            </Field>
            <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
          </div>
        </Col>

      </Row>

      <div className="form-buttons text-right mt-2">
        <Button type="default" className="mr-2" onClick={onClose}>Cancel</Button>
        <Button
          type="primary"
          htmlType="submit"
        
        >
          Create
        </Button>
      </div>

    </Form>
  )}
</Formik>

    </div>
  );
};

export default AddMeeting;
