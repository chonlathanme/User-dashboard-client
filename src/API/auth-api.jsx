import axios from "axios";

const authApi = {
  loginGoogle: async (profile) => {
    try {
      const response = await axios.post("/api/auth/google-login", profile);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await axios.get("/api/auth/check", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  }
};

export default authApi;