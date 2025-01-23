import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Card, Row, Col, Modal, Form, Input, Select, TimePicker, Button, Tooltip, DatePicker, message } from 'antd';
import CalendarData from './CalendarData';
import dayjs from 'dayjs';
import { CalendarOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addcalends, getcalends, deletecalends } from './calanderReducer/calanderSlice';
import moment from 'moment';

const { Option } = Select;

const badgeColors = [
	'pink',
	'red',
	'yellow',
	'orange',
	'cyan',
	'green',
	'blue',
	'purple',
	'geekblue',
	'magenta',
	'volcano',
	'gold',
	'lime',
];

const initialFormValues = {
	title: '',
	start: dayjs('00:00:00', 'HH:mm:ss'),
	end: dayjs('00:00:00', 'HH:mm:ss'),
	bullet: badgeColors[0]
}

const dateFormat = 'DD MMMM'

const EventCard = ({ event }) => (
	<div 
		className="event-card mb-3" 
		style={{ borderLeft: `4px solid ${event.color}` }}
	>
		<h5 className="event-card-title">{event.name}</h5>
		<div className="event-card-time">
			<div>{moment(event.startDate).format('MMM DD, YYYY')}</div>
			<div className="text-muted">
				{moment(event.startDate).format('HH:mm')} - 
				{moment(event.endDate).format('HH:mm')}
			</div>
		</div>
	</div>
);

