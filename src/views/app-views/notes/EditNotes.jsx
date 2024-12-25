import React,{useState} from 'react';
import { Form, Input, Button, DatePicker, Select, message, Row, Col, Checkbox, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const { Option } = Select;

const EditNotes = () => {
    const [selectedType, setSelectedType] = useState("Personal");
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Submitted values:', values);
        message.success('Notes Edit successfully!');
        navigate('views/app-views/notes');
    };

    return (
        <div className="add-job-form">
            {/* <h2 className="mb-4">Create New Coupon</h2> */}
            <Form
                layout="vertical"
                form={form}
                name="add-job"
                onFinish={onFinish}
            >
                <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a Title.' }]}>
                            <Input placeholder="Enter Title" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                            <ReactQuill />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="color" label="Color"  rules={[{message: 'Please select a Color.' }]}>
                            <Select placeholder="Select Branch">
                                <Option value="primary">Primary</Option>
                                <Option value="secondary">Secondary</Option>
                                <Option value="info">Info</Option>
                                <Option value="warning">Warning</Option>
                                <Option value="danger">Danger</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* <Col span={12}>
            <Form.Item name="type" label="Type" className='flex' rules={[{ required: true, message: 'Please select a Color.' }]}>
                <div className='flex'>
              <Button className='rounded-none w-full'>Personal</Button>
              <Button className='rounded-none w-full'>Shared</Button>
                </div>
            </Form.Item>
          </Col> */}

                    <Col span={12}>
                        <Form.Item
                            name="type"
                            label="Type"
                        
                            rules={[{ required: true, message: "Please select a type." }]}
                        >
                            <div className="flex">
                                <Button
                                    className={`rounded-none w-full ps-5 pe-5 md:ps-10 md:pe-10 lg:ps-20 lg:pe-20  ${selectedType === "Personal"
                                            ? "bg-blue-500 text-white"
                                            : "border border-blue-500 text-blue-500"
                                        }`}
                                    onClick={() => setSelectedType("Personal")}
                                >
                                    Personal
                                </Button>
                                <Button
                                    className={`rounded-none w-full ps-5 pe-5 md:ps-10 md:pe-10 lg:ps-20 lg:pe-20  ${selectedType === "Shared"
                                            ? "bg-blue-500 text-white"
                                            : "border border-blue-500 text-blue-500"
                                        }`}
                                    onClick={() => setSelectedType("Shared")}
                                >
                                    Shared
                                </Button>
                            </div>
                        </Form.Item>
                        {selectedType === "Shared" && (
                            <Form.Item name="assignto" label="Assign to" rules={[{  message: 'Please select a User.' }]}>
                            <Select placeholder="Select User" mode="multiple">
                                <Option value="">Harry-harry@gmail.com</Option>
                                <Option value="">Jeff-Jeff@gmail.com</Option>
                                <Option value="">Peter-Peter@gmail.com</Option>
                            </Select>
                        </Form.Item>
                        )}
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
    );
};

export default EditNotes;



