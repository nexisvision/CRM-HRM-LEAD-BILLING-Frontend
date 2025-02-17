import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Card, Button, Upload, message, Row, Col, Avatar } from 'antd';
import { QuestionCircleOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { creategenaralsett, getgeneralsettings } from './generalReducer/generalSlice';
import { useDispatch, useSelector } from 'react-redux';
import useSelection from 'antd/es/table/hooks/useSelection';

const validationSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
});

const GeneralList = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();

  const initialValues = {
    description: '',
  };

  useEffect(() => {
    dispatch(getgeneralsettings())
  }, [dispatch])

  const alldata = useSelector((state) => state.generalsetting.generalsetting.data);

  useEffect(() => {
    if (alldata && alldata.length > 0) {
      setImageUrl(alldata[0].companylogo);
      initialValues.description = alldata[0].termsandconditions;
    }
  }, [alldata]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add file only if it exists
      if (selectedFile) {
        formData.append('companylogo', selectedFile);
      }
      formData.append('termsandconditions', values.description);

      await dispatch(creategenaralsett(formData));
      await dispatch(getgeneralsettings())
      message.success('Settings updated successfully');
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleFileChange = (info) => {
    const file = info.file;
    if (file) {
      setSelectedFile(file);
      message.success(`${file.name} selected successfully`);
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
      
      {alldata && alldata.length > 0 ? (
        <div className="mb-6">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <h2 className="text-xl font-medium mb-4">Current Settings</h2>
              <div className="flex items-start gap-6">
                <div>
                  <h3 className="font-medium mb-2">Company Logo</h3>
                  <Avatar 
                    size={100} 
                    src={alldata[0].companylogo}
                    icon={!alldata[0].companylogo && <UserOutlined />}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Terms and Conditions</h3>
                  <div dangerouslySetInnerHTML={{ __html: alldata[0].termsandconditions }} />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      ) :  <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
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
                      accept="image/*"
                      beforeUpload={(file) => {
                        handleFileChange({ file });
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
    </Formik>}

     
    </div>
  );
};

export default GeneralList; 