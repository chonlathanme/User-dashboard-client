import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import useAuthStore from "../../stores/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google OAuth Success:', tokenResponse);
        await login(tokenResponse);
        navigate("/users");
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      alert("Login failed. Please try again.");
    },
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    flow: 'implicit',
    access_type: 'offline'
  });

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center p-4 bg-gray-50">
      <button
        onClick={() => googleLogin()}
        className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
      >
        <img 
          src="https://www.google.com/favicon.ico" 
          alt="Google" 
          className="w-5 h-5"
        />
        <h1 className="text-lg font-semibold">Sign in with Google</h1>
      </button>
    </div>
  );
};

export default Login;
