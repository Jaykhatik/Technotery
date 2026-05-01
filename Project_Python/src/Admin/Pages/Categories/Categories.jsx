import React, { useEffect, useState } from "react";
import "./Categories.css";

import {
  FiBell,
  FiPlus,
  FiEye,
  FiEdit,
  FiTrash2
} from "react-icons/fi";
import axios from "axios";

function Categories() {
  const [categories, setCategories] = useState([])
  useEffect(() => {
    axios.get("http://192.168.0.3:8000/api/admin/categories")
      // .then((res) => console.log(res.data.categories))
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.log(err));
  }, [])
  return (
    <div className="categories-page">

      {/* ===== TOPBAR ===== */}
      <div className="topbar">
        <h2> </h2>

        <div className="topbar-actions">
          <div className="notification">
            <FiBell />
            <span className="badge">3</span>
          </div>

          {/* ➕ Add Category */}
          <div className="add-category">
            <FiPlus />
            <span>Add Category</span>
          </div>

        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Products</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {categories.map((cat, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>120</td>
                <td><span className="status active">Active</span></td>

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