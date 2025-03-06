import React, { useEffect, useState } from 'react';

import { Row, Col, Button, Select, Modal, Input } from 'antd';

import { Formik, Field, ErrorMessage } from 'formik';

import * as Yup from 'yup';

import axios from 'axios';

import { message } from 'antd';

import { useSelector, useDispatch } from 'react-redux';

import { getstages } from '../systemsetup/LeadStages/LeadsReducer/LeadsstageSlice';
import { env } from 'configs/EnvironmentConfig';



const { Option } = Select;



const ConvertDeal = ({ onClose, leadData }) => {

    const dispatch = useDispatch();

    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);

    const [otp, setOtp] = useState('');

    const [formValues, setFormValues] = useState(null);



    const { loggedInUser } = useSelector((state) => state.user);

    const logged = loggedInUser?.username;



    const clients = [

        { id: 1, name: 'Client 1', email: 'client1@example.com' },

        { id: 2, name: 'Client 2', email: 'client2@example.com' },

    ];

    const [clientdata, setClientdata] = useState([]);

    const alldatas = useSelector((state) => state.SubClient.SubClient.data);

    useEffect(()=>{
        setClientdata(alldatas);
    },[alldatas])



    const { data: StagesLeadsDealss = [] } = useSelector(

        (state) => state.StagesLeadsDeals.StagesLeadsDeals || {}

    );



    const StagesLeadsDeals = logged && Array.isArray(StagesLeadsDealss) 

        ? StagesLeadsDealss.filter((item) => 

            item?.created_by === logged && item?.stageType === "deal"

        )

        : [];



    const initialValues = {

        dealName: leadData?.name || '',

        price: '',

        clientType: 'new',

        clientId: '',

        clientName: '',

        clientEmail: '',

        clientPassword: '',

        copyTo: {

            products: true,

            notes: true,

            sources: true,

            calls: true,

            files: true,

            emails: true,

            discussion: true

        }

    };


    useEffect(() => {

        dispatch(getstages());

    }, [dispatch]);



    const validationSchema = Yup.object().shape({

        dealName: Yup.string().required('Deal name is required'),

        price: Yup.number().min(0, 'Price must be positive').required('Price is required'),

        clientType: Yup.string().required('Please select client type'),

        clientId: Yup.string().when('clientType', {

            is: 'existing',

            then: Yup.string().required('Please select a client')

        }),

        clientName: Yup.string().when('clientType', {

            is: 'new',

            then: Yup.string().required('Client name is required')

        }),

        clientEmail: Yup.string().when('clientType', {

            is: 'new',

            then: Yup.string().email('Invalid email').required('Client email is required')

        }),

        clientPassword: Yup.string().when('clientType', {

            is: 'new',

            then: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')

        })

    });



    const handleSubmit = async (values, { setSubmitting }) => {

        setSubmitting(true);

        try {

            if (values.clientType === 'new') {

                const clientData = {

                    username: values.clientName,

                    email: values.clientEmail,

                    password: values.clientPassword,

                    loginEnabled: true

                };



                const authToken = localStorage.getItem('auth_token');



                try {

                    const response = await axios.post(`${env.API_ENDPOINT_URL}/sub-clients`, clientData, {

                        headers: {

                            Authorization: `Bearer ${authToken}`

                        }

                    });

                    if (response.data?.data?.sessionToken) {

                        setFormValues({ ...values, clientId: response.data.data.id, sessionToken: response.data.data.sessionToken });

                        setIsOtpModalVisible(true);

                    }

                } catch (error) {

                    message.error('Failed to create client: ' + (error.response?.data?.message || error.message));

                    setSubmitting(false);

                    return;

                }

            } else {

                await handleFinalSubmit(values);

            }

        } catch (error) {

            message.error('Error processing request: ' + error.message);

        }

        setSubmitting(false);

    };



    const handleFinalSubmit = async (values) => {

        try {

            const authToken = localStorage.getItem('auth_token');



            const dealData = {

                dealName: values.dealName,

                price: values.price,

                stage: values.stage,

                clientId: values.clientType === 'new' ? formValues.clientId : values.clientId,

                copyData: values.copyTo,

                leadTitle: leadData.id

            };



            const response = await axios.post(`${env.API_ENDPOINT_URL}/deals`, dealData, {

                headers: {

                    Authorization: `Bearer ${authToken}`

                }

            });

            

            if (response.data.success) {

                message.success('Deal created successfully!');

                onClose();

            } else {

                message.error('Failed to create deal');

            }

        } catch (error) {

            message.error('Error creating deal: ' + (error.response?.data?.message || error.message));

        }

    };



    const handleOtpSubmit = async () => {

        if (otp.length === 6) {

            try {

                const response = await axios.post(

                    `${env.API_ENDPOINT_URL}/auth/verify-signup`,

                    { otp },

                    {

                        headers: {

                            Authorization: `Bearer ${formValues.sessionToken}`,

                        },

                    }

                );



                if (response.data.success) {

                    message.success('Client verified successfully!');

                    setIsOtpModalVisible(false);

                    await handleFinalSubmit(formValues);

                    setOtp('');

                } else {

                    message.error('Invalid OTP');

                }

            } catch (error) {

                message.error('Error verifying OTP: ' + (error.response?.data?.message || error.message));

            }

        }

    };



    return (

        <div className="">

            <Formik

                initialValues={initialValues}

                // validationSchema={validationSchema}

                onSubmit={handleSubmit}

                enableReinitialize={true}

            >

                {({ values, handleSubmit, setFieldValue }) => (

                    <form onSubmit={handleSubmit}>

                        <h1 className='border-b border-gray-200'></h1>

                        <Row gutter={16}>

                            <Col span={12}>

                                <div className="mt-3">

                                    <label className="block mb-1 font-medium">Deal Name <span className="text-red-500">*</span></label>

                                    <Field

                                        name="dealName"

                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                                        placeholder="Enter Deal Name"

                                    />

                                    <ErrorMessage name="dealName" component="div" className="text-red-500 text-sm mt-1" />

                                </div>

                            </Col>



                            <Col span={12}>

                                <div className="mt-3">

                                    <label className="block mb-1 font-medium">Price <span className="text-red-500">*</span></label>

                                    <Field

                                        name="price"

                                        type="number"

                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                                        placeholder="Enter Price"

                                    />

                                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />

                                </div>

                            </Col>



                            <Col span={12} className="mt-3">

                                <div className="form-item">

                                    <label className="font-semibold">Stage <span className="text-rose-500">*</span></label>

                                    <div className="flex gap-2">

                                        <Field name="stage">

                                            {({ field, form }) => (

                                                <Select

                                                    {...field}

                                                    className="w-full mt-1"

                                                    placeholder="Select Stage"

                                                    value={field.value}

                                                    onChange={(value) => {

                                                        const selectedStage = Array.isArray(StagesLeadsDeals) && StagesLeadsDeals.find((e) => e.id === value);

                                                        form.setFieldValue("stage", selectedStage?.id || "");

                                                    }}

                                                >

                                                    {Array.isArray(StagesLeadsDeals) && StagesLeadsDeals.map((stage) => (

                                                        <Option key={stage.id} value={stage.id}>

                                                            {stage.stageName}

                                                        </Option>

                                                    ))}

                                                </Select>

                                            )}

                                        </Field>

                                    </div>

                                    <ErrorMessage name="stage" component="div" className="error-message text-red-500 my-1" />

                                </div>

                            </Col>



                            <Col span={24}>

                                <div className="mt-3">

                                    <div className="flex gap-6">

                                        <label className="flex items-center">

                                            <Field

                                                type="radio"

                                                name="clientType"

                                                value="new"

                                                className="mr-2"

                                            />

                                            New Client

                                        </label>

                                        <label className="flex items-center">

                                            <Field

                                                type="radio"

                                                name="clientType"

                                                value="existing"

                                                className="mr-2"

                                            />

                                            Existing Client

                                        </label>

                                    </div>

                                </div>

                            </Col>



                            {values.clientType === 'existing' ? (

                                <Col span={24}>

                                    <div className="mt-3">

                                        <label className="block mb-1 font-medium">Select Client <span className="text-red-500">*</span></label>

                                        <Field name="clientId">

                                            {({ field }) => (

                                                <Select

                                                    {...field}

                                                    className="w-full"

                                                    placeholder="Select Client"

                                                    onChange={(value) => setFieldValue('clientId', value)}

                                                >

                                                    {clientdata.map((client) => (

                                                        <Option key={client.id} value={client.id}>

                                                            {client.name || client.email}

                                                        </Option>

                                                    ))}

                                                </Select>

                                            )}

                                        </Field>

                                        <ErrorMessage name="clientId" component="div" className="text-red-500 text-sm mt-1" />

                                    </div>

                                </Col>

                            ) : (

                                <>

                                    <Col span={12}>

                                        <div className="mt-3">

                                            <label className="block mb-1 font-medium">Client Name <span className="text-red-500">*</span></label>

                                            <Field

                                                name="clientName"

                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                                                placeholder="Enter Client Name"

                                            />

                                            <ErrorMessage name="clientName" component="div" className="text-red-500 text-sm mt-1" />

                                        </div>

                                    </Col>



                                    <Col span={12}>

                                        <div className="mt-3">

                                            <label className="block mb-1 font-medium">Client Email <span className="text-red-500">*</span></label>

                                            <Field

                                                name="clientEmail"

                                                type="email"

                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                                                placeholder="Enter Client Email"

                                            />

                                            <ErrorMessage name="clientEmail" component="div" className="text-red-500 text-sm mt-1" />

                                        </div>

                                    </Col>



                                    <Col span={24}>

                                        <div className="mt-3">

                                            <label className="block mb-1 font-medium">Client Password <span className="text-red-500">*</span></label>

                                            <Field

                                                name="clientPassword"

                                                type="password"

                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                                                placeholder="Enter Client Password"

                                            />

                                            <ErrorMessage name="clientPassword" component="div" className="text-red-500 text-sm mt-1" />

                                        </div>

                                    </Col>

                                </>

                            )}

                        </Row>



                        <div className="flex justify-end gap-3 mt-6">

                            <Button onClick={onClose} className="px-4">

                                Cancel

                            </Button>

                            <Button

                                type="primary"

                                htmlType="submit"

                                className="bg-blue-500 text-white px-4"

                            >

                                {values.clientType === 'new' ? 'Create' : 'Create'}

                            </Button>

                        </div>

                    </form>

                )}

            </Formik>



            <Modal

                title="OTP Verification"

                visible={isOtpModalVisible}

                onCancel={() => setIsOtpModalVisible(false)}

                footer={[

                    <Button key="cancel" onClick={() => setIsOtpModalVisible(false)}>

                        Cancel

                    </Button>,

                    <Button 

                        key="submit" 

                        type="primary" 

                        onClick={handleOtpSubmit}

                        disabled={otp.length !== 6}

                    >

                        Verify

                    </Button>

                ]}

            >

                <div className="p-4">

                    <p className="mb-4">

                        Please enter the 6-digit OTP sent to your email address: 

                        <span className="font-semibold ml-1">{formValues?.clientEmail}</span>

                    </p>

                    <Input

                        placeholder="Enter 6-digit OTP"

                        value={otp}

                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}

                        className="text-center text-2xl tracking-wider"

                        maxLength={6}

                    />

                    <Button 
                        type="primary"
                        onClick={handleOtpSubmit}
                        disabled={otp.length !== 6}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Verify OTP
                    </Button>
                </div>

            </Modal>

        </div>

    );

};



export default ConvertDeal;


