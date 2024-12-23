import React from 'react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">
      <div className="bg-eco-darker border border-eco-dark rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-eco-text font-code text-lg mb-4">{title}</h3>
        <p className="text-eco-gray mb-6">{message}</p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-eco-gray hover:text-eco-text transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500/10 text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 