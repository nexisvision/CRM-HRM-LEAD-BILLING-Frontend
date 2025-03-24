import React, { useState, useEffect } from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import { Input, Button, Row, Col, Modal, Select, message } from 'antd';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AddBranchs, getBranch } from './BranchReducer/BranchSlice';
import { GetUsers } from '../../Users/UserReducers/UserSlice';
import AddUser from '../../Users/user-list/AddUser';
import { getRoles } from '../RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice';

const { Option } = Select;

const styles = `
  .ant-select-item-option-content {
    padding: 12px 16px;  /* Increased padding */
  }

  .ant-select-item-option-content .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;  /* Added gap between username and role */
  }

  .ant-select-item-option-content .font-medium {
    color: #2c3e50;
    font-size: 14px;  /* Adjusted font size */
    flex: 1;  /* Allow username to take available space */
  }

  .ant-select-item-option-content .rounded-full {
    border-radius: 16px;  /* Slightly larger radius */
    white-space: nowrap;  /* Prevent role label from wrapping */
    display: inline-flex;
    align-items: center;
    height: 24px;  /* Fixed height for consistency */
    min-width: 80px;  /* Minimum width for role badge */
    justify-content: center;  /* Center the role text */
  }

  .ant-select-item-option-content .bg-blue-50 {
    background-color: #f0f7ff;  /* Slightly adjusted blue */
    border: 1px solid #e1effe;  /* Added subtle border */
  }

  .ant-select-item-option-content .text-blue-600 {
    color: #3b82f6;  /* Adjusted blue color */
  }

  .ant-select-item-option-content .px-2 {
    padding-left: 12px;
    padding-right: 12px;
  }

  .ant-select-item-option-content .py-1 {
    padding-top: 2px;
    padding-bottom: 2px;
  }

  .ant-select-item-option-content .text-xs {
    font-size: 12px;
    font-weight: 500;  /* Medium weight for better readability */
  }

  .ant-select-item-option {
    transition: all 0.3s ease;  /* Smooth transition for hover */
  }

  .ant-select-item-option:hover {
    background-color: #f8fafc;  /* Light hover background */
  }

  .ant-select-item-option:hover .bg-blue-50 {
    background-color: #e1effe;
    border-color: #bfdbfe;
  }

  /* Dropdown styling */
  .ant-select-dropdown {
    padding: 4px;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  /* Add New Branch Manager button styling */
  .ant-select-item-option-content + .ant-btn-link {
    margin-top: 8px;
    padding: 8px 16px;
    border-top: 1px solid #e5e7eb;
  }
`;

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
  const dispatch = useDispatch();
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const alldata = useSelector((state) => state.Users.Users?.data || []);
  const roles = useSelector((state) => state.role?.role?.data || []);

  useEffect(() => {
    dispatch(GetUsers());
    dispatch(getRoles());
  }, [dispatch]);

  const handleSubmit = (values, { resetForm }) => {
    dispatch(AddBranchs(values))
      .then(() => {
        dispatch(getBranch());
        resetForm();
        onClose();
      })
      .catch((error) => {
        console.error('Add API error:', error);
        message.error('Failed to add branch');
      });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="add-employee">
        <div className="mb-3 border-b pb-1 font-medium"></div>

        <Formik
          initialValues={{
            branchName: '',
            branchManager: '',
            branchAddress: '',
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
                          }}
                        >
                          {Array.isArray(alldata) && alldata.length > 0 ? (
                            alldata.map((manager) => (
                              <Option key={manager.id} value={manager.id}>
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">
                                    {manager.username}
                                  </span>
                                  <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600">
                                    {manager.Role?.role_name || 'No Role'}
                                  </span>
                                </div>
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
                <Col span={24}>
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
            }}
          />
        </Modal>
      </div>
    </>
  );
};

export default AddBranch;


