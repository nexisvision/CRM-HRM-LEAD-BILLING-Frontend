import React, { useEffect, useState } from "react";
import { Row, Col, Input, message, Button, Modal, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { GetPip } from "../Pipeline/PiplineReducer/piplineSlice";
import {
  Addstages,
  getstages,
} from "../LeadStages/LeadsReducer/LeadsstageSlice";
import AddPipeLine from "../Pipeline/AddPipeLine";

const { Option } = Select;

const AddDealStages = ({ onClose }) => {
  const [isAddPipelineModalVisible, setAddPipelineModalVisible] =
    useState(false);
  const dispatch = useDispatch();
  const allpipline = useSelector((state) => state.Piplines);
  const fndpip = allpipline.Piplines.data;
  useEffect(() => {
    dispatch(GetPip());
  }, [dispatch]);

  const onSubmit = (values, { resetForm }) => {
    const payload = { ...values, stageType: "deal" };
    dispatch(Addstages(payload));
    dispatch(getstages());
    dispatch(getstages());
    onClose();
    resetForm();
    message.success("Deal stage added successfully!");
  };

  const initialValues = {
    stageName: "",
    pipeline: "",
  };

  const validationSchema = Yup.object({
    stageName: Yup.string().required("Please enter lead stage name."),
    pipeline: Yup.string().required("Please select pipeline."),
  });

  const showAddPipelineModal = () => {
    setAddPipelineModalVisible(true);
  };

  const closeAddPipelineModal = () => {
    setAddPipelineModalVisible(false);
  };

  return (
    <>
      <div>
        <div className="">
          <div className="border-b pb-[-10px] font-medium"></div>

          <div className="">
            <div className="">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({
                  values,
                  setFieldValue,
                  handleSubmit,
                  setFieldTouched,
                  resetForm,
                }) => (
                  <Form className="formik-form" onSubmit={handleSubmit}>
                    <Row gutter={16}>
                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">
                            Deal Stage Name{" "}
                            <span className="text-rose-500">*</span>
                          </label>
                          <Field
                            name="stageName"
                            as={Input}
                            className="w-full mt-1"
                            placeholder="Enter Lead Stage Name"
                          />
                          <ErrorMessage
                            name="stageName"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">
                            Pipeline <span className="text-rose-500">*</span>
                          </label>
                          <Field name="pipeline">
                            {({ field }) => (
                              <Select
                                {...field}
                                className="w-full mt-1"
                                placeholder="Select Pipeline"
                                onChange={(value) =>
                                  setFieldValue("pipeline", value)
                                }
                                value={values.pipeline}
                                onBlur={() => setFieldTouched("pipeline", true)}
                                dropdownRender={(menu) => (
                                  <>
                                    {menu}
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        padding: 8,
                                      }}
                                    >
                                      <Button
                                        type="link"
                                        icon={<PlusOutlined />}
                                        onClick={showAddPipelineModal}
                                      >
                                        Add Pipeline
                                      </Button>
                                    </div>
                                  </>
                                )}
                              >
                                {fndpip && fndpip.length > 0 ? (
                                  fndpip.map((client) => (
                                    <Option key={client.id} value={client.id}>
                                      {client.pipeline_name || "Unnamed Client"}
                                    </Option>
                                  ))
                                ) : (
                                  <Option value="" disabled>
                                    No Pipeline Available
                                  </Option>
                                )}
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage
                            name="pipeline"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="form-buttons text-right mt-3">
                      <Button type="default" className="mr-2" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button type="primary" htmlType="submit">
                        Create
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Add Pipeline"
        visible={isAddPipelineModalVisible}
        onCancel={closeAddPipelineModal}
        footer={null}
      >
        <AddPipeLine onClose={closeAddPipelineModal} />
      </Modal>
    </>
  );
};

export default AddDealStages;
