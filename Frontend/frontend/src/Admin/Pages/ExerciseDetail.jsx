import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const API_BASE = "https://localhost:7103/api";

export default function ExerciseDetail() {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Helper to present category as a readable name
  const getCategoryLabel = (ex) => {
    const cat = ex?.category;
    // Prefer a provided name if available
    if (typeof ex?.categoryName === "string" && ex.categoryName.trim().length)
      return ex.categoryName;
    // If backend sends numeric enum, map common values; fallback to number
    const MAP = {
      0: "Chest",
      1: "Back",
      2: "Legs",
      3: "Arms",
      4: "Shoulders",
      5: "Core",
    };
    if (typeof cat === "number") return MAP[cat] ?? `Kategoria ${cat}`;
    if (typeof cat === "string") return cat;
    return "N/A";
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`${API_BASE}/Exercise/${id}`);
        setExercise(res.data);
      } catch (err) {
        setError(err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="container py-3">Loading...</div>;
  if (error)
    return (
      <div className="container py-3">
        <div className="alert alert-danger">{String(error)}</div>
      </div>
    );
  if (!exercise)
    return (
      <div className="container py-3">
        <div className="alert alert-warning">Not found</div>
      </div>
    );

  // Build absolute media URLs when backend returns relative (e.g., /images/abc.jpg, /videos/xyz.mp4)
  const API_ORIGIN = API_BASE.replace(/\/(api)$/i, "");
  const imageSrc = exercise.imageUrl
    ? exercise.imageUrl.startsWith("http")
      ? exercise.imageUrl
      : `${API_ORIGIN}${
          exercise.imageUrl.startsWith("/")
            ? exercise.imageUrl
            : "/" + exercise.imageUrl
        }`
    : null;
  const videoSrc = exercise.videoUrl
    ? exercise.videoUrl.startsWith("http")
      ? exercise.videoUrl
      : `${API_ORIGIN}${
          exercise.videoUrl.startsWith("/")
            ? exercise.videoUrl
            : "/" + exercise.videoUrl
        }`
    : null;

  return (
    <div className="bg-light">
      <div className="container py-5">
        <div className="row">
          <div className="col-12 mb-4">
            <div className="d-flex justify-content-between align-items-start">
              <div className="text-center w-100">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={exercise.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="shadow"
                    style={{
                      maxWidth: 220,
                      maxHeight: 220,
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: 16,
                    }}
                  />
                ) : (
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow"
                    style={{ width: 120, height: 120 }}
                  >
                    <i className="fa-solid fa-dumbbell fa-3x text-secondary"></i>
                  </div>
                )}
                {/* Name and category under image */}
                <h3 className="mt-3 mb-1">{exercise.name}</h3>
                <p className="text-muted mb-0">{getCategoryLabel(exercise)}</p>
              </div>
            </div>
          </div>

          {/* Video */}
          {videoSrc && (
            <div className="col-12 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <video
                    controls
                    className="w-100"
                    style={{
                      borderRadius: 12,
                      maxWidth: 800,
                      width: "100%",
                      height: "auto",
                      display: "block",
                      margin: "0 auto",
                    }}
                  >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-3">Exercise Description</h5>
                {exercise.description ? (
                  <p className="mb-0">{exercise.description}</p>
                ) : (
                  <p className="text-muted mb-0">No description.</p>
                )}
              </div>
            </div>
          </div>

          {/* No actions requested */}
        </div>
      </div>
    </div>
  );
}
