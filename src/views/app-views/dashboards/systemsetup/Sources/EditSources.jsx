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
import {
  Editmins,
  GetLable,
} from "../../project/milestone/LableReducer/LableSlice";
import { useDispatch, useSelector } from "react-redux";

const EditSources = ({ idd, onClose }) => {
  const dispatch = useDispatch();

  const allloggeddata = useSelector((state) => state.user);
  const userdata = allloggeddata.loggedInUser;

  const lid = userdata.id;

  const alltagdata = useSelector((state) => state.Lable);
  const datas = alltagdata.Lable.data;

  const fnddata = datas.find((Item) => Item.id === idd);

  const onSubmit = (values, { resetForm }) => {
    const payload = {
      ...values,
      labelType: "source",
    };

    dispatch(Editmins({ idd, payload }));
    dispatch(GetLable(lid));
    dispatch(GetLable(lid));
    onClose();
    resetForm();
    message.success("Country added successfully!");
  };

  const [initialValues, setInitialValues] = useState({
    name: "",
  });

  useEffect(() => {
    if (fnddata) {
      setInitialValues(fnddata);
    }
  }, [fnddata]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter sourcename."),
  });

  return (
    <>
      <div>
        <div className="">
        <div className="mb-3 border-b pb-[-10px] font-medium"></div>

          <div className="">
            <div className="">
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
                      <Col span={24} className="mt-2">
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
                        UpDated
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

export default EditSources;
