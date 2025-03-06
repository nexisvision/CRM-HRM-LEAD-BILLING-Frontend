import axios from "axios";
import { env } from "configs/EnvironmentConfig";
const GetAllTax = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(
      `${env.API_ENDPOINT_URL}/taxes/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching tax data:", error);
    throw error;
  }
};

const CreateTax = async (payload) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/taxes/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating tax:", error);
    throw error;
  }
};

const UpdateTax = async (id, values) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/taxes/${id}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating tax:", error);
    throw error;
  }
};

const DeleteTax = async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.delete(
      `${env.API_ENDPOINT_URL}/taxes/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting tax:", error);
    throw error;
  }
};

const TaxService = {
  CreateTax,
  GetAllTax,
  UpdateTax,
  DeleteTax,
};

export default TaxService;
