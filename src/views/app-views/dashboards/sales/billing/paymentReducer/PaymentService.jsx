import axios from "axios";
import { env } from "configs/EnvironmentConfig";
const GetAllPayment = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(
      `${env.API_ENDPOINT_URL}/bill-payments/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching debit data:", error);
    throw error;
  }
};

const CreatePayment = async (payload) => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/bill-payments/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};



const PaymentService = {
  CreatePayment,
  GetAllPayment
};

export default PaymentService;
