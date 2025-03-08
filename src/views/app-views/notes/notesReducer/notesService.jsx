import axios from "axios";
import { env } from "configs/EnvironmentConfig";


const getnote = async (id) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`${env.API_ENDPOINT_URL}/notes/${id}`, {
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

const addnote = async (id, formData) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/notes/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    //    dispatch(empdata());
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const adddelnote = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(`${env.API_ENDPOINT_URL}/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //   dispatch(empdata());
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const editelnote = async (idd, formData) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/notes/${idd}`,
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



const UserService = {
  getnote,
  addnote,
  adddelnote,
  editelnote,
};

export default UserService;
