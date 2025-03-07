import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { FaCoins } from "react-icons/fa";
import { IoLayers } from "react-icons/io5";
import {
    EyeOutlined,
    DeleteOutlined,
    CopyOutlined,
    EditOutlined,
    FundProjectionScreenOutlined,
    RiseOutlined,
    CopyrightOutlined,
    FormOutlined,
  } from "@ant-design/icons";
  import dayjs from "dayjs";
  import {Table} from "antd";
  import userData from "../../../../assets/data/user-list.data.json";
  import OrderListData from "assets/data/order-list.data.json";
  import { utils } from "xlsx";
  
import { ContaractData } from "../contract/ContractReducers/ContractSlice";
  import { GetProject } from "../project/project-list/projectReducer/ProjectSlice";
  import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
  import { useDispatch, useSelector } from "react-redux";


const DashboardList = () => {
    const [users, setUsers] = useState(userData);
    const [list, setList] = useState(OrderListData);
    const dispatch = useDispatch();

    // Move these selectors to the top of the component
    const tabledata = useSelector((state) => state.Contract);
    const clientData = useSelector((state) => state.SubClient?.SubClient?.data);
    const projectData = useSelector((state) => state.Project?.Project?.data);

    // First useEffect to fetch initial data
    useEffect(() => {
        dispatch(GetProject());
        dispatch(ClientData());
    }, [dispatch]);

    // Second useEffect to fetch contract data
    useEffect(() => {
        dispatch(ContaractData());
    }, [dispatch]);

    // Third useEffect to process the data once we have everything
    useEffect(() => {
        if (tabledata?.Contract?.data) {
            const contractsWithNames = tabledata.Contract.data.map(contract => ({
                ...contract,
                client: clientData?.find(client => client.id === contract.client)?.username || contract.client,
                project: projectData?.find(project => project.id === contract.project)?.project_name || contract.project
            }));
            setUsers(contractsWithNames);
        }
    }, [tabledata, clientData, projectData]);

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

    if (parsedPermissions["dashboards-project-Contract"] && parsedPermissions["dashboards-project-Contract"][0]?.permissions) {
        allpermisson = parsedPermissions["dashboards-project-Contract"][0].permissions;

    } else {
    }

    const canCreateClient = allpermisson?.includes('create');
    const canEditClient = allpermisson?.includes('edit');
    const canDeleteClient = allpermisson?.includes('delete');
    const canViewClient = allpermisson?.includes('view');

    const tableColumns = [

        {
            title: "Subject",
            dataIndex: "subject",
            sorter: {
                compare: (a, b) => a.subject.length - b.subject.length,
            },
        },
        {
            title: "Client",
            dataIndex: "client",
            render: (_, record) => (
                <span>
                    {clientData?.find(client => client.id === record.client)?.username || record.client}
                </span>
            ),
            sorter: {
                compare: (a, b) => {
                    const clientA = clientData?.find(client => client.id === a.client)?.username || a.client;
                    const clientB = clientData?.find(client => client.id === b.client)?.username || b.client;
                    return String(clientA).localeCompare(String(clientB));
                }
            }
        },
        {
            title: "Project",
            dataIndex: "project",
            render: (_, record) => (
                <span>
                    {projectData?.find(project => project.id === record.project)?.project_name || record.project}
                </span>
            ),
            sorter: {
                compare: (a, b) => {
                    const projectA = projectData?.find(project => project.id === a.project)?.project_name || a.project;
                    const projectB = projectData?.find(project => project.id === b.project)?.project_name || b.project;
                    return String(projectA).localeCompare(String(projectB));
                }
            }
        },
        {
            title: "Contract Type",
            dataIndex: "type",
            compare: (a, b) => a.type.length - b.type.length,
        },
        {
            title: "Contract Value",
            dataIndex: "value",
            // render: (_, record) => (
            //     <div className="d-flex">
            //         <AvatarStatus size={30} src={record.image} name={record.name}/>
            //     </div>
            // ),
            sorter: {
                compare: (a, b) => a.value.length - b.value.length,
            },
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            render: (_, record) => (
                <span>
                    {record.startDate ? dayjs(record.startDate).format('DD-MM-YYYY') : ''}
                </span>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, "startDate"),
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            render: (_, record) => (
                <span>
                    {record.endDate ? dayjs(record.endDate).format('DD-MM-YYYY') : ''}
                </span>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, "endDate"),
        }
    ];

    return (
        <>
            <div className="p-2 bg-gray-50">
                {/* Project Progress Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

                    {/* Client Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-500 p-2 pb-0 rounded-lg ">
                                <FundProjectionScreenOutlined className="text-white text-2xl" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-base font-medium">
                                    Total
                                </p>
                                <h3 className="text-gray-600 mb-2 text-base font-medium">
                                    Project
                                </h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-600 text-base font-semibold ">20</p>
                        </div>
                        </div>
                    </div>


                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-500 p-2 pb-0 rounded-lg ">
                                <FormOutlined  className="text-white text-2xl" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-base  font-medium">
                                    Total
                                </p>
                                <h3 className="text-gray-600 mb-2 text-base  font-medium">

                                    Task
                                </h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-600 text-base font-semibold ">35</p>
                        </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-500 p-2 pb-0 rounded-lg ">
                                <FundProjectionScreenOutlined className="text-white text-2xl" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-base  font-medium">
                                    Total
                                </p>
                                <h3 className="text-gray-600 mb-2 text-base  font-medium">

                                    Expense
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-gray-600 text-base font-semibold ">10</p>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

                    {/* <div className=""> */}

                    {/* Client Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-500 p-2 pb-0 rounded-lg ">
                                <RiseOutlined  className="text-white text-2xl" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-base  font-medium">
                                    Total
                                </p>

                                <h3 className="text-gray-600 mb-2 text-base font-medium">
                                    Lead
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-gray-600 text-base font-semibold ">40</p>
                        </div>
                        </div>
                    </div>


                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-500 p-2 pb-0 rounded-lg ">
                                <FundProjectionScreenOutlined className="text-white text-2xl" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-base font-medium">
                                    Total
                                </p>
                                <h3 className="text-gray-600 mb-2 text-base font-medium">

                                    Deal
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-gray-600 text-base font-semibold ">56</p>
                        </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-500 p-2 pb-0 rounded-lg ">
                                <CopyrightOutlined  className="text-white text-2xl" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-base  font-medium">

                                    Total
                                </p>
                                <h3 className="text-gray-600 mb-2 text-base  font-medium">
                                    Contract
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-gray-600 text-base font-semibold ">65</p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="table-responsive mt-2">
                {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                    <Table
                        columns={tableColumns}
                        dataSource={users}
                        rowKey="id"
                        scroll={{ x: 1200 }}
                    />
                ) : null}
            </div>

        </>
    );
};

export default DashboardList;
