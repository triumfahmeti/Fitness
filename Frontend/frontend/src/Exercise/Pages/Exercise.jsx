import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./exercisestyle.module.css";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "https://localhost:7103/api";

const categoryMap = {
  0: "Chest",
  1: "Back",
  2: "Legs",
  3: "Arms",
  4: "Shoulders",
  5: "Core",
};

export default function Exercise() {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setsById, setSetsById] = useState({});
  const [repsById, setRepsById] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    confirmText: "OK",
    confirmClass: "btn-primary",
    onConfirm: null,
  });

  const openConfirmModal = ({
    title,
    message,
    confirmText = "OK",
    confirmClass = "btn-primary",
    onConfirm,
  }) => {
    setConfirmModal({
      show: true,
      title,
      message,
      confirmText,
      confirmClass,
      onConfirm,
    });
  };

  const handleAddToWorkout = async (exercise) => {
    const s = parseInt(setsById[exercise.exerciseId], 10);
    const r = parseInt(repsById[exercise.exerciseId], 10);

    if (!Number.isFinite(s) || s <= 0 || !Number.isFinite(r) || r <= 0) {
      openConfirmModal({
        title: "Invalid Input",
        message: "Please enter valid sets and reps (> 0)",
        confirmText: "OK",
        confirmClass: "btn-primary",
        onConfirm: () => setConfirmModal({ ...confirmModal, show: false }),
      });
      return;
    }
    try {
      if (!workoutId) {
        openConfirmModal({
          title: "No Workout Selected",
          message: "Create or open a workout first.",
          confirmText: "OK",
          confirmClass: "btn-warning",
          onConfirm: () => setConfirmModal({ ...confirmModal, show: false }),
        });
        return;
      }
      const response = await api.post(`${API_BASE}/WorkoutExercise`, {
        workoutId,
        exerciseId: exercise.exerciseId,
        sets: s,
        reps: r,
      });

      // Përditëso workout exercises për të larguar exercise nga lista
      setWorkoutExercises((prev) => [
        ...prev,
        { exerciseId: exercise.exerciseId, workoutId, sets: s, reps: r },
      ]);

      openConfirmModal({
        title: "Success",
        message: "Exercise added to workout ✅",
        confirmText: "OK",
        confirmClass: "btn-success",
        onConfirm: () => setConfirmModal({ ...confirmModal, show: false }),
      });
      setSetsById((prev) => ({ ...prev, [exercise.exerciseId]: "" }));
      setRepsById((prev) => ({ ...prev, [exercise.exerciseId]: "" }));
    } catch (e) {
      console.error(e);
      openConfirmModal({
        title: "Error",
        message: "Failed to add exercise to workout",
        confirmText: "OK",
        confirmClass: "btn-danger",
        onConfirm: () => setConfirmModal({ ...confirmModal, show: false }),
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const exercisesRes = await api.get(`${API_BASE}/Exercise`);
        setExercises(exercisesRes.data);

        // Nëse ka një workout të zgjedhur, ngarko exercises që janë tashmë në workout
        if (workoutId) {
          const workoutExercisesRes = await api.get(
            `${API_BASE}/WorkoutExercise/${workoutId}/exercises`
          );
          setWorkoutExercises(workoutExercisesRes.data);
        }
      } catch (err) {
        setError("Failed to load exercises");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [workoutId]);

  return (
    <div className={styles.exercisePage}>
      <div className="container px-2 px-sm-3 px-md-4 my-3">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="text-center">
              <h2 className="fw-semibold mb-2">Browse Exercises</h2>
              <p className="text-muted mb-4">
                Quick picks to add to your workouts.
              </p>
            </div>
          </div>
        </div>

        {loading && <p className="text-center m-0">Loading exercises...</p>}
        {error && <p className="text-danger text-center m-0">{error}</p>}

        <div className={`row ${styles.gridGap}`}>
          {exercises
            .filter(
              (ex) =>
                !workoutExercises.some((we) => we.exerciseId === ex.exerciseId)
            )
            .map((x) => (
              <div
                key={x.exerciseId}
                className="col-6 col-sm-4 col-md-3 col-lg-3 mb-3"
              >
                <div
                  className={`card shadow-sm border-0 position-relative ${styles.cardCompact}`}
                  role="button"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/user/exercises/detail/${x.exerciseId}`)
                  }
                >
                  <img
                    className={styles.thumb}
                    src={
                      x.imageUrl && x.imageUrl.startsWith("http")
                        ? x.imageUrl
                        : x.imageUrl
                        ? `https://localhost:7103${x.imageUrl}`
                        : "https://via.placeholder.com/320x180?text=Exercise"
                    }
                    alt={x.name}
                  />
                  <div className={styles.cardBody}>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <h6 className={styles.title}>{x.name}</h6>
                    </div>
                    <div className={styles.meta}>
                      {categoryMap[x.category] ?? "Uncategorized"}
                    </div>
                    {x.description && (
                      <div
                        className="mt-1 text-muted"
                        style={{ fontSize: "0.82rem" }}
                      >
                        {x.description.length > 80
                          ? `${x.description.slice(0, 80)}...`
                          : x.description}
                      </div>
                    )}
                    <div className="mt-2">
                      <div className="row g-2">
                        <div className="col-6">
                          <input
                            type="number"
                            min={1}
                            className="form-control form-control-sm"
                            placeholder="Sets"
                            value={setsById[x.exerciseId] ?? ""}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setSetsById({
                                ...setsById,
                                [x.exerciseId]: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="number"
                            min={1}
                            className="form-control form-control-sm"
                            placeholder="Reps"
                            value={repsById[x.exerciseId] ?? ""}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setRepsById({
                                ...repsById,
                                [x.exerciseId]: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <button
                        className="btn btn-sm btn-primary w-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWorkout(x);
                        }}
                      >
                        Add to Workout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {confirmModal.show && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{confirmModal.title}</h5>
                  <button
                    className="btn-close"
                    onClick={() =>
                      setConfirmModal({ ...confirmModal, show: false })
                    }
                  />
                </div>

                <div className="modal-body">
                  <p>{confirmModal.message}</p>
                </div>

                <div className="modal-footer">
                  <button
                    className={`btn ${confirmModal.confirmClass}`}
                    onClick={confirmModal.onConfirm}
                  >
                    {confirmModal.confirmText}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
