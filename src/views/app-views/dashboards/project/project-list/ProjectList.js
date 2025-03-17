import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Tooltip,
  Avatar,
  Modal,
  Card,
  Radio,
  Row,
  Col,
  Dropdown,
  Menu,
  Select,
  Input,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  EllipsisOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import EditProject from "./EditProject";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import Flex from "components/shared-components/Flex";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { DeletePro, GetProject, Editpro } from "./projectReducer/ProjectSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import moment from "moment";
import { message } from "antd";
import { GetLable, AddLable } from "../../sales/LableReducer/LableSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";
import AddProject from "./AddProject";

const VIEW_LIST = "LIST";
const VIEW_GRID = "GRID";

const UserAvatarGroup = ({ users, maxCount = 3 }) => {
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const colors = [
    { bg: "#E3F2FD", text: "#1976D2" }, // Light Blue
    { bg: "#F3E5F5", text: "#7B1FA2" }, // Light Purple
    { bg: "#E8F5E9", text: "#388E3C" }, // Light Green
    { bg: "#FFF3E0", text: "#F57C00" }, // Light Orange
    { bg: "#E1F5FE", text: "#0288D1" }, // Light Sky Blue
    { bg: "#FCE4EC", text: "#C2185B" }, // Light Pink
  ];

  if (!users || users.length === 0) {
    return <span className="text-gray-500">No members</span>;
  }

  const displayUsers = users.slice(0, maxCount);
  const remainingCount = users.length - maxCount;

  return (
    <Avatar.Group
      maxCount={maxCount}
      maxStyle={{
        color: "#5A5A5A",
        backgroundColor: "#F5F5F5",
        border: "2px solid #FFFFFF",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        fontSize: "12px",
        fontWeight: "600",
      }}
    >
      {displayUsers.map((user, index) => {
        const name = user.firstName || user.username || user.email || "Unnamed";
        const color = colors[index % colors.length];
        return (
          <Tooltip key={user.id} title={name}>
            <Avatar
              style={{
                backgroundColor: color.bg,
                color: color.text,
                border: "2px solid #FFFFFF",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {getInitials(name)}
            </Avatar>
          </Tooltip>
        );
      })}
      {remainingCount > 0 && (
        <Avatar
          style={{
            backgroundColor: "#F5F5F5",
            color: "#5A5A5A",
            border: "2px solid #FFFFFF",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          +{remainingCount}
        </Avatar>
      )}
    </Avatar.Group>
  );
};

const STATUS_CONFIG = {
  Incomplete: {
    color: "#ff4d4f",
    icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
  },
  "To Do": {
    color: "#1890ff",
    icon: <ClockCircleOutlined style={{ color: "#1890ff" }} />,
  },
  "In Progress": {
    color: "#faad14",
    icon: <ClockCircleOutlined style={{ color: "#faad14" }} />,
  },
  Completed: {
    color: "#52c41a",
    icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  },
  "On Hold": {
    color: "#d9d9d9",
    icon: <ExclamationCircleOutlined style={{ color: "#d9d9d9" }} />,
  },
};

const TAG_COLORS = {
  pending: "#faad14",
  completed: "#52c41a",
  "in-progress": "#1890ff",
  delayed: "#ff4d4f",
  "on-hold": "#d9d9d9",
};

const ProjectList = () => {
  const [view, setView] = useState(VIEW_GRID);
  const [list, setList] = useState([]);
  const [isAddProjectModalVisible, setIsAddProjectModalVisible] =
    useState(false);
  const [isEditProjectModalVisible, setIsEditProjectModalVisible] =
    useState(false);
  const [clientid, setClientId] = useState("");
  const [idd, setIdd] = useState("");
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const AllProject = useSelector((state) => state.Project);
  const properdata = AllProject.Project.data;
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const username = loggedInUser ? loggedInUser.client_id : "";
  const { state } = useLocation();
  const [tags, setTags] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const AllLoggedData = useSelector((state) => state.user);
  const { currencies } = useSelector((state) => state.currencies);
  const currencyData = useMemo(() => currencies?.data || [], [currencies]);
  const alluserdatas = useSelector((state) => state.Users);
  const allUsers = useMemo(
    () => alluserdatas?.Users?.data || [],
    [alluserdatas]
  );

  useEffect(() => {
    if (state?.idd) {
      setClientId(state.idd);
    }
  }, [state]);

  const dispatch = useDispatch();

  const Allclientdata = useSelector((state) => state.SubClient);

  const dataclient = Allclientdata.SubClient.data;

  const navigate = useNavigate();

  const handleProjectClick = (id) => {
    navigate(`/app/dashboards/project/view/${id}`);
  };

  useEffect(() => {
    dispatch(empdata());
    dispatch(ClientData());
    dispatch(GetProject());
    dispatch(getcurren());
    dispatch(GetUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!properdata) return;

    const formattedData = properdata.map((item) => {
      let projectMembers = [];

      try {
        if (item.project_members) {
          if (typeof item.project_members === "string") {
            try {
              const parsed = JSON.parse(item.project_members);
              projectMembers = Array.isArray(parsed)
                ? parsed
                : parsed.project_members
                ? parsed.project_members
                : [];
            } catch (e) {
              console.error("Error parsing project members string:", e);
              projectMembers = [];
            }
          } else if (typeof item.project_members === "object") {
            projectMembers = Array.isArray(item.project_members)
              ? item.project_members
              : item.project_members.project_members
              ? item.project_members.project_members
              : [];
          }
        }

        if (item.files) {
          try {
            JSON.parse(item.files);
          } catch (e) {
            console.error("Error parsing files:", e);
          }
        }
      } catch (error) {
        console.error("Error processing item data:", error);
      }

      const currencyDetails =
        currencyData.find((c) => c.id === item.currency) || {};
      const currencyIcon = currencyDetails.currencyIcon || "₹";

      const memberDetails = projectMembers
        .filter((memberId) => memberId) // Filter out null/undefined members
        .map((memberId) => {
          const user = allUsers.find((user) => user.id === memberId);
          if (!user) {
            return null;
          }
          return user;
        })
        .filter(Boolean); // Remove null entries

      return {
        ...item,
        dateRange: `${new Date(item.startDate).toLocaleDateString(
          "en-GB"
        )}/${new Date(item.endDate).toLocaleDateString("en-GB")}`,
        id: item.id,
        name: item.project_name || item.name,
        category: item.project_category,
        attachmentCount: item.attachmentCount,
        totalTask: `${currencyIcon}${item.budget}`,
        completedTask: `${Math.round(
          ((new Date() - new Date(item.startDate)) /
            (new Date(item.endDate) - new Date(item.startDate))) *
            100
        )}%`,
        progressPercent: Math.round(
          ((new Date() - new Date(item.startDate)) /
            (new Date(item.endDate) - new Date(item.startDate))) *
            100
        ),
        dayleft: Math.max(
          0,
          Math.ceil((new Date(item.endDate) - new Date()) / (1000 * 3600 * 24))
        ),
        statusColor: item.status,
        memberDetails, // Updated member details
        tag: item.tag_name || item.tag,
        currencyIcon,
      };
    });
    setList(formattedData);
  }, [properdata, clientid, username, currencyData, allUsers]);

  useEffect(() => {
    const fetchLables = async () => {
      try {
        const lid = AllLoggedData.loggedInUser.id;
        const response = await dispatch(GetLable(lid));
        if (response.payload && response.payload.data) {
          const tagLabels = response.payload.data
            .filter((lable) => lable.lableType === "tag")
            .map((lable) => ({ id: lable.id, name: lable.name.trim() }));

          const statusLabels = response.payload.data
            .filter((lable) => lable.lableType === "status")
            .map((lable) => ({ id: lable.id, name: lable.name.trim() }));

          setTags(tagLabels);
          setStatuses(statusLabels);
        }
      } catch (error) {
        console.error("Failed to fetch labels:", error);
        message.error("Failed to load labels");
      }
    };

    fetchLables();
  }, [dispatch, AllLoggedData.loggedInUser.id]);

  const openAddProjectModal = () => setIsAddProjectModalVisible(true);
  const closeAddProjectModal = () => setIsAddProjectModalVisible(false);

  const openEditProjectModal = () => setIsEditProjectModalVisible(true);
  const closeEditProjectModal = () => setIsEditProjectModalVisible(false);

  const deleteItem = (id) => {
    dispatch(DeletePro(id)); // Assuming DeletePro is a redux action
    const updatedList = list.filter((item) => item.id !== id); // Update the list after deletion
    setList(updatedList); // Set the updated list in the state
  };

  const editp = (id) => {
    openEditProjectModal(id);
    setIdd(id);
  };

  const onChangeProjectView = (e) => {
    setView(e.target.value);
  };

  const getDropdownItems = (elm) => {
    return [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => editp(elm.id)
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => deleteItem(elm.id),
        danger: true
      }
    ];
  };

  const tableColumns = [
    {
      title: "Project",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div
          onClick={() => handleProjectClick(record.id)}
          className="cursor-pointer hover:text-blue-600"
        >
          <h4 className="mb-0">{name}</h4>
        </div>
      ),
    },
    {
      title: "Budget",
      dataIndex: "totalTask",
      key: "totalTask",
      render: (totalTask) => (
        <div>
          <span className="text-semibold">{totalTask}</span>
        </div>
      ),
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      render: (clientId) => {
        const client = dataclient?.find((c) => c.id === clientId);
        return <span>{client?.username || "N/A"}</span>;
      },
    },
    {
      title: "Project Members",
      dataIndex: "memberDetails",
      key: "memberDetails",
      render: (members) => <UserAvatarGroup users={members} maxCount={3} />,
    },
    {
      title: "Category",
      dataIndex: "project_category",
      key: "project_category",
      render: (category) => <span>{category || "N/A"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="interactive-cell" onClick={(e) => e.stopPropagation()}>
          <Select
            value={status || "Not Started"}
            style={{ width: 140 }}
            onChange={(value) => handleStatusChange(record.id, value)}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            className="status-select"
            dropdownStyle={{ zIndex: 1001 }}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <div className="select-dropdown-footer">
                  <Button
                    type="text"
                    block
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsStatusModalVisible(true);
                    }}
                  >
                    Add Status
                  </Button>
                </div>
              </div>
            )}
          >
            {statuses.map((statusOption) => (
              <Select.Option key={statusOption.id} value={statusOption.name}>
                <div className="flex items-center">
                  <span
                    className="h-2 w-2 rounded-full mr-2"
                    style={{
                      backgroundColor:
                        STATUS_CONFIG[statusOption.name]?.color || "#d9d9d9",
                    }}
                  />
                  {statusOption.name}
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (tag, record) => (
        <div className="interactive-cell" onClick={(e) => e.stopPropagation()}>
          <Select
            value={tag || "No Tag"}
            style={{ width: 140 }}
            onChange={(value) => handleTagChange(record.id, value)}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            className="tag-select"
            dropdownStyle={{ zIndex: 1001 }}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <div className="select-dropdown-footer">
                  <Button
                    type="text"
                    block
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTagModalVisible(true);
                    }}
                  >
                    Add Tag
                  </Button>
                </div>
              </div>
            )}
          >
            {tags.map((tagOption) => (
              <Select.Option key={tagOption.id} value={tagOption.name}>
                <div className="flex items-center">
                  <span
                    className="h-2 w-2 rounded-full mr-2"
                    style={{
                      backgroundColor:
                        TAG_COLORS[tagOption.name.toLowerCase()] || "#d9d9d9",
                    }}
                  />
                  {tagOption.name}
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "N/A"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "N/A"),
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center">
          <Dropdown
            overlay={<Menu items={getDropdownItems(elm)} />}
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

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      const project = list.find((p) => p.id === projectId);
      if (!project) return;

      const originalProject = properdata.find((p) => p.id === projectId);
      if (!originalProject) return;

      let members = [];
      try {
        if (typeof originalProject.project_members === "string") {
          const parsed = JSON.parse(originalProject.project_members);
          members = parsed.project_members || [];
        } else if (
          originalProject.project_members &&
          originalProject.project_members.project_members
        ) {
          members = originalProject.project_members.project_members;
        } else if (Array.isArray(originalProject.project_members)) {
          members = originalProject.project_members;
        }
      } catch (error) {
        console.error("Error parsing project members:", error);
        members = [];
      }

      // Create updated project data with all original fields
      const updatedProject = {
        ...originalProject,
        status: newStatus,
        project_members: {
          project_members: members,
        },
      };

      await dispatch(Editpro({ id: projectId, values: updatedProject }));
      message.success("Status updated successfully");
      dispatch(GetProject());
    } catch (error) {
      message.error("Failed to update status");
      console.error("Status update error:", error);
    }
  };

  const handleTagChange = async (projectId, newTag) => {
    try {
      const project = list.find((p) => p.id === projectId);
      if (!project) return;

      const originalProject = properdata.find((p) => p.id === projectId);
      if (!originalProject) return;

      let members = [];
      try {
        if (typeof originalProject.project_members === "string") {
          const parsed = JSON.parse(originalProject.project_members);
          members = parsed.project_members || [];
        } else if (
          originalProject.project_members &&
          originalProject.project_members.project_members
        ) {
          members = originalProject.project_members.project_members;
        } else if (Array.isArray(originalProject.project_members)) {
          members = originalProject.project_members;
        }
      } catch (error) {
        console.error("Error parsing project members:", error);
        members = [];
      }

      const updatedProject = {
        ...originalProject,
        tag: newTag,
        project_members: {
          project_members: members,
        },
      };

      await dispatch(Editpro({ id: projectId, values: updatedProject }));
      message.success("Tag updated successfully");
      dispatch(GetProject());
    } catch (error) {
      message.error("Failed to update tag");
      console.error("Tag update error:", error);
    }
  };

  const handleAddNewLable = async (
    lableType,
    newValue,
    setter,
    modalSetter
  ) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
      const lid = AllLoggedData.loggedInUser.id;
      const payload = {
        name: newValue.trim(),
        lableType,
      };

      const response = await dispatch(AddLable({ lid, payload }));

      if (response.payload && response.payload.success) {
        message.success(`${lableType} added successfully.`);

        const labelsResponse = await dispatch(GetLable(lid));
        if (labelsResponse.payload && labelsResponse.payload.data) {
          const filteredLables = labelsResponse.payload.data
            .filter((lable) => lable.lableType === lableType)
            .map((lable) => ({ id: lable.id, name: lable.name.trim() }));

          if (lableType === "tag") {
            setTags(filteredLables);
          } else if (lableType === "status") {
            setStatuses(filteredLables);
          }
        }

        setter("");
        modalSetter(false);
      } else {
        throw new Error("Failed to add label");
      }
    } catch (error) {
      console.error(`Failed to add ${lableType}:`, error);
      message.error(`Failed to add ${lableType}. Please try again.`);
    }
  };

  return (
    <div>
      <PageHeaderAlt className="border-bottom mt-5">
        <div className="container-fluid">
          <div className="flex justify-between items-center ">
            <h2 className="text-xl font-medium font-family-Roboto">Projects</h2>
            <Flex className="p-2 flex justify-end">
              <div className="flex gap-3 justify-end">
                <Radio.Group
                  defaultValue={VIEW_GRID}
                  onChange={onChangeProjectView}
                >
                  <Radio.Button value={VIEW_GRID}>
                    <AppstoreOutlined />
                  </Radio.Button>
                  <Radio.Button value={VIEW_LIST}>
                    <UnorderedListOutlined />
                  </Radio.Button>
                </Radio.Group>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openAddProjectModal}
                  className="flex items-center"
                >
                  New Project
                </Button>
              </div>
            </Flex>
          </div>
        </div>
      </PageHeaderAlt>

      <div className="my-4 container-fluid">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h3 className="text-lg font-semibold text-gray-600">
              No Data Available
            </h3>
            <p className="text-gray-500">
              Please check back later or add new projects.
            </p>
          </div>
        ) : view === VIEW_LIST ? (
          <Table
            columns={tableColumns}
            dataSource={list}
            rowKey="id"
            scroll={{ x: 1000 }}
          />
        ) : (
          <Row gutter={[24, 24]} className="project-list-container">
            {list.map((item) => {
              return (
                <Col xs={24} sm={12} lg={8} xxl={6} key={item.id}>
                  <Card
                    hoverable
                    className="project-card rounded-xl border-0"
                    style={{
                      background: "#ffffff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      width: "100%",
                      overflow: "hidden",
                    }}
                    bodyStyle={{ padding: 0 }}
                  >
                    {/* Blue Color Top Bar */}
                    <div
                      className="h-1.5"
                      style={{
                        backgroundColor: "#1890ff", // Fixed blue color
                      }}
                    />

                    <div className="p-4">
                      {/* Header with Three Dots */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4
                            onClick={() => handleProjectClick(item.id)}
                            className="text-lg font-semibold hover:text-blue-600 cursor-pointer mb-2"
                          >
                            {item.name}
                          </h4>
                          <p className="text-gray-500 text-sm">
                            {item.category}
                          </p>
                        </div>
                        <Dropdown
                          overlay={<Menu items={getDropdownItems(item)} />}
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

                      {/* Project Members Row */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">
                          Project Members
                        </p>
                        <UserAvatarGroup
                          users={item.memberDetails}
                          maxCount={3}
                        />
                      </div>

                      {/* Status and Tag Row */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <div className="flex items-center">
                            <span
                              className="h-2 w-2 rounded-full mr-2"
                              style={{
                                backgroundColor:
                                  STATUS_CONFIG[item.status]?.color ||
                                  "#d9d9d9",
                              }}
                            />
                            <span className="text-sm">
                              {item.status || "Not Started"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tag</p>
                          <div className="flex items-center">
                            <span
                              className="h-2 w-2 rounded-full mr-2"
                              style={{
                                backgroundColor:
                                  TAG_COLORS[item.tag?.toLowerCase()] ||
                                  "#d9d9d9",
                              }}
                            />
                            <span className="text-sm">
                              {item.tag || "No Tag"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center p-2.5 bg-gray-50 rounded-lg">
                          <DollarOutlined className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500 m-0">Budget</p>
                            <p className="text-sm font-semibold m-0">
                              {item.totalTask}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center p-2.5 bg-gray-50 rounded-lg">
                          <ClockCircleOutlined
                            className="mr-2"
                            style={{
                              color:
                                item.dayleft > 10
                                  ? "#52c41a"
                                  : item.dayleft > 5
                                  ? "#faad14"
                                  : "#f5222d",
                            }}
                          />
                          <div>
                            <p className="text-xs text-gray-500 m-0">
                              Days Left
                            </p>
                            <p className="text-sm font-semibold m-0">
                              {item.dayleft} days
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Date Range */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <CalendarOutlined className="text-blue-500" />
                        <span>
                          {moment(item.startDate).format("DD-MM-YYYY")} -{" "}
                          {moment(item.endDate).format("DD-MM-YYYY")}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>

      {/* Add Project Modal */}
      <Modal
        title="Add Project"
        visible={isAddProjectModalVisible}
        onCancel={closeAddProjectModal}
        footer={null}
        width={800}
        className="mt-[-70px]"
      >
        <AddProject onClose={closeAddProjectModal} />
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        title="Edit Project"
        visible={isEditProjectModalVisible}
        onCancel={closeEditProjectModal}
        footer={null}
        width={800}
        className="mt-[-70px]"
      >
        <EditProject onClose={closeEditProjectModal} id={idd} />
      </Modal>

      {/* Add New Tag Modal */}
      <Modal
        title="Add New Tag"
        open={isTagModalVisible}
        onCancel={() => setIsTagModalVisible(false)}
        onOk={() =>
          handleAddNewLable("tag", newTag, setNewTag, setIsTagModalVisible)
        }
        okText="Add Tag"
      >
        <Input
          placeholder="Enter new tag name"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
      </Modal>

      {/* Add New Status Modal */}
      <Modal
        title="Add New Status"
        open={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        onOk={() =>
          handleAddNewLable(
            "status",
            newStatus,
            setNewStatus,
            setIsStatusModalVisible
          )
        }
        okText="Add Status"
      >
        <Input
          placeholder="Enter new status name"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ProjectList;

<style jsx>{`
  .project-card {
    transition: all 0.3s ease;
  }

  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
  }

  .status-select .ant-select-selector,
  .tag-select .ant-select-selector {
    border-radius: 6px !important;
    border: 1px solid #e6e6e6 !important;
    transition: all 0.3s !important;
    padding: 4px 8px !important;
  }

  .status-select:hover .ant-select-selector,
  .tag-select:hover .ant-select-selector {
    border-color: #40a9ff !important;
  }

  .status-select .ant-select-selection-item,
  .tag-select .ant-select-selection-item {
    display: flex !important;
    align-items: center !important;
    padding: 0 !important;
  }

  .interactive-cell {
    position: relative;
    z-index: 2;
  }

  .ant-select-dropdown {
    z-index: 1001 !important;
  }

  .project-card .ant-card-body {
    padding: 0 !important;
  }
`}</style>;
