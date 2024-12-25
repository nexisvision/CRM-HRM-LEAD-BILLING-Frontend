import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col,Switch, Upload ,Card} from 'antd';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import utils from 'utils';
import OrderListData from "assets/data/order-list.data.json"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddLead = () => {
    const navigate = useNavigate();
    const [details, setDetails] = useState(false);
    const [info, setInfo] = useState(false);
    const [organisation, setorganisation] = useState(false);

    const initialValues = {
        leadtitle: '',
        firstname: '',
        lastname:'',
        telephone:'',
        email:'',
        leadvalue:'',
        assigned:'',
        status:'',
        notes:'',
        source:'',
        category:'',
        contacted:null,
        totalbudget:'',
        targetdate:null,
        contenttype:'',
        brandname:'',
        companyname:'',
        street:'',
        city:'',
        state:'',
        zipcode:'',
        country:'',
        website:'',
    };

    const validationSchema = Yup.object({
        leadtitle: Yup.string().required('Please enter a Lead Title.'),
        firstname: Yup.string().required('Please first name.'),
        lastname: Yup.string().required('Please enter a Last Name.'),
        telephone:Yup.string().matches(/^\d{10}$/, 'TelePhone number must be exactly 10 digits.').required('please enter a Telephone number'),
        email:Yup.string().email('Please enter a valid email address with @.').required('please enter a email'),
        leadvalue: Yup.string().required('Please enter a Lead Value.'),
        assigned: Yup.string().required('Please select a assigned.'),
        status: Yup.string().required('Please select a status.'),
        notes: details ? Yup.string().required("Notes are required") : Yup.string(),
        source: details ? Yup.string().required("Source are required") : Yup.string(),
        category: details ? Yup.string().required("Category are required") : Yup.string(),
        contacted: details ? Yup.date().nullable().required("Last Contacted are required") : Yup.date(),
        totalbudget: info ? Yup.string().required("Total Budget are required") : Yup.string(),
        targetdate: info ? Yup.date().nullable().required("Target date are required") : Yup.date(),
        contenttype: info ? Yup.string().required("Content type are required") : Yup.string(),
        brandname: info ? Yup.string().required("Brand name are required") : Yup.string(),
        companyname: organisation ? Yup.string().required("Company name are required") : Yup.string(),
        street: organisation ? Yup.string().required("Street are required") : Yup.string(),
        city: organisation ? Yup.string().required("city name are required") : Yup.string(),
        state: organisation ? Yup.string().required("State name are required") : Yup.string(),
        zipcode: organisation ? Yup.string().required("Zip Code are required") : Yup.string(),
        country: organisation ? Yup.string().required("Country name are required") : Yup.string(),
        website: organisation ? Yup.string().required("Website name are required") : Yup.string(),
    });


    const onSubmit = (values) => {
        console.log('Submitted values:', values);
        message.success('Project added successfully!');
        navigate('/app/apps/project');
    };
    // console.log("object",Option)

    return (
        <div className="add-job-form">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, setFieldTouched, }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <h2 className="mb-4 border-b pb-2 font-medium"></h2>

                        <Row gutter={16}>
                            <Col span={24}>
                                <div className="form-item">
                                    <label className='font-semibold flex'>Lead Title <h1 className='text-rose-500'>*</h1></label>
                                    <Field name="leadtitle" as={Input} placeholder="Enter Lead Title"/>
                                    <ErrorMessage name="leadtitle" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold flex'>First Name<h1 className='text-rose-500'>*</h1></label>
                                    <Field name="firstname" as={Input} placeholder="Enter First Name"/>
                                    <ErrorMessage name="firstname" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold flex'>Last Name<h1 className='text-rose-500'>*</h1></label>
                                    <Field name="lastname" as={Input} placeholder="Enter Last Name" />
                                    <ErrorMessage name="lastname" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Telephone</label>
                                    <Field name="telephone" as={Input} placeholder="Enter Telephone"/>
                                    <ErrorMessage name="telephone" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Email Address</label>
                                    <Field name="email" as={Input} placeholder="Enter Email Address"/>
                                    <ErrorMessage name="email" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Lead Value($)</label>
                                    <Field name="leadvalue" as={Input} placeholder="Enter Lead Value" />
                                    <ErrorMessage name="leadvalue" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Assigned</label>
                                    <Field name="assigned">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Assigned"
                                                onChange={(value) => setFieldValue('assigned', value)}
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
                                    <ErrorMessage name="assigned" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={24} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold flex'>Status <h1 className='text-rose-500'>*</h1></label>
                                    <Field name="status">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Status"
                                                onChange={(value) => setFieldValue('status', value)}
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
                                    <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            {/* Toggle button for Receipt Upload */}
          
                        <Col span={24} className='mt-4 '>
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
             <label className='font-semibold'>Source</label>
             <Field name="source">
                 {({ field }) => (
                     <Select
                         {...field}
                         className="w-full"
                         placeholder="Select Source"
                         onChange={(value) => setFieldValue('source', value)}
                         value={values.source}
                        onBlur={() => setFieldTouched("source", true)}

                     >
                         <Option value="Yahoo">Yahoo</Option>
                         <Option value="googleplaces">Google Places</Option>
                         <Option value="fbads">Facebook Ads</Option>
                     </Select>
                 )}
             </Field>
             <ErrorMessage name="source" component="div" className="error-message text-red-500 my-1" />
            </div>
            </Col>
            <Col span={24}>    
            <div className="form-item mt-2">
             <label className='font-semibold'>Category</label>
             <Field name="category">
                 {({ field }) => (
                     <Select
                         {...field}
                         className="w-full"
                         placeholder="Select Category"
                         onChange={(value) => setFieldValue('category', value)}
                         value={values.category}
                         onBlur={() => setFieldTouched("category", true)}
                     >
                         <Option value="default">Default</Option>
                         <Option value="appdev">Application Developer</Option>
                         <Option value="graphic">Graphic Design</Option>
                     </Select>
                 )}
             </Field>
             <ErrorMessage name="category" component="div" className="error-message text-red-500 my-1" />
            </div>
            </Col>
            <Col span={24}>
            <div className="form-item mt-2">
             <label className='font-semibold'>Tags</label>
             <Field name="tags">
                 {({ field }) => (
                     <Select
                         {...field}
                         className="w-full"
                         placeholder="Select Tags"
                         onChange={(value) => setFieldValue('tags', value)}
                         onBlur={() => setFieldTouched("tags", true)}
                         value={values.tags}
                     >
                         <Option value="high">high</Option>
                         <Option value="joomla">joomla</Option>
                         <Option value="wordpress">Word Press</Option>
                     </Select>
                 )}
             </Field>
             <ErrorMessage name="tags" component="div" className="error-message text-red-500 my-1" />
            </div>
            </Col>
            <Col span={24}>
            <div className="form-item  mt-2 border-b pb-3">
                                    <label className='font-semibold'>Last Contacted</label>
                                    <DatePicker
                                        className="w-full"
                                        format="DD-MM-YYYY"
                                        value={values.contacted}
                                        onChange={(date) => setFieldValue('contacted', date)}
                                        onBlur={() => setFieldTouched("contacted", true)}
                                    />
                                    <ErrorMessage name="contacted" component="div" className="error-message text-red-500 my-1" />
                                </div>
                                  
            </Col>
         </>
          )}
                        </Col>

                        <Col span={24} className='mt-4 '>
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
             <Card className='w-full border-l-4 border-l-cyan-300 rounded-sm '>
                <div >
                    <div className='flex gap-2'>
                        <ExclamationCircleOutlined className='text-xl text-cyan-300'/>
                        <h1 className='text-xl text-cyan-300'>Demo Info</h1>
                    </div>
                    <div>
                        <p>These are custom fields. You can change them or create your own.</p>
                    </div>
                </div>
             </Card>
                </Col>
            </div>
            <div className='mt-2'>
            <Col span={24} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Total Budget</label>
                                    <Field name="totalbudget" as={Input} placeholder="Enter Total Budget" />
                                    <ErrorMessage name="totalbudget" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
            </div>
            <div className='mt-2'>
            <Col span={24} >
            <div className="form-item mt-2">
                                    <label className='font-semibold'>Target Date</label>
                                    <DatePicker
                                        className="w-full"
                                        format="DD-MM-YYYY"
                                        value={values.targetdate}
                                        onChange={(date) => setFieldValue('targetdate', date)}
                                        onBlur={() => setFieldTouched("targetdate", true)}
                                    />
                                    <ErrorMessage name="targetdate" component="div" className="error-message text-red-500 my-1" />
                                </div>
            </Col>
            </div>
            <div>
            <Col span={24} className='mt-2'>
            
            <div className="form-item mt-2">
             <label className='font-semibold'>Content Type</label>
             <Field name="contenttype">
                 {({ field }) => (
                     <Select
                         {...field}
                         className="w-full"
                         placeholder="Select Content Type"
                         onChange={(value) => setFieldValue('contenttype', value)}
                         value={values.contenttype}
                         onBlur={() => setFieldTouched("contenttype", true)}
                     >
                         <Option value="Article">Article</Option>
                         <Option value="blog">Blog Post</Option>
                         <Option value="script">Script</Option>
                     </Select>
                 )}
             </Field>
             <ErrorMessage name="category" component="div" className="error-message text-red-500 my-1" />
            </div>
            </Col>
            </div>
            <div className='mt-2'>
            <Col span={24} className='mt-2 border-b pb-3'>
                                <div className="form-item">
                                    <label className='font-semibold'>Brand Name</label>
                                    <Field name="brandname" as={Input} placeholder="Enter Brand Name" className='w-full'/>
                                    <ErrorMessage name="brandname" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
            </div>
         </>
          )}
                        </Col>


                        
                        <Col span={24} className='mt-4 '>
                        <div className="flex justify-between items-center">
            <label className="font-semibold">Address & Organisation Details</label>
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
            <div className='mt-2'>
            <Col span={24} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Company Name</label>
                                    <Field name="companyname" as={Input} placeholder="Enter Company Name" className='w-full '/>
                                    <ErrorMessage name="companyname" component="div" className="error-message text-red-500 my-1" />
                                </div>
            </Col>
            </div>
            <div className='mt-2'>
            <Col span={24} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Street</label>
                                    <Field name="street" as={Input} placeholder="Enter Street" className='w-full'/>
                                    <ErrorMessage name="street" component="div" className="error-message text-red-500 my-1" />
                                </div>
            </Col>
            </div>
            <div className='mt-2'>
            <Col span={24} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>City</label>
                                    <Field name="city" as={Input} placeholder="Enter City Name" className='w-full'/>
                                    <ErrorMessage name="city" component="div" className="error-message text-red-500 my-1" />
                                </div>
            </Col>
            </div>
            <div className='mt-2'>
            <Col span={24} className='mt-2'>
                                <div className="form-item mt-2">
                                    <label className='font-semibold'>State</label>
                                    <Field name="state" as={Input} placeholder="Enter State Name" className='w-full'/>
                                    <ErrorMessage name="state" component="div" className="error-message text-red-500 my-1" />
                                </div>
            </Col>
            </div>
            <div>
            <Col span={24} className='mt-2'>
                                <div className="form-item mt-2">
                                    <label className='font-semibold'>Zip Code</label>
                                    <Field name="zipcode" as={Input} placeholder="Enter zip code" className='w-full'/>
                                    <ErrorMessage name="zipcode" component="div" className="error-message text-red-500 my-1" />
                                </div>
            </Col>
            </div>
           
            <div>
            <Col span={24} className='mt-2'> 
            <div className="form-item  mt-2">
             <label className='font-semibold'>Country</label>
             <Field name="contenttype">
                 {({ field }) => (
                     <Select
                         {...field}
                         className="w-full"
                         placeholder="Select Country"
                         onChange={(value) => setFieldValue('country', value)}
                         value={values.country}
                         onBlur={() => setFieldTouched("country", true)}
                     >
                         <Option value="India">India</Option>
                         <Option value="arubs">Aruba</Option>
                         <Option value="bhutan">Bhutan</Option>
                     </Select>
                 )}
             </Field>
             <ErrorMessage name="country" component="div" className="error-message text-red-500 my-1" />
            </div>
            </Col>
            </div>
            <div className='mt-2'>
            <Col span={24} className='mt-2 border-b pb-3'>
                                <div className="form-item">
                                    <label className='font-semibold'>Website</label>
                                    <Field name="website" as={Input} placeholder="Enter Website" className='w-full' onBlur={() => setFieldTouched("website", true)}/>
                                    <ErrorMessage name="Website" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
            </div>
            
         </>
          )}
                        </Col>

                        <Col className='mt-2'>
                                <h5 className='flex'><h1 className='text-rose-500'>*</h1> Required</h5>
                        </Col>
                           
                        </Row>

                        <div className="form-buttons text-right mt-4">
                            <Button type="default" htmlType='submit' className="mr-2" onClick={() => navigate('/app/apps/project/lead')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddLead;

// import React from 'react';
// import { Form, Input, Button, Select, Row, Col, message } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// const AddLead = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Lead added successfully!');
//     // Redirect to desired page after submission
//     navigate('/leads');
//   };

//   return (
//     <div className="add-deal-form">
//       {/* <h2 className="mb-4">Create Deal</h2> */}
//       <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

//       <Form
//         layout="vertical"
//         form={form}
//         name="add-deal"
//         onFinish={onFinish}
//       >
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="subject"
//               label="Subject"
//               rules={[{ required: true, message: 'Please enter a subject name.' }]}
//             >
//               <Input placeholder="Enter Subject" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="users"
//               label="Users"
//               rules={[{ required: true, message: 'Please select a user.' }]}
//             >
//               <Select placeholder="Select User" mode="multiple">
//                 <Option value="User1">User 1</Option>
//                 <Option value="User2">User 2</Option>
//                 <Option value="User3">User 3</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="name"
//               label="Name"
//               rules={[{ required: true, message: 'Please enter a name.' }]}
//             >
//               <Input placeholder="Enter Name" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="phone"
//               label="Phone"
//               rules={[{ required: true, message: 'Please enter a phone number.' }]}
//             >
//               <Input placeholder="Enter Phone" />
//               <span className="ant-form-text"> Please use with country code. (ex. +91)</span>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="email"
//               label="Email"
//               rules={[{ required: true, message: 'Please enter the email.' }]}
//             >
//               <Input placeholder="Enter email" />
//             </Form.Item>
//           </Col>

          
//         </Row>

//         <Form.Item>
//           <div className="form-buttons text-right">
//             <Button
//               type="default"
//               className="mr-2"
//               onClick={() => navigate('/deals')}
//             >
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Create
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default AddLead;
