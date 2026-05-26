"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import styles from "@/components/ui/ui.module.css";

export interface ProductFormData {
  name: string;
  price: string;
  company: string;
  color: string;
  category: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  formData: ProductFormData;
  isSaving: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const CATEGORIES = ["Electronics", "Audio", "Wearables", "Accessories", "Other"];

export default function ProductForm({
  mode,
  formData,
  isSaving,
  onChange,
  onSubmit,
  onClose,
}: ProductFormProps) {
  return (
    <Modal
      title={mode === "create" ? "Add Premium Product" : "Edit Product Details"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className={styles.form}>
        {/* Name */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Product Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. iPhone 15 Pro Max"
            className={styles.formInput}
            value={formData.name}
            onChange={onChange}
          />
        </div>

        {/* Price + Category */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Price (₹) *</label>
            <input
              type="number"
              name="price"
              required
              placeholder="e.g. 159900"
              className={styles.formInput}
              value={formData.price}
              onChange={onChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category</label>
            <select
              name="category"
              className={styles.formInput}
              style={{ background: "#1a1635", color: "#fff" }}
              value={formData.category}
              onChange={onChange}
            >
              <option value="">— Select —</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Company + Color */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Brand / Company</label>
            <input
              type="text"
              name="company"
              placeholder="e.g. Apple"
              className={styles.formInput}
              value={formData.company}
              onChange={onChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Color Spectrum</label>
            <input
              type="text"
              name="color"
              placeholder="e.g. Titanium Gray"
              className={styles.formInput}
              value={formData.color}
              onChange={onChange}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={isSaving} className={styles.submitButton}>
            {isSaving ? "Saving..." : mode === "create" ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
