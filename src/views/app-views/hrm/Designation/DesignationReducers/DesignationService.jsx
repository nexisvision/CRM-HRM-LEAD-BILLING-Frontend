import axios from "axios";
import { env } from "configs/EnvironmentConfig";

const GetDes = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`${env.API_ENDPOINT_URL}/designations/`, {
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

const AddDesignation = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/designations/`,
      payload,
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

const DeleteDes = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(
      `${env.API_ENDPOINT_URL}/designations/${id}`,
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

const EditDesignation = async (id, values) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/designations/${id}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating employee data:", error);
    throw error;
  }
};


const DesignationService = {

  GetDes,
  AddDesignation,
  DeleteDes,
  EditDesignation,

};

export default DesignationService;
