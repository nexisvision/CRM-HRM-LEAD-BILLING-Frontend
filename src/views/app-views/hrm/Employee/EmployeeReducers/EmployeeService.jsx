import axios from "axios";
import { env } from "configs/EnvironmentConfig";

const fetchEmpData = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`${env.API_ENDPOINT_URL}/employees/`, {
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

const createEmp = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/employees/`,
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

const Empdelete = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(`${env.API_ENDPOINT_URL}/employees/${id}`, {
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

const EditEmp = async (idd, updatedFormValues) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/employees/${idd}`,
      updatedFormValues,
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
  fetchEmpData,
  createEmp,
  Empdelete,
  EditEmp,
};

export default UserService;
