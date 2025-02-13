import React, { useEffect, useState } from "react";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
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
  Form,
} from "antd";
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
} from "@ant-design/icons";
import EditCompany from "./EditCompany";
import { ClientData, deleteClient } from "./CompanyReducers/CompanySlice";
import AddUpgradePlan from "./AddUpgradePlan";
import { useNavigate } from "react-router-dom";
const CompanyCard = ({ company }) => {
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditCompanyCardModalVisible, setIsEditCompanyCardModalVisible] =
    useState(false);
  const [isAddUpgradePlanModalVisible, setIsAddUpgradePlanModalVisible] =
    useState(false);
  const [comnyid, setCompnyid] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const[idd,setIdd]= useState("");
  const[emails,setEmail]= useState("");


  const showUserProfile = (idd) => {
    // setUserProfileVisible(true);
    // setSelectedUser(userInfo);
    setIdd(idd);
    navigate("/app/users/client-list", {
      state: {
        idd,
      },
    });
  };

  const ClickFun = (idd) => {
    // console.log("dsfvysdvf", idd);
   
  };


  const eidtfun = (idd) => {
    setIsEditCompanyCardModalVisible(true);
    setSelectedUser(company);
    setCompnyid(company.id);
  };

  const addfun = (idd) => {
    setIsAddUpgradePlanModalVisible(true);
    setCompnyid(idd);
  };

  const deleteUser = (elmId) => {
    dispatch(deleteClient(elmId));
    // message.success(`Deleted user ${elmId}`);
  };

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);


  const Loginfunctioan =  (data) => {
    try {
      console.log("data",data);
      const tokens = localStorage.getItem("auth_token")
      setTimeout(()=>{
        localStorage.setItem('autologintoken',tokens);
         localStorage.removeItem('auth_token');
         localStorage.removeItem('USER');
         localStorage.removeItem('isAuth');
         setEmail(data.email);
         localStorage.setItem('email',data.email);
         navigate(`/app/auth/login?email=${encodeURIComponent(data.email)}`);
         window.location.reload();
      },1000)

      setTimeout(()=>{
        setEmail(data.email);
        navigate(`/app/auth/login?email=${encodeURIComponent(data.email)}`);
     },1100)
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  const dropdownMenu = (elm) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EditOutlined />}
            onClick={() => showUserProfile(elm)} // Pass full company object
            size="small"
          >
            <span className="">Edit</span>
          </Button>
        </Flex>
      </Menu.Item> */}
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
            onClick={() => showUserProfile(elm.username)}
            size="small"
          >
            <span>Show Sub-client</span>
          </Button>
        </Flex>
      </Menu.Item>

      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<MailOutlined />}
            onClick={() => Loginfunctioan(elm)}
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
        <img
          src={company.profilePic}
          alt={company.name}
          className="rounded-full w-24 h-24 mb-2"
        />
        <h3 className="font-semibold text-lg">{company.name}</h3>
        <p className="text-gray-500">{company.email}</p>
        <p className="text-gray-400">{company.plan}</p>
        <p className="text-gray-400">Plan Expired: {company.expiryDate}</p>
      </div>
      <div className="flex justify-between mt-4">
        <Button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => addfun(company.id)}
        >
          Upgrade Plan
        </Button>
        {/* <Button className="bg-blue-600 text-white py-2 px-4 rounded">
          AdminHub
        </Button> */}
      </div>
      <Modal
        title="Add Upgrade Plan"
        visible={isAddUpgradePlanModalVisible}
        onCancel={() => setIsAddUpgradePlanModalVisible(false)}
        footer={null}
      >
        <AddUpgradePlan
          onClose={() => setIsAddUpgradePlanModalVisible(false)}
          comnyid={comnyid}
        />
      </Modal>
      <Modal
        title="Edit Company Card"
        visible={isEditCompanyCardModalVisible}
        onCancel={() => setIsEditCompanyCardModalVisible(false)}
        footer={null}
      >
        <EditCompany
          onClose={() => setIsEditCompanyCardModalVisible(false)}
          comnyid={comnyid}
          companyData={selectedUser} // Pass the correct company data to the modal
        />
      </Modal>
    </div>
  );
};

export default CompanyCard;
