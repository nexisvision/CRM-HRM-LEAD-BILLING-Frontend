import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, DatePicker, Select, Input, Checkbox, Row, Col, message } from 'antd';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { adddreinderss, getssreinderss } from './reminderReducers/reminderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { GetUsers } from 'views/app-views/Users/UserReducers/UserSlice';
import { Option } from 'antd/es/mentions';

const { TextArea } = Input;


const validationSchema = Yup.object().shape({
  start_date: Yup.date().required('Date is required'),
  users: Yup.object().shape({
    users: Yup.array().min(1, 'Please select at least one user').required('Users are required')
  }),
  description: Yup.string().required('Description is required'),
  sendEmail: Yup.boolean()
});

const ReminderList = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(GetUsers())
  }, [dispatch])

  const alluserdata = useSelector((state) => state.Users.Users.data);



  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const initialValues = {
    start_date: null,
    users: {
      users: []
    },
    description: '',
    sendEmail: false
  };

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    dispatch(adddreinderss(values))
      .then(() => {
        dispatch(getssreinderss())
        message.success("Reminder added successfully")
        setSubmitting(false);
        setIsModalVisible(false);
        resetForm();
      })

  };

  return (
    <Row justify="end" className="mb-4">
      <Col>
        <Button type="primary" onClick={showModal}>
          Set Lead Reminder
        </Button>
      </Col>

      <Modal
        title={
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-lg font-medium">Set Lead Reminder</span>
          </div>
        }
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        destroyOnClose
        width={700}
        className="reminder-modal"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting
          }) => (
            <Form onFinish={handleSubmit} layout="vertical" className="mt-4">
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Date to be notified"
                    required
                    validateStatus={errors.start_date && touched.start_date ? 'error' : ''}
                    help={touched.start_date && errors.start_date}
                    className="mb-4"
                  >
                    <DatePicker
                      className="w-full"
                      onChange={(date) => setFieldValue('start_date', date)}
                      onBlur={handleBlur}
                      name="start_date"
                      format="YYYY-MM-DD"
                      placeholder="Select date"
                    />
                  </Form.Item>
                </Col>


                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Set reminder to </label>
                    <Select
                      name="users"
                      mode="multiple"
                      style={{ width: "100%" }}
                      className="w-full mt-1"
                      placeholder="Select users"
                      value={values.users.users}
                      onChange={(selectedUsers) => setFieldValue("users", { users: selectedUsers })}
                    >
                      {alluserdata.map((user) => (
                        <Option key={user.id} value={user.id}>
                          {user.username}
                        </Option>
                      ))}
                    </Select>
                    <ErrorMessage
                      name="users"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>


                <Col xs={24}>
                  <Form.Item
                    label="Description"
                    required
                    validateStatus={errors.description && touched.description ? 'error' : ''}
                    help={touched.description && errors.description}
                    className="mb-4"
                  >
                    <TextArea
                      rows={4}
                      name="description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                      placeholder="Enter reminder description"
                    />
                  </Form.Item>
                </Col>



                <Col xs={24}>
                  <Form.Item className="mb-6">
                    <Checkbox
                      name="sendEmail"
                      checked={values.sendEmail}
                      onChange={(e) => setFieldValue('sendEmail', e.target.checked)}
                    >
                      Send also an email for this reminder
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Row justify="end" gutter={[8, 0]}>
                    <Col>
                      <Button onClick={handleCancel}>
                        Close
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                      // disabled={isSubmitting || Object.keys(errors).length > 0}
                      >
                        Save
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Modal>
    </Row>
  );
};

export default ReminderList;
