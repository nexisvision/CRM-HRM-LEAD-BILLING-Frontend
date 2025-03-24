import axios from "axios";
import { env } from "configs/EnvironmentConfig";


const getinq = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`${env.API_ENDPOINT_URL}/inquiry/`, {
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

const addinq = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/inquiry/`,
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

const delinq = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(
      `${env.API_ENDPOINT_URL}/inquiry/${id}`,
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

const editinq = async (idd, values) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/inquiry/${idd}`,
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



const InquiryService = {
  getinq,
  addinq,
  delinq,
  editinq,
};

export default InquiryService;
