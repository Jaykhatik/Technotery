import React, { useState, useContext, useEffect } from 'react'
import { FaHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { CartContext } from '../../Contexts/CartContext'
import './ProductDetail.css'
import axios from 'axios'

function ProductDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { uuid } = useParams()

  const [product, setProduct] = useState(location.state?.product || null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const { addToCart } = useContext(CartContext)

  // ✅ Fetch product if page refreshed
  useEffect(() => {
    if (!product) {
      axios.get("http://192.168.0.3:8000/api/user/products")
        .then((res) => {
          const data = res.data.data
          const foundProduct = data.find(p => p.uuid === uuid)
          setProduct(foundProduct)

          // set default image
          const primary = foundProduct?.images?.find(img => img.is_primary)
          setSelectedImage(primary?.url)
        })
        .catch((err) => console.log(err))
    } else {
      const primary = product?.images?.find(img => img.is_primary)
      setSelectedImage(primary?.url)
    }
  }, [uuid, product])

  // ✅ Loading state
  if (!product) {
    return <h2 style={{ textAlign: "center" }}>Loading product...</h2>
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const incrementQuantity = () => setQuantity(quantity + 1)
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  return (
    <div className="product-detail-container">
      
      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate('/product')}>
        <FaArrowLeft size={20} />
        Back to Products
      </button>

      <div className="detail-content">

        {/* IMAGE SECTION */}
        <div className="detail-image-section">
          <div className="image-container">
            <button
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <FaHeart size={24} />
            </button>

            {/* MAIN IMAGE */}
            <img
              src={`http://192.168.0.3:8000${selectedImage}`}
              alt={product.name}
              className="detail-image"
            />
          </div>

          {/* THUMBNAILS */}
          <div className="thumbnail-container">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={`http://192.168.0.3:8000${img.url}`}
                 className={`thumbnail ${selectedImage === img.url ? "active" : ""}`}
                onClick={() => setSelectedImage(img.url)}
                alt="thumb"
              />
            ))}
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="detail-info-section">
          <h1 className="detail-title">{product.name}</h1>

          <div className="detail-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-count">(48 reviews)</span>
          </div>

          <div className="detail-pricing">
            <div className="price-box">
              <p className="label">Price</p>
              <p className="price">₹{product.price}</p>
            </div>

            <div className="installment-box">
              <p className="label">Installment</p>
              <p className="installment">
                5x of ₹{(product.price / 5).toFixed(2)} interest-free
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* BASIC DETAILS */}
          <div className="detail-specs">
            <h3>Details</h3>
            <ul>
              <li><strong>Category:</strong> {product.category}</li>
              <li><strong>Seller:</strong> {product.seller}</li>
              <li><strong>Stock:</strong> {product.stock}</li>
              <li><strong>Created:</strong> {product.created_at}</li>
            </ul>
          </div>

          {/* CART SECTION */}
          <div className="cart-section">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={decrementQuantity} className="qty-btn">−</button>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="qty-input"
                />

                <button onClick={incrementQuantity} className="qty-btn">+</button>
              </div>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <FaShoppingCart size={20} />
              {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
            </button>
          </div>

          <div className="shipping-info">
            <p>✓ Free Shipping</p>
            <p>✓ 30-day money-back guarantee</p>
            <p>✓ Secure checkout</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductDetail