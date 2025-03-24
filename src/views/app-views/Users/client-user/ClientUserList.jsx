// import React, { useState } from "react";
// import {
//   Card,
//   Menu,
//   Table,
//   Tag,
//   Button,
//   Modal,
//   Select,
//   Input,
//   Dropdown,
// } from "antd";
// import {
//   EyeOutlined,
//   DeleteOutlined,
//   MailOutlined,
//   FileExcelOutlined,
//   PlusOutlined,
//   SearchOutlined,
//   MoreOutlined,
// } from "@ant-design/icons";
// import { RiLockPasswordLine } from "react-icons/ri";
// import OrderListData from "assets/data/order-list.data.json";
// import { utils, writeFile } from "xlsx";
// import userData from "assets/data/user-list.data.json";
// import Flex from "components/shared-components/Flex";
// import UserView from "./UserView";
// import AvatarStatus from "components/shared-components/AvatarStatus";
// import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
// import { message } from "antd";
// import AddClientUser from "./AddClientUser";
// import EditClientUser from "./EditClientUser";

// const ClientUserList = () => {
//   const [users, setUsers] = useState(userData);
//   const [userProfileVisible, setUserProfileVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [list, setList] = useState(OrderListData);
//   const [isAddClientUserModalVisible, setIsAddClientUserModalVisible] =
//     useState(false);
//   const [isEditClientUserModalVisible, setIsEditClientUserModalVisible] =
//     useState(false);

//   const deleteUser = (userId) => {
//     setUsers(users.filter((item) => item.id !== userId));
//   };

//   const exportToExcel = () => {
//     try {
//       const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
//       const wb = utils.book_new(); // Create a new workbook
//       utils.book_append_sheet(wb, ws, "User"); // Append the sheet to the workbook

//       writeFile(wb, "UserData.xlsx"); // Save the file as ProposalData.xlsx
//       message.success("Data exported successfully!"); // Show success message
//     } catch (error) {
//       console.error("Error exporting to Excel:", error);
//       message.error("Failed to export data. Please try again."); // Show error message
//     }
//   };

//   const paymentStatusList = ["active", "blocked"];

//   const handleShowStatus = (value) => {
//     if (value !== "All") {
//       const key = "status";
//       const data = utils.filterArray(OrderListData, key, value);
//       setList(data);
//     } else {
//       setList(OrderListData);
//     }
//   };

//   const onSearch = (e) => {
//     const value = e.currentTarget.value;
//     const searchArray = value ? list : OrderListData;
//     const data = utils.wildCardSearch(searchArray, value);
//     setList(data);
//   };

//   const openAddClientUserModal = () => {
//     setIsAddClientUserModalVisible(true);
//   };

//   const closeAddClientUserModal = () => {
//     setIsAddClientUserModalVisible(false);
//   };

//   const openEditClientUserModal = () => {
//     setIsEditClientUserModalVisible(true);
//   };

//   const closeEditClientUserModal = () => {
//     setIsEditClientUserModalVisible(false);
//   };

//   const showUserProfile = (userInfo) => {
//     setUserProfileVisible(true);
//     setSelectedUser(userInfo);
//   };

//   const closeUserProfile = () => {
//     setUserProfileVisible(false);
//     setSelectedUser(null);
//   };

//   const getDropdownItems = (elm) => [
//     {
//       key: "view",
//       icon: <EyeOutlined />,
//       label: "View Details",
//       onClick: () => showUserProfile(elm),
//     },
//     {
//       key: "edit",
//       icon: <MailOutlined />,
//       label: "Edit",
//       onClick: () => openEditClientUserModal(),
//     },
//     {
//       key: "password",
//       icon: <RiLockPasswordLine />,
//       label: "Update Password",
//       onClick: () => showUserProfile(elm),
//     },
//     {
//       key: "delete",
//       icon: <DeleteOutlined />,
//       label: "Delete",
//       onClick: () => deleteUser(elm.id),
//       danger: true,
//     },
//   ];

