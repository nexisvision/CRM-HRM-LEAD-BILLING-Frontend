// MailCompose.js
import React, { useState } from 'react';
import { Form, Input, Button, message, Col, Row, Card, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SendOutlined } from '@ant-design/icons';
import { sendmailslice } from './mailReducer/mailSlice.jsx';
import { useDispatch } from 'react-redux';

const { Option } = Select;
const { TextArea } = Input;

const templates = {
	"Select Template": {
		placeholders: {},
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
		},
		emailMessage: `Hi {lead_name},
    
A new lead has been assigned.

Lead Email: {lead_email}
Lead Subject: {lead_subject}
Lead Pipeline: {lead_pipeline}
Lead Stage: {lead_stage}

Details:
{lead_description}`,
	}
};

const MailCompose = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState("Select Template");
	const [placeholders, setPlaceholders] = useState({});
	const [emailMessage, setEmailMessage] = useState('');

	const handleTemplateChange = (templateName) => {
		setSelectedTemplate(templateName);
		setPlaceholders(templates[templateName].placeholders);
		setEmailMessage(templates[templateName].emailMessage || '');

		form.setFieldsValue({
			message: templates[templateName].emailMessage || ''
		});
	};

	// Replace placeholders in template with actual values
	const replacePlaceholders = (template, data) => {
		let message = template;
		Object.entries(data).forEach(([key, value]) => {
			message = message.replace(new RegExp(`{${key}}`, 'g'), value);
		});
		return message;
	};

	const onFinish = async (values) => {
		try {
			setLoading(true);

			let finalMessage = values.message;
			if (selectedTemplate !== "Select Template") {
				finalMessage = replacePlaceholders(emailMessage, placeholders);
			}

			// Format the payload exactly as required
			const emailData = {
				to: values.to, // Now values.to is already a string
				subject: values.subject,
				html: finalMessage
			};

			dispatch(sendmailslice(emailData))
				.then(() => {
					message.success('Email sent successfully');
					navigate('/app/apps/mail/inbox');
				})
				.catch((error) => {
					message.error('Failed to send email: ' + (error.message || 'Unknown error'));
				});

		} catch (error) {
			message.error('Failed to send email: ' + (error.message || 'Unknown error'));
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="mail-compose">
			<Form form={form} onFinish={onFinish} layout="vertical">
				<Row gutter={16}>
					{/* Template Selection */}
					<Col span={24}>
						<Form.Item label="Select Template">
							<Select
								value={selectedTemplate}
								onChange={handleTemplateChange}
								style={{ width: '100%' }}
							>
								{Object.keys(templates).map((template) => (
									<Option key={template} value={template}>
										{template}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>

					{/* Placeholders Display */}
					{Object.keys(placeholders).length > 0 && (
						<Col span={24}>
							<Card title="Template Placeholders" size="small" className="mb-4">
								<Row gutter={[16, 8]}>
									{Object.entries(placeholders).map(([key, value]) => (
										<Col xs={24} sm={12} md={8} key={key}>
											<Form.Item label={key} name={['placeholders', key]} initialValue={value}>
												<Input
													onChange={(e) => {
														setPlaceholders(prev => ({
															...prev,
															[key]: e.target.value
														}));
													}}
												/>
											</Form.Item>
										</Col>
									))}
								</Row>
							</Card>
						</Col>
					)}

					{/* Email Form Fields */}
					<Col span={24}>
						<Form.Item
							name="to"
							rules={[
								{
									required: true,
									message: 'Please enter recipient email'
								},
								{
									type: 'email',
									message: 'Please enter a valid email address'
								}
							]}
						>
							<Input
								placeholder="To: example@gmail.com"
								type="email"
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item
							name="subject"
							rules={[{ required: true, message: 'Please enter subject' }]}
						>
							<Input placeholder="Subject:" />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item
							name="message"
							rules={[{ required: true, message: 'Please enter message' }]}
						>
							<TextArea
								rows={10}
								value={emailMessage}
								onChange={(e) => setEmailMessage(e.target.value)}
								placeholder="Write your message here..."
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className="text-right">
					<Button className="mr-2" onClick={() => navigate(-1)}>
						Discard
					</Button>
					<Button
						type="primary"
						htmlType="submit"
						loading={loading}
						icon={<SendOutlined />}
					>
						Send
					</Button>
				</div>
			</Form>
		</Card>
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
