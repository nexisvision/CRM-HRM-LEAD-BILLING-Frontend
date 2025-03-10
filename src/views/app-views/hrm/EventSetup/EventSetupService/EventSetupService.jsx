import axios from 'axios';
import { env } from 'configs/EnvironmentConfig';

const fetchEvents = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(
      `${env.API_ENDPOINT_URL}/events/`,
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
  
  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/events/`,
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
      const res = await axios.put(`${env.API_ENDPOINT_URL}/events/${id}`, data, {
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
      `${env.API_ENDPOINT_URL}/events/${id}`,
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


const deleteEvent = async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.delete(
      `${env.API_ENDPOINT_URL}/events/${id}`,
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
