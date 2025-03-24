import axios from "axios";
import { env } from "configs/EnvironmentConfig";


const Getplan = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`${env.API_ENDPOINT_URL}/subscriptions`, {
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

const AddPlan = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/subscriptions`,
      JSON.stringify(payload), // Convert payload to JSON string
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Explicitly set content type
        },
      }
    );
    // Handle response data as needed
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const DeletePlan = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(
      `${env.API_ENDPOINT_URL}/subscriptions/${id}`,
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

const EditP = async (id, values) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/subscriptions/${id}`,
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

const planbuy = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/subscriptions/request`,
      JSON.stringify(payload), // Convert payload to JSON string
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Explicitly set content type
        },
      }
    );
    // Handle response data as needed
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


const PlanService = {

  Getplan,
  AddPlan,
  DeletePlan,
  EditP,
  planbuy,

};

export default PlanService;
