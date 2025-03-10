import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Row,
  Col,
  Tag,
  Input,
  message,
  Button,
  Modal,
  Tooltip,
  Avatar,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  CalendarOutlined,
  TagOutlined,
  ClockCircleOutlined,
  PushpinOutlined,
  ShareAltOutlined,
  BookOutlined,
  StarOutlined,
  BellOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import EditNotes from "../notes/EditNotes";
import userData from "assets/data/user-list.data.json";
import { useDispatch, useSelector } from "react-redux";
import { delnotess, getnotess } from "./notesReducer/notesSlice";

function ViewNotes() {
  const [users, setUsers] = useState([]);
  const [isEditNotesModalVisible, setIsEditNotesModalVisible] = useState(false);
  const [idd, setIdd] = useState("");

  const dispatch = useDispatch();
  const alllogeddata = useSelector((state) => state.user);
  const id = alllogeddata.loggedInUser.id;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getnotess(id));
  }, [dispatch, id]);

  const allnotedata = useSelector((state) => state.notes);
  const fnddata = allnotedata?.notes?.data || []; // Add fallback empty array

  useEffect(() => {
    if (fnddata) {
      setUsers(fnddata);
      setIsLoading(false);
    }
  }, [fnddata]);

  const openEditNotesModal = () => {
    setIsEditNotesModalVisible(true);
  };

  const closeEditNotesModal = () => {
    setIsEditNotesModalVisible(false);
  };

  const editfunc = (idd) => {
    openEditNotesModal();
    setIdd(idd);
  };

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center" onClick={() => editfunc(elm.id)}>
          <EditOutlined />
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center" onClick={() => deleteUser(elm.id)}>
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );
  const deleteUser = (userId) => {
    dispatch(delnotess(userId)).then(() => {
      dispatch(getnotess(id));
      setUsers(users.filter((item) => item.id !== userId));
    });
  };

  const renderNoteCard = (note) => {
    return (
      <Card 
        key={note.id} 
        className="notification-card relative"
        bordered={false}
        data-type={note.notetype}
        data-priority={note.priority}
      >
        <div className="absolute top-4 right-4 flex gap-2">
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => editfunc(note.id)}
            className="action-btn edit hover:bg-blue-50 hover:text-blue-600"
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />}
            onClick={() => deleteUser(note.id)}
            className="action-btn delete hover:bg-red-50 hover:text-red-600"
          />
        </div>

        <div className="relative">
          <div className="absolute top-0 right-0 mt-2 mr-2 flex items-center gap-2">
            {note.priority === "High" && (
              <Tooltip title="High Priority">
                <StarOutlined className="text-yellow-500 animate-pulse text-lg" />
              </Tooltip>
            )}
            {note.notetype === "Shared" && (
              <Tooltip title="Shared Note">
                <TeamOutlined className="text-blue-500 text-lg" />
              </Tooltip>
            )}
          </div>

          {/* Note Header */}
          <div className="flex items-start mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 mr-3">
              <FileTextOutlined className="text-xl text-blue-500" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-800 m-0 group-hover:text-blue-600">
                {note.note_title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <CalendarOutlined className="text-gray-400" />
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <ClockCircleOutlined className="text-gray-400" />
                  {new Date(note.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Note Content */}
          <div className="note-content pl-13 mb-4">
            <div 
              className="text-gray-600 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: note.description }}
            />
          </div>

          <Divider className="my-4" />

          {/* Author Info */}
          <div className="flex items-center justify-between pl-13">
            <div className="flex items-center gap-3">
              <Avatar 
                icon={<UserOutlined />} 
                className="bg-gradient-to-r from-blue-400 to-blue-600"
              />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  {note.created_by}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <InfoCircleOutlined className="text-blue-400" />
                  Author
                </div>
              </div>
            </div>
            {note.updated_by && (
              <Tooltip title="Last updated">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <EditOutlined />
                  {note.updated_by}
                </div>
              </Tooltip>
            )}
          </div>

          {/* Shared Users Section */}
          {note.notetype === "Shared" && note.employees && (
            <div className="mt-4 pl-13">
              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <TeamOutlined className="text-blue-400" />
                Shared with:
              </div>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(note.employees).employee.map((emp, index) => (
                  <Tag 
                    key={index}
                    icon={<UserOutlined />}
                    className="rounded-full px-3 py-1 bg-blue-50 text-blue-600 border-blue-100"
                  >
                    {emp}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-black">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => editfunc(note.id)}
              // className="action-btn edit"
               className="action-btn edit hover:bg-blue-50 hover:text-blue-600"
            />
            <Button 
              type="text" 
              icon={<DeleteOutlined />}
              onClick={() => deleteUser(note.id)}
              className="action-btn delete"
            />
          </div>
        </div>

        {/* Left Border Indicator */}
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-lg" />
      </Card>
    );
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Notes</h1>
          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading...</p>
            </div>
          ) : fnddata && fnddata.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {fnddata.map((note) => renderNoteCard(note))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No notes found</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Edit Notes"
        visible={isEditNotesModalVisible}
        onCancel={closeEditNotesModal}
        footer={null}
        width={800}
        divider={true}
        className="mt-[-70px]"
      >
        <EditNotes onClose={closeEditNotesModal} idd={idd} />
      </Modal>

      <style jsx>{`
        .notification-card {
          background: linear-gradient(
            135deg,
            #f8fafc 0%,
            #f1f5f9 100%
          );
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(229, 231, 235, 0.5);
        }

        .notification-card:hover {
          transform: translateY(-2px);
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #f8fafc 100%
          );
          box-shadow: 
            0 8px 16px -4px rgba(0, 0, 0, 0.1),
            0 4px 8px -4px rgba(0, 0, 0, 0.06);
        }

        /* Alternative card backgrounds based on note type */
        .notification-card[data-type="Shared"] {
          background: linear-gradient(
            135deg,
            #eff6ff 0%,
            #dbeafe 100%
          );
        }

        .notification-card[data-type="Shared"]:hover {
          background: linear-gradient(
            135deg,
            #f8faff 0%,
            #eff6ff 100%
          );
        }

        .notification-card[data-priority="High"] {
          background: linear-gradient(
            135deg,
            #fff7ed 0%,
            #ffedd5 100%
          );
        }

        .notification-card[data-priority="High"]:hover {
          background: linear-gradient(
            135deg,
            #fffbf7 0%,
            #fff7ed 100%
          );
        }

        .pl-13 {
          padding-left: 3.25rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
          background: white;
          border: 1px solid #e5e7eb;
        }

        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .action-btn.edit:hover {
          border-color: #2563eb;
        }

        .action-btn.delete:hover {
          border-color: #dc2626;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </>
  );
}

export default ViewNotes;

