    import axios from "axios";
import { env } from "configs/EnvironmentConfig";


const getsal = async () => {
  const token = localStorage.getItem("auth_token");
  try {
    const res = await axios.get(`${env.API_ENDPOINT_URL}/salary/`, {
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

const addsal = async (payload) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.post(
      `${env.API_ENDPOINT_URL}/salary/`,
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

const deletsal = async (id) => {
  const token = localStorage.getItem("auth_token");

  try {
    const res = await axios.delete(
      `${env.API_ENDPOINT_URL}/salary/${id}`,
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

const editsal = async (idd, values) => {
  const token = localStorage.getItem("auth_token");
  try {
    const payload = {
      employeeId: values.employeeId,
      payslipType: values.payslipType,
      currency: values.currency,
      salary: values.salary,
      netSalary: values.netSalary,
      status: values.status,
      bankAccount: values.bankAccount,
      created_by: values.created_by
    };

    const res = await axios.put(
      `${env.API_ENDPOINT_URL}/salary/${idd}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    if (res.data.success === false) {
      throw new Error(res.data.message);
    }

    return res.data;
  } catch (error) {
    console.error("Error updating salary data:", error);
    throw error;
  }
};


const UserService = {
  getsal,
  addsal,
  deletsal,
  editsal,

};

export default UserService;
