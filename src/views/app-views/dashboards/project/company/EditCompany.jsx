import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Col, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { Editclients, ClientData } from '../../../redux/actions/clients';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  bankname: Yup.string().required("Bank Name is required"),
  ifsc: Yup.string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code")
    .required("IFSC code is required"),
  banklocation: Yup.string().required("Bank Location is required"),
  accountholder: Yup.string().required("Account Holder name is required"),
  accountnumber: Yup.string()
    .matches(/^[0-9]+$/, "Account number must contain only digits")
    .min(9, "Account number must be at least 9 digits")
    .required("Account number is required"),
  gstIn: Yup.string()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number")
    .required("GST number is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  zipcode: Yup.string()
    .matches(/^[0-9]+$/, "Zipcode must contain only digits")
    .length(6, "Zipcode must be exactly 6 digits")
    .required("Zipcode is required"),
  address: Yup.string().required("Address is required"),
  website: Yup.string()
    .url("Must be a valid URL")
    .required("Website is required"),
  accountType: Yup.string()
    .oneOf(['current', 'saving', 'business'], "Please select a valid account type")
    .required("Account type is required"),
  profilePic: Yup.mixed()
});

const handleSubmit = async (values, { setSubmitting }) => {
  try {
    const formData = new FormData();
    
    // Add all form fields to formData
    Object.keys(values).forEach(key => {
      if (values[key] !== undefined && values[key] !== null) {
        if (key === 'profilePic') {
          if (values[key] instanceof File) {
            formData.append(key, values[key]);
          }
        } else {
          formData.append(key, values[key]);
        }
      }
    });

    await dispatch(Editclients({ comnyid, formData })).unwrap();
    message.success("Company updated successfully!");
    await dispatch(ClientData());
    onClose();
  } catch (error) {
    message.error(error.message || "Failed to update company");
  } finally {
    setSubmitting(false);
  }
};

const EditCompany = ({ initialValues, onClose }) => {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ values, setFieldValue, isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          {/* ... existing form fields ... */}

          {/* Update the Account Type field */}
          <Col span={12} className="mt-3">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Account Type <span className="text-red-500">*</span>
              </label>
              <Field name="accountType">
                {({ field, form }) => (
                  <Select
                    {...field}
                    value={field.value || undefined}
                    onChange={(value) => form.setFieldValue('accountType', value)}
                    onBlur={() => form.setFieldTouched('accountType', true)}
                    placeholder="Select Account Type"
                    className="w-full"
                  >
                    <Option value="current">Current</Option>
                    <Option value="saving">Saving</Option>
                    <Option value="business">Business</Option>
                  </Select>
                )}
              </Field>
              <ErrorMessage
                name="accountType"
                component="div"
                className="text-sm text-red-500"
              />
            </div>
          </Col>

          {/* Update the Profile Picture field */}
          <Col span={12} className="mt-3">
            <div className="flex flex-col gap-3">
              <label className="font-semibold text-gray-700">
                Profile Picture
              </label>
              <Field name="profilePic">
                {({ field, form }) => (
                  <Upload
                    accept="image/*"
                    beforeUpload={(file) => {
                      form.setFieldValue('profilePic', file);
                      return false;
                    }}
                    showUploadList={true}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />} className="flex items-center gap-2">
                      Upload Profile Picture
                    </Button>
                  </Upload>
                )}
              </Field>
              <ErrorMessage
                name="profilePic"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </Col>

          {/* Form Buttons */}
          <div className="form-buttons text-right mt-4">
            <Button 
              type="default" 
              className="mr-2" 
              onClick={onClose}
              disabled={isSubmitting}
            >
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
  );
};

export default EditCompany; 