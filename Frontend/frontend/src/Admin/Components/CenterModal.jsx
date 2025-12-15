import React from "react";

function CenterModal({
  show,
  title,
  message,
  confirmText = "OK",
  confirmClass = "btn-primary",
  onConfirm,
  onClose
}) {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              <p>{message}</p>
            </div>

            <div className="modal-footer">
             

              <button
                className={`btn ${confirmClass}`}
                onClick={() => {
                  onConfirm && onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* BACKDROP */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default CenterModal;
