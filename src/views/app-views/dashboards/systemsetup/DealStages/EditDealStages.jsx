import React, { useEffect, useState } from "react";
import { Row, Col, Input, message, Button, Modal, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  Editstages,
  getstages,
} from "../LeadStages/LeadsReducer/LeadsstageSlice";
import { GetPip } from "../Pipeline/PiplineReducer/piplineSlice";
import AddPipeLine from "../Pipeline/AddPipeLine";

const { Option } = Select;

const EditDealStages = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const allpipline = useSelector((state) => state.StagesLeadsDeals);
  const fndpip = allpipline.StagesLeadsDeals.data;
  const allpiplines = useSelector((state) => state.Piplines);
  const fndpips = allpiplines.Piplines.data;
  const [isAddPipelineModalVisible, setAddPipelineModalVisible] =
    useState(false);

  useEffect(() => {
    dispatch(GetPip());
  }, [dispatch]);
  useEffect(() => {
    if (fndpip && idd) {
      const fndproperdata = fndpip.find((item) => item.id === idd);

      const sssss = fndpips.find((item) => item.id === fndproperdata.pipeline);
      if (fndproperdata) {
        setInitialValues({
          stageName: fndproperdata?.stageName || "",
          pipeline: sssss?.pipeline_name || "",
        });
      }
    }
  }, [fndpip, idd, fndpips]);

  const onSubmit = (values, { resetForm }) => {
    const payload = { ...values, stageType: "deal" };
    dispatch(Editstages({ idd, payload }));
    dispatch(getstages());
    dispatch(getstages());
    onClose();
    message.success("Deal stage updated successfully!");
  };

  const [initialValues, setInitialValues] = useState({
    stageName: "",
    pipeline: "",
  });

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
    <div>
      <div className="">
        <div className="border-b pb-[-10px] font-medium"></div>
        <div className="p-2">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
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
                  {/* Editable Stage Name Field */}
                  <Col span={24} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold">
                        Deal Stage Name <span className="text-rose-500">*</span>
                      </label>
                      <Field
                        name="stageName"
                        as={Input}
                        className="w-full mt-1"
                        placeholder="Enter Lead Stage Name"
                        value={values.stageName} // Controlled by Formik
                        onChange={(e) =>
                          setFieldValue("stageName", e.target.value)
                        } // Ensure user can edit
                      />
                      <ErrorMessage
                        name="stageName"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>

                  {/* Editable Pipeline Field */}
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
                            value={values.pipeline}
                            onChange={(value) =>
                              setFieldValue("pipeline", value)
                            }
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
                            {fndpips && fndpips.length > 0 ? (
                              fndpips.map((client) => (
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

                {/* Form Buttons */}
                <div className="form-buttons text-right mt-3">
                  <Button type="default" className="mr-2" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
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
    </div>
  );
};

export default EditDealStages;
