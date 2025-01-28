import './formcomponents.css';

export default function LoginButton({ onClick }) {
    return (
        <div className="text-center text-lg-start mt-4 pt-2">
            <button
                type="button"
                className="loginbtn btn btn-lg rounded-5 fs-6 fw-bold me-1"
                onClick={onClick}
            >
                Login
            </button>
        </div>
    );
}
