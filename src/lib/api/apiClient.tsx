import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const liveBaseUrl = process.env.LIVE_BASE_URL;
const localBaseUrl = process.env.LOCAL_BASE_URL;
const backendUrl = process.env.BACKEND_API_URL;

if (
  !process.env.BACKEND_API_URL ||
  !process.env.LIVE_BASE_URL ||
  !process.env.LOCAL_BASE_URL
) {
  console.warn("BASE_URL_1 or BASE_URL_2 not set in .env. Using fallback:", {
    liveBaseUrl,
    localBaseUrl,
    backendUrl,
  });
}

const liveApi = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});
const backendApi = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get("access_token")}`,
  },
});

const localApi = axios.create({
  baseURL: localBaseUrl,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor for authentication and custom headers
// Common interceptors for both
const applyInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config: any) => {
      const token = Cookies.get("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      if (config.customHeaders) {
        config.headers = { ...config.headers, ...config.customHeaders };
      }

      console.log(
        "Request:",
        config.url,
        config.method,
        config.data,
        config.headers
      );
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: any) => {
      if (
        response.config.method !== "get" &&
        response.config.customSuccessMessage
      ) {
        toast.success(response.config.customSuccessMessage);
      }
      return response.data;
    },
    (error) => {
      const status = error.response?.status;

      // Try to extract backend error first
      let message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "An error occurred";

      if (status === 401) {
        message = "Session expired. Please log in again.";
        Cookies.remove("access_token");
        window.location.href = "/auth/login";
      } else if (status === 403) {
        message = "You don't have permission to perform this action.";
      } else if (status === 500) {
        message = "Server error. Please try again later.";
      }

      // if (!error.config.skipToast) {
      //   toast.error(message); // ✅ no more "Request failed with status code 400"
      // }

      console.error("API Error:", status, error.response?.data || message);
      return Promise.reject(error);
    }
  );

  return instance;
};

const liveApiInstance = applyInterceptors(liveApi);
const localApiInstance = applyInterceptors(localApi);
const backendApiInstance = applyInterceptors(backendApi);

// Generic API method factory
const createApiMethod =
  (instance) =>
  (method) =>
  async (
    endpoint,
    data = {},
    params = {},
    customSuccessMessage = null,
    customConfig = {}
  ) => {
    try {
      const config = {
        method,
        url: endpoint,
        data,
        params,
        customSuccessMessage,
        ...customConfig,
      };
      const response = await instance(config);
      return response;
    } catch (error) {
      throw error;
    }
  };

// Export methods for both instances
export const getlive = createApiMethod(liveApiInstance)("get");
export const postlive = createApiMethod(liveApiInstance)("post");
export const putlive = createApiMethod(liveApiInstance)("put");
export const patchlive = createApiMethod(liveApiInstance)("patch");
export const dellive = createApiMethod(liveApiInstance)("delete");

export const getlocal = createApiMethod(localApiInstance)("get");
export const postlocal = createApiMethod(localApiInstance)("post");
export const putlocal = createApiMethod(localApiInstance)("put");
export const patchlocal = createApiMethod(localApiInstance)("patch");
export const dellocal = createApiMethod(localApiInstance)("delete");

export const getbackend = createApiMethod(backendApiInstance)("get");
export const postbackend = createApiMethod(backendApiInstance)("post");
export const putbackend = createApiMethod(backendApiInstance)("put");
export const patchbackend = createApiMethod(backendApiInstance)("patch");
export const delbackend = createApiMethod(backendApiInstance)("delete");
