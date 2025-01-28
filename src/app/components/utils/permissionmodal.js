
export default function Warning({ show, onClose }) {
    if (!show) return null;
  
    return (
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg">
            <div className="modal-header bg-warning text-white">
              <h5 className="modal-title">You do not have permission</h5>
            </div>
            <div className="modal-body text-center">
              <img src="/formicons/timeout.svg" alt="Timeout" className="mb-3" style={{ width: "50px" }} />
              <p>Request has been sent to admin for the aproval <br/>Thank You</p>
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
  