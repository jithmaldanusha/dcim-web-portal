export default function Confirmation({ show, onClose, onConfirm, message }) {
    if (!show) return null;
  
    return (
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg">
            <div className="modal-header bg-warning text-white">
              <h5 className="modal-title">Are you sure?</h5>
            </div>
            <div className="modal-body text-center">
              <img src="/formicons/sure.svg" className="mb-3" style={{ width: "50px" }} />
              <p>{message}</p>
            </div>
            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={onConfirm}>
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  