import React, { useState } from 'react';
import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
import { Form, Input, Button, DatePicker, Select, message, Row, Col, Checkbox,Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const { Option } = Select;


function ViewEditCreditNotes() {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Submitted values:', values);
        message.success('Job added successfully!');
        navigate('/app/hrm/jobs');
      };
    

    return (
        <>
            <Card className='border-0 m-0'>

                <div className="p-3 bg-gray-50">
                    <h2 className="mb-4 border-b pb-2 font-medium">Edit Credit Note</h2>
                    <Form
                        layout="vertical"
                        form={form}
                        name="add-job"
                        onFinish={onFinish}
                    >
                        <Row gutter={16}>

                            <Col span={12}>
                                <Form.Item name="date" label="Date" rules={[{ required: true, message: 'date is required.' }]}>
                                    <DatePicker style={{ width: '100%' }} placeholder='DD-MM-YYYY' format="DD-MM-YYYY" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please enter a Amount.' }]}>
                                    <Input type='number' placeholder="Enter Amount" />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item name="description" label="Description">
                                    <ReactQuill placeholder="Enter Description" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <div className="form-buttons text-right">
                                <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/jobs')}>Cancel</Button>
                                <Button type="primary" htmlType="submit">Update</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Card>

        </>
    )
}

export default ViewEditCreditNotes;
