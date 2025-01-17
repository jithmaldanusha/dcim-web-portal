"use client";
import { useState, useEffect } from "react";
import "./page.css";

export default function FormInput({
    type = "text",
    label = "",
    firstValue = "",
    options = [],
    value = "",
    onChange,
    width = "100%",
    height = "auto",
    placeholder = "Enter Value",
    disabled = false,
    className = ""
}) {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const handleDropdownChange = (e) => {
        const selectedValue = e.target.value;
        setInputValue(selectedValue);
        if (onChange) {
            onChange(selectedValue);
        }
    };

    const customStyles = {
        width,
        height: type === "textarea" ? height : "auto",
    };

    return (
        <div className="mb-3 form-input-container">
            {/* Render label on top for most input types */}
            {type !== "checkbox" && label && <label className="form-label">{label}</label>}

            {type === "text" ? (
                <input
                    type="text"
                    className={`form-control form-control-sm custom-input ${className}`}
                    value={inputValue}
                    onChange={handleInputChange}
                    style={customStyles}
                    aria-label="Text input"
                    disabled={disabled}
                    placeholder={placeholder}
                />
            ) : type === "password" ? (
                <input
                    type="password"
                    className={`form-control form-control-sm custom-input ${className}`}
                    value={inputValue}
                    onChange={handleInputChange}
                    style={customStyles}
                    aria-label="Password input"
                    disabled={disabled}
                    placeholder={placeholder}
                />
            ) : type === "textarea" ? (
                <textarea
                    className={`form-control form-control-sm custom-input ${className}`}
                    value={inputValue}
                    onChange={handleInputChange}
                    style={customStyles}
                    aria-label="Text area"
                />
            ) : type === "date" ? (
                <input
                    type="date"
                    className={`form-control form-control-sm custom-input ${className}`}
                    value={inputValue}
                    onChange={handleInputChange}
                    style={customStyles}
                    aria-label="Date selector"
                    disabled={disabled}
                />
            ) : type === "checkbox" ? (
                <div className="form-check">
                    <input
                        type="checkbox"
                        className={`form-check-input ${className}`}
                        checked={inputValue === 1 || 0}
                        onChange={() => onChange(inputValue === 1 ? 0 : 1)}
                        aria-label={label}
                        disabled={disabled}
                        style={{ width: '15px', height: '15px' }}
                    />
                    {/* Render label next to checkbox */}
                    {label && <label className="form-check-label">{label}</label>}
                </div>
            ) : (
                <select
                    className={`form-control form-control-sm custom-input ${className}`}
                    value={inputValue}
                    onChange={handleDropdownChange}
                    style={customStyles}
                    aria-label="Dropdown select"
                    disabled={disabled}
                >
                    <option>Select</option>

                    {firstValue && (
                        <option value={firstValue}>{firstValue}</option>
                    )}

                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}
