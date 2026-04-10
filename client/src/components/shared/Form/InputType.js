/**
 * Input Field Component
 * 
 * A reusable component for rendering form input fields with labels.
 * Used in various form components throughout the application to maintain
 * consistent styling and behavior for input elements.
 */

import React from "react";

/**
 * InputType Component
 * 
 * Renders a form input field with associated label in a Bootstrap-styled format.
 * 
 * @param {string} labelText - Text to display in the label element
 * @param {string} labelFor - ID for the label's "for" attribute (accessibility)
 * @param {string} inputType - Type of input (text, email, password, etc.)
 * @param {string} value - Current value of the input field
 * @param {function} onChange - Handler function for input changes
 * @param {string} name - Name attribute for the input field
 * @param {string} autocomplete - Autocomplete attribute for browser autofill
 * @returns {JSX.Element} Labeled input field
 */
const InputType = ({
  labelText,
  labelFor,
  inputType,
  value,
  onChange,
  name,
  autocomplete = "off",
}) => {
  // Map input types to appropriate autocomplete values
  const getAutocompleteValue = () => {
    if (autocomplete && autocomplete !== "off") {
      return autocomplete;
    }
    
    switch (inputType) {
      case "email":
        return "email";
      case "password":
        return "current-password";
      case "tel":
        return "tel";
      case "url":
        return "url";
      default:
        return "off";
    }
  };

  return (
    <>
      <div className="mb-1">
        {/* Input label */}
        <label htmlFor={labelFor} className="form-label">
          {labelText}
        </label>
        
        {/* Input field with id matching label and autocomplete */}
        <input
          id={labelFor}
          type={inputType}
          className="form-control"
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={getAutocompleteValue()}
        />
      </div>
    </>
  );
};

export default InputType;
