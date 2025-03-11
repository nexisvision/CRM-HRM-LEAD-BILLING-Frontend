import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  message,
  Button,
} from "antd";
import "react-quill/dist/quill.snow.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Editpipl, GetPip } from "./PiplineReducer/piplineSlice";
import { useDispatch, useSelector } from "react-redux";


const EditPipeLine = ({ idd, onClose }) => {
  const dispatch = useDispatch();

  const allempdata = useSelector((state) => state.Piplines);
  const Expensedata = React.useMemo(() => allempdata?.Piplines?.data || [], [allempdata?.Piplines?.data]);

  useEffect(() => {
    const milestone = Expensedata.find((item) => item.id === idd);
    if (milestone) {
      setInitialValues(milestone);
    } else {
      message.error("Milestone not found!");
    }
  }, [idd, Expensedata]);

  const onSubmit = (values, { setSubmitting }) => {
    dispatch(Editpipl({ idd, values }));
    dispatch(GetPip(values));
    dispatch(GetPip(values));
    message.success("Pipeline added successfully!");
    onClose();
    setSubmitting(false);
  };

  const [initialValues, setInitialValues] = useState({
    pipeline_name: "",
  });

  const validationSchema = Yup.object({
    pipeline_name: Yup.string().required("Please enter pipeline name."),
  });

  return (
    <div>
      <hr className="mb-1 border-b font-medium"></hr>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, handleSubmit, isSubmitting }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Pipeline Name</label>
                  <Field
                    name="pipeline_name"
                    as={Input}
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

            <div className="form-buttons text-right">
              <Button type="default" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditPipeLine;
