import React from "react";
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
import {
  AddLablee,
  GetLablee,
} from "../../project/milestone/LableReducer/LableSlice";
import { useDispatch, useSelector } from "react-redux";

const AddSources = ({ onClose }) => {
  const dispatch = useDispatch();
  const allloggeddata = useSelector((state) => state.user);
  const userdata = allloggeddata.loggedInUser;
  const lid = userdata.id;
  const onSubmit = (values, { resetForm }) => {
    const payload = {
      ...values,
      lableType: "source",
    };
    dispatch(AddLablee({ lid, payload }))
    dispatch(GetLablee(lid));
    dispatch(GetLablee(lid));
    onClose();
    resetForm();
    message.success("Source added successfully!");
  };

  const initialValues = {
    name: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter sourcename."),
  });

  return (
    <>
      <div>
        <div className="">
          <div className="">
            <div className="">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({
                  handleSubmit,
                }) => (
                  <Form className="formik-form" onSubmit={handleSubmit}>
                    <Row gutter={16}>
                      <Col span={24} className="">
                      <div className="mb-3 border-b pb-[-10px] font-medium"></div>
                        <div className="form-item">
                          <label className="font-semibold">Source Name <span className="text-rose-500">*</span></label>
                          <Field
                            name="name"
                            as={Input}
                            className="w-full mt-1"
                            placeholder="Enter Source Name"
                          />
                          <ErrorMessage
                            name="name"
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

export default AddSources;
