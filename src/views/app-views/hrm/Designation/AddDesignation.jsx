import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Input, Button, Row, Col, Select, Modal } from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddDes, getDes } from "./DesignationReducers/DesignationSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";
import AddBranch from "../Branch/AddBranch";

const { Option } = Select;

const AddDesignation = ({ onClose }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.loggedInUser.username);

  const branchData = useSelector((state) => state.Branch);
  const allBranches = branchData.Branch.data || [];

  const userBranches = allBranches.filter((item) => item.created_by === user);

  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);

  const openAddBranchModal = () => {
    setIsAddBranchModalVisible(true);
  };

  const closeAddBranchModal = () => {
    setIsAddBranchModalVisible(false);
  };

  const handleSubmit = (values, { resetForm }) => {
    dispatch(AddDes(values))
      .then(() => {
        dispatch(getDes());
        resetForm();
        onClose();
      })
      .catch((error) => {
        console.error("Add API error:", error);
      });
  };

  return (
    <div className="add-designation">
      <div className="mb-3 border-b pb-1 font-medium"></div>
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
                        dropdownRender={(menu) => (
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

export default AddDesignation;
