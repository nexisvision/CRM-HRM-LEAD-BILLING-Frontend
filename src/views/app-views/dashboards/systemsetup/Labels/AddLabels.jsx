import React, { useEffect, useState } from "react";
import {
 
  Row,
  Col,
 
  Input,
  message,
  Button,
 
  Select,
 
} from "antd";

// import { Card, Table,  Badge, Menu, Tag,Modal } from 'antd';
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import OrderListData from "assets/data/order-list.data.json";

import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  Addstages,
  getstages,
} from "../LeadStages/LeadsReducer/LeadsstageSlice";
import { GetPip } from "../Pipeline/PiplineReducer/piplineSlice";

const { Option } = Select;

const AddLabels = ({ onClose }) => {
  // const [users, setUsers] = useState(userData);

  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggeduser = useSelector((state) => state.user.loggedInUser.username);
  
  const allpipline = useSelector((state) => state.Piplines);
  const fndpipp = allpipline.Piplines.data;

  const fndpip = fndpipp.filter((item)=>item.created_by === loggeduser)

  useEffect(() => {
    dispatch(GetPip());
  }, []);

  const onSubmit = (values, { resetForm }) => {
    const payload = { ...values, stageType: "lable" };
    dispatch(Addstages(payload));
    dispatch(getstages());
    dispatch(getstages());
    onClose();
    resetForm();
    console.log("Submitted values:", payload);
    message.success("Lead stage added successfully!");
  };

  const initialValues = {
    stageName: "",
    pipeline: "",
  };

  const validationSchema = Yup.object({
    stageName: Yup.string().required("Please enter lead stage name."),
    pipeline: Yup.string().required("Please select pipeline."),
  });

  return (
    <>
      <div>
        <div className="">
          <h2 className="mb-1 border-b font-medium"></h2>

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
                            Label Name <span className="text-rose-500">*</span>
                          </label>
                          <Field
                            name="stageName"
                            as={Input}
                            className="w-full mt-1"
                            placeholder="Enter Label Name"
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
                          <label className="font-semibold">Pipeline <span className="text-rose-500">*</span></label>
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
    </>
  );
};

export default AddLabels;
