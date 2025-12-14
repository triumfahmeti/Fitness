import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import styles from "./mealstyle.module.css";



const API_BASE = "https://localhost:7103/api";

function Food() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grams, setGrams] = useState({});
  const mealId = 1; // ⚠️ për test, më vonë e merr dinamikisht

  const handleAddToMeal = async (food) => {
  const g = grams[food.foodId];

  if (!g || g <= 0) {
    alert("Please enter grams");
    return;
  }

  const calories = (food.caloriesPer100g * g) / 100;
  const proteins = (food.proteinPer100g * g) / 100;
  const carbs = (food.carbsPer100g * g) / 100;
  const fats = (food.fatPer100g * g) / 100;

  const payload = {
    mealId: mealId,
    foodId: food.foodId,
    quantityGrams: g,
    calories,
    proteins,
    carbs,
    fats
  };

  try {
    await axios.post(`${API_BASE}/MealFood`, payload);
    alert("Food added to meal ✅");

    // reset grams për këtë food
    setGrams(prev => ({ ...prev, [food.foodId]: "" }));
  } catch (err) {
    console.error(err);
    alert("Failed to add food");
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
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container px-5">
          <a className="navbar-brand" href="index.html">
            Food
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="index.html">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="about.html">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="contact.html">
                  Contact
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="pricing.html">
                  Pricing
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="faq.html">
                  FAQ
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdownBlog"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Blog
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownBlog">
                  <li><a className="dropdown-item" href="blog-home.html">Blog Home</a></li>
                  <li><a className="dropdown-item" href="blog-post.html">Blog Post</a></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdownPortfolio"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Portfolio
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownPortfolio">
                  <li><a className="dropdown-item" href="portfolio-overview.html">Portfolio Overview</a></li>
                  <li><a className="dropdown-item" href="portfolio-item.html">Portfolio Item</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-dark py-5">
        <div className="container px-5">
          <div className="row gx-5 align-items-center justify-content-center">
            <div className="col-lg-8 col-xl-7 col-xxl-6">
              <div className="my-5 text-center text-xl-start">
                <h1 className="display-5 fw-bolder text-white mb-2">
                 Choose your food wisely!
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
    
      {/* Testimonial Section */}
           {/* CARDS SECTION */}
      <section>
        <div className="container px-5 my-5">

          <div className="row gx-5 justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <div className="text-center">
                <h2 className="fw-bolder">From our foods</h2>
                <p className="lead fw-normal text-muted mb-5">
                  Discover healthy foods and their nutritional values.
                </p>
              </div>
            </div>
          </div>

          {loading && <p className="text-center">Loading foods...</p>}
          {error && <p className="text-danger text-center">{error}</p>}

          <div className="row gx-5">
            {foods.map((food) => (
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


      {/* Footer */}
      <footer className="bg-dark py-4 mt-auto">
        <div className="container px-5">
          <div className="row align-items-center justify-content-between flex-column flex-sm-row">
            <div className="col-auto">
              <div className="small m-0 text-white">Copyright &copy; Your Website 2023</div>
            </div>
            <div className="col-auto">
              <a className="link-light small" href="#!">Privacy</a>
              <span className="text-white mx-1">&middot;</span>
              <a className="link-light small" href="#!">Terms</a>
              <span className="text-white mx-1">&middot;</span>
              <a className="link-light small" href="#!">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Component-specific scripts should be managed at app-level; removed inline script */}
    </div>
  );
}

export default Food;
