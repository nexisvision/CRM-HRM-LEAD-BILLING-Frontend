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
  assignto: Yup.array().min(1, "Please select at least one user"),
});
const EditNotes = ({ onClose }) => {
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
        // message.success("Notes added successfully!");
        resetForm();
        onClose();
      });
    } catch (error) {
      // message.error(error.message || "Failed to add note");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="add-notes-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form>
            
            
            <Row gutter={16}>
              <Col span={24}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Title <span className="text-red-500">*</span></label>
                  <Field
                    name="title"
                    as={Input}
                    placeholder="Enter Title"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500" />
                </div>
              </Col>
              <Col span={24}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Description <span className="text-red-500">*</span></label>
                  <Field name="description">
                    {({ field }) => (
                      <ReactQuill
                        value={field.value}
                        onChange={(content) => setFieldValue("description", content)}
                        placeholder="Enter Description"
                      />
                    )}
                  </Field>
                  <ErrorMessage name="description" component="div" className="text-red-500" />
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Type <span className="text-red-500">*</span></label>
                  <Field name="type">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Type"
                        onChange={(value) => {
                          setFieldValue("type", value);
                          setSelectedType(value);
                          if (value !== "Shared") {
                            setFieldValue("assignto", []);
                          }
                        }}
                      >
                        <Option value="Personal">Personal</Option>
                        <Option value="Shared">Shared</Option>
                        <Option value="Announcement">Announcement</Option>
                        <Option value="Party">Party</Option>
                        <Option value="Meeting">Meeting</Option>
                        <Option value="Event">Event</Option>
                        <Option value="Task">Task</Option>
                        <Option value="Reminder">Reminder</Option>
                        <Option value="Important">Important</Option>
                        <Option value="Other">Other</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="type" component="div" className="text-red-500" />
                </div>
              </Col>
            
                <Col span={12}>
                  <div className="mb-4">
                    <label className="block mb-1 font-semibold">Assign To <span className="text-red-500">*</span></label>
                    <Field name="assignto">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full"
                          mode="multiple"
                          placeholder="Select Members"
                          onChange={(value) => setFieldValue("assignto", value)}
                          value={values.assignto}
                        >
                          {empData && empData.length > 0 ? (
                            empData.map((client) => (
                              <Option key={client.id} value={client.id}>
                                {client.firstName || client.username || "Unnamed Client"}
                              </Option>
                            ))
                          ) : (
                            <Option value="" disabled>No Members Available</Option>
                          )}
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage name="assignto" component="div" className="text-red-500" />
                  </div>
                </Col>
              
            </Row>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button 
                type="default" 
                onClick={onClose}
                style={{ marginRight: '8px' }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
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
export default EditNotes;











// import React, { useEffect, useState } from "react";
// import { Input, Button, Select, message, Row, Col } from "antd";
// import { useNavigate } from "react-router-dom";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";
// import { addnotess, getnotess } from "./notesReducer/notesSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { empdata } from "../hrm/Employee/EmployeeReducers/EmployeeSlice";

// const { Option } = Select;

// // Validation Schema
// const validationSchema = Yup.object().shape({
//   title: Yup.string().required("Title is required"),
//   description: Yup.string().required("Description is required"),
//   type: Yup.string().required("Type is required"),
//   // assignto: Yup.array().when("type", {
//   //   is: "Shared",
//   //   then: () => Yup.array().min(1, "Please select at least one user"),
//   //   otherwise: () => Yup.array().notRequired(),
//   // }),
// });

// const AddNotes = ({ onClose }) => {
//   const dispatch = useDispatch();

//   const [selectedType, setSelectedType] = useState("Personal");
//   const navigate = useNavigate();

//   const alllogeddata = useSelector((state) => state.user);
//   const id = alllogeddata.loggedInUser.id;

//   useEffect(() => {
//     dispatch(empdata());
//   }, []);

//   const allempdata = useSelector((state) => state.employee);
//   const empData = allempdata?.employee?.data;

//   const initialValues = {
//     title: "",
//     description: "",
//     type: "",
//     // assignto: [],
//   };

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       const formData = {
//         note_title: values.title,
//         notetype: values.type,
//         employees:
//           values.type === "Shared" ? { employee: values.assignto } : null,
//         description: values.description,
//       };

//       dispatch(addnotess({ id, formData })).then(() => {
//         dispatch(getnotess(id)).unwrap();
//         // message.success("Notes added successfully!");
//         resetForm();
//         onClose();
//       });
//     } catch (error) {
//       // message.error(error.message || "Failed to add note");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="add-notes-form">
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ values, setFieldValue, isSubmitting, errors, touched }) => (
//           <Form>
//             
            
//             <Row gutter={16}>
//               <Col span={24}>
//                 <div className="mb-4">
//                   <label className="block mb-1 font-semibold">Title <span className="text-red-500">*</span></label>
//                   <Field
//                     name="title"
//                     as={Input}
//                     placeholder="Enter Title"
//                   />
//                   <ErrorMessage name="title" component="div" className="text-red-500" />
//                 </div>
//               </Col>

//               <Col span={24}>
//                 <div className="mb-4">
//                   <label className="block mb-1 font-semibold">Description <span className="text-red-500">*</span></label>
//                   <Field name="description">
//                     {({ field }) => (
//                       <ReactQuill
//                         value={field.value}
//                         onChange={(content) => setFieldValue("description", content)}
//                         placeholder="Enter Description"
//                       />
//                     )}
//                   </Field>
//                   <ErrorMessage name="description" component="div" className="text-red-500" />
//                 </div>
//               </Col>

//               <Col span={12}>
//                 <div className="mb-4">
//                   <label className="block mb-1 font-semibold">Type <span className="text-red-500">*</span></label>
//                   <Field name="type">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         className="w-full"
//                         placeholder="Select Type"
//                         onChange={(value) => {
//                           setFieldValue("type", value);
//                           setSelectedType(value);
//                         }}
//                       >
//                         <Option value="Personal">Personal</Option>
//                         <Option value="Shared">Shared</Option>
//                         <Option value="Announcement">Announcement</Option>
//                         <Option value="Party">Party</Option>
//                         <Option value="Meeting">Meeting</Option>
//                         <Option value="Event">Event</Option>
//                         <Option value="Task">Task</Option>
//                         <Option value="Reminder">Reminder</Option>
//                         <Option value="Important">Important</Option>
//                         <Option value="Other">Other</Option>
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage name="type" component="div" className="text-red-500" />
//                 </div>
//               </Col>


//               {/* <Col span={12}>
//                 <div className="mb-4">
//                   <label className="block mb-1 font-semibold">Assign To <span className="text-red-500">*</span></label>
//                   <Field
//                     name="assignto"
//                     as={Input}
//                     placeholder="Enter Assign To"
//                     className="w-full"
//                     onChange={(e) => {
//                       setFieldValue("assignto", e.target.value);
//                       setSelectedType(e.target.value);
//                       if (e.target.value !== "Shared") {
//                         setFieldValue("assignto", []);
//                       }
//                     }}
//                   />
//                   <ErrorMessage name="assignto" component="div" className="text-red-500" />
//                 </div>
//               </Col> */}

//               {/* {values.type === "Shared" && (
//                 <Col span={12}>
//                   <div className="mb-4">
//                     <label className="block mb-1 font-semibold">Assign To <span className="text-red-500">*</span></label>
//                     <Field name="assignto">
//                       {({ field }) => (
//                         <Select
//                           {...field}
//                           className="w-full"
//                           mode="multiple"
//                           placeholder="Select Members"
//                           onChange={(value) => setFieldValue("assignto", value)}
//                           value={values.assignto}
//                         >
//                           {empData && empData.length > 0 ? (
//                             empData.map((client) => (
//                               <Option key={client.id} value={client.id}>
//                                 {client.firstName || client.username || "Unnamed Client"}
//                               </Option>
//                             ))
//                           ) : (
//                             <Option value="" disabled>No Members Available</Option>
//                           )}
//                         </Select>
//                       )}
//                     </Field>
//                     <ErrorMessage name="assignto" component="div" className="text-red-500" />
//                   </div>
//                 </Col>
//               )} */}
//             </Row>

//             <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
//               <Button 
//                 type="default" 
//                 onClick={onClose}
//                 style={{ marginRight: '8px' }}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 type="primary" 
//                 htmlType="submit" 
//                 disabled={isSubmitting}
//               >
//                 Create
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default AddNotes;
