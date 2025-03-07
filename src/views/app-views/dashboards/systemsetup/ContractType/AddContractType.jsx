import React, { useState } from "react";
import {
 
  Row,
  Col,
 
  Input,
  message,
  Button,

  Select,
 
} from "antd";

import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

import userData from "assets/data/user-list.data.json";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  AddLablee,
  GetLablee,
} from "../../project/milestone/LableReducer/LableSlice";
import { useDispatch, useSelector } from "react-redux";



const AddContractType = ({ onClose }) => {
  // const [users, setUsers] = useState(userData);

  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const allloggeddata = useSelector((state) => state.user);
  const userdata = allloggeddata.loggedInUser;

  const lid = userdata.id;



  const onSubmit = (values, { resetForm }) => {
    // Add static labelType to payload
    const payload = {
      ...values,
      lableType: "contract",
    };

    // console.log("payload", payload);

    dispatch(AddLablee({ lid, payload }));
    dispatch(GetLablee(lid));
    dispatch(GetLablee(lid));
    onClose();
    resetForm();
    // console.log("Submitted values:", payload);
    message.success("Contract Type added successfully!");
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
          <h2 className="mb-1 border-b font-medium"></h2>

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
                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">Contract Type Name <span className="text-rose-500">*</span></label>
                          <Field
                            name="name"
                            as={Input}
                            className="w-full mt-1"
                            placeholder="Enter Contract Type Name"
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

export default AddContractType;
