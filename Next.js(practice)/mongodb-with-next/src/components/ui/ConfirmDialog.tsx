"use client";

import React from "react";
import Modal from "./Modal";
import styles from "./ui.module.css";

interface ConfirmDialogProps {
  title?: string;
  message: React.ReactNode;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} variant="destructive" onClose={onCancel} maxWidth="420px">
      <p className={styles.confirmMessage}>{message}</p>
      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          disabled={isLoading}
          className={`${styles.submitButton} ${styles.confirmDeleteBtn}`}
          onClick={onConfirm}
        >
          {isLoading ? "Processing..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
