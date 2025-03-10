/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Badge,
  Menu,
  Tag,
  Modal,
  message,
  DatePicker,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import utils from "utils";
import AddCrediteNotes from "./AddCrediteNotes";
import EditCrediteNotes from "./EditCreditNotes";
import {
  deletecreditnote,
  getcreditnote,
} from "./CustomerReducer/CreditnoteSlice";
import { useDispatch, useSelector } from "react-redux";
import { getInvoice } from "../invoice/InvoiceReducer/InvoiceSlice";

const { Option } = Select;

const CreditNotesList = () => {
  const dispatch = useDispatch();

  const [list, setList] = useState([]);

  const alldata = useSelector((state) => state.creditnotes);
  const fnddata = alldata.creditnotes.data;


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

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    dispatch(getcreditnote());
    dispatch(getInvoice());
  }, [dispatch]);

  useEffect(() => {
    if (fnddata && invoicesData) {
      const combinedData = fnddata.map(creditNote => {
        const matchingInvoice = invoicesData.find(invoice => invoice.id === creditNote.invoice);
        return {
          ...creditNote,
          salesInvoiceNumber: matchingInvoice ? matchingInvoice.salesInvoiceNumber : 'N/A'
        };
      });
      setFilteredData(combinedData);
    }
  }, [fnddata, invoicesData]);

  const handleView = (creditNoteId) => {
    setSelectedCreditNoteId(creditNoteId);
    setIsViewCreditNotesModalVisible(true);
  };

  useEffect(() => {
    if (creditNotesData && invoicesData) {
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
    const decoded = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const temp = document.createElement('div');
    temp.innerHTML = decoded;
    return temp.textContent || temp.innerText || '';
  };

  const edtfun = (idd) => {
    openEditCreditNotesModal();
    setIdd(idd);
  };

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

  } else {
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission

  const tableColumns = [
    {
      title: "Invoice Number",
      dataIndex: "salesInvoiceNumber",
      render: (text, record) => (
        <span
          className=" cursor-pointer hover:underline"
          onClick={() => {
            // Check if user has view permission
            if (whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) {
              handleView(record.id);
            }
          }}
        >
          {text}
        </span>
      ),
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
    }
  ];

  const filterCreditNotes = (text, date) => {
    if (!fnddata || !invoicesData) return;

    let filtered = fnddata.map(creditNote => {
      const matchingInvoice = invoicesData.find(invoice => invoice.id === creditNote.invoice);
      return {
        ...creditNote,
        salesInvoiceNumber: matchingInvoice ? matchingInvoice.salesInvoiceNumber : 'N/A'
      };
    });

    // Apply text search filter
    if (text) {
      filtered = filtered.filter(item => 
        item.salesInvoiceNumber.toString().toLowerCase().includes(text.toLowerCase())
      );
    }

    // Apply date filter
    if (date) {
      const selectedDate = dayjs(date).startOf('day');
      filtered = filtered.filter(item => {
        if (!item.date) return false;
        const itemDate = dayjs(item.date).startOf('day');
        return itemDate.isSame(selectedDate, 'day');
      });
    }

    setFilteredData(filtered);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterCreditNotes(searchText, date);
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    filterCreditNotes(value, selectedDate);
  };

  const getFilteredCreditNotes = () => {
    return filteredData || [];
  };

  return (
    <>
      <Card className="">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap  gap-4"
        >
          <Flex
            className="flex flex-wrap gap-4 mb-4 md:mb-0"
            mobileFlex={false}
          >
            <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48 me-2">
              <Input
                placeholder="Search by invoice number..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                allowClear
                className="search-input"
              />
            </div>
            <div className="mb-3">
              <DatePicker
                onChange={handleDateChange}
                format="DD-MM-YYYY"
                placeholder="Select Date"
                className="w-100"
                style={{ minWidth: 200 }}
                allowClear
                value={selectedDate}
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
              dataSource={getFilteredCreditNotes()}
              rowKey="id"
              pagination={{
                total: getFilteredCreditNotes().length,
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
              }}
            />
          ) : null}



        </div>
      </Card>

     
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

    </>
  );
};

export default CreditNotesList;
