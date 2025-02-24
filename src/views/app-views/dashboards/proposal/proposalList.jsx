import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Tag,
  Input,
  message,
  Button,
  Modal,
  Select,
  Space,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { debounce } from 'lodash';

import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import userData from "../../../../assets/data/user-list.data.json";
import OrderListData from "../../../../assets/data/order-list.data.json";
import { utils, writeFile } from "xlsx";
import useSelection from "antd/es/table/hooks/useSelection";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import AddProposal from "./AddProposal";
import EditProposal from "./EditProposal";
import { delpropos, getpropos } from "./proposalReducers/proposalSlice";
import { GetLeads } from "../leads/LeadReducers/LeadSlice";
import { GetDeals } from "../deals/DealReducers/DealSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
// import { getallcurrencies } from "views/app-views/setting/currencies/currenciesreducer/currenciesSlice";

const { Option } = Select;

const ProposalList = () => {
  const [users, setUsers] = useState(userData);
  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  // const [viewApplicationVisible, setViewApplicationVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddProposalModalVisible, setIsAddProposalSetupModalVisible] =
    useState(false);
  const [isEditProposalModalVisible, setIsEditProposalModalVisible] =
    useState(false);
  //   const [isViewTrainingSetupModalVisible, setIsViewTrainingSetupModalVisible] =
  //     useState(false);

  const [id, setId] = useState("");
  const { data: Leads } = useSelector((state) => state.Leads.Leads);
  const { data: Deals } = useSelector((state) => state.Deals.Deals);
  // const { data: Currencies } = useSelector((state) => state.currencies.currencies);


  const user = useSelector((state) => state.user.loggedInUser.username);
  // console.log("user",user);

  const allproposal = useSelector((state) => state?.proposal);
  const fnddatas = allproposal?.proposal?.data;

// console.log("fnddatas",fnddatas);

  // useEffect(() => {
  //   if (fnddatas) {
  //     // Filter proposals by created_by matching the logged-in user's username
  //     const filteredProposals = fnddatas.filter(proposal => proposal.created_by === user);
      
  //     setUsers(filteredProposals);
  //   }
  // }, [fnddatas, user]);


  const allempdata = useSelector((state) => state.Training);
  const fnddata = allempdata.Training.data;



  useEffect(() => {
    dispatch(getpropos());
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetLeads());
    dispatch(GetDeals());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  const openAddProposalModal = () => {
    setIsAddProposalSetupModalVisible(true);
  };

  const closeProposalModal = () => {
    setIsAddProposalSetupModalVisible(false);
  };

  const openEditProposalModal = () => {
    setIsEditProposalModalVisible(true);
  };

  const closeEditProposalModal = () => {
    setIsEditProposalModalVisible(false);
  };

  //   const openviewTrainingSetupModal = () => {
  //     setIsViewTrainingSetupModalVisible(true);
  //   };

  //   const closeViewTrainingSetupModal = () => {
  //     setIsViewTrainingSetupModalVisible(false);
  //   };



  useEffect(() => {
    if (fnddatas) {
      // Filter proposals by created_by matching the logged-in user's username
      const filteredProposals = fnddatas.filter(proposal => proposal.created_by === user);
      
      // Enrich filtered proposals with lead and deal titles
      const enrichedData = filteredProposals.map((proposal) => {
        const lead = Leads?.find((l) => l.id === proposal.lead_title); // Match lead by ID
        const deal = Deals?.find((d) => d.id === proposal.deal_title);

        return {
          ...proposal,
          lead_title: lead?.leadTitle || "N/A", // Use `title` from Leads or fallback to "N/A"
          deal_title: deal?.dealName || "N/A", // Use `title` from Deals or fallback to "N/A"
        };
      });

      setUsers(enrichedData); // Set enriched data for the table
    }
  }, [fnddatas, user, Leads, Deals]);








  // useEffect(() => {
  //   if (fnddatas?.length && Leads?.length && Deals?.length) {
  //     const enrichedData = fnddatas.map((proposal) => {
  //       const lead = Leads.find((l) => l.id === proposal.lead_title); // Match lead by ID
  //       const deal = Deals.find((d) => d.id === proposal.deal_title);
  //       // 

  //       return {
  //         ...proposal,
  //         lead_title: lead?.leadTitle || "N/A", // Use `title` from Leads or fallback to "N/A"
  //         deal_title: deal?.dealName || "N/A",
  //         // Use `title` from Deals or fallback to "N/A"
  //       };
  //     });

  //     // setUsers(enrichedData); // Set enriched data for the table
  //   }
  // }, [fnddatas, Leads, Deals]);

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
                    
                        if (parsedPermissions["dashboards-proposal"] && parsedPermissions["dashboards-proposal"][0]?.permissions) {
                          allpermisson = parsedPermissions["dashboards-proposal"][0].permissions;
                          console.log('Parsed Permissions:', allpermisson);
                        
                        } else {
                          // console.log('dashboards-proposal is not available');
                        }
                        
                        const canCreateClient = allpermisson?.includes('create');
                        const canEditClient = allpermisson?.includes('edit');
                        const canDeleteClient = allpermisson?.includes('delete');
                        const canViewClient = allpermisson?.includes('view');
              
                        ///endpermission



  // Add new state for search value
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Create debounced version of search
  const debouncedSearch = debounce((value, data, setUsers) => {
    setIsSearching(true);
    
    const searchValue = value.toLowerCase();
    
    if (!searchValue) {
      setUsers(fnddatas || []); // Reset to original data
      setIsSearching(false);
      return;
    }

    // Filter the data based on search value
    const filteredData = fnddatas?.filter(proposal => {
      const lead = Leads?.find((l) => l.id === proposal.lead_title);
      return (
        lead?.leadTitle?.toString().toLowerCase().includes(searchValue) ||
        proposal.deal_title?.toString().toLowerCase().includes(searchValue)
      );
    }) || [];

    // Enrich the filtered data with lead and deal titles
    const enrichedData = filteredData.map((proposal) => {
      const lead = Leads?.find((l) => l.id === proposal.lead_title);
      const deal = Deals?.find((d) => d.id === proposal.deal_title);

      return {
        ...proposal,
        lead_title: lead?.leadTitle || "N/A",
        deal_title: deal?.dealName || "N/A",
      };
    });

    setUsers(enrichedData);
    setIsSearching(false);
  }, 300);

  // Modified onSearch function
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    debouncedSearch(value, fnddatas, setUsers);
  };

  const deleteUser = (userId) => {
    dispatch(delpropos(userId)).then(() => {
      dispatch(getpropos());
      setUsers(users.filter((item) => item.id !== userId));
      // message.success({ content: `Deleted user ${userId}`, duration: 2 });
    });
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Proposal"); // Append the sheet to the workbook

      writeFile(wb, "ProposalData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  //   useEffect(() => {
  //     dispatch(GetallTrainng());
  //   }, []);

  // useEffect(() => {
  //   if (fnddata) {
  //     setUsers(fnddata);
  //   }
  // }, [fnddata]);

  // const showViewApplication = (userInfo) => {
  //   setViewApplicationVisible(true);
  //   setSelectedUser(userInfo);
  // };

  // const closeViewApplication = () => {
  //   setViewApplicationVisible(false);
  //   setSelectedUser(null);
  // };

  const getjobStatus = (status) => {
    if (status === "active") {
      return "blue";
    }
    if (status === "blocked") {
      return "cyan";
    }
    return "";
  };

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "status";
      const data = utils.filterArray(userData, key, value);
      setUsers(data);
    } else {
      setUsers(userData);
    }
  };

  const editfun = (id) => {
    openEditProposalModal();
    setId(id);
  };
  //   const viewfun = (idd) => {
  //     openviewTrainingSetupModal();
  //     setIdd(idd);
  //   };

  const jobStatusList = ["active", "blocked"];

  const dropdownMenu = (elm) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            size="small"
          // onClick={() => viewfun(elm.id)}
          >
            <span>View Details</span>
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
                                 size="small"
                                 onClick={() => editfun(elm.id)}
                               >
                                 <span>Edit</span>
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
                          <span>Delete</span>
                        </Button>
                      </Flex>
                    </Menu.Item>
                    ) : null}

    </Menu>
  );

  const tableColumns = [
    {
      title: "Lead title",
      dataIndex: "lead_title",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search lead title"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) =>
        record.lead_title
          ? record.lead_title.toString().toLowerCase().includes(value.toLowerCase())
          : '',
      sorter: (a, b) => a.lead_title.length - b.lead_title.length,
    },
    // {
    //   title: "Deal title",
    //   dataIndex: "deal_title",
    //   sorter: (a, b) => a.deal_title.length - b.deal_title.length,
    // },
    // {
    //   title: "calculatedTax",
    //   dataIndex: "calculatedTax",
    //   sorter: (a, b) => a.calculatedTax.length - b.calculatedTax.length,
    // },


    {
      title: "tax",
      dataIndex: "tax",
      sorter: (a, b) => a.tax.length - b.tax.length,
    },
    {
      title: "total",
      dataIndex: "total",
      sorter: (a, b) => a.total.length - b.total.length,
    },
    {
      title: "valid_till",
      dataIndex: "valid_till",
      render: (date) => (date ? dayjs(date).format("DD-MM-YYYY") : "N/A"),
      sorter: (a, b) => a.valid_till.length - b.valid_till.length,
    },
    // {
    //   title: "created_by ",
    //   dataIndex: "created_by",
    //   sorter: (a, b) => a.created_by.length - b.created_by.length,
    // },

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

  return (
    <Card bodyStyle={{ padding: "-3px" }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3" style={{ display: 'flex', gap: '8px' }}>
            <Input
              placeholder="Search by lead title"
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchValue}
              allowClear
              style={{ width: '200px' }}
              loading={isSearching}
            />
          </div>
        </Flex>
        <Flex gap="7px">
        

            {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                                                <Button
                                                                                                                                type="primary"
                                                                                                                                className="ml-2"
                                                                                                                                onClick={openAddProposalModal}
                                                                                                                              >
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
        </Flex>
      </Flex>
      <div className="table-responsive mt-4">
        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                   <Table
                                                                                                   columns={tableColumns}
                                                                                                   dataSource={users}
                                                                                                   rowKey="id"
                                                                                                   scroll={{ x: 1200 }}
                                                                                                 />
                                                                                                  ) : null}

       
      </div>
      {/* <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} /> */}

      {/* <ViewJobApplication data={selectedUser} visible={viewApplicationVisible} close={closeViewApplication} />  */}

      <Modal
        title="Add Proposal"
        visible={isAddProposalModalVisible}
        onCancel={closeProposalModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddProposal onClose={closeProposalModal} />
      </Modal>

      <Modal
        title="Edit Proposal"
        visible={isEditProposalModalVisible}
        onCancel={closeEditProposalModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditProposal onClose={closeEditProposalModal} id={id} />
      </Modal>

      {/* <Modal
        title="Edit Training Setup"
        visible={isViewTrainingSetupModalVisible}
        onCancel={closeViewTrainingSetupModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <ViewTrainingSetup onClose={closeViewTrainingSetupModal} idd={idd} />
      </Modal> */}
    </Card>
  );
};

export default ProposalList;
