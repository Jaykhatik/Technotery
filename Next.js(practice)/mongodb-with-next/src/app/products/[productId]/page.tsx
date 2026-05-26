import Link from "next/link";
import { getProductById } from "@/services/productService";
import { Product } from "@/types";
import styles from "./productDetail.module.css";

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { productId } = await params;

  let product: Product | null = null;

  try {
    const res = await getProductById(productId);
    if (res.success && typeof res.result === "object" && !Array.isArray(res.result)) {
      product = res.result as Product;
    }
  } catch {
    // product stays null → show error state
  }

  return (
    <main className={styles.container}>
      <Link href="/products" className={styles.backLink}>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 12H5m7-7l-7 7 7 7" />
        </svg>
        Back to Collection
      </Link>

      {!product ? (
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Product Not Found</h1>
          <p className={styles.notFoundText}>
            This product doesn&apos;t exist or has been removed from the catalog.
          </p>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.category}>{product.category || "General"}</div>
          <h1 className={styles.name}>{product.name}</h1>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Brand / Company</div>
              <div className={styles.detailValue}>{product.company || "—"}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Color</div>
              <div className={styles.detailValue}>{product.color || "—"}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Category</div>
              <div className={styles.detailValue}>{product.category || "General"}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Product ID</div>
              <div className={styles.detailValue} style={{ fontSize: "0.8rem", wordBreak: "break-all" }}>
                {product._id}
              </div>
            </div>
          </div>

          <div className={styles.priceRow}>
            <div>
              <div className={styles.priceLabel}>Price</div>
              <div className={styles.price}>
                ₹{Number(product.price).toLocaleString("en-IN")}
              </div>
            </div>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        </div>
      )}
    </main>
  );
}
