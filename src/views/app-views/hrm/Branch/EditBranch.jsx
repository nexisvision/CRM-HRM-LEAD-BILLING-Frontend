import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Input, Button, Row, Col, message, Select } from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { editBranch, getBranch } from "./BranchReducer/BranchSlice";
import { GetUsers } from '../../Users/UserReducers/UserSlice';

const { Option } = Select;

const styles = `
  .ant-select-item-option-content {
    padding: 12px 16px;
  }

  .ant-select-item-option-content .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .ant-select-item-option-content .font-medium {
    color: #2c3e50;
    font-size: 14px;
    flex: 1;
  }

  .ant-select-item-option-content .rounded-full {
    border-radius: 16px;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    height: 24px;
    min-width: 80px;
    justify-content: center;
  }

  .ant-select-item-option-content .bg-blue-50 {
    background-color: #f0f7ff;
    border: 1px solid #e1effe;
  }

  .ant-select-item-option-content .text-blue-600 {
    color: #3b82f6;
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
    font-weight: 500;
  }

  .ant-select-item-option {
    transition: all 0.3s ease;
  }

  .ant-select-item-option:hover {
    background-color: #f8fafc;
  }

  .ant-select-item-option:hover .bg-blue-50 {
    background-color: #e1effe;
    border-color: #bfdbfe;
  }
`;

const validationSchema = Yup.object().shape({
  branchName: Yup.string()
    .required("Branch Name is required")
    .min(2, "Branch name must be at least 2 characters")
    .max(50, "Branch name cannot exceed 50 characters"),
  branchManager: Yup.string()
    .required("Branch Manager is required")
    .min(2, "Branch Manager name must be at least 2 characters"),
  branchAddress: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
});

const EditBranch = ({ idd, onClose }) => {
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = useState({
    branchName: "",
    branchManager: "",
    branchAddress: "",
  });

  const alldata = useSelector((state) => state.Branch);
  const fnddata = alldata.Branch.data;

  const fnddataitem = fnddata.find((item) => item.id === idd);

  const [managers, setManagers] = useState([]);

  useEffect(() => {
    dispatch(GetUsers())
      .then((response) => {
        if (response.payload?.data) {
          setManagers(response.payload.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        message.error('Failed to fetch users');
      });
  }, [dispatch]);

  useEffect(() => {
    if (fnddataitem) {
      setInitialValues({
        branchName: fnddataitem.branchName || "",
        branchManager: fnddataitem.branchManager || "",
        branchAddress: fnddataitem.branchAddress || "",
      });
    }
  }, [fnddataitem]);

  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  const handleSubmit = (values, { resetForm }) => {
    dispatch(editBranch({ idd, values }))
      .then(() => {
        dispatch(getBranch());
        resetForm();
        onClose();
      })
      .catch((error) => {
        console.error("Edit API error:", error);
      });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="add-employee">
        <div className="mb-3 border-b pb-1 font-medium"></div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, resetForm }) => (
            <FormikForm>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="font-semibold">Branch <span className="text-red-500">*</span></label>
                    <Field
                      as={Input}
                      name="branchName"
                      className="w-full mt-1"
                      placeholder="Enter Branch Name"
                      onChange={(e) => setFieldValue("branchName", e.target.value)}
                    />
                    {errors.branchName && touched.branchName && (
                      <div style={{ color: "red", fontSize: "12px" }}>
                        {errors.branchName}
                      </div>
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
                          onChange={(value) => setFieldValue("branchManager", value)}
                        >
                          {managers.map((manager) => (
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
                          ))}
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage name="branchManager" component="div" className="text-red-500" />
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="font-semibold">Address <span className="text-red-500">*</span></label>
                    <Field
                      as={Input}
                      name="branchAddress"
                      className="w-full mt-1"
                      placeholder="Enter Branch Address"
                      onChange={(e) => setFieldValue("branchAddress", e.target.value)}
                    />
                    {errors.branchAddress && touched.branchAddress && (
                      <div style={{ color: "red", fontSize: "12px" }}>
                        {errors.branchAddress}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              <div className="text-right">
                <Button
                  type="default"
                  className="mr-2"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
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
    </>
  );
};

export default EditBranch;
