import { Input } from 'antd';

const { TextArea } = Input;

function TextAreaInput({
    id,
    label = '',
    placeholder = '',
    helperText = '',
    className = '',
    required = false,
    value = '',
    defaultValue,
    rows = 4,
    maxLength,
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
            <TextArea
                id={id}
                name={id}
                rows={rows}
                value={value}
                defaultValue={defaultValue}
                maxLength={maxLength}
                placeholder={placeholder || label}
                disabled={disabled}
                readOnly={readOnly}
                allowClear={allowClear}
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

export default TextAreaInput;