//   const tableColumns = [
//     {
//       title: "Client Users",
//       dataIndex: "name",
//       render: (_, record) => (
//         <div className="d-flex">
//           <AvatarStatus
//             src={record.img}
//             name={record.name}
//             subTitle={record.email}
//           />
//         </div>
//       ),
//       sorter: {
//         compare: (a, b) => {
//           a = a.name.toLowerCase();
//           b = b.name.toLowerCase();
//           return a > b ? -1 : b > a ? 1 : 0;
//         },
//       },
//     },
//     {
//       title: "Client",
//       dataIndex: "name",
//       render: (_, record) => (
//         <div className="d-flex">
//           <AvatarStatus
//             src={record.img}
//             name={record.client}
//             subTitle={record.clientemail}
//           />
//         </div>
//       ),
//       sorter: {
//         compare: (a, b) => {
//           a = a.client.toLowerCase();
//           b = b.client.toLowerCase();
//           return a > b ? -1 : b > a ? 1 : 0;
//         },
//       },
//     },
//     {
//       title: "Phone Number",
//       dataIndex: "phoneNumber",
//       sorter: {
//         compare: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
//       },
//     },
//     {
//       title: "Role",
//       dataIndex: "role",
//       sorter: {
//         compare: (a, b) => a.role.length - b.role.length,
//       },
//     },
//     {
//       title: "Last online",
//       dataIndex: "lastOnline",
//       sorter: {
//         compare: (a, b) => a.lastOnline.length - b.lastOnline.length,
//       },
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status) => (
//         <Tag
//           className="text-capitalize"
//           color={status === "active" ? "cyan" : "red"}
//         >
//           {status}
//         </Tag>
//       ),
//       sorter: {
//         compare: (a, b) => a.status.length - b.status.length,
//       },
//     },
//     {
//       title: "Action",
//       dataIndex: "actions",
//       render: (_, elm) => (
//         <div className="text-center" onClick={(e) => e.stopPropagation()}>
//           <Dropdown
//             overlay={<Menu items={getDropdownItems(elm)} />}
//             trigger={["click"]}
//             placement="bottomRight"
//           >
//             <Button
//               type="text"
//               className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
//               style={{
//                 borderRadius: "10px",
//                 padding: 0,
//               }}
//             >
//               <MoreOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
//             </Button>
//           </Dropdown>
//         </div>
//       ),
//     },
//   ];

//   const styles = `
//     .ant-dropdown-trigger {
//       transition: all 0.3s;
//     }

//     .ant-dropdown-trigger:hover {
//       transform: scale(1.05);
//       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
//     }

//     .ant-menu-item {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       padding: 8px 12px;
//     }

//     .ant-menu-item:hover {
//       background-color: #f0f7ff;
//     }

//     .ant-menu-item-danger:hover {
//       background-color: #fff1f0;
//     }

//     .ant-table-row {
//       transition: all 0.3s;
//     }

//     .ant-table-row:hover {
//       transform: translateY(-1px);
//       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
//     }

//     .ant-tag {
//       border-radius: 20px;
//       font-weight: 500;
//       text-transform: capitalize;
//       padding: 2px 12px;
//     }

//     .ant-tag-cyan {
//       background-color: #e6fffb;
//       border-color: #87e8de;
//       color: #08979c;
//     }

//     .ant-tag-red {
//       background-color: #fff1f0;
//       border-color: #ffa39e;
//       color: #cf1322;
//     }

//     .d-flex {
//       transition: all 0.3s;
//     }

//     .d-flex:hover .ant-avatar {
//       transform: scale(1.05);
//     }

//     .ant-input-affix-wrapper,
//     .ant-select-selector {
//       border-radius: 6px !important;
//       transition: all 0.3s !important;
//     }

//     .ant-input-affix-wrapper:hover,
//     .ant-select-selector:hover {
//       border-color: #40a9ff !important;
//     }

//     .ant-input-affix-wrapper:focus,
//     .ant-input-affix-wrapper-focused,
//     .ant-select-focused .ant-select-selector {
//       border-color: #40a9ff !important;
//       box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
//     }

//     .ant-btn {
//       display: inline-flex;
//       align-items: center;
//       gap: 8px;
//       border-radius: 6px;
//     }

//     .ant-modal-content {
//       border-radius: 8px;
//     }

//     @media (max-width: 768px) {
//       .ant-input-affix-wrapper,
//       .ant-select {
//         width: 100%;
//       }
      
//       .mb-1 {
//         margin-bottom: 1rem;
//       }

//       .mr-md-3 {
//         margin-right: 0;
//       }
//     }

//     .table-responsive {
//       overflow-x: auto;
//     }
//   `;

//   return (
//     <>
//       <style>{styles}</style>
//       <Card bodyStyle={{ padding: "0px" }}>
//         <Flex
//           alignItems="center"
//           justifyContent="space-between"
//           mobileFlex={false}
//         >
//           <Flex className="mb-1" mobileFlex={false}>
//             <div className="mr-md-3 mb-3">
//               <Input
//                 placeholder="Search"
//                 prefix={<SearchOutlined />}
//                 onChange={(e) => onSearch(e)}
//               />
//             </div>
//             <div className="mb-3">
//               <Select
//                 defaultValue="All"
//                 className="w-100"
//                 style={{ minWidth: 180 }}
//                 onChange={handleShowStatus}
//                 placeholder="Status"
//               >
//                 <Select.Option value="All">Status</Select.Option>
//                 {paymentStatusList.map((elm) => (
//                   <Select.Option key={elm} value={elm}>
//                     {elm}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </div>
//           </Flex>
//           <Flex gap="7px">
//             <Button
//               type="primary"
//               className="ml-2"
//               onClick={openAddClientUserModal}
//             >
//               <PlusOutlined />
//               New
//             </Button>
//             <Button
//               type="primary"
//               icon={<FileExcelOutlined />}
//               onClick={exportToExcel} // Call export function when the button is clicked
//               block
//             >
//               Export All
//             </Button>
//           </Flex>
//         </Flex>
//         <div className="table-responsive">
//           <Table columns={tableColumns} dataSource={users} rowKey="id" />
//         </div>
//         <UserView
//           data={selectedUser}
//           visible={userProfileVisible}
//           close={closeUserProfile}
//         />
//         <Modal
//           title="Create Client"
//           visible={isAddClientUserModalVisible}
//           onCancel={closeAddClientUserModal}
//           footer={null}
//           width={1100}
//           // className="mt-[-70px]"
//         >
//           <AddClientUser onClose={closeAddClientUserModal} />
//         </Modal>
//         <Modal
//           title="Edit Client"
//           visible={isEditClientUserModalVisible}
//           onCancel={closeEditClientUserModal}
//           footer={null}
//           width={1000}
//         >
//           <EditClientUser onClose={closeEditClientUserModal} />
//         </Modal>
//       </Card>
//     </>
//   );
// };

// export default ClientUserList;
