import React, { useEffect, useState } from "react";
import { Row, Col, Input, message, Button, DatePicker } from "antd";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import {
  editcreditnote,
  getcreditnote,
} from "./CustomerReducer/CreditnoteSlice";
import dayjs from "dayjs";

const EditCrediteNotes = ({ idd, onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getcreditnote());
  }, [dispatch]);

  const allldata = useSelector((state) => state.creditnotes);
  const fnddata = allldata.creditnotes.data;

  const fnd = fnddata.find((item) => item.id === idd);

  const [initialValues, setInitialValues] = useState({
    amount: "",
    date: null,
    description: "",
  });

  useEffect(() => {
    if (fnd) {
      const formattedDate = fnd?.date ? dayjs(fnd.date) : null;
      setInitialValues({
        amount: fnd.amount,
        date: formattedDate,
        description: fnd.description,
      });
    }
  }, [fnd]);

  const onSubmit = (values) => {
    dispatch(editcreditnote({ idd, values })).then(() => {
      dispatch(getcreditnote());
      dispatch(getcreditnote());
      onClose();
      message.success("Credit Note updated successfully!");
    });
  };

  const validationSchema = Yup.object({
    amount: Yup.string()
      .min(1, "please enter minimum 1 amount")
      .required("Please enter an amount."),
    date: Yup.date().nullable().required("Date is required."),
    description: Yup.string().required("Please enter a description."),
  });

  return (
    <div>
      <div>
        <hr className="mb-3 border-b font-medium"></hr>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
            <Form className="formik-form" onSubmit={handleSubmit}>
              <Row gutter={16}>
                <Col span={12} className="">
                  <div className="form-item">
                    <label className="font-semibold  mt-1">Amount <span className="text-red-500">*</span></label>
                    <Field
                      name="amount"
                      as={Input}
                      placeholder="Enter Amount"
                      type="number"
                    />
                    <ErrorMessage
                      name="amount"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Issue Date <span className="text-red-500">*</span></label>
                    <DatePicker
                      className="w-full"
                      format="DD-MM-YYYY"
                      value={values.date ? dayjs(values.date) : null}
                      onChange={(date) => setFieldValue("date", date)}
                      onBlur={() => setFieldTouched("date", true)}
                    />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={24} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold mt-1">Description <span className="text-red-500">*</span></label>
                    <Field name="description">
                      {({ field }) => (
                        <ReactQuill
                          {...field}
                          placeholder="Enter Description"
                          value={values.description}
                          onChange={(value) =>
                            setFieldValue("description", value)
                          }
                          onBlur={() => setFieldTouched("description", true)}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
              </Row>

              <div className="form-buttons text-right mt-4">
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
  );
};

export default EditCrediteNotes;
