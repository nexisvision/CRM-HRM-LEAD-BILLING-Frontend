import React from 'react';
import { Modal, Avatar, Tag, Row, Col, Typography, Divider } from 'antd';
import {
    UserOutlined,
    BankOutlined,
    IdcardOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    DollarOutlined,
    SafetyCertificateOutlined,
    NumberOutlined,
    ApartmentOutlined,
    CreditCardOutlined,
    BranchesOutlined,
    SolutionOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const UserView = ({ data, visible, close }) => {
    if (!data) return null;

    const InfoItem = ({ icon, label, value, color = "text-blue-500" }) => (
        <div className="flex items-center mb-6 group">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${color} bg-opacity-10 mr-4 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-md`}>
                <span className={`${color} text-xl`}>{icon}</span>
            </div>
            <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</div>
                <div className="text-gray-800 font-medium text-base">{value || 'N/A'}</div>
            </div>
        </div>
    );

    return (
        <Modal
            visible={visible}
            onCancel={close}
            footer={null}
            width={900}
            className="user-profile-modal"
            title={null}
            closeIcon={<CloseOutlined className="text-lg" />}
            bodyStyle={{ padding: 0 }}
        >
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white">
                <div className="absolute inset-0 bg-black opacity-5"></div>
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.857 8.485 15.272 9.9l9.9-9.9h-2.83zM32 0l-3.486 3.485-1.414-1.414L30.587 0H32zM0 0c0 3.373 2.73 6.103 6.103 6.103S12.207 3.373 12.207 0H0zm0 10.93c0 3.374 2.73 6.105 6.103 6.105S12.207 14.304 12.207 10.93H0zm0 10.93c0 3.373 2.73 6.104 6.103 6.104S12.207 24.604 12.207 21.23H0zm0 10.93c0 3.373 2.73 6.103 6.103 6.103S12.207 34.977 12.207 31.604H0zm0 10.93c0 3.374 2.73 6.104 6.103 6.104S12.207 45.907 12.207 42.534H0zm0 10.93c0 3.373 2.73 6.103 6.103 6.103S12.207 56.836 12.207 53.463H0z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                }}></div>
                <div className="relative flex items-start justify-between">
                    <div className="flex items-start">
                        <Avatar
                            src={data.profilePic}
                            icon={!data.profilePic && <UserOutlined />}
                            size={100}
                            className="ring-4 ring-white/30 shadow-xl"
                        />
                        <div className="ml-6">
                            <Title level={3} className="text-white m-0">{data.username}</Title>
                            <div className="flex items-center mt-3">
                                <MailOutlined className="text-lg mr-2" />
                                <Text className="text-white opacity-90">{data.email}</Text>
                            </div>
                            <div className="flex items-center mt-2">
                                <PhoneOutlined className="text-lg mr-2" />
                                <Text className="text-white opacity-90">{data.phone || 'No Phone'}</Text>
                            </div>
                        </div>
                    </div>
                    <Tag
                        className="px-4 py-1 text-sm"
                        color={data.status === 'active' ? 'success' : 'error'}
                        icon={data.status === 'active' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                    >
                        {data.status?.toUpperCase() || 'N/A'}
                    </Tag>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 bg-gradient-to-b from-gray-50 to-white">
                <Row gutter={[48, 24]}>
                    {/* Employment Details */}
                    <Col span={12}>
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <Title level={5} className="mb-6 flex items-center text-indigo-700">
                                <SolutionOutlined className="mr-2" />
                                Employment Information
                            </Title>
                            <InfoItem
                                icon={<SafetyCertificateOutlined />}
                                label="Role"
                                value={data.role_name}
                                color="text-green-500"
                            />
                            <InfoItem
                                icon={<IdcardOutlined />}
                                label="Employee ID"
                                value={data.employeeId}
                                color="text-purple-500"
                            />
                            <InfoItem
                                icon={<ApartmentOutlined />}
                                label="Department"
                                value={data.department}
                                color="text-indigo-500"
                            />
                            <InfoItem
                                icon={<DollarOutlined />}
                                label="Salary"
                                value={data.salary}
                                color="text-emerald-500"
                            />
                        </div>
                    </Col>

                    {/* Bank Details */}
                    <Col span={12}>
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <Title level={5} className="mb-6 flex items-center text-indigo-700">
                                <BankOutlined className="mr-2" />
                                Banking Details
                            </Title>
                            <InfoItem
                                icon={<BankOutlined />}
                                label="Bank Name"
                                value={data.bankname}
                                color="text-blue-500"
                            />
                            <InfoItem
                                icon={<CreditCardOutlined />}
                                label="Account Number"
                                value={data.accountnumber}
                                color="text-cyan-500"
                            />
                            <InfoItem
                                icon={<NumberOutlined />}
                                label="IFSC Code"
                                value={data.ifsc}
                                color="text-orange-500"
                            />
                            <InfoItem
                                icon={<BranchesOutlined />}
                                label="Branch"
                                value={data.branch}
                                color="text-red-500"
                            />
                        </div>
                    </Col>
                </Row>

                <Divider className="my-8" />

                {/* Footer Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-600 bg-white rounded-lg p-4 shadow-sm">
                            <UserOutlined className="mr-2 text-indigo-500" />
                            <span className="font-medium">Created By:</span>
                            <span className="ml-2">{data.created_by}</span>
                        </div>
                        <div className="flex items-center text-gray-600 bg-white rounded-lg p-4 shadow-sm">
                            <CalendarOutlined className="mr-2 text-blue-500" />
                            <span className="font-medium">Joined:</span>
                            <span className="ml-2">{dayjs(data.joiningDate).format('DD MMM YYYY')}</span>
                        </div>
                        <div className="flex items-center text-gray-600 bg-white rounded-lg p-4 shadow-sm">
                            <ClockCircleOutlined className="mr-2 text-purple-500" />
                            <span className="font-medium">Updated:</span>
                            <span className="ml-2">{dayjs(data.updatedAt).format('DD MMM YYYY')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .user-profile-modal .ant-modal-content {
                    overflow: hidden;
                    border-radius: 16px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                .user-profile-modal .ant-modal-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.2s ease;
                    z-index: 1000;
                }
                .user-profile-modal .ant-modal-close:hover {
                    background: rgba(255, 255, 255, 0.25);
                    transform: scale(1.05);
                    border-color: rgba(255, 255, 255, 0.3);
                }
                .user-profile-modal .ant-modal-close-x {
                    width: 36px;
                    height: 36px;
                    font-size: 18px;
                    line-height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .user-profile-modal .ant-modal-close-x .anticon {
                    vertical-align: 0;
                }
                .user-profile-modal .ant-tag {
                    font-weight: 500;
                    border-radius: 6px;
                }
                .user-profile-modal .ant-divider {
                    border-color: rgba(0,0,0,0.06);
                }
            `}</style>
        </Modal>
    );
};

export default UserView; 