function ProductCard({ p, setSelectedProduct, setShowModal, setEditProduct, setFormData, handleDelete }) {
    return (
        <div className="product-card">
            <div className="image-box">
                <img src={p.image} alt={p.title} />
            </div>

            <div className="card-content">
                <h3 className="product-title">{p.title}</h3>

                <p className="category">
                    <span>Category:</span> {p.category}
                </p>

                <p className="price">₹ {p.price}</p>

                <div className="action-btns">
                    <button
                        type="button"
                        className="btn read"
                        onClick={() => setSelectedProduct(p)}
                    >
                        Read
                    </button>

                    <button
                        type="button"
                        className="btn edit"
                        onClick={() => {
                            setShowModal(true);
                            setEditProduct(p);
                            setFormData(p);
                        }}
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="btn delete"
                        onClick={() => handleDelete(p.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;