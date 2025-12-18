import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import AdminLayout from "./Admin/Components/AdminLayout";
import UserLayout from "./Admin/Components/UserLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
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
import GoalAndProgressPage from "./Admin/Pages/GoalAndProgressPage";
import ProgressAndAnalytics from "./Admin/Pages/ProgressAndAnalytics";
import WorkoutList from "./Workout/Pages/WorkoutList"
import Meal from "./FoodMeal/Pages/Meal";
import Food from "./FoodMeal/Pages/Food";
import Exercise from "./Exercise/Pages/Exercise";
import ClientExercises from "./Exercise/Pages/Exercise";

function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="Admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
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
      <Route
        path="/food"
        element={
          <ProtectedRoute requiredRole="Client">
            <Food />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute requiredRole="Client">
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<ClientProfile />} />
        <Route path="meals" element={<Meal />} />
        <Route path="food/:mealId" element={<Food />} />
        <Route
          path="exercises/workout/:workoutId"
          element={<ClientExercises />}
        />
        <Route path="exercises/detail/:id" element={<ExerciseDetail />} />
        <Route path="workouts" element={<WorkoutList />} />
        <Route path="goal-progress" element={<GoalAndProgressPage />} />
        <Route
          path="progress-and-analytics"
          element={<ProgressAndAnalytics />}
        />
      </Route>
    </Routes>
  );
}

export default App;
