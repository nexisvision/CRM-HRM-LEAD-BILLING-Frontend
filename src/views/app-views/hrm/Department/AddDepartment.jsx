import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Input, Button, Row, Col, message, Select, Modal } from "antd";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AddDept, getDept } from "./DepartmentReducers/DepartmentSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";
import AddBranch from "../Branch/AddBranch";

const { Option } = Select;
// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  department_name: Yup.string()
    .required("Department Name is required")
    .min(2, "Department name must be at least 2 characters")
    .max(50, "Department name cannot exceed 50 characters"),
  branch: Yup.string()
    .required("Branch is required")
});

const AddDepartment = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  const user = useSelector((state) => state.user.loggedInUser.username);
  const alldatas = useSelector((state) => state.Branch);
  const fnddata = alldatas.Branch.data || [];
  const fndbranchdata = fnddata.filter((item) => item.created_by === user);

  const handleSubmit = (values, { resetForm }) => {
    dispatch(AddDept(values))
      .then(() => {
        dispatch(getDept());

        // message.success("Department added successfully!");
        resetForm();
        onClose();
        // navigate("/app/hrm/department");
      })
      .catch((error) => {
        // message.error("Failed to add department.");
        console.error("Add API error:", error);
      });
  };

  const openAddBranchModal = () => {
    setIsAddBranchModalVisible(true);
  };

  const closeAddBranchModal = () => {
    setIsAddBranchModalVisible(false);
  };

  return (
    <div className="add-employee">


      <Formik
        initialValues={{
          department_name: "",
          branch: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          touched,
          setFieldValue,
          resetForm,
          setFieldTouched,
          values,
        }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Department <span className="text-red-500">*</span></label>
                  <Field
                    as={Input}
                    name="department_name"
                    className="w-full mt-1"
                    placeholder="Enter Department Name"
                    onChange={(e) =>
                      setFieldValue("department_name", e.target.value)
                    }
                  />
                  {errors.department_name && touched.department_name && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.department_name}
                    </div>
                  )}
                </div>
              </Col>
              <Col span={12} className="mb-4">
                <div className="form-item">
                  <label className="font-semibold">Branch <span className="text-red-500">*</span></label>
                  <Field name="branch">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Branch"
                        onChange={(value) => setFieldValue("branch", value)}
                        value={values.branch}
                        onBlur={() => setFieldTouched("branch", true)}
                        dropdownRender={menu => (
                          <>
                            {menu}
                            <Button
                              type="link"
                              block
                              onClick={openAddBranchModal}
                            >
                              + Add New Branch
                            </Button>
                          </>
                        )}
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

      <Modal
        title="Add Branch"
        visible={isAddBranchModalVisible}
        onCancel={closeAddBranchModal}
        footer={null}
        width={800}
      >
        <AddBranch onClose={closeAddBranchModal} />
      </Modal>
    </div>
  );
};

export default AddDepartment;
