
// import React, { useState, useEffect } from "react";
// import { Card, Row, Col, Button } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import {
//   DndContext,
//   useDroppable,
//   useDraggable,
//   closestCenter,
//   PointerSensor,
//   KeyboardSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";

// const DraggableItem = ({ task, id }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useDraggable({
//       id,
//     });

//   const style = {
//     transform: transform
//       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//       : undefined,
//     transition,
//     marginBottom: "8px",
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <Card>
//         <h4>{task.title}</h4>
//         <p>Date: {task.date}</p>
//         <p>Comments: {task.comments}</p>
//       </Card>
//     </div>
//   );
// };

// const DroppableColumn = ({ status, tasks }) => {
//   const { setNodeRef } = useDroppable({
//     id: status,
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       style={{
//         minHeight: "100px",
//         backgroundColor: "#f9f9f9",
//         padding: "8px",
//         borderRadius: "8px",
//       }}
//     >
//       <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
//         {tasks.map((task) => (
//           <DraggableItem key={task.id} task={task} id={task.id} />
//         ))}
//       </SortableContext>
//       <Button className="mt-2 w-full">
//         Add task
//         <PlusOutlined />
//       </Button>
//     </div>
//   );
// };

// const LeadCards = () => {
//   const [leadData, setLeadData] = useState([]);

//   useEffect(() => {
//     setLeadData([
//       {
//         status: "Draft",
//         tasks: [
//           { id: 1, title: "Marketing Manager", date: "11 July", comments: 2 },
//         ],
//       },
//       {
//         status: "To be processed",
//         tasks: [
//           {
//             id: 2,
//             title: "Table data incorrect",
//             date: "11 July",
//             comments: 2,
//             status: "To be processed",
//           },
//           {
//             id: 3,
//             title: "Fix broken UI",
//             date: "05 August",
//             comments: 1,
//             status: "To be processed",
//           },
//           {
//             id: 4,
//             title: "Digital Marketing Specialist",
//             date: "05 August",
//             comments: 1,
//           },
//         ],
//       },
//       {
//         status: "Open",
//         tasks: [
         
//         ],
//       },
//     ]);
//   }, []);

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor)
//   );

//   const handleDragEnd = ({ active, over }) => {
//     if (!over) return;

//     const activeId = active.id;
//     const overId = over.id;

//     if (activeId === overId) return;

//     let sourceGroupIndex = -1;
//     let destinationGroupIndex = -1;
//     let sourceTaskIndex = -1;
//     let destinationTaskIndex = -1;

//     // Find source and destination group and task indices
//     leadData.forEach((group, groupIndex) => {
//       const taskIndex = group.tasks.findIndex((task) => task.id === activeId);
//       if (taskIndex !== -1) {
//         sourceGroupIndex = groupIndex;
//         sourceTaskIndex = taskIndex;
//       }
//       if (group.status === overId || group.tasks.some((task) => task.id === overId)) {
//         destinationGroupIndex = groupIndex;
//         destinationTaskIndex = group.tasks.findIndex((task) => task.id === overId);
//       }
//     });

//     const updatedLeadData = [...leadData];

//     if (sourceGroupIndex === destinationGroupIndex) {
//       // Rearrange tasks within the same group
//       updatedLeadData[sourceGroupIndex].tasks = arrayMove(
//         updatedLeadData[sourceGroupIndex].tasks,
//         sourceTaskIndex,
//         destinationTaskIndex
//       );
//     } else {
//       // Move task to a different group
//       const [movedTask] = updatedLeadData[sourceGroupIndex].tasks.splice(
//         sourceTaskIndex,
//         1
//       );

//       // Insert into the destination group
//       updatedLeadData[destinationGroupIndex].tasks.splice(
//         destinationTaskIndex === -1
//           ? updatedLeadData[destinationGroupIndex].tasks.length
//           : destinationTaskIndex,
//         0,
//         movedTask
//       );
//     }

//     setLeadData(updatedLeadData);
//   };

//   return (
//     <div className="p-4">
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragEnd={handleDragEnd}
//       >
//         <Row gutter={16}>
//           {leadData.map((leadGroup) => (
//             <Col xs={24} sm={12} md={8} lg={6} key={leadGroup.status}>
//               <Card title={leadGroup.status} className="mb-4">
//                 <DroppableColumn
//                   status={leadGroup.status}
//                   tasks={leadGroup.tasks}
//                 />
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </DndContext>
//     </div>
//   );
// };

// export default LeadCards;









// =-=-=-==-=-=-full working code =-=-==-====-==-=-=
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  DndContext,
  useDroppable,
  useDraggable,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const DraggableItem = ({ task, id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useDraggable({
      id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    marginBottom: "8px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card>
        <h4>{task.title}</h4>
        <p>Date: {task.date}</p>
        <p>Comments: {task.comments}</p>
      </Card>
    </div>
  );
};

const DroppableColumn = ({ status, tasks }) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: "100px",
        backgroundColor: "#f9f9f9",
        padding: "8px",
        borderRadius: "8px",
      }}
    >
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <DraggableItem key={task.id} task={task} id={task.id} />
        ))}
      </SortableContext>
      <Button className="mt-2 w-full">
        Add task
        <PlusOutlined />
      </Button>
    </div>
  );
};

