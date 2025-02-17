import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Card, Button, Upload, message, Row, Col } from 'antd';
import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const validationSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
});

const GeneralList = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const initialValues = {
    description: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', imageUrl);
      formData.append('description', values.description);

      // Add your API call here
      // await updateGeneralSettings(formData);
      
      message.success('Settings updated successfully');
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleImageUpload = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.url);
      setLoading(false);
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error(`${info.file.name} upload failed`);
    }
  };

  return (
    <div className="bg-white p-6">
      <Row gutter={[24, 0]} className="mb-6">
        <Col span={24}>
          <h1 className="text-2xl font-medium text-gray-800 border-b pb-4">
            General Settings
          </h1>
        </Col>
      </Row>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Card className="mb-4">
              <Row gutter={[24, 24]}>
                {/* Upload Picture */}
                <Col span={24} >
                <span className="block font-semibold text-lg mb-2 ">
                  Upload Company Logo 
                </span>
                <Field name="image">
                  {({ field }) => (
                    <div>
                      <Upload
                     
                        beforeUpload={(file) => {
                          setFieldValue("image", file); // Set file in Formik state
                          return false; // Prevent auto upload
                        }}
                        showUploadList={false}
                      >
                        <Button icon={<UploadOutlined />}>Choose File</Button>
                      </Upload>
                    </div>
                  )}
                </Field>
              </Col>

                {/* Description */}
                <Col xs={24} sm={24} md={24} >
                  <div className="form-item">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={values.description}
                      onChange={(content) => setFieldValue('description', content)}
                      className=""
                      modules={{
                        toolbar: [
                          ['bold', 'italic', 'underline'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link'],
                          ['clean']
                        ]
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Buttons */}
            <Row>
              <Col span={24}>
                <div className="flex justify-end space-x-4 mt-6">
                  <Button 
                    type="default"
                    className="px-6 py-2 hover:bg-gray-50"
                    onClick={() => window.location.reload()}
                  >
                    Discard
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default GeneralList; 