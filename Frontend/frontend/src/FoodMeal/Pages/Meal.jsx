import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./mealstyle.module.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://localhost:7103/api";

function Meal() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealFoods, setMealFoods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFoodValues, setShowFoodValues] = useState(false);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [newMealName, setNewMealName] = useState("");
  const CLIENT_ID = 2; // statik për momentin
  const [mealImages, setMealImages] = useState({});
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [editGrams, setEditGrams] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mealToDelete, setMealToDelete] = useState(null);
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

  const [mealTotals, setMealTotals] = useState({
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
  });

  const handleAddMeal = async () => {
    if (!newMealName.trim()) {
      alert("Meal name is required");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/Meal`, {
        clientId: CLIENT_ID,
        mealName: newMealName,
        totalCalories: 0,
        totalProteins: 0,
        totalCarbs: 0,
        totalFats: 0,
      });

      // Shto meal-in e ri në lista pa reload
      setMeals((prev) => [...prev, res.data]);

      // Reset & close modal
      setNewMealName("");
      setShowAddMealModal(false);

      // Përdor navigate për t'u dërguar në faqen e ushqimeve për këtë meal
      navigate(`/user/food/${res.data.mealId}`);
    } catch (err) {
      console.error("Failed to add meal", err);
    }
  };

  const handleDeleteMeal = async (meal) => {
    openConfirmModal({
      title: "Delete Meal",
      message: `Are you sure you want to delete "${meal.mealName}"?`,
      confirmText: "Delete Meal",
      confirmClass: "btn-danger",
      onConfirm: async () => {
        try {
          // Përdor `mealToDelete.mealId` për të fshirë
          await axios.delete(`${API_BASE}/Meal/${meal.mealId}`);

          // Përdor `mealId` për të filtruar dhe për të përditësuar listën
          setMeals((prev) => prev.filter((m) => m.mealId !== meal.mealId));

          // Mbyll modalin pas fshirjes
          setConfirmModal({ ...confirmModal, show: false });
          setShowDeleteModal(false); // Mbyll modalin
        } catch (err) {
          console.error("Error deleting meal", err);
        }
      },
    });
  };

  const handleUpdateMealFood = async (mf) => {
    const grams = editGrams[mf.foodId];

    if (!grams || grams <= 0) {
      openConfirmModal({
        title: "Invalid Input",
        message: "Please enter a valid amount of grams.",
        confirmText: "OK",
        confirmClass: "btn-primary",
        onConfirm: () => setConfirmModal({ ...confirmModal, show: false }),
      });

      return;
    }

    // llogarit vlerat e reja
    const calories = (mf.calories / mf.quantityGrams) * grams;
    const proteins = (mf.proteins / mf.quantityGrams) * grams;
    const carbs = (mf.carbs / mf.quantityGrams) * grams;
    const fats = (mf.fats / mf.quantityGrams) * grams;

    try {
      await axios.put(`${API_BASE}/MealFood/${mf.mealId}/${mf.foodId}`, {
        quantityGrams: grams,
      });

      // update UI
      const updatedFoods = mealFoods.map((f) =>
        f.foodId === mf.foodId
          ? { ...f, quantityGrams: grams, calories, proteins, carbs, fats }
          : f
      );

      setMealFoods(updatedFoods);
      setEditingFoodId(null);

      // update totals
      setMealTotals(calculateTotals(updatedFoods));
    } catch (err) {
      console.error("Failed to update food", err);
    }
  };

  const handleDeleteMealFood = (mf) => {
    openConfirmModal({
      title: "Remove Food",
      message: `Remove ${mf.foodName} from this meal?`,
      confirmText: "Remove",
      confirmClass: "btn-danger",
      onConfirm: async () => {
        await axios.delete(`${API_BASE}/MealFood/${mf.mealId}/${mf.foodId}`);

        const updated = mealFoods.filter((f) => f.foodId !== mf.foodId);
        setMealFoods(updated);
        setMealTotals(calculateTotals(updated));

        setConfirmModal({ ...confirmModal, show: false });
      },
    });
  };

  useEffect(() => {
    console.log("MEAL IMAGES:", mealImages);
  }, [mealImages]);

  useEffect(() => {
    if (!mealImages || Object.keys(mealImages).length === 0) return;

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
  }, [mealImages]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/Meal`)
      .then((res) => setMeals(res.data))
      .catch((err) => console.error("Failed to load meals", err));
  }, []);

  useEffect(() => {
    console.log("MEAL FOODS:", mealFoods);
  }, [mealFoods]);

  useEffect(() => {
    if (meals.length === 0) return;

    const loadAllMealImages = async () => {
      const images = {};

      await Promise.all(
        meals.map(async (meal) => {
          try {
            const res = await axios.get(
              `${API_BASE}/MealFood/byMeal/${meal.mealId}`
            );

            images[meal.mealId] = res.data
              .map((mf) => mf.foodImageUrl)
              .filter(Boolean)
              .sort(() => Math.random() - 0.5); // RANDOM
          } catch (err) {
            console.error("Failed to load images", err);
          }
        })
      );

      setMealImages(images);
    };

    loadAllMealImages();
  }, [meals]);

  const calculateTotals = (foods) => {
    return foods.reduce(
      (totals, item) => {
        totals.calories += Number(item.calories ?? item.Calories ?? 0);
        totals.proteins += Number(item.proteins ?? item.Proteins ?? 0);
        totals.carbs += Number(item.carbs ?? item.Carbs ?? 0);
        totals.fats += Number(item.fats ?? item.Fats ?? 0);
        return totals;
      },
      { calories: 0, proteins: 0, carbs: 0, fats: 0 }
    );
  };

  const handleMealClick = async (meal) => {
    setSelectedMeal(meal);

    try {
      const res = await axios.get(`${API_BASE}/MealFood/byMeal/${meal.mealId}`);

      setMealFoods(res.data);

      // 👉 merr krejt fotot e foods
      const images = res.data.map((mf) => mf.foodImageUrl).filter(Boolean);

      setMealImages((prev) => ({
        ...prev,
        [meal.mealId]: images,
      }));

      const totals = calculateTotals(res.data);
      setMealTotals(totals);

      setShowModal(true);
    } catch (err) {
      console.error("Failed to load meal foods", err);
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
                  My Meals
                </h1>
                <p className="lead fw-normal text-black-50 mb-4">
                  Healthy meals are the foundation of a strong body <br></br>{" "}
                  and a sharp mind. Fuel your body, nourish your soul!
                </p>
                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                  <button
                    className="btn btn-success btn-lg px-4 me-sm-3"
                    onClick={() => setShowAddMealModal(true)}
                  >
                    + Add Meal
                  </button>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-xxl-6 d-none d-xl-block text-center">
              <img
                src="https://kaynutrition.com/wp-content/uploads/2018/11/balanced-meal-ideas-3.jpg"
                alt="Meal"
                className="meal-image"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}

      <div className="text-center my-5">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setShowFoodValues(!showFoodValues)}
        >
          {showFoodValues ? "Hide Food Values" : "Show Food Values"}
        </button>
      </div>

      <section className={`py-5 ${showFoodValues ? "d-block" : "d-none"}`}>
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
      </section>

      {/* Testimonial Section */}

      {/* MEAL CARDS */}
      <section className="py-5">
        <div className="container px-5">
          <div className="row gx-5">
            {meals.map((meal) => (
              <div className="col-lg-4 mb-4" key={meal.mealId}>
                <div
                  className="card h-100 shadow border-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleMealClick(meal)}
                >
                  {/* CAROUSEL / IMAGE */}
                  {mealImages[meal.mealId]?.length > 0 ? (
                    <div
                      onClick={(e) => e.stopPropagation()} // ❗ mos hap modal
                      id={`carousel-${meal.mealId}`}
                      className="carousel slide "
                      data-bs-ride="carousel"
                      data-bs-interval="1000000" // 🔥 më shpejt
                      data-bs-pause="false" // 🔥 mos u ndal
                    >
                      <div className="carousel-inner">
                        {mealImages[meal.mealId].map((img, index) => (
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
                      src="https://via.placeholder.com/400x250?text=No+Food"
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                      alt="No food"
                    />
                  )}

                  {/* BODY */}
                  <div className="card-body">
                    <h5 className="card-title">{meal.mealName}</h5>
                    <p className="card-text small">
                      <strong>Calories:</strong>{" "}
                      {(selectedMeal?.mealId === meal.mealId
                        ? mealTotals.calories
                        : meal.totalCalories
                      ).toFixed(1)}{" "}
                      kcal
                      <br />
                      <strong>Protein:</strong>{" "}
                      {(selectedMeal?.mealId === meal.mealId
                        ? mealTotals.proteins
                        : meal.totalProteins
                      ).toFixed(1)}{" "}
                      g
                      <br />
                      <strong>Carbs:</strong>{" "}
                      {(selectedMeal?.mealId === meal.mealId
                        ? mealTotals.carbs
                        : meal.totalCarbs
                      ).toFixed(1)}{" "}
                      g
                      <br />
                      <strong>Fats:</strong>{" "}
                      {(selectedMeal?.mealId === meal.mealId
                        ? mealTotals.fats
                        : meal.totalFats
                      ).toFixed(1)}{" "}
                      g
                    </p>
                  </div>

                  {/* BUTTON */}
                  <div className="p-3 d-flex gap-2">
                    {/* ADD FOOD */}
                    <button
                      className="btn btn-sm btn-success flex-fill"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/food/${meal.mealId}`);
                      }}
                    >
                      + Add Food
                    </button>

                    {/* DELETE MEAL */}
                    <button
                      className="btn  btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMealToDelete(meal);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete Meal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      {showModal && selectedMeal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Foods in "{selectedMeal.mealName}"
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  {mealFoods.length > 0 &&
                    (() => {
                      const totals = calculateTotals(mealFoods);
                      return (
                        <div className="alert alert-primary mb-4">
                          <strong>Total Nutritional Values</strong>
                          <br />
                          Calories: {totals.calories.toFixed(1)} kcal <br />
                          Proteins: {totals.proteins.toFixed(1)} g <br />
                          Carbs: {totals.carbs.toFixed(1)} g <br />
                          Fats: {totals.fats.toFixed(1)} g
                        </div>
                      );
                    })()}

                  {mealFoods.length === 0 ? (
                    <p className="text-muted">No foods added yet.</p>
                  ) : (
                    <ul className="list-group">
                      {mealFoods.map((mf) => (
                        <li
                          key={`${mf.mealId}-${mf.foodId}`}
                          className="list-group-item"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            {/* LEFT */}
                            <div>
                              <strong>{mf.foodName}</strong>

                              {editingFoodId === mf.foodId ? (
                                <input
                                  type="number"
                                  className="form-control mt-2"
                                  value={
                                    editGrams[mf.foodId] ?? mf.quantityGrams
                                  }
                                  onChange={(e) =>
                                    setEditGrams({
                                      ...editGrams,
                                      [mf.foodId]: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <div className="small text-muted">
                                  {mf.quantityGrams} g
                                </div>
                              )}
                            </div>

                            {/* RIGHT */}
                            <div className="text-end small">
                              {mf.calories.toFixed(1)} kcal <br />
                              P: {mf.proteins.toFixed(1)} g | C:{" "}
                              {mf.carbs.toFixed(1)} g | F: {mf.fats.toFixed(1)}{" "}
                              g
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="mt-2 d-flex gap-2">
                            {editingFoodId === mf.foodId ? (
                              <>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleUpdateMealFood(mf)}
                                >
                                  Save
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => setEditingFoodId(null)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setEditingFoodId(mf.foodId);
                                    setEditGrams({
                                      ...editGrams,
                                      [mf.foodId]: mf.quantityGrams,
                                    });
                                  }}
                                >
                                  Edit
                                </button>

                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteMealFood(mf)}
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

      {showAddMealModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Meal</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddMealModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Meal Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Breakfast"
                      value={newMealName}
                      onChange={(e) => setNewMealName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAddMealModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddMeal}>
                    Save Meal
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {showDeleteModal && mealToDelete && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Delete Meal</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteModal(false)} // Mbyll modalin
                />
              </div>

              <div className="modal-body">
                <p>
                  Are you sure you want to delete
                  <strong> "{mealToDelete.mealName}" </strong>?
                </p>
                <p className="text-muted small">
                  All foods inside this meal will also be removed.
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
                    handleDeleteMeal(mealToDelete); // Kërkon fshirjen e meal
                  }}
                >
                  Delete Meal
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

export default Meal;
