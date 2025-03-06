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
    DatePicker,
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
import { GetProject } from '../project-list/projectReducer/ProjectSlice';
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";


const { Option } = Select;
const { RangePicker } = DatePicker;
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
    const [dateRange, setDateRange] = useState(null);

    const projectData = useSelector((state) => state.Project);
    const projects = projectData.Project.data || [];

    const allempdatass = useSelector((state) => state.currencies);
    const fnddatass = allempdatass?.currencies?.data;

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
                    await dispatch(GetProject());
                    await dispatch(getcurren());
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
                filtered = filtered.filter(item => {
                    const projectName = projects.find(p => p.id === item.project)?.project_name || '';
                    const currency = fnddatass?.find(c => c.id === item.currency);
                    const currencyInfo = currency ? 
                        `${currency.currencyName} ${currency.currencyCode} ${currency.currencyIcon}` : '';
                    
                    return (
                        item.item?.toLowerCase().includes(searchText.toLowerCase()) ||
                        projectName.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.description?.toLowerCase().replace(/<[^>]*>/g, '').includes(searchText.toLowerCase()) ||
                        currencyInfo.toLowerCase().includes(searchText.toLowerCase())
                    );
                });
            }

            // Apply date range filter
            if (dateRange && dateRange.length === 2) {
                filtered = filtered.filter(item => {
                    const purchaseDate = dayjs(item.purchase_date);
                    return purchaseDate.isAfter(dateRange[0].startOf('day')) && 
                           purchaseDate.isBefore(dateRange[1].endOf('day'));
                });
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
    }, [searchText, selectedStatus, list, dateRange]);

    const onSearch = (e) => {
        const value = e.currentTarget.value.toLowerCase();
        setSearchText(value);

        if (!value) {
            handleFilters(list);
            return;
        }

        const filtered = list.filter(item => {
            const projectName = projects.find(p => p.id === item.project)?.project_name || '';
            const currency = fnddatass?.find(c => c.id === item.currency);
            const currencyInfo = currency ? 
                `${currency.currencyName} ${currency.currencyCode} ${currency.currencyIcon}` : '';
            
            return (
                item.item?.toLowerCase().includes(value) ||
                projectName.toLowerCase().includes(value) ||
                item.description?.toLowerCase().replace(/<[^>]*>/g, '').includes(value) ||
                currencyInfo.toLowerCase().includes(value)
            );
        });

        setFilteredData(filtered);
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
            const formattedData = list.map(row => {
                const currency = fnddatass?.find(c => c.id === row.currency);
                const projectName = projects.find(p => p.id === row.project)?.project_name || 'N/A';
                
                return {
                    ItemName: row.item,
                    Project: projectName,
                    Description: row.description?.replace(/<[^>]+>/g, ''),
                    Price: `${currency?.currencyIcon || '₹'}${(row.price || 0).toLocaleString()}`,
                    Currency: currency ? `${currency.currencyName} (${currency.currencyCode})` : 'N/A',
                    PurchaseDate: row.purchase_date ? dayjs(row.purchase_date).format('DD/MM/YYYY') : 'N/A',
                };
            });

            const ws = utils.json_to_sheet(formattedData);
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, "Expenses");
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
            title: "Project",
            dataIndex: "project",
            render: (projectId) => {
                const projectName = projects.find(p => p.id === projectId)?.project_name || 'N/A';
                return <span>{projectName}</span>;
            },
            sorter: (a, b) => {
                const projectNameA = projects.find(p => p.id === a.project)?.project_name || '';
                const projectNameB = projects.find(p => p.id === b.project)?.project_name || '';
                return projectNameA.localeCompare(projectNameB);
            },
        },
        {
            title: "Description",
            dataIndex: "description",
            render: (description) => (
                <div 
                    dangerouslySetInnerHTML={{ __html: description }} 
                    className="max-w-md truncate"
                    title={description?.replace(/<[^>]*>/g, '')}
                />
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (price, record) => {
                const currency = fnddatass?.find(c => c.id === record.currency);
                return (
                    <span>
                        {currency?.currencyIcon || '₹'}
                        {(price || 0).toLocaleString()}
                    </span>
                );
            },
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
        },
        {
            title: "Currency",
            dataIndex: "currency",
            render: (currencyId) => {
                const currency = fnddatass?.find(c => c.id === currencyId);
                return (
                    <span>
                        {currency ? (
                            <div className="flex items-center">
                                <span className="mr-2">{currency.currencyIcon}</span>
                                <span>{currency.currencyName}</span>
                                <span className="text-gray-400 text-xs ml-1">({currency.currencyCode})</span>
                            </div>
                        ) : 'N/A'}
                    </span>
                );
            },
            sorter: (a, b) => {
                const currencyA = fnddatass?.find(c => c.id === a.currency)?.currencyName || '';
                const currencyB = fnddatass?.find(c => c.id === b.currency)?.currencyName || '';
                return currencyA.localeCompare(currencyB);
            },
        },
        {
            title: "Purchase Date",
            dataIndex: "purchase_date",
            render: (date) => (
                <span>
                    {date ? dayjs(date).format('DD/MM/YYYY') : 'N/A'}
                </span>
            ),
            sorter: (a, b) => new Date(a.purchase_date) - new Date(b.purchase_date),
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
                    <div className="mr-0 md:mr-3 mb-3 md:mb-0">
                        <RangePicker
                            onChange={(dates) => setDateRange(dates)}
                            format="DD-MM-YYYY"
                            allowClear
                            placeholder={['Start Date', 'End Date']}
                            className="w-full md:w-auto"
                        />
                    </div>
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
        
        </>
    );
};
export default ExpensesList;