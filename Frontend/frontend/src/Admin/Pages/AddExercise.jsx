import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE = "https://localhost:7103/api";

function AddExercise() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    category: "",
    imageFile: null,
    imageUrl: null,
    videoFile: null,
    videoUrl: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setForm((prev) => ({
        ...prev,
        imageFile: files && files[0] ? files[0] : null,
      }));
    } else if (name === "videoFile") {
      setForm((prev) => ({
        ...prev,
        videoFile: files && files[0] ? files[0] : null,
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
      // Upload image if a new file is selected
      let imageUrl = form.imageUrl || null;
      if (form.imageFile) {
        const fd = new FormData();
        fd.append("file", form.imageFile);
        const up = await axios.post(
          `${API_BASE}/Files/upload?subfolder=images`,
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        // Upload endpoint returns plain string path (e.g., "/images/abc.png")
        imageUrl = typeof up.data === "string" ? up.data : null;
      }

      // Upload video if a new file is selected
      let videoUrl = form.videoUrl || null;
      if (form.videoFile) {
        const vfd = new FormData();
        vfd.append("file", form.videoFile);
        const vup = await axios.post(
          `${API_BASE}/Files/upload?subfolder=videos`,
          vfd,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        // Upload endpoint returns plain string path (e.g., "/videos/xyz.mp4")
        videoUrl = typeof vup.data === "string" ? vup.data : null;
      }

      const payload = {
        name: form.name,
        category: parseInt(form.category || 0, 10),
        imageUrl,
        videoUrl,
        description: form.description || null,
      };

      if (id) {
        await axios.put(`${API_BASE}/Exercise/${id}`, payload);
        setSuccess("Exercise updated successfully.");
      } else {
        await axios.post(`${API_BASE}/Exercise`, payload);
        setSuccess("Exercise added successfully.");
        setForm({
          name: "",
          category: "",
          imageFile: null,
          imageUrl: null,
          videoFile: null,
          videoUrl: "",
          description: "",
        });
      }
    } catch (err) {
      const msg = err.response?.data || err.message;
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/Exercise/${id}`);
        const ex = res.data;
        setForm({
          name: ex.name || "",
          category: String(ex.category ?? ""),
          imageFile: null,
          imageUrl: ex.imageUrl || null,
          videoFile: null,
          videoUrl: ex.videoUrl || "",
          description: ex.description || "",
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

  // Preview: new file -> object URL; else resolve existing image URL to absolute
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

  const videoPreviewSrc = form.videoFile
    ? URL.createObjectURL(form.videoFile)
    : form.videoUrl
    ? form.videoUrl.startsWith("http")
      ? form.videoUrl
      : `${apiOrigin}${
          form.videoUrl.startsWith("/") ? form.videoUrl : "/" + form.videoUrl
        }`
    : null;

  return (
    <div className="container py-4">
      <h3 className="mb-3">{id ? "Edit Exercise" : "Add Exercise"}</h3>

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
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>

                <option value="0">Chest</option>
                <option value="1">Back</option>
                <option value="2">Legs</option>
                <option value="3">Arms</option>
                <option value="4">Shoulders</option>
                <option value="5">Core</option>
              </select>
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

            <div className="col-md-6">
              <label className="form-label">Video </label>
              <input
                type="file"
                name="videoFile"
                accept="video/*"
                className="form-control"
                onChange={handleChange}
              />
              {videoPreviewSrc && (
                <div className="mt-2">
                  <video
                    src={videoPreviewSrc}
                    controls
                    style={{ maxWidth: 240, borderRadius: 8 }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows={4}
                value={form.description}
                onChange={handleChange}
              />
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

export default AddExercise;