const SidebarEvents = ({ events, onDeleteEvent }) => {
	const sortedEvents = Array.isArray(events) 
		? [...events].sort((a, b) => moment(a.startDate).valueOf() - moment(b.startDate).valueOf())
		: [];

	const handleDelete = (event) => {
		Modal.confirm({
			title: 'Delete Event',
			content: `Are you sure you want to delete "${event.name}"?`,
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				onDeleteEvent(event.id);
			},
		});
	};

	return (
		<div className="sidebar-events">
			<h4 className="mb-3">Upcoming Events</h4>
			{sortedEvents.length === 0 ? (
				<div className="text-muted">No events scheduled</div>
			) : (
				sortedEvents.map((event) => (
					<div key={event.id} className="event-card-wrapper">
						<div 
							className="event-card mb-3" 
							style={{ borderLeft: `4px solid ${event.color}`,paddingLeft:"12px" }}
						>
							<h5 className="event-card-title">{event.name}</h5>
							<div className="event-card-time">
								<div>{moment(event.startDate).format('MMM DD, YYYY')}</div>
								<div className="text-muted">
									{moment(event.startDate).format('HH:mm')} - 
									{moment(event.endDate).format('HH:mm')}
								</div>
							</div>
							<div className="event-card-actions">
								<Tooltip title="Delete event">
									<DeleteOutlined 
										onClick={() => handleDelete(event)}
										className="delete-icon"
									/>
								</Tooltip>
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
};

const EventModal = ({ open, addEvent, cancel }) => {
	const [form] = Form.useForm();
	const onSubmit = values => {
		addEvent(values)
	}

	useEffect(() => {
	form.setFieldsValue(initialFormValues);
	});

	return (
		<Modal
			title="New Event"
			open={open}
			footer={null}
			destroyOnClose={true}
			onCancel={cancel}
		>
			<Form
				form={form}
				layout="vertical" 
				name="new-event"
				preserve={false}
				onFinish={onSubmit}
			>
				<Form.Item name="title" label="Title">
					<Input autoComplete="off" />
				</Form.Item>
				<Row gutter="16">
					<Col span={12} >
						<Form.Item name="start" label="Start">
							<TimePicker className="w-100" />
						</Form.Item>
					</Col>
					<Col span={12} >
						<Form.Item name="end" label="End">
							<TimePicker className="w-100" />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item name="bullet" label="Label">
					<Select>
						{
							badgeColors.map(elm => (
								<Option value={elm} key={elm}>
									<Badge color={elm} />
									<span className="text-capitalize font-weight-semibold">{elm}</span>
								</Option>
							))
						}
					</Select>
				</Form.Item>
				<Form.Item className="text-right mb-0">
					<Button type="primary" htmlType="submit">
						Add Event
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	)
}

const CalendarApp = () => {
	const dispatch = useDispatch();
	const allclanderdata = useSelector((state) => state.calendar);
	const realdata = allclanderdata?.calendar?.data || [];
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);
	const [form] = Form.useForm();

	useEffect(() => {
		dispatch(getcalends());
	}, [dispatch]);

	const onDeleteEvent = async (eventId) => {
		try {
			await dispatch(deletecalends(eventId));
			await dispatch(getcalends());
			message.success('Event deleted successfully');
		} catch (error) {
			message.error('Failed to delete event');
			console.error('Delete error:', error);
		}
	};

	const onAddEvent = async (values) => {
		try {
			const eventData = {
				name: values.name,
				color: values.color,
				startDate: moment(selectedDate).set({
					hour: values.startTime.hour(),
					minute: values.startTime.minute()
				}).toISOString(),
				endDate: moment(selectedDate).set({
					hour: values.endTime.hour(),
					minute: values.endTime.minute()
				}).toISOString(),
			};

			await dispatch(addcalends(eventData));
			await dispatch(getcalends());
			setModalVisible(false);
			form.resetFields();
			message.success('Event added successfully');
		} catch (error) {
			message.error('Failed to add event');
			console.error('Add event error:', error);
		}
	};

	const cellRender = value => {
		const currentDate = value.format('YYYY-MM-DD');
		const listData = Array.isArray(realdata) 
			? realdata.filter(event => {
				const eventStart = new Date(event.startDate);
				return eventStart.toISOString().split('T')[0] === currentDate;
			}) 
			: [];
		
		return (
			<ul className="calendar-event">
				{listData.map((item, i) => (
					<li key={`${item.name}-${i}`}>
						<Badge color={item.color} text={item.name}/>
					</li>
				))}
			</ul>
		);
	};

	const handleDateSelect = (date) => {
		setSelectedDate(date.format('YYYY-MM-DD'));
		setModalVisible(true);
	};

	return (
		<div className="calendar-container">
			<Row gutter={16}>
				<Col xs={24} sm={24} md={8} lg={6}>
					<Card className="sidebar-card">
						<SidebarEvents 
							events={realdata}
							onDeleteEvent={onDeleteEvent}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={24} md={16} lg={18}>
					<Card className="mb-4">
						<Calendar 
							cellRender={cellRender}
							onSelect={handleDateSelect}
						/>
					</Card>
				</Col>
			</Row>

			<Modal
				title="Add New Event"
				visible={modalVisible}
				onCancel={() => {
					setModalVisible(false);
					form.resetFields();
				}}
				onOk={() => form.submit()}
				destroyOnClose
			>
				<Form
					form={form}
					onFinish={onAddEvent}
					layout="vertical"
				>
					<Form.Item
						label="Event Name"
						name="name"
						rules={[{ required: true, message: 'Please enter event name' }]}
					>
						<Input placeholder="Enter event name" />
					</Form.Item>
					
					<Form.Item
						label="Event Color"
						name="color"
						rules={[{ required: true, message: 'Please select event color' }]}
					>
						<Select>
							<Select.Option value="#1890ff">Blue</Select.Option>
							<Select.Option value="#f5222d">Red</Select.Option>
							<Select.Option value="#52c41a">Green</Select.Option>
							<Select.Option value="#faad14">Yellow</Select.Option>
							<Select.Option value="#722ed1">Purple</Select.Option>
							<Select.Option value="#eb2f96">Pink</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="Start Time"
						name="startTime"
						rules={[{ required: true, message: 'Please select start time' }]}
					>
						<TimePicker format="HH:mm" />
					</Form.Item>

					<Form.Item
						label="End Time"
						name="endTime"
						rules={[
							{ required: true, message: 'Please select end time' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || !getFieldValue('startTime') || 
										value.isAfter(getFieldValue('startTime'))) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('End time must be after start time'));
								},
							}),
						]}
					>
						<TimePicker format="HH:mm" />
					</Form.Item>

					<div className="selected-date-info" style={{ marginBottom: 16 }}>
						<InfoCircleOutlined style={{ marginRight: 8 }} />
						Selected Date: {selectedDate ? moment(selectedDate).format('MMMM D, YYYY') : 'None'}
					</div>
				</Form>
			</Modal>
		</div>
	);
};

const styles = `
	.event-card-wrapper {
		position: relative;
	}

	.event-card-wrapper.deleting {
		opacity: 0.5;
		pointer-events: none;
	}

	.delete-icon {
		transition: all 0.3s;
	}

	.delete-icon:hover {
		transform: scale(1.1);
		color: #ff1f1f;
	}

	.ant-modal-confirm-btns .ant-btn-dangerous {
		background-color: #ff4d4f;
		border-color: #ff4d4f;
		color: white;
	}

	.ant-modal-confirm-btns .ant-btn-dangerous:hover {
		background-color: #ff7875;
		border-color: #ff7875;
	}

	.selected-date-info {
		padding: 8px;
		background-color: #f5f5f5;
		border-radius: 4px;
		color: #666;
		font-size: 14px;
	}

	.ant-form-item-label > label {
		font-weight: 500;
	}

	.ant-picker {
		width: 100%;
	}
`;

const CalendarAppWithStyles = () => (
	<>
		<style>{styles}</style>
		<CalendarApp />
	</>
);

export default CalendarAppWithStyles;

