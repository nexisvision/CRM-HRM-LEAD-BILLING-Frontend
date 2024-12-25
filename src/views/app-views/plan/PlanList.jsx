import React, { useEffect, useState } from "react";
import { Card, Button, Modal, message, Switch } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddPlan from "./AddPlan";
import EditPlan from "./EditPlan";
import { useDispatch, useSelector } from "react-redux";
import { DeleteP, GetPlan } from "./PlanReducers/PlanSlice";

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [isAddPlanModalVisible, setIsAddPlanModalVisible] = useState(false);
  const [isEditPlanModalVisible, setIsEditPlanModalVisible] = useState(false);
  const [idd,setIdd]= useState("")

  const dispatch = useDispatch();

  // Fetching data from Redux
  const Plandata = useSelector((state) => state.Plan);
  const allPlans = Plandata.Plan?.data || [];

  
  console.log("mmmmm",allPlans)

  useEffect(() => {
    // Dispatch the action to get plans
    dispatch(GetPlan());
  }, [dispatch]);

  useEffect(() => {
    // Set the plans from Redux store to local state
    setPlans(allPlans)
  }, [allPlans]);

  // const deletePlan = (planId) => {
  //   setPlans(plans.filter((plan) => plan.id !== planId));
  //   message.success({ content: `Deleted plan ${planId}`, duration: 2 });
  // };

   const deletePlan = async (planId) => {
      try {
  
        await dispatch(DeleteP(planId)); 
    
        const updatedData = await dispatch(GetPlan());
    
        setPlans(plans.filter((plan) => plan.id !== planId));
    
        message.success({ content: 'Deleted user successfully', duration: 2 });
      } catch (error) {
        // message.error({ content: 'Failed to delete user', duration: 2 });
        console.error('Error deleting user:', error);
      }
    };
  

  const openAddPlanModal = () => {
    setIsAddPlanModalVisible(true);
  };

  const closeAddPlanModal = () => {
    setIsAddPlanModalVisible(false);
  };

  const openEditPlanModal = () => {
    setIsEditPlanModalVisible(true);
  };

  const closeEditPlanModal = () => {
    setIsEditPlanModalVisible(false);
  };

  const togglePlan = (id) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === id ? { ...plan, status: !plan.status } : plan
      )
    );
    message.success({ content: `Toggled plan ${id}`, duration: 2 });
  };


  const EditP = (id) =>{
    openEditPlanModal();
    setIdd(id);
  }


  return (
    <div>
      <div style={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}>
        <Button type="primary" onClick={openAddPlanModal} icon={<PlusOutlined />}></Button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px" }}>
        {plans.map((plan) => (
          <Card
            key={plan.id}
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{plan.name}</span>
                <Switch
                  checked={plan.status}
                  onChange={() => togglePlan(plan.id)}
                  style={{ backgroundColor: plan.status ? "limegreen" : "red" }}
                />
              </div>
            }
            bordered
            style={{ width: 300, textAlign: "center" }}
            actions={[
              <Button icon={<EditOutlined />} onClick={() => EditP(plan.id)} />,
              <Button icon={<DeleteOutlined />} danger onClick={() => deletePlan(plan.id)} />,
            ]}
          >
            <h2 className="text-lg font-bold">{plan.price}</h2>
            <p>{plan.duration}</p>
            <p>Free Trial Days: {plan.trial}</p>
            {/* <ul style={{ textAlign: "left" }}>
            {plan?.features &&
  JSON.parse(plan.features).map((feature, index) => (
    <li key={index}>{feature}</li>
  ))}

            </ul> */}
          </Card>
        ))}
      </div>

      <Modal
        title="Add New Plan"
        visible={isAddPlanModalVisible}
        onCancel={closeAddPlanModal}
        footer={null}
        width={1000}
        className="mt-[-60px]"
      >
        <AddPlan onClose={closeAddPlanModal} />
      </Modal>

      <Modal
        title="Edit Plan"
        visible={isEditPlanModalVisible}
        onCancel={closeEditPlanModal}
        footer={null}
        width={1000}
        className="mt-[-60px]"
      >
        <EditPlan onClose={closeEditPlanModal} id={idd}/>
      </Modal>
    </div>
  );
};

export default PlanList;









// import React, { useState } from "react";
// import { Card, Button, Modal, message } from "antd";
// import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// import AddPlan from "./AddPlan";
// import EditPlan from "./EditPlan";

