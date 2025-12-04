import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Loader from "./components/Loader/index.js";
import ChangePassword from "./page/auth/ChangePassword.js";

const Login = lazy(() => import("./page/auth/Login"));
const Dashboard = lazy(() => import("./page/Dashboard"));
const NotFound = lazy(() => import("./page/NotFound"));

const App = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const allow_path = ['/', '/change-password'];
  const isAuthorized = localStorage.getItem("token");

  // useEffect(() => {
  //   if (isAuthorized) {
  //     if (allow_path.includes(pathname)) {
  //       navigate("/dashboard")
  //     }
  //   } else if (!allow_path.includes(pathname)) {
  //     navigate('/');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

    useEffect(() => {
    if (!isAuthorized && !allow_path.includes(pathname)) {
      navigate('/');
    }

    if (isAuthorized && allow_path.includes(pathname)) {
      navigate('/dashboard');
    }
  }, [isAuthorized, pathname, navigate]);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </Suspense>
    </>
  );
};

export default App;

