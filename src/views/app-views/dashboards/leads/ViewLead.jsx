
import React, { useRef, useState } from "react";
import General from "../leads/General";
import Task from "../deals/Task";
import Users from "../leads/Users";
import Products from "../leads/Products";
import Sources from "../leads/Sources";
import Emails from "../leads/Emails";
import Files from "../leads/Files";
import Discussion from "../leads/Discussion";
import Calls from "../leads/Calls";
import Activity from "../leads/Activity";
import { Card } from "antd";

const ViewLead = () => {
  const [selectedSection, setSelectedSection] = useState("general");

  // Refs for scrolling to specific sections
  const generalRef = useRef(null);
  // const taskRef = useRef(null);
  const usersRef = useRef(null);
  const productsRef = useRef(null);
  const sourcesRef = useRef(null);
  const emailsRef = useRef(null);
  const discussionRef = useRef(null);
  const filesRef = useRef(null);
  const callsRef = useRef(null);
  const activityRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setSelectedSection(ref.current.id);
  };

  return (
    <>
  
    <div className="flex flex-col lg:flex-row ml-[-24px] mb-[-24px] rounded-b-lg mt-[-51px] rounded-t-lg mr-[-24px] bg-gray-100">
      {/* <hr style={{ marginTop:"20px",border: '10px solid #e8e8e8' }} /> */}
      {/* Sidebar */}
      {/* <Card
        className="md:w-1/4 sm:w-full h-auto md:h-full fixed md:relative bg-white shadow-md"
        style={{ minWidth: "300px" }}
      > */}
        <div className="sm:w-full md:w-[95%] md:mr-[30px] lg:w-[240px] md:ml-[23px] h-full mt-16">
          <ul className="">
            <li
              onClick={() => scrollToSection(generalRef)}
              className={`cursor-pointer p-3 flex justify-between rounded-t-lg ${
                selectedSection === "general" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              General
            </li>
            {/* <li
              onClick={() => scrollToSection(taskRef)}
              className={`cursor-pointer p-2 rounded ${
                selectedSection === "task" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              Task
            </li> */}
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
              className={`cursor-pointer p-3 flex justify-between  ${
                selectedSection === "sources" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              Sources
            </li>
            <li
              onClick={() => scrollToSection(emailsRef)}
              className={`cursor-pointer p-3 flex justify-between  ${
                selectedSection === "emails" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              Emails
            </li>
            <li
              onClick={() => scrollToSection(discussionRef)}
              className={`cursor-pointer p-3 flex justify-between  ${
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
        {/* <div id="task" ref={taskRef} className="bg-white p-4 rounded-lg my-2 shadow-md">
          <Task />
        </div> */}
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
        <div id="files" ref={filesRef} className="m-2 rounded-lg">
          <Files />
        </div>
        <div id="calls" ref={callsRef} className="m-2 rounded-lg">
          <Calls />
        </div>
        <div id="activity" ref={activityRef} className="m-2 rounded-lg">
          <Activity />
        </div>
      </div>
    </div>
    </>
  );
};

export default ViewLead;












// import React, { useRef, useState } from "react";
// import General from "./General";
// import Task from "../deals/Task";
// import Users from "./Users";
// import Products from "./Products";
// import Sources from "./Sources";
// import Emails from "./Emails";
// import Files from "./Files";
// import Discussion from "./Discussion";
// import Calls from "./Calls";
// import Activity from "./Activity";
// import { Card } from "antd";

// const ViewLead = () => {
//   const [selectedSection, setSelectedSection] = useState("general");

//   // Refs for scrolling to specific sections
//   const generalRef = useRef(null);
//   // const taskRef = useRef(null);
//   const usersRef = useRef(null);
//   const productsRef = useRef(null);
//   const sourcesRef = useRef(null);
//   const emailsRef = useRef(null);
//   const discussionRef = useRef(null);
//   const filesRef = useRef(null);
//   const callsRef = useRef(null);
//   const activityRef = useRef(null);

//   const scrollToSection = (ref) => {
//     ref.current?.scrollIntoView({ behavior: "smooth" });
//     setSelectedSection(ref.current.id);
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen bg-gray-100 ml-[-23px] mr-[-23px] p-3">
//       {/* Sidebar */}
//       <Card
//         className="md:w-1/4 sm:w-full h-auto md:h-full fixed md:relative bg-white shadow-md"
//         style={{ minWidth: "300px" }}
//       >
//         <div className="p-4">
//           <ul className="space-y-2">
//             <li
//               onClick={() => scrollToSection(generalRef)}
//               className={`cursor-pointer p-2 rounded ${
//                 selectedSection === "general" ? "bg-blue-500 text-white" : "bg-white"
//               }`}
//             >
//               General
//             </li>
//             {/* <li
//               onClick={() => scrollToSection(taskRef)}
//               className={`cursor-pointer p-2 rounded ${
//                 selectedSection === "task" ? "bg-blue-500 text-white" : "bg-white"
//               }`}
//             >
//               Task
//             </li> */}
//             <li
//               onClick={() => scrollToSection(usersRef)}
//               className={`cursor-pointer p-2 rounded ${
//                 selectedSection === "users" ? "bg-blue-500 text-white" : "bg-white"
//               }`}
//             >
//               Users
//             </li>
//             <li
//               onClick={() => scrollToSection(productsRef)}
//               className={`cursor-pointer p-2 rounded ${
//                 selectedSection === "products" ? "bg-blue-500 text-white" : "bg-white"
//               }`}
//             >
//               Products
//             </li>
//             <li
//               onClick={() => scrollToSection(sourcesRef)}
//               className={`cursor-pointer p-2 rounded ${
//                 selectedSection === "sources" ? "bg-blue-500 text-white" : "bg-white"
//               }`}
//             >
//               Sources
//             </li>
//             <li
//               onClick={() => scrollToSection(emailsRef)}
//               className={`cursor-pointer p-2 rounded ${
//                 selectedSection === "emails" ? "bg-blue-500 text-white" : "bg-white"
//               }`}
//             >
//               Emails
//             </li>
//             <li
//               onClick={() => scrollToSection(discussionRef)}
//               className={`cursor-pointer p-2 rounded ${
//                 selectedSection === "discussion" ? "bg-blue-500 text-white" : "bg-white"
//               }`}
//             >
//               Discussion
//             </li>
//             <li
//               onClick={() => scrollToSection(filesRef)}
//               className={`cursor-pointer p-2 rounded ${
//                 selectedSection === "files" ? "bg-blue-500 text-white" : "bg-white"
//               }`}
//             >
//               Files
//             </li>
//             <li
//               onClick={() => scrollToSection(callsRef)}
//               className={`cursor-pointer p-2 rounded ${
//                 selectedSection === "calls" ? "bg-blue-500 text-white" : "bg-white"
//               }`}
//             >
//               Calls
//             </li>
//             <li
//               onClick={() => scrollToSection(activityRef)}
//               className={`cursor-pointer p-2 rounded ${
//                 selectedSection === "activity" ? "bg-blue-500 text-white" : "bg-white"
//               }`}
//             >
//               Activity
//             </li>
//           </ul>
//         </div>
//       </Card>

//       {/* Content Section */}
//       <div className="flex-1 overflow-y-auto p-4 md:ml-1/4">
//         <div id="general" ref={generalRef} className="m-2 rounded-lg">
//           <General />
//         </div>
//         {/* <div id="task" ref={taskRef} className="bg-white p-4 rounded-lg my-2 shadow-md">
//           <Task />
//         </div> */}
//         <div id="users" ref={usersRef} className="m-2 rounded-lg">
//           <Users />
//         </div>
//         <div id="products" ref={productsRef} className="m-2 rounded-lg">
//           <Products />
//         </div>
//         <div id="sources" ref={sourcesRef} className="m-2 rounded-lg">
//           <Sources />
//         </div>
//         <div id="emails" ref={emailsRef} className="m-2 rounded-lg">
//           <Emails />
//         </div>
//         <div id="discussion" ref={discussionRef} className="m-2 rounded-lg">
//           <Discussion />
//         </div>
//         <div id="files" ref={filesRef} className="m-2 rounded-lg">
//           <Files />
//         </div>
//         <div id="calls" ref={callsRef} className="m-2 rounded-lg">
//           <Calls />
//         </div>
//         <div id="activity" ref={activityRef} className="m-2 rounded-lg">
//           <Activity />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewLead;










// // import React, { useRef, useState } from "react";
// // import General from "../deals/General";
// // import Task from "../deals/Task";
// // import Users from "../deals/Users";
// // import Products from "../deals/Products";
// // import Sources from "../deals/Sources";
// // import Emails from "../deals/Emails";
// // import Files from "../deals/Files";
// // import Discussion from "../deals/Discussion";
// // import Calls from "../deals/Calls";
// // import Activity from "../deals/Activity";
// // import { Card } from "antd";

// // const ViewLead = () => {
// //   const [selectedSection, setSelectedSection] = useState("general");

// //   // Refs for scrolling to specific sections
// //   const generalRef = useRef(null);
// //   const taskRef = useRef(null);
// //   const usersRef = useRef(null);
// //   const productsRef = useRef(null);
// //   const sourcesRef = useRef(null);
// //   const emailsRef = useRef(null);
// //   const discussionRef = useRef(null);
// //   const filesRef = useRef(null);
// //   const callsRef = useRef(null);
// //   const activityRef = useRef(null);

// //   const scrollToSection = (ref) => {
// //     ref.current?.scrollIntoView({ behavior: "smooth"});
// //     setSelectedSection(ref.current.id);
// //   };

// //   return (
// //     <div className="flex h-screen bg-gray-100">
// //       {/* Sidebar */}
// //       <Card className="w-[500px] h-[650px] ml-[20px] mt-[10px]">
// //       <div className="w-[300px] mt-[10px] p-2 fixed h-full">
// //         <ul className="space-y-2">
// //           <li
// //             onClick={() => scrollToSection(generalRef)}
// //             className={`cursor-pointer p-2 rounded ${
// //               selectedSection === "general" ? "bg-blue-500 text-white" : "bg-white"
// //             }`}
// //           >
// //             General
// //           </li>
// //           <li
// //             onClick={() => scrollToSection(taskRef)}
// //             className={`cursor-pointer p-2 rounded ${
// //               selectedSection === "task" ? "bg-blue-500 text-white" : "bg-white"
// //             }`}
// //           >
// //             Task
// //           </li>
// //           <li
// //             onClick={() => scrollToSection(usersRef)}
// //             className={`cursor-pointer p-2 rounded ${
// //               selectedSection === "users" ? "bg-blue-500 text-white" : "bg-white"
// //             }`}
// //           >
// //             Users
// //           </li>
// //           <li
// //             onClick={() => scrollToSection(productsRef)}
// //             className={`cursor-pointer p-2 rounded ${
// //               selectedSection === "products" ? "bg-blue-500 text-white" : "bg-white"
// //             }`}
// //           >
// //             Products
// //           </li>
// //           <li
// //             onClick={() => scrollToSection(sourcesRef)}
// //             className={`cursor-pointer p-2 rounded ${
// //               selectedSection === "sources" ? "bg-blue-500 text-white" : "bg-white"
// //             }`}
// //           >
// //             Sources
// //           </li>
// //           <li
// //             onClick={() => scrollToSection(emailsRef)}
// //             className={`cursor-pointer p-2 rounded ${
// //               selectedSection === "emails" ? "bg-blue-500 text-white" : "bg-white"
// //             }`}
// //           >
// //             Emails
// //           </li>
// //           <li
// //             onClick={() => scrollToSection(discussionRef)}
// //             className={`cursor-pointer p-2 rounded ${
// //               selectedSection === "discussion" ? "bg-blue-500 text-white" : "bg-white"
// //             }`}
// //           >
// //             Discussion
// //           </li>
// //           <li
// //             onClick={() => scrollToSection(filesRef)}
// //             className={`cursor-pointer p-2 rounded ${
// //               selectedSection === "files" ? "bg-blue-500 text-white" : "bg-white"
// //             }`}
// //           >
// //             Files
// //           </li>
// //           <li
// //             onClick={() => scrollToSection(callsRef)}
// //             className={`cursor-pointer p-2 rounded ${
// //               selectedSection === "calls" ? "bg-blue-500 text-white" : "bg-white"
// //             }`}
// //           >
// //             Calls
// //           </li>
// //           <li
// //             onClick={() => scrollToSection(activityRef)}
// //             className={`cursor-pointer p-2 rounded ${
// //               selectedSection === "activity" ? "bg-blue-500 text-white" : "bg-white"
// //             }`}
// //           >
// //             Activity
// //           </li>
// //         </ul>
// //       </div>
// //       </Card>

// //       {/* Content Section */}
// //       <div className="ml-[] w-[1800px] p-4 overflow-y-auto">
// //         <div id="general" ref={generalRef} className="m-2 rounded-lg">
// //           <General />
// //         </div>
// //         <div id="task" ref={taskRef} className="m-2 rounded-lg">
// //           <Task />
// //         </div>
// //         <div id="users" ref={usersRef} className="m-2 rounded-lg">
// //           <Users />
// //         </div>
// //         <div id="products" ref={productsRef} className="m-2 rounded-lg">
// //           <Products />
// //         </div>
// //         <div id="sources" ref={sourcesRef} className="m-2 rounded-lg">
// //           <Sources />
// //         </div>
// //         <div id="emails" ref={emailsRef} className="m-2 rounded-lg">
// //           <Emails />
// //         </div>
// //         <div id="discussion" ref={discussionRef} className="m-2 rounded-lg">
// //           <Discussion />
// //         </div>
// //         <div id="files" ref={filesRef} className="m-2 rounded-lg mt-2">
// //           <Files />
// //         </div>
// //         <div id="calls" ref={callsRef} className="m-2 rounded-lg mt-2">
// //           <Calls />
// //         </div>
// //         <div id="activity" ref={activityRef} className="m-2 rounded-lg mt-2">
// //           <Activity />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ViewLead;

