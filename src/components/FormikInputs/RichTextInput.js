import { useCallback, useRef } from 'react';
import { message } from 'antd';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';

import { formats, modules as defaultModules } from '~/constants/editorConfig';
import { uploadFiles } from '~/services/userService';

function RichTextInput({
    label = '',
    className = '',
    required = false,
    placeholder = '',
    value = '',
    onChange = () => {},
    onBlur = () => {},
    error = '',
}) {
    const reactQuillRef = useRef(null);

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const loadingMessage = message.loading({ content: 'Đang tải ảnh lên...', duration: 0 });

                try {
                    const response = await uploadFiles([file]);
                    const quill = reactQuillRef.current?.editor;

                    if (quill && response.data) {
                        const range = quill.getSelection();
                        if (range) {
                            quill.insertEmbed(range.index, 'image', response.data.data[0]);
                            message.success({ content: 'Tải ảnh thành công!', duration: 2 });
                        }
                    }
                } catch (error) {
                    message.error({ content: 'Đã xảy ra lỗi khi tải ảnh lên.', duration: 2 });
                } finally {
                    if (loadingMessage) loadingMessage();
                }
            }
        };
    }, []);

    const modules = useCallback(
        () => ({
            ...defaultModules,
            toolbar: {
                ...defaultModules.toolbar,
                handlers: {
                    ...defaultModules.toolbar.handlers,
                    image: imageHandler,
                },
            },
        }),
        [imageHandler],
    );

    return (
        <div className={className}>
            {label && (
                <span>
                    {required && <span className="text-danger">*</span>} {label}:
                </span>
            )}
            <ReactQuill
                ref={reactQuillRef}
                className="custom-quill"
                placeholder={placeholder}
                value={value}
                modules={modules()}
                formats={formats}
                onChange={onChange}
                onBlur={onBlur}
            />
            {error && <div className="text-danger mt-1">{error}</div>}
        </div>
    );
}

export default RichTextInput;
