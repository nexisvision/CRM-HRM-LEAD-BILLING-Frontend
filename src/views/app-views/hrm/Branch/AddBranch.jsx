import React, { useState, useEffect } from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import { Input, Button, Row, Col, message, Modal, Select } from 'antd';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AddBranchs, getBranch } from './BranchReducer/BranchSlice';
import { GetUsers } from '../../Users/UserReducers/UserSlice';
import { PlusOutlined } from '@ant-design/icons';
import AddUser from '../../Users/user-list/AddUser';

const { Option } = Select;

const validationSchema = Yup.object().shape({
  branchName: Yup.string()
    .required('Branch Name is required')
    .min(2, 'Branch name must be at least 2 characters')
    .max(50, 'Branch name cannot exceed 50 characters'),
  branchManager: Yup.string()
    .required('Branch Manager is required')
    .min(2, 'Branch Manager name must be at least 2 characters'),
  branchAddress: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
});

const AddBranch = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [managers, setManagers] = useState([]);

  const alldata = useSelector((state) => state.Users.Users?.data || []);

  useEffect(() => {
    dispatch(GetUsers());
  }, [dispatch]);

  const handleSubmit = (values, { resetForm }) => {
    dispatch(AddBranchs(values))
      .then(() => {
        dispatch(getBranch());
        // message.success('Branch added successfully!');
        resetForm();
        onClose();
      })
      .catch((error) => {
        // message.error('Failed to add branch.');
        console.error('Add API error:', error);
      });
  };

  return (
    <div className="add-employee">
 <h2 className="mb-3 border-b pb-1 font-medium"></h2>

      <Formik
        initialValues={{
          branchName: '',
          branchManager: '',
          branchAddress: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, resetForm }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label className="font-semibold">Branch <span className="text-red-500">*</span></label>
                  <Field
                    as={Input}
                    name="branchName"
                    className="w-full mt-2"
                    placeholder="Enter Branch Name"
                    onChange={(e) => setFieldValue('branchName', e.target.value)}
                  />
                  {errors.branchName && touched.branchName && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.branchName}</div>
                  )}
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Branch Manager <span className="text-red-500">*</span></label>
                  <Field name="branchManager">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        placeholder="Select Branch Manager"
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Button
                              type="link"
                              block
                              onClick={() => {
                                setIsAddUserModalVisible(true);
                                dispatch(GetUsers());
                              }}
                            >
                              + Add New Branch Manager
                            </Button>
                          </>
                        )}
                        onChange={(value) => {
                          setFieldValue("branchManager", value);
                          setFieldValue("department", "");
                          setFieldValue("designation", "");
                          setSelectedBranch(value);
                        }}
                      >
                        {Array.isArray(alldata) && alldata.length > 0 ? (
                          alldata.map((manager) => (
                            <Option key={manager.id} value={manager.id}>
                              {manager.username}
                            </Option>
                          ))
                        ) : (
                          <Option disabled>No managers available</Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="branchManager" component="div" className="text-red-500" />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label className="font-semibold">Address <span className="text-red-500">*</span></label>
                  <Field
                    as={Input}
                    name="branchAddress"
                    className="w-full mt-1"
                    placeholder="Enter Branch Address"
                    onChange={(e) => setFieldValue('branchAddress', e.target.value)}
                  />
                  {errors.branchAddress && touched.branchAddress && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.branchAddress}</div>
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

      <Modal
        title="Add Branch Manager"
        visible={isAddUserModalVisible}
        onCancel={() => setIsAddUserModalVisible(false)}
        footer={null}
        width={800}
      >
        <AddUser
          visible={isAddUserModalVisible}
          onClose={() => {
            setIsAddUserModalVisible(false);
            dispatch(GetUsers())
              .then((response) => {
                if (response.payload?.data) {
                  setManagers(response.payload.data);
                }
              });
          }}
        />
      </Modal>
    </div>
  );
};

export default AddBranch;


