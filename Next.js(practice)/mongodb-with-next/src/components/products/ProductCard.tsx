"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import styles from "./product.module.css";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onBuy: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onBuy }: ProductCardProps) {
  return (
    <article className={styles.card} id={`product-${product._id}`}>
      {/* Floating Action Icons */}
      <div className={styles.cardActions}>
        <button
          className={`${styles.iconButton} ${styles.editBtn}`}
          title="Edit Product"
          onClick={() => onEdit(product)}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          className={`${styles.iconButton} ${styles.deleteBtn}`}
          title="Delete Product"
          onClick={() => onDelete(product)}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Card Body */}
      <div>
        <div className={styles.category}>{product.category || "General"}</div>
        <h2 className={styles.productName}>{product.name}</h2>
        <div className={styles.specs}>
          <span className={`${styles.badge} ${styles.badgeCompany}`}>
            {product.company || "—"}
          </span>
          {product.color && (
            <span className={styles.badge}>Color: {product.color}</span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className={styles.footer}>
        <div className={styles.priceContainer}>
          <span className={styles.priceLabel}>Price</span>
          <span className={styles.price}>
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <Link href={`/products/${product._id}`} className={styles.actionButton}>
            Details
          </Link>
          <button className={styles.actionButton} onClick={() => onBuy(product)}>
            Buy Now
          </button>
        </div>
      </div>

    </article>
  );
}
