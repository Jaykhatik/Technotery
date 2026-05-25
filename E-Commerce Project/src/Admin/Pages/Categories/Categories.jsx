import React, { useEffect, useState } from "react";
import "./Categories.css";
import { FiBell, FiPlus, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { addCat, getCategories, getCategoryRequests } from "../../../Services/Admin/AdminServices";
import { useNavigate } from "react-router-dom";

function Categories() {

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({
    name: "",
    description: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // ================= FETCH =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setNewCat({
      ...newCat,
      [e.target.name]: e.target.value
    });
  };

  // ================= ADD CATEGORY =================
  const handleAddCategory = async () => {
    if (!newCat.name || !newCat.description) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await addCat(newCat);
      setCategories((prev) => [...prev, response.category]);
      setNewCat({ name: "", description: "" });
      setShowForm(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await getCategoryRequests();
        console.log("PENDING API:", res); // 🔍 debug
        setPendingCount(res.total_pending || 0);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPending(); // ✅ ADD THIS LINE

    window.addEventListener("focus", fetchPending);

    return () => window.removeEventListener("focus", fetchPending);
  }, []);

  return (
    <div className="categories-page">

      {/* ===== TOPBAR ===== */}
      <div className="topbar">
        <h2>Categories</h2>

        <div className="topbar-actions">
          <div className="notification" onClick={() => navigate("/admin/requests")}>
            <FiBell />
            <span className="badge">{pendingCount}</span>
          </div>

          {/* ➕ Toggle Form */}
          <div
            className="add-category"
            onClick={() => setShowForm(!showForm)}
          >
            <FiPlus />
            <span>Add Category</span>
          </div>
        </div>
      </div>

      {/* ===== ADD FORM ===== */}
      {showForm && (
        <div className="add-form">
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={newCat.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newCat.description}
            onChange={handleChange}
          />

          <button onClick={handleAddCategory}>
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Description</th>
              {/* <th>Products</th> */}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat._id || index}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                {/* <td>120</td> */}
                <td>
                  <span className="status active">Active</span>
                </td>

                <td className="actions">
                  <FiEye className="action view" />
                  <FiEdit className="action edit" />
                  <FiTrash2 className="action delete" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Categories;