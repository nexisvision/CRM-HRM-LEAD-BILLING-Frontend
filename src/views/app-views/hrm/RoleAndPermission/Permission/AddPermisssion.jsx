import React from 'react';
import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddPermission = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Submitted values:', values);
    message.success('Permission added successfully!');
    navigate('app/hrm/permission')
    // Navigate or perform additional actions here
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Form submission failed:', errorInfo);
    message.error('Please fill out all required fields.');
  };

  

  return (
    <div className="add-employee">
      {/* <h2 className="mb-4">Add New Permission</h2> */}
      <Form
        layout="vertical"
        form={form}
        name="add-employee"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
                            <h2 className="mb-4 border-b pb-2 font-medium"></h2>

        {/* User Information */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="Permission"
              rules={[{ required: true, message: 'First Name is required' }]}
            >
              <Input placeholder="John" />
            </Form.Item>
          </Col>
         
        </Row>

        <Form.Item>
          <div className="text-right">
            <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/employee')}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPermission;










// import React from 'react'
// import { Form, Input, Button, message } from 'antd';
// import ReactQuill from 'react-quill';
// import { useNavigate } from 'react-router-dom';

// const AddEmployee = () => {

// 	const navigate = useNavigate()

// 	const modules = {
// 		toolbar: [
// 			[{ header: [1, 2, false] }],
// 			['bold', 'italic', 'underline'],
// 			['image', 'code-block']
// 		],
// 	}

// 	const back = () => {
// 		navigate('app/hrm/employee');
// 	}

// 	const onFinish = () => {
// 		message.success('Email has been sent');
// 		navigate('/app/apps/mail/inbox');
// 	}

// 	return (
// 		<div className="mail-compose">
// 			{/* <h4 className="mb-4"></h4> */}
// 			<Form  name="nest-messages" onFinish={onFinish} >
// 				<Form.Item name={['mail', 'to']}>
//                     <label htmlFor="First Name">First Name :  </label>
// 				<Input placeholder="First Name:"/>
// 				</Form.Item>


// 				<Form.Item name={['mail', 'cc']} >
//                 <label htmlFor="Last Name">Last Name :  </label>
//                 	<Input placeholder="Last Name:"/>
// 				</Form.Item>
// 				<Form.Item name={['mail', 'subject']} >

//                 <label htmlFor="First Name">First Name :  </label>

// 					<Input placeholder="Subject:"/>
// 				</Form.Item>
// 				<Form.Item name={['mail', 'content']}>

//                 <label htmlFor="First Name">First Name :  </label>
// 					<ReactQuill theme="snow" modules={modules}/>
// 				</Form.Item>
// 				<Form.Item>
// 					<div className="mt-5 text-right">
// 						<Button type="link" className="mr-2">
// 							Save Darft
// 						</Button>
// 						<Button className="mr-2" onClick={back}>
// 							Discard
// 						</Button>
// 						<Button type="primary" htmlType="submit">
// 							Send
// 						</Button>
// 					</div>
// 				</Form.Item>
// 			</Form>
// 		</div>
// 	)
// }

// export default AddEmployee
