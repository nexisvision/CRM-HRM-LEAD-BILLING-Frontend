import React, { useEffect, useState } from 'react';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useDispatch, useSelector } from "react-redux";
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
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  PushpinOutlined,
  LoginOutlined,
  FileExcelOutlined,
  EditOutlined,
} from '@ant-design/icons';
import EditCompany from './EditCompany';
import { ClientData, deleteClient } from './CompanyReducers/CompanySlice';

const CompanyCard = ({ company }) => {
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditCompanyCardModalVisible, setIsEditCompanyCardModalVisible] = useState(false);
  const [comnyid, setCompnyid] = useState('');
  const dispatch = useDispatch();

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const eidtfun = (idd) => {
    setIsEditCompanyCardModalVisible(true);
    setCompnyid(idd);
  };
  const deleteUser = (elmId) => {
    dispatch(deleteClient(elmId));
    message.success(`Deleted user ${elmId}`);
  };

  
  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<PushpinOutlined />}
            onClick={() => eidtfun(elm)}
            size="small"
          >
            <span className="">Edit</span>
          </Button>
        </Flex>
      </Menu.Item>
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
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<MailOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span>Login As Company</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<EyeOutlined />} size="small">
            <span>Reset Password</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<LoginOutlined />} size="small">
            <span>Login Disable</span>
          </Button>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg cursor-pointer">
      <div className="text-end">
        <EllipsisDropdown menu={dropdownMenu(company)} />
      </div>
      <div className="flex flex-col items-center">
        <img src={company.image} alt={company.name} className="rounded-full w-24 h-24 mb-2" />
        <h3 className="font-semibold text-lg">{company.name}</h3>
        <p className="text-gray-500">{company.email}</p>
        <p className="text-gray-400">{company.plan}</p>
        <p className="text-gray-400">Plan Expired: {company.expiryDate}</p>
      </div>
      <div className="flex justify-between mt-4">
        <Button className="bg-blue-600 text-white py-2 px-4 rounded">Upgrade Plan</Button>
        <Button className="bg-blue-600 text-white py-2 px-4 rounded">AdminHub</Button>
      </div>

      <Modal
        title="Edit Company Card"
        visible={isEditCompanyCardModalVisible}
        onCancel={() => setIsEditCompanyCardModalVisible(false)}
        footer={null}
      >
        <EditCompany onClose={() => setIsEditCompanyCardModalVisible(false)} comnyid={comnyid} />
      </Modal>
    </div>
  );
};

export default CompanyCard;
