export default function SessionTimeout({ show, onClose }) {
  if (!show) return null;

  const modalBackdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    zIndex: 1040, // Ensure it's behind the modal
  };

  const modalDialogStyle = {
    zIndex: 1050, // Modal z-index, ensure it's on top of the backdrop
  };

  return (
    <>
      {/* Background overlay */}
      <div style={modalBackdropStyle}></div>

      <div className="modal show d-block" tabIndex="-1" role="dialog" style={modalDialogStyle}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg">
            <div className="modal-header bg-secondary text-white">
              <h5 className="modal-title">Session Timed Out</h5>
            </div>
            <div className="modal-body text-center">
              <img
                src="/formicons/timeout.svg"
                alt="Timeout"
                className="mb-3"
                style={{ width: "50px" }}
              />
              <p>Please Login Again</p>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