// const initialPlans = [
//   {
//     id: 1,
//     name: "Free Plan",
//     price: "$0",
//     duration: "Lifetime",
//     trial: "0",
//     features: [
//       "5 Users",
//       "5 Customers",
//       "5 Vendors",
//       "5 Clients",
//       "1024 MB Storage",
//       "Enable Account",
//       "Enable CRM",
//       "Enable HRM",
//       "Enable Project",
//       "Enable POS",
//       "Enable Chat GPT",
//     ],
//   },
//   {
//     id: 2,
//     name: "Platinum",
//     price: "$500",
//     duration: "Per Year",
//     trial: "5",
//     features: [
//       "25 Users",
//       "50 Customers",
//       "50 Vendors",
//       "25 Clients",
//       "1200 MB Storage",
//       "Enable Account",
//       "Enable CRM",
//       "Enable HRM",
//       "Enable Project",
//       "Enable POS",
//       "Enable Chat GPT",
//     ],
//   },
//   {
//     id: 3,
//     name: "Gold",
//     price: "$400",
//     duration: "Per Year",
//     trial: "7",
//     features: [
//       "15 Users",
//       "40 Customers",
//       "40 Vendors",
//       "10 Clients",
//       "2000 MB Storage",
//       "Enable Account",
//       "Enable CRM",
//       "Enable HRM",
//       "Enable Project",
//       "Enable POS",
//       "Enable Chat GPT",
//     ],
//   },
//   {
//     id: 4,
//     name: "Silver",
//     price: "$300",
//     duration: "Per Year",
//     trial: "10",
//     features: [
//       "15 Users",
//       "50 Customers",
//       "50 Vendors",
//       "15 Clients",
//       "3000 MB Storage",
//       "Enable Account",
//       "Enable CRM",
//       "Enable HRM",
//       "Enable Project",
//       "Enable POS",
//       "Enable Chat GPT",
//     ],
//   },
// ];

// const PlanList = () => {
//   const [plans, setPlans] = useState(initialPlans);
//   const [isAddPlanModalVisible, setIsAddPlanModalVisible] = useState(false);
//   const [isEditPlanModalVisible, setIsEditPlanModalVisible] = useState(false);


//   const deletePlan = (planId) => {
//     setPlans(plans.filter((plan) => plan.id !== planId));
//     message.success({ content: `Deleted plan ${planId}`, duration: 2 });
//   };

//   const openAddPlanModal = () => {
//     setIsAddPlanModalVisible(true);
//   };

//   const closeAddPlanModal = () => {
//     setIsAddPlanModalVisible(false);
//   };

//   const openEditPlanModal = () => {
//     setIsEditPlanModalVisible(true);
//   };

//   const closeEditPlanModal = () => {
//     setIsEditPlanModalVisible(false);
//   };

//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "space-end", marginBottom: "20px" }}>
//         <Button type="primary" onClick={openAddPlanModal} icon={<PlusOutlined />}>
        
//         </Button>
//       </div>

//       <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px" }}>
//         {plans.map((plan) => (
//           <Card
//             key={plan.id}
//             title={plan.name}
//             bordered
//             style={{ width: 300, textAlign: "center" }}
//             actions={[
//               <Button icon={<EditOutlined />} onClick={openEditPlanModal} />,
//               <Button icon={<DeleteOutlined />} danger  onClick={() => deletePlan(plan.id)} />,
//             ]}
//           >
//             <h2>{plan.price}</h2>
//             <p>{plan.duration}</p>
//             <p>Free Trial Days: {plan.trial}</p>
//             <ul style={{ textAlign: "left" }}>
//               {plan.features.map((feature, index) => (
//                 <li key={index}>{feature}</li>
//               ))}
//             </ul>
//           </Card>
//         ))}
//       </div>

//       <Modal
//         title="Add New Plan"
//         visible={isAddPlanModalVisible}
//         onCancel={closeAddPlanModal}
//         footer={null}
//         width={1000}
//       >

//         <AddPlan onClose={closeAddPlanModal} />
//         {/* <p>Form to add a new plan will go here.</p> */}
//       </Modal>

//       <Modal
//         title="Edit Plan"
//         visible={isEditPlanModalVisible}
//         onCancel={closeEditPlanModal}
//         footer={null}
//         width={1000}
//       >
//         <EditPlan onClose={closeEditPlanModal} />
//       </Modal>
//     </div>
//   );
// };

// export default PlanList;
