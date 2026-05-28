import { Product } from "@/types";
import { getAllProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import ProductManager from "./ProductManager";
import styles from "./products.module.css";

export default async function ProductsPage() {
  let products: Product[] | null = null;
  let categories: string[] = [];

  try {
    const data = await getAllProducts();
    if (data.success && Array.isArray(data.result)) {
      products = data.result;
    }
  } catch (error) {
    console.error("Error loading products in server component page:", error);
  }

  try {
    const categoryData = await getAllCategories();
    if (categoryData.success && Array.isArray(categoryData.result)) {
      categories = categoryData.result.map((item) => item.name);
    }
  } catch (error) {
    console.error("Error loading category list in server component page:", error);
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
        <ProductManager initialProducts={products} initialCategories={categories} />
      )}
    </main>
  );
}
