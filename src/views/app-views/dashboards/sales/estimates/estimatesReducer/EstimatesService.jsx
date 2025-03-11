import axios from "axios";
import { env } from "configs/EnvironmentConfig";
const getAllQuotations = async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`${env.API_ENDPOINT_URL}/sales-quotations/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
const createQuotations = async (values) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.post(
      ` ${env.API_ENDPOINT_URL}/sales-quotations/`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw error;
  }
};
const deleteQuotations = async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.delete(
      `${env.API_ENDPOINT_URL}/sales-quotations/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
const getQuotationsById = async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const response = await axios.get(
      `${env.API_ENDPOINT_URL}/sales-quotations/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response.data", response.data);
    return response.data;

  } catch (error) {
    throw error;
  }
};
const updateQuotations = async (id, values) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/sales-quotations/${id}`, values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("res.data", res.data);
    console.log("updateQuoid", id);

    return res.data;
  } catch (error) {
    console.error("Error updating Quotations :", error);
    throw error;
  }
};
const QuotationsService = {

  getAllQuotations,
  createQuotations,
  deleteQuotations,
  updateQuotations,
  getQuotationsById
};
export default QuotationsService;

