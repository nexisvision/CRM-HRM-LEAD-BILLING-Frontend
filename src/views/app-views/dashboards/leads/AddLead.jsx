import React, { useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Switch,
  Upload,
  Card,
} from "antd";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import utils from "utils";
import OrderListData from "assets/data/order-list.data.json";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { GetLeads, LeadsAdd } from "./LeadReducers/LeadSlice";

const { Option } = Select;

const AddLead = ({ onClose }) => {
  const navigate = useNavigate();
  const [details, setDetails] = useState(false);
  const [info, setInfo] = useState(false);
  const [organisation, setorganisation] = useState(false);

  const dispatch = useDispatch();

  const initialValues = {
    leadTitle: "",
    firstName: "",
    lastName: "",
    telephone: "",
    email: "",
    leadValue: "",
    assigned: "",
    status: "",
    notes: "",
    source: "",
    category: "",
    lastContacted: null,
    totalBudget: "",
    targetDate: null,
    contentType: "",
    brandName: "",
    companyName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    website: "",
  };

  const validationSchema = Yup.object({
    leadTitle: Yup.string().required("Lead Title is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last Name is required"),
    telephone: Yup.string()
      .matches(/^\d{10}$/, "telephone number must be exactly 10 digits")
      .nullable(),
    email: Yup.string().email("Please enter a valid email address").nullable(),
    leadValue: Yup.string().nullable(),
    assigned: Yup.string().nullable(),
    status: Yup.string().required("Status is required"),

    // Details section
    notes: Yup.string().when("details", {
      is: true,
      then: Yup.string().required("Notes are required"),
    }),
    source: Yup.string().when("details", {
      is: true,
      then: Yup.string().required("Source is required"),
    }),
    category: Yup.string().when("details", {
      is: true,
      then: Yup.string().required("category is required"),
    }),
    lastContacted: Yup.date().nullable(),

    // Info section
    totalBudget: Yup.string().when("info", {
      is: true,
      then: Yup.string().required("Total Budget is required"),
    }),
    targetDate: Yup.date().nullable(),
    contentType: Yup.string().when("info", {
      is: true,
      then: Yup.string().required("Content type is required"),
    }),
    brandName: Yup.string().when("info", {
      is: true,
      then: Yup.string().required("Brand name is required"),
    }),

    // Organisation section
    companyName: Yup.string().when("organisation", {
      is: true,
      then: Yup.string().required("Company name is required"),
    }),
    street: Yup.string().when("organisation", {
      is: true,
      then: Yup.string().required("Street is required"),
    }),
    city: Yup.string().when("organisation", {
      is: true,
      then: Yup.string().required("City is required"),
    }),
    state: Yup.string().when("organisation", {
      is: true,
      then: Yup.string().required("State is required"),
    }),
    zipCode: Yup.string().when("organisation", {
      is: true,
      then: Yup.string().required("Zip Code is required"),
    }),
    country: Yup.string().when("organisation", {
      is: true,
      then: Yup.string().required("Country is required"),
    }),
    website: Yup.string().when("organisation", {
      is: true,
      then: Yup.string().required("Website is required"),
    }),
  });

  const onSubmit = (values, { resetForm }) => {
    dispatch(LeadsAdd(values))
      .then(() => {
        dispatch(GetLeads()); // Refresh leave data
        message.success("Leads added successfully!");
        resetForm();
        onClose(); // Close modal
      })
      .catch((error) => {
        message.error("Failed to add Leads.");
        console.error("Add API error:", error);
      });
    dispatch(LeadsAdd(values));
    console.log("Submitted values:", values);
    message.success("Project added successfully!");
  };

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
          resetForm,
        }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <h2 className="mb-4 border-b pb-2 font-medium"></h2>

            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold flex">
                    Lead Title <h1 className="text-rose-500">*</h1>
                  </label>
                  <Field
                    name="leadTitle"
                    as={Input}
                    placeholder="Enter Lead Title"
                  />
                  <ErrorMessage
                    name="leadTitle"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold flex">
                    First Name<h1 className="text-rose-500">*</h1>
                  </label>
                  <Field
                    name="firstName"
                    as={Input}
                    placeholder="Enter First Name"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold flex">
                    Last Name<h1 className="text-rose-500">*</h1>
                  </label>
                  <Field
                    name="lastName"
                    as={Input}
                    placeholder="Enter Last Name"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">telephone</label>
                  <Field
                    name="telephone"
                    as={Input}
                    placeholder="Enter telephone"
                  />
                  <ErrorMessage
                    name="telephone"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Email Address</label>
                  <Field
                    name="email"
                    as={Input}
                    placeholder="Enter Email Address"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Lead Value($)</label>
                  <Field
                    name="leadValue"
                    as={Input}
                    placeholder="Enter Lead Value"
                  />
                  <ErrorMessage
                    name="leadValue"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">assigned</label>
                  <Field name="assigned">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select assigned"
                        onChange={(value) => setFieldValue("assigned", value)}
                        value={values.assigned}
                        onBlur={() => setFieldTouched("assigned", true)}
                      >
                        <Option value="faithhamilton">Faith Hamilton</Option>
                        <Option value="stevenmallet">Steven Mallet</Option>
                        <Option value="edwincook">Edwin Cook</Option>
                        <Option value="anniemilton">Annie Milton</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="assigned"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold flex">
                    Status <h1 className="text-rose-500">*</h1>
                  </label>
                  <Field name="status">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Status"
                        onChange={(value) => setFieldValue("status", value)}
                        value={values.status}
                        onBlur={() => setFieldTouched("status", true)}
                      >
                        <Option value="new">New</Option>
                        <Option value="converted">Converted</Option>
                        <Option value="qualified">Qualified</Option>
                        <Option value="proposalsent">Proposal Sent</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Toggle button for Receipt Upload */}

              <Col span={24} className="mt-4 ">
                <div className="flex justify-between items-center">
                  <label className="font-semibold">Details</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={details}
                      onChange={(e) => setDetails(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                {/* Conditionally show Upload field */}
                {details && (
                  <>
                    <Col span={24}>
                      <div className="mt-2">
                        <label className="font-semibold">Notes</label>
                        <ReactQuill
                          value={values.notes}
                          onChange={(value) => setFieldValue("notes", value)}
                          placeholder="Enter Notes"
                          onBlur={() => setFieldTouched("notes", true)}
                          className="mt-2 bg-white rounded-md"
                        />
                        <ErrorMessage
                          name="notes"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="form-item mt-2">
                        <label className="font-semibold">Source</label>
                        <Field name="source">
                          {({ field }) => (
                            <Select
                              {...field}
                              className="w-full"
                              placeholder="Select Source"
                              onChange={(value) =>
                                setFieldValue("source", value)
                              }
                              value={values.source}
                              onBlur={() => setFieldTouched("source", true)}
                            >
                              <Option value="Yahoo">Yahoo</Option>
                              <Option value="googleplaces">
                                Google Places
                              </Option>
                              <Option value="fbads">Facebook Ads</Option>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="source"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="form-item mt-2">
                        <label className="font-semibold">category</label>
                        <Field name="category">
                          {({ field }) => (
                            <Select
                              {...field}
                              className="w-full"
                              placeholder="Select category"
                              onChange={(value) =>
                                setFieldValue("category", value)
                              }
                              value={values.category}
                              onBlur={() => setFieldTouched("category", true)}
                            >
                              <Option value="default">Default</Option>
                              <Option value="appdev">
                                Application Developer
                              </Option>
                              <Option value="graphic">Graphic Design</Option>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="form-item mt-2">
                        <label className="font-semibold">Tags</label>
                        <Field name="tags">
                          {({ field }) => (
                            <Select
                              {...field}
                              className="w-full"
                              placeholder="Select Tags"
                              onChange={(value) => setFieldValue("tags", value)}
                              onBlur={() => setFieldTouched("tags", true)}
                              value={values.tags}
                            >
                              <Option value="high">high</Option>
                              <Option value="joomla">joomla</Option>
                              <Option value="wordpress">Word Press</Option>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="tags"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="form-item  mt-2 border-b pb-3">
                        <label className="font-semibold">
                          Last lastContacted
                        </label>
                        <DatePicker
                          className="w-full"
                          format="DD-MM-YYYY"
                          value={values.lastContacted}
                          onChange={(date) =>
                            setFieldValue("lastContacted", date)
                          }
                          onBlur={() => setFieldTouched("lastContacted", true)}
                        />
                        <ErrorMessage
                          name="lastContacted"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                  </>
                )}
              </Col>

              <Col span={24} className="mt-4 ">
                <div className="flex justify-between items-center">
                  <label className="font-semibold">More Information</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={info}
                      onChange={(e) => setInfo(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                {/* Conditionally show Upload field */}
                {info && (
                  <>
                    <div className="mt-2">
                      <Col span={24}>
                        <Card className="w-full border-l-4 border-l-cyan-300 rounded-sm ">
                          <div>
                            <div className="flex gap-2">
                              <ExclamationCircleOutlined className="text-xl text-cyan-300" />
                              <h1 className="text-xl text-cyan-300">
                                Demo Info
                              </h1>
                            </div>
                            <div>
                              <p>
                                These are custom fields. You can change them or
                                create your own.
                              </p>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">Total Budget</label>
                          <Field
                            name="totalBudget"
                            as={Input}
                            placeholder="Enter Total Budget"
                          />
                          <ErrorMessage
                            name="totalBudget"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24}>
                        <div className="form-item mt-2">
                          <label className="font-semibold">Target Date</label>
                          <DatePicker
                            className="w-full"
                            format="DD-MM-YYYY"
                            value={values.targetDate}
                            onChange={(date) =>
                              setFieldValue("targetDate", date)
                            }
                            onBlur={() => setFieldTouched("targetDate", true)}
                          />
                          <ErrorMessage
                            name="targetDate"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div>
                      <Col span={24} className="mt-2">
                        <div className="form-item mt-2">
                          <label className="font-semibold">Content Type</label>
                          <Field name="contentType">
                            {({ field }) => (
                              <Select
                                {...field}
                                className="w-full"
                                placeholder="Select Content Type"
                                onChange={(value) =>
                                  setFieldValue("contentType", value)
                                }
                                value={values.contentType}
                                onBlur={() =>
                                  setFieldTouched("contentType", true)
                                }
                              >
                                <Option value="Article">Article</Option>
                                <Option value="blog">Blog Post</Option>
                                <Option value="script">Script</Option>
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage
                            name="category"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24} className="mt-2 border-b pb-3">
                        <div className="form-item">
                          <label className="font-semibold">Brand Name</label>
                          <Field
                            name="brandName"
                            as={Input}
                            placeholder="Enter Brand Name"
                            className="w-full"
                          />
                          <ErrorMessage
                            name="brandName"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                  </>
                )}
              </Col>

              <Col span={24} className="mt-4 ">
                <div className="flex justify-between items-center">
                  <label className="font-semibold">
                    Address & Organisation Details
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={organisation}
                      onChange={(e) => setorganisation(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                {/* Conditionally show Upload field */}
                {organisation && (
                  <>
                    <div className="mt-2">
                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">Company Name</label>
                          <Field
                            name="companyName"
                            as={Input}
                            placeholder="Enter Company Name"
                            className="w-full "
                          />
                          <ErrorMessage
                            name="companyName"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">Street</label>
                          <Field
                            name="street"
                            as={Input}
                            placeholder="Enter Street"
                            className="w-full"
                          />
                          <ErrorMessage
                            name="street"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">City</label>
                          <Field
                            name="city"
                            as={Input}
                            placeholder="Enter City Name"
                            className="w-full"
                          />
                          <ErrorMessage
                            name="city"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24} className="mt-2">
                        <div className="form-item mt-2">
                          <label className="font-semibold">State</label>
                          <Field
                            name="state"
                            as={Input}
                            placeholder="Enter State Name"
                            className="w-full"
                          />
                          <ErrorMessage
                            name="state"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div>
                      <Col span={24} className="mt-2">
                        <div className="form-item mt-2">
                          <label className="font-semibold">Zip Code</label>
                          <Field
                            name="zipCode"
                            as={Input}
                            placeholder="Enter zip code"
                            className="w-full"
                          />
                          <ErrorMessage
                            name="zipCode"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>

                    <div>
                      <Col span={24} className="mt-2">
                        <div className="form-item  mt-2">
                          <label className="font-semibold">Country</label>
                          <Field name="contentType">
                            {({ field }) => (
                              <Select
                                {...field}
                                className="w-full"
                                placeholder="Select Country"
                                onChange={(value) =>
                                  setFieldValue("country", value)
                                }
                                value={values.country}
                                onBlur={() => setFieldTouched("country", true)}
                              >
                                <Option value="India">India</Option>
                                <Option value="arubs">Aruba</Option>
                                <Option value="bhutan">Bhutan</Option>
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage
                            name="country"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                    <div className="mt-2">
                      <Col span={24} className="mt-2 border-b pb-3">
                        <div className="form-item">
                          <label className="font-semibold">Website</label>
                          <Field
                            name="website"
                            as={Input}
                            placeholder="Enter Website"
                            className="w-full"
                            onBlur={() => setFieldTouched("website", true)}
                          />
                          <ErrorMessage
                            name="Website"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </div>
                  </>
                )}
              </Col>

              <Col className="mt-2">
                <h5 className="flex">
                  <h1 className="text-rose-500">*</h1> Required
                </h5>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-4">
              <Button
                type="default"
                htmlType="submit"
                className="mr-2"
                onClick={() => navigate("/app/apps/project/lead")}
              >
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
  );
};

export default AddLead;
