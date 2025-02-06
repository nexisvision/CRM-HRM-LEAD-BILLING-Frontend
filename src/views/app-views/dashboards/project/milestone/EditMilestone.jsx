import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  message,
  Button,
  Select,
  DatePicker,
  Modal,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Editmins, Getmins } from "./minestoneReducer/minestoneSlice";
import { AddLable, GetLable } from "./LableReducer/LableSlice";

const { Option } = Select;

const EditMilestone = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const allempdata = useSelector((state) => state.Milestone);
  const milestones = allempdata.Milestone.data;
  const [tags, setTags] = useState([]);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [initialValues, setInitialValues] = useState({
    milestone_title: "",
    milestone_cost: "",
    milestone_status: "",
    add_cost_to_project_budget: "",
    milestone_summary: "",
    milestone_start_date: null,
    milestone_end_date: null,
  });

  useEffect(() => {
    const milestone = milestones.find((item) => item.id === idd);
    if (milestone) {
      setInitialValues({
        id: milestone.id,
        milestone_title: milestone.milestone_title || "",
        milestone_cost: milestone.milestone_cost || "",
        milestone_status: milestone.milestone_status || "",
        add_cost_to_project_budget: milestone.add_cost_to_project_budget || "",
        milestone_summary: milestone.milestone_summary || "",
        milestone_start_date: milestone.milestone_start_date
          ? moment(milestone.milestone_start_date)
          : null,
        milestone_end_date: milestone.milestone_end_date
          ? moment(milestone.milestone_end_date)
          : null,
      });
    } else {
      message.error("Milestone not found!");
    }
  }, [idd, milestones]);

  const fetchTags = async () => {
    try {
      const response = await dispatch(GetLable(id));
      if (response.payload && response.payload.data) {
        setTags(
          response.payload.data.map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      message.error("Failed to load tags");
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleAddNewTag = async () => {
    if (!newTag.trim()) {
      message.error("Please enter a tag name");
      return;
    }

    try {
      await dispatch(AddLable({ id, payload: { name: newTag.trim() } }));
      message.success("Tag added successfully");
      setNewTag("");
      setIsTagModalVisible(false);
      fetchTags();
    } catch (error) {
      console.error("Failed to add tag:", error);
      message.error("Failed to add tag");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formattedValues = {
        ...values,
        milestone_start_date: values.milestone_start_date
          ? values.milestone_start_date.format("YYYY-MM-DD")
          : null,
        milestone_end_date: values.milestone_end_date
          ? values.milestone_end_date.format("YYYY-MM-DD")
          : null,
      };

      const selectedTag = tags.find(
        (tag) => tag.name === values.milestone_status
      );

      if (!selectedTag) {
        await dispatch(
          AddLable({ id, payload: { name: values.milestone_status.trim() } })
        );
        message.success("New status added successfully");
      }

      await dispatch(Editmins({ idd, data: formattedValues })).unwrap();
      dispatch(Getmins(id));
      onClose();
      message.success("Milestone updated successfully!");
    } catch (error) {
      message.error("Failed to update milestone: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    milestone_title: Yup.string().required("Please enter milestone title."),
    milestone_cost: Yup.string().required("Please enter milestone cost."),
    milestone_status: Yup.string().required("Please select status."),
    add_cost_to_project_budget: Yup.string().required(
      "Please select add cost to project budget."
    ),
    milestone_summary: Yup.string().required("Please enter milestone summary."),
    milestone_start_date: Yup.date()
      .nullable()
      .required("Start Date is required."),
    milestone_end_date: Yup.date()
      .nullable()
      .required("End Date is required")
      .min(
        Yup.ref("milestone_start_date"),
        "End date must be after start date"
      ),
  });

  return (
    <div>
      <div className="ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
        <h2 className="border-b pb-[30px] font-medium"></h2>
        <div className="p-2">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, setFieldTouched, isSubmitting }) => (
              <Form className="formik-form">
                <Row gutter={16}>
                  <Col span={12} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold mb-2">
                        Milestone Title
                      </label>
                      <Field
                        name="milestone_title"
                        as={Input}
                        placeholder="Enter Milestone Title"
                        className="rounded-e-lg rounded-s-none"
                      />
                      <ErrorMessage
                        name="milestone_title"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold mb-2">
                        Milestone Cost
                      </label>
                      <Field
                        name="milestone_cost"
                        as={Input}
                        placeholder="Enter Milestone Cost"
                        className="rounded-e-lg rounded-s-none"
                      />
                      <ErrorMessage
                        name="milestone_cost"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                    <Col span={24} className="mt-4">
                                      <div className="form-item">
                                        <label className="font-semibold">Status</label>
                                        <div className="flex gap-2">
                                          <Field name="milestone_status">
                                            {({ field, form }) => (
                                              <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select or add new tag"
                                                onChange={(value) =>
                                                  form.setFieldValue("milestone_status", value)
                                                }
                                                onBlur={() =>
                                                  form.setFieldTouched("milestone_status", true)
                                                }
                                                dropdownRender={(menu) => (
                                                  <div>
                                                    {menu}
                                                    <div
                                                      style={{
                                                        padding: "8px",
                                                        borderTop: "1px solid #e8e8e8",
                                                      }}
                                                    >
                                                      <Button
                                                        type="link"
                                                        // icon={<PlusOutlined />}
                                                        onClick={() => setIsTagModalVisible(true)}
                                                        block
                                                      >
                                                        Add New Status
                                                      </Button>
                                                    </div>
                                                  </div>
                                                )}
                                              >
                                                {tags &&
                                                  tags.map((tag) => (
                                                    <Option key={tag.id} value={tag.name}>
                                                      {tag.name}
                                                    </Option>
                                                  ))}
                                              </Select>
                                            )}
                                          </Field>
                                        </div>
                                        <ErrorMessage
                                          name="milestone_status"
                                          component="div"
                                          className="error-message text-red-500 my-1"
                                        />
                                      </div>
                                    </Col>
                  <Col span={12} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold mb-2">
                        Add Cost To Project Budget
                      </label>
                      <Select
                        value={values.add_cost_to_project_budget}
                        onChange={(value) =>
                          setFieldValue("add_cost_to_project_budget", value)
                        }
                        onBlur={() =>
                          setFieldTouched("add_cost_to_project_budget", true)
                        }
                        className="w-full"
                        placeholder="Select Option"
                      >
                        <Option value="no">No</Option>
                        <Option value="yes">Yes</Option>
                      </Select>
                      <ErrorMessage
                        name="add_cost_to_project_budget"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={24} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold">Milestone Summary</label>
                      <ReactQuill

                        value={values.milestone_summary}
                        onChange={(value) =>
                          setFieldValue("milestone_summary", value)
                        }
                        placeholder="Enter Milestone Summary"
                      />
                      <ErrorMessage
                        name="milestone_summary"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold mb-2">Start Date</label>

                      <DatePicker
                        className="w-full"
                        format="DD-MM-YYYY"
                        value={values.milestone_start_date}
                        onChange={(date) =>
                          setFieldValue("milestone_start_date", date)
                        }
                        onBlur={() =>
                          setFieldTouched("milestone_start_date", true)
                        }
                      />
                      <ErrorMessage
                        name="milestone_start_date"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold mb-2">End Date</label>

                      <DatePicker
                        className="w-full"
                        format="DD-MM-YYYY"
                        value={values.milestone_end_date}
                        onChange={(date) =>
                          setFieldValue("milestone_end_date", date)
                        }
                        onBlur={() =>
                          setFieldTouched("milestone_end_date", true)
                        }
                      />
                      <ErrorMessage
                        name="milestone_end_date"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                </Row>
                <div className="form-buttons text-right py-2">
                  <Button type="default" className="mr-2" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    Update
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

           <Modal
                      title="Add New Status"
                      open={isTagModalVisible}
                      onCancel={() => setIsTagModalVisible(false)}
                      onOk={handleAddNewTag}
                      okText="Add Status"
                    >
                      <Input
                        placeholder="Enter new Status"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                      />
                    </Modal>
        </div>
      </div>
    </div>
  );
};
export default EditMilestone;













// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Row,
//   Col,
//   Input,
//   message,
//   Button,
//   Select,
//   DatePicker,
// } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import moment from "moment";
// import { Editmins, Getmins } from "./minestoneReducer/minestoneSlice";
// const { Option } = Select;
// const EditMilestone = ({ idd, onClose }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//     const [isTagModalVisible, setIsTagModalVisible] = useState(false);
//     const [newTag, setNewTag] = useState("");
  
//     const [tags, setTags] = useState([]);
//   const { id } = useParams();


//     const Tagsdetail = useSelector((state) => state.Lable);
  
//   const allempdata = useSelector((state) => state.Milestone);
//   const milestones = allempdata.Milestone.data;
//   const [initialValues, setInitialValues] = useState({
//     milestone_title: "",
//     milestone_cost: "",
//     milestone_status: "",
//     add_cost_to_project_budget: "",
//     milestone_summary: "",
//     milestone_start_date: null,
//     milestone_end_date: null,
//   });
//   useEffect(() => {
//     const milestone = milestones.find((item) => item.id === idd);
//     if (milestone) {
//       setInitialValues({
//         id: milestone.id, // Include ID for update
//         milestone_title: milestone.milestone_title || "",
//         milestone_cost: milestone.milestone_cost || "",
//         milestone_status: milestone.milestone_status || "",
//         add_cost_to_project_budget: milestone.add_cost_to_project_budget || "",
//         milestone_summary: milestone.milestone_summary || "",
//         milestone_start_date: milestone.milestone_start_date
//           ? moment(milestone.milestone_start_date)
//           : null,
//         milestone_end_date: milestone.milestone_end_date
//           ? moment(milestone.milestone_end_date)
//           : null,
//       });
//     } else {
//       message.error("Milestone not found!");
//     }
//   }, [idd, milestones]);
//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const formattedValues = {
//         ...values,
//         milestone_start_date: values.milestone_start_date
//           ? values.milestone_start_date.format("YYYY-MM-DD")
//           : null,
//         milestone_end_date: values.milestone_end_date
//           ? values.milestone_end_date.format("YYYY-MM-DD")
//           : null,
//       };
//       await dispatch(Editmins({ idd, data: formattedValues })).unwrap();
//       dispatch(Getmins());
//       onClose();
//       message.success("Milestone updated successfully!");
//     } catch (error) {
//       message.error("Failed to update milestone: " + error.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };
//   const validationSchema = Yup.object({
//     milestone_title: Yup.string().required("Please enter milestone title."),
//     milestone_cost: Yup.string().required("Please enter milestone cost."),
//     milestone_status: Yup.string().required("Please select status."),
//     add_cost_to_project_budget: Yup.string().required(
//       "Please select add cost to project budget."
//     ),
//     milestone_summary: Yup.string().required("Please enter milestone summary."),
//     milestone_start_date: Yup.date()
//       .nullable()
//       .required("Start Date is required."),
//     milestone_end_date: Yup.date()
//       .nullable()
//       .required("End Date is required")
//       .min(
//         Yup.ref("milestone_start_date"),
//         "End date must be after start date"
//       ),
//   });
//   return (
//     <div>
//       <div className="ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
//         {/* <h2 className="border-b pb-[30px] font-medium">Edit Milestone</h2> */}
//         <div className="p-2">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             enableReinitialize={true}
//             onSubmit={handleSubmit}
//           >
//             {({ values, setFieldValue, setFieldTouched, isSubmitting }) => (
//               <Form className="formik-form">
//                 <Row gutter={16}>
//                   <Col span={12}>
//                     <div className="form-item">
//                       <label className="font-semibold mb-2">
//                         Milestone Title
//                       </label>
//                       <Field
//                         name="milestone_title"
//                         as={Input}
//                         placeholder="Enter Milestone Title"
//                         className="rounded-e-lg rounded-s-none"
//                       />
//                       <ErrorMessage
//                         name="milestone_title"
//                         component="div"
//                         className="error-message text-red-500 my-1"
//                       />
//                     </div>
//                   </Col>
//                   <Col span={12}>
//                     <div className="form-item">
//                       <label className="font-semibold mb-2">
//                         Milestone Cost
//                       </label>
//                       <Field
//                         name="milestone_cost"
//                         as={Input}
//                         placeholder="Enter Milestone Cost"
//                         className="rounded-e-lg rounded-s-none"
//                       />
//                       <ErrorMessage
//                         name="milestone_cost"
//                         component="div"
//                         className="error-message text-red-500 my-1"
//                       />
//                     </div>
//                   </Col>
//                   <Col span={12} className="mt-2">
//                     <div className="form-item">
//                       <label className="font-semibold mb-2">Status</label>
//                       <Select
//                         value={values.milestone_status}
//                         onChange={(value) =>
//                           setFieldValue("milestone_status", value)
//                         }
//                         onBlur={() => setFieldTouched("milestone_status", true)}
//                         className="w-full"
//                         placeholder="Select Status"
//                       >
//                         <Option value="active">Active</Option>
//                         <Option value="inactive">Inactive</Option>
//                       </Select>
//                       <ErrorMessage
//                         name="milestone_status"
//                         component="div"
//                         className="error-message text-red-500 my-1"
//                       />
//                     </div>
//                   </Col>
//                   <Col span={12} className="mt-2">
//                     <div className="form-item">
//                       <label className="font-semibold mb-2">
//                         Add Cost To Project Budget
//                       </label>
//                       <Select
//                         value={values.add_cost_to_project_budget}
//                         onChange={(value) =>
//                           setFieldValue("add_cost_to_project_budget", value)
//                         }
//                         onBlur={() =>
//                           setFieldTouched("add_cost_to_project_budget", true)
//                         }
//                         className="w-full"
//                         placeholder="Select Option"
//                       >
//                         <Option value="no">No</Option>
//                         <Option value="yes">Yes</Option>
//                       </Select>
//                       <ErrorMessage
//                         name="add_cost_to_project_budget"
//                         component="div"
//                         className="error-message text-red-500 my-1"
//                       />
//                     </div>
//                   </Col>
//                   <Col span={24} className="mt-2">
//                     <div className="form-item">
//                       <label className="font-semibold">Milestone Summary</label>
//                       <ReactQuill
//                         value={values.milestone_summary}
//                         onChange={(value) =>
//                           setFieldValue("milestone_summary", value)
//                         }
//                         placeholder="Enter Milestone Summary"
//                       />
//                       <ErrorMessage
//                         name="milestone_summary"
//                         component="div"
//                         className="error-message text-red-500 my-1"
//                       />
//                     </div>
//                   </Col>
//                   <Col span={12} className="mt-2">
//                     <div className="form-item">
//                       <label className="font-semibold mb-2">Start Date</label>
//                       <DatePicker
//                         className="w-full"
//                         format="DD-MM-YYYY"
//                         value={values.milestone_start_date}
//                         onChange={(date) =>
//                           setFieldValue("milestone_start_date", date)
//                         }
//                         onBlur={() =>
//                           setFieldTouched("milestone_start_date", true)
//                         }
//                       />
//                       <ErrorMessage
//                         name="milestone_start_date"
//                         component="div"
//                         className="error-message text-red-500 my-1"
//                       />
//                     </div>
//                   </Col>
//                   <Col span={12} className="mt-2">
//                     <div className="form-item">
//                       <label className="font-semibold mb-2">End Date</label>
//                       <DatePicker
//                         className="w-full"
//                         format="DD-MM-YYYY"
//                         value={values.milestone_end_date}
//                         onChange={(date) =>
//                           setFieldValue("milestone_end_date", date)
//                         }
//                         onBlur={() =>
//                           setFieldTouched("milestone_end_date", true)
//                         }
//                       />
//                       <ErrorMessage
//                         name="milestone_end_date"
//                         component="div"
//                         className="error-message text-red-500 my-1"
//                       />
//                     </div>
//                   </Col>
//                 </Row>
//                 <div className="form-buttons text-right py-2">
//                   <Button type="default" className="mr-2" onClick={onClose}>
//                     Cancel
//                   </Button>
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     loading={isSubmitting}
//                   >
//                     Update
//                   </Button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default EditMilestone;
