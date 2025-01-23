import axios from "axios";
import { createBilling, deleteBilling, updateBilling } from "./billingSlice";
// import { API_BASE_URL } from 'configs/AppConfig';

const BillingService = {
  // Get all invoices
  getAllBillings: async (lid) => {
    const token = localStorage.getItem("auth_token");
    try {
    //   console.log("Fetching billings for ID:", lid);
      const response = await axios.get(
        `http://localhost:5353/api/v1/bills/${lid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    //   console.log("Billing response:", response.data);
      return response;
    } catch (error) {
      console.error("Error fetching billings:", error);
      throw error;
    }
  },

  // Get single invoice by ID
  getBillingById: async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.get(
        `http://localhost:5353/api/v1/bills/${id}`,
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
  createBilling: async (lid , billingData) => {
    const token = localStorage.getItem("auth_token");
    try {
      
      const response = await axios.post(
        `http://localhost:5353/api/v1/bills/${lid}`,
        billingData,
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
        throw new Error(response.data.message || "Failed to create billing");
      }
    } catch (error) {
      console.error("Error creating billing:", error);
      throw error.response?.data || error.message;
    }
  },

  // Update invoice
  updateBilling: async (idd, data) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.put(
        `http://localhost:5353/api/v1/bills/${idd}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Deleting billing with ID:", idd);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete invoice
  deleteBilling: async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.delete(
        `http://localhost:5353/api/v1/bills/${id}`,
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
  },

};

export default BillingService;
