import axios from "axios";
import { env } from "configs/EnvironmentConfig";

const ClientData = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`${env.API_ENDPOINT_URL}/clients/`, {
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

const createClient = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/clients/`,
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


const registerClient = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/clients/register`,
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


const DeleteClient = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(
      `${env.API_ENDPOINT_URL}/clients/${id}`,
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

const EditClientss = async (comnyid, formData) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/clients/${comnyid}`,
      formData,
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

const assignplan = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/subscriptions/assign`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error assigning plan:", error);
    throw error;
  }
};

const sendemailotp = async (idd, values) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/clients/email/${idd}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.setItem("emailupdate", res.data.data.sessionToken);

    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const otpverify = async (values) => {
  const token = localStorage.getItem("emailupdate");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/auth/verify`,
      values,
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



const UserService = {
  ClientData,
  createClient,
  DeleteClient,
  EditClientss,
  assignplan,
  sendemailotp,
  otpverify,
  registerClient,
};

export default UserService;
