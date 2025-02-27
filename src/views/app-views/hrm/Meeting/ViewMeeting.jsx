import { message } from 'antd';
import React, { useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { MeetData } from './MeetingReducer/MeetingSlice';

const { Text } = Typography;

const ViewMeeting = ({ visible, onClose, meetid }) => {
    const dispatch = useDispatch();

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

    useEffect(() => {
        dispatch(MeetData())
    }, [dispatch])

    const alladatas = useSelector((state) => state.Meeting.Meeting.data);
    const fndata = alladatas;
    const alladata = fndata?.find((item) => item.id === meetid);

    // Handle copying meeting link
    const handleCopyLink = () => {
        if (alladata?.meeting_link) {
            navigator.clipboard.writeText(alladata.meeting_link);
            message.success('Meeting link copied to clipboard!');
        } else {
            message.warning('No meeting link available');
        }
    };

    return (
        <div>
            <h1 className='border-b border-gray-300 pb-2 '></h1>
            <Row style={rowStyle} className='mt-2'>
                <Text style={labelStyle}>Title</Text>
                <Text style={valueStyle}>{alladata?.title}</Text>
            </Row>

            <Row style={rowStyle}>
                <Text style={labelStyle}>Status</Text>
                <Text style={valueStyle}>{alladata?.status}</Text>
            </Row>

            <Row style={rowStyle}>
                <Text style={labelStyle}>Date</Text>
                <Text style={valueStyle}>
                    {moment(alladata?.date).format('DD-MM-YYYY')}
                </Text>
            </Row>

            <Row style={rowStyle}>
                <Text style={labelStyle}>Start Time</Text>
                <Text style={valueStyle}>
                    {moment(alladata?.startTime, 'HH:mm:ss').format('h:mm A')}
                </Text>
            </Row>

            <Row style={rowStyle}>
                <Text style={labelStyle}>End Time</Text>
                <Text style={valueStyle}>
                    {moment(alladata?.endTime, 'HH:mm:ss').format('h:mm A')}
                </Text>
            </Row>

            <Row style={rowStyle}>
                <Text style={labelStyle}>Meeting Link</Text>
                <Text
                    style={{ ...valueStyle, cursor: 'pointer', color: '#1890ff' }}
                    onClick={() => {
                        navigator.clipboard.writeText(alladata.meetingLink);
                        message.success('Meeting link copied to clipboard!');
                    }}
                >
                    {alladata.meetingLink}
                </Text>
            </Row>

            <Row style={rowStyle}>
                <Text style={labelStyle}>Description</Text>
                <div style={valueStyle} dangerouslySetInnerHTML={{ __html: alladata?.description }} />
            </Row>

            <Row style={rowStyle}>
                <Text style={labelStyle}>Created By</Text>
                <Text style={valueStyle}>{alladata?.created_by}</Text>
            </Row>

            {/* Commented sections can be uncommented when department and employee data is available */}
            {/* <Row style={rowStyle}>
                <Text style={labelStyle}>Department</Text>
                <Text style={valueStyle}>{alladata?.department}</Text>
            </Row>

            <Row style={rowStyle}>
                <Text style={labelStyle}>Employees</Text>
                <Text style={valueStyle}>
                    {alladata?.employee && JSON.parse(alladata.employee).join(', ')}
                </Text>
            </Row> */}
        </div>
    );
};

export default ViewMeeting;



