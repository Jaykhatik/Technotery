"use client";

import React from "react";
import styles from "./product.module.css";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  categories: string[];
  onAddProductClick: () => void;
}

export default function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  categories,
  onAddProductClick,
}: ProductFiltersProps) {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterRow}>
        {/* Search Input with Icon */}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search products by name, brand, color..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Add Product Button */}
        <button className={styles.addButton} onClick={onAddProductClick}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Dynamic Category Filter Pills */}
      {categories.length > 1 && (
        <div className={styles.categoriesRow}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className={`${styles.categoryPill} ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? styles.categoryPillActive
                  : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
