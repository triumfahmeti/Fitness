import React from "react";

function ConfirmModal({ show, title, message, onCancel, onConfirm, confirmText = "Confirm", confirmClass = "btn-danger" }) {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button className="btn-close" onClick={onCancel} />
            </div>

            <div className="modal-body">
              <p>{message}</p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>

              <button className={`btn ${confirmClass}`} onClick={onConfirm}>
                {confirmText}
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default ConfirmModal;
