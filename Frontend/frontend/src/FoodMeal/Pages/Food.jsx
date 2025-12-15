import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import styles from "./mealstyle.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CenterModal from "../../Admin/Components/CenterModal";

const API_BASE = "https://localhost:7103/api";

function Food() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grams, setGrams] = useState({});
  const { mealId } = useParams();
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
const filteredFoods = foods.filter(food =>
  food.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    confirmText: "",
    confirmClass: "",
    onConfirm: null
  });

  const [confirmModal, setConfirmModal] = useState({
  show: false,
  title: "",
  message: "",
  confirmText: "",
  confirmClass: "",
  onConfirm: null
});


  const openModal = ({ title, message, confirmText, confirmClass, onConfirm }) => {
  setModal({
    show: true,
    title,
    message,
    confirmText,
    confirmClass,
    onConfirm
  });
};

const closeModal = () => {
  setModal(prev => ({ ...prev, show: false }));
};



const handleAddToMeal = async (food) => {
  const g = grams[food.foodId];

  if (!g || g <= 0) {
    setConfirmModal({
      show: true,
      title: "Invalid input",
      message: "Please enter a valid amount of grams.",
      confirmText: "OK",
      confirmClass: "btn-primary",
      onConfirm: () =>
        setConfirmModal(prev => ({ ...prev, show: false }))
    });
    return;
  }

  try {
    await axios.post(`${API_BASE}/MealFood`, {
      mealId: Number(mealId),
      foodId: food.foodId,
      quantityGrams: g,
      calories: (food.caloriesPer100g * g) / 100,
      proteins: (food.proteinPer100g * g) / 100,
      carbs: (food.carbsPer100g * g) / 100,
      fats: (food.fatPer100g * g) / 100
    });

    setGrams(prev => ({ ...prev, [food.foodId]: "" }));

    setConfirmModal({
      show: true,
      title: "Success",
      message: "Food successfully added to meal ✔",
      confirmText: "OK",
      confirmClass: "btn-success",
      onConfirm: () =>
        setConfirmModal(prev => ({ ...prev, show: false }))
    });

  } catch {
    setConfirmModal({
      show: true,
      title: "Error",
      message: "Failed to add food to meal.",
      confirmText: "OK",
      confirmClass: "btn-danger",
      onConfirm: () =>
        setConfirmModal(prev => ({ ...prev, show: false }))
    });
  }
};





  useEffect(() => {
    const loadFoods = async () => {
      try {
        const res = await axios.get(`${API_BASE}/Food`);
        setFoods(res.data);
      } catch (err) {
        setError("Failed to load foods");
      } finally {
        setLoading(false);
      }
    };
    loadFoods();
  }, []);

  return (
    <div className={`${styles.mealPage} d-flex flex-column h-100`}>
  
     
      {/* Header */}


      {/* Features Section */}
    
      {/* Testimonial Section */}
           {/* CARDS SECTION */}
      <section>
        <div className="container px-5 ">

          <div className="row gx-5 justify-content-center  ">
            <div className="col-lg-8 col-xl-6  p-3">
              <div className="text-center ">
                <h2 className="fw-bolder">From our foods</h2>
                <p className="lead fw-normal text-muted ">
                  Discover healthy foods and their nutritional values.
                </p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mb-4 mt-4">
  <div className="col-lg-6">
    <div className="input-group input-group-lg shadow-sm">
      <span className="input-group-text bg-white">

      </span>
      <input
        type="text"
        className="form-control"
        placeholder="Search food..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  </div>
</div>


          {loading && <p className="text-center">Loading foods...</p>}
          {error && <p className="text-danger text-center">{error}</p>}
<button
  className="btn btn-outline-dark mb-3"
  onClick={() => navigate("/meals")}
>
  ← Back to Meals
</button>

          <div className="row gx-5">
            {filteredFoods.map((food) => (
              <div className="col-lg-4 mb-5" key={food.foodId}>
                <div className="card h-100 shadow border-0">

                  {/* IMAGE */}
                  <img
                    className="card-img-top"
                    src={
                      food.imageUrl.startsWith("http")
                        ? food.imageUrl
                        : `https://localhost:7103${food.imageUrl}`
                    }
                    alt={food.name}
                    style={{ height: "220px", objectFit: "cover" }}
                  />

                  {/* BODY */}
                  <div className="card-body p-4">
                    <div className="badge bg-primary bg-gradient rounded-pill mb-2">
                      Food
                    </div>

                    <h5 className="card-title mb-3">{food.name}</h5>

                    <p className="card-text mb-0">
                        <div className="mt-3">
                            {/* INPUT GRAMS */}
                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Enter grams"
                                value={grams[food.foodId] || ""}
                                onChange={(e) =>
                                setGrams({ ...grams, [food.foodId]: e.target.value })
                                }
                            />

                            {/* NUTRITION VALUES – SAME PLACE, ONLY NUMBERS CHANGE */}
                            <p className="card-text mb-0">
                                <strong>Calories:</strong>{" "}
                                {grams[food.foodId]
                                ? ((food.caloriesPer100g * grams[food.foodId]) / 100).toFixed(1)
                                : food.caloriesPer100g}{" "}
                                kcal
                                <br />

                                <strong>Protein:</strong>{" "}
                                {grams[food.foodId]
                                ? ((food.proteinPer100g * grams[food.foodId]) / 100).toFixed(1)
                                : food.proteinPer100g}{" "}
                                g
                                <br />

                                <strong>Carbs:</strong>{" "}
                                {grams[food.foodId]
                                ? ((food.carbsPer100g * grams[food.foodId]) / 100).toFixed(1)
                                : food.carbsPer100g}{" "}
                                g
                                <br />

                                <strong>Fat:</strong>{" "}
                                {grams[food.foodId]
                                ? ((food.fatPer100g * grams[food.foodId]) / 100).toFixed(1)
                                : food.fatPer100g}{" "}
                                g
                            </p>
                            </div>

                    </p>
                    <div className="card-footer p-4 pt-0 bg-transparent border-top-0 mt-4">
                        <button
                            className="btn btn-success w-100"
                            onClick={() => handleAddToMeal(food)}
                        >
                            Add to Meal
                        </button>
                    </div>

                  </div>

                  {/* FOOTER */}
                  <div className="card-footer p-4 pt-0 bg-transparent border-top-0">
                    <div className="text-muted small">
                      Nutritional values per 100g
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

   <CenterModal
  show={confirmModal.show}
  title={confirmModal.title}
  message={confirmModal.message}
  confirmText={confirmModal.confirmText}
  confirmClass={confirmModal.confirmClass}
  onConfirm={confirmModal.onConfirm}
  onClose={() =>
    setConfirmModal(prev => ({ ...prev, show: false }))
  }
/>





      

      {/* Component-specific scripts should be managed at app-level; removed inline script */}
    </div>
  );
}

export default Food;
