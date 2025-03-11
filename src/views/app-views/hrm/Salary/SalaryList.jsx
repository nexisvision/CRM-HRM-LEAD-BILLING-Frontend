import React, { useEffect, useState } from "react";
import {
    Card,
    Table,
    Input,
    Button,
    Tag,
    message,
    Modal,
    Dropdown,
} from "antd";
import {
    DeleteOutlined,
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import { useDispatch, useSelector } from "react-redux";
import { GetSalary, SalaryDelete } from "./SalaryReducer/SalarySlice";
import AddSalary from "./AddSalary";
import EditSalary from "./EditSalary";

const SalaryList = () => {
    const dispatch = useDispatch();
    const [isAddSalaryModalVisible, setIsAddSalaryModalVisible] = useState(false);
    const [isEditSalaryModalVisible, setIsEditSalaryModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    // Get data from Redux store
    const alldata = useSelector((state) => state.Salary);
    const fnddta = alldata.Salary?.data || [];

    // Fetch initial data
    useEffect(() => {
        dispatch(GetSalary());
    }, [dispatch]);

    // Update filtered data when main data or search changes
    useEffect(() => {
        if (fnddta) {
            const filtered = fnddta.filter(
                (item) =>
                    item.employee?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.salary?.toString().includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [fnddta, searchText]);

    const deleteSalary = async (userId) => {
        try {
            await dispatch(SalaryDelete(userId));
            message.success("Salary deleted successfully");
            dispatch(GetSalary()); // Refresh data after deletion
        } catch (error) {
            message.error("Error deleting salary");
        }
    };

    const handleEdit = (id) => {
        setSelectedId(id);
        setIsEditSalaryModalVisible(true);
    };

    const getDropdownItems = (record) => {
        return [
            {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Edit',
                onClick: () => handleEdit(record.id)
            },
            {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: 'Delete',
                onClick: () => deleteSalary(record.id),
                danger: true
            }
        ];
    };

    const tableColumns = [
        {
            title: "Employee",
            dataIndex: "employee",
            render: (_, record) => (
                <div className="d-flex">
                    <span>{record.employee}</span>
                </div>
            ),
            sorter: (a, b) => a.employee?.localeCompare(b.employee),
        },
        {
            title: "Salary",
            dataIndex: "salary",
            sorter: (a, b) => a.salary - b.salary,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status) => (
                <Tag className="text-capitalize" color={status === "active" ? "cyan" : "red"}>
                    {status}
                </Tag>
            ),
            sorter: (a, b) => a.status?.localeCompare(b.status),
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (_, record) => (
                <div className="text-center">
                    <Dropdown
                        menu={{ items: getDropdownItems(record) }}
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
        <Card>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3 mb-3">
                        <Input
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </Flex>
                <div>
                    <Button
                        type="primary"
                        onClick={() => setIsAddSalaryModalVisible(true)}
                        icon={<PlusOutlined />}
                        block
                    >
                        Add Salary
                    </Button>
                </div>
            </Flex>
            <div className="table-responsive">
                <Table
                    columns={tableColumns}
                    dataSource={filteredData}
                    rowKey="id"
                    pagination={{
                        total: filteredData.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                    }}
                />
            </div>

            <Modal
                title="Add Salary"
                visible={isAddSalaryModalVisible}
                onCancel={() => setIsAddSalaryModalVisible(false)}
                footer={null}
                width={800}
            >
                <AddSalary onClose={() => setIsAddSalaryModalVisible(false)} />
            </Modal>

            <Modal
                title="Edit Salary"
                visible={isEditSalaryModalVisible}
                onCancel={() => setIsEditSalaryModalVisible(false)}
                footer={null}
                width={800}
            >
                <EditSalary
                    id={selectedId}
                    onClose={() => setIsEditSalaryModalVisible(false)}
                />
            </Modal>
        </Card>
    );
};

const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 250px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

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

  .ant-btn-text:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .ant-btn-text:active {
    background-color: rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    .search-input {
      width: 100%;
      min-width: unset;
    }
    
    .mr-md-3 {
      margin-right: 0;
    }
  }

  .table-responsive {
    overflow-x: auto;
  }
`;

const SalaryListWithStyles = () => (
    <>
        <style>{styles}</style>
        <SalaryList />
    </>
);

export default SalaryListWithStyles; 