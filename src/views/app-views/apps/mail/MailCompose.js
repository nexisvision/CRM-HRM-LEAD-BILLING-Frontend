// MailCompose.js
import React, { useState } from 'react';
import { Form, Input, Button, message, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

const templates = {
	"Select Template": {
		placeholders: {},
		// emailMessage: "",
	},
	"New Support Ticket": {
		placeholders: {
			app_name: "My App",
			company_name: "My Company",
			app_url: "http://myapp.com",
			support_name: "John Doe",
			support_title: "Issue with login",
			support_priority: "High",
			support_end_date: "2024-12-20",
			support_description: "Cannot log into the account.",
		},
		emailMessage: `Hi {support_name},
    					New support ticket has been opened.

Title: {support_title}
Priority: {support_priority}
End Date: {support_end_date}

Support message:
{support_description}`,
	},
	"Bug Report": {
		placeholders: {
			bug_name: "Bug Tracker",
			company_name: "BugFixers Inc.",
			app_url: "http://bugtracker.com",
			support_name: "Jane Smith",
			support_title: "UI Bug in Dashboard",
			support_priority: "Medium",
			// support_end_date: "2024-12-15",
			// support_description: "UI elements are misaligned.",
		},
		emailMessage: `Hi {bug_name},
    
A new bug report has been submitted.

company_name: {BugFixers Inc.}
support_name: {Jane Smith}
End Date: {support_end_dateee}

Details:
{bug_description}`,
	},


"Lead Assigned": {
		placeholders: {
			lead_name: "lead name",
			lead_email: "lead email",
			lead_subject: "lead subject",
			lead_pipeline: "lead pipeline",
			lead_stage: "lead stage",
			// company_name: "BugFixers Inc.",
			// app_url: "http://bugtracker.com",
			// support_name: "Jane Smith",
			// support_title: "UI Bug in Dashboard",
			// support_priority: "Medium",
			// support_end_date: "2024-12-15",
			// support_description: "UI elements are misaligned.",
		},
		emailMessage: `Hi {lead_name},
    
A new bug report has been submitted.

Lead Email: {lead_email}
lead subject: {lead_subject}
lead pipeline: {lead_pipeline}
lead stage : "lead_stage",
Details:
{lead_description}`,
	}
};

const MailCompose = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [selectedTemplate, setSelectedTemplate] = useState("Select Template");
	const [placeholders, setPlaceholders] = useState(templates["New Support Ticket"].placeholders);
	const [emailMessage, setEmailMessage] = useState(templates["New Support Ticket"].emailMessage);

	const handleTemplateChange = (templateName) => {
		setSelectedTemplate(templateName);
		setPlaceholders(templates[templateName].placeholders);
		setEmailMessage(templates[templateName].emailMessage);
	};

	const handleEmailMessageChange = (e) => {
		setEmailMessage(e.target.value);
	};
	const back = () => {
		navigate(-1);
	}
	const onFinish = () => {
		message.success('Email has been sent');
		navigate('/app/apps/mail/inbox');
	};

	return (
		<div>
			<div className="mail-compose bg-gray-100 m-[-24px] p-3 rounded-r-lg">

				<div className="mb-4 flex justify-end">
					<Col span={12} >
						{/* <label className="block text-gray-700 font-medium mb-2">Select Template</label> */}
						<select
							value={selectedTemplate}
							onChange={(e) => handleTemplateChange(e.target.value)}
							className="w-full border border-gray-300 rounded px-3 py-2"
						>
							{Object.keys(templates).map((template) => (
								<option key={template} value={template}>
									{template}
								</option>
							))}
						</select>
					</Col>
				</div>
				<div className="mb-4 ">
					<h2 className="text-lg font-semibold mb-2">Placeholders</h2>
					<ul className="bg-white p-4 rounded border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{Object.entries(placeholders).map(([key, value]) => (
							<li key={key} className="mb-1">
								<strong>{key}:</strong> {value}
							</li>
						))}
					</ul>
				</div>

				<div className="mb-4 ">

					<Form name="nest-messages" onFinish={onFinish} >
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item name='subject' label='Subject' rules={[{ required: true, message: 'Please enter a Subject.' }]} >
									<Input placeholder="Subject:" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name='from' label='From' rules={[{ required: true, message: 'Please enter a From.' }]} >
									<Input placeholder="From:" />
								</Form.Item>
							</Col>
							{/* <Form.Item>
 					<div className="mt-5 text-right">
 						<Button type="link" className="mr-2">
 							Save Darft
 						</Button>
 						<Button className="mr-2" onClick={back}>
 							Discard
 						</Button>
 						<Button type="primary" htmlType="submit">
 							Send
 						</Button>
 					</div>
 				</Form.Item> */}
						</Row>
					</Form>
				</div>

				<div className="mb-4">
					<label className="block text-gray-700 font-medium mb-2">Email Message</label>
					<textarea
						value={emailMessage}
						onChange={handleEmailMessageChange}
						className="w-full border border-gray-300 rounded px-3 py-2 h-40"
					></textarea>
				</div>
				<div className='flex justify-end'>
					<Button type="link" className="mr-2">
						Save Darft
					</Button>
					<Button className="mr-2" onClick={back}>
						Discard
					</Button>
					<Button type="primary" htmlType="submit">
						Send
					</Button>
				</div>
				{/* <Button type="primary" onClick={onFinish}>
        Send Email
      </Button> */}
			</div>
		</div>
	);
};

export default MailCompose;


// import React from 'react'
// import { Form, Input, Button, message } from 'antd';
// import ReactQuill from 'react-quill';
// import { useNavigate } from 'react-router-dom';

// const MailCompose = () => {

// 	const navigate = useNavigate()

// 	const modules = {
// 		toolbar: [
// 			[{ header: [1, 2, false] }],
// 			['bold', 'italic', 'underline'],
// 			['image', 'code-block']
// 		],
// 	}

// 	const back = () => {
// 		navigate(-1);
// 	}

// 	const onFinish = () => {
// 		message.success('Email has been sent');
// 		navigate('/app/apps/mail/inbox');
// 	}

// 	return (
// 		<div className="mail-compose">
// 			<h4 className="mb-4">New Message</h4>
// 			<Form  name="nest-messages" onFinish={onFinish} >
// 				<Form.Item name={['mail', 'to']}>
// 					<Input placeholder="To:"/>
// 				</Form.Item>
// 				<Form.Item name={['mail', 'cc']} >
// 					<Input placeholder="Cc:"/>
// 				</Form.Item>
// 				<Form.Item name={['mail', 'subject']} >
// 					<Input placeholder="Subject:"/>
// 				</Form.Item>
// 				<Form.Item name={['mail', 'content']}>
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

// export default MailCompose
