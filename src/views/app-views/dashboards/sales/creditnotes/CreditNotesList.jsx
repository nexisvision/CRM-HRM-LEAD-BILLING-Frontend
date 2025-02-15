/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Row,
  Col,
  Button,
  Badge,
  Menu,
  Tag,
  Modal,
  message,
} from "antd";
// import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
// import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  CopyOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import AvatarStatus from "components/shared-components/AvatarStatus";
// import StatisticWidget from 'components/shared-components/StatisticWidget';
// import {
// 	AnnualStatisticData,
// } from '../../../dashboards/default/DefaultDashboardData';
import { TiPinOutline } from "react-icons/ti";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import utils from "utils";
import AddCrediteNotes from "./AddCrediteNotes";
import EditCrediteNotes from "./EditCreditNotes";
import ViewCreditNotes from "./ViewCreditNotes";
import {
  deletecreditnote,
  getcreditnote,
} from "./CustomerReducer/CreditnoteSlice";
import { useDispatch, useSelector } from "react-redux";
import { getInvoice } from "../invoice/InvoiceReducer/InvoiceSlice";
import useSelection from "antd/es/table/hooks/useSelection";
// import  from './AddEstimates';
// import EditEstimates from './EditEstimates';
// import ViewEstimates from './ViewEstimates';

const { Option } = Select;

