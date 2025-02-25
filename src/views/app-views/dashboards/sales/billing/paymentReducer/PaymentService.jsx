import axios from "axios";

const GetAllPayment = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(
      "http://localhost:5353/api/v1/bill-payments/",
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
      "http://localhost:5353/api/v1/bill-payments/",
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
