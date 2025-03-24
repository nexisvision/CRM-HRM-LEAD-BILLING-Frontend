import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Modal,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import AddNotes from "../notes/AddNotes";
import EditNotes from "../notes/EditNotes";
import ViewNotes from "./ViewNotes";
import { useDispatch, useSelector } from "react-redux";
import { getnotess } from "./notesReducer/notesSlice";

const NotesList = () => {
  const [isAddNotesModalVisible, setIsAddNotesModalVisible] = useState(false);
  const [isEditNotesModalVisible, setIsEditNotesModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  const dispatch = useDispatch();

  const alllogeddata = useSelector((state) => state.user);
  const id = alllogeddata.loggedInUser.id;

  useEffect(() => {
    dispatch(getnotess(id));
  }, [dispatch, id]);

  const allnotedata = useSelector((state) => state.notes);
  const notes = allnotedata.notes?.data || [];

  // Update filtered notes whenever notes or search text changes
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note => 
        note.note_title?.toLowerCase().includes(searchText.toLowerCase().trim())
      );
      setFilteredNotes(filtered);
    }
  }, [notes, searchText]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const openAddNotesModal = () => {
    setIsAddNotesModalVisible(true);
  };

  const closeAddNotesModal = () => {
    setIsAddNotesModalVisible(false);
  };

  // Close Add Job Modal
  const closeEditNotesModal = () => {
    setIsEditNotesModalVisible(false);
  };

  return (
    <>
      <Card>
        <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Search notes by title..."
                prefix={<SearchOutlined />}
                onChange={handleSearch}
                value={searchText}
                allowClear
                className="search-input"
                style={{ minWidth: 200 }}
              />
            </div>
          </Flex>
          <Flex gap="7px" className="flex">
            <Button 
              type="primary" 
              className="ml-2" 
              onClick={openAddNotesModal}
              icon={<PlusOutlined />}
            >
              New Note
            </Button>
          </Flex>
        </Flex>

        {/* Notes List */}
        {filteredNotes.length > 0 ? (
          <ViewNotes
            data={filteredNotes}
            pagination={{
              total: filteredNotes.length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} notes`
            }}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {searchText ? 'No notes found matching your search' : 'No notes available'}
            </p>
          </div>
        )}

        {/* Add Note Modal */}
        <Modal
          title="Add Note"
          visible={isAddNotesModalVisible}
          onCancel={closeAddNotesModal}
          footer={null}
          width={800}
          destroyOnClose
          className="mt-[-70px]"
        >
          <AddNotes onClose={closeAddNotesModal} />
        </Modal>
        {/* <Modal
          title="Edit Notes"
          visible={isEditNotesModalVisible}
          onCancel={closeEditNotesModal}
          footer={null}
          width={1000}
          divider={true}
          className="mt-[-70px]"
        >
          <EditNotes onClose={closeEditNotesModal} />
        </Modal> */}
      </Card>

      <style jsx>{`
        .search-input {
          transition: all 0.3s;
        }

        .search-input:hover,
        .search-input:focus {
          border-color: #40a9ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        @media (max-width: 768px) {
          .search-input {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default NotesList;
