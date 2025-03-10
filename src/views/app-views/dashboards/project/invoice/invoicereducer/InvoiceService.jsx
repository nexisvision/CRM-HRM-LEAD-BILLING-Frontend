import axios from "axios";
import { env } from "configs/EnvironmentConfig";
// import { API_BASE_URL } from 'configs/AppConfig';

const InvoiceService = {
  // Get all invoices
  getAllInvoices: async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.get(
        `${env.API_ENDPOINT_URL}/invoices/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  },

  // Get single invoice by ID
  getInvoiceById: async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.get(
        `${env.API_ENDPOINT_URL}/invoices/${id}`,
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

  getMilestoneDetails: async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.get(
        `${env.API_ENDPOINT_URL}/milestones/${id}`,
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
  createInvoice: async (id, invoiceData) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.post(
        `${env.API_ENDPOINT_URL}/invoices/${id}`,
        invoiceData,
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
        throw new Error(response.data.message || "Failed to create invoice");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error.response?.data || error.message;
    }
  },

  // Update invoice
  updateInvoice: async (idd, data) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.put(
        `${env.API_ENDPOINT_URL}/invoices/${idd}`,
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
  deleteInvoice: async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.delete(
        `${env.API_ENDPOINT_URL}/invoices/${id}`,
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

export default InvoiceService;
