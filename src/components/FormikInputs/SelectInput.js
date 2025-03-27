import { Select } from 'antd';

function SelectInput({
    required = false,
    multiple = false,
    id,
    label,
    className,
    value,
    onChange,
    onBlur,
    options,
    loading,
    onSearch,
    fieldNames,
    error,
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
                placeholder={`Chọn ${label.toLowerCase()}`}
                className="w-100"
                options={options}
                fieldNames={fieldNames}
            />
            {error && <div className="text-danger">{error}</div>}
        </div>
    );
}

export default SelectInput;
