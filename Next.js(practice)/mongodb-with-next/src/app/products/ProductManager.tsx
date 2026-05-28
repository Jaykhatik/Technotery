"use client";

import React, { useState } from "react";
import { Product, Toast } from "@/types";
import { createProduct, updateProduct, deleteProduct } from "@/services/productService";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import ProductForm, { ProductFormData } from "@/components/products/ProductForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import ToastContainer from "@/components/ui/ToastContainer";
import styles from "./products.module.css";

const EMPTY_FORM: ProductFormData = { name: "", price: "", company: "", color: "", category: "" };

export default function ProductManager({ initialProducts, initialCategories }: { initialProducts: Product[]; initialCategories: string[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Use categories loaded from the persisted category collection first, then fall back to any product categories.
  const categories = React.useMemo(() => {
    const rawCategories = initialCategories && initialCategories.length > 0
      ? initialCategories
      : products.map((p) => p.category || "");

    const unique = new Set<string>();
    rawCategories.forEach((category) => {
      if (category) {
        const cleaned = category.trim();
        if (cleaned) {
          const existing = Array.from(unique).find(
            (c) => c.toLowerCase() === cleaned.toLowerCase()
          );
          if (!existing) {
            unique.add(cleaned);
          }
        }
      }
    });

    return ["All", ...Array.from(unique)];
  }, [initialCategories, products]);

  // Filter products based on search query and category
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const cat = product.category || "General";
      const matchesCategory =
        selectedCategory === "All" ||
        cat.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        searchQuery.trim() === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.color || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Paginated products subset
  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

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

      {/* Premium Filter and Control Bar Component */}
      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        categories={categories}
        onAddProductClick={openCreate}
      />

      {/* Product Grid */}
      <section className={styles.grid} id="products-list">
        {products.length === 0 ? (
          <article className={styles.noProducts}>
            <p>No products yet. Click <strong>Add Product</strong> to get started.</p>
          </article>
        ) : paginatedProducts.length === 0 ? (
          <article className={styles.noProducts}>
            <p>No products match your search or selected category filter.</p>
          </article>
        ) : (
          paginatedProducts.map((product) => (
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

      {/* Pagination Section */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredProducts.length}
        itemsPerPage={itemsPerPage}
      />

      {/* Create / Edit Form */}
      {isFormOpen && (
        <ProductForm
          mode={formMode}
          formData={formData}
          categoryOptions={categories.slice(1)}
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
