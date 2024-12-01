import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

// Document-related API calls
export const searchDocuments = async (params) => {
    const response = await axios.get(`${API_BASE_URL}/documents/search`, {
        params: {
            query: params.query,
            region: params.region,
            category: params.category,
            tags: params.tags,
            year: params.year,
            page: params.page,
            per_page: params.per_page
        }
    });
    return response.data;
};

// You can add more API functions here as needed
export const getDocument = async (documentId) => {
    const response = await axios.get(`${API_BASE_URL}/documents/${documentId}`);
    return response.data;
};