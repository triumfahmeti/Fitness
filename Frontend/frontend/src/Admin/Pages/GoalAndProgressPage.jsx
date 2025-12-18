import React, { useState, useEffect, useMemo } from "react";

import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function GoalAndProgressPage() {
  const clientId = 1;

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // For the message
  const [messageType, setMessageType] = useState("success"); // For message type (success/error)

  // Pesha fillestare + matjet
  const [progressData, setProgressData] = useState({
    weight: "",
    waist: "",
    chest: "",
    arm: "",
    thigh: "",
  });

  // Goal
  const [goal, setGoal] = useState({
    goalType: "GAIN_WEIGHT", // GAIN_WEIGHT | LOSE_WEIGHT
    targetValue: "",
  });

  // Pesha aktuale (daily update)
  const [currentWeight, setCurrentWeight] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        // PROGRESS (latest)
        const pRes = await axios.get("https://localhost:7103/api/Progress");
        const list = pRes.data
          .filter(p => p.clientId === clientId)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        if (list.length > 0) {
          setProgressData(list[0]);
          setCurrentWeight(list[0].weight);
        }

        // GOAL
        const gRes = await axios.get("https://localhost:7103/api/Goal");
        const g = gRes.data.find(x => x.clientId === clientId);
        if (g) setGoal(g);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /* ================= PROGRESS % ================= */
  const progressPercent = useMemo(() => {
    const initial = Number(progressData.weight); // Initial weight
    const current = Number(currentWeight); // Current weight
    const target = Number(goal.targetValue); // Target weight

    if (!initial || !current || !target) return 0;

    if (goal.goalType === "LOSE_WEIGHT" && current <= target) {
  return 100; // Goal is achieved (current weight is less than or equal to target)
}

    if (goal.goalType === "LOSE_WEIGHT" && current >= initial) {
  return 0; // Goal is achieved (current weight is less than or equal to target)
}

    if (goal.goalType === "GAIN_WEIGHT" && current >= target) {
      return 100; // Goal is achieved (current weight is greater than or equal to target)
    }

        if (goal.goalType === "GAIN_WEIGHT" && current <= initial) {
  return 0; // Goal is achieved (current weight is less than or equal to target)
}


    // Calculate the total difference between initial and target
    const totalNeeded = Math.abs(target - initial);

    // If the goal is "GAIN_WEIGHT", progress is based on increasing weight
    // If the goal is "LOSE_WEIGHT", progress is based on decreasing weight
    let done;
    if (goal.goalType === "GAIN_WEIGHT") {
      done = Math.abs(current - initial);
    } else {
      done = Math.abs(initial - current);
    }

    // To prevent dividing by zero, handle edge case where target and initial are the same
    if (totalNeeded === 0) return 100;

    return Math.min((done / totalNeeded) * 100, 100);
  }, [progressData.weight, currentWeight, goal.targetValue, goal.goalType]);

  /* ================= SAVE PERSONAL ================= */
  const saveProgress = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7103/api/Progress", {
        clientId,
        weight: progressData.weight,
        waist: progressData.waist,
        chest: progressData.chest,
        arm: progressData.arm,
        thigh: progressData.thigh,
      });
      setMessage("Personal info saved successfully.");
      setMessageType("success"); // Mesazh suksesi
    } catch (error) {
      setMessage("Error saving personal info: " + error.message);
      setMessageType("error"); // Mesazh gabimi
    }
  };

  /* ================= SAVE GOAL ================= */
  const saveGoal = async (e) => {
    e.preventDefault();
    const updatedGoal = {
      clientId,
      goalType: goal.goalType,
      targetValue: goal.targetValue,
    };

    try {
      await axios.post("https://localhost:7103/api/Goal", updatedGoal);
      setMessage("Goal saved successfully.");
      setMessageType("success"); // Mesazh suksesi
    } catch (error) {
      setMessage("Error saving goal: " + error.message);
      setMessageType("error"); // Mesazh gabimi
    }
  };

  /* ================= DAILY UPDATE ================= */
  const saveDailyWeight = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7103/api/Progress", {
        clientId,
        weight: currentWeight,
      });
      setMessage("Daily weight updated successfully.");
      setMessageType("success"); // Mesazh suksesi
    } catch (error) {
      setMessage("Error updating daily weight: " + error.message);
      setMessageType("error"); // Mesazh gabimi
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  // CSS inline për mesazhin
  const messageStyle = {
    backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
    color: messageType === "success" ? "#155724" : "#721c24",
    border: messageType === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
    padding: "15px",  // Adjusted padding for more spacing
    borderRadius: "5px",
    marginTop: "20px",
    width: "100%",
    position: "fixed",
    top: "20px", // Set this to 20px to make sure it doesn't touch the top of the screen
    left: "0",
    zIndex: "1000",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Add a shadow for better visibility
  };

  // CSS for the close button
  const closeButtonStyle = {
    position: "absolute",
    top: "5px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    color: messageType === "success" ? "#155724" : "#721c24",
  };

  // Function to close the message
  const closeMessage = () => {
    setMessage(""); // Clear the message
  };

  return (
    <div className="row justify-content-center gx-5 py-4">
      {/* Mesazhi i suksesit ose gabimit */}
      {message && (
        <div style={messageStyle}>
          {message}
          <button onClick={closeMessage} style={closeButtonStyle}>X</button>
        </div>
      )}

      {/* PERSONAL INFO */}
      <div className="col-lg-4 mb-4">
        <div className="card shadow border-0 h-100">
          <div className="card-body">
            <h4 className="text-center fw-bold mb-4">Personal Information</h4>
            <form onSubmit={saveProgress}>
              {["weight", "waist", "chest", "arm", "thigh"].map(f => (
                <input
                  key={f}
                  type="number"
                  className="form-control form-control-lg mb-3"
                  placeholder={f.toUpperCase()}
                  value={progressData[f]}
                  onChange={e =>
                    setProgressData({ ...progressData, [f]: e.target.value })
                  }
                />
              ))}
              <button className="btn btn-dark btn-lg w-100">Save</button>
            </form>
          </div>
        </div>
      </div>

      {/* GOAL */}
      <div className="col-lg-4 mb-4">
        <div className="card shadow border-0 h-100">
          <div className="card-body text-center">
            <h4 className="fw-bold mb-4">Fitness Goal</h4>
            <form onSubmit={saveGoal}>
              <select
                className="form-control form-control-lg mb-3"
                value={goal.goalType}
                onChange={e => setGoal({ ...goal, goalType: e.target.value })}
              >
                <option value="GAIN_WEIGHT">Gain Weight</option>
                <option value="LOSE_WEIGHT">Lose Weight</option>
              </select>
              <input
                type="number"
                className="form-control form-control-lg mb-3"
                placeholder="Target weight"
                value={goal.targetValue}
                onChange={e =>
                  setGoal({ ...goal, targetValue: e.target.value })
                }
              />
              <button className="btn btn-dark btn-lg w-100"> Save Goal </button>
            </form>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="col-lg-4 mb-4">
        <div className="card shadow border-0 h-100 text-center">
          <div className="card-body">
            <h4 className="fw-bold mb-4">Your Progress</h4>
            <div style={{ width: 300, margin: "0 auto" }}>
              <CircularProgressbar
                value={progressPercent}
                text={`${Math.round(progressPercent)}%`}
                styles={buildStyles({
                  pathColor: "#000",
                  textColor: "#000",
                  trailColor: "#e0e0e0",
                })}
              />
            </div>
            <p className="mt-3 text-muted">
              {progressData.weight} kg → {currentWeight} kg → {goal.targetValue} kg
            </p>
          </div>
        </div>
      </div>

      {/* DAILY UPDATE */}
      <div className="col-lg-6 mt-3">
        <div className="card shadow border-0">
          <div className="card-body text-center">
            <h4 className="fw-bold mb-3">Daily Weight Update</h4>
            <form onSubmit={saveDailyWeight}>
              <input
                type="number"
                className="form-control form-control-lg mb-3"
                placeholder="Today's weight"
                value={currentWeight}
                onChange={e => setCurrentWeight(e.target.value)}
              />
              <button className="btn btn-dark btn-lg px-5">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
