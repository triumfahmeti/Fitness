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
import Users from "./Admin/Pages/Users";
import UserDetail from "./Admin/Pages/UserDetail";
import UserLayout from "./Admin/Components/UserLayout";
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
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/users/:id" element={<UserDetail />} />
        <Route path="/admin/users/:id/edit" element={<UserDetail />} />
   
      </Route>

      {/* User layout with nested routes */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<UserLayout />} />
         <Route path="/user/profile" element={<ClientProfile />} />
        <Route path="/user/meals" element={<Meal />} />
        <Route path="/user/food/:mealId" element={<Food />} />
        <Route
          path="/user/exercises/workout/:workoutId"
          element={<ClientExercises />}
        />
        <Route path="/user/exercises/detail/:id" element={<ExerciseDetail />} />
        {/* Placeholder pages for user-specific sections */}
        <Route path="/user/workouts" element={<WorkoutList />} />

        <Route path="/user/goal-progress" element={<GoalAndProgressPage />} />
        <Route path="/user/progress&analytics" element={<ProgressAndAnalytics/>}>
         <Route path="/user/progress&analytics" element={<ProgressAndAnalytics/>}>
         </Route>
        </Route>
        {/* Placeholder pages for user-specific sections */}
        <Route
          path="/user/workouts"
          element={<div className="container py-4">My Workouts</div>}
        />
        <Route
          path="/user/meals"
          element={<div className="container py-4">My Meals</div>}
        />
      </Route>
    </Routes>
  );
}

export default App;
