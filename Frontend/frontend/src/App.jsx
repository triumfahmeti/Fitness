import React from "react";
import AdminLayout from "./Admin/Components/AdminLayout";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Admin/Pages/Dashboard";
import AdminProfile from "./Admin/Pages/AdminProfile";
import AddFood from "./Admin/Pages/AddFood";

import FoodDetail from "./Admin/Pages/FoodDetail";
import Foods from "./Admin/Pages/Foods";
import Exercises from "./Admin/Pages/Exercises";
import AddExercise from "./Admin/Pages/AddExercise";
import ExerciseDetail from "./Admin/Pages/ExerciseDetail";
function App() {
  return (
    <Routes>
      {/* Layout with nested routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/foods" element={<Foods />} />

        <Route path="/admin/foods/add" element={<AddFood />} />
        <Route path="/admin/foods/:id" element={<FoodDetail />} />
        <Route path="/admin/foods/:id/edit" element={<AddFood />} />
        <Route path="/admin/exercise" element={<Exercises />} />
        <Route path="/admin/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/admin/exercise/add" element={<AddExercise />} />
        <Route path="/admin/exercise/:id/edit" element={<AddExercise />} />
      </Route>
    </Routes>
  );
}

export default App;
