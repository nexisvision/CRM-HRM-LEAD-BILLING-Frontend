import React, { useEffect, useState } from "react";
import { Row, Col, Input, message, Button, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  Editstages,
  getstages,
} from "../LeadStages/LeadsReducer/LeadsstageSlice";
import { GetPip } from "../Pipeline/PiplineReducer/piplineSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const { Option } = Select;

const EditLabels = ({ idd, onClose }) => {
  const dispatch = useDispatch();

  const allpipline = useSelector((state) => state.StagesLeadsDeals);
  const fndpip = allpipline.StagesLeadsDeals.data;

  const allpiplines = useSelector((state) => state.Piplines);
  const fndpips = allpiplines.Piplines.data;

  useEffect(() => {
    dispatch(GetPip());
  }, [dispatch]);

  useEffect(() => {
    if (fndpip && idd) {
      const fndproperdata = fndpip.find((item) => item.id === idd);

      const sssss = fndpips?.find(
        (item) => item?.id === fndproperdata?.pipeline
      );
      if (fndproperdata) {
        setInitialValues({
          stageName: fndproperdata?.stageName || "",
          pipeline: sssss?.pipeline_name || "",
        });
      }
    }
  }, [fndpip, idd, fndpips]);

  const onSubmit = (values, { resetForm }) => {
    const payload = { ...values, stageType: "lable" };
    dispatch(Editstages({ idd, payload }));
    dispatch(getstages());
    dispatch(getstages());
    onClose();
    message.success("Lable updated successfully!");
  };

  const [initialValues, setInitialValues] = useState({
    stageName: "",
    pipeline: "",
  });

  const validationSchema = Yup.object({
    stageName: Yup.string().required("Please enter lead stage name."),
    pipeline: Yup.string().required("Please select pipeline."),
  });

  return (
    <div>
      <div className="">
        <div className="mb-2 border-b pb-[-10px] font-medium"></div>
        <div className="p-2">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
              <Form className="formik-form" onSubmit={handleSubmit}>
                <Row gutter={16}>
                  <Col span={24} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold">
                        Label Name <span className="text-rose-500">*</span>
                      </label>
                      <Field
                        name="stageName"
                        as={Input}
                        className="w-full mt-1"
                        placeholder="Enter Lead Stage Name"
                        value={values.stageName}
                        onChange={(e) =>
                          setFieldValue("stageName", e.target.value)
                        }
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
                            value={values.pipeline}
                            onChange={(value) =>
                              setFieldValue("pipeline", value)
                            }
                            onBlur={() => setFieldTouched("pipeline", true)}
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
    </div>
  );
};

export default EditLabels;
