import { Select } from 'antd';

function SelectInput({
    required = false,
    multiple = false,
    id,
    label = '',
    className = '',
    value,
    onChange,
    onBlur,
    options,
    loading,
    onSearch,
    fieldNames,
    error,
    helperText = '',
    placeholder = '',
}) {
    return (
        <div className={className}>
            <label htmlFor={id}>
                {required && <span className="text-danger">*</span>} {label}:
            </label>
            <Select
                mode={multiple ? 'multiple' : undefined}
                showSearch
                allowClear={!required}
                onSearch={onSearch}
                filterOption={false}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                status={error ? 'error' : undefined}
                loading={loading}
                placeholder={placeholder}
                options={options}
                fieldNames={fieldNames}
                className="w-100"
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
