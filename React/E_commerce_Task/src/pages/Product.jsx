import React, { useEffect } from 'react'
import '../styles/product.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/features/productSlice';
import { addToCart } from '../redux/features/cartSlice';
import {useAuth} from '../context/AuthContext';


function Product() {

    const dispatch = useDispatch();
    const { user } = useAuth();

    // ✅ get data from redux instead of useState
    const { data: product, loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts()); // ✅ API call via redux
    }, [dispatch]);

    // ✅ FIXED FUNCTION (ONLY CHANGE)
    const addToCartHandler = (product) => {
        if (!user) {
            alert("Please login first");
            return;
        }

        // ✅ dispatch instead of sessionStorage logic
        dispatch(
            addToCart({
                productId: product.id,
                userId: user.id,
            })
        );

        alert("Added to cart ✅");
    };

    // optional loading UI
    if (loading) return <h2>Loading...</h2>;

    return (
        <>
            <div className="products-container">
                {product.map((pro) => (
                    <div className="product" key={pro.id}>

                        <div className="product-header">
                            <h1>{pro.title}</h1>
                        </div>

                        <div className="product-body">
                            <img src={pro.image} alt={pro.title} />

                            <div className="product-body-content">
                                <h4>Cate : {pro.category}</h4>
                                <h4> ${pro.price}</h4>
                                <p>{pro.description}</p>
                            </div>
                        </div>

                        <div className="product-footer">
                            <div className="action-buttons">
                                <button>Edit</button>
                                <button>Delete</button>
                                <button>Read</button>
                                <button onClick={() => addToCartHandler(pro)}>AddToCart</button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </>
    )
}

export default Product;