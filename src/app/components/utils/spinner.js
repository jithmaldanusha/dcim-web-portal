export default function Spinner() {
  const spinnerOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  };

  return (
    <div style={spinnerOverlayStyle}>
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );
}
