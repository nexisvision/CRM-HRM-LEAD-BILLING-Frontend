import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Input, Button, Row, Col, message, Select } from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { editBranch, getBranch } from "./BranchReducer/BranchSlice";
import { GetUsers } from '../../Users/UserReducers/UserSlice';

const { Option } = Select;

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
    <div className="add-employee">
      <div className="mb-3 border-b pb-1 font-medium"></div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize // Enable reinitialization when initialValues change
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
                    onChange={(e) =>
                      setFieldValue("branchName", e.target.value)
                    }
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
                            {manager.username}
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
  );
};

export default EditBranch;
