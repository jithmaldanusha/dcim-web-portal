"use client"
import { useState, useEffect } from 'react';

export default function FormInput({ 
    type = 'text', // default is 'text', can be 'dropdown' as well
    firstValue = '', // initial value for dropdown
    options = [], // options for dropdown, typically fetched from DB
    value = '', // initial value for text input or selected value for dropdown
    onChange // function to handle the value change
}) {
    // State to hold the selected value
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        // Update local state when prop `value` changes
        setInputValue(value);
    }, [value]);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        // Call the onChange function passed via props to handle value change
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <>
            {type === 'text' ? (
                <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={inputValue} 
                    onChange={handleInputChange} 
                    aria-label="Text input"
                />
            ) : (
                <select 
                    className="form-select form-select-sm" 
                    value={inputValue} 
                    onChange={handleInputChange} 
                    aria-label="Dropdown select"
                >
                    <option value={firstValue}>{firstValue || 'Select an option'}</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            )}
        </>
    );
}
