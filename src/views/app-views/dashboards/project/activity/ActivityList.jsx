import axios from "axios";
import { env } from "configs/EnvironmentConfig";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
function ActivityList() {
  const [timelineItems, setTimelineItems] = useState([
    {
      date: "Oct 24",
      time: "06:07 pm",
      event: "New task added to the project.",
    },
    {
      date: "Oct 24",
      time: "06:07 pm",
      event: "New member added to the project.",
    },
  ]);

  const { id } = useParams();

  const GetActriv = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await axios.get(
        `${env.API_ENDPOINT_URL}/activities/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("iiii", res);
      setTimelineItems(res.data.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  useEffect(() => {
    GetActriv(id);
  }, []);

  const timestamp = "2025-01-03T11:02:10.000Z";
  const date = new Date(timestamp);

  // Format as "YYYY-MM-DD HH:mm:ss"
  const formattedDate = date.toISOString().split("T")[0]; // Extract "YYYY-MM-DD"
  const formattedTime = date.toTimeString().split(" ")[0]; // Extract "HH:mm:ss"

  // Combine date and time with a space
  const displayTime = `${formattedDate}     ${formattedTime}`;

  console.log(displayTime); // Output: 2025-01-03 11:02:10

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <ul className="space-y-4 ">
        {timelineItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center border-b border-gray-200 pb-3"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-4 ">
              {/* {item.date.substring(0, 3)} */}
            </div>
            <div>
              <p className="text-sm font-semibold">{item.activity_from}</p>
              <p className="text-xs text-gray-500">{displayTime}</p>
              <p className="text-sm">{item.activity_message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ActivityList;
