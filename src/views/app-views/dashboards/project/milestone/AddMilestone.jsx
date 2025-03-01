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
import { PlusOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddMins, Getmins } from "./minestoneReducer/minestoneSlice";
import { AddLable, GetLable } from "./LableReducer/LableSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
const { Option } = Select;
const AddMilestone = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [tags, setTags] = useState([]);

  const user = useSelector((state) => state.user.loggedInUser.username);

  const { currencies } = useSelector((state) => state.currencies);
const curr = currencies?.data || [];

// const curren = curr?.filter((item) => item.created_by === user);
  const { id } = useParams();
  // console.log("Milestone ID:", id);
  useEffect(() => {
    if (id) {
      dispatch(getcurren());
    } else {
      // message.error("Milestone ID is not defined.");
    }
  }, [dispatch, id]);
  const Tagsdetail = useSelector((state) => state.Lable);
  const AllLoggeddtaa = useSelector((state) => state.user);
  const AllTags = Tagsdetail?.Lable?.data;
  const onSubmit = (values, { resetForm }) => {
    // Convert the values before sending
    const formattedValues = {
      ...values,
      milestone_cost: Number(values.milestone_cost),
      add_cost_to_project_budget: values.add_cost_to_project_budget // Will be "yes" or "no"
    };

    // Check if the selected tag is new or existing
    const selectedTag = tags.find(
      (tag) => tag.name === formattedValues.milestone_status
    );

    if (!selectedTag) {
      // Call AddLable API only if the selected tag is new
      const lid = AllLoggeddtaa.loggedInUser.id;
      const newTagPayload = { name: formattedValues.milestone_status.trim() };
      dispatch(AddLable({ id, payload: newTagPayload }))
        .then(() => {
          dispatch(AddMins({ id, values: formattedValues }))
            .then(() => {
              dispatch(Getmins(id));
              resetForm();
              onClose();
            })
            .catch((error) => {
              console.error("Add Milestone API error:", error);
            });
        })
        .catch((error) => {
          message.error("Failed to add tag.");
          console.error("Add Tag API error:", error);
        });
    } else {
      // If tag exists, directly add the milestone
      dispatch(AddMins({ id, values: formattedValues }))
        .then(() => {
          dispatch(Getmins(id));
          resetForm();
          onClose();
        })
        .catch((error) => {
          console.error("Add Milestone API error:", error);
        });
    }
  };
  const initialValues = {
    milestone_title: "",
    milestone_cost: "",
    milestone_status: "",
    add_cost_to_project_budget: "no", // Set default value
    milestone_summary: "",
    milestone_start_date: null,
    milestone_end_date: null,
  };
  const fetchTags = async () => {
    try {
      // const lid = AllLoggeddtaa.loggedInUser.id;
      const response = await dispatch(GetLable(id));
      if (response.payload && response.payload.data) {
        const uniqueTags = response.payload.data
          .filter((label) => label && label.name) // Filter out invalid labels
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t.name === label.name)
          ); // Remove duplicates
        setTags(uniqueTags);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      message.error("Failed to load tags");
    }
  };
  const handleAddNewTag = async () => {
    if (!newTag.trim()) {
      message.error("Please enter a tag name");
      return;
    }
    try {
      // const lid = AllLoggeddtaa.loggedInUser.id;
      const payload = {
        name: newTag.trim(),
        labelType: "status",
      };
      await dispatch(AddLable({ id, payload }));
      message.success("Status added successfully");
      setNewTag("");
      setIsTagModalVisible(false);
      // Fetch updated tags
      await fetchTags();
    } catch (error) {
      console.error("Failed to add Status:", error);
      message.error("Failed to add Status");
    }
  };
  const handleAddNewStatus = () => {
    if (newStatus.trim() === "") {
      message.error("Status cannot be empty.");
      return;
    }
    const newStatusObj = { id: Date.now(), name: newStatus.trim() }; // Create a new status object
    setStatuses((prevStatuses) => [...prevStatuses, newStatusObj]); // Update statuses
    setNewStatus(""); // Clear input
    setIsStatusModalVisible(false); // Close modal
    message.success("New status added successfully!");
  };
  return (
    <div>
      <div className="add-expenses-form">
        <hr style={{ marginBottom: "10px", border: "1px solid #E8E8E8" }} />
        <div className="p-2">
          <Formik
            initialValues={initialValues} 
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, setFieldTouched, resetForm }) => (
              <Form className="formik-form">
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="form-item">
                      <label className="font-semibold mb-2">
                        Milestone Title <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="milestone_title"
                        as={Input}
                        placeholder="Enter Milestone Title"
                         className="w-full mt-1"
                      />
                      <ErrorMessage
                        name="milestone_title"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="">
                    <div className="form-item">
                      <label className="font-semibold mb-2">Currency <span className="text-red-500">*</span></label>
                      <div className="flex gap-2">
                        <Field name="currency">
                          {({ field, form }) => (
                            <Select
                              {...field}
                              className="w-full mt-1"
                              placeholder="Select Currency"
                              onChange={(value) => {
                                const selectedCurrency = curr.find(
                                  (c) => c.id === value
                                );
                                form.setFieldValue(
                                  "currency",
                                  selectedCurrency?.currencyCode || ""
                                );
                              }}
                            >
                              {curr.map((currency) => (
                                <Option key={currency.id} value={currency.id}>
                                  {currency.currencyCode}
                                  ({currency.currencyIcon})
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Field>
                      </div>
                      <ErrorMessage
                        name="currency"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="form-item mt-4">
                      <label className="font-semibold mb-2">
                        Milestone Cost <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="milestone_cost"
                        as={Input}
                        placeholder="Enter Milestone Cost"
                        className="w-full mt-1"
                      />
                      <ErrorMessage
                        name="milestone_cost"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold mb-2">
                        Add Cost To Project Budget <span className="text-red-500">*</span>
                      </label>
                      <Field name="add_cost_to_project_budget">
                        {({ field, form }) => (
                          <Select
                            {...field}
                            value={field.value}
                            onChange={(value) => form.setFieldValue('add_cost_to_project_budget', value)}
                            onBlur={() => form.setFieldTouched('add_cost_to_project_budget', true)}
                            className="w-full mt-1"
                            placeholder="Select Option"
                          >
                            <Option value="no">No</Option>
                            <Option value="yes">Yes</Option>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage
                        name="add_cost_to_project_budget"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  
                  <Col span={12} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold mb-2">Start Date <span className="text-red-500">*</span></label>
                      <DatePicker
                        className="w-full mt-1"
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
                      <label className="font-semibold mb-2">End Date <span className="text-red-500">*</span></label>
                      <DatePicker
                        className="w-full mt-1"
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
                  <Col span={24} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold">Status <span className="text-red-500">*</span></label>
                      <Select
                        style={{ width: "100%" }}
                        className="mt-1"
                        placeholder="Select or add new status"
                        value={values.milestone_status}
                        onChange={(value) => setFieldValue("milestone_status", value)}
                        dropdownRender={(menu) => (
                          <div>
                            {menu}
                            <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                              <Button
                                type="link"
                                icon={<PlusOutlined />}
                                onClick={() => setIsStatusModalVisible(true)}
                              >
                                Add New Status
                              </Button>
                            </div>
                          </div>
                        )}
                      >
                        {statuses.map((status) => (
                          <Option key={status.id} value={status.name}>
                            {status.name}
                          </Option>
                        ))}
                      </Select>
                      <ErrorMessage
                        name="milestone_status"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={24} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold">Milestone Summary <span className="text-red-500">*</span></label>
                      <ReactQuill
                        className="mt-1"
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
                </Row>
                <div className="form-buttons text-right mt-4">
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
          <Modal
            title="Add New Status"
            open={isStatusModalVisible}
            onCancel={() => setIsStatusModalVisible(false)}
            onOk={handleAddNewStatus}
          >
            <Input
              placeholder="Enter new status name"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};
export default AddMilestone;








// --=-=\-\==\-\=-=\-=\-=\=\-\=-=\-=\-=\=\-=\\==\=\-\=-=\=\\=\-=-=\-
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
//   Modal,
// } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { PlusOutlined } from "@ant-design/icons";

// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { AddMins, Getmins } from "./minestoneReducer/minestoneSlice";
// import { AddLable, GetLable } from "./LableReducer/LableSlice";
// import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";

// const { Option } = Select;

// const AddMilestone = ({ onClose }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isTagModalVisible, setIsTagModalVisible] = useState(false);
//   const [newTag, setNewTag] = useState("");
//   const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
//   const [newStatus, setNewStatus] = useState("");
//   const [statuses, setStatuses] = useState([]);

//   const [tags, setTags] = useState([]);
//   const { currencies } = useSelector((state) => state.currencies);

//   const { id } = useParams();
//   console.log("Milestone ID:", id);

//   useEffect(() => {
//     if (id) {
//       dispatch(getcurren());
//     } else {
//       message.error("Milestone ID is not defined.");
//     }
//   }, [dispatch, id]);

//   const Tagsdetail = useSelector((state) => state.Lable);

//   const AllLoggeddtaa = useSelector((state) => state.user);
//   const AllTags = Tagsdetail?.Lable?.data;

//   const onSubmit = (values, { resetForm }) => {
//     // Check if the selected tag is new or existing
//     const selectedTag = tags.find(
//       (tag) => tag.name === values.milestone_status
//     );

//     if (!selectedTag) {
//       // Call AddLable API only if the selected tag is new
//       const lid = AllLoggeddtaa.loggedInUser.id;
//       const newTagPayload = { name: values.milestone_status.trim() };

//       dispatch(AddLable({ id, payload: newTagPayload }))
//         .then(() => {
//           dispatch(AddMins({ id, values }))
//             .then(() => {
//               dispatch(Getmins(id));
//               message.success("Milestone added successfully!");
//               resetForm();
//               onClose();
//             })
//             .catch((error) => {
//               message.error("Failed to add Milestone.");
//               console.error("Add Milestone API error:", error);
//             });
//         })
//         .catch((error) => {
//           message.error("Failed to add tag.");
//           console.error("Add Tag API error:", error);
//         });
//     } else {
//       // If tag exists, directly add the milestone
//       dispatch(AddMins({ id, values }))
//         .then(() => {
//           dispatch(Getmins(id));
//           message.success("Milestone added successfully!");
//           resetForm();
//           onClose();
//         })
//         .catch((error) => {
//           message.error("Failed to add Milestone.");
//           console.error("Add Milestone API error:", error);
//         });
//     }
//   };

//   const initialValues = {
//     milestone_title: "",
//     milestone_cost: "",
//     milestone_status: "",
//     add_cost_to_project_budget: "",
//     milestone_summary: "",
//     milestone_start_date: null,
//     milestone_end_date: null,
//   };

//   const fetchTags = async () => {
//     try {
//       const lid = AllLoggeddtaa.loggedInUser.id;
//       const response = await dispatch(GetLable(id));

//       if (response.payload && response.payload.data) {
//         const uniqueTags = response.payload.data
//           .filter((label) => label && label.name) // Filter out invalid labels
//           .map((label) => ({
//             id: label.id,
//             name: label.name.trim(),
//           }))
//           .filter(
//             (label, index, self) =>
//               index === self.findIndex((t) => t.name === label.name)
//           ); // Remove duplicates

//         setTags(uniqueTags);
//       }
//     } catch (error) {
//       console.error("Failed to fetch tags:", error);
//       message.error("Failed to load tags");
//     }
//   };

//   const handleAddNewTag = async () => {
//     if (!newTag.trim()) {
//       message.error("Please enter a tag name");
//       return;
//     }

//     try {
//       const lid = AllLoggeddtaa.loggedInUser.id;
//       const payload = {
//         name: newTag.trim(),
//         labelType: "status",
//       };

//       await dispatch(AddLable({ id, payload }));
//       message.success("Status added successfully");
//       setNewTag("");
//       setIsTagModalVisible(false);

//       // Fetch updated tags
//       await fetchTags();
//     } catch (error) {
//       console.error("Failed to add Status:", error);
//       message.error("Failed to add Status");
//     }
//   };

//   const handleAddNewStatus = () => {
//     if (newStatus.trim() === "") {
//       message.error("Status cannot be empty.");
//       return;
//     }
//     const newStatusObj = { id: Date.now(), name: newStatus.trim() }; // Create a new status object
//     setStatuses((prevStatuses) => [...prevStatuses, newStatusObj]); // Update statuses
//     setNewStatus(""); // Clear input
//     setIsStatusModalVisible(false); // Close modal
//     message.success("New status added successfully!");
//   };

//   return (
//     <div>
//       <div className="add-expenses-form">
//         <hr style={{ marginBottom: "10px", border: "1px solid #E8E8E8" }} />

//         <div className="p-2">
//           <Formik
//             initialValues={initialValues} 
//             onSubmit={onSubmit}
//           >
//             {({ values, setFieldValue, setFieldTouched, resetForm }) => (
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
//                          className="w-full mt-2"
//                       />
//                       <ErrorMessage
//                         name="milestone_title"
//                         component="div"
//                         className="error-message text-red-500 my-1"
//                       />
//                     </div>
//                   </Col>

//                   <Col span={12} className="">
//                     <div className="form-item">
//                       <label className="font-semibold mb-2">Currency</label>
//                       <div className="flex gap-2">
//                         <Field name="currency">
//                           {({ field, form }) => (
//                             <Select
//                               {...field}
//                               className="w-full mt-2"
//                               placeholder="Select Currency"
//                               onChange={(value) => {
//                                 const selectedCurrency = currencies.find(
//                                   (c) => c.id === value
//                                 );
//                                 form.setFieldValue(
//                                   "currency",
//                                   selectedCurrency?.currencyCode || ""
//                                 );
//                               }}
//                             >
//                               {currencies?.map((currency) => (
//                                 <Option key={currency.id} value={currency.id}>
//                                   {currency.currencyCode}
//                                 </Option>
//                               ))}
//                             </Select>
//                           )}
//                         </Field>
//                       </div>
//                       <ErrorMessage
//                         name="currency"
//                         component="div"
//                         className="error-message text-red-500 my-1"
//                       />
//                     </div>
//                   </Col>
//                   <Col span={12}>
//                     <div className="form-item mt-2">
//                       <label className="font-semibold mb-2">
//                         Milestone Cost
//                       </label>
//                       <Field
//                         name="milestone_cost"
//                         as={Input}
//                         placeholder="Enter Milestone Cost"
//                         className="w-full mt-2"
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
//                         className="w-full mt-2"
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
//                   <Col span={24}>
//                     <div className="form-item">
//                       <label className="font-semibold">Status</label>
//                       <Select
//                         style={{ width: "100%" }}
//                         placeholder="Select or add new status"
//                         value={values.milestone_status}
//                         onChange={(value) => setFieldValue("milestone_status", value)}
//                         dropdownRender={(menu) => (
//                           <div>
//                             {menu}
//                             <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
//                               <Button
//                                 type="link"
//                                 // icon={<PlusOutlined />}
//                                 onClick={() => setIsStatusModalVisible(true)}
//                                 block
//                               >
//                                 Add New Status
//                               </Button>
//                             </div>
//                           </div>
//                         )}
//                       >
//                         {statuses.map((status) => (
//                           <Option key={status.id} value={status.name}>
//                             {status.name}
//                           </Option>
//                         ))}
//                       </Select>
//                       <ErrorMessage
//                         name="milestone_status"
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
//                 </Row>
//                 <div className="form-buttons text-right py-2">
//                   <Button type="default" className="mr-2" onClick={onClose}>
//                     Cancel
//                   </Button>
//                   <Button type="primary" htmlType="submit">
//                     Create
//                   </Button>
//                 </div>
//               </Form>
//             )}
//           </Formik>

//           <Modal
//             title="Add New Status"
//             open={isStatusModalVisible}
//             onCancel={() => setIsStatusModalVisible(false)}
//             onOk={handleAddNewStatus}
//           >
//             <Input
//               placeholder="Enter new status name"
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//             />
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddMilestone;















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
//   Modal,
// } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { AddMins, Getmins } from "./minestoneReducer/minestoneSlice";
// import { AddLable, GetLable } from "./LableReducer/LableSlice";
// import { getallcurrencies } from "../../../setting/currencies/currenciesreducer/currenciesSlice";

// const { Option } = Select;

// const AddMilestone = ({ onClose }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isTagModalVisible, setIsTagModalVisible] = useState(false);
//   const [newTag, setNewTag] = useState("");

//   const [tags, setTags] = useState([]);
//   const { currencies } = useSelector((state) => state.currencies);

//   useEffect(() => {
//     dispatch(getallcurrencies());
//   }, [dispatch]);

//   const Tagsdetail = useSelector((state) => state.Lable);

//   const AllLoggeddtaa = useSelector((state) => state.user);
//   const AllTags = Tagsdetail?.Lable?.data;

//   // const onSubmit = (values, { resetForm }) => {
//   //   dispatch(AddLable({ id, values }))
//   //     .then(() => {
//   //       dispatch(Getmins(id));
//   //       message.success("Milestone added successfully!");
//   //       resetForm();
//   //       onClose();
//   //     })
//   //     .catch((error) => {
//   //       message.error("Failed to add Leads.");
//   //       console.error("Add API error:", error);
//   //     });
//   // };

//   const onSubmit = (values, { resetForm }) => {
//     // Check if the selected tag is new or existing
//     const selectedTag = tags.find(
//       (tag) => tag.name === values.milestone_status
//     );

//     if (!selectedTag) {
//       // Call AddLable API only if the selected tag is new
//       const lid = AllLoggeddtaa.loggedInUser.id;
//       const newTagPayload = { name: values.milestone_status.trim() };

//       dispatch(AddLable({ id, payload: newTagPayload }))
//         .then(() => {
//           dispatch(AddMins({ id, values }))
//             .then(() => {
//               dispatch(Getmins(id));
//               message.success("Milestone added successfully!");
//               resetForm();
//               onClose();
//             })
//             .catch((error) => {
//               message.error("Failed to add Milestone.");
//               console.error("Add Milestone API error:", error);
//             });
//         })
//         .catch((error) => {
//           message.error("Failed to add tag.");
//           console.error("Add Tag API error:", error);
//         });
//     } else {
//       // If tag exists, directly add the milestone
//       dispatch(AddMins({ id, values }))
//         .then(() => {
//           dispatch(Getmins(id));
//           message.success("Milestone added successfully!");
//           resetForm();
//           onClose();
//         })
//         .catch((error) => {
//           message.error("Failed to add Milestone.");
//           console.error("Add Milestone API error:", error);
//         });
//     }
//   };
//   const { id } = useParams();

//   const initialValues = {
//     milestone_title: "",
//     milestone_cost: "",
//     milestone_status: "",
//     add_cost_to_project_budget: "",
//     milestone_summary: "",
//     milestone_start_date: null,
//     milestone_end_date: null,
//   };

//   const fetchTags = async () => {
//     try {
//       const lid = AllLoggeddtaa.loggedInUser.id;
//       const response = await dispatch(GetLable(lid));

//       if (response.payload && response.payload.data) {
//         const uniqueTags = response.payload.data
//           .filter((label) => label && label.name) // Filter out invalid labels
//           .map((label) => ({
//             id: label.id,
//             name: label.name.trim(),
//           }))
//           .filter(
//             (label, index, self) =>
//               index === self.findIndex((t) => t.name === label.name)
//           ); // Remove duplicates

//         setTags(uniqueTags);
//       }
//     } catch (error) {
//       console.error("Failed to fetch tags:", error);
//       message.error("Failed to load tags");
//     }
//   };

//   const handleAddNewTag = async () => {
//     if (!newTag.trim()) {
//       message.error("Please enter a tag name");
//       return;
//     }

//     try {
//       const lid = AllLoggeddtaa.loggedInUser.id;
//       const payload = {
//         name: newTag.trim(),
//       };

//       await dispatch(AddLable({ id, payload }));
//       message.success("Tag added successfully");
//       setNewTag("");
//       setIsTagModalVisible(false);

//       // Fetch updated tags
//       await fetchTags();
//     } catch (error) {
//       console.error("Failed to add tag:", error);
//       message.error("Failed to add tag");
//     }
//   };

//   return (
//     <div>
//       <div className="ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
//         <h2 className="border-b pb-[30px] font-medium">Add Milestone</h2>
//         <div className="p-2">
//           <Formik
//             initialValues={initialValues}
//             // validationSchema={validationSchema}
//             onSubmit={onSubmit}
//           >
//             {({ values, setFieldValue, setFieldTouched, resetForm }) => (
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

//                   <Col span={12} className="mt-4">
//                     <div className="form-item">
//                       <label className="font-semibold mb-2">Currency</label>
//                       <div className="flex gap-2">
//                         <Field name="currency">
//                           {({ field, form }) => (
//                             <Select
//                               {...field}
//                               className="w-full mt-2"
//                               placeholder="Select Currency"
//                               onChange={(value) => {
//                                 const selectedCurrency = currencies.find(
//                                   (c) => c.id === value
//                                 );
//                                 form.setFieldValue(
//                                   "currency",
//                                   selectedCurrency?.currencyCode || ""
//                                 );
//                               }}
//                             >
//                               {currencies?.map((currency) => (
//                                 <Option key={currency.id} value={currency.id}>
//                                   {currency.currencyCode}
//                                 </Option>
//                               ))}
//                             </Select>
//                           )}
//                         </Field>
//                       </div>
//                       <ErrorMessage
//                         name="currency"
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

//                   <Col span={24} className="mt-4">
//                     <div className="form-item">
//                       <label className="font-semibold">status</label>
//                       <div className="flex gap-2">
//                         <Field name="milestone_status">
//                           {({ field, form }) => (
//                             <Select
//                               {...field}
//                               className="w-full"
//                               placeholder="Select or add new tag"
//                               onChange={(value) =>
//                                 form.setFieldValue("milestone_status", value)
//                               }
//                               onBlur={() =>
//                                 form.setFieldTouched("milestone_status", true)
//                               }
//                               dropdownRender={(menu) => (
//                                 <div>
//                                   {menu}
//                                   <div
//                                     style={{
//                                       padding: "8px",
//                                       borderTop: "1px solid #e8e8e8",
//                                     }}
//                                   >
//                                     <Button
//                                       type="link"
//                                       // icon={<PlusOutlined />}
//                                       onClick={() => setIsTagModalVisible(true)}
//                                       block
//                                     >
//                                       Add New Tag
//                                     </Button>
//                                   </div>
//                                 </div>
//                               )}
//                             >
//                               {tags &&
//                                 tags.map((tag) => (
//                                   <Option key={tag.id} value={tag.name}>
//                                     {tag.name}
//                                   </Option>
//                                 ))}
//                             </Select>
//                           )}
//                         </Field>
//                       </div>
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
//                   <Button type="primary" htmlType="submit">
//                     Create
//                   </Button>
//                 </div>
//               </Form>
//             )}
//           </Formik>

//           <Modal
//             title="Add New Tag"
//             open={isTagModalVisible}
//             onCancel={() => setIsTagModalVisible(false)}
//             onOk={handleAddNewTag}
//             okText="Add Tag"
//           >
//             <Input
//               placeholder="Enter new tag name"
//               value={newTag}
//               onChange={(e) => setNewTag(e.target.value)}
//             />
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddMilestone;

