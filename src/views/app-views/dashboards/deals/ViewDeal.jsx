
import React, { useRef, useState } from "react";
import General from "./General";
import Task from "./Task";
import Users from "./Users";
import Products from "./Products";
import Sources from "./Sources";
import Emails from "./Emails";
import Files from "./Files";
import Discussion from "./Discussion";
import Calls from "./Calls";
import Activity from "./Activity";

const ViewDeal = () => {
  const [selectedSection, setSelectedSection] = useState("general");

  const generalRef = useRef(null);
  const taskRef = useRef(null);
  const usersRef = useRef(null);
  const productsRef = useRef(null);
  const sourcesRef = useRef(null);
  const emailsRef = useRef(null);
  const discussionRef = useRef(null);
  const filesRef = useRef(null);
  const callsRef = useRef(null);
  const activityRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth"});
    setSelectedSection(ref.current.id);
  };

  return (
    <>
        <h1 className="text-lg font-bold ml-3">Deal</h1>
    <div className="flex flex-col lg:flex-row ml-[-24px] mb-[-24px] rounded-b-lg mr-[-24px] mt-[-51px] rounded-t-lg bg-gray-100">
      
      <div className="sm:w-full md:w-[95%] md:mr-[30px] lg:w-[240px] md:ml-[23px] h-full mt-16 px-[30px] md:p-0 lg:p-0">
        <ul className="">
          <li
            onClick={() => scrollToSection(generalRef)}
            className={`cursor-pointer p-3 flex justify-between rounded-t-lg ${
              selectedSection === "general" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            General
          </li>
          <li
            onClick={() => scrollToSection(taskRef)}
            className={`cursor-pointer p-3 flex justify-between ${
              selectedSection === "task" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Task
          </li>
          <li
            onClick={() => scrollToSection(usersRef)}
            className={`cursor-pointer p-3 flex justify-between  ${
              selectedSection === "users" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Users
          </li>
          <li
            onClick={() => scrollToSection(productsRef)}
            className={`cursor-pointer p-3 flex justify-between  ${
              selectedSection === "products" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Products
          </li>
          <li
            onClick={() => scrollToSection(sourcesRef)}
            className={`cursor-pointer p-3 flex justify-between ${
              selectedSection === "sources" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Sources
          </li>
          <li
            onClick={() => scrollToSection(emailsRef)}
            className={`cursor-pointer p-3 flex justify-between ${
              selectedSection === "emails" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Emails
          </li>
          <li
            onClick={() => scrollToSection(discussionRef)}
            className={`cursor-pointer p-3 flex justify-between ${
              selectedSection === "discussion" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Discussion
          </li>
          <li
            onClick={() => scrollToSection(filesRef)}
            className={`cursor-pointer p-3 flex justify-between  ${
              selectedSection === "files" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Files
          </li>
          <li
            onClick={() => scrollToSection(callsRef)}
            className={`cursor-pointer p-3 flex justify-between ${
              selectedSection === "calls" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Calls
          </li>
          <li
            onClick={() => scrollToSection(activityRef)}
            className={`cursor-pointer p-3 flex justify-between rounded-b-lg ${
              selectedSection === "activity" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Activity
          </li>
        </ul>
      </div>
      {/* </Card> */}

      {/* Content Section */}
      <div className="flex-1 lg:ml-[-23px] p-4 overflow-y-[1000px] mt-[30px]">
        <div id="general" ref={generalRef} className="m-2 rounded-lg">
          <General />
        </div>
        <div id="task" ref={taskRef} className="m-2 rounded-lg">
          <Task />
        </div>
        <div id="users" ref={usersRef} className="m-2 rounded-lg">
          <Users />
        </div>
        <div id="products" ref={productsRef} className="m-2 rounded-lg">
          <Products />
        </div>
        <div id="sources" ref={sourcesRef} className="m-2 rounded-lg">
          <Sources />
        </div>
        <div id="emails" ref={emailsRef} className="m-2 rounded-lg">
          <Emails />
        </div>
        <div id="discussion" ref={discussionRef} className="m-2 rounded-lg">
          <Discussion />
        </div>
        <div id="files" ref={filesRef} className="m-2 rounded-lg mt-2">
          <Files />
        </div>
        <div id="calls" ref={callsRef} className="m-2 rounded-lg mt-2">
          <Calls />
        </div>
        <div id="activity" ref={activityRef} className="m-2 rounded-lg mt-2">
          <Activity />
        </div>
      </div>
    </div>
    </>
  );
};

export default ViewDeal;