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
import {
    EyeOutlined,
    FileExcelOutlined,
    SearchOutlined,
    PlusCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import AvatarStatus from "components/shared-components/AvatarStatus";
import StatisticWidget from "components/shared-components/StatisticWidget";
import { TiPinOutline } from "react-icons/ti";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import { useDispatch, useSelector } from "react-redux";
import { DeleteExp, Getexp } from "./Expencereducer/ExpenseSlice";
import { useParams } from "react-router-dom";
import { utils, writeFile } from "xlsx";
import AddExpenses from "./AddExpenss";
import EditExpenses from "./EditExpenss";
import ViewExpenss from "./ViewExpenss";

const { Option } = Select;
const getShippingStatus = (orderStatus) => {
    if (orderStatus === "Ready") {
        return "blue";
    }
    if (orderStatus === "Shipped") {
        return "cyan";
    }
    return "";
};
const expenseStatusList = ["Ready", "Shipped"];
const ExpensesList = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    
    const [list, setList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [idd, setIdd] = useState("");
    const [isAddExpensesModalVisible, setIsAddExpensesModalVisible] =
        useState(false);
    const [isEditExpensesModalVisible, setIsEditExpensesModalVisible] =
        useState(false);
    const [isViewExpensesModalVisible, setIsViewExpensesModalVisible] =
        useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    const allempdata = useSelector((state) => state.Expense);
    const filtermin = allempdata.Expense.data;

    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [loading, setLoading] = useState(false);

    const openAddExpensesModal = () => {
        setIsAddExpensesModalVisible(true);
    };
    // Close Add Job Modal
    const closeAddExpensesModal = () => {
        setIsAddExpensesModalVisible(false);
    };
    // Open Add Job Modal
    const openEditExpensesModal = () => {
        setIsEditExpensesModalVisible(true);
    };
    // Close Add Job Modal
    const closeEditExpensesModal = () => {
        setIsEditExpensesModalVisible(false);
    };
    const openviewExpensesModal = () => {
        setIsViewExpensesModalVisible(true);
    };
    // Close Add Job Modal
    const closeViewExpensesModal = () => {
        setIsViewExpensesModalVisible(false);
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                if (id) {
                    await dispatch(Getexp(id));
                }
            } catch (error) {
                console.error('Error loading data:', error);
                message.error('Failed to load data');
            }
            setLoading(false);
        };

        loadInitialData();
    }, [dispatch, id]);

    useEffect(() => {
        if (filtermin) {
            setList(filtermin);
            handleFilters(filtermin); // Initialize filtered data
        }
    }, [filtermin]);

    const handleFilters = (data = list) => {
        setLoading(true);
        try {
            let filtered = [...data];

            // Apply search text filter
            if (searchText) {
                filtered = filtered.filter(item => 
                    item.item?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.employee?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.currency?.toLowerCase().includes(searchText.toLowerCase())
                );
            }


            setFilteredData(filtered);
        } catch (error) {
            console.error('Error filtering data:', error);
            message.error('Failed to filter data');
        }
        setLoading(false);
    };

    useEffect(() => {
        handleFilters();
    }, [searchText, selectedStatus, list]);

    const onSearch = (e) => {
        setSearchText(e.currentTarget.value);
    };

    const getUniqueStatuses = () => {
        if (!list) return [];
        
        const statuses = [...new Set(list.map(item => item.status))];
        return [
            { value: 'all', label: 'All Status' },
            ...statuses.map(status => ({
                value: status,
                label: status
            }))
        ];
    };

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
    };

    const statusOptions = getUniqueStatuses();

    const exportToExcel = () => {
        try {
          // Format the data for Excel
          // const formattedData = list.map(row => ({
          //   ID: row.id,
          //   RelatedID: row.related_id,
          //   TaskName: row.taskName,
          //   Category: row.category,
          //   Project: row.project,
          //   StartDate: row.startDate,
          //   DueDate: row.dueDate,
          //   AssignedTo: JSON.parse(row.assignTo).join(", "), // Assuming assignTo is a JSON string
          //   Status: row.status,
          //   Priority: row.priority,
          //   Description: row.description.replace(/<[^>]+>/g, ''), // Remove HTML tags from description
          //   CreatedBy: row.created_by,
          //   CreatedAt: row.createdAt,
          //   UpdatedAt: row.updatedAt,
          // }));
    
          // Create a worksheet from the formatted data
          const ws = utils.json_to_sheet(list);
          const wb = utils.book_new(); // Create a new workbook
          utils.book_append_sheet(wb, ws, "Expenses"); // Append the worksheet to the workbook
    
          // Write the workbook to a file
          writeFile(wb, "ExpensesData.xlsx");
          message.success("Data exported successfully!");
        } catch (error) {
          console.error("Error exporting to Excel:", error);
          message.error("Failed to export data. Please try again.");
        }
      };

    const DeleteFun = async (exid) => {
        try {
            await dispatch(DeleteExp(exid));
             await dispatch(Getexp(id));

            setList(list.filter((item) => item.id !== exid));

            message.success({ content: "Deleted user successfully", duration: 2 });
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const EditFun = (exid) => {
        openEditExpensesModal();
        setIdd(exid);
    };

    const dropdownMenu = (row) => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center" onClick={() => {
                    setSelectedExpense(row);
                    openviewExpensesModal();
                }}>
                    {<EyeOutlined />}
                    <span className="ml-2">View Details</span>
                </Flex>
            </Menu.Item>
            {/* <Menu.Item>
                <Flex alignItems="center">
                    <PlusCircleOutlined />
                    <span className="ml-2">Add to remark</span>
                </Flex>
            </Menu.Item> */}
            <Menu.Item>
                <Flex alignItems="center" onClick={() => EditFun(row.id)}>
                    <EditOutlined />
                    <span className="ml-2">Edit</span>
                </Flex>
            </Menu.Item>
            {/* <Menu.Item>
                <Flex alignItems="center">
                    <TiPinOutline />
                    <span className="ml-2">Pin</span>
                </Flex>
            </Menu.Item> */}
            <Menu.Item>
                <Flex alignItems="center" onClick={() => DeleteFun(row.id)}>
                    <DeleteOutlined />
                    <span className="ml-2">Delete</span>
                </Flex>
            </Menu.Item>
        </Menu>
    );
    const tableColumns = [
        // {
        //   title: "ID",
        //   dataIndex: "id",
        // },
        {
            title: "ItemName",
            dataIndex: "item",
            render: (text, record) => (
                <span
                    className="cursor-pointer hover:underline"
                    onClick={() => {
                        setSelectedExpense(record);
                        openviewExpensesModal();
                    }}
                >
                    {record.item}
                </span>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, "item"),
        },
        {
            title: "Price",
            dataIndex: "price",
            sorter: {
                compare: (a, b) => a.price.length - b.price.length,
            },
        },
        {
            title: "Employees",
            dataIndex: "employee",
            render: (_, record) => (
                <div className="d-flex">
                    <AvatarStatus size={30} src={record.image} name={record.employee} />
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, "employees"),
        },
        {
            title: "currency ",
            dataIndex: "currency",
            sorter: {
                compare: (a, b) => a.purchasedFrom.length - b.purchasedFrom.length,
            },
        },
        {
            title: "Purchase Date",
            dataIndex: "purchase_date",
            render: (_, record) => (
              <span>
                {record.purchase_date ? dayjs(record.purchase_date).format('DD-MM-YYYY') : ''}
              </span>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, "date"),
          },
        // {
        //   title: "Status",
        //   dataIndex: "status",produc
        //   render: (_, record) => <span className="font-weight-semibold"></span>,
        //   sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
        // },
        {
            title: "Action",
            dataIndex: "actions",
            render: (_, elm) => (
                <div className="text-center">
                    <EllipsisDropdown menu={dropdownMenu(elm)} />
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, "actions"),
        },
        // {
        //  title: 'Payment Method',
        //  dataIndex: 'method',
        //  sorter: {
        //      compare: (a, b) => a.method.length - b.method.length,
        //  },
        // },
    ];
    const rowSelection = {
        onChange: (key, rows) => {
            setSelectedRows(rows);
            setSelectedRowKeys(key);
        },
    };
    return (
        <>
            <Flex
                alignItems="center"
                justifyContent="space-between"
                mobileFlex={false}
                className="flex flex-wrap gap-4"
            >
                <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
                    <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
                        <Input
                            placeholder="Search expenses..."
                            prefix={<SearchOutlined />}
                            onChange={onSearch}
                            value={searchText}
                            allowClear
                        />
                    </div>
                    {/* <div className="w-full md:w-48">
                        <Select
                            placeholder="Filter by status"
                            onChange={handleStatusChange}
                            value={selectedStatus}
                            style={{ width: '100%' }}
                        >
                            {statusOptions.map(status => (
                                <Option key={status.value} value={status.value}>
                                    {status.label}
                                </Option>
                            ))}
                        </Select>
                    </div> */}
                </Flex>
                <Flex gap="7px" className="flex">
                    <Button
                        type="primary"
                        className="ml-2"
                        onClick={openAddExpensesModal}
                    >
                        <PlusOutlined />
                        <span className="ml-2">Add Expenses</span>
                    </Button>
                    <Button
                        type="primary"
                        icon={<FileExcelOutlined />}
                        onClick={exportToExcel}
                        block
                    >
                        Export All
                    </Button>
                </Flex>
            </Flex>
            <Card>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={filteredData}
                        rowKey="id"
                        loading={loading}
                        scroll={{ x: 1200 }}
                        rowSelection={{
                            selectedRowKeys: selectedRowKeys,
                            type: "checkbox",
                            preserveSelectedRowKeys: false,
                            ...rowSelection,
                        }}
                    />
                </div>
            </Card>
            <Card>
                <Modal
                    title="Add Expenses"
                    visible={isAddExpensesModalVisible}
                    onCancel={closeAddExpensesModal}
                    footer={null}
                    width={1000}
                    className="mt-[-70px]"
                >
                    <AddExpenses onClose={closeAddExpensesModal} />
                </Modal>
                <Modal
                    title="Edit Expenses"
                    visible={isEditExpensesModalVisible}
                    onCancel={closeEditExpensesModal}
                    footer={null}
                    width={1000}
                    className="mt-[-70px]"
                >
                    <EditExpenses onClose={closeEditExpensesModal} idd={idd} />
                </Modal>
                <Modal
                    title="Expenses"
                    visible={isViewExpensesModalVisible}
                    onCancel={() => {
                        closeViewExpensesModal();
                        setSelectedExpense(null);
                    }}
                    footer={null}
                    width={800}
                    className='mt-[-70px]'
                >
                    <ViewExpenss data={selectedExpense} onClose={closeViewExpensesModal} />
                </Modal>
            </Card>
        </>
    );
};
export default ExpensesList;