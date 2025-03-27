import { Upload, Button, Image, message } from 'antd';
import { useState } from 'react';
import { MdOutlineFileUpload } from 'react-icons/md';
import images from '~/assets';

function ImageUploadInput({
    label = '',
    required,
    className,
    defaultImage = images.placeimg,
    onImageSelect = () => {},
    error,
    helperText = '',
}) {
    const [previewImage, setPreviewImage] = useState(defaultImage);

    const handleUploadChange = ({ file }) => {
        const { originFileObj } = file;
        if (!originFileObj) {
            return;
        }

        const url = URL.createObjectURL(originFileObj);
        setPreviewImage(url);
        onImageSelect(originFileObj);
    };

    const handleBeforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Bạn chỉ có thể upload file hình ảnh!');
        }
        return isImage;
    };

    return (
        <div className={className}>
            {label && (
                <span>
                    {required && <span className="text-danger">*</span>} {label}:
                </span>
            )}
            <div className="text-center">
                <Image className="w-100" src={previewImage} fallback={defaultImage} />

                <Upload
                    className="d-block mt-2"
                    accept="image/*"
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={handleBeforeUpload}
                    onChange={handleUploadChange}
                    customRequest={() => false}
                >
                    <Button danger={error} icon={<MdOutlineFileUpload />}>
                        Chọn ảnh để tải lên
                    </Button>
                </Upload>
            </div>

            {error ? (
                <div className="text-danger mt-1">{error}</div>
            ) : (
                helperText && <div className="text-muted mt-1">{helperText}</div>
            )}
        </div>
    );
}

export default ImageUploadInput;
