import React from "react";
import { X, AlertTriangle, ShieldCheck } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            {isDanger ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
                <AlertTriangle size={18} />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                <ShieldCheck size={18} />
              </div>
            )}
            <h3 className="modal-title">{title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="modal-close disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-body">
          <p className="text-zinc-300 text-sm leading-relaxed">{message}</p>
        </div>
        
        <div className="modal-footer">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="modal-btn-cancel disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`modal-btn-confirm disabled:opacity-50 ${
              isDanger ? "modal-btn-danger" : ""
            }`}
          >
            {isLoading ? (
              <>
                <span className="modal-spinner" />
                <span>Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