const CreditNotesList = () => {
  const dispatch = useDispatch();
  // const [annualStatisticData] = useState(AnnualStatisticData);

  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const alldata = useSelector((state) => state.creditnotes);
  const fnddata = alldata.creditnotes.data;

  console.log('fnddata', fnddata);

  const [isAddCreditNotesModalVisible, setIsAddCreditNotesModalVisible] =
    useState(false);
  const [isEditCreditNotesModalVisible, setIsEditCreditNotesModalVisible] =
    useState(false);
  const [isViewCreditNotesModalVisible, setIsViewCreditNotesModalVisible] =
    useState(false);
    const [selectedCreditNoteId, setSelectedCreditNoteId] = useState(null);

  const [idd, setIdd] = useState("");

  // Get both credit notes and invoices data
  const creditNotesData = useSelector((state) => state.creditnotes.creditnotes.data);
  const invoicesData = useSelector((state) => state.salesInvoices.salesInvoices.data);

  useEffect(() => {
    dispatch(getcreditnote());
    dispatch(getInvoice());
  }, [dispatch]);

  const handleView = (creditNoteId) => {
    setSelectedCreditNoteId(creditNoteId);
    setIsViewCreditNotesModalVisible(true);
};

  useEffect(() => {
    if (creditNotesData && invoicesData) {
      // Combine credit notes with their corresponding invoice numbers
      const combinedData = creditNotesData.map(creditNote => {
        const matchingInvoice = invoicesData.find(invoice => invoice.id === creditNote.invoice);
        return {
          ...creditNote,
          salesInvoiceNumber: matchingInvoice ? matchingInvoice.salesInvoiceNumber : 'N/A'
        };
      });
      setList(combinedData);
    }
  }, [creditNotesData, invoicesData]);

  // Open Add Job Modal
  const openAddCreditNotesModal = () => {
    setIsAddCreditNotesModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddCreditNotesModal = () => {
    setIsAddCreditNotesModalVisible(false);
  };

  // Open Add Job Modal
  const openEditCreditNotesModal = () => {
    setIsEditCreditNotesModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditCreditNotesModal = () => {
    setIsEditCreditNotesModalVisible(false);
  };

  const openviewCreditNotesModal = () => {
    setIsViewCreditNotesModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewCreditNotesModal = () => {
    setSelectedCreditNoteId(null);
    setIsViewCreditNotesModalVisible(false);
};

  const deletefun = (userId) => {
    dispatch(deletecreditnote(userId)).then(() => {
      dispatch(getcreditnote());
      setList(list.filter((item) => item.id !== userId));
      message.success("Credit Note deleted successfully.");
    });
  };

  const stripHtmlTags = (html) => {
    if (!html) return '';
    // First, decode any HTML entities
    const decoded = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    // Create a temporary element
    const temp = document.createElement('div');
    // Set the HTML content
    temp.innerHTML = decoded;
    // Get the text content
    return temp.textContent || temp.innerText || '';
  };

  const edtfun = (idd) => {
    openEditCreditNotesModal();
    setIdd(idd);
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
              
                  if (parsedPermissions["dashboards-sales-creditnotes"] && parsedPermissions["dashboards-sales-creditnotes"][0]?.permissions) {
                    allpermisson = parsedPermissions["dashboards-sales-creditnotes"][0].permissions;
                    console.log('Parsed Permissions:', allpermisson);
                  
                  } else {
                    console.log('dashboards-sales-creditnotes is not available');
                  }
                  
                  const canCreateClient = allpermisson?.includes('create');
                  const canEditClient = allpermisson?.includes('edit');
                  const canDeleteClient = allpermisson?.includes('delete');
                  const canViewClient = allpermisson?.includes('view');
        
                  ///endpermission


  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={() => handleView(row.id)}
            size="small"
          >
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
     
   

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                           <Menu.Item>
                           <Flex alignItems="center" onClick={() => edtfun(row.id)}>
                             <EditOutlined />
                             <span className="ml-2">Edit</span>
                           </Flex>
                         </Menu.Item>
                    ) : null}
      
      
      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                       <Menu.Item>
                       <Flex alignItems="center" onClick={() => deletefun(row.id)}>
                         <DeleteOutlined />
                         <span className="ml-2">Delete</span>
                       </Flex>
                     </Menu.Item>
                    ) : null}


    </Menu>
  );

  const tableColumns = [
    {
      title: "Invoice Number",
      dataIndex: "salesInvoiceNumber",
      sorter: {
        compare: (a, b) => {
          const numA = a.salesInvoiceNumber || '';
          const numB = b.salesInvoiceNumber || '';
          return numA.localeCompare(numB);
        },
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (_, record) => (
        <span>
          {record.date ? dayjs(record.date).format('DD-MM-YYYY') : ''}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "date"),

    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (_, record) => (
        <span className="font-weight-semibold">
          <NumberFormat
            displayType={"text"}
            value={(Math.round(record.amount * 100) / 100).toFixed(2)}
            prefix={"$"}
            thousandSeparator={true}
          />
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "amount"),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => {
        const cleanText = stripHtmlTags(text);
        return <span>{cleanText}</span>;
      },
      sorter: {
        compare: (a, b) => {
          const textA = stripHtmlTags(a.description || '');
          const textB = stripHtmlTags(b.description || '');
          return textA.length - textB.length;
        },
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

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = list;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  return (
    <>
      <Card>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap  gap-4"
        >
          <Flex
            cclassName="flex flex-wrap gap-4 mb-4 md:mb-0"
            mobileFlex={false}
          >
            <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48 me-2">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                onChange={(e) => onSearch(e)}
              />
            </div>
          </Flex>

          <Flex gap="7px" className="flex">
       
             {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                              <Button
                                                                                              type="primary"
                                                                                              className="flex items-center"
                                                                                              onClick={openAddCreditNotesModal}
                                                                                            >
                                                                                              <PlusOutlined />
                                                                                              <span className="ml-2">New</span>
                                                                                            </Button>
                                                                                
                                                                                    ) : null}


          </Flex>
        </Flex>
        <div className="table-responsive">

           {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                        <Table
                                                                        columns={tableColumns}
                                                                        dataSource={list}
                                                                        rowKey="id"
                                                                        scroll={{ x: 1200 }}
                                                                        // rowSelection={{
                                                                        // 	selectedRowKeys: selectedRowKeys,
                                                                        // 	type: 'checkbox',
                                                                        // 	preserveSelectedRowKeys: false,
                                                                        // 	...rowSelection,
                                                                        // }}
                                                                      />
                                                                        ) : null}


        
        </div>
      </Card>

      <Card>
        <Modal
          title="Add Credite Notes"
          visible={isAddCreditNotesModalVisible}
          onCancel={closeAddCreditNotesModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <AddCrediteNotes onClose={closeAddCreditNotesModal} />
        </Modal>

        <Modal
          title="Edit Credite Notes"
          visible={isEditCreditNotesModalVisible}
          onCancel={closeEditCreditNotesModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <EditCrediteNotes onClose={closeEditCreditNotesModal} idd={idd} />
        </Modal>

        <Modal
          title={<h2 className="text-xl font-medium">View Credit Note</h2>}
          visible={isViewCreditNotesModalVisible}
          onCancel={closeViewCreditNotesModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <ViewCreditNotes creditNoteId={selectedCreditNoteId} onClose={closeViewCreditNotesModal} />
        </Modal>
      </Card>
    </>
  );
};

export default CreditNotesList;
