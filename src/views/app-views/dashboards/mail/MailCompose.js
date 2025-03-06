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
			support_name: "John Doe",
			support_title: "Issue with login",
			support_priority: "High",
			support_end_date: "2024-12-20",
			support_description: "Cannot log into the account.",
			ticket_id: "TKT-001",
			assigned_to: "Support Team",
			department: "Technical Support"
		},
		emailMessage: `Dear {support_name},

A new support ticket has been created for {app_name}.

Ticket Details:
---------------
Ticket ID: {ticket_id}
Title: {support_title}
Priority: {support_priority}
End Date: {support_end_date}
Assigned To: {assigned_to}
Department: {department}

Description:
{support_description}

Please contact {company_name} support team if you have any questions.

Best regards,
{company_name} Support Team`
	},
	"Welcome Email": {
		placeholders: {
			user_name: "John Doe",
			company_name: "My Company",
			app_name: "My App",
			login_url: "https://myapp.com/login",
			support_email: "support@myapp.com",
			help_center_url: "https://help.myapp.com",
			getting_started_url: "https://myapp.com/getting-started"
		},
		emailMessage: `Welcome to {app_name}, {user_name}!

We're excited to have you on board with {company_name}. Here's everything you need to get started:

1. Login to your account: {login_url}
2. Check out our getting started guide: {getting_started_url}
3. Browse our help center: {help_center_url}

If you need any assistance, please don't hesitate to contact us at {support_email}.

Best regards,
The {company_name} Team`
	},
	"Invoice Payment": {
		placeholders: {
			client_name: "John Doe",
			company_name: "My Company",
			invoice_number: "INV-001",
			invoice_date: "2024-03-06",
			due_date: "2024-03-20",
			amount: "$1,000.00",
			payment_link: "https://payment.mycompany.com/inv-001",
			currency: "USD",
			payment_terms: "Net 15"
		},
		emailMessage: `Dear {client_name},

This email is to inform you that invoice #{invoice_number} has been generated for your recent services with {company_name}.

Invoice Details:
---------------
Invoice Number: {invoice_number}
Date Issued: {invoice_date}
Due Date: {due_date}
Amount Due: {amount} {currency}
Payment Terms: {payment_terms}

To make your payment, please click here: {payment_link}

If you have any questions about this invoice, please don't hesitate to contact us.

Thank you for your business!

Best regards,
{company_name} Team`
	},
	"Meeting Schedule": {
		placeholders: {
			recipient_name: "John Doe",
			meeting_title: "Project Review",
			meeting_date: "March 10, 2024",
			meeting_time: "10:00 AM EST",
			meeting_duration: "1 hour",
			meeting_link: "https://meet.google.com/xxx",
			agenda: "1. Project Updates\n2. Timeline Review\n3. Next Steps",
			host_name: "Jane Smith",
			host_title: "Project Manager"
		},
		emailMessage: `Dear {recipient_name},

You are invited to attend a meeting for {meeting_title}.

Meeting Details:
---------------
Date: {meeting_date}
Time: {meeting_time}
Duration: {meeting_duration}
Meeting Link: {meeting_link}

Agenda:
{agenda}

Host: {host_name}
Title: {host_title}

Please confirm your attendance by accepting the calendar invitation.

Best regards,
{host_name}`
	},
	"Password Reset": {
		placeholders: {
			user_name: "John Doe",
			reset_link: "https://myapp.com/reset-password",
			expiry_time: "1 hour",
			company_name: "My Company",
			support_email: "support@mycompany.com",
			app_name: "My App"
		},
		emailMessage: `Dear {user_name},

We received a request to reset your password for your {app_name} account.

To reset your password, please click on the following link:
{reset_link}

Please note that this link will expire in {expiry_time}.

If you didn't request this password reset, please ignore this email or contact us at {support_email}.

Best regards,
{company_name} Security Team`
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
	const [currentTemplate, setCurrentTemplate] = useState(null);

	const handleTemplateChange = (templateName) => {
		setSelectedTemplate(templateName);
		setPlaceholders(templates[templateName].placeholders);
		setCurrentTemplate(templates[templateName].emailMessage || '');
		
		// Update the message with default placeholder values
		const updatedMessage = replacePlaceholders(
			templates[templateName].emailMessage || '',
			templates[templateName].placeholders
		);
		setEmailMessage(updatedMessage);

		form.setFieldsValue({
			message: updatedMessage
		});
	};

	// Update this function to handle placeholder changes
	const handlePlaceholderChange = (key, value) => {
		const newPlaceholders = {
			...placeholders,
			[key]: value
		};
		setPlaceholders(newPlaceholders);

		// Update email message with new placeholder values
		if (currentTemplate) {
			const updatedMessage = replacePlaceholders(currentTemplate, newPlaceholders);
			setEmailMessage(updatedMessage);
			form.setFieldsValue({
				message: updatedMessage
			});
		}
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
					navigate('/app/dashboards/mail/inbox');
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
											<Form.Item 
												label={key} 
												name={['placeholders', key]} 
												initialValue={value}
											>
												<Input
													value={placeholders[key]}
													onChange={(e) => handlePlaceholderChange(key, e.target.value)}
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
								readOnly={selectedTemplate !== "Select Template"}
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
