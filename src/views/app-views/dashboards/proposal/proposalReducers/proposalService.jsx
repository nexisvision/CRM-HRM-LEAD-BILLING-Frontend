import axios from "axios";
// import { API_BASE_URL } from 'configs/AppConfig';

const ProposalService = {
  // Get all invoices
  getAllProposals: async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      console.log("Fetching proposals for ID:", id);
      const response = await axios.get(
        `http://localhost:5353/api/v1/proposals/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Proposal response:", response.data);
      return response;
    } catch (error) {
      console.error("Error fetching proposals:", error);
      throw error;
    }
  },

  // Get single invoice by ID
  getProposalById: async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.get(
        `http://localhost:5353/api/v1/proposals/${id}`,
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

  
  // Create new invoice
  createProposal: async (values) => {
    const token = localStorage.getItem("auth_token");
    try {
      
      const response = await axios.post(
        `http://localhost:5353/api/v1/proposals/`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to create proposal");
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      throw error.response?.data || error.message;
    }
  },

  // Update invoice
  updateProposal: async (idd, data) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.put(
        `http://localhost:5353/api/v1/proposals/${idd}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete invoice
  deleteProposal: async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.delete(
        `http://localhost:5353/api/v1/proposals/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Deleting proposal with ID:", id);
      return response.data;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  },

};

export default ProposalService;
