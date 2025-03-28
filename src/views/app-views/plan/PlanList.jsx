import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  message,
  Switch,
  Tag,
  Row,
  Col,
  Typography,
  Empty,
  Dropdown,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  CloudUploadOutlined,
  TeamOutlined,
  CalendarOutlined,
  CrownOutlined,
  MoreOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  ShopOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import AddPlan from "./AddPlan";
import EditPlan from "./EditPlan";
import ViewPlanModal from "./ViewPlanModal";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteP,
  Editplan,
  GetPlan,
  planbutus,
} from "./PlanReducers/PlanSlice";
import "./PlanList.css"; // Import the CSS file
import { getcurren } from "../setting/currencies/currenciesSlice/currenciesSlice";
import { getRoles } from "../hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice";
import moment from "moment";
import { getsubplandata } from "../subscribeduserplans/subplanReducer/subplanSlice";

const { Title, Text } = Typography;

const PlanList = () => {
  const [isAddPlanModalVisible, setIsAddPlanModalVisible] = useState(false);
  const [isEditPlanModalVisible, setIsEditPlanModalVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [viewPlanModalVisible, setViewPlanModalVisible] = useState(false);
  const [selectedViewPlan, setSelectedViewPlan] = useState(null);
  const dispatch = useDispatch();
  const Plandata = useSelector((state) => state.Plan);
  const allPlans = Plandata.Plan || [];

  const roleid = useSelector((state) => state.user.loggedInUser.role_id);

  const role = useSelector((state) => state.role.role.data || []);

  const roleidd = role.find((item) => item.id === roleid);
  const isAdmin = roleidd?.role_name === "super-admin";

  const userid = useSelector((state) => state.user.loggedInUser.id);

  const allempdatass = useSelector((state) => state.currencies);
  const currencyData = allempdatass?.currencies?.data || [];

  const alldatas = useSelector((state) => state.subplan);
  const fnddtat = alldatas.subplan.data || [];

  const userplan = fnddtat.find((item) => item.client_id === userid);

  const userplanstatus = userplan?.plan_id;

  const allPlansStatus = allPlans.find((item) => item.id === userplanstatus);

  const userplanstatuss = allPlans.find((item) => item.id === selectedPlan);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getsubplandata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetPlan());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  const deletePlan = async (planId) => {
    try {
      await dispatch(DeleteP(planId)).then(() => {
        dispatch(GetPlan());
      });
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  const openAddPlanModal = () => setIsAddPlanModalVisible(true);
  const closeAddPlanModal = () => setIsAddPlanModalVisible(false);
  const openEditPlanModal = () => setIsEditPlanModalVisible(true);
  const closeEditPlanModal = () => setIsEditPlanModalVisible(false);

  const togglePlan = (id, currentStatus, plan) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const submitValues = {
      ...plan,
      status: newStatus,
    };

    dispatch(Editplan({ id, values: submitValues }))
      .then(() => {
        dispatch(GetPlan());
        message.success(`Plan ${newStatus} successfully`);
      })
      .catch((error) => {
        message.error("Failed to update plan status");
        console.error("Error updating status:", error);
      });
  };

  const EditP = (id) => {
    openEditPlanModal();
    setIdd(id);
  };

  const getMenuItems = (plan) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View Details",
      onClick: () => handleViewPlan(plan),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit",
      onClick: () => EditP(plan.id),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      danger: true,
      onClick: () => deletePlan(plan.id),
    },
  ];

  const handleBuyClick = (plan) => {
    setSelectedPlan(plan.id);
    setIsPurchaseModalVisible(true);
  };

  const PurchaseModal = ({ visible, onCancel, plan, currencyData }) => {
    const [loading, setLoading] = useState(false);
    const loggedInUser = useSelector((state) => state.user.loggedInUser);

    const handlePurchase = async () => {
      try {
        setLoading(true);
        const startDate = moment().format("YYYY-MM-DD");
        const endDate =
          userplanstatuss?.duration === "Lifetime"
            ? null
            : calculateEndDate(moment(), userplanstatuss?.duration).format(
                "YYYY-MM-DD"
              );

        const purchasePayload = {
          client_id: loggedInUser?.id || "",
          plan_id: selectedPlan,
          payment_status: "paid",
          start_date: startDate,
          end_date: endDate,
        };

        await dispatch(planbutus(purchasePayload)).then(() => {
          dispatch(getsubplandata());
          onCancel();
        });
      } catch (error) {
        console.error("Purchase error:", error);
      } finally {
        setLoading(false);
      }
    };

    const selectedCurrency =
      Array.isArray(currencyData) &&
      currencyData.find((item) => item.id === plan?.currency);

    return (
      <Modal
        title={<Title level={4}>Purchase Plan</Title>}
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={700}
        className="purchase-plan-modal"
      >
        <div className="p-4">
          <Row gutter={[24, 24]}>
            {/* Plan Details */}
            <Col span={24}>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="space-y-1">
                      <Text type="secondary">Selected Plan</Text>
                      <div className="text-lg font-semibold text-gray-800">
                        {userplanstatuss?.name}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="space-y-1">
                      <Text type="secondary">Amount</Text>
                      <div className="text-lg font-semibold text-blue-600">
                        {selectedCurrency?.currencyIcon}
                        {userplanstatuss?.price}
                        <span className="text-sm text-gray-500 ml-1">
                          /{plan?.duration?.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="space-y-1">
                      <Text type="secondary">Start Date</Text>
                      <div className="text-lg font-semibold text-gray-800">
                        {moment().format("DD MMM, YYYY")}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="space-y-1">
                      <Text type="secondary">End Date</Text>
                      <div className="text-lg font-semibold text-gray-800">
                        {userplanstatuss?.duration === "Lifetime"
                          ? "Lifetime"
                          : calculateEndDate(
                              moment(),
                              userplanstatuss?.duration
                            )?.format("DD MMM, YYYY") || "N/A"}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* Plan Features */}
            <Col span={24}>
              <div className="space-y-4">
                <Text strong>Plan Features:</Text>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded">
                      <UserOutlined className="text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-600">Users</div>
                        <div className="font-medium">
                          {userplanstatuss?.max_users}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded">
                      <TeamOutlined className="text-green-500" />
                      <div>
                        <div className="text-sm text-gray-600">Clients</div>
                        <div className="font-medium">
                          {userplanstatuss?.max_clients}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded">
                      <CloudUploadOutlined className="text-purple-500" />
                      <div>
                        <div className="text-sm text-gray-600">Storage</div>
                        <div className="font-medium">
                          {userplanstatuss?.storage_limit} GB
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded">
                      <CalendarOutlined className="text-orange-500" />
                      <div>
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="font-medium">
                          {userplanstatuss?.duration}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* Trial Period Notice */}
            <Col span={24}>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <InfoCircleOutlined className="text-blue-500 mt-0.5" />
                  <div>
                    <Text strong className="text-blue-600">
                      Trial Period
                    </Text>
                    <p className="text-sm text-gray-600 mt-1">
                      You will get a {userplanstatuss?.trial_period} days trial
                      period with this plan. No charges will be applied during
                      the trial period.
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            {/* Action Buttons */}
            <Col span={24}>
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button onClick={onCancel}>Cancel</Button>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={handlePurchase}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Confirm Purchase
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  };

  const renderUserPlanStatus = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Your Current Subscription
            </h2>
            <p className="text-gray-600">Plan details and status</p>
          </div>
          {allPlansStatus?.status === "active" && (
            <Tag color="success" className="px-4 py-1 text-sm">
              Active
            </Tag>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-1">Current Plan</p>
            <p className="text-lg font-semibold text-gray-800">
              {allPlansStatus?.name || "No active plan"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-1">Expiry Date</p>
            <p className="text-lg font-semibold text-gray-800">
              {userplan?.end_date
                ? moment(userplan.end_date).format("DD MMM, YYYY")
                : "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-1">Days Remaining</p>
            <p className="text-lg font-semibold text-gray-800">
              {userplan?.end_date
                ? `${moment(userplan?.end_date).diff(moment(), "days")} days`
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <UserOutlined className="text-blue-500" />
              <div>
                <p className="text-gray-600 text-sm">Users</p>
                <p className="font-semibold">
                  {allPlansStatus?.current_users || 0}/
                  {allPlansStatus?.max_users || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TeamOutlined className="text-green-500" />
              <div>
                <p className="text-gray-600 text-sm">Clients</p>
                <p className="font-semibold">
                  {allPlansStatus?.current_clients || 0}/
                  {allPlansStatus?.max_clients || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CloudUploadOutlined className="text-purple-500" />
              <div>
                <p className="text-gray-600 text-sm">Storage</p>
                <p className="font-semibold">
                  {allPlansStatus?.used_storage || 0}/
                  {allPlansStatus?.storage_limit || 0} GB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarOutlined className="text-orange-500" />
              <div>
                <p className="text-gray-600 text-sm">Billing Cycle</p>
                <p className="font-semibold">
                  {allPlansStatus?.duration || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const calculateEndDate = (startDate, duration) => {
    if (!duration) return null;

    const [amount, unit] = duration.split(" ");

    if (unit.toLowerCase() === "lifetime") {
      return "Lifetime";
    }

    const start = moment(startDate);

    if (unit.toLowerCase().includes("month")) {
      return start.clone().add(amount, "months");
    } else if (unit.toLowerCase().includes("year")) {
      return start.clone().add(amount, "years");
    }

    return null;
  };

  const handleViewPlan = (plan) => {
    setSelectedViewPlan(plan);
    setViewPlanModalVisible(true);
  };

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
          {isAdmin && (
            <Col>
              <Button
                type="primary"
                onClick={openAddPlanModal}
                icon={<PlusOutlined />}
              >
                Add New Plan
              </Button>
            </Col>
          )}
        </Row>

        {!isAdmin && renderUserPlanStatus()}

        {allPlans?.length === 0 ? (
          <Empty description="No plans found" className="my-12" />
        ) : (
          <Row gutter={[24, 24]}>
            {allPlans?.map((plan) => {
              const selectedCurrency =
                Array.isArray(currencyData) &&
                currencyData.find((item) => item.id === plan.currency);

              return (
                <Col xs={24} sm={24} md={12} lg={8} xl={6} key={plan.id}>
                  <Card
                    className="plan-card h-full rounded-xl transform transition-all duration-300 hover:scale-105 cursor-pointer"
                    hoverable
                    onClick={() => handleViewPlan(plan)}
                    title={
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2">
                          <CrownOutlined className="text-2xl text-yellow-500" />
                          <div
                            style={{
                              maxWidth: "180px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              marginBottom: "8px",
                            }}
                            title={plan.name}
                          >
                            {plan.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {plan.is_default && (
                            <Tag color="blue" className="mr-2">
                              Default Plan
                            </Tag>
                          )}
                          {isAdmin && (
                            <div
                              className="flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Switch
                                checked={plan.status === "active"}
                                onChange={() =>
                                  togglePlan(plan.id, plan.status, plan)
                                }
                                className={
                                  plan.status === "active" ? "bg-blue-600" : ""
                                }
                              />
                              <Dropdown
                                menu={{ items: getMenuItems(plan) }}
                                placement="bottomRight"
                                trigger={["click"]}
                              >
                                <Button
                                  type="text"
                                  icon={
                                    <MoreOutlined className="text-gray-600" />
                                  }
                                />
                              </Dropdown>
                            </div>
                          )}
                        </div>
                      </div>
                    }
                  >
                    <div className="space-y-6">
                      {/* Price Section */}
                      <div className="text-center bg-blue-50 p-8 rounded-xl shadow-inner relative">
                        {plan.is_default && (
                          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                            <Tag color="blue" className="px-2 py-1 rounded-full">
                              Default
                            </Tag>
                          </div>
                        )}
                        <div className="text-6xl font-bold text-blue-600">
                          <span className="text-3xl">
                            {selectedCurrency?.currencyIcon || ""}
                          </span>
                          {plan?.price}
                        </div>
                        <div className="text-gray-600 font-medium mt-2">
                          per{" "}
                          {plan?.duration
                            ? plan?.duration.toLowerCase()
                            : "N/A"}
                        </div>
                      </div>

                      {/* Features Grid */}
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                          <CalendarOutlined className="text-blue-500 text-xl" />
                          <div>
                            <div className="text-sm text-gray-500">
                              Duration
                            </div>
                            <div className="font-semibold">{plan.duration}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                          <UserOutlined className="text-blue-500 text-xl" />
                          <div>
                            <div className="text-sm text-gray-500">Users</div>
                            <div className="font-semibold">
                              {plan.max_users} users
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                          <TeamOutlined className="text-blue-500 text-xl" />
                          <div>
                            <div className="text-sm text-gray-500">Clients</div>
                            <div className="font-semibold">
                              {plan.max_clients} clients
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                          <ShopOutlined className="text-green-500 text-xl" />
                          <div>
                            <div className="text-sm text-gray-500">Customers</div>
                            <div className="font-semibold">
                              {plan.max_customers} customers
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                          <ShoppingOutlined className="text-orange-500 text-xl" />
                          <div>
                            <div className="text-sm text-gray-500">Vendors</div>
                            <div className="font-semibold">
                              {plan.max_vendors} vendors
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                          <CloudUploadOutlined className="text-purple-500 text-xl" />
                          <div>
                            <div className="text-sm text-gray-500">Storage</div>
                            <div className="font-semibold">
                              {plan.storage_limit} MB
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Trial Badge */}
                      {plan.trial && (
                        <div className="absolute top-4 right-4">
                          <Tag
                            color="gold"
                            className="px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {plan.trial_period} Days Trial
                          </Tag>
                        </div>
                      )}

                      {/* Add Default Plan Badge */}
                      {plan.is_default && (
                        <div className="mt-4 text-center">
                          <Text type="secondary" className="text-sm">
                            This is the default plan for new users
                          </Text>
                        </div>
                      )}

                      {/* Buy Button */}
                      {!isAdmin && (
                        <Button
                          type="primary"
                          block
                          onClick={() => handleBuyClick(plan)}
                          className={`mt-6 h-12 text-base font-medium rounded-lg transform transition-all duration-300 hover:scale-105 ${
                            plan.is_default ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {plan.status === "active" ? (plan.is_default ? "Default Plan" : "Choose Plan") : ""}
                        </Button>
                      )}
                    </div>
                  </Card>
                </Col>
              );
            })}
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

        <PurchaseModal
          visible={isPurchaseModalVisible}
          onCancel={() => setIsPurchaseModalVisible(false)}
          plan={selectedPlan}
          currencyData={currencyData}
        />

        <ViewPlanModal
          visible={viewPlanModalVisible}
          onClose={() => {
            setViewPlanModalVisible(false);
            setSelectedViewPlan(null);
          }}
          plan={selectedViewPlan}
          currencyData={currencyData}
          isAdmin={isAdmin}
          onEdit={EditP}
          onDelete={deletePlan}
          onBuy={handleBuyClick}
        />
      </div>
    </div>
  );
};

export default PlanList;
