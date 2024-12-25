import React, { useEffect, useState } from 'react';
import { Formik, Form as FormikForm, Field } from 'formik';
import { Input, Button, Row, Col, message } from 'antd';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { EditDes, getDes } from './DesignationReducers/DesignationSlice';

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  designation_name: Yup.string()
    .required('Designation Name is required')
    .min(2, 'Designation name must be at least 2 characters')
    .max(50, 'Designation name cannot exceed 50 characters'),
});

const EditDesignation = ({ id, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const alldept = useSelector((state) => state.Designation);
  const [singleEmp, setSingleEmp] = useState(null);

  useEffect(() => {
    const empData = alldept?.Designation?.data || [];
    const data = empData.find((item) => item.id === id);
    setSingleEmp(data || null);
  }, [id, alldept]);

  const handleSubmit = (values) => {
    if (!id) {
      message.error('Designation ID is missing.');
      return;
    }

    dispatch(EditDes({ id, values }))
      .then(() => {
        dispatch(getDes());
        message.success('Designation updated successfully!');
        onClose();
        navigate('/app/hrm/designation');
      })
      .catch((error) => {
        message.error('Failed to update designation.');
        console.error('Edit API error:', error);
      });
  };

  return (
    <div className="edit-designation">
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Formik
        initialValues={{
          designation_name: singleEmp ? singleEmp.designation_name : '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label>Designation*</label>
                  <Field
                    as={Input}
                    name="designation_name"
                    placeholder="Enter Designation Name"
                    onChange={(e) => setFieldValue('designation_name', e.target.value)}
                  />
                  {errors.designation_name && touched.designation_name && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.designation_name}</div>
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

export default EditDesignation;