function DeleteConfirm({
    showDeleteConfirm,
    setShowDeleteConfirm,
    setProductToDelete,
    confirmDelete
}) {
    if (!showDeleteConfirm) return null;

    return (
        <div
            className="modal-overlay"
            onClick={() => {
                setShowDeleteConfirm(false);
                setProductToDelete(null);
            }}
        >
            <div
                className="modal-content modal-delete-confirm"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="delete-icon">⚠️</div>

                <h2>Delete Product?</h2>

                <p>
                    Are you sure you want to delete this product? This action cannot be undone.
                </p>

                <div className="delete-actions">
                    <button
                        className="btn btn-cancel"
                        onClick={() => {
                            setShowDeleteConfirm(false);
                            setProductToDelete(null);
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn btn-delete-confirm"
                        onClick={confirmDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirm;