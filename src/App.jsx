import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Protected Pages (sementara kosong dulu)
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import TopUp from "./pages/TopUp";
import Payment from "./pages/Payment";
import History from "./pages/History";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Redirect root ke login atau home */}
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Auth Routes (Public) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/topup" element={<TopUp />} />
        <Route path="/transaction" element={<History />} />
        <Route path="/payment/:serviceCode" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 404 - Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
