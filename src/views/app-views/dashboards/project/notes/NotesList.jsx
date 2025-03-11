import React, { useEffect } from "react";
import { useState } from "react";
import {
  Row,
  Card,
  Col,
  Button,
  Modal,
  Tag,
  Typography,
  Avatar,
  Input,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import dayjs from "dayjs";
import AddNotes from "./AddNotes";
import EditNotes from "./EditNotes";
import ViewNotes from "./ViewNotes";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DeleteNotes, GetNote } from "./NotesReducer/NotesSlice";
import { debounce } from 'lodash';
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
const { Text } = Typography;



export const NotesList = () => {
  const dispatch = useDispatch();
  const [idd, setIdd] = useState("");
  const [AddNotesModalVisible, setAddNotesModalVisible] = useState(false);
  const [EditNotesModalVisible, setEditNotesModalVisible] = useState(false);
  const [ViewNotesModalVisible, setViewNotesModalVisible] = useState(false);
  const [list, setList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Get user role and permissions from Redux store
  const { whorole, permissions } = useSelector((state) => state.auth?.user || {});
  const canCreateClient = permissions?.some(permission => permission.name === 'create-client');

  const { id } = useParams();

  const allempdata = useSelector((state) => state.Notes);
  const filtermin = allempdata.Notes.data;

  // Add employee data from Redux store
  const employeeData = useSelector((state) => state.employee?.employee?.data || []);

  useEffect(() => {
    dispatch(GetNote(id));
    dispatch(empdata()); // Fetch employee data
  }, [dispatch, id]);

  useEffect(() => {
    if (filtermin) {
      setList(filtermin);
    }
  }, [filtermin]);

  const DeleteFun = async (exid) => {
    try {
      const response = await dispatch(DeleteNotes(exid));
      // message.success("Note deleted successfully!");
      if (response.error) {
        throw new Error(response.error.message);
      }
      setList(list.filter((item) => item.id !== exid));

    } catch (error) {
      console.error("Error deleting note:", error.message || error);
    }
  };

  const editfun = (nid) => {
    openEditNotesModal();
    setIdd(nid);
  };

  // Open Add Job Modal
  const openAddNotesModal = () => {
    setAddNotesModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddNotesModal = () => {
    setAddNotesModalVisible(false);
  };

  // Open Add Job Modal
  const openEditNotesModal = () => {
    setEditNotesModalVisible(true);
  };


  // Close Add Job Modal
  const closeEditNotesModal = () => {
    setEditNotesModalVisible(false);
  };

  //Close View Notes Modal
  const closeViewNotesModal = () => {
    setViewNotesModalVisible(false);
  };


  // Create debounced search function
  const debouncedSearch = debounce((value, data) => {
    setIsSearching(true);

    if (!value) {
      setList(filtermin || []);
      setIsSearching(false);
      return;
    }

    const filtered = filtermin?.filter(note => {
      try {
        const employeeObj = JSON.parse(note.employees);
        const employee = employeeData?.find(emp => emp.id === employeeObj?.id);
        const username = employee?.username || '';

        return (
          note.note_title?.toString().toLowerCase().includes(value) ||
          note.notetype?.toString().toLowerCase().includes(value) ||
          username.toLowerCase().includes(value)
        );
      } catch (error) {
        return (
          note.note_title?.toString().toLowerCase().includes(value) ||
          note.notetype?.toString().toLowerCase().includes(value)
        );
      }
    }) || [];

    setList(filtered);
    setIsSearching(false);
  }, 300);

  // Modified onSearch function
  const onSearch = (e) => {
    const value = e.currentTarget.value.toLowerCase();
    setSearchValue(value);
    debouncedSearch(value, filtermin);
  };

  return (
    <div className="container">
      <div className="mb-4">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap gap-4"
        >
          <Flex
            className="flex flex-wrap gap-4 mb-4 md:mb-0"
            mobileFlex={false}
          >
            <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
              <Input
                placeholder="Search notes..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchValue}
                allowClear
                loading={isSearching}
              />
            </div>
          </Flex>
          <Flex gap="7px" className="flex">
            <div className="flex gap-4">
              <Button
                type="primary"
                className="flex items-center"
                onClick={openAddNotesModal}
              >
                <PlusOutlined />
                <span className="ml-2">Create Note</span>
              </Button>
            </div>
          </Flex>
        </Flex>
      </div>

      <Row gutter={[16, 16]}>
        {list.length === 0 ? (
          <Col span={24}>
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg  border border-gray-100">
              <h3 className="mt-4 text-lg font-medium text-gray-600">No Data Found</h3>

              {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) && (
                <Button
                  type="primary"
                  className="mt-4"
                  icon={<PlusOutlined />}
                  onClick={openAddNotesModal}
                >
                  Create New Note
                </Button>
              )}
            </div>
          </Col>
        ) : (
          list.map((note) => {
            let employeeName = 'N/A';
            try {
              const employeeObj = JSON.parse(note.employees);
              const employee = employeeData?.find(emp => emp.id === employeeObj?.id);
              employeeName = employee?.username || 'N/A';
            } catch (error) {
              console.error('Error parsing employee data:', error);
            }

            const creator = employeeData?.find(emp => emp.username === note.created_by);

            return (
              <Col xs={24} key={note.id}>
                <Card
                  className="ultra-card"
                  bordered={false}
                >
                  <div className="card-header">
                    <div className="creator-info">
                      <Avatar
                        size={50}
                        src={creator?.profile_pic}
                        icon={!creator?.profile_pic && <UserOutlined />}
                        className="creator-avatar"
                      />
                      <div className="creator-details">
                        <Text strong className="creator-name">{note.created_by}</Text>
                        <Text type="secondary" className="timestamp">
                          {dayjs(note.createdAt).format('DD MMM YYYY • HH:mm')}
                        </Text>
                      </div>
                    </div>
                    <div className="action-buttons">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => editfun(note.id)}
                      />
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => DeleteFun(note.id)}
                      />
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="title-section">
                      <Text strong className="note-title">{note.note_title}</Text>
                      <Tag color={note.notetype === 'public' ? 'blue' : 'gold'}>
                        {note.notetype}
                      </Tag>
                    </div>

                    <div className="assigned-section">
                      <Text type="secondary">Assigned to: </Text>
                      <Tag icon={<UserOutlined />} color="default">
                        {employeeName}
                      </Tag>
                    </div>

                    <div
                      className=""
                      dangerouslySetInnerHTML={{ __html: note.description }}
                    />

                    {note.updatedAt !== note.createdAt && (
                      <Text type="secondary" className="updated-at">
                        Last edited {dayjs(note.updatedAt).format('DD MMM YYYY • HH:mm')}
                      </Text>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })
        )}
      </Row>

      <Modal
        title="Add Project Notes"
        visible={AddNotesModalVisible}
        onCancel={closeAddNotesModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddNotes onClose={closeAddNotesModal} />
      </Modal>
      <Modal
        title="Edit Project Notes"
        visible={EditNotesModalVisible}
        onCancel={closeEditNotesModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditNotes onClose={closeEditNotesModal} idd={idd} />
      </Modal>
      <Modal
        title="Project Note Details"
        visible={ViewNotesModalVisible}
        onCancel={closeViewNotesModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <ViewNotes onClose={closeViewNotesModal} />
      </Modal>

      <style jsx>{`
        .ultra-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .ultra-card:hover {
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #f0f0f0;
        }

        .creator-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .creator-avatar {
          border: 2px solid #f0f0f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .creator-details {
          display: flex;
          flex-direction: column;
        }

        .creator-name {
          font-size: 15px;
          line-height: 1.2;
        }

        .timestamp {
          font-size: 12px;
          margin-top: 2px;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-buttons .ant-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
        }

        .card-content {
          padding: 20px 24px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .note-title {
          font-size: 18px;
          color: #1a1a1a;
        }

        // .assigned-section {
        //   margin-bottom: 16px;
        // }

        .description-section {
          // background: #f8fafc;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          font-size: 14px;
          line-height: 1.6;
          color: #4a5568;
        }

        .description-section p {
          margin-bottom: 0;
        }

        .updated-at {
          display: block;
          margin-top: 16px;
          font-size: 12px;
          color: #8c8c8c;
        }

        /* Custom scrollbar */
        .description-section {
          max-height: 300px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }

        .description-section::-webkit-scrollbar {
          width: 4px;
        }

        .description-section::-webkit-scrollbar-track {
          background: transparent;
        }

        .description-section::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 2px;
        }

        /* Hover states */
        .action-buttons .ant-btn:hover {
          background-color: #f5f5f5;
          color: #1890ff;
        }

        .action-buttons .ant-btn:last-child:hover {
          color: #ff4d4f;
        }
      `}</style>
    </div>
  );
};

export default NotesList;
