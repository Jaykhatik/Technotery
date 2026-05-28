import { Category } from "@/types";
import { getAllCategories } from "@/services/categoryService";
import styles from "./categories.module.css";
import CategoryManager from "./CategoryManager";

export default async function CategoriesPage() {
  let categories: Category[] = [];
  let fetchError = false;

  try {
    const data = await getAllCategories();
    if (data.success && Array.isArray(data.result)) {
      categories = data.result;
    }
  } catch (error) {
    console.error("Error loading categories in server component page:", error);
    fetchError = true;
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Categories</h1>
        <p className={styles.subtitle}>Create new categories and instantly see them in the product creation form.</p>
      </header>

      <CategoryManager initialCategories={categories} fetchError={fetchError} />
    </main>
  );
}
