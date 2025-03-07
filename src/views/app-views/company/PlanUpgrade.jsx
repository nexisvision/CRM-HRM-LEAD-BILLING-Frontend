import React, { useState } from "react";
import { Modal, Button, List, Typography, Space } from "antd";
import { CheckOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const { Text } = Typography;

const initialPlans = [
  {
    id: 1,
    name: "Free Plan",
    price: "$0.00",
    duration: "lifetime",
    users: 5,
    customers: 5,
    vendors: 5,
  },
  {
    id: 2,
    name: "Platinum",
    price: "$500.00",
    duration: "year",
    users: 25,
    customers: 50,
    vendors: 50,
  },
  {
    id: 3,
    name: "Gold",
    price: "$400.00",
    duration: "year",
    users: 15,
    customers: 40,
    vendors: 40,
  },
  {
    id: 4,
    name: "Silver",
    price: "$300.00",
    duration: "year",
    users: 15,
    customers: 50,
    vendors: 50,
  },
];

const PlanUpgrade = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(1); // Default selected plan

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePlanSelect = (id) => {
    setSelectedPlan(id);
    setIsModalVisible(false); // Close modal after selection
  };

  return (
    <>
      {/* Uncomment the button to test modal */}
      {/* <Button type="primary" onClick={showModal}>
        Upgrade Plan
      </Button> */}

      {/* Uncomment to use modal */}
      {/* <Modal
        title="Upgrade Plan"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      > */}


      <List
        dataSource={initialPlans}
        renderItem={(plan) => (
          <List.Item
            key={plan.id}
            onClick={() => handlePlanSelect(plan.id)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: selectedPlan === plan.id ? "#f5f5f5" : "white",
              border: selectedPlan === plan.id ? "1px solid #1890ff" : "1px solid #e8e8e8",
              borderRadius: 5,
            }}
          >
            <Space direction="vertical" size={0}>
              <Text strong>
                {plan.name} ({plan.price}) / {plan.duration}
              </Text>
              <Text>Users: {plan.users}</Text>
              <Text>Customers: {plan.customers}</Text>
              <Text>Vendors: {plan.vendors}</Text>
            </Space>
            {selectedPlan === plan.id ? (
              <CheckOutlined style={{ color: "green", fontSize: 24 }} />
            ) : (
              <Button
                icon={<ShoppingCartOutlined />}
                //   shape="circle"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent List.Item click
                  setSelectedPlan(plan.id); // Set the selected plan
                
                }}
              />
            )}
          </List.Item>
        )}
      />
      {/* </Modal> */}
    </>
  );
};

export default PlanUpgrade;