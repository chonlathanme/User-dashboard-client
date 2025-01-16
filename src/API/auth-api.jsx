import axios from "axios";

// กำหนด base URL
axios.defaults.baseURL = 'http://localhost:3000';

const authApi = {
  loginGoogle: async (tokenResponse) => {
    try {
      console.log('Token Response:', tokenResponse);

      const response = await axios.post("/api/auth/google-login", 
        { access_token: tokenResponse.access_token },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login API Error:', error.response?.data || error);
      throw error.response?.data || error;
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