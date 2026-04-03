import { useEffect, useState } from "react";
import "./Product.css";
import ProductCard from "../../Components/product/ProductCard";
import SearchBar from "../../Components/product/SearchBar";
import CategoryFilter from "../../Components/product/CategoryFilter";
import ProductModal from "../../Components/product/ProductModal";
import ReadModal from "../../Components/product/ReadModal";
import DeleteConfirm from "../../Components/product/DeleteConfirm";
import Notification from "../../Components/product/Notification";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, deleteProduct, getProducts, updateProduct } from "../../Redux/Features/ProductSlice";

function Products() {
    // const [product, setProduct] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const dispatch = useDispatch();
    const { items: product, loading } = useSelector((state) => state.products);

    const [formData, setFormData] = useState({
        title: '',
        image: '',
        price: '',
        description: '',
        category: ''
    })
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editProduct) {
            dispatch(updateProduct({
                id: editProduct.id,
                ...formData
            }));
            showNotification('Product updated successfully! ✓', 'success');
        } else {
            const newProduct = {
                id: Date.now(),
                ...formData,
            };

            dispatch(addProduct(newProduct));
            showNotification('Product added successfully! ✓', 'success');
        }

        setFormData({
            title: '',
            image: '',
            price: '',
            description: '',
            category: ''
        });

        setEditProduct(null);
        setShowModal(false);
    };


    const handleDelete = (id) => {
        setProductToDelete(id);
        setShowDeleteConfirm(true);
    };

    // ✅ Confirm and execute delete
    const confirmDelete = () => {
        if (!productToDelete) return;

        dispatch(deleteProduct(productToDelete));

        showNotification('Product deleted successfully! ✓', 'delete');
        setShowDeleteConfirm(false);
        setProductToDelete(null);
    };

    // ✅ Get unique categories
    const uniqueCategories = [...new Set(product.map(p => p.category))];

    // ✅ Filter products by search and category
    const filteredProducts = product.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddBtn = () => {
        setShowModal(true);
        setEditProduct(null);
        setFormData({
            title: '',
            image: '',
            price: '',
            description: '',
            category: ''
        });
    };

    // Show notification toast
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="products-container">
            <h1 className="title">Products List</h1>

            {/*Search + Add Row */}
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleAddBtn={handleAddBtn}
            />

            {/*Category Filter */}
            <CategoryFilter
                uniqueCategories={uniqueCategories}
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
            />

            {/* models for add/edit */}
            <ProductModal
                showModal={showModal}
                setShowModal={setShowModal}
                editProduct={editProduct}
                handleSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                setEditProduct={setEditProduct}
            />

            <div className="product-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                        <ProductCard
                            key={p.id}
                            p={p}
                            setSelectedProduct={setSelectedProduct}
                            setShowModal={setShowModal}
                            setEditProduct={setEditProduct}
                            setFormData={setFormData}
                            handleDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="no-products">
                        <p>No products found</p>
                    </div>
                )}
            </div>
            {/* read model */}
            <ReadModal
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
            />

            {/* ✅ Delete Confirmation Modal */}
            <DeleteConfirm
                showDeleteConfirm={showDeleteConfirm}
                setShowDeleteConfirm={setShowDeleteConfirm}
                setProductToDelete={setProductToDelete}
                confirmDelete={confirmDelete}
            />

            {/* ✅ Notification Toast */}
            <Notification
                notification={notification}
            />
        </div>
    );
}

export default Products;