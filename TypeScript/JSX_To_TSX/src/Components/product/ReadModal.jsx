function ReadModal({ selectedProduct, setSelectedProduct }) {
    if (!selectedProduct) return null;

    return (
        <div
            className="modal-overlay"
            onClick={() => setSelectedProduct(null)}
        >
            <div
                className="modal-content modal-read"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{selectedProduct.title}</h2>

                <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "contain"
                    }}
                />

                <p><b>Category:</b> {selectedProduct.category}</p>
                <p><b>Price:</b> ₹ {selectedProduct.price}</p>
                <p><b>Description:</b> {selectedProduct.description}</p>

                <button
                    className="btn"
                    onClick={() => setSelectedProduct(null)}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default ReadModal;