import { InputNumber } from 'antd';

function NumberInput({
    id,
    label = '',
    placeholder = '',
    helperText = '',
    className = '',
    required = false,
    value,
    defaultValue,
    min,
    max,
    step,
    disabled = false,
    readOnly = false,
    allowClear = false,
    onChange,
    onBlur,
    error = '',
    ...rest
}) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id}>
                    {required && <span className="text-danger">*</span>} {label}:
                </label>
            )}
            <InputNumber
                id={id}
                name={id}
                value={value}
                defaultValue={defaultValue}
                min={min}
                max={max}
                step={step}
                placeholder={placeholder || label}
                disabled={disabled}
                readOnly={readOnly}
                onChange={onChange}
                onBlur={onBlur}
                status={error ? 'error' : undefined}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                {...rest}
            />
            {error ? (
                <div className="text-danger mt-1">{error}</div>
            ) : (
                helperText && <div className="text-muted mt-1">{helperText}</div>
            )}
        </div>
    );
}

export default NumberInput;
