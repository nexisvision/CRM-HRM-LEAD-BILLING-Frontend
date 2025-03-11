import React from "react";
import {
  Row,
  Col,
  Input,
  Button,
} from "antd";
import "react-quill/dist/quill.snow.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AddPip, GetPip } from "./PiplineReducer/piplineSlice";
import { useDispatch } from "react-redux";

const AddPipeLine = ({ onClose }) => {
  const dispatch = useDispatch();

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    dispatch(AddPip(values));
    dispatch(GetPip());
    dispatch(GetPip());
    resetForm();
    onClose();
    onClose();
    setSubmitting(false);
  };

  const initialValues = {
    pipeline_name: "",
  };

  const validationSchema = Yup.object({
    pipeline_name: Yup.string().required("Please enter pipeline name."),
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, handleSubmit, isSubmitting, resetForm }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={24} className="">
                <hr className="mb-4 border-b pb-2 font-medium"></hr>
                <div className="form-item">
                  <label className="font-semibold">Pipeline Name <span className="text-rose-500">*</span></label>
                  <Field
                    name="pipeline_name"
                    as={Input}
                    className="w-full mt-1"
                    placeholder="Enter Pipeline Name"
                  />
                  <ErrorMessage
                    name="pipeline_name"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-3">
              <Button type="default" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPipeLine;
