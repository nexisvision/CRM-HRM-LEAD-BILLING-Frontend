import axios from 'axios';

const fetchEvents = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(
      "http://localhost:5353/api/v1/events/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

const createEvent = async (payload) => {
  const token = localStorage.getItem("auth_token");
  
  // Format the payload to match backend expectations
//   const formattedPayload = {
//     EventTitle: payload.title,
//     EventManager: payload.employee,
//     EventDate: payload.startDate,
//     EventTime: payload.startTime
//   };

  try {
    const res = await axios.post(
      "http://localhost:5353/api/v1/events/",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

const updateEventsetUp = async (id, data) => {

  try {
      const token = JSON.parse(localStorage.getItem('auth_token'));
      const res = await axios.put(`http://localhost:5353/api/v1/events/${id}`, data, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return res.data;

  } catch (error) {
      if (error.response) {
          throw error.response.data; // Throw the response data directly
      }
      throw new Error('Update Failed');
  }
};

const getEventById =  async (id) => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.get(
      `http://localhost:5353/api/v1/events/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

// const updateEventsetUp = async (id, payload) => {
//     const token = localStorage.getItem("auth_token");
//     console.log(token);
//     try {
//       const res = await axios.put(
//         `http://localhost:5353/api/v1/events/${id}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return res.data;
//     } catch (error) {
//       console.error("Error updating event:", error);
//       throw error;
//     }
//   };

const deleteEvent = async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.delete(
      `http://localhost:5353/api/v1/events/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};



const EventService = {
  fetchEvents,
  deleteEvent,
  createEvent,
  getEventById,
  updateEventsetUp,
};

export default EventService;
