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
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import EditNotes from "../notes/EditNotes";
import userData from "assets/data/user-list.data.json";
import { useDispatch, useSelector } from "react-redux";
import { delnotess, getnotess } from "./notesReducer/notesSlice";

function ViewNotes() {
  const [users, setUsers] = useState(userData);
  const [isEditNotesModalVisible, setIsEditNotesModalVisible] = useState(false);
  const [idd, setIdd] = useState("");

  const dispatch = useDispatch();

  const alllogeddata = useSelector((state) => state.user);
  const id = alllogeddata.loggedInUser.id;

  useEffect(() => {
    dispatch(getnotess(id));
  }, []);

  const allnotedata = useSelector((state) => state.notes);
  const fnddata = allnotedata.notes.data;

  useEffect(() => {
    if (fnddata) {
      setUsers(fnddata);
    }
  }, [fnddata]);

  // Open Add Job Modal
  const openEditNotesModal = () => {
    setIsEditNotesModalVisible(true);
  };

  // Close Add Job Modal
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
  // Delete user
  const deleteUser = (userId) => {
    dispatch(delnotess(userId)).then(() => {
      dispatch(getnotess(id));
      setUsers(users.filter((item) => item.id !== userId));
      message.success({ content: `Deleted user ${userId}`, duration: 2 });
    });
  };

  const renderNoteCard = (note) => {
    const employeesList = note.employees
      ? JSON.parse(note.employees).employee
      : [];

    return (
      <Card className="mt-2 w-full" key={note.id}>
        <div>
          <div className="flex justify-between border-b pb-2">
            <h1 className="text-lg font-medium">{note.note_title}</h1>
            <div className="text-center">
              <EllipsisDropdown menu={dropdownMenu(note)} />
            </div>
          </div>
          <div className="overflow-y-auto h-[150px] mt-2 p-2 lg:p-0">
            <div
              className="text-base"
              dangerouslySetInnerHTML={{ __html: note.description }}
            />
            {note.notetype === "Shared" && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Shared with: {employeesList.join(", ")}
                </p>
              </div>
            )}
            <div className="mt-2 text-sm text-gray-500">
              <p>Created by: {note.created_by}</p>
              <p>Created at: {new Date(note.createdAt).toLocaleDateString()}</p>
              {note.updated_by && <p>Last updated by: {note.updated_by}</p>}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        <div className="mt-2">
          <h1 className="text-2xl font-semibold ms-1">Notifications</h1>
          {fnddata && fnddata.some((note) => note.notetype === "Personal") ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {fnddata
                .filter((note) => note.notetype === "Personal")
                .map((note) => renderNoteCard(note))}
            </div>
          ) : (
            <p className="text-gray-500 ms-1 mt-2 text-center">No notes found</p>
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
    </>
  );
}

export default ViewNotes;
