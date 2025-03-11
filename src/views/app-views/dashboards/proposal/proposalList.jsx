import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Input,
  message,
  Button,
  Modal,
  Space,
  DatePicker,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { debounce } from 'lodash';

import Flex from "components/shared-components/Flex";
import userData from "../../../../assets/data/user-list.data.json";
import { utils, writeFile } from "xlsx";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import AddProposal from "./AddProposal";
import EditProposal from "./EditProposal";
import { delpropos, getpropos } from "./proposalReducers/proposalSlice";
import { GetLeads } from "../leads/LeadReducers/LeadSlice";
import { GetDeals } from "../deals/DealReducers/DealSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";


const ProposalList = () => {
  const [users, setUsers] = useState(userData);
  const dispatch = useDispatch();
  const [isAddProposalModalVisible, setIsAddProposalSetupModalVisible] =
    useState(false);
  const [isEditProposalModalVisible, setIsEditProposalModalVisible] =
    useState(false);
  const [id, setId] = useState("");
  const { data: Leads } = useSelector((state) => state.Leads.Leads);
  const { data: Deals } = useSelector((state) => state.Deals.Deals);



  const user = useSelector((state) => state.user.loggedInUser.username);

  const allproposal = useSelector((state) => state?.proposal);
  const fnddatas = allproposal?.proposal?.data;


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



  useEffect(() => {
    if (fnddatas) {
      // Filter proposals by created_by matching the logged-in user's username
      
      // Enrich filtered proposals with lead and deal titles
      const enrichedData = fnddatas.map((proposal) => {

        const lead = Leads?.find((l) => l.id === proposal.lead_title);      
        // Match lead by ID
        const deal = Deals?.find((d) => d.id === proposal.deal_title);

        return {
          ...proposal,
          lead_title: lead?.leadTitle, // Use `title` from Leads or fallback to "N/A"
          deal_title: deal?.dealName, // Use `title` from Deals or fallback to "N/A"
        };
      });

      setUsers(enrichedData); // Set enriched data for the table
    }
  }, [fnddatas, user, Leads, Deals]);








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



  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const debouncedSearch = debounce((value, date, data, setUsers) => {
    setIsSearching(true);

    const searchValue = value.toLowerCase();

    if (!fnddatas) {
      setUsers([]);
      setIsSearching(false);
      return;
    }

    const filteredData = fnddatas.filter(proposal => {
      const lead = Leads?.find((l) => l.id === proposal.lead_title);
      const matchesSearch = !searchValue || (
        lead?.leadTitle?.toString().toLowerCase().includes(searchValue) ||
        proposal.deal_title?.toString().toLowerCase().includes(searchValue)
      );

      let matchesDate = true;
      if (date) {
        const proposalDate = dayjs(proposal.valid_till).startOf('day');
        const selectedDay = dayjs(date).startOf('day');
        matchesDate = proposalDate.isSame(selectedDay, 'day');
      }

      return matchesSearch && matchesDate && proposal.created_by === user;
    });

    const enrichedData = filteredData.map((proposal) => {
      
      const lead = Leads?.find((l) => l.id === proposal.lead_title);
      
      const deal = Deals?.find((d) => d.id === proposal.deal_title);

      return {
        ...proposal,
        lead_title: lead?.leadTitle,
        deal_title: deal?.dealName,
      };
    });

    setUsers(enrichedData);
    setIsSearching(false);
  }, 300);

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    debouncedSearch(value, selectedDate, fnddatas, setUsers);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    debouncedSearch(searchValue, date, fnddatas, setUsers);
  };

  const deleteUser = (userId) => {
    dispatch(delpropos(userId)).then(() => {
      dispatch(getpropos());
      setUsers(users.filter((item) => item.id !== userId));
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


  const editfun = (id) => {
    openEditProposalModal();
    setId(id);
  };

  const getDropdownItems = (elm) => {
    const items = [];

    if (whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => editfun(elm.id)
      });
    }

    if (whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => deleteUser(elm.id),
        danger: true
      });
    }

    return items;
  };

  const tableColumns = [
    {
      title: "Lead title",
      dataIndex: "lead_title",
      onFilter: (value, record) =>
        record.lead_title
          ? record.lead_title.toString().toLowerCase().includes(value.toLowerCase())
          : '',
      sorter: (a, b) => a.lead_title.length - b.lead_title.length,
    },


    {
      title: "Tax",
      dataIndex: "tax",
      sorter: (a, b) => a.tax.length - b.tax.length,
    },
    {
      title: "Total",
      dataIndex: "total",
      sorter: (a, b) => a.total.length - b.total.length,
    },
    {
      title: "Date",
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
          <Dropdown
            overlay={<Menu items={getDropdownItems(elm)} />}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
              style={{
                borderRadius: '10px',
                padding: 0
              }}
            >
              <MoreOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
            </Button>
          </Dropdown>
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
            <DatePicker
              onChange={handleDateChange}
              value={selectedDate}
              format="DD-MM-YYYY"
              placeholder="Search Date"
              allowClear
              style={{ width: '200px' }}
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

      <style>{`
        .ant-dropdown-menu {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          padding: 4px;
        }
        .ant-dropdown-menu-item {
          padding: 8px 16px;
          border-radius: 4px;
          margin: 2px 0;
          transition: all 0.3s;
        }
        .ant-dropdown-menu-item:hover {
          background-color: #f5f5f5;
        }
        .ant-dropdown-menu-item-danger:hover {
          background-color: #fff1f0;
        }
        .ant-dropdown-menu-item .anticon {
          font-size: 16px;
          margin-right: 8px;
        }
      `}</style>
    </Card>
  );
};

export default ProposalList;
