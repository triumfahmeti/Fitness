import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

function AddFood() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    caloriesPer100g: "",
    proteinPer100g: "",
    carbsPer100g: "",
    fatPer100g: "",
    imageFile: null,
    imageUrl: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_BASE = "https://localhost:7103/api";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setForm((prev) => ({
        ...prev,
        imageFile: files && files[0] ? files[0] : null,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      // 1) Upload image file (optional) to get URL
      let imageUrl = form.imageUrl || null;
      if (form.imageFile) {
        const fd = new FormData();
        fd.append("file", form.imageFile);
        const up = await api.post(
          "https://localhost:7103/api/Files/upload?subfolder=images",
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        // Backend returns a plain string path, not an object
        imageUrl = typeof up.data === "string" ? up.data : null;
      }

      // If ImageUrl is required in DB, block saving without it
      if (!imageUrl) {
        throw new Error(
          "Image is required. Please upload an image before saving."
        );
      }

      // 2) Create/Update Food with JSON payload
      const payload = {
        name: form.name,
        caloriesPer100g: parseFloat(form.caloriesPer100g || 0),
        proteinPer100g: parseFloat(form.proteinPer100g || 0),
        carbsPer100g: parseFloat(form.carbsPer100g || 0),
        fatPer100g: parseFloat(form.fatPer100g || 0),
        imageUrl,
      };
      if (id) {
        await api.put(`/api/Food/${id}`, payload);
        setSuccess("Food updated successfully.");
      } else {
        await api.post("/api/Food", payload);
        setSuccess("Food added successfully.");
        setForm({
          name: "",
          caloriesPer100g: "",
          proteinPer100g: "",
          carbsPer100g: "",
          fatPer100g: "",
          imageFile: null,
          imageUrl: null,
        });
      }
    } catch (err) {
      const msg = err.response?.data || err.message;
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  // Load existing food when editing
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(`${API_BASE}/Food/${id}`);
        const f = res.data;
        setForm({
          name: f.name || "",
          caloriesPer100g: String(f.caloriesPer100g ?? ""),
          proteinPer100g: String(f.proteinPer100g ?? ""),
          carbsPer100g: String(f.carbsPer100g ?? ""),
          fatPer100g: String(f.fatPer100g ?? ""),
          imageFile: null,
          imageUrl: f.imageUrl || null,
        });
      } catch (err) {
        const msg = err.response?.data || err.message;
        setError(typeof msg === "string" ? msg : JSON.stringify(msg));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Compute preview image source: new file takes precedence; else existing imageUrl
  const apiOrigin = API_BASE.replace(/\/(api)$/i, "");
  const previewSrc = form.imageFile
    ? URL.createObjectURL(form.imageFile)
    : form.imageUrl
    ? form.imageUrl.startsWith("http")
      ? form.imageUrl
      : `${apiOrigin}${
          form.imageUrl.startsWith("/") ? form.imageUrl : "/" + form.imageUrl
        }`
    : null;

  return (
    <div className="container py-4">
      <h3 className="mb-3">{id ? "Edit Food" : "Add Food"}</h3>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Calories per 100g</label>
              <input
                type="number"
                step="0.01"
                name="caloriesPer100g"
                className="form-control"
                value={form.caloriesPer100g}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Protein per 100g</label>
              <input
                type="number"
                step="0.01"
                name="proteinPer100g"
                className="form-control"
                value={form.proteinPer100g}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Carbs per 100g</label>
              <input
                type="number"
                step="0.01"
                name="carbsPer100g"
                className="form-control"
                value={form.carbsPer100g}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Fat per 100g</label>
              <input
                type="number"
                step="0.01"
                name="fatPer100g"
                className="form-control"
                value={form.fatPer100g}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Image</label>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                className="form-control"
                onChange={handleChange}
              />
              {previewSrc && (
                <div className="mt-2">
                  <img
                    src={previewSrc}
                    alt="Preview"
                    style={{ maxWidth: 240, borderRadius: 8 }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="card-footer bg-white d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? id
                ? "Updating..."
                : "Saving..."
              : id
              ? "Update"
              : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddFood;
