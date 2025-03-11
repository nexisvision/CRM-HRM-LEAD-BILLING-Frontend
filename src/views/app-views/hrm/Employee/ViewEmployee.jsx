import React, { useEffect } from 'react';
import { Avatar, Row, Col, Typography, Divider } from 'antd';
import {
  UserOutlined,
  BankOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { empdata } from './EmployeeReducers/EmployeeSlice';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const ViewEmployee = ({ employeeIdd, visible, close }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const alladatas = useSelector((state) => state.employee.employee.data);
  const alladata = alladatas?.find((item) => item.id === employeeIdd);

  if (!alladata) return null;

  const InfoItem = ({ icon, label, value, color = "text-blue-500" }) => (
    <div className="flex items-center mb-6">
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${color} bg-opacity-10 mr-4 transform transition-transform hover:scale-105`}>
        <span className={`${color} text-xl`}>{icon}</span>
      </div>
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</div>
        <div className="text-gray-800 font-medium text-base">{value || 'N/A'}</div>
      </div>
    </div>
  );

  const formatDate = (date) => {
    return date ? dayjs(date).format('DD MMM YYYY') : 'N/A';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.857 8.485 15.272 9.9l9.9-9.9h-2.83zM32 0l-3.486 3.485-1.414-1.414L30.587 0H32zM0 0c0 3.373 2.73 6.103 6.103 6.103S12.207 3.373 12.207 0H0zm0 10.93c0 3.374 2.73 6.105 6.103 6.105S12.207 14.304 12.207 10.93H0zm0 10.93c0 3.373 2.73 6.104 6.103 6.104S12.207 24.604 12.207 21.23H0zm0 10.93c0 3.373 2.73 6.103 6.103 6.103S12.207 34.977 12.207 31.604H0zm0 10.93c0 3.374 2.73 6.104 6.103 6.104S12.207 45.907 12.207 42.534H0zm0 10.93c0 3.373 2.73 6.103 6.103 6.103S12.207 56.836 12.207 53.463H0zm13.357-52.19c0 3.373 2.73 6.103 6.103 6.103s6.103-2.73 6.103-6.103H13.357zm0 10.93c0 3.374 2.73 6.105 6.103 6.105s6.103-2.73 6.103-6.105H13.357zm0 10.93c0 3.373 2.73 6.104 6.103 6.104s6.103-2.73 6.103-6.104H13.357zm0 10.93c0 3.373 2.73 6.103 6.103 6.103s6.103-2.73 6.103-6.103H13.357zm0 10.93c0 3.374 2.73 6.104 6.103 6.104s6.103-2.73 6.103-6.104H13.357zm0 10.93c0 3.373 2.73 6.103 6.103 6.103s6.103-2.73 6.103-6.103H13.357zM26.714 0c0 3.373 2.73 6.103 6.103 6.103S38.92 3.373 38.92 0H26.714zm0 10.93c0 3.374 2.73 6.105 6.103 6.105s6.103-2.73 6.103-6.105H26.714zm0 10.93c0 3.373 2.73 6.104 6.103 6.104s6.103-2.73 6.103-6.104H26.714zm0 10.93c0 3.373 2.73 6.103 6.103 6.103s6.103-2.73 6.103-6.103H26.714zm0 10.93c0 3.374 2.73 6.104 6.103 6.104s6.103-2.73 6.103-6.104H26.714zm0 10.93c0 3.373 2.73 6.103 6.103 6.103s6.103-2.73 6.103-6.103H26.714zM40.07 0c0 3.373 2.73 6.103 6.104 6.103S52.277 3.373 52.277 0H40.07zm0 10.93c0 3.374 2.73 6.105 6.104 6.105s6.103-2.73 6.103-6.105H40.07zm0 10.93c0 3.373 2.73 6.104 6.104 6.104s6.103-2.73 6.103-6.104H40.07zm0 10.93c0 3.373 2.73 6.103 6.104 6.103s6.103-2.73 6.103-6.103H40.07zm0 10.93c0 3.374 2.73 6.104 6.104 6.104s6.103-2.73 6.103-6.104H40.07zm0 10.93c0 3.373 2.73 6.103 6.104 6.103s6.103-2.73 6.103-6.103H40.07z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>
        <div className="relative flex items-start justify-between">
          <div className="flex items-center">
            <Avatar
              src={alladata.profilePic}
              icon={!alladata.profilePic && <UserOutlined />}
              size={100}
              className="ring-4 ring-white/30 shadow-xl"
            />
            <div className="ml-6">
              <Title level={3} className="text-white m-0 capitalize">
                {`${alladata.firstName} ${alladata.lastName}`}
              </Title>
              <div className="flex items-center mt-3">
                <MailOutlined className="text-lg mr-2" />
                <Text className="text-white opacity-90">{alladata.email}</Text>
              </div>
              <div className="flex items-center mt-2">
                <PhoneOutlined className="text-lg mr-2" />
                <Text className="text-white opacity-90">{alladata.phone}</Text>
              </div>
              <div className="flex items-center mt-2">
                <IdcardOutlined className="text-lg mr-2" />
                <Text className="text-white opacity-90">@{alladata.username}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 bg-gradient-to-b from-gray-50 to-white">
        <Row gutter={[48, 24]}>
          {/* Personal Details */}
          <Col span={12}>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <Title level={5} className="mb-6 flex items-center text-blue-700">
                <UserOutlined className="mr-2" />
                Personal Information
              </Title>
              <InfoItem
                icon={<EnvironmentOutlined />}
                label="Address"
                value={alladata.address}
                color="text-indigo-500"
              />
              <InfoItem
                icon={<GlobalOutlined />}
                label="State"
                value={alladata.state?.trim()}
                color="text-blue-500"
              />
              <InfoItem
                icon={<NumberOutlined />}
                label="GST Number"
                value={alladata.gstIn?.trim()}
                color="text-cyan-500"
              />
              <InfoItem
                icon={<IdcardOutlined />}
                label="Client ID"
                value={alladata.client_id}
                color="text-purple-500"
              />
              <InfoItem
                icon={<IdcardOutlined />}
                label="User ID"
                value={alladata.id}
                color="text-orange-500"
              />
            </div>
          </Col>

          {/* Bank Details */}
          <Col span={12}>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <Title level={5} className="mb-6 flex items-center text-blue-700">
                <BankOutlined className="mr-2" />
                Banking Information
              </Title>
              <InfoItem
                icon={<UserOutlined />}
                label="Account Holder"
                value={alladata.accountholder}
                color="text-indigo-500"
              />
              <InfoItem
                icon={<BankOutlined />}
                label="Bank Name"
                value={alladata.bankname?.trim()}
                color="text-purple-500"
              />
              <InfoItem
                icon={<IdcardOutlined />}
                label="Account Number"
                value={alladata.accountnumber?.toString()}
                color="text-pink-500"
              />
              <InfoItem
                icon={<SafetyCertificateOutlined />}
                label="IFSC Code"
                value={alladata.ifsc?.trim()}
                color="text-rose-500"
              />
              <InfoItem
                icon={<EnvironmentOutlined />}
                label="Bank Location"
                value={alladata.banklocation}
                color="text-blue-500"
              />
            </div>
          </Col>
        </Row>

        <Divider className="my-8" />

        {/* Metadata Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <Row>
            <Col span={24}>
              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-6">
                  <div>
                    <span className="text-gray-500">Created By:</span>{' '}
                    <span className="font-medium text-gray-800">{alladata.created_by}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>{' '}
                    <span className="font-medium text-gray-800">{formatDate(alladata.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div>
                    <span className="text-gray-500">Updated By:</span>{' '}
                    <span className="font-medium text-gray-800">{alladata.updated_by}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Updated:</span>{' '}
                    <span className="font-medium text-gray-800">{formatDate(alladata.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
