import React from "react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">
      <div className="bg-harvey-bg-lighter border border-harvey-border rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
        <h3 className="text-harvey-text font-medium text-lg mb-4">{title}</h3>
        <p className="text-harvey-text-light mb-6">{message}</p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-harvey-text-light hover:text-harvey-text transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
