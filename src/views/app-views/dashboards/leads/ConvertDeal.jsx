import React, { useEffect } from 'react';
import { Row, Col, Button, Select } from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const ConvertDeal = ({ onClose, leadData }) => {
    const initialValues = {
        dealName: leadData?.name || '',
        price: '0',
        clientType: 'new', // 'new' or 'existing'
        clientId: '', // for existing client selection
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

    const validationSchema = Yup.object().shape({
        dealName: Yup.string().required('Deal name is required'),
        price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
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

    const handleSubmit = (values, { setSubmitting }) => {
        console.log(values);
        // Handle form submission
        setSubmitting(false);
        onClose();
    };

    // Mock clients data - replace this with your actual clients data
    const clients = [
        { id: 1, name: 'Client 1', email: 'client1@example.com' },
        { id: 2, name: 'Client 2', email: 'client2@example.com' },
        // ... more clients
    ];

    return (
        <div className="p-6">
            

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, handleSubmit, setFieldValue, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="mb-4">
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
                                <div className="mb-4">
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

                            <Col span={24}>
                                <div className="mb-4">
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
                                    <div className="mb-4">
                                        <label className="block mb-1 font-medium">
                                            Select Client <span className="text-red-500">*</span>
                                        </label>
                                        <Field name="clientId">
                                            {({ field }) => (
                                                <Select
                                                    {...field}
                                                    className="w-full"
                                                    placeholder="Select Client"
                                                    onChange={(value) => setFieldValue('clientId', value)}
                                                    showSearch
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {clients && clients.length > 0 ? (
                                                        clients.map((client) => (
                                                            <Option key={client.id} value={client.id}>
                                                                {client.name || client.email || 'Unnamed Client'}
                                                            </Option>
                                                        ))
                                                    ) : (
                                                        <Option value="" disabled>
                                                            No Clients Available
                                                        </Option>
                                                    )}
                                                </Select>
                                            )}
                                        </Field>
                                        <ErrorMessage 
                                            name="clientId" 
                                            component="div" 
                                            className="text-red-500 text-sm mt-1" 
                                        />
                                    </div>
                                </Col>
                            ) : (
                                <>
                                    <Col span={12}>
                                        <div className="mb-4">
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
                                        <div className="mb-4">
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
                                        <div className="mb-4">
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
                                // disabled={isSubmitting}
                                className="bg-blue-500 text-white px-4"
                            >
                                Create
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default ConvertDeal;
