import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const HeaderHome = () => {
  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="flex flex-row justify-between p-4">
      <h1 className="text-3xl font-bold">Home</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-bold py-2 px-4 rounded"
        onClick={() => setRedirect(true)}
      >
        Login
      </button>
    </div>
  );
};

export default HeaderHome;
