import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../FoodMeal/Pages/mealstyle.module.css";
import { useNavigate } from "react-router-dom";
import pexelsImage from "../../FoodMeal/assets/img/pexels-estudiopolaroid-3112004.jpg";

const API_BASE = "https://localhost:7103/api";

function WorkoutList() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFoodValues, setShowFoodValues] = useState(false);
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const CLIENT_ID = 2; // statik për momentin
  const [workoutImages, setWorkoutImages] = useState({});
  const [workoutCardTotals, setWorkoutCardTotals] = useState({}); // totals për çdo workout
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [editSets, setEditSets] = useState({});
  const [editReps, setEditReps] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    confirmClass: "btn-danger",
    onConfirm: null,
  });
  const openConfirmModal = ({
    title,
    message,
    confirmText = "Confirm",
    confirmClass = "btn-danger",
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

  const [workoutTotals, setWorkoutTotals] = useState({
    sets: 0,
    reps: 0,
  });

  const handleAddWorkout = async () => {
    if (!newWorkoutName.trim()) {
      alert("Workout name is required");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/Workout`, {
        clientId: CLIENT_ID,
        title: newWorkoutName,
      });

      // Shto workout-in e ri në lista pa reload
      setWorkouts((prev) => [...prev, res.data]);
      // Reset & close modal
      setNewWorkoutName("");
      setShowAddWorkoutModal(false);

      // Dërgo në faqen e ushtrimeve për ta mbushur workout-in
      navigate(`/user/exercises/workout/${res.data.workoutId}`);
    } catch (err) {
      console.error("Failed to add workout", err);
    }
  };

  const handleDeleteWorkout = async (workout) => {
    openConfirmModal({
      title: "Delete Workout",
      message: `Are you sure you want to delete "${workout.title}"?`,
      confirmText: "Delete Workout",
      confirmClass: "btn-danger",
      onConfirm: async () => {
        try {
          // Përdor `workoutToDelete.workoutId` për të fshirë
          await axios.delete(`${API_BASE}/Workout/${workout.workoutId}`);

          // Përdor `workoutId` për të filtruar dhe për të përditësuar listën
          setWorkouts((prev) =>
            prev.filter((w) => w.workoutId !== workout.workoutId)
          );

          // Mbyll modalin pas fshirjes
          setConfirmModal({ ...confirmModal, show: false });
          setShowDeleteModal(false); // Mbyll modalin
        } catch (err) {
          console.error("Error deleting workout", err);
        }
      },
    });
  };

  const handleUpdateWorkoutExercise = async (we) => {
    const sets = editSets[we.exerciseId];
    const reps = editReps[we.exerciseId];

    if (!sets || sets <= 0 || !reps || reps <= 0) {
      openConfirmModal({
        title: "Invalid Input",
        message: "Please enter a valid amount of sets and reps.",
        confirmText: "OK",
        confirmClass: "btn-primary",
        onConfirm: () => setConfirmModal({ ...confirmModal, show: false }),
      });

      return;
    }

    // llogarit vlerat e reja
    // const calories = (mf.calories / mf.quantityGrams) * grams;
    // const proteins = (mf.proteins / mf.quantityGrams) * grams;
    // const carbs = (mf.carbs / mf.quantityGrams) * grams;
    // const fats = (mf.fats / mf.quantityGrams) * grams;

    try {
      await axios.put(`${API_BASE}/WorkoutExercise`, {
        workoutId: we.workoutId,
        exerciseId: we.exerciseId,
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
      });

      // update UI
      const updatedExercises = workoutExercises.map((e) =>
        e.exerciseId === we.exerciseId
          ? { ...e, sets: parseInt(sets, 10), reps: parseInt(reps, 10) }
          : e
      );

      setWorkoutExercises(updatedExercises);
      setEditingExerciseId(null);
      // update totals
      setWorkoutTotals(calculateTotals(updatedExercises));
    } catch (err) {
      console.error("Failed to update exercises", err);
    }
  };

  const handleDeleteWorkoutExercise = (we) => {
    openConfirmModal({
      title: "Remove Exercise",
      message: `Remove ${we.exerciseName} from this workout?`,
      confirmText: "Remove",
      confirmClass: "btn-danger",
      onConfirm: async () => {
        await axios.delete(
          `${API_BASE}/WorkoutExercise/${we.workoutId}/exercises/${we.exerciseId}`
        );
        const updated = workoutExercises.filter(
          (e) => e.exerciseId !== we.exerciseId
        );
        setWorkoutExercises(updated);
        setWorkoutTotals(calculateTotals(updated));

        setConfirmModal({ ...confirmModal, show: false });
      },
    });
  };

  useEffect(() => {
    console.log("WORKOUT IMAGES:", workoutImages);
  }, [workoutImages]);

  useEffect(() => {
    if (!workoutImages || Object.keys(workoutImages).length === 0) return;
    const carousels = document.querySelectorAll(".carousel");

    carousels.forEach((carousel) => {
      // eslint-disable-next-line no-undef
      new window.bootstrap.Carousel(carousel, {
        interval: 800, // shpejt
        ride: "carousel",
        pause: false,
        touch: false,
      });
    });
  }, [workoutImages]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/Workout`)
      .then((res) => {
        console.log("WORKOUTS FROM API:", res.data);
        setWorkouts(res.data);
      })
      .catch((err) => console.error("Failed to load workouts", err));
  }, []);

  useEffect(() => {
    console.log("WORKOUT EXERCISES:", workoutExercises);
  }, [workoutExercises]);

  useEffect(() => {
    if (workouts.length === 0) return;
    const loadAllWorkoutImages = async () => {
      const images = {};
      const totals = {};

      await Promise.all(
        workouts.map(async (workout) => {
          try {
            const res = await axios.get(
              `${API_BASE}/WorkoutExercise/${workout.workoutId}/exercises`
            );

            images[workout.workoutId] = res.data
              .map((we) => we.imageUrl)
              .filter(Boolean)
              .sort(() => Math.random() - 0.5); // RANDOM

            // Llogarit totalet për këtë workout
            totals[workout.workoutId] = calculateTotals(res.data);
          } catch (err) {
            console.error("Failed to load images", err);
          }
        })
      );

      setWorkoutImages(images);
      setWorkoutCardTotals(totals);
    };

    loadAllWorkoutImages();
  }, [workouts]);

  const calculateTotals = (exercises) => {
    return exercises.reduce(
      (totals, item) => {
        totals.sets += Number(item.sets ?? item.Sets ?? 0);
        totals.reps += Number(item.reps ?? item.Reps ?? 0);

        return totals;
      },
      { sets: 0, reps: 0 }
    );
  };

  const handleWorkoutClick = async (workout) => {
    setSelectedWorkout(workout);

    try {
      const res = await axios.get(
        `${API_BASE}/WorkoutExercise/${workout.workoutId}/exercises`
      );

      setWorkoutExercises(res.data);

      // 👉 merr krejt fotot e foods
      const images = res.data.map((we) => we.imageUrl).filter(Boolean);

      setWorkoutImages((prev) => ({
        ...prev,
        [workout.workoutId]: images,
      }));

      const totals = calculateTotals(res.data);
      setWorkoutTotals(totals);

      setShowModal(true);
    } catch (err) {
      console.error("Failed to load workout exercises", err);
    }
  };

  return (
    <div className={`${styles.mealPage} d-flex flex-column h-100`}>
      {/* Navigation removed - `UserLayout` provides application navigation */}

      {/* Header */}
      <header className=" ">
        <div className="container  px-5">
          <div className="row gx-5 align-items-center justify-content-center">
            <div className="col-lg-8 col-xl-7 col-xxl-6">
              <div className="my-5 text-center text-xl-start">
                <h1 className="display-5 fw-bolder text-black mb-2">
                  My Workouts
                </h1>
                <p className="lead fw-normal text-black-50 mb-4">
                  What seems impossible today <br></br> Will one day become your
                  warmup!
                </p>
                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                  <button
                    className="btn btn-success btn-lg px-4 me-sm-3"
                    onClick={() => setShowAddWorkoutModal(true)}
                  >
                    + Add Workout
                  </button>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-xxl-6 d-none d-xl-block text-center">
              <img
                src={pexelsImage}
                alt="Workout"
                className="meal-image"
                style={{ borderRadius: "10px" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}

      {/* <div className="text-center my-5">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setShowExerciseValues(!showExerciseValues)}
        >
          {showExerciseValues ? "Hide Exercise Values" : "Show Exercise Values"}
        </button>
      </div> */}

      {/* <section className={`py-5 ${showExerciseValues ? "d-block" : "d-none"}`}>
        <div className="container px-5 my-1">
          <div className="row gx-5 align-items-center text-center">
            <div className="col-lg-4 mb-5 mb-lg-0 d-flex align-items-center justify-content-center">
              <img
                src="https://freshandgoodfood.com/cdn/shop/files/Sports.jpg?v=1760385605"
                alt="Food values"
                className="img-fluid rounded"
              />
            </div>

            <div className="col-lg-8">
              <div className="row gx-5 row-cols-1 row-cols-md-2">
                <div className="col mb-5 h-100">
                  <h2 className="h5">Calories</h2>
                  <p className="mb-0">
                    Calories are the primary source of energy for our body. They
                    fuel our daily activities and bodily functions.
                  </p>
                </div>

                <div className="col mb-5 h-100">
                  <h2 className="h5">Proteins</h2>
                  <p className="mb-0">
                    Proteins help build and repair muscles, support immune
                    function, and keep you feeling full and satisfied.
                  </p>
                </div>

                <div className="col mb-5 mb-md-0 h-100">
                  <h2 className="h5">Carbs</h2>
                  <p className="mb-0">
                    Carbs are a quick source of energy for daily activities and
                    exercise, fueling your body effectively.
                  </p>
                </div>

                <div className="col h-100">
                  <h2 className="h5">Fats</h2>
                  <p className="mb-0">
                    Fats provide long-lasting energy and help regulate body
                    functions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonial Section */}

      {/* Workout CARDS */}
      <section className="py-5">
        <div className="container px-5">
          <div className="row gx-5">
            {workouts.map((workout) => (
              <div className="col-lg-4 mb-4" key={workout.workoutId}>
                <div
                  className="card h-100 shadow border-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleWorkoutClick(workout)}
                >
                  {/* CAROUSEL / IMAGE */}
                  {workoutImages[workout.workoutId]?.length > 0 ? (
                    <div
                      onClick={(e) => e.stopPropagation()} // ❗ mos hap modal
                      id={`carousel-${workout.workoutId}`}
                      className="carousel slide "
                      data-bs-ride="carousel"
                      data-bs-interval="1000000" // 🔥 më shpejt
                      data-bs-pause="false" // 🔥 mos u ndal
                    >
                      <div className="carousel-inner">
                        {workoutImages[workout.workoutId].map((img, index) => (
                          <div
                            key={index}
                            className={`carousel-item ${
                              index === 0 ? "active" : ""
                            }`}
                          >
                            <img
                              src={
                                img.startsWith("http")
                                  ? img
                                  : `https://localhost:7103${img}`
                              }
                              className="d-block w-100"
                              style={{ height: "180px", objectFit: "cover" }}
                              alt="Food"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <img
                      src="https://via.placeholder.com/400x250?text=No+Exercises"
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                      alt="No food"
                    />
                  )}

                  {/* BODY */}
                  <div className="card-body">
                    <h5 className="card-title">
                      {workout.title ?? workout.workoutName}
                    </h5>
                    <p className="card-text small">
                      <strong>Sets:</strong>{" "}
                      {workoutCardTotals[workout.workoutId]?.sets || 0} <br />
                      <strong>Reps:</strong>{" "}
                      {workoutCardTotals[workout.workoutId]?.reps || 0} <br />
                    </p>
                  </div>

                  {/* BUTTON */}
                  <div className="p-3 d-flex gap-2">
                    {/* ADD Exercise */}
                    <button
                      className="btn btn-sm btn-success flex-fill"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/user/exercises/workout/${workout.workoutId}`
                        );
                      }}
                    >
                      + Add Exercise
                    </button>

                    {/* DELETE WORKOUT */}
                    <button
                      className="btn  btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setWorkoutToDelete(workout);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete Workout
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      {showModal && selectedWorkout && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Exercises in "
                    {selectedWorkout.title ?? selectedWorkout.workoutName}"
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  {workoutExercises.length > 0 &&
                    (() => {
                      const totals = calculateTotals(workoutExercises);
                      return (
                        <div className="alert alert-primary mb-4">
                          <strong>Total Sets and Reps</strong>
                          <br />
                          Sets: {totals.sets}
                          <br />
                          Reps: {totals.reps}
                          <br />
                        </div>
                      );
                    })()}

                  {workoutExercises.length === 0 ? (
                    <p className="text-muted">No exercises added yet.</p>
                  ) : (
                    <ul className="list-group">
                      {workoutExercises.map((we) => (
                        <li
                          key={`${we.workoutId}-${we.exerciseId}`}
                          className="list-group-item"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            {/* LEFT */}
                            <div>
                              <strong
                                style={{ cursor: "pointer", color: "#0d6efd" }}
                                onClick={() =>
                                  navigate(
                                    `/user/exercises/detail/${we.exerciseId}`
                                  )
                                }
                                onMouseEnter={(e) =>
                                  (e.target.style.textDecoration = "underline")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.textDecoration = "none")
                                }
                              >
                                {we.exerciseName}
                              </strong>

                              {editingExerciseId === we.exerciseId ? (
                                <div>
                                  <label className="small text-muted mt-2">
                                    Sets:
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    placeholder="Sets"
                                    value={
                                      editSets[we.exerciseId] ??
                                      we.sets ??
                                      we.Sets
                                    }
                                    onChange={(e) =>
                                      setEditSets({
                                        ...editSets,
                                        [we.exerciseId]: e.target.value,
                                      })
                                    }
                                  />
                                  <label className="small text-muted mt-2">
                                    Reps:
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    placeholder="Reps"
                                    value={
                                      editReps[we.exerciseId] ??
                                      we.reps ??
                                      we.Reps
                                    }
                                    onChange={(e) =>
                                      setEditReps({
                                        ...editReps,
                                        [we.exerciseId]: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              ) : (
                                <div className="small text-muted">
                                  {we.sets ?? we.Sets} sets |{" "}
                                  {we.reps ?? we.Reps} reps
                                </div>
                              )}
                            </div>

                            {/* RIGHT */}
                            <div className="text-end small">
                              {/* Empty for alignment */}
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="mt-2 d-flex gap-2">
                            {editingExerciseId === we.exerciseId ? (
                              <>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() =>
                                    handleUpdateWorkoutExercise(we)
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => setEditingExerciseId(null)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setEditingExerciseId(we.exerciseId);
                                    setEditSets({
                                      ...editSets,
                                      [we.exerciseId]: we.sets ?? we.Sets,
                                    });
                                    setEditReps({
                                      ...editReps,
                                      [we.exerciseId]: we.reps ?? we.Reps,
                                    });
                                  }}
                                >
                                  Edit
                                </button>

                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    handleDeleteWorkoutExercise(we)
                                  }
                                >
                                  Remove
                                </button>
                              </>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BACKDROP */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {showAddWorkoutModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Workout</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddWorkoutModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Workout Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Breakfast"
                      value={newWorkoutName}
                      onChange={(e) => setNewWorkoutName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAddWorkoutModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddWorkout}
                  >
                    Save Workout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {showDeleteModal && workoutToDelete && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Delete Workout</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteModal(false)} // Mbyll modalin
                />
              </div>

              <div className="modal-body">
                <p>
                  Are you sure you want to delete
                  <strong>
                    {" "}
                    "{workoutToDelete.title ??
                      workoutToDelete.workoutName}"{" "}
                  </strong>
                  ?
                </p>
                <p className="text-muted small">
                  All exercises inside this workout will also be removed.
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)} // Mbyll modalin
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWorkout(workoutToDelete); // Kërkon fshirjen e workout
                  }}
                >
                  Delete Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    className="btn btn-secondary"
                    onClick={() =>
                      setConfirmModal({ ...confirmModal, show: false })
                    }
                  >
                    Cancel
                  </button>

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

      {/* Component-specific scripts should be managed at app-level; removed inline script */}
    </div>
  );
}

export default WorkoutList;
