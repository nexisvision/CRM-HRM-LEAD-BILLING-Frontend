import React, { useEffect } from 'react';
import { Modal, Button, Tag } from 'antd';
import {
  CrownOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  UserOutlined,
  CloudUploadOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { GetPlan } from './PlanReducers/PlanSlice';

const ViewPlanModal = ({ visible, onClose, plan, currencyData, isAdmin, onEdit, onDelete, onBuy }) => {
  const selectedCurrency = Array.isArray(currencyData) &&
    currencyData.find((item) => item.id === plan?.currency);
    const dispatch = useDispatch()

    const alllogedata = useSelector((state) => state.user.loggedInUser.id)

    useEffect(() => {
      dispatch(GetPlan())
    }, [dispatch])
  
    const alldatas = useSelector((state) => state.Plan.Plan)

    let plans = null;
    if (alldatas?.length) {
      if (plan?.related_id) {
        plans = alldatas.find((item) => item?.id === plan.related_id);
      } else if (plan?.id) {
        plans = alldatas.find((item) => item?.id === plan.id);
      }
    }
    plan = plans || plan || null;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CrownOutlined className="text-2xl text-yellow-500" />
          <span className="text-xl font-bold text-blue-600">
            {plan?.name}
          </span>
          {plan?.status === 'active' ? (
            <Tag color="success" className="ml-2">Active</Tag>
          ) : (
            <Tag color="error" className="ml-2">Inactive</Tag>
          )}
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={
        <div className="flex justify-end gap-4">
          <Button onClick={onClose}>Close</Button>
          {!isAdmin && plan?.status === 'active' ? (
            <Button
              type="primary"
              onClick={() => {
                onBuy(plan);
                onClose();
              }}
              className="bg-blue-600 hover:bg-blue-700 border-0"
            >
              Choose Plan
            </Button>
          ) : isAdmin && (
            <div className="flex gap-2">
              <Button
                type="primary"
                onClick={() => {
                  onEdit(plan.id);
                  onClose();
                }}
              >
                Edit Plan
              </Button>
              <Button
                danger
                onClick={() => {
                  onDelete(plan.id);
                  onClose();
                }}
              >
                Delete Plan
              </Button>
            </div>
          )}
        </div>
      }
      width={800}
      className="plan-details-modal"
    >
      <div className="space-y-8 py-6">
        {/* Price Section */}
        <div className="text-center bg-blue-50 p-8 rounded-xl shadow-inner">
          <div className="text-6xl font-bold text-blue-600">
            <span className="text-3xl">{selectedCurrency?.currencyIcon || ''}</span>
            {plan?.price}
          </div>
          <div className="text-gray-600 font-medium mt-2">
            per {plan?.duration ? plan?.duration.toLowerCase() : 'N/A'}
          </div>
          {plan?.trial && (
            <Tag color="gold" className="mt-4 px-4 py-2 rounded-full text-sm font-medium">
              {plan?.trial_period} Days Free Trial
            </Tag>
          )}
        </div>

        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <InfoCircleOutlined className="text-blue-500" />
            Basic Details
          </h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="text-gray-500">Plan Name</span>
              <p className="font-medium text-gray-800">{plan?.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Duration</span>
              <p className="font-medium text-gray-800">{plan?.duration}</p>
            </div>
            <div>
              <span className="text-gray-500">Currency</span>
              <p className="font-medium text-gray-800 flex items-center gap-1">
                {selectedCurrency?.currencyIcon} {selectedCurrency?.currencyName}
                <span className="text-gray-400 text-sm">({selectedCurrency?.currencyCode})</span>
              </p>
            </div>
            <div>
              <span className="text-gray-500">Trial Period</span>
              <p className="font-medium text-gray-800">
                {plan?.trial ? `${plan.trial_period} Days` : 'No Trial'}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Limits */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TeamOutlined className="text-green-500" />
            Usage Limits
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <UserOutlined className="text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Maximum Users</div>
                  <div className="font-semibold text-lg">{plan?.max_users} users</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <TeamOutlined className="text-green-500" />
                <div>
                  <div className="text-sm text-gray-500">Maximum Customers</div>
                  <div className="font-semibold text-lg">{plan?.max_customers} customers</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <TeamOutlined className="text-purple-500" />
                <div>
                  <div className="text-sm text-gray-500">Maximum Vendors</div>
                  <div className="font-semibold text-lg">{plan?.max_vendors} vendors</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <TeamOutlined className="text-cyan-500" />
                <div>
                  <div className="text-sm text-gray-500">Maximum Clients</div>
                  <div className="font-semibold text-lg">{plan?.max_clients} clients</div>
                </div>
              </div>
            </div>
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <CloudUploadOutlined className="text-amber-500" />
                <div>
                  <div className="text-sm text-gray-500">Storage Limit</div>
                  <div className="font-semibold text-lg">{plan?.storage_limit} GB</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {plan?.description && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <InfoCircleOutlined className="text-indigo-500" />
              Description
            </h3>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {plan.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewPlanModal; 