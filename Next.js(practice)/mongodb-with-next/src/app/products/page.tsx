import { getAllProducts } from "@/services/productService";
import styles from "./products.module.css";

export default async function ProductsPage() {
  let products = null;
  try {
    const data = await getAllProducts();
    if (data.success && Array.isArray(data.result)) {
      products = data.result;
    }
  } catch (error) {
    console.error("Error loading products in server component page:", error);
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Exclusive Collection</h1>
        <p className={styles.subtitle}>
          Discover next-generation premium electronics and accessories, loaded in real-time from our secure cloud database.
        </p>
      </header>

      {products === null ? (
        <section className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Connection Error</h2>
          <p>We encountered an error connecting to the product catalog API. Please verify your server is running and try again.</p>
        </section>
      ) : (
        <section className={styles.grid} id="products-list">
          {products.length === 0 ? (
            <article className={styles.noProducts}>
              <p>No products found in the catalog. Try adding some documents to your collection using the MongoDB Playground!</p>
            </article>
          ) : (
            products.map((product: any) => (
              <article key={product._id} className={styles.card} id={`product-${product._id}`}>
                <div>
                  <div className={styles.category}>{product.category || "General"}</div>
                  <h2 className={styles.productName}>{product.name}</h2>
                  <div className={styles.specs}>
                    <span className={`${styles.badge} ${styles.badgeCompany}`}>
                      {product.company}
                    </span>
                    <span className={styles.badge}>
                      Color: {product.color}
                    </span>
                  </div>
                </div>

                <div className={styles.footer}>
                  <div className={styles.priceContainer}>
                    <span className={styles.priceLabel}>Price</span>
                    <span className={styles.price}>
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button className={styles.actionButton}>Buy Now</button>
                </div>
              </article>
            ))
          )}
        </section>
      )}
    </main>
  );
}
