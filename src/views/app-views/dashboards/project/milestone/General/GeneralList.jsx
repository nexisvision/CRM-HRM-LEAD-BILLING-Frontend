import React, { useState } from "react";
import FileList from "../File/FileList";
import SubTaskList from "../SubTask/SubTaskList";
import CommentList from "../Comment/CommentList";
import TimeSheetList from "../TimeSheet/TimeSheetList";
import NotesList from "../Notes/NotesList";

const GeneralList = () => {
  const [selectedSection, setSelectedSection] = useState("File");

  // Function to handle section selection
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  return (
    <div className="bg-white">
      {/* Sidebar */}
      <div className="mt-3 border-b">
        <ul className="flex">
          <li
            onClick={() => handleSectionClick("File")}
            className={`cursor-pointer p-3 flex justify-between rounded-t-lg ${
              selectedSection === "File" ? "border-b-rose-500 text-white bg-rose-500" : "border-0"
            }`}
          >
            File
          </li>
          <li
            onClick={() => handleSectionClick("SubTask")}
            className={`cursor-pointer p-3 flex justify-between rounded-t-lg ${
              selectedSection === "SubTask" ? "border-b-rose-500 text-white bg-rose-500" : "border-0"
            }`}
          >
            Sub Task
          </li>
          <li
            onClick={() => handleSectionClick("Comment")}
            className={`cursor-pointer p-3 flex justify-between rounded-t-lg ${
              selectedSection === "Comment" ? "border-b-rose-500 text-white bg-rose-500" : "border-0"
            }`}
          >
            Comment
          </li>
          <li
            onClick={() => handleSectionClick("Timesheet")}
            className={`cursor-pointer p-3 flex justify-between rounded-t-lg ${
              selectedSection === "Timesheet" ? "border-b-rose-500 text-white bg-rose-500" : "border-0"
            }`}
          >
            Timesheet
          </li>
          <li
            onClick={() => handleSectionClick("Notes")}
            className={`cursor-pointer p-3 flex justify-between rounded-t-lg ${
              selectedSection === "Notes" ? "border-b-rose-500 text-white bg-rose-500" : "border-0"
            }`}
          >
            Notes
          </li>
        </ul>
      </div>

      {/* Content Section */}
      <div className="flex-1 lg:ml-[-23px] p-4 overflow-y-auto mt-0 lg:mt-[10px]">
        {selectedSection === "File" && (
          <div className="m-2">
            <FileList />
          </div>
        )}
        {selectedSection === "SubTask" && (
          <div className="m-2">
            <SubTaskList />
          </div>
        )}
        {selectedSection === "Comment" && (
          <div className="m-2">
            <CommentList />
          </div>
        )}
        {/* Add components for other sections as needed */}
        {selectedSection === "Timesheet" && <div className="m-2"><TimeSheetList/></div>}
        {selectedSection === "Notes" && <div className="m-2"><NotesList/></div>}
      </div>
    </div>
  );
};

export default GeneralList;
