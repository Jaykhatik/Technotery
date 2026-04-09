import React, { useState, useContext, useEffect } from 'react'
import { FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
// import { CartContext } from '../../Contexts/CartContext'
import './Product.css'
import axios from 'axios'

function Product() {
  const [wishlist, setWishlist] = useState({})
  const navigate = useNavigate()

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    axios.get("http://192.168.0.3:8000/api/user/products")
      .then((res) => {
        const data = res.data.data
        // console.log(data)
        setProducts(data)
        setFilteredProducts(data)

        // ✅ Extract unique categories
        const uniqueCategories = ["All", ...new Set(data.map(p => p.category))]
        setCategories(uniqueCategories)
      })
      .catch((err) => console.log(err))
  }, [])

  // ✅ Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)

    if (category === "All") {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(p => p.category === category)
      setFilteredProducts(filtered)
    }
  }

  const handleViewDetail = (item) => {
    navigate(`/product/${item.uuid}`, { state: { product: item } })
  }

  return (
    <>
      <div className="category-filter">
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {
            categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))
          }
        </select>
      </div>
      <div className="products-container">
        {
          filteredProducts.map((item) => (
            <div className="product-card" key={item.uuid}>
              <div className="product-image-container">
                <button
                  className={`wishlist-btn ${wishlist[item.uuid] ? 'active' : ''}`}
                  onClick={() =>
                    setWishlist(prev => ({
                      ...prev,
                      [item.uuid]: !prev[item.uuid]
                    }))
                  }
                >
                  <FaHeart size={20} />
                </button>
                {/* ✅ FIXED IMAGE */}
                <img
                  src={`http://192.168.0.3:8000${item.images?.[0]?.url || ""}`}
                  alt={item.name}
                  className="product-image"
                />
                <div className="product-overlay"></div>
              </div>

              <div className="product-info">
                <div className="product-rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating-count">(48 reviews)</span>
                </div>

                <h3 className="product-name">{item.name}</h3>

                <div className="product-pricing">
                  <p className="product-price">₹{item.price}</p>
                  <p className="product-installment">
                    or 5x of ₹{(item.price / 5).toFixed(2)} interest-free
                  </p>
                </div>

                <button className="product-button" onClick={() => handleViewDetail(item)}>
                  <span className="button-icon">👁️</span>
                  View Detail
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default Product