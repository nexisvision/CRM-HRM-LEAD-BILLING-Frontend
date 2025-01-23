import React from 'react';
import { Formik, Form as FormikForm, Field } from 'formik';
import { Input, Button, Row, Col, message } from 'antd';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AddBranchs, getBranch } from './BranchReducer/BranchSlice';

const validationSchema = Yup.object().shape({
  branchName: Yup.string()
    .required('Branch Name is required')
    .min(2, 'Department name must be at least 2 characters')
    .max(50, 'Department name cannot exceed 50 characters'),
});

const AddBranch = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values, { resetForm }) => {
    dispatch(AddBranchs(values))
      .then(() => {
        dispatch(getBranch());
        message.success('Branch added successfully!');
        resetForm();
        onClose();
      })
      .catch((error) => {
        message.error('Failed to add department.');
        console.error('Add API error:', error);
      });
  };

  return (
    <div className="add-employee">
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Formik
        initialValues={{
          branchName: '',
        }}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, resetForm }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label>Branch*</label>
                  <Field
                    as={Input}
                    name="branchName"
                    placeholder="Enter Branch Name"
                    onChange={(e) => setFieldValue('branchName', e.target.value)}
                  />
                  {errors.branchName && touched.branchName && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.branchName}</div>
                  )}
                </div>
              </Col>
            </Row>

            <div className="text-right">
              <Button type="default" className="mr-2" onClick={() => { resetForm(); onClose(); }}>
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

export default AddBranch;


