
import React, { useRef, useState } from "react";
import General from "./General";
import { Card } from "antd";
import Notes from "./Notes";
import Comment from "./Comment";
import Attachment from "./Attachment";
import { RightOutlined} from '@ant-design/icons';

const ViewContract = () => {
  const [selectedSection, setSelectedSection] = useState("general");

  const generalRef = useRef(null);
  const attachmentRef = useRef(null);
  const commentRef = useRef(null);
  const notesRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth"});
    setSelectedSection(ref.current.id);
  };

  return (
    <>
    <h1 className="text-lg font-bold ml-3">Contract</h1>
    <div className="flex flex-col lg:flex-row ml-[-24px] rounded-t-lg mb-[-24px] mt-[-81px] rounded-b-lg mr-[-24px] bg-gray-100">


      {/* Sidebar */}
      {/* <Card className=" lg:w-[240px] lg:h-full ml-[20px] mr-[20px] lg:mr-0 mt-[10px] top-[10px] lg:sticky p-[-20px]"> */}
      <div className="sm:w-full md:w-[95%] md:mr-[30px] lg:w-[240px] md:ml-[23px] h-full mt-20 px-[30px] md:p-0 lg:p-0">
        
        <ul className="">
          <li
            onClick={() => scrollToSection(generalRef)}
            className={`cursor-pointer p-3 flex justify-between rounded-t-lg ${
              selectedSection === "general" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            <div>
                General
            </div>
           
            <div>
                <RightOutlined />
            </div>
          </li>
           <li
            onClick={() => scrollToSection(attachmentRef)}
            className={`cursor-pointer p-3 flex justify-between ${
              selectedSection === "attachment" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            <div>
                Attachment
            </div>
            <div>
                <RightOutlined />
            </div>
           
          </li>
          <li
            onClick={() => scrollToSection(commentRef)}
            className={`cursor-pointer p-3 flex justify-between  ${
              selectedSection === "comment" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            <div>
                Comment
            </div>
            <div>
                <RightOutlined />
            </div>
          </li>
          <li
            onClick={() => scrollToSection(notesRef)}
            className={`cursor-pointer p-3 flex justify-between rounded-b-lg ${
              selectedSection === "notes" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            <div>
            Notes
            </div>
            
            <div>
                <RightOutlined />
            </div>
          </li>
         
        </ul>
      </div>
      {/* </Card> */}

      {/* Content Section */}
      <div className="flex-1 lg:ml-[-23px] p-4 overflow-y-[1000px] mt-[40px]">
     
        <div id="general" ref={generalRef} className="m-2 rounded-lg">
          <General/>
        </div>
         <div id="attachment" ref={attachmentRef} className="m-2 rounded-lg">
          <Attachment />
        </div>
        <div id="comment" ref={commentRef} className="m-2 rounded-lg">
          <Comment />
        </div>
        <div id="notes" ref={notesRef} className="m-2 rounded-lg">
          <Notes />
        </div>
      
      </div>
    </div>
    </>
  );
};

export default ViewContract;

