import axios from "axios";
import { env } from "configs/EnvironmentConfig";

const getbillsss = async (lid) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`${env.API_ENDPOINT_URL}/bills/${lid}`, {
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

const addbillsss = async (lid, invoiceData) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/bills/${lid}`,
      invoiceData,
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

const deltedbillsss = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(`${env.API_ENDPOINT_URL}/bills/${id}`, {
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

const editbillsss = async (idd, invoiceData) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/bills/${idd}`,
      invoiceData,
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



const UserService = {
  getbillsss,
  addbillsss,
  deltedbillsss,
  editbillsss,
};

export default UserService;
