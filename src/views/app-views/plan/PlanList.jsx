import React, { useEffect, useState } from "react";
import { Card, Button, Modal, message, Switch, Tag, Row, Col, Typography, Empty, Dropdown } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined, CloudUploadOutlined, TeamOutlined, CalendarOutlined, CrownOutlined, MoreOutlined } from "@ant-design/icons";
import AddPlan from "./AddPlan";
import EditPlan from "./EditPlan";
import { useDispatch, useSelector } from "react-redux";
import { DeleteP, GetPlan } from "./PlanReducers/PlanSlice";
import './PlanList.css'; // Import the CSS file
import { getcurren } from "../setting/currencies/currenciesSlice/currenciesSlice";
// import { getallcurrencies } from "../setting/currencies/currenciesreducer/currenciesSlice";

const { Title, Text } = Typography;

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [isAddPlanModalVisible, setIsAddPlanModalVisible] = useState(false);
  const [isEditPlanModalVisible, setIsEditPlanModalVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const dispatch = useDispatch();
  const Plandata = useSelector((state) => state.Plan);
  const allPlans = Plandata.Plan?.data || [];

  useEffect(() => {
    dispatch(GetPlan());
  }, [dispatch]);

  useEffect(() => {
    setPlans(allPlans);
  }, [allPlans]);

  const deletePlan = async (planId) => {
    try {
      await dispatch(DeleteP(planId));
      await dispatch(GetPlan());
      setPlans(plans.filter((plan) => plan.id !== planId));
      message.success({ content: 'Plan deleted successfully', duration: 2 });
    } catch (error) {
      message.error({ content: 'Failed to delete plan', duration: 2 });
      console.error('Error deleting plan:', error);
    }
  };

  const openAddPlanModal = () => setIsAddPlanModalVisible(true);
  const closeAddPlanModal = () => setIsAddPlanModalVisible(false);
  const openEditPlanModal = () => setIsEditPlanModalVisible(true);
  const closeEditPlanModal = () => setIsEditPlanModalVisible(false);

  const togglePlan = (id) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === id ? { ...plan, status: !plan.status } : plan
      )
    );
    message.success({ content: `Plan status updated`, duration: 2 });
  };

  const EditP = (id) => {
    openEditPlanModal();
    setIdd(id);
  };

  const getMenuItems = (planId) => [
    {
      key: '1',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => EditP(planId)
    },
    {
      key: '2',
      icon: <DeleteOutlined />,
      label: 'Delete',
      danger: true,
      onClick: () => deletePlan(planId)
    }
  ];

  useEffect(() => {
    dispatch(getcurren())
  }, [])

  const allempdatass = useSelector((state) => state.currencies);
  const currencyData = allempdatass?.currencies?.data || [];

  return (
    <div className="plan-list-container p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        <Row justify="space-between" align="middle" className="mb-8">
          <Col>
            <Title level={2} className="!mb-0">
              <CrownOutlined className="mr-2 text-yellow-500" />
              Subscription Plans
            </Title>
            <Text type="secondary">Manage your subscription plans</Text>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              onClick={openAddPlanModal}
              icon={<PlusOutlined />}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              Add New Plan
            </Button>
          </Col>
        </Row>

        {plans.length === 0 ? (
          <Empty description="No plans found" className="my-12" />
        ) : (
          <Row gutter={[24, 24]}>
            {plans.map((plan) => (
              <Col xs={24} sm={24} md={12} lg={8} xl={6} key={plan.id}>
                <Card
                  className="plan-card h-full  rounded-xl"
                  hoverable
                  title={
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xl font-bold text-gray-800">{plan.name}</span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={plan.status === 'active'}
                          onChange={() => togglePlan(plan.id)}
                          checkedChildren="Active"
                          unCheckedChildren="Inactive"
                        />
                        <Dropdown
                          menu={{ items: getMenuItems(plan.id) }}
                          placement="bottomRight"
                          trigger={['click']}
                        >
                          <Button type="text" icon={<MoreOutlined />} />
                        </Dropdown>
                      </div>
                    </div>
                  }
                >
                  <div className="space-y-6">
                    <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                      {(() => {
                        const selectedCurrency = Array.isArray(currencyData) && 
                          currencyData.find((item) => item.id === plan.currency);
                        return (
                          <>
                            <div className="text-4xl font-bold text-indigo-600">
                              <span className="text-xl">{selectedCurrency?.currencyIcon || ''}</span>
                              {plan.price}
                            </div>
                            <div className="text-gray-600 font-medium">per {plan.duration.toLowerCase()}</div>
                          </>
                        );
                      })()}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded">
                        <CalendarOutlined className="text-blue-500" />
                        <span className="font-medium">{plan.duration}</span>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded">
                        <UserOutlined className="text-green-500" />
                        <span className="font-medium">Max Users: {plan.max_users}</span>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded">
                        <TeamOutlined className="text-purple-500" />
                        <span className="font-medium">Max Clients: {plan.max_clients}</span>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded">
                        <CloudUploadOutlined className="text-cyan-500" />
                        <span className="font-medium">Storage: {plan.storage_limit} GB</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Tag color="blue" className="px-3 py-1 rounded-full">
                        Trial Period: {plan.trial_period} days
                      </Tag>
                    </div>

                    {plan.features && (
                      <div className="border-t pt-4">
                        <Text strong className="block mb-3">Features:</Text>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(JSON.parse(plan.features)).map(([key, value]) => (
                            <Tag
                              key={key}
                              color={value ? 'success' : 'error'}
                              className="px-3 py-1 rounded-full"
                            >
                              {key}: {value ? 'Enabled' : 'Disabled'}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}


        <Modal
          title={<Title level={4}>Add New Plan</Title>}
          visible={isAddPlanModalVisible}
          onCancel={closeAddPlanModal}
          footer={null}
          width={1000}
          className="mt-[-60px]"
        >
          <AddPlan onClose={closeAddPlanModal} />
        </Modal>

        <Modal
          title={<Title level={4}>Edit Plan</Title>}
          visible={isEditPlanModalVisible}
          onCancel={closeEditPlanModal}
          footer={null}
          width={1000}
          className="mt-[-60px]"
        >
          <EditPlan onClose={closeEditPlanModal} id={idd} />
        </Modal>
      </div>
    </div>
  );
};

export default PlanList;