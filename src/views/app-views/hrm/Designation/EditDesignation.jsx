import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Input, Button, Row, Col, message, Select, Modal } from "antd";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EditDes, getDes } from "./DesignationReducers/DesignationSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";
import AddBranch from "../Branch/AddBranch";
import { Option } from "antd/es/mentions";

const validationSchema = Yup.object().shape({
  designation_name: Yup.string()
    .required("Designation Name is required")
    .min(2, "Designation name must be at least 2 characters")
    .max(50, "Designation name cannot exceed 50 characters"),
});

const EditDesignation = ({ id, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  const user = useSelector((state) => state.user.loggedInUser.username);
  const alldatas = useSelector((state) => state.Branch);
  const fnddata = alldatas?.Branch?.data || [];
  const fndbranchdata = fnddata.filter((item) => item.created_by === user);

  const alldept = useSelector((state) => state.Designation);
  const [singleEmp, setSingleEmp] = useState(null);

  useEffect(() => {
    const empData = alldept?.Designation?.data || [];
    const data = empData.find((item) => item.id === id);
    setSingleEmp(data || null);
  }, [id, alldept]);

  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);

  const openAddBranchModal = () => {
    setIsAddBranchModalVisible(true);
  };

  const closeAddBranchModal = () => {
    setIsAddBranchModalVisible(false);
  };

  const handleSubmit = (values) => {
    if (!id) {
      message.error("Designation ID is missing.");
      return;
    }

    dispatch(EditDes({ id, values }))
      .then(() => {
        dispatch(getDes());
        onClose();
        navigate("/app/hrm/designation");
      })
      .catch((error) => {
        console.error("Edit API error:", error);
      });
  };

  return (
    <div className="edit-designation">
      <div className="mb-3 border-b pb-1 font-medium"></div>

      <Formik
        initialValues={{
          designation_name: singleEmp ? singleEmp.designation_name : "",
          branch: singleEmp ? singleEmp.branch : "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Designation <span className="text-red-500">*</span></label>
                  <Field
                    as={Input}
                    name="designation_name"
                    className="w-full mt-1"
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
                  <label className="font-semibold">Branch <span className="text-red-500">*</span></label>
                  <Field name="branch">
                    {({ field, form }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Branch"
                        onChange={(value) => form.setFieldValue("branch", value)}
                        disabled={fndbranchdata.length === 0}
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
                        {fndbranchdata.length > 0 ? (
                          fndbranchdata.map((branch) => (
                            <Option key={branch.id} value={branch.id}>
                              {branch.branchName}
                            </Option>
                          ))
                        ) : (
                          <Option disabled>No branches available</Option>
                        )}
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

      {/* Add Branch Modal */}
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

export default EditDesignation;
