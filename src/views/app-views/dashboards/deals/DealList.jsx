import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Row,
  Col,
  Tag,
  Input,
  message,
  Button,
  Modal,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  EditOutlined,
  FileAddOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import StatisticWidget from "components/shared-components/StatisticWidget";
import { DealStatisticData } from "../../dashboards/default/DefaultDashboardData";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddDeal from "./AddDeal";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import { utils, writeFile } from "xlsx";
import EditDeal from "./EditDeal";
import ViewDeal from "./ViewDeal";
import { useDispatch, useSelector } from "react-redux";
import { DeleteDeals, GetDeals } from "./DealReducers/DealSlice";
import { useNavigate } from "react-router-dom";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { getstages } from '../systemsetup/LeadStages/LeadsReducer/LeadsstageSlice';
import { GetPip } from "../systemsetup/Pipeline/PiplineReducer/piplineSlice";
import { debounce } from 'lodash';

const DealList = () => {
  const [users, setUsers] = useState([]);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  // const [viewDealVisible, setViewDealVisible] = useState(false);

  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddDealModalVisible, setIsAddDealModalVisible] = useState(false);
  const [isViewDealModalVisible, setIsViewDealModalVisible] = useState(false);

  const [isEditDealModalVisible, setIsEditDealModalVisible] = useState(false);

  const [idd, setIdd] = useState("");

  const [dealStatisticData] = useState(DealStatisticData);

  const tabledata = useSelector((state) => state.Deals);
  const clientsData = useSelector((state) => state?.SubClient?.SubClient?.data || []);

  const user = useSelector((state) => state.user.loggedInUser.username);

  // Add new state for stages
  const [stagesList, setStagesList] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Add console.log to debug data
  useEffect(() => {
    console.log('TableData:', tabledata);
    console.log('Users State:', users);
  }, [tabledata, users]);

  // Modified debounced search function with better error handling
  const debouncedSearch = debounce((value) => {
    setIsSearching(true);
    const searchValue = value.toLowerCase();
    
    try {
      if (!searchValue) {
        // Reset to original filtered data
        if (tabledata?.Deals?.data) {
          const filteredDeals = tabledata.Deals.data.filter(deal => deal.created_by === user);
          setUsers(filteredDeals);
        }
        setIsSearching(false);
        return;
      }

      // Make sure we have data to filter
      if (!tabledata?.Deals?.data) {
        console.log('No deals data available');
        setUsers([]);
        setIsSearching(false);
        return;
      }

      // Filter by created_by and search value
      const filteredData = tabledata.Deals.data.filter(deal => {
        const matchesUser = deal.created_by === user;
        const matchesSearch = 
          (deal.dealName?.toString().toLowerCase().includes(searchValue)) ||
          (deal.leadTitle?.toString().toLowerCase().includes(searchValue)) ||
          (deal.project?.toString().toLowerCase().includes(searchValue));
        
        return matchesUser && matchesSearch;
      });

      console.log('Filtered Data:', filteredData); // Debug log
      setUsers(filteredData);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  // Simplified onSearch function
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  // Make sure initial data is loaded
  useEffect(() => {
    if (tabledata?.Deals?.data) {
      const filteredDeals = tabledata.Deals.data.filter(deal => deal.created_by === user);
      setUsers(filteredDeals);
    }
  }, [tabledata, user]);

  useEffect(()=>{
    dispatch(GetPip())
  },[dispatch])

  // Get stages data from redux store
  const stagesData = useSelector((state) => state.StagesLeadsDeals);

  // Open Add Job Modal
  const openAddDealModal = () => {
    setIsAddDealModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddDealModal = () => {
    setIsAddDealModalVisible(false);
  };

  const openEditDealModal = () => {
    setIsEditDealModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditDealModal = () => {
    setIsEditDealModalVisible(false);
  };

  const openViewDealModal = () => {
    navigate("/app/dashboards/project/deal/viewDeal", {
      state: { user: selectedUser },
    }); // Pass user data as state if needed
  };
  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users);
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Deal"); // Append the worksheet to the workbook

      // Write the workbook to a file
      writeFile(wb, "DealData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };

  //// permission
            
                      const roleId = useSelector((state) => state.user.loggedInUser.role_id);
                      const roles = useSelector((state) => state.role?.role?.data);
                      const roleData = roles?.find(role => role.id === roleId);
                  
                      const whorole = roleData.role_name;
                  
                      const parsedPermissions = Array.isArray(roleData?.permissions)
                      ? roleData.permissions
                      : typeof roleData?.permissions === 'string'
                      ? JSON.parse(roleData.permissions)
                      : [];
                    
                    
                      let allpermisson;  
                  
                      if (parsedPermissions["dashboards-deal"] && parsedPermissions["dashboards-deal"][0]?.permissions) {
                        allpermisson = parsedPermissions["dashboards-deal"][0].permissions;
                        console.log('Parsed Permissions:', allpermisson);
                      
                      } else {
                        // console.log('dashboards-deal is not available');
                      }
                      
                      const canCreateClient = allpermisson?.includes('create');
                      const canEditClient = allpermisson?.includes('edit');
                      const canDeleteClient = allpermisson?.includes('delete');
                      const canViewClient = allpermisson?.includes('view');
            
                      ///endpermission



  // const openViewDealModal = () => {
  //   setIsViewDealModalVisible(true);
  // };

  // Close Add Job Modal
  const closeViewDealModal = () => {
    setIsViewDealModalVisible(false);
  };

  // Update the search functionality
  // const onSearch = (e) => {
  //   const searchValue = e.currentTarget.value.toLowerCase();
  //   if (tabledata && tabledata.Deals && tabledata.Deals.data) {
  //     const filteredDeals = tabledata.Deals.data.filter(deal => 
  //       deal.created_by === user && 
  //       deal.dealName.toLowerCase().includes(searchValue)
  //     );
  //     setUsers(filteredDeals);
  //   }
  // };

  const deleteUser = async (userId) => {
    try {
      await dispatch(DeleteDeals(userId));

      const updatedData = await dispatch(GetDeals());

      setUsers(users.filter((item) => item.id !== userId));

      // message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Show user profile
  const showUserProfile = (userInfo) => {
    setSelectedUser(userInfo);
    setUserProfileVisible(true);
  };

  // Close user profile
  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };

  useEffect(() => {
    dispatch(GetDeals());
    dispatch(ClientData());
    dispatch(getstages());
  }, [dispatch]);

  // useEffect(() => {
  //   if (tabledata && tabledata.Deals && tabledata.Deals.data) {
  //     setUsers(tabledata.Deals.data);
  //   }
  // }, [tabledata]);



  useEffect(() => {
    if (tabledata && tabledata.Deals && tabledata.Deals.data) {
      // Filter leads by created_by matching the logged-in user's username
      const filteredDeals = tabledata.Deals.data.filter(deal => deal.created_by === user);
      setUsers(filteredDeals);
    }
  }, [tabledata, user]);


  useEffect(() => {
    if (stagesData && stagesData.StagesLeadsDeals && stagesData.StagesLeadsDeals.data) {
      setStagesList(stagesData.StagesLeadsDeals.data);
    }
  }, [stagesData]);

  useEffect(() => {
    if (stagesList?.StagesLeadsDeals?.data) {
      setStagesList(stagesList.StagesLeadsDeals.data);
    }
  }, [stagesList]);


  const filterData = () => {
    let filtered = users.filter((deal) =>
      deal.dealName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    filterData();
  }, [searchTerm]);

  const EditDelas = (id) => {
    openEditDealModal();
    setIdd(id);
  };

  // Function to get stage name by ID
  const getStageName = (stageId) => {
    const stage = stagesList.find(stage => stage.id === stageId);
    return stage ? stage.stageName : 'N/A';
  };

  const dropdownMenu = (elm) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={openViewDealModal}
            size="small"
          >
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item> */}
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<MailOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="">Send Mail</span>
          </Button>
        </Flex>
      </Menu.Item> */}
     
     

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                            <Menu.Item>
                            <Flex alignItems="center">
                              <Button
                                type=""
                                className=""
                                icon={<EditOutlined />}
                                onClick={() => EditDelas(elm.id)}
                                size="small"
                              >
                                <span className="ml-2">Edit</span>
                              </Button>
                            </Flex>
                          </Menu.Item>
                    ) : null}
      
      
      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                      <Menu.Item>
                      <Flex alignItems="center">
                        <Button
                          type=""
                          className=""
                          icon={<DeleteOutlined />}
                          onClick={() => deleteUser(elm.id)}
                          size="small"
                        >
                          <span className="">Delete</span>
                        </Button>
                      </Flex>
                    </Menu.Item>
                    ) : null}


    </Menu>
  );

  const tableColumns = [
    {
      title: "Name",
      dataIndex: "dealName",
      sorter: {
        compare: (a, b) => a.dealName.localeCompare(b.dealName),
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: {
        compare: (a, b) => a.price - b.price,
      },
    },
    {
      title: "Stage",
      dataIndex: "stage",
      render: (stageId) => getStageName(stageId),
      sorter: {
        compare: (a, b) => {
          const stageNameA = getStageName(a.stage);
          const stageNameB = getStageName(b.stage);
          return stageNameA.localeCompare(stageNameB);
        },
      },
    },
    {
      title: "created_by",
      dataIndex: "created_by",
      sorter: {
        compare: (a, b) => a.created_by - b.created_by,
      },
    },

    {
      title: "dealName",
      dataIndex: "dealName",
      sorter: {
        compare: (a, b) => a.dealName - b.dealName,
      },
    },
    {
      title: "leadTitle",
      dataIndex: "leadTitle",
      sorter: {
        compare: (a, b) => a.leadTitle - b.leadTitle,
      },
    },
    {
      title: "project",
      dataIndex: "project",
      sorter: {
        compare: (a, b) => a.project - b.project,
      },
    },

   
    
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];

  // For debugging
  useEffect(() => {
    console.log('Deals Data:', tabledata?.Deals?.data);
    console.log('Clients Data:', clientsData);
    console.log('Mapped Users:', users);
  }, [users]);

  return (
    <Card bodyStyle={{ padding: "-3px" }}>
      {/* <Row gutter={16}>
        {dealStatisticData.map((elm, i) => (
          <Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>
            <StatisticWidget
              title={elm.title}
              value={elm.value}
              status={elm.status}
              subtitle={elm.subtitle}
            />
          </Col>
        ))}
      </Row> */}
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search by deal name, lead title, or project..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchValue}
              allowClear
              style={{ width: '300px' }}
              loading={isSearching}
            />
          </div>
        </Flex>
        <Flex gap="7px">
        

            {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                                     <Button type="primary" className="ml-2" onClick={openAddDealModal}>
                                                                                                                     <PlusOutlined />
                                                                                                                     <span>New</span>
                                                                                                                   </Button>
                                                                                                      
                                                                                                          ) : null}

          <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={exportToExcel} // Call export function when the button is clicked
                block
              >
                Export All
              </Button>
          {/* <Button type="primary" icon={<FileAddOutlined />} block>
            Import All
          </Button> */}
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">

        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                           <Table
                                                                                           columns={tableColumns}
                                                                                           dataSource={filteredUsers}
                                                                                           rowKey="id"
                                                                                           scroll={{ x: 1200 }}
                                                                                         />
                                                                                          ) : null}


       
      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />
      {/* <ViewDeal visible={viewDealVisible} close={closeViewDeal} /> */}

      {/* Add Job Modal */}
      <Modal
        title="Add Deal"
        visible={isAddDealModalVisible}
        onCancel={closeAddDealModal}
        footer={null}
        width={800}
        className="mt-[-70 px]"
      >
        <AddDeal onClose={closeAddDealModal} />
      </Modal>
      <Modal
        title="Edit Deal"
        visible={isEditDealModalVisible}
        onCancel={closeEditDealModal}
        footer={null}
        width={800}
        className="mt-[-70px]"
      >
        <EditDeal onClose={closeEditDealModal} id={idd} />
      </Modal>

      <Modal
        className="mt-[-70px]"
        title="Deal"
        visible={isViewDealModalVisible}
        onCancel={closeViewDealModal}
        footer={null}
        width={1800}
      >
        <ViewDeal onClose={closeViewDealModal} />
      </Modal>
    </Card>
  );
};

export default DealList;
