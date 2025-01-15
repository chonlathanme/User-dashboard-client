import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import useAuthStore from "../../stores/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await login(response);
        navigate("/users");
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    onError: (error) => console.error("Login Failed:", error),
    flow: 'auth-code',
    popup: true,
    flow_handler: (options) => {
      const width = 500;
      const height = 600;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;

      return window.open(
        options.url,
        'Google Login',
        `width=${width},height=${height},top=${top},left=${left},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
      );
    }
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
