import React from "react";

function FormSelect({ name, value, onChange, label, options }) {
    return (
        <div className="form-group">
            <select
                name={name}
                value={value}
                onChange={onChange}
                required
            >
                <option value="">{label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <label>{label}</label>
        </div>
    );
}

export default FormSelect;
