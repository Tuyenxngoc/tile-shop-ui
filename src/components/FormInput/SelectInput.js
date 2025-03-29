import { Select } from 'antd';

function SelectInput({
    id,
    label = '',
    placeholder = '',
    helperText = '',
    className = '',
    required = false,
    multiple = false,
    value,
    defaultValue,
    options,
    fieldNames,
    onChange,
    onBlur,
    onSearch,
    error,
    loading,
    disabled = false,
}) {
    return (
        <div className={className}>
            <label htmlFor={id}>
                {required && <span className="text-danger">*</span>} {label}:
            </label>
            <Select
                id={id}
                name={id}
                mode={multiple ? 'multiple' : undefined}
                value={value}
                defaultValue={defaultValue}
                options={options}
                fieldNames={fieldNames}
                placeholder={placeholder}
                showSearch
                allowClear={!required}
                disabled={disabled}
                filterOption={false}
                onChange={onChange}
                onBlur={onBlur}
                onSearch={onSearch}
                status={error ? 'error' : undefined}
                loading={loading}
                className="w-100"
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
            />
            {error ? (
                <div className="text-danger mt-1">{error}</div>
            ) : (
                helperText && <div className="text-muted mt-1">{helperText}</div>
            )}
        </div>
    );
}

export default SelectInput;
