import axios from "axios";
import config from "../config";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
});

// Add response interceptor for rate limit handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      // Rate limit exceeded
      console.warn("Rate limit exceeded");
      // You could dispatch this to your state management
      // or show a toast notification
      throw new Error(
        "Too many requests. Please wait a moment before trying again."
      );
    }
    throw error;
  }
);

// Document-related API calls
export const searchDocuments = async (params) => {
  try {
    const response = await apiClient.get(`/documents/search`, { params });
    return response.data;
  } catch (error) {
    if (error.message.includes("Too many requests")) {
      // Handle rate limit specifically
      throw new Error("Rate limit exceeded. Please wait a moment.");
    }
    throw error;
  }
};

export const getDocument = async (documentId) => {
  const response = await apiClient.get(`/documents/${documentId}`);
  return response.data;
};

export const sendChatMessage = async (query, conversationId, email) => {
  try {
    const response = await apiClient.post(`/chat`, {
      query,
      conversation_id: conversationId,
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error; // Re-throw to handle in the component
  }
};
