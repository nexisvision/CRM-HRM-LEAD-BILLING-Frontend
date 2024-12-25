import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import EditNotes from "../notes/EditNotes"
import userData from 'assets/data/user-list.data.json';

function ViewNotes() {
  const [users, setUsers] = useState(userData);
  const [isEditNotesModalVisible, setIsEditNotesModalVisible] = useState(false);
  // Open Add Job Modal
  const openEditNotesModal = () => {
    setIsEditNotesModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditNotesModal = () => {
    setIsEditNotesModalVisible(false);
  };


  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center" onClick={openEditNotesModal}>
          <EditOutlined />
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center"  onClick={() => deleteUser(elm.id)}>
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );
   // Delete user
   const deleteUser = (userId) => {
    setUsers(users.filter((item) => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  return (
    <>
    <div className='grid grid-cols-1 gap-3'>
      <div className='mt-2'>
        <h1 className='text-2xl font-semibold ms-1'>Personal Notes</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3'> 
        {/* <div className='flex mt-3 gap-3 flex-wrap sm:flex-nowrap md:flex-nowrap'>  */}
        <Card className='mt-2 w-full'>
          <div>
            <div className='flex justify-between border-b pb-2'>
              <h1 className='text-lg font-medium'>Note</h1>
              <div className="text-center">
                <EllipsisDropdown menu={dropdownMenu()} />
              </div>
            </div>
            <div className='overflow-y-auto h-[150px] mt-2 p-2 lg:p-0'>
              <p className='text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro placeat ratione iusto exercitationem, quidem amet, illo ullam eius in corporis accusamus et mollitia. Ex accusantium, sunt fugit nostrum ratione maiores! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis tenetur harum eveniet odit incidunt, dolore numquam dolores praesentium error. Cum ut exercitationem incidunt modi natus asperiores vel dolor excepturi nobis Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam libero impedit voluptas esse minima hic facere facilis nihil expedita corporis! Quam, eum. Possimus deleniti dolore assumenda ad amet molestias eos.</p>
            </div>
          </div>
        </Card>
        <Card className='mt-2 w-full'>
          <div>
            <div className='flex justify-between border-b pb-2'>
              <h1 className='text-lg font-medium'>Note</h1>
              <div className="text-center">
                <EllipsisDropdown menu={dropdownMenu()} />
              </div>
            </div>
            <div className='overflow-y-auto h-[150px] mt-2 p-2 lg:p-0'>
              <p className='text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro placeat ratione iusto exercitationem, quidem amet, illo ullam eius in corporis accusamus et mollitia. Ex accusantium, sunt fugit nostrum ratione maiores! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis tenetur harum eveniet odit incidunt, dolore numquam dolores praesentium error. Cum ut exercitationem incidunt modi natus asperiores vel dolor excepturi nobis Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam libero impedit voluptas esse minima hic facere facilis nihil expedita corporis! Quam, eum. Possimus deleniti dolore assumenda ad amet molestias eos.</p>
            </div>
          </div>
        </Card>
        <Card className='mt-2 w-full'>
          <div>
            <div className='flex justify-between items-center border-b pb-2'>
              <h1 className='text-lg font-medium'>Note</h1>
              <div className="text-center">
                <EllipsisDropdown menu={dropdownMenu()} />
              </div>
            </div>
            <div className='overflow-y-auto h-[150px] mt-2 p-2 lg:p-0'>
              <p className='text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro placeat ratione iusto exercitationem, quidem amet, illo ullam eius in corporis accusamus et mollitia. Ex accusantium, sunt fugit nostrum ratione maiores! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis tenetur harum eveniet odit incidunt, dolore numquam dolores praesentium error. Cum ut exercitationem incidunt modi natus asperiores vel dolor excepturi nobis Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam libero impedit voluptas esse minima hic facere facilis nihil expedita corporis! Quam, eum. Possimus deleniti dolore assumenda ad amet molestias eos.</p>
            </div>
          </div>
        </Card>
        </div>
      </div>
      <div className='mt-2'>
      <h1 className='text-2xl font-semibold ms-1'>Shared Notes</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3'>
        
        <Card className='mt-2 w-full'>
          <div>
            <div className='flex justify-between border-b pb-2'>
              <h1 className='text-lg font-medium'>Note</h1>
              <div className="text-center">
                <EllipsisDropdown menu={dropdownMenu()} />
              </div>
            </div>
            <div className='overflow-y-auto h-[150px] mt-2 p-2 lg:p-0'>
              <p className='text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro placeat ratione iusto exercitationem, quidem amet, illo ullam eius in corporis accusamus et mollitia. Ex accusantium, sunt fugit nostrum ratione maiores! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis tenetur harum eveniet odit incidunt, dolore numquam dolores praesentium error. Cum ut exercitationem incidunt modi natus asperiores vel dolor excepturi nobis Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam libero impedit voluptas esse minima hic facere facilis nihil expedita corporis! Quam, eum. Possimus deleniti dolore assumenda ad amet molestias eos.</p>
            </div>
          </div>
        </Card>
        <Card className='mt-2 w-full '>
          <div>
            <div className='flex justify-between border-b pb-2'>
              <h1 className='text-lg font-medium'>Note</h1>
              <div className="text-center">
                <EllipsisDropdown menu={dropdownMenu()} />
              </div>
            </div>
            <div className='overflow-y-auto h-[150px] mt-2 p-2 lg:p-0'>
              <p className='text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro placeat ratione iusto exercitationem, quidem amet, illo ullam eius in corporis accusamus et mollitia. Ex accusantium, sunt fugit nostrum ratione maiores! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis tenetur harum eveniet odit incidunt, dolore numquam dolores praesentium error. Cum ut exercitationem incidunt modi natus asperiores vel dolor excepturi nobis Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam libero impedit voluptas esse minima hic facere facilis nihil expedita corporis! Quam, eum. Possimus deleniti dolore assumenda ad amet molestias eos.</p>
            </div>
          </div>
        </Card>
        <Card className='mt-2 w-full'>
          <div>
            <div className='flex justify-between items-center border-b pb-2'>
              <h1 className='text-lg font-medium'>Note</h1>
              <div className="text-center">
                <EllipsisDropdown menu={dropdownMenu()} />
              </div>
            </div>
            <div className='overflow-y-auto h-[150px] mt-2 p-2 lg:p-0'>
              <p className='text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro placeat ratione iusto exercitationem, quidem amet, illo ullam eius in corporis accusamus et mollitia. Ex accusantium, sunt fugit nostrum ratione maiores! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis tenetur harum eveniet odit incidunt, dolore numquam dolores praesentium error. Cum ut exercitationem incidunt modi natus asperiores vel dolor excepturi nobis Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam libero impedit voluptas esse minima hic facere facilis nihil expedita corporis! Quam, eum. Possimus deleniti dolore assumenda ad amet molestias eos.</p>
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
      <Modal
          title="Edit Notes"
          visible={isEditNotesModalVisible}
          onCancel={closeEditNotesModal}
          footer={null}
          width={800}
          divider={true}
          className='mt-[-70px]'
        >
          <EditNotes onClose={closeEditNotesModal} />
        </Modal>

        </>
  )
}

export default ViewNotes
