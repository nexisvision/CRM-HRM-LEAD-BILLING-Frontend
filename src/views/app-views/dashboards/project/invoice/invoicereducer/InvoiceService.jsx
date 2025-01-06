import axios from "axios";
// import { API_BASE_URL } from 'configs/AppConfig';

const InvoiceService = {
  // Get all invoices
  getAllInvoices: async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      console.log("Fetching invoices for ID:", id);
      const response = await axios.get(
        `http://localhost:5353/api/v1/invoices/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Invoice response:", response.data);
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
        `http://localhost:5353/api/v1/invoices/${id}`,
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
        `http://localhost:5353/api/v1/milestones/${id}`,
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
      console.log("Creating invoice for product:", id);
      const response = await axios.post(
        `http://localhost:5353/api/v1/invoices/${id}`,
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
        `http://localhost:5353/api/v1/invoices/${idd}`,
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
        `http://localhost:5353/api/v1/invoices/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Deleting invoice with ID:", id);
      return response.data;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  },

  // Get invoice statistics
  //   getInvoiceStats: async () => {
  //     const token = localStorage.getItem('auth_token');
  //     try {
  //       const response = await axios.get(`${API_BASE_URL}/invoices/statistics`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       return response.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },

  // Generate invoice PDF
  //   generateInvoicePDF: async (id) => {
  //     const token = localStorage.getItem('auth_token');
  //     try {
  //       const response = await axios.get(`${API_BASE_URL}/invoices/${id}/pdf`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         responseType: 'blob',
  //       });
  //       return response.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
};

export default InvoiceService;
