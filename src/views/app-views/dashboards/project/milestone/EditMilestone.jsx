import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Input, message, Button, Select, Modal } from "antd";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Editmins, Getmins } from "./minestoneReducer/minestoneSlice";
import { AddLable, GetLable } from "./LableReducer/LableSlice";
import dayjs from "dayjs";
import AddCurrencies from "../../../setting/currencies/AddCurrencies";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";

const { Option } = Select;
const EditMilestone = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const allempdata = useSelector((state) => state.Milestone);
  const milestones = allempdata.Milestone.data;
  const [tags, setTags] = useState([]);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] =
    useState(false);
  const projectData = useSelector((state) => state?.Project) || {};
  const filterdata = projectData?.Project?.data || [];
  const currentProject = filterdata.find((project) => project.id === id);

  const { currencies } = useSelector((state) => state.currencies);
  const curr = currencies?.data || [];

  const getInitialCurrency = useCallback(() => {
    if (currentProject?.currency) {
      return currentProject.currency;
    }
    return "";
  }, [currentProject]);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  const [initialValues, setInitialValues] = useState({
    milestone_title: "",
    milestone_cost: "",
    milestone_status: "",
    currency: getInitialCurrency(), // Set the currency from project
    add_cost_to_project_budget: false,
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
        currency: milestone.currency || getInitialCurrency(), // Use milestone currency or project currency
        add_cost_to_project_budget:
          milestone.add_cost_to_project_budget === true ||
          milestone.add_cost_to_project_budget === "true" ||
          milestone.add_cost_to_project_budget === "yes",
        milestone_summary: milestone.milestone_summary || "",
        milestone_start_date: milestone.milestone_start_date
          ? dayjs(milestone.milestone_start_date).format("YYYY-MM-DD")
          : "",
        milestone_end_date: milestone.milestone_end_date
          ? dayjs(milestone.milestone_end_date).format("YYYY-MM-DD")
          : "",
      });
    } else {
      message.error("Milestone not found!");
    }
  }, [idd, milestones, getInitialCurrency]);

  const fetchTags = useCallback(async () => {
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
  }, [dispatch, id]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

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
        milestone_cost: Number(values.milestone_cost),
        add_cost_to_project_budget: values.add_cost_to_project_budget
          ? "yes"
          : "no",
        milestone_start_date: values.milestone_start_date,
        milestone_end_date: values.milestone_end_date,
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
    } catch (error) {
      message.error("Failed to update milestone: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    milestone_title: Yup.string().required("Please enter milestone title."),
    milestone_cost: Yup.number()
      .typeError("Cost must be a number")
      .required("Please enter milestone cost."),
    milestone_status: Yup.string().required("Please select status."),
    add_cost_to_project_budget: Yup.string().required(
      "Please select add cost to project budget option."
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
        <div className="p-2">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, setFieldTouched, isSubmitting }) => (
              <Form className="formik-form">
                <div className="mb-2 border-b pb-[25px] font-medium"></div>
                <Row gutter={16}>
                  <Col span={12} className="">
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
                  <Col span={12}>
                    <div className="form-group">
                      <label className="text-gray-600 mt-1 font-semibold block">
                        Milestone Cost & Currency{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-0">
                        <div
                          className="currency-display mt-1"
                          style={{
                            width: "60px",
                            padding: "4px 11px",
                            background: "#f8fafc",
                            border: "1px solid #d9d9d9",
                            borderRight: 0,
                            borderRadius: "2px 0 0 2px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span className="text-gray-600 font-medium">
                            {curr?.find((c) => c.id === values.currency)
                              ?.currencyIcon || "₹"}
                          </span>
                        </div>
                        <Field name="milestone_cost">
                          {({ field, form }) => (
                            <Input
                              {...field}
                              className="price-input mt-1"
                              style={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                borderLeft: "1px solid #d9d9d9",
                                width: "calc(100% - 60px)",
                              }}
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value === "" ||
                                  /^\d*\.?\d{0,2}$/.test(value)
                                ) {
                                  form.setFieldValue("milestone_cost", value);
                                }
                              }}
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (
                                  charCode !== 46 &&
                                  charCode > 31 &&
                                  (charCode < 48 || charCode > 57)
                                ) {
                                  e.preventDefault();
                                }
                                if (
                                  charCode === 46 &&
                                  field.value.includes(".")
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          )}
                        </Field>
                      </div>
                      <ErrorMessage
                        name="milestone_cost"
                        component="div"
                        className="text-red-500 mt-1 text-sm"
                      />
                    </div>
                  </Col>
                  <Col span={24} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <Field name="milestone_status">
                          {({ field, form }) => (
                            <Select
                              {...field}
                              className="w-full mt-1"
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
                        Add Cost To Project Budget{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={values.add_cost_to_project_budget ? "yes" : "no"}
                        onChange={(value) =>
                          setFieldValue(
                            "add_cost_to_project_budget",
                            value === "yes"
                          )
                        }
                        onBlur={() =>
                          setFieldTouched("add_cost_to_project_budget", true)
                        }
                        className="w-full mt-1"
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
                  <Col span={12} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full mt-1 p-2 border rounded"
                        value={values.milestone_start_date}
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          setFieldValue("milestone_start_date", selectedDate);

                          if (
                            values.milestone_end_date &&
                            dayjs(values.milestone_end_date).isBefore(
                              selectedDate
                            )
                          ) {
                            setFieldValue("milestone_end_date", "");
                          }
                        }}
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
                      <label className="font-semibold mb-2">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full mt-1 p-2 border rounded"
                        value={values.milestone_end_date}
                        min={values.milestone_start_date}
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          setFieldValue("milestone_end_date", selectedDate);
                        }}
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
                      <label className="font-semibold">
                        Milestone Summary{" "}
                        <span className="text-red-500">*</span>
                      </label>
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

          <Modal
            title="Add New Currency"
            visible={isAddCurrencyModalVisible}
            onCancel={() => setIsAddCurrencyModalVisible(false)}
            footer={null}
            width={600}
          >
            <AddCurrencies
              onClose={() => {
                setIsAddCurrencyModalVisible(false);
                dispatch(getcurren());
              }}
            />
          </Modal>
          <style jsx>{`
            .currency-select .ant-select-selection-item {
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              font-size: 16px !important;
            }

            .currency-select .ant-select-selection-item > div {
              display: flex !important;
              align-items: center !important;
            }

            .currency-select .ant-select-selection-item span:not(:first-child) {
              display: none !important;
            }

            .ant-select-dropdown .ant-select-item {
              padding: 8px 12px !important;
            }

            .ant-select-dropdown .ant-select-item-option-content > div {
              display: flex !important;
              align-items: center !important;
              width: 100% !important;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default EditMilestone;

//   return (
//     <div>
//       <div className="ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
//         {/* <h2 className="border-b  font-medium">Edit Milestone</h2> */}
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
//                     <Col span={24} className="mt-4">
//                                       <div className="form-item">
//                                         <label className="font-semibold">Status</label>
//                                         <div className="flex gap-2">
//                                           <Field name="milestone_status">
//                                             {({ field, form }) => (
//                                               <Select
//                                                 {...field}
//                                                 className="w-full"
//                                                 placeholder="Select or add new tag"
//                                                 onChange={(value) =>
//                                                   form.setFieldValue("milestone_status", value)
//                                                 }
//                                                 onBlur={() =>
//                                                   form.setFieldTouched("milestone_status", true)
//                                                 }
//                                                 dropdownRender={(menu) => (
//                                                   <div>
//                                                     {menu}
//                                                     <div
//                                                       style={{
//                                                         padding: "8px",
//                                                         borderTop: "1px solid #e8e8e8",
//                                                       }}
//                                                     >
//                                                       <Button
//                                                         type="link"
//                                                         // icon={<PlusOutlined />}
//                                                         onClick={() => setIsTagModalVisible(true)}
//                                                         block
//                                                       >
//                                                         Add New Status
//                                                       </Button>
//                                                     </div>
//                                                   </div>
//                                                 )}
//                                               >
//                                                 {tags &&
//                                                   tags.map((tag) => (
//                                                     <Option key={tag.id} value={tag.name}>
//                                                       {tag.name}
//                                                     </Option>
//                                                   ))}
//                                               </Select>
//                                             )}
//                                           </Field>
//                                         </div>
//                                         <ErrorMessage
//                                           name="milestone_status"
//                                           component="div"
//                                           className="error-message text-red-500 my-1"
//                                         />
//                                       </div>
//                                     </Col>
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
//                   <Col span={12} className="mt-4">
//                     <div className="form-item">
//                       <label className="font-semibold mb-2">Start Date <span className="text-red-500">*</span></label>
//                       <input
//                         type="date"
//                         className="w-full mt-1 p-2 border rounded"
//                         value={values.milestone_start_date}
//                         onChange={(e) => {
//                           const selectedDate = e.target.value;
//                           setFieldValue("milestone_start_date", selectedDate);
//
//                           if (values.milestone_end_date && dayjs(values.milestone_end_date).isBefore(selectedDate)) {
//                             setFieldValue("milestone_end_date", "");
//                           }
//                         }}
//                         onBlur={() => setFieldTouched("milestone_start_date", true)}
//                       />
//                       <ErrorMessage
//                         name="milestone_start_date"
//                         component="div"
//                         className="error-message text-red-500 my-1"
//                       />
//                     </div>
//                   </Col>

//                   <Col span={12} className="mt-4">
//                     <div className="form-item">
//                       <label className="font-semibold mb-2">End Date <span className="text-red-500">*</span></label>
//                       <input
//                         type="date"
//                         className="w-full mt-1 p-2 border rounded"
//                         value={values.milestone_end_date}
//                         min={values.milestone_start_date}
//                         onChange={(e) => {
//                           const selectedDate = e.target.value;
//                           setFieldValue("milestone_end_date", selectedDate);
//                         }}
//                         onBlur={() => setFieldTouched("milestone_end_date", true)}
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

//            <Modal
//                       title="Add New Status"
//                       open={isTagModalVisible}
//                       onCancel={() => setIsTagModalVisible(false)}
//                       onOk={handleAddNewTag}
//                       okText="Add Status"
//                     >
//                       <Input
//                         placeholder="Enter new Status"
//                         value={newTag}
//                         onChange={(e) => setNewTag(e.target.value)}
//                       />
//                     </Modal>

//            <Modal
//                       title="Add New Currency"
//                       visible={isAddCurrencyModalVisible}
//                       onCancel={() => setIsAddCurrencyModalVisible(false)}
//                       footer={null}
//                       width={600}
//                     >
//                       <AddCurrencies
//                         onClose={() => {
//                           setIsAddCurrencyModalVisible(false);
//                           dispatch(getcurren());
//                         }}
//                       />
//                     </Modal>
//           <style jsx>{`
//             .currency-select .ant-select-selection-item {
//               display: flex !important;
//               align-items: center !important;
//               justify-content: center !important;
//               font-size: 16px !important;
//             }

//             .currency-select .ant-select-selection-item > div {
//               display: flex !important;
//               align-items: center !important;
//             }

//             .currency-select .ant-select-selection-item span:not(:first-child) {
//               display: none !important;
//             }

//             .ant-select-dropdown .ant-select-item {
//               padding: 8px 12px !important;
//             }

//             .ant-select-dropdown .ant-select-item-option-content > div {
//               display: flex !important;
//               align-items: center !important;
//               width: 100% !important;
//             }
//           `}</style>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default EditMilestone;
