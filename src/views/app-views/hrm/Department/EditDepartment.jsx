import React, { useEffect, useState } from 'react';
import { Formik, Form as FormikForm, Field } from 'formik';
import { Input, Button, Row, Col, message } from 'antd';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { EditDept, getDept } from './DepartmentReducers/DepartmentSlice';

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  department_name: Yup.string()
    .required('Department Name is required')
    .min(2, 'Department name must be at least 2 characters')
    .max(50, 'Department name cannot exceed 50 characters'),
});

const EditDepartment = ({ comnyid, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const alldept = useSelector((state) => state.Department);
  const [singleEmp, setSingleEmp] = useState(null);

  useEffect(() => {
    const empData = alldept?.Department?.data || [];
    const data = empData.find((item) => item.id === comnyid);
    setSingleEmp(data || null);
  }, [comnyid, alldept]);

  const handleSubmit = (values) => {
    if (!comnyid) {
      message.error('Company ID is missing.');
      return;
    }

    dispatch(EditDept({ comnyid, values }))
      .then(() => {
        dispatch(getDept());
        message.success('Department updated successfully!');
        onClose();
        navigate('/app/hrm/department');
      })
      .catch((error) => {
        message.error('Failed to update department.');
        console.error('Edit API error:', error);
      });
  };

  return (
    <div className="edit-department">
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Formik
        initialValues={{
          department_name: singleEmp ? singleEmp.department_name : '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize // This allows the form to reinitialize when initialValues change
      >
        {({ errors, touched, setFieldValue }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label>Department*</label>
                  <Field
                    as={Input}
                    name="department_name"
                    placeholder="Enter Department Name"
                    onChange={(e) => setFieldValue('department_name', e.target.value)}
                  />
                  {errors.department_name && touched.department_name && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.department_name}</div>
                  )}
                </div>
              </Col>
            </Row>

            <div className="text-right">
              <Button type="default" className="mr-2" onClick={onClose}>
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

export default EditDepartment;