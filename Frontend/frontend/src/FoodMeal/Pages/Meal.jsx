import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./mealstyle.module.css";

const API_BASE = "https://localhost:7103/api";

function Meal() {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealFoods, setMealFoods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFoodValues, setShowFoodValues] = useState(false);

  const [mealTotals, setMealTotals] = useState({
  calories: 0,
  proteins: 0,
  carbs: 0,
  fats: 0
});


  useEffect(() => {
    axios
      .get(`${API_BASE}/Meal`)
      .then((res) => setMeals(res.data))
      .catch((err) => console.error("Failed to load meals", err));
  }, []);

  useEffect(() => {
  console.log("MEAL FOODS:", mealFoods);
}, [mealFoods]);

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
    const res = await axios.get(
      `${API_BASE}/MealFood/byMeal/${meal.mealId}`
    );

    setMealFoods(res.data);

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
                 Healthy meals are the foundation of a strong body <br></br> and a sharp mind.
                 Fuel your body, nourish your soul!
                </p>
                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                  <a className="btn btn-primary btn-lg px-4 me-sm-3" href="#features">
                    Get Started
                  </a>

                </div>
              </div>
            </div>
            <div className="col-xl-5 col-xxl-6 d-none d-xl-block text-center">
              <img src="https://kaynutrition.com/wp-content/uploads/2018/11/balanced-meal-ideas-3.jpg" alt="Meal" className="meal-image" />
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
                    Calories are the primary source of energy for our body. They fuel our daily activities and bodily functions.
                  </p>
                </div>

                <div className="col mb-5 h-100">
                  
                  <h2 className="h5">Proteins</h2>
                  <p className="mb-0">
                   Proteins help build and repair muscles, support immune function, and keep you feeling full and satisfied.
                  </p>
                </div>

                <div className="col mb-5 mb-md-0 h-100">
                  
                  <h2 className="h5">Carbs</h2>
                  <p className="mb-0">
                    Carbs are a quick source of energy for daily activities and exercise, fueling your body effectively.
                  </p>
                </div>

                <div className="col h-100">
                
                  <h2 className="h5">Fats</h2>
                  <p className="mb-0">
                    Fats provide long-lasting energy and help regulate body functions.
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
                  <div className="card-body">
                    <h5 className="card-title">{meal.mealName}</h5>
                    <p className="card-text small">
                      <strong>Calories:</strong>{" "}
                      {(selectedMeal?.mealId === meal.mealId
                        ? mealTotals.calories
                        : meal.totalCalories
                      ).toFixed(1)} kcal
                      <br />

                      <strong>Protein:</strong>{" "}
                      {(selectedMeal?.mealId === meal.mealId
                        ? mealTotals.proteins
                        : meal.totalProteins
                      ).toFixed(1)} g
                      <br />

                      <strong>Carbs:</strong>{" "}
                      {(selectedMeal?.mealId === meal.mealId
                        ? mealTotals.carbs
                        : meal.totalCarbs
                      ).toFixed(1)} g
                      <br />

                      <strong>Fats:</strong>{" "}
                      {(selectedMeal?.mealId === meal.mealId
                        ? mealTotals.fats
                        : meal.totalFats
                      ).toFixed(1)} g
                    </p>

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
                 {mealFoods.length > 0 && (() => {
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
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>{mf.foodName}</strong>
                            <br />
                            {mf.quantityGrams} g
                          </div>

                          <div className="text-end small">
                            {mf.calories} kcal
                            <br />
                            P: {mf.proteins} g | C: {mf.carbs} g | F:{" "}
                            {mf.fats} g
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




     

      {/* Component-specific scripts should be managed at app-level; removed inline script */}
    </div>
  );
}

export default Meal;
