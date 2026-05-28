"use client";

import React, { useState } from "react";
import { Category } from "@/types";
import { createCategory } from "@/services/categoryService";
import Modal from "@/components/ui/Modal";
import styles from "./categories.module.css";

interface CategoryManagerProps {
  initialCategories: Category[];
  fetchError: boolean;
}

type CategoryFormData = {
  name: string;
  description: string;
};

export default function CategoryManager({ initialCategories, fetchError }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [formData, setFormData] = useState<CategoryFormData>({ name: "", description: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage("");
    setSuccessMessage("");
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Category name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await createCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      if (result.success && typeof result.result === "object") {
        const newCategory = result.result as Category;
        setCategories((prev) => [newCategory, ...prev.filter((cat) => cat.name.toLowerCase() !== newCategory.name.toLowerCase())]);
        setSuccessMessage(`Category "${newCategory.name}" created successfully.`);
        closeModal();
      } else {
        setErrorMessage("Failed to create category.");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to create category.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.managerContainer}>
      {fetchError && (
        <section className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Connection Error</h2>
          <p>Unable to load categories from the server. You can still create a new category manually.</p>
        </section>
      )}

      <div className={styles.managerHeader}>
        <div>
          <h2 className={styles.managerTitle}>Create Category</h2>
          <p className={styles.managerSubtitle}>Add a new category and it will become available in the product add form.</p>
        </div>
        <button type="button" className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          Add Category
        </button>
      </div>

      {successMessage && <p className={styles.formSuccess}>{successMessage}</p>}
      {errorMessage && <p className={styles.formError}>{errorMessage}</p>}

      <section className={styles.grid}>
        {categories.length === 0 ? (
          <article className={styles.noCategories}>
            <h2>No categories found</h2>
            <p>Once you create categories they will appear here and in the product dropdown.</p>
          </article>
        ) : (
          categories.map((cat, idx) => (
            <article key={cat._id ?? `${cat.name}-${idx}`} className={styles.card}>
              <div>
                <h3>{cat.name}</h3>
                {cat.description ? <p>{cat.description}</p> : <p>Products can be grouped under this category.</p>}
              </div>
            </article>
          ))
        )}
      </section>

      {isModalOpen && (
        <Modal title="Add Category" onClose={() => setIsModalOpen(false)}>
          <form className={styles.categoryForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Accessories"
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional category description"
                className={styles.formInput}
              />
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton} disabled={isSaving}>
                {isSaving ? "Saving..." : "Create Category"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
