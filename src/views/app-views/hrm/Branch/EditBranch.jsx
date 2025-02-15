import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm, Field } from "formik";
import { Input, Button, Row, Col, message } from "antd";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiFillAndroid } from "react-icons/ai";
import { editBranch, getBranch } from "./BranchReducer/BranchSlice";

const validationSchema = Yup.object().shape({
  branchName: Yup.string()
    .required("Department Name is required")
    .min(2, "Department name must be at least 2 characters")
    .max(50, "Department name cannot exceed 50 characters"),
});

const EditBranch = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = useState({
    branchName: "",
  });

  const alldata = useSelector((state) => state.Branch);
  const fnddata = alldata.Branch.data;

  const fnddataitem = fnddata.find((item) => item.id === idd);

  useEffect(() => {
    if (fnddataitem) {
      setInitialValues({
        branchName: fnddataitem.branchName || "",
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
        message.success("Branch updated successfully!");
        resetForm();
        onClose();
      })
      .catch((error) => {
        message.error("Failed to update branch.");
        console.error("Edit API error:", error);
      });
  };

  return (
    <div className="add-employee">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

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
