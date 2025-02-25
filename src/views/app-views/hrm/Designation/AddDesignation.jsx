import React, { useEffect } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Input, Button, Row, Col, Select, message } from "antd";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AddDes, getDes } from "./DesignationReducers/DesignationSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";

const { Option } = Select;

const AddDesignation = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the logged-in user
  const user = useSelector((state) => state.user.loggedInUser.username);

  // Get branch data from Redux store
  const branchData = useSelector((state) => state.Branch);
  const allBranches = branchData.Branch.data || [];
  
  // Filter branches for the current user
  const userBranches = allBranches.filter((item) => item.created_by === user);

  // Fetch branch data when component mounts
  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  // Handle form submission
  const handleSubmit = (values, { resetForm }) => {
    dispatch(AddDes(values))
      .then(() => {
        dispatch(getDes());
        message.success("Designation added successfully!");
        resetForm();
        onClose();
        // navigate("/app/hrm/designation");
      })
      .catch((error) => {
        message.error("Failed to add designation.");
        console.error("Add API error:", error);
      });
  };

  return (
    <div className="add-designation">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
      <Formik
        initialValues={{
          designation_name: "",
          branch: "",
        }}
        validationSchema={Yup.object().shape({
          designation_name: Yup.string()
            .required("Designation Name is required")
            .min(2, "Designation name must be at least 2 characters")
            .max(50, "Designation name cannot exceed 50 characters"),
          branch: Yup.string().required("Branch is required"),
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values, setFieldTouched }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as={Input}
                    name="designation_name"
                    className="w-full mt-1"
                    placeholder="Enter Designation Name"
                  />
                  <ErrorMessage
                    name="designation_name"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <Field name="branch">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Branch"
                        onChange={(value) => setFieldValue("branch", value)}
                        onBlur={() => setFieldTouched("branch", true)}
                      >
                        {userBranches.map((branch) => (
                          <Option key={branch.id} value={branch.id}>
                            {branch.branchName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="branch"
                    component="div"
                    className="text-red-500 mt-1"
                  />
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

export default AddDesignation;
