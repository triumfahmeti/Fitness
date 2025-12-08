import React from "react";
import AdminLayout from "./Admin/Components/AdminLayout";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Admin/Pages/Dashboard";
import AdminProfile from "./Admin/Pages/AdminProfile";
function App() {
  return (
    <Routes>
      {/* Layout with nested routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
