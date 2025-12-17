import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import AdminLayout from "./Admin/Components/AdminLayout";
import UserLayout from "./Admin/Components/UserLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./Admin/Pages/Dashboard";
import AdminProfile from "./Admin/Pages/AdminProfile";
import AddFood from "./Admin/Pages/AddFood";
import FoodDetail from "./Admin/Pages/FoodDetail";
import Foods from "./Admin/Pages/Foods";
import Exercises from "./Admin/Pages/Exercises";
import AddExercise from "./Admin/Pages/AddExercise";
import ExerciseDetail from "./Admin/Pages/ExerciseDetail";
import Users from "./Admin/Pages/Users";
import UserDetail from "./Admin/Pages/UserDetail";
import ClientProfile from "./Admin/Pages/ClientProfile";
import Meal from "./FoodMeal/Pages/Meal";
import Food from "./FoodMeal/Pages/Food";

function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="foods" element={<Foods />} />
        <Route path="foods/add" element={<AddFood />} />
        <Route path="foods/:id" element={<FoodDetail />} />
        <Route path="foods/:id/edit" element={<AddFood />} />
        <Route path="exercise" element={<Exercises />} />
        <Route path="exercise/add" element={<AddExercise />} />
        <Route path="exercise/:id" element={<ExerciseDetail />} />
        <Route path="exercise/:id/edit" element={<AddExercise />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="users/:id/edit" element={<UserDetail />} />
      </Route>

      {/* User routes */}
      <Route path="/food" element={<Food />} />
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<ClientProfile />} />
        <Route path="meals" element={<Meal />} />
        <Route path="workouts" element={<div className="container py-4">My Workouts</div>} />
      </Route>
    </Routes>
  );
}

export default App;
