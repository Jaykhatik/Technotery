"use client";

import React from "react";
import styles from "./ui.module.css";

interface ModalProps {
  title: string;
  variant?: "default" | "destructive";
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  title,
  variant = "default",
  onClose,
  children,
  maxWidth,
}: ModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContent}
        style={maxWidth ? { maxWidth } : undefined}
      >
        <div className={styles.modalHeader}>
          <h2
            className={
              variant === "destructive"
                ? styles.modalTitleDestructive
                : styles.modalTitle
            }
          >
            {title}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
