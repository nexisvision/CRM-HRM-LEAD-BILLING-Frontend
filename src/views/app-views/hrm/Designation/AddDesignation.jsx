import React, { useEffect } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Input, Button, Row, Col, Select, message } from "antd";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AddDes, getDes } from "./DesignationReducers/DesignationSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice"; // Import getBranch action

const { Option } = Select;

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  designation_name: Yup.string()
    .required("Designation Name is required")
    .min(2, "Designation name must be at least 2 characters")
    .max(50, "Designation name cannot exceed 50 characters"),
  branch: Yup.string().required("Branch is required"), // Make branch required
});

const AddDesignation = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: Branch, status, error } = useSelector((state) => state.Branch);

  const user = useSelector((state) => state.user.loggedInUser.username);

  const alldatas = useSelector((state) => state.Branch);
  const fnddata = alldatas.Branch.data || [];
  const fndbranchdata = fnddata.filter((item) => item.created_by === user);

  // Handle form submission
  const handleSubmit = (values, { resetForm }) => {
    dispatch(AddDes(values))
      .then(() => {
        dispatch(getDes());
        // message.success("Designation added successfully!");
        resetForm();
        onClose();
        navigate("/app/hrm/designation");
      })
      .catch((error) => {
        // message.error("Failed to add designation.");
        console.error("Add API error:", error);
      });
  };

  useEffect(() => {
    // Dispatch getBranch action to fetch branch data
    dispatch(getBranch());
  }, [dispatch]);

  return (
    <div className="add-designation">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
      <Formik
        initialValues={{
          designation_name: "",
          branch: "", // Initialize branch field
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values, setFieldTouched }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label>Designation*</label>
                  <Field
                    as={Input}
                    name="designation_name"
                    placeholder="Enter Designation Name"
                    onChange={(e) =>
                      setFieldValue("designation_name", e.target.value)
                    }
                  />
                  {errors.designation_name && touched.designation_name && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.designation_name}
                    </div>
                  )}
                </div>
              </Col>

              <Col span={12} className="mb-4">
                <div className="form-item">
                  <label>Branch</label>
                  <Field name="branch">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Branch"
                        onChange={(value) => setFieldValue("branch", value)}
                        value={values.branch}
                        onBlur={() => setFieldTouched("branch", true)}
                      >
                        {fndbranchdata?.map((branch) => (
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
                    className="error-message text-red-500 my-1"
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
