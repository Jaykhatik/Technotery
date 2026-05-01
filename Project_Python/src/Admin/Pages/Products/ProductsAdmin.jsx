import React from "react";
import "./ProductsAdmin.css";

const ProductsAdmin = () => {
  const products = [
    {
      id: "P001",
      name: "iPhone Air",
      price: "₹79999",
      seller: "Apple Store",
      stock: 15,
      category: "Electronics",
      created_at: "2026-04-07",
      description: "Latest slim iPhone model",
      images: [
        { is_primary: true, url: "/images/p1.webp" },
        { is_primary: false, url: "/images/p2.webp" },
      ],
    },
    {
      id: "P002",
      name: "Gaming Laptop",
      price: "₹120000",
      seller: "Asus",
      stock: 8,
      category: "Gaming",
      created_at: "2026-04-06",
      description: "High performance gaming laptop",
      images: [
        { is_primary: true, url: "/images/p3.webp" },
        { is_primary: false, url: "/images/p4.webp" },
      ],
    },
  ];

  return (
    <div className="products-container">
      {/* <h2>Products</h2> */}

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Primary Image</th>
              <th>Price</th>
              <th>Seller</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {products.map((item, index) => {
              const primaryImage = item.images.find(
                (img) => img.is_primary
              );

              return (
                <tr key={index}>
                  <td data-label="ID">{item.id}</td>

                  <td data-label="Name">{item.name}</td>

                  <td data-label="Image">
                    <img
                      src={primaryImage.url}
                      alt="product"
                      className="product-img"
                    />
                  </td>

                  <td data-label="Price">{item.price}</td>

                  <td data-label="Seller">{item.seller}</td>

                  <td data-label="Stock">{item.stock}</td>

                  <td data-label="Category">
                    <span className="product-category">
                      {item.category}
                    </span>
                  </td>

                  <td data-label="Created At" className="product-date">
                    {item.created_at}
                  </td>

                  <td data-label="Description" className="product-desc">
                    {item.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsAdmin;