import { getAllProducts } from "@/services/productService";
import ProductManager from "./ProductManager";
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
        <ProductManager initialProducts={products} />
      )}
    </main>
  );
}
