import React, { useCallback, useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  message,
  Button,
  Select,
  DatePicker,
  Modal,
} from "antd";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AddMins, Getmins } from "./minestoneReducer/minestoneSlice";
import { AddLable, GetLable } from "./LableReducer/LableSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import AddCurrencies from '../../../setting/currencies/AddCurrencies';
const { Option } = Select;
const AddMilestone = ({ onClose }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statuses, setStatuses] = useState([]);
  const tags = [];
  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

  // Get project data to access its currency
  const allempdata = useSelector((state) => state?.Project) || {};
  const filterdata = allempdata?.Project?.data || [];
  const currentProject = filterdata.find(project => project.id === id);

  const { currencies } = useSelector((state) => state.currencies);
  const curr = currencies?.data || [];

  const getInitialCurrency = () => {
    if (currentProject?.currency) {
      return currentProject.currency;
    }
    return '';
  };

  useEffect(() => {
    if (id) {
      dispatch(getcurren());
    }
  }, [dispatch, id]);

  const initialValues = {
    milestone_title: "",
    milestone_cost: "",
    milestone_status: "",
    add_cost_to_project_budget: "no",
    milestone_summary: "",
    milestone_start_date: null,
    milestone_end_date: null,
    currency: getInitialCurrency(), // Set the currency from project
  };

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
  const fetchLables = useCallback(async (lableType, setter, callback) => {
    try {
      const response = await dispatch(GetLable(id));
      if (response.payload && response.payload.data) {
        const filteredLables = response.payload.data
          .filter((lable) => lable.lableType === lableType)
          .map((lable) => ({ id: lable.id, name: lable.name.trim() }));
        setter(filteredLables);
        if (callback) callback(filteredLables);
      }
    } catch (error) {
      console.error(`Failed to fetch ${lableType}:`, error);
      message.error(`Failed to load ${lableType}`);
    }
  }, [dispatch, id]);

  useEffect(() => {
    fetchLables("status", setStatuses);
  }, [fetchLables]);

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

          switch (lableType) {
            case "status":
              setStatuses(filteredLables);
              if (setFieldValue) setFieldValue("milestone_status", newValue.trim());
              break;
            default:
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
        <h2 className="border-b pb-[-10px] mb-[10px] font-medium"></h2>
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
                          <div className="currency-display" style={{
                            width: '60px',
                            padding: '4px 11px',
                            background: '#f8fafc',
                            border: '1px solid #d9d9d9',
                            borderRight: 0,
                            borderRadius: '2px 0 0 2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span className="text-gray-600 font-medium">
                              {curr?.find(c => c.id === values.currency)?.currencyIcon || '₹'}
                            </span>
                          </div>
                          <Field name="milestone_cost">
                            {({ field, form }) => (
                              <Input
                                {...field}
                                className="price-input"
                                style={{
                                  borderTopLeftRadius: 0,
                                  borderBottomLeftRadius: 0,
                                  borderLeft: '1px solid #d9d9d9',
                                  width: 'calc(100% - 60px)'
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















