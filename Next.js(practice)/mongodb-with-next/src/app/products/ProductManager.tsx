"use client";

import React, { useState } from "react";
import { Product, Toast } from "@/types";
import { createProduct, updateProduct, deleteProduct } from "@/services/productService";
import ProductCard from "@/components/products/ProductCard";
import ProductForm, { ProductFormData } from "@/components/products/ProductForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ToastContainer from "@/components/ui/ToastContainer";
import styles from "./products.module.css";

const EMPTY_FORM: ProductFormData = { name: "", price: "", company: "", color: "", category: "" };

export default function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  // ── Open Create modal ──
  const openCreate = () => {
    setFormMode("create");
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setIsFormOpen(true);
  };

  // ── Open Edit modal ──
  const openEdit = (product: Product) => {
    setFormMode("edit");
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      company: product.company || "",
      color: product.color || "",
      category: product.category || "",
    });
    setIsFormOpen(true);
  };

  // ── POST: Create product ──
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        company: formData.company,
        color: formData.color,
        category: formData.category,
      };

      if (formMode === "create") {
        const res = await createProduct(payload);
        if (res.success && !Array.isArray(res.result) && typeof res.result === "object") {
          setProducts((prev) => [res.result as Product, ...prev]);
          addToast("Product created!", "success");
        }
      } else {
        if (!editingProduct) return;
        const res = await updateProduct(editingProduct._id, payload);
        if (res.success && !Array.isArray(res.result) && typeof res.result === "object") {
          const updated = res.result as Product;
          setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
          addToast("Product updated!", "success");
        }
      }
      setIsFormOpen(false);
    } catch {
      addToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ── DELETE: Remove product ──
  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteProduct(productToDelete._id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
        addToast("Product deleted!", "success");
      }
    } catch {
      addToast("Failed to delete product.", "error");
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px" }}>

      {/* Add Product Button */}
      <div className={styles.toolbar}>
        <button className={styles.addButton} onClick={openCreate}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Product Grid */}
      <section className={styles.grid} id="products-list">
        {products.length === 0 ? (
          <article className={styles.noProducts}>
            <p>No products yet. Click <strong>Add Product</strong> to get started.</p>
          </article>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={openEdit}
              onDelete={setProductToDelete}
              onBuy={(p) => addToast(`Order for "${p.name}" placed!`, "success")}
            />
          ))
        )}
      </section>

      {/* Create / Edit Form */}
      {isFormOpen && (
        <ProductForm
          mode={formMode}
          formData={formData}
          isSaving={isSaving}
          onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          onSubmit={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Delete Confirmation */}
      {productToDelete && (
        <ConfirmDialog
          title="Delete Product"
          message={<>Delete <strong>{productToDelete.name}</strong>? This action cannot be undone.</>}
          confirmLabel="Delete"
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setProductToDelete(null)}
        />
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
