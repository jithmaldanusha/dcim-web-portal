
export default function SuccessModal({ show, message, onClose }) {
    if (!show) return null;
  
    return (
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">Success</h5>
            </div>
            <div className="modal-body text-center">
              <img src="/formicons/tick.svg" alt="Success" className="mb-3" style={{ width: "50px" }} />
              <p>{message}</p>
            </div>
            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  