import { Input } from 'antd';

function TextInput({
    id,
    label = '',
    className = '',
    required = false,
    helperText = '',
    value = '',
    onChange,
    onBlur,
    error = '',
    type = 'text',
    placeholder = '',
    ...rest
}) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id}>
                    {required && <span className="text-danger">*</span>} {label}:
                </label>
            )}
            <Input
                {...rest}
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder || label}
                status={error ? 'error' : undefined}
            />
            {error ? (
                <div className="text-danger mt-1">{error}</div>
            ) : (
                helperText && <div className="text-muted mt-1">{helperText}</div>
            )}
        </div>
    );
}

export default TextInput;
