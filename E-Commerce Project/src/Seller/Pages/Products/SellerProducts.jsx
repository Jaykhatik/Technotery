import React, { useEffect, useState } from "react";
import "./SellerProducts.css";
import {
  addProductSeller,
  getAllProducts,
  getSellerRequests
} from "../../../Services/Seller/SellerServices";
import { getCategories } from "../../../Services/Admin/AdminServices";
import { useNavigate } from "react-router-dom";

function SellerProducts() {

  const [products, setProducts] = useState([]);
  const [expandedSpecs, setExpandedSpecs] = useState({});
  const [showForm, setShowForm] = useState(false);

  const [approvedCategories, setApprovedCategories] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    specifications: [{ key: "", value: "" }],
    images: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchApprovedCategories();
  }, []);

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ FETCH APPROVED CATEGORIES
  const fetchApprovedCategories = async () => {
    try {
      const catRes = await getCategories();
      const reqRes = await getSellerRequests();

      const statusMap = {};
      reqRes.requests.forEach(req => {
        statusMap[req.category_uuid] = req.status;
      });

      const approved = catRes.categories.filter(
        cat => statusMap[cat.uuid] === "approved"
      );

      setApprovedCategories(approved);

    } catch (err) {
      console.log("Approved category error:", err);
    }
  };

  // ✅ ADD PRODUCT
  const handleAddProduct = async () => {

    if (!newProduct.category) {
      alert("Please select approved category ❗");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("category_uuid", newProduct.category);

      formData.append(
        "specifications",
        JSON.stringify(newProduct.specifications)
      );

      for (let i = 0; i < newProduct.images.length; i++) {
        formData.append("images", newProduct.images[i]);
      }

      const res = await addProductSeller(formData);

      alert("Product Added ✅");

      setProducts(prev => [res.product, ...prev]);

      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        specifications: [{ key: "", value: "" }],
        images: []
      });

      setShowForm(false);

    } catch (err) {
      console.log(err);
      alert(err?.error || "Error adding product ❌");
    }
  };

  return (
    <div className="sellerProducts-container">

      {/* HEADER */}
      <div className="sellerProducts-header">
        <h2>My Products</h2>
        <button
          className="sellerProducts-addBtn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "+ Add Product"}
        </button>
      </div>

      {/* ADD PRODUCT FORM */}
      {showForm && (
        <div className="addProduct-box">
          <h3>Add Product</h3>

          <input
            value={newProduct.name}
            placeholder="Name"
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />

          {/* ✅ DYNAMIC CATEGORY DROPDOWN */}
          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          >
            <option value="">Select Category</option>

            {approvedCategories.length > 0 ? (
              approvedCategories.map(cat => (
                <option key={cat.uuid} value={cat.uuid}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option disabled>No Approved Categories</option>
            )}
          </select>

          <input
            value={newProduct.price}
            type="number"
            placeholder="Price"
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />

          <input
            value={newProduct.stock}
            type="number"
            placeholder="Stock"
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
          />

          <textarea
            value={newProduct.description}
            placeholder="Description"
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />

          {/* SPECIFICATIONS */}
          <h4>Specifications</h4>
          {newProduct.specifications.map((spec, index) => (
            <div key={index} className="spec-input">
              <input
                value={spec.key}
                placeholder="Key"
                onChange={(e) => {
                  const updated = [...newProduct.specifications];
                  updated[index].key = e.target.value;
                  setNewProduct({ ...newProduct, specifications: updated });
                }}
              />

              <input
                value={spec.value}
                placeholder="Value"
                onChange={(e) => {
                  const updated = [...newProduct.specifications];
                  updated[index].value = e.target.value;
                  setNewProduct({ ...newProduct, specifications: updated });
                }}
              />
            </div>
          ))}

          <button
            onClick={() =>
              setNewProduct({
                ...newProduct,
                specifications: [
                  ...newProduct.specifications,
                  { key: "", value: "" }
                ]
              })
            }
          >
            + Add Spec
          </button>

          {/* IMAGE */}
          <input
            type="file"
            multiple
            onChange={(e) =>
              setNewProduct({ ...newProduct, images: e.target.files })
            }
          />

          {/* PREVIEW */}
          {newProduct.images && newProduct.images.length > 0 && (
            <div className="preview">
              {Array.from(newProduct.images).map((img, i) => (
                <img key={i} src={URL.createObjectURL(img)} alt="preview" />
              ))}
            </div>
          )}

          <button
            className="submit-btn"
            onClick={handleAddProduct}
            disabled={approvedCategories.length === 0}
          >
            Submit Product
          </button>
        </div>
      )}

      {/* PRODUCT LIST */}
      {products.length === 0 ? (
        <div className="sellerProducts-empty">
          <p>No products found 🚫</p>
        </div>
      ) : (
        <div className="sellerProducts-grid">
          {products.map((product) => (
            <div className="sellerProducts-card" key={product.uuid}>

              <div className="sellerProducts-imageBox">
                <img
                  src={
                    product.primary_image
                      ? `http://192.168.0.3:8000${product.primary_image}`
                      : "https://dummyimage.com/300x300/cccccc/000000&text=No+Image"
                  }
                  alt={product.name}
                />
              </div>

              <div className="sellerProducts-details">
                <h3>{product.name}</h3>
                <p className="sellerProducts-price">₹{product.price}</p>
                <p className="sellerProducts-category">{product.category}</p>

                <span className={`sellerProducts-status ${product.stock > 0 ? "inStock" : "outStock"}`}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerProducts;