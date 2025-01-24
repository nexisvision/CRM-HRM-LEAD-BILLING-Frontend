import React, { useEffect, useState } from "react";
import { Input, Button, Select, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { addnotess, getnotess } from "./notesReducer/notesSlice";
import { useDispatch, useSelector } from "react-redux";
import { empdata } from "../hrm/Employee/EmployeeReducers/EmployeeSlice";

const { Option } = Select;

// Validation Schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  type: Yup.string().required("Type is required"),
  assignto: Yup.array().when("type", {
    is: "Shared",
    then: () => Yup.array().min(1, "Please select at least one user"),
    otherwise: () => Yup.array().notRequired(),
  }),
});

const AddNotes = ({ onClose }) => {
  const dispatch = useDispatch();

  const [selectedType, setSelectedType] = useState("Personal");
  const navigate = useNavigate();

  const alllogeddata = useSelector((state) => state.user);
  const id = alllogeddata.loggedInUser.id;

  useEffect(() => {
    dispatch(empdata());
  }, []);

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data;

  const initialValues = {
    title: "",
    description: "",
    type: "Personal",
    assignto: [],
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = {
        note_title: values.title,
        notetype: values.type,
        employees:
          values.type === "Shared" ? { employee: values.assignto } : null,
        description: values.description,
      };

      dispatch(addnotess({ id, formData })).then(() => {
        dispatch(getnotess(id)).unwrap();
        message.success("Notes added successfully!");
        resetForm();
        onClose();
      });
    } catch (error) {
      message.error(error.message || "Failed to add note");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          setFieldValue,
          isSubmitting,
          errors,
          touched,
          resetForm,
        }) => (
          <Form>
            <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
            <Row gutter={16}>
              <Col span={24}>
                <div className="mb-4">
                  <label htmlFor="title" className="block mb-2">
                    Title
                  </label>
                  <Field name="title">
                    {({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter Title"
                        className={
                          errors.title && touched.title ? "border-red-500" : ""
                        }
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={24}>
                <div className="mb-4">
                  <label htmlFor="description" className="block mb-2">
                    Description
                  </label>
                  <Field name="description">
                    {({ field }) => (
                      <ReactQuill
                        value={field.value}
                        onChange={(content) =>
                          setFieldValue("description", content)
                        }
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label htmlFor="type" className="block mb-2">
                    Type
                  </label>
                  <Field name="type">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select Type"
                        onChange={(value) => {
                          setFieldValue("type", value);
                          setSelectedType(value);
                          if (value !== "Shared") {
                            setFieldValue("assignto", []);
                          }
                        }}
                        value={field.value}
                        className={
                          errors.type && touched.type ? "border-red-500" : ""
                        }
                      >
                        <Option value="Personal">Personal</Option>
                        <Option value="Shared">Shared</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {values.type === "Shared" && (
                  <Col span={24} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold">AssignTo</label>
                      <Field name="assignto">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full mt-2"
                            mode="multiple"
                            placeholder="Select AddProjectMember"
                            onChange={(value) =>
                              setFieldValue("assignto", value)
                            }
                            value={values.assignto}
                          >
                            {empData && empData.length > 0 ? (
                              empData.map((client) => (
                                <Option key={client.id} value={client.id}>
                                  {client.firstName ||
                                    client.username ||
                                    "Unnamed Client"}
                                </Option>
                              ))
                            ) : (
                              <Option value="" disabled>
                                No Clients Available
                              </Option>
                            )}
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage
                        name="assignto"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                )}
              </Col>
            </Row>

            <div className="form-buttons text-right">
              <Button
                type="default"
                className="mr-2"
                onClick={() => navigate("/app/hrm/jobs")}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddNotes;
