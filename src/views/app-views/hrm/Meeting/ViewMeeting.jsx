import React from 'react';
import { Modal, Row, Typography, message } from 'antd';
import moment from 'moment';

const { Text } = Typography;

const ViewMeeting = ({ visible, onClose }) => {
    // Static meeting data
    const meetingData = {
        id: "SXgFFkX3MfgZgDy1RDJ6LbA",
        title: "as",
        status: "cancelled",
        date: "2025-02-26T04:50:41.000Z",
        startTime: "04:50:44",
        endTime: "00:30:00",
        meetingLink: "Autem sapiente dolor",
        description: "<p>zxcsd</p>",
        created_by: "ty",
        createdAt: "2025-02-26T04:50:54.000Z",
        department: "Kj1NllmjwQfS2AnF5OnR2r6",
        employee: "[\"3WmeOO96yXIrBzhDBegXnrF\"]",
    };

    const rowStyle = {
        display: 'flex',
        padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
    };

    const labelStyle = {
        width: '150px',
        color: '#8c8c8c',
        fontSize: '14px',
    };

    const valueStyle = {
        flex: 1,
        fontSize: '14px',
    };

    return (
       
            <div style={{  }}>
                <h1 className='border-b border-gray-300 pb-2 '></h1>
                <Row style={rowStyle} className='mt-2'>
                    <Text style={labelStyle}>Title</Text>
                    <Text style={valueStyle}>{meetingData.title}</Text>
                </Row>

                <Row style={rowStyle}>
                    <Text style={labelStyle}>Status</Text>
                    <Text style={valueStyle}>{meetingData.status}</Text>
                </Row>

                <Row style={rowStyle}>
                    <Text style={labelStyle}>Date</Text>
                    <Text style={valueStyle}>
                        {moment(meetingData.date).format('DD-MM-YYYY')}
                    </Text>
                </Row>

                <Row style={rowStyle}>
                    <Text style={labelStyle}>Start Time</Text>
                    <Text style={valueStyle}>
                        {moment(meetingData.startTime, 'HH:mm:ss').format('h:mm A')}
                    </Text>
                </Row>

                <Row style={rowStyle}>
                    <Text style={labelStyle}>End Time</Text>
                    <Text style={valueStyle}>
                        {moment(meetingData.endTime, 'HH:mm:ss').format('h:mm A')}
                    </Text>
                </Row>

                <Row style={rowStyle}>
                    <Text style={labelStyle}>Meeting Link</Text>
                    <Text 
                        style={{...valueStyle, cursor: 'pointer', color: '#1890ff'}}
                        onClick={() => {
                            navigator.clipboard.writeText(meetingData.meetingLink);
                            message.success('Meeting link copied to clipboard!');
                        }}
                    >
                        {meetingData.meetingLink}
                    </Text>
                </Row>

                <Row style={rowStyle}>
                    <Text style={labelStyle}>Description</Text>
                    <div style={valueStyle} dangerouslySetInnerHTML={{ __html: meetingData.description }} />
                </Row>

                <Row style={rowStyle}>
                    <Text style={labelStyle}>Created By</Text>
                    <Text style={valueStyle}>{meetingData.created_by}</Text>
                </Row>

                <Row style={rowStyle}>
                    <Text style={labelStyle}>Department</Text>
                    <Text style={valueStyle}>{meetingData.department}</Text>
                </Row>

                <Row style={rowStyle}>
                    <Text style={labelStyle}>Employees</Text>
                    <Text style={valueStyle}>
                        {JSON.parse(meetingData.employee).join(', ')}
                    </Text>
                </Row>
            </div>
    );
};

export default ViewMeeting;



