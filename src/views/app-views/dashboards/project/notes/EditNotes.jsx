// import React, { useEffect, useState } from "react";
// import {
//   Input,
//   Button,
//   DatePicker,
//   Select,
//   message,
//   Row,
//   Col,
//   Switch,
//   Upload,
//   Modal,
//   Checkbox,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// import { useNavigate, useParams } from "react-router-dom";

// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { EditeNotes } from "./NotesReducer/NotesSlice";
// import { useDispatch, useSelector } from "react-redux";

// const { Option } = Select;

// const EditNotes = ({ idd, onClose }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
//   const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);
//   const [showReceiptUpload, setShowReceiptUpload] = useState(false);
//   // const [uploadModalVisible, setUploadModalVisible] = useState(false);

//   const { id } = useParams();

//   const [initialValues, setInitialValues] = useState({
//     note_title: "",
//     notetype: "public",
//     description: "",
//     employees: {},
//   });

//   const validationSchema = Yup.object({
//     note_title: Yup.string().required("Please enter Note Title."),
//     notetype: Yup.string().required("Please select Note Type."),
//     description: Yup.string().required("Please enter Description."),
//   });
//   const onSubmit = (values, { resetForm }) => {
//     dispatch(EditeNotes({ id, values }));
//     console.log("Submitted values:", values);
//     message.success("Expenses added successfully!");
//     resetForm();
//     navigate("/app/dashboards/project/list");
//   };

//   const allempdata = useSelector((state) => state.Notes);
//   const Expensedata = allempdata?.Notes?.data || [];

//   useEffect(() => {
//     if (Expensedata.length > 0 && idd) {
//       const expdata = Expensedata.find((item) => item.id === idd);

//       console.log("eeee", expdata);

//       if (expdata) {
//         setInitialValues({
//           note_title: expdata.note_title || "",
//           notetype: expdata.notetype || "public", // Set the notetype as well
//           description: expdata.description || "",
//           employees: expdata.employees || [], // Assuming employees is an array
//         });
//       } else {
//         message.error("Expense not found!");
//         navigate("/apps/sales/expenses");
//       }
//     }
//   }, [idd, Expensedata, navigate]);

//   return (
//     <div className="add-expenses-form">
//       <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
//           <Form className="formik-form" onSubmit={handleSubmit}>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Note Title</label>
//                   <Field
//                     name="note_title"
//                     as={Input}
//                     placeholder="Enter Note Title"
//                     className="mt-2"
//                   />
//                   <ErrorMessage
//                     name="note_title"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={24}>
//                 <div className="mt-4">
//                   <label className="font-semibold">Employees</label>
//                   <Select
//                     mode="multiple"
//                     placeholder="Select Employees"
//                     className="w-full mt-2"
//                     onChange={(value) => setFieldValue("employees", value)}
//                     value={values.employees}
//                   >
//                     <Option value="xyz">XYZ</Option>
//                     <Option value="abc">ABC</Option>
//                   </Select>
//                   <ErrorMessage
//                     name="employees"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={24} className="mt-5">
//                 <div className="form-item">
//                   <label className="font-semibold">Description</label>
//                   <ReactQuill
//                     value={values.description}
//                     onChange={(value) => setFieldValue("description", value)}
//                     placeholder="Enter Description"
//                     onBlur={() => setFieldTouched("description", true)}
//                   />
//                   <ErrorMessage
//                     name="description"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>
//             </Row>
//             <div className="form-buttons text-right mt-4">
//               <Button type="default" className="mr-2" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button type="primary" htmlType="submit">
//                 Create
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default EditNotes;

import React, { useEffect, useState } from "react";
import { Input, Button, Select, message, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { EditeNotes, GetNote } from "./NotesReducer/NotesSlice";
import { useDispatch, useSelector } from "react-redux";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";

const { Option } = Select;

const EditNotes = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  // const { data: employee } = useSelector((state) => state.employee.employee);
// const user = useSelector((state)=>state.user.loggedInUser.username)

    const filterdata = useSelector((state)=>state.employee.employee.data)
  
    const loggeduesr = useSelector((state)=>state.user.loggedInUser.username)
  
    const employee = filterdata.filter((item)=>item.created_by === loggeduesr)

  const employeeData = employee?.filter((item) => item.created_by === loggeduesr);
  

  useEffect(() => {
    dispatch(empdata());
  }, []);

  const [initialValues, setInitialValues] = useState({
    note_title: "",
    notetype: "public",
    description: "",
    employees: null,
  });

  const validationSchema = Yup.object({
    note_title: Yup.string().required("Please enter Note Title."),
    notetype: Yup.string().required("Please select Note Type."),
    description: Yup.string().optional("Please enter Description."),
  });

  const allempdata = useSelector((state) => state.Notes);
  const Expensedata = allempdata?.Notes?.data || [];

  useEffect(() => {
    if (!Expensedata.length || !idd) {
      return;
    }

    const noteData = Expensedata.find((item) => item.id === idd);

    if (noteData) {
      setInitialValues({
        note_title: noteData.note_title || "",
        notetype: noteData.notetype || "public",
        description: noteData.description || "",
        employees: noteData.employees?.id || null,
      });
    } else {
      message.error("Note not found!");
      navigate("/apps/sales/expenses");
    }
  }, [idd, Expensedata, navigate]);

  const onSubmit = async (values, { resetForm }) => {
    try {
      const employeesObject = values.employees ? { id: values.employees } : null;
      
      const payload = {
        ...values,
        employees: employeesObject
      };

      console.log("Updating note with values:", { idd, values: payload });
      const result = await dispatch(EditeNotes({ idd, values: payload })).unwrap();
      dispatch(GetNote(id));
      onClose();

      if (result) {
        resetForm();
      }
    } catch (error) {
      console.error("Error updating note:", error);
      message.error("Failed to update note: " + error.message);
    }
  };

  return (
    <div className="add-expenses-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Note Title <span className="text-red-500">*</span></label>
                  <Field
                    name="note_title"
                    as={Input}
                    placeholder="Enter Note Title"
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="note_title"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold mb-2">Employee</label>
                  <div className="flex gap-2">
                    <Field name="employees">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          placeholder="Select Employee"
                          onChange={(value) => {
                            form.setFieldValue("employees", value);
                          }}
                        >
                          {Array.isArray(employeeData) &&
                            employeeData.map((emp) => (
                              <Option key={emp.id} value={emp.id}>
                                {emp.username}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="employees"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Description</label>
                  <ReactQuill
                    value={values.description}
                    className="mt-1"
                    onChange={(value) => setFieldValue("description", value)}
                    placeholder="Enter Description"
                    onBlur={() => setFieldTouched("description", true)}
                  />
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
  );
};

export default EditNotes;
