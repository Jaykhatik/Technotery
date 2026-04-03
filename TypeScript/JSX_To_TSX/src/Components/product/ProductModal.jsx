function ProductModal({ showModal, setShowModal, editProduct, handleSubmit, formData, setFormData, setEditProduct }) {
    if (!showModal) return null;

    return (
        <div
            className="modal-overlay"
            onClick={() => {
                setShowModal(false);
                setEditProduct(null);
            }}
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{editProduct ? "Edit Product" : "Add Product"}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Image URL"
                        value={formData.image}
                        onChange={(e) =>
                            setFormData({ ...formData, image: e.target.value })
                        }
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                    />

                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                    />

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default ProductModal;