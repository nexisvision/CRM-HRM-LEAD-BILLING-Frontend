import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined,EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import StatisticWidget from 'components/shared-components/StatisticWidget';
// import { DealStatisticData } from '../../dashboards/default/DefaultDashboardData';
// import AvatarStatus from 'components/shared-components/AvatarStatus';
import userData from 'assets/data/user-list.data.json';
import OrderListData from 'assets/data/order-list.data.json';
import utils from 'utils';
import AddNotes from "../notes/AddNotes"
import EditNotes from "../notes/EditNotes"
import ViewNotes from './ViewNotes';

const NotesList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddNotesModalVisible, setIsAddNotesModalVisible] = useState(false);
  const [isEditNotesModalVisible, setIsEditNotesModalVisible] = useState(false);
//   const [dealStatisticData] = useState(DealStatisticData);

  // Open Add Job Modal
  const openAddNotesModal = () => {
    setIsAddNotesModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddNotesModal = () => {
    setIsAddNotesModalVisible(false);
  };

   // Open Add Job Modal
   const openEditNotesModal = () => {
    setIsEditNotesModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditNotesModal = () => {
    setIsEditNotesModalVisible(false);
  };

  // Search functionality
//   const onSearch = (e) => {
//     const value = e.currentTarget.value;
//     const searchArray = value ? list : OrderListData;
//     const data = utils.wildCardSearch(searchArray, value);
//     setList(data);
//     setSelectedRowKeys([]);
//   };

 




  return (
    <>
    
    
    {/* // <Card bodyStyle={{ padding: '-3px' }}> */}
      <Flex alignItems="center" mobileFlex={false} className='justify-end'>  
        <Flex gap="7px" alignItems="center">
          <Button type="primary" className="ml-2" onClick={openAddNotesModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
        </Flex>
      </Flex>

      <ViewNotes/>

      {/* <Card>
        <div>
            <Personal
        </div>
      </Card> */}

      {/* <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} /> */}

       {/* Add Job Modal */}
       <Modal
        title="Add Notes"
        visible={isAddNotesModalVisible}
        onCancel={closeAddNotesModal}
        footer={null}
        width={800}
        className='mt-[-70px]'
      >
        <AddNotes onClose={closeAddNotesModal} />
      </Modal>
       <Modal
        title="Edit Notes"
        visible={isEditNotesModalVisible}
        onCancel={closeEditNotesModal}
        footer={null}
        width={1000}
        divider={true}
        className='mt-[-70px]'
      >
        <EditNotes onClose={closeEditNotesModal} />
      </Modal>
    {/* // </Card> */}
    </>
  );
};

export default NotesList;

