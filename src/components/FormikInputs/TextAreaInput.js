import { Input } from 'antd';

const { TextArea } = Input;

function TextAreaInput({
    id,
    label = '',
    className = '',
    required = false,
    helperText = '',
    rows = 4,
    value = '',
    onChange,
    onBlur,
    error = '',
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
            <TextArea
                id={id}
                name={id}
                rows={rows}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder || label}
                status={error ? 'error' : undefined}
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
