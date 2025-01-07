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
    secondaryLabel = "",
    secondaryInputValue = "", // Prop for secondary input value
    onSecondaryInputChange,
    disabled = false,
    className = ""
}) {
    const [inputValue, setInputValue] = useState(value);
    const [secondaryValue, setSecondaryValue] = useState(secondaryInputValue); // State for secondary input

    // Effect to sync inputValue with the parent prop
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Effect to set the initial secondary value
    useEffect(() => {
        setSecondaryValue(secondaryInputValue || value);
    }, [value, secondaryInputValue]);

    // Handle changes in the primary input (dropdown or text)
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    // Handle dropdown changes
    const handleDropdownChange = (e) => {
        const selectedValue = e.target.value;
        setInputValue(selectedValue);
        if (onChange) {
            onChange(selectedValue);
        }
    };

    // Handle changes in the secondary input (text field when "New" is selected)
    const handleSecondaryInputChange = (e) => {
        const newTextValue = e.target.value;
        console.log(newTextValue)
        setSecondaryValue(newTextValue);
        if (onSecondaryInputChange) {
            onSecondaryInputChange(newTextValue); // Call the parent handler
        }
    };

    const customStyles = {
        width,
        height: type === "textarea" ? height : "auto",
    };

    return (
        <div className="mb-3 form-input-container">
            {label && <label className="form-label">{label}</label>}

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
                    aria-label="Text input"
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
            ) : (
                <>
                    <select
                        className={`form-control form-control-sm custom-input ${className}`}
                        value={inputValue}
                        onChange={handleDropdownChange}
                        style={customStyles}
                        aria-label="Dropdown select"
                        disabled={disabled}
                    >
                        {/* Default Select Option */}
                        <option>
                            Select
                        </option>

                        {/* First Value */}
                        {firstValue && (
                            <option value={firstValue}>{firstValue}</option>
                        )}

                        {/* Additional Options */}
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    {inputValue === "New" && (
                        <div className="txt-container mt-3">
                            {/* Render the secondary label */}
                            {secondaryLabel && (
                                <label className="secondary-label">{secondaryLabel}</label>
                            )}
                            <input
                                type="text"
                                className={`form-control form-control-sm custom-input p-2 ${className}`}
                                value={secondaryValue}
                                onChange={handleSecondaryInputChange}
                                placeholder={placeholder}
                                aria-label="Editable text input"
                                style={customStyles}
                                disabled={disabled}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
