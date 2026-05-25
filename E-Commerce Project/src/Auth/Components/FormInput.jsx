import React from "react";

function FormInput({ type, name, value, onChange, label }) {
    return (
        <div className="form-group">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required
            />
            <label>{label}</label>
        </div>
    );
}

export default FormInput;