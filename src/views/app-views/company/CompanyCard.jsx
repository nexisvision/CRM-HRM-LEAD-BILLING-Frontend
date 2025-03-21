import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Menu,
  Tag,
  message,
  Button,
  Modal,
  Avatar,
  Dropdown,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  MailOutlined,
  LoginOutlined,
  EditOutlined,
  UserOutlined,
  MoreOutlined,
  PhoneOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import EditCompany from "./EditCompany";
import { ClientData } from "./CompanyReducers/CompanySlice";
import { getsubplandata } from "../subscribeduserplans/subplanReducer/subplanSlice";
import { useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";

const CompanyCard = ({ company, onEdit, onDelete, onUpgrade, onEmailUpdate }) => {
  const [isEditCompanyCardModalVisible, setIsEditCompanyCardModalVisible] =
    useState(false);
  const [comnyid, setCompnyid] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subscribedPlans = useSelector((state) => state.subplan?.subplan?.data || []);


  const hasActiveSubscription = subscribedPlans.some(
    plan => plan.client_id === company.id && plan.status !== 'cancelled'
  );

  const handleEdit = () => {
    setIsEditCompanyCardModalVisible(true);
    setCompnyid(company.id);
  };
  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getsubplandata());
  }, [dispatch]);


  const handleLoginAsCompany = (data) => {
    try {
      const tokens = localStorage.getItem("auth_token");

      setTimeout(() => {
        localStorage.setItem('autologintoken', tokens);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('USER');
        localStorage.removeItem('isAuth');
        localStorage.setItem('email', data.email);
        navigate(`/app/auth/login?email=${encodeURIComponent(data.email)}`);
        window.location.reload();
      }, 1000);

      setTimeout(() => {
        navigate(`/app/auth/login?email=${encodeURIComponent(data.email)}`);
      }, 1100);
    } catch (error) {
      console.error('Error during login:', error);
      message.error('Failed to login as company');
    }
  };

  const items = [
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: 'Login as Company',
      onClick: () => handleLoginAsCompany(company)
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => handleEdit()
    },
    {
      key: 'email',
      icon: <MdOutlineEmail />,
      label: 'Update Email',
      onClick: () => onEmailUpdate(company.id)
    },
    {
      key: 'upgrade',
      icon: <RocketOutlined />,
      label: 'Upgrade Plans',
      onClick: () => onUpgrade(company.id)
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      onClick: () => onDelete(company.id),
      danger: true
    }
  ];

  const getStatusStyles = (isActive) => ({
    active: {
      background: '#dcfce7', // Light mint green
      color: '#166534', // Dark green text
      border: '2px solid #22c55e', // Medium green border
      boxShadow: '0 2px 4px rgba(22, 101, 52, 0.06)',
      icon: <CheckCircleOutlined style={{
        fontSize: '12px',
        color: '#16a34a',
        filter: 'drop-shadow(0 1px 1px rgba(22, 101, 52, 0.1))'
      }} />,
      hover: {
        background: '#d1fae5', // Slightly darker on hover
        boxShadow: '0 3px 6px rgba(22, 101, 52, 0.1)'
      }
    },
    inactive: {
      background: '#fee2e2', // Light red
      color: '#991b1b', // Dark red text
      border: '2px solid #ef4444', // Medium red border
      boxShadow: '0 2px 4px rgba(153, 27, 27, 0.06)',
      icon: <CloseCircleOutlined style={{
        fontSize: '12px',
        color: '#dc2626',
        filter: 'drop-shadow(0 1px 1px rgba(153, 27, 27, 0.1))'
      }} />,
      hover: {
        background: '#fecaca', // Slightly darker on hover
        boxShadow: '0 3px 6px rgba(153, 27, 27, 0.1)'
      }
    }
  })[isActive ? 'active' : 'inactive'];

  return (
    <>
      <Card
        className="transform transition-all duration-300 hover:shadow-xl rounded-lg border border-gray-200 overflow-hidden w-full"
        bodyStyle={{ padding: 0 }}
      >
        {/* Company Header */}
        <div className="relative">
          {/* Background Pattern - Professional Gradient */}
          <div
            className="h-24 sm:h-28 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #F0F7FF 0%, #E6F0FF 100%)',
            }}
          >
            {/* Decorative Elements */}
            <div
              className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 transform rotate-45 translate-x-16 -translate-y-16"
              style={{
                background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(24, 144, 255, 0.05) 100%)',
                borderRadius: '50%'
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 transform -translate-x-8 translate-y-8"
              style={{
                background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.03) 100%)',
                borderRadius: '50%'
              }}
            />
          </div>

          {/* Company Avatar with Enhanced Styling */}
          <div className="absolute -bottom-4 sm:-bottom-6 left-4 sm:left-6">
            <div className="ring-4 ring-white rounded-full shadow-lg">
              <Avatar
                size={{ xs: 56, sm: 68, md: 68, lg: 68, xl: 68, xxl: 68 }}
                src={company.profilePic}
                icon={!company.profilePic && <UserOutlined />}
                className="shadow-sm"
                style={{
                  backgroundColor: !company.profilePic ? '#1890ff' : undefined,
                  border: '2px solid #fff'
                }}
              />
            </div>
          </div>

          {/* Action Menu with Improved Styling */}
          <div className="absolute top-4 right-3">
            <Dropdown
              overlay={<Menu items={items} />}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="default"
                className="border-0 shadow-sm flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
                style={{
                  borderRadius: '10px',
                  padding: 0
                }}
              >
                <MoreOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
              </Button>
            </Dropdown>
          </div>

          {/* Enhanced Status Badge */}
          <div className="absolute top-4 right-12 sm:right-14">
            {(() => {
              const statusStyle = getStatusStyles(hasActiveSubscription);
              return (
                <Tag
                  className="rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 flex items-center gap-1.5 transition-all duration-300 cursor-default"
                  style={{
                    background: statusStyle.background,
                    color: statusStyle.color,
                    border: statusStyle.border,
                    boxShadow: statusStyle.boxShadow,
                    fontSize: '10px',
                    fontWeight: 700,
                    lineHeight: '1',
                    minHeight: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    backdropFilter: 'blur(8px)',
                    transform: 'translateY(1px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = statusStyle.hover.background;
                    e.currentTarget.style.boxShadow = statusStyle.hover.boxShadow;
                    e.currentTarget.style.transform = 'translateY(0px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = statusStyle.background;
                    e.currentTarget.style.boxShadow = statusStyle.boxShadow;
                    e.currentTarget.style.transform = 'translateY(1px)';
                  }}
                >
                  <div className="flex items-center gap-1">
                    {statusStyle.icon}
                    <span style={{
                      position: 'relative',
                      top: '0.5px',
                      textShadow: '0 1px 1px rgba(0,0,0,0.05)'
                    }}>
                      {hasActiveSubscription ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </Tag>
              );
            })()}
          </div>
        </div>

        {/* Company Info Section */}
        <div className="pt-8 sm:pt-10 px-4 sm:px-6 pb-4">
          {/* Company Name and Basic Info */}
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">
              {company.username}
            </h3>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <MailOutlined className="text-blue-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">{company.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneOutlined className="text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">{company.phone || 'Not Available'}</span>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Company Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs text-gray-500">Employee ID</p>
                <Tooltip title={company.employeeId || 'Not Available'}>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {company.employeeId || 'Not Available'}
                  </p>
                </Tooltip>
              </div>
              <div>
                <p className="text-xs text-gray-500">GST Number</p>
                <Tooltip title={company.gstIn || 'Not Available'}>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {company.gstIn || 'Not Available'}
                  </p>
                </Tooltip>
              </div>
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <Tooltip title={company.address || 'Not Available'}>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {company.address || 'Not Available'}
                  </p>
                </Tooltip>
              </div>
              <div>
                <p className="text-xs text-gray-500">State</p>
                <Tooltip title={company.state || 'Not Available'}>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {company.state || 'Not Available'}
                  </p>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2 sm:space-y-3">
          {hasActiveSubscription ? (
            <Button
              type="default"
              icon={<RocketOutlined />}
              block
              className="h-9 sm:h-10 flex items-center justify-center border-green-400 text-green-600 bg-green-50 hover:bg-green-100 transition-colors duration-200"
              style={{
                borderWidth: '1px',
                borderRadius: '8px'
              }}
            >
              <span className="font-medium text-sm sm:text-base">Subscribed Plan Active</span>
            </Button>
          ) : (
            <Button
              type="default"
              icon={<RocketOutlined />}
              block
              onClick={() => onUpgrade(company.id)}
              className="h-9 sm:h-10 text-blue-600 border-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all duration-200"
              style={{ borderRadius: '8px' }}
            >
              <span className="font-medium text-sm sm:text-base">Upgrade to Premium</span>
            </Button>
          )}
        </div>

        {/* Login Button with Enhanced Styling */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <Button
            type="primary"
            icon={<LoginOutlined />}
            block
            onClick={() => handleLoginAsCompany(company)}
            className="bg-blue-600 hover:bg-blue-700 h-9 sm:h-10 flex items-center justify-center shadow-sm transition-all duration-200"
            style={{ borderRadius: '8px' }}
          >
            <span className="font-medium text-sm sm:text-base">Login as Company</span>
          </Button>
        </div>
      </Card>

      {/* Modal with Enhanced Styling */}
      {isEditCompanyCardModalVisible && (
        <Modal
          title={<span className="text-lg font-semibold">Edit Company</span>}
          visible={isEditCompanyCardModalVisible}
          onCancel={() => setIsEditCompanyCardModalVisible(false)}
          footer={null}
          width={800}
          bodyStyle={{ padding: '24px' }}
          className="company-edit-modal"
        >
          <EditCompany
            comnyid={comnyid}
            initialData={company}
            onClose={() => setIsEditCompanyCardModalVisible(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default CompanyCard;
