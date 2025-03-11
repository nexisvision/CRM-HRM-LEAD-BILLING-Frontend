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
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState('');

  const dispatch = useDispatch();

  const alllogeddata = useSelector((state) => state.user);
  const id = alllogeddata.loggedInUser.id;

  useEffect(() => {
    dispatch(getnotess(id));
  }, [dispatch, id]);

  const allnotedata = useSelector((state) => state.notes);
  const fnddata = allnotedata.notes?.data;

  console.log("fnddata", fnddata);

  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);

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

  // Add the search handler function
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    // If search value is empty, show all data
    if (!value) {
      setList(fnddata);
      return;
    }

    // Filter the data based on note title
    const filtered = fnddata.filter(note =>
      note.note_title?.toLowerCase().includes(value)
    );

    setList(filtered);
  };

  // Add filter function
  const getFilteredNotes = () => {
    if (!list) return [];

    let filtered = list;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(note =>
        note.note_title?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  };

  return (
    <>
      <Card>
        <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Search by note title..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                allowClear
                className="search-input"
              />
            </div>
          </Flex>
          <Flex gap="7px" className="flex">
            <Button type="primary" className="ml-2" onClick={openAddNotesModal}>
              <PlusOutlined />
              <span>New</span>
            </Button>
          </Flex>
        </Flex>

        <ViewNotes
          data={getFilteredNotes()}
          pagination={{
            total: getFilteredNotes().length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
        />
        <Modal
          title="Add Notes"
          visible={isAddNotesModalVisible}
          onCancel={closeAddNotesModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <AddNotes onClose={closeAddNotesModal} />
        </Modal>
        <Modal
          title="Edit Notes"
          visible={isEditNotesModalVisible}
          onCancel={closeEditNotesModal}
          footer={null}
          width={1000}
          divider={true}
          className="mt-[-70px]"
        >
          <EditNotes onClose={closeEditNotesModal} />
        </Modal>
      </Card>
    </>
  );
};

// Add styles
const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 200px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  @media (max-width: 768px) {
    .search-input {
      width: 100%;
      margin-bottom: 1rem;
    }
  }
`;

const NotesListWithStyles = () => (
  <>
    <style>{styles}</style>
    <NotesList />
  </>
);

export default NotesListWithStyles;