const LeadCards = () => {
  const [leadData, setLeadData] = useState([]);

  useEffect(() => {
    // Initialize the data when the component is mounted
    setLeadData([
      {
        status: "Draft",
        tasks: [
          { id: 1, title: "Marketing Manager", date: "11 July", comments: 2 },
        ],
      },
      {
        status: "To be processed",
        tasks: [
                 { id: 2, title: "Table data incorrect", date: "11 July", comments: 2, status: "To be processed" },
                 { id: 3, title: "Fix broken UI", date: "05 August", comments: 1, status: "To be processed" },
               ],
      },
      {
        status: "Open",
        tasks: [
                  { id: 4, title: "Digital Marketing Specialist", date: "05 August", comments: 1 },
                ],
      },
      {
        status: "Processing",
        tasks: [
          { id: 5, title: "Fix dashboard layout", date: "17 April", comments: 1, status: "Processing" },
          { id: 6, title: "New design", date: "1", comments: 1, status: "Processing" },
          { id: 7, title: "Improve user experiences", date: "20 May", comments: 1, status: "Processing" },
               ],
      },
      {
        status: "Declined",
        tasks: [
          { id: 8, title: "Marketing Coordinator", date: "20 May", comments: 1 },
        ],
      },
      {
              status: "Submitted",
               tasks: [
                 { id: 9, title: "Update node environment", date: "", comments: 0, status: "Submitted" },
               ],
             },
             {
                     status: "Completed",
                     tasks: [
                       { id: 10, title: "Ready to test", date: "04 April", comments: 1, status: "Completed" },
                       { id: 11, title: "Slow API connection", date: "19 August", comments: 0, status: "Completed" },
                       { id: 12, title: "Login failed", date: "06 May", comments: 0, status: "Completed" },
                       { id: 13, title: "Locale incorrect", date: "13 August", comments: 2, status: "Completed" },
                     ],
                   },
    ]);

   // Run only once when the component is mounted
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    let sourceGroupIndex = -1;
    let destinationGroupIndex = -1;
    let sourceTaskIndex = -1;
    let destinationTaskIndex = -1;

    // Find source and destination group and task indices
    leadData.forEach((group, groupIndex) => {
      const taskIndex = group.tasks.findIndex((task) => task.id === activeId);
      if (taskIndex !== -1) {
        sourceGroupIndex = groupIndex;
        sourceTaskIndex = taskIndex;
      }
      if (group.status === overId || group.tasks.some((task) => task.id === overId)) {
        destinationGroupIndex = groupIndex;
        destinationTaskIndex = group.tasks.findIndex((task) => task.id === overId);
      }
    });

    const updatedLeadData = [...leadData];

    // If dropping into the same group
    if (sourceGroupIndex === destinationGroupIndex) {
      updatedLeadData[sourceGroupIndex].tasks = arrayMove(
        updatedLeadData[sourceGroupIndex].tasks,
        sourceTaskIndex,
        destinationTaskIndex
      );
    } else {
      // Move task to a different group
      const [movedTask] = updatedLeadData[sourceGroupIndex].tasks.splice(
        sourceTaskIndex,
        1
      );

      // Insert into the destination group
      updatedLeadData[destinationGroupIndex].tasks.splice(
        destinationTaskIndex === -1 ? updatedLeadData[destinationGroupIndex].tasks.length : destinationTaskIndex,
        0,
        movedTask
      );
    }

    setLeadData(updatedLeadData);
  };

  return (
    <div className="p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Row gutter={16}>
          {leadData.map((leadGroup) => (
            <Col xs={24} sm={12} md={8} lg={6} key={leadGroup.status}>
              <Card title={leadGroup.status} className="mb-4">
                <DroppableColumn
                  status={leadGroup.status}
                  tasks={leadGroup.tasks}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </DndContext>
    </div>
  );
};


export default LeadCards;







// =-=-=-=-=-=-=-=working code but some issue =-=-=-=-=-=-=-=-=-
// import React, { useState, useEffect } from "react";
// import { Card, Row, Col, Button } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import {
//   DndContext,
//   useDroppable,
//   useDraggable,
//   closestCenter,
//   PointerSensor,
//   KeyboardSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";

// const DraggableItem = ({ task, id }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useDraggable({
//       id,
//     });

//   const style = {
//     transform: transform
//       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//       : undefined,
//     transition,
//     marginBottom: "8px",
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <Card>
//         <h4>{task.title}</h4>
//         <p>Date: {task.date}</p>
//         <p>Comments: {task.comments}</p>
//       </Card>
//     </div>
//   );
// };

// const DroppableColumn = ({ status, tasks }) => {
//   const { setNodeRef } = useDroppable({
//     id: status,
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       style={{
//         minHeight: "100px",
//         backgroundColor: "#f9f9f9",
//         padding: "8px",
//         borderRadius: "8px",
//       }}
//     >
//       <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
//         {tasks.map((task) => (
//           <DraggableItem key={task.id} task={task} id={task.id} />
//         ))}
//       </SortableContext>
//       <Button className="mt-2 w-full">
//         Add task
//         <PlusOutlined />
//       </Button>
//     </div>
//   );
// };

// const LeadCards = () => {
//   const [leadData, setLeadData] = useState([]);

//   useEffect(() => {
//     // Initialize the data when the component is mounted
//     setLeadData([
//       {
//         status: "Draft",
//         tasks: [
//           { id: 1, title: "Marketing Manager", date: "11 July", comments: 2 },
//         ],
//       },
//       {
//         status: "Open",
//         tasks: [
//           { id: 2, title: "Digital Marketing Specialist", date: "05 August", comments: 1 },
//         ],
//       },
//       {
//         status: "Declined",
//         tasks: [
//           { id: 3, title: "Marketing Coordinator", date: "20 May", comments: 1 },
//         ],
//       },
//     ]);
//   }, []); // Run only once when the component is mounted

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor)
//   );

//   const handleDragEnd = ({ active, over }) => {
//     if (!over) return;

//     const activeId = active.id;
//     const overId = over.id;

//     if (activeId === overId) return;

//     let sourceIndex, destinationIndex, sourceGroupIndex, destinationGroupIndex;

//     leadData.forEach((group, groupIndex) => {
//       const taskIndex = group.tasks.findIndex((task) => task.id === activeId);
//       if (taskIndex !== -1) {
//         sourceIndex = taskIndex;
//         sourceGroupIndex = groupIndex;
//       }
//     });

//     leadData.forEach((group, groupIndex) => {
//       if (group.tasks.some((task) => task.id === overId)) {
//         destinationGroupIndex = groupIndex;
//         destinationIndex = group.tasks.findIndex((task) => task.id === overId);
//       }
//     });

//     const updatedLeadData = [...leadData];
//     const [movedTask] = updatedLeadData[sourceGroupIndex].tasks.splice(
//       sourceIndex,
//       1
//     );

//     updatedLeadData[destinationGroupIndex].tasks.splice(
//       destinationIndex,
//       0,
//       movedTask
//     );

//     setLeadData(updatedLeadData);
//   };

//   return (
//     <div className="p-4">
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragEnd={handleDragEnd}
//       >
//         <Row gutter={16}>
//           {leadData.map((leadGroup) => (
//             <Col xs={24} sm={12} md={8} lg={6} key={leadGroup.status}>
//               <Card title={leadGroup.status} className="mb-4">
//                 <DroppableColumn
//                   status={leadGroup.status}
//                   tasks={leadGroup.tasks}
//                 />
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </DndContext>
//     </div>
//   );
// };

// export default LeadCards;







// import React, { useState } from "react";
// import { Card, Row, Col, Button } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// const LeadCards = () => {
//   const [leadData, setLeadData] = useState([
//     {
//       status: "Draft",
//       tasks: [
//         { id: 1, title: "Marketing Manager", date: "11 July", comments: 2 },
//       ],
//     },
//     {
//       status: "Open",
//       tasks: [
//         { id: 2, title: "Digital Marketing Specialist", date: "05 August", comments: 1 },
//       ],
//     },
//     {
//       status: "Declined",
//       tasks: [
//         { id: 3, title: "Marketing Coordinator", date: "20 May", comments: 1 },
//       ],
//     },
//   ]);

//   const handleDragEnd = (result) => {
//     const { source, destination } = result;

//     if (!destination) return;

//     // If source and destination are the same, do nothing
//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     ) {
//       return;
//     }

//     // Find the source and destination groups
//     const sourceGroup = leadData.find((group) => group.status === source.droppableId);
//     const destinationGroup = leadData.find(
//       (group) => group.status === destination.droppableId
//     );

//     // Remove the dragged task from the source group
//     const [movedTask] = sourceGroup.tasks.splice(source.index, 1);

//     // Add the dragged task to the destination group
//     destinationGroup.tasks.splice(destination.index, 0, movedTask);

//     // Update the state
//     setLeadData([...leadData]);
//   };

//   return (
//     <div className="p-4">
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <Row gutter={16}>
//           {leadData.map((leadGroup) => (
//             <Col xs={24} sm={12} md={8} lg={6} key={leadGroup.status}>
//               <Card title={leadGroup.status} className="mb-4">
//                 <Droppable droppableId={leadGroup.status}>
//                   {(provided) => (
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       style={{
//                         minHeight: "100px",
//                         backgroundColor: "#f9f9f9",
//                         padding: "8px",
//                         borderRadius: "8px",
//                       }}
//                     >
//                       {leadGroup.tasks.map((task, index) => (
//                         <Draggable
//                           key={task.id}
//                           draggableId={task.id.toString()}
//                           index={index}
//                         >
//                           {(provided) => (
//                             <div
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               style={{
//                                 ...provided.draggableProps.style,
//                                 marginBottom: "8px",
//                               }}
//                             >
//                               <Card>
//                                 <h4>{task.title}</h4>
//                                 <p>Date: {task.date}</p>
//                                 <p>Comments: {task.comments}</p>
//                               </Card>
//                             </div>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                       <Button className="mt-2 w-full">
//                         Add task
//                         <PlusOutlined />
//                       </Button>
//                     </div>
//                   )}
//                 </Droppable>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </DragDropContext>
//     </div>
//   );
// };

// export default LeadCards;









// =--===-==-=-=-=-===-=vansita code =-==-==-===-==-=-=-==-=

// import React, { useState } from "react";
// import { Card, Row, Col, Button } from "antd";
// import { PlusOutlined } from "@ant-design/icons";

// const LeadCards = () => {
//   const [selectedTaskStatus, setSelectedTaskStatus] = useState("All");

//   const leadData = [
//     {
//       status: "To be processed",
//       tasks: [
//         { id: 1, title: "Table data incorrect", date: "11 July", comments: 2, status: "To be processed" },
//         { id: 2, title: "Fix broken UI", date: "05 August", comments: 1, status: "To be processed" },
//       ],
//     },
//     {
//       status: "Processing",
//       tasks: [
//         { id: 3, title: "Fix dashboard layout", date: "17 April", comments: 1, status: "Processing" },
//         { id: 4, title: "New design", date: "1", comments: 1, status: "Processing" },
//         { id: 5, title: "Improve user experiences", date: "20 May", comments: 1, status: "Processing" },
//       ],
//     },
//     {
//       status: "Submitted",
//       tasks: [
//         { id: 6, title: "Update node environment", date: "", comments: 0, status: "Submitted" },
//       ],
//     },
//     {
//       status: "Completed",
//       tasks: [
//         { id: 7, title: "Ready to test", date: "04 April", comments: 1, status: "Completed" },
//         { id: 8, title: "Slow API connection", date: "19 August", comments: 0, status: "Completed" },
//         { id: 9, title: "Login failed", date: "06 May", comments: 0, status: "Completed" },
//         { id: 10, title: "Locale incorrect", date: "13 August", comments: 2, status: "Completed" },
//       ],
//     },
//   ];

//   // Function to filter tasks based on selected task status
//   const filterTasks = (tasks) => {
//     if (selectedTaskStatus === "All") return tasks; // Return all tasks if "All" is selected
//     return tasks.filter(task => task.status === selectedTaskStatus);
//   };

//   return (
//     <div className="p-4">
//       <Row gutter={16}>
//         {leadData.map((leadGroup) => (
//           <Col xs={24} sm={12} md={8} lg={6} key={leadGroup.status}>
//             <Card title={leadGroup.status} className="mb-4">
//               <Card className="inner-card p-2 bg-white rounded">
//                 {filterTasks(leadGroup.tasks).map((task) => (
//                   <Card
//                     key={task.id}
//                     className="mt-2 p-2 bg-gray-100 rounded"
//                     draggable
//                     onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
//                   >
//                     <h4 className="text-sm">{task.title}</h4>
//                     <p className="text-xs text-gray-500">{task.date}</p>
//                     <p className="text-xs text-gray-500">Comments: {task.comments}</p>
//                   </Card>
//                 ))}
//                 <div
//                   onDragOver={(e) => e.preventDefault()}
//                   onDrop={(e) => {
//                     const taskId = e.dataTransfer.getData("taskId");
//                     const task = leadData.flatMap(group => group.tasks).find(t => t.id === parseInt(taskId));
//                     if (task && task.status !== leadGroup.status) {
//                       task.status = leadGroup.status;
//                       console.log(`Task ID: ${taskId} moved to ${leadGroup.status}`);
                     
//                     }
//                   }}
//                   className="drop-area"
//                 >
//                   <Button className="mt-2 w-full">
//                     Add task
//                     <PlusOutlined />
//                   </Button>
//                 </div>
//               </Card>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// };

// export default LeadCards;
