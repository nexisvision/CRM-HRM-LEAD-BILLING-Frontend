import React, { useState } from "react";
import {
  Card,
  Table,
  Menu,
  Row,
  Col,
  Tag,
  Input,
  message,
  Button,
  Modal,
  Select,
  DatePicker,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  CopyOutlined,
  EditOutlined,
  LinkOutlined,
} from "@ant-design/icons";
// import { Card, Table,  Badge, Menu, Tag,Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import OrderListData from 'assets/data/order-list.data.json';
import Flex from 'components/shared-components/Flex'
import utils from 'utils';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import userData from 'assets/data/user-list.data.json';
import dayjs from 'dayjs';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addCountry, getallcountries } from './countriesreducer/countriesSlice';

const { Option } = Select;

const AddCountries = ({ onClose }) => {
    const [users, setUsers] = useState(userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();



const onSubmit = async (values, { setSubmitting }) => {
    try {
        // Dispatch the addCountry action
        const response = await dispatch(addCountry(values)).unwrap();
        
        if (response) {
            message.success('Country added successfully!');
            // await dispatch(getallcountries());
            // Navigate to the countries list page
            navigate('/app/setting/countries');
            onClose(); // Close the modal
        }
    } catch (error) {
        message.error('Failed to add country: ' + error.message);
    } finally {
        setSubmitting(false);
    }
};

const handleCancel = () => {
    navigate('/app/setting/countries');
};

    const initialValues = {
        name: '',
        countryCode: '',
        phonecode: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Please enter name.'),
        countryCode: Yup.string().required('Please enter a country code.'),
        phonecode: Yup.string().required('Please enter a phone code.'),
    });

  return (
    <>
      <div>
        <div className=" ">
          <h2 className="mb-1 border-b font-medium"></h2>

          <div className="">
            <div className=" p-2">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                  <Form className="formik-form" onSubmit={handleSubmit}>
                    <Row gutter={16}>
                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">Name</label>
                          <Field
                            name="name"
                            as={Input}
                            placeholder="Enter Name"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>

                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">Short Code</label>
                          <Field
                            name="shortcode"
                            as={Input}
                            placeholder="Enter Short Code"
                          />
                          <ErrorMessage
                            name="shortcode"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>

                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">Phone Code</label>
                          <Field
                            name="phonecode"
                            as={Input}
                            placeholder="Enter Phone Code"
                          />
                          <ErrorMessage
                            name="phonecode"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          <div className="form-buttons text-right">
            <Button
              type="default"
              className="mr-2"
              onClick={navigate("/app/setting/countries")}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCountries;


// import React from 'react';
// import { Row, Col, Input, message, Button } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch } from 'react-redux';
// import { addCountry, getallcountries } from './countriesreducer/countriesSlice';

// const AddCountries = ({ onClose }) => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const initialValues = {
//         countryName: '',
//         countryCode: '',
//         phoneCode: '',
//     };

//     const validationSchema = Yup.object({
//         countryName: Yup.string().required('Please enter country name.'),
//         countryCode: Yup.string().required('Please enter a country code.'),
//         phoneCode: Yup.string().required('Please enter a phone code.'),
//     });

//     const onSubmit = async (values, { setSubmitting }) => {
//         try {
//             // Dispatch the addCountry action
//             const response = await dispatch(addCountry(values)).unwrap();
            
//             if (response) {
//                 message.success('Country added successfully!');
//                 // await dispatch(getallcountries());
//                 // Navigate to the countries list page
//                 navigate('/app/setting/countries');
//                 // onClose(); // Close the modal
//             }
//         } catch (error) {
//             message.error('Failed to add country: ' + error.message);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleCancel = () => {
//         navigate('/app/setting/countries');
//     };

//     return (
//         <div>
//             <div className=''>
//                 <Formik
//                     initialValues={initialValues}
//                     validationSchema={validationSchema}
//                     onSubmit={onSubmit}
//                 >
//                     {({ isSubmitting }) => (
//                         <Form className="formik-form">
//                             <Row gutter={16}>
//                                 <Col span={24} className='mt-2'>
//                                     <div className="form-item">
//                                         <label className='font-semibold'>Country Name</label>
//                                         <Field 
//                                             name="countryName" 
//                                             as={Input} 
//                                             placeholder="Enter Country Name" 
//                                         />
//                                         <ErrorMessage 
//                                             name="countryName" 
//                                             component="div" 
//                                             className="error-message text-red-500 my-1" 
//                                         />
//                                     </div>
//                                 </Col>

//                                 <Col span={24} className='mt-2'>
//                                     <div className="form-item">
//                                         <label className='font-semibold'>Country Code</label>
//                                         <Field 
//                                             name="countryCode" 
//                                             as={Input} 
//                                             placeholder="Enter Country Code" 
//                                         />
//                                         <ErrorMessage 
//                                             name="countryCode" 
//                                             component="div" 
//                                             className="error-message text-red-500 my-1" 
//                                         />
//                                     </div>
//                                 </Col>

//                                 <Col span={24} className='mt-2'>
//                                     <div className="form-item">
//                                         <label className='font-semibold'>Phone Code</label>
//                                         <Field 
//                                             name="phoneCode" 
//                                             as={Input} 
//                                             placeholder="Enter Phone Code" 
//                                         />
//                                         <ErrorMessage 
//                                             name="phoneCode" 
//                                             component="div" 
//                                             className="error-message text-red-500 my-1" 
//                                         />
//                                     </div>
//                                 </Col>
//                             </Row>

//                             <div className="form-buttons text-right mt-4">
//                                 <Button 
//                                     type="default" 
//                                     className="mr-2" 
//                                     onClick={onClose}
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button 
//                                     type="primary" 
//                                     htmlType="submit" 
//                                     loading={isSubmitting}
//                                 >
//                                     Create
//                                 </Button>
//                             </div>
//                         </Form>
//                     )}
//                 </Formik>
//             </div>
//         </div>
//     );
// };

// export default AddCountries;