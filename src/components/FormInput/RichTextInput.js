import ReactQuill from 'react-quill';
import { formats, modules } from '~/constants/editorConfig';

function RichTextInput({
    label = '',
    placeholder = '',
    helperText = '',
    className = '',
    required = false,
    value = '',
    error = '',
    onChange,
    onBlur,
}) {
    return (
        <div className={className}>
            {label && (
                <span>
                    {required && <span className="text-danger">*</span>} {label}:
                </span>
            )}
            <ReactQuill
                className={`custom-quill ${error ? 'error' : ''}`}
                placeholder={placeholder}
                value={value}
                modules={modules}
                formats={formats}
                onChange={onChange}
                onBlur={onBlur}
            />
            {error ? (
                <div className="text-danger mt-1">{error}</div>
            ) : (
                helperText && <div className="text-muted mt-1">{helperText}</div>
            )}
        </div>
    );
}

export default RichTextInput;
