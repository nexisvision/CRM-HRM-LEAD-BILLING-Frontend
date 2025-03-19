const dev = {
  API_ENDPOINT_URL: "https://crm-api.grewox.com/api/v1",
};

const prod = {
  API_ENDPOINT_URL: "https://crm-api.grewox.com/api/v1",
};

const test = {
  API_ENDPOINT_URL: "https://crm-api.grewox.com/api/v1",
};

const getEnv = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return dev;
    case "production":
      return prod;
    case "test":
      return test;
    default:
      return dev;
  }
};

export const env = getEnv();
