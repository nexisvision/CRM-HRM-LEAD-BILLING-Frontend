import axios from 'axios';
import { env } from 'configs/EnvironmentConfig';

const EstimateService = {
  // Get all estimates
  getaddleadmembers: async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await axios.get(`${env.API_ENDPOINT_URL}/leads/members/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new estimate
  createEstimate: async (id, estimateData) => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await axios.post(
        `${env.API_ENDPOINT_URL}/quotations/${id}`,
        estimateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single estimate by ID
  getEstimateById: async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.get(
        `${env.API_ENDPOINT_URL}/quotations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update estimate
  updateEstimate: async (idd, data) => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await axios.put(
        `${env.API_ENDPOINT_URL}/quotations/${idd}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

   // .deleteEstimate

 deleteEstimate: async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const response = await axios.delete(
      `${env.API_ENDPOINT_URL}/quotations/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}
};


export default EstimateService;
