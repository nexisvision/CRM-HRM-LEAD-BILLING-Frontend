import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddAnnouncement from './AddAnnouncement';
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteAnn, GetAnn } from './AnnouncementReducer/AnnouncementSlice';
import { useNavigate } from 'react-router-dom';

const AnnouncementList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddAnnouncementModalVisible, setIsAddAnnouncementModalVisible] = useState(false);

  const navigate = useNavigate();

    const tabledata = useSelector((state) => state.Announce);  

  const dispatch = useDispatch();

  // Convert class methods to regular functions
  const openAddAnnouncementModal = () => {
    setIsAddAnnouncementModalVisible(true);
  };

  const closeAddAnnouncementModal = () => {
    setIsAddAnnouncementModalVisible(false);
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const deleteUser = (userId) => {
    // setUsers(prevUsers => prevUsers.filter(item => item.id !== userId));
    // message.success({ content: `Deleted user ${userId}`, duration: 2 });
          dispatch(DeleteAnn( userId ))
                .then(() => {
                  dispatch(GetAnn());
                  message.success('announcement Deleted successfully!');
                  setUsers(prevUsers => prevUsers.filter(item => item.id !== userId));
                  navigate('/app/hrm/announcement');
                })
                .catch((error) => {
                  message.error('Failed to update department.');
                  console.error('Edit API error:', error);
                });
  };

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };


    useEffect(()=>{
      dispatch(GetAnn())
    },[dispatch]);
  
      useEffect(() => {
        if (tabledata && tabledata.Announce && tabledata.Announce.data) {
          setUsers(tabledata.Announce.data);
        }
      }, [tabledata]);

  // Convert dropdownMenu to a regular function
  const dropdownMenu = (elm) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<EyeOutlined />} onClick={() => showUserProfile(elm)} size="small">
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<MailOutlined />} onClick={() => showUserProfile(elm)} size="small">
            <span className="">Send Mail</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<PushpinOutlined />} onClick={() => showUserProfile(elm)} size="small">
            <span className="ml-2">Pin</span>
          </Button>
        </Flex>
      </Menu.Item> */}
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<DeleteOutlined />} onClick={() => deleteUser(elm.id)} size="small">
            <span className="">Delete</span>
          </Button>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    // {
    //   title: 'User',
    //   dataIndex: 'name',
    //   render: (_, record) => (
    //     <div className="d-flex">
    //       <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
    //     </div>
    //   ),
    //   sorter: {
    //     compare: (a, b) => {
    //       a = a.name.toLowerCase();
    //       b = b.name.toLowerCase();
    //       return a > b ? -1 : b > a ? 1 : 0;
    //     },
    //   },
    // },
    // {
    //   title: 'In Time',
    //   dataIndex: 'intime',
    //   sorter: {
    //     compare: (a, b) => a.intime.length - b.intime.length,
    //   },
    // },
    // {
    //   title: 'Out Time',
    //   dataIndex: 'outtime',
    //   render: (date) => <span>{dayjs.unix(date).format("MM/DD/YYYY")}</span>,
    //   sorter: (a, b) => dayjs(a.outtime).unix() - dayjs(b.outtime).unix(),
    // },
    {
      title: 'Titile',
      dataIndex: 'title',
      sorter: {
        compare: (a, b) => a.intime.title - b.intime.title,
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: {
        compare: (a, b) => a.description.length - b.description.length,
      },
    },
    // {
    //   title: 'Total Hour',
    //   dataIndex: 'totalhour',
    //   sorter: {
    //     compare: (a, b) => a.totalhour.length - b.totalhour.length,
    //   },
    // },
    // {
    //   title: 'Punch By',
    //   dataIndex: 'punchby',
    //   sorter: {
    //     compare: (a, b) => a.punchby.length - b.punchby.length,
    //   },
    // },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      )
    },
  ];

  return (
    <Card bodyStyle={{ padding: '-3px' }}>
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={onSearch} />
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddAnnouncementModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        <Table columns={tableColumns} dataSource={users} rowKey="id" scroll={{ x: 1200 }} />
      </div>
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

      <Modal
        title="Add Announncement"
        visible={isAddAnnouncementModalVisible}
        onCancel={closeAddAnnouncementModal}
        footer={null}
        width={800}
      >
        <AddAnnouncement onClose={closeAddAnnouncementModal} />
      </Modal>
    </Card>
  );
};

export default AnnouncementList;