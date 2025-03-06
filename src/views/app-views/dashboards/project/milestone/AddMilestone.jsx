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
import AddCurrencies from '../../../setting/currencies/AddCurrencies';
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

  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

  const user = useSelector((state) => state.user.loggedInUser.username);

  const { currencies } = useSelector((state) => state.currencies);
  const curr = currencies?.data || [];

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  // const curren = curr?.filter((item) => item.created_by === user);
  const { id } = useParams();
  // console.log("Milestone ID:", id);

  const getInitialCurrency = () => {
    if (fnddatass?.length > 0) {
      const usdCurrency = fnddatass.find(c => c.currencyCode === 'USD');
      return usdCurrency?.id || fnddatass[0]?.id;
    }
    return '';
  };


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
    currency: getInitialCurrency(),
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
  const fetchLables = async (lableType, setter) => {
    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const response = await dispatch(GetLable(id));
      if (response.payload && response.payload.data) {
        const filteredLables = response.payload.data
          .filter((lable) => lable.lableType === lableType)
          .map((lable) => ({ id: lable.id, name: lable.name.trim() }));
        setter(filteredLables);
      }
    } catch (error) {
      console.error(`Failed to fetch ${lableType}:`, error);
      message.error(`Failed to load ${lableType}`);
    }
  };

  useEffect(() => {
    fetchLables("status", setStatuses);
  }, []);

  const handleAddNewLable = async (lableType, newValue, setter, modalSetter, setFieldValue) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
      const payload = {
        name: newValue.trim(),
        lableType,
      };

      const response = await dispatch(AddLable({ id, payload }));

      if (response.payload && response.payload.success) {
        message.success(`${lableType} added successfully.`);

        // Refresh the labels immediately after adding
        const labelsResponse = await dispatch(GetLable(id));
        if (labelsResponse.payload && labelsResponse.payload.data) {
          const filteredLables = labelsResponse.payload.data
            .filter((lable) => lable.lableType === lableType)
            .map((lable) => ({ id: lable.id, name: lable.name.trim() }));

          // Update the appropriate state based on label type
          switch (lableType) {
            case "status":
              setStatuses(filteredLables);
              if (setFieldValue) setFieldValue("milestone_status", newValue.trim());
              break;
          }
        }

        // Reset input and close modal
        setter("");
        modalSetter(false);
      } else {
        throw new Error('Failed to add label');
      }
    } catch (error) {
      console.error(`Failed to add ${lableType}:`, error);
      message.error(`Failed to add ${lableType}. Please try again.`);
    }
  };

  return (
    <div>
      <div className="add-expenses-form">

        <div className="p-2">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, setFieldTouched, resetForm }) => (
              <>
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
                    <Col span={12}>
                      <div className="form-group">
                        <label className="text-gray-600 mb-2 font-semibold block">Milestone Cost & Currency <span className="text-red-500">*</span></label>
                        <div className="flex gap-0">
                          <Field name="currency">
                            {({ field }) => (
                              <Select
                                {...field}
                                className="currency-select"
                                style={{
                                  width: '60px',
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0,
                                  borderRight: 0,
                                  backgroundColor: '#f8fafc',
                                }}
                                placeholder={<span className="text-gray-400">$</span>}
                                onChange={(value) => {
                                  if (value === 'add_new') {
                                    setIsAddCurrencyModalVisible(true);
                                  } else {
                                    setFieldValue("currency", value);
                                  }
                                }}
                                value={values.currency}
                                dropdownStyle={{ minWidth: '180px' }}
                                suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
                                loading={!fnddatass}
                                dropdownRender={menu => (
                                  <div>
                                    <div
                                      className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
                                      onClick={() => setIsAddCurrencyModalVisible(true)}
                                    >
                                      <PlusOutlined className="mr-2" />
                                      <span className="text-sm">Add New</span>
                                    </div>
                                    {menu}
                                  </div>
                                )}
                              >
                                {fnddatass?.map((currency) => (
                                  <Option key={currency.id} value={currency.id}>
                                    <div className="flex items-center w-full px-1">
                                      <span className="text-base min-w-[24px]">{currency.currencyIcon}</span>
                                      <span className="text-gray-600 text-sm ml-3">{currency.currencyName}</span>
                                      <span className="text-gray-400 text-xs ml-auto">{currency.currencyCode}</span>
                                    </div>
                                  </Option>
                                ))}
                              </Select>
                            )}
                          </Field>
                          <Field name="milestone_cost">
                            {({ field, form }) => (
                              <Input
                                {...field}
                                className="price-input"
                                style={{
                                  borderTopLeftRadius: 0,
                                  borderBottomLeftRadius: 0,
                                  borderLeft: '1px solid #d9d9d9',
                                  width: 'calc(100% - 100px)'
                                }}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                    form.setFieldValue('milestone_cost', value);
                                  }
                                }}
                                onKeyPress={(e) => {
                                  const charCode = e.which ? e.which : e.keyCode;
                                  if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                                    e.preventDefault();
                                  }
                                  if (charCode === 46 && field.value.includes('.')) {
                                    e.preventDefault();
                                  }
                                }}
                                prefix={
                                  values.currency && (
                                    <span className="text-gray-600 font-medium mr-1">
                                      {fnddatass?.find(c => c.id === values.currency)?.currencyIcon}
                                    </span>
                                  )
                                }
                              />
                            )}
                          </Field>
                        </div>
                        <ErrorMessage name="milestone_cost" component="div" className="text-red-500 mt-1 text-sm" />
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
                          onChange={(date) => {
                            setFieldValue("milestone_start_date", date);
                            // If end date is before new start date, clear it
                            if (values.milestone_end_date && date && values.milestone_end_date.isBefore(date)) {
                              setFieldValue("milestone_end_date", null);
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
                        <label className="font-semibold mb-2">End Date <span className="text-red-500">*</span></label>
                        <DatePicker
                          className="w-full mt-1"
                          format="DD-MM-YYYY"
                          value={values.milestone_end_date}
                          disabledDate={(current) => {
                            // Disable dates before start date
                            return values.milestone_start_date ? current && current < values.milestone_start_date.startOf('day') : false;
                          }}
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

                <Modal
                  title="Add New Status"
                  open={isStatusModalVisible}
                  onCancel={() => setIsStatusModalVisible(false)}
                  onOk={() => handleAddNewLable("status", newStatus, setNewStatus, setIsStatusModalVisible, setFieldValue)}
                  okText="Add Status"
                >
                  <Input
                    placeholder="Enter new status name"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
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
              </>
            )}
          </Formik>
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
export default AddMilestone;














