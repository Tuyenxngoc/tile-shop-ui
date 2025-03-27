import { Upload, Button, Image, message } from 'antd';
import { useState } from 'react';
import { MdOutlineFileUpload } from 'react-icons/md';
import images from '~/assets';

function ImageUploadInput({ label = 'Tải lên ảnh', onImageSelect, width = 500, defaultImage = images.placeimg }) {
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState(defaultImage);

    const handleUploadChange = ({ file, fileList }) => {
        setFileList(fileList);

        const { originFileObj } = file;
        if (!originFileObj) {
            return;
        }

        // Tạo URL cho hình ảnh và cập nhật giá trị
        const url = URL.createObjectURL(originFileObj);
        setPreviewImage(url);
        onImageSelect && onImageSelect(originFileObj);
    };

    return (
        <div className="text-center">
            <Image width={width} src={previewImage} fallback={defaultImage} />

            <Upload
                className="d-block mt-2"
                accept="image/*"
                fileList={fileList}
                maxCount={1}
                showUploadList={false}
                beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                    if (!isImage) {
                        message.error('Bạn chỉ có thể upload file hình ảnh!');
                    }
                    return isImage;
                }}
                onChange={handleUploadChange}
                customRequest={() => false}
            >
                <Button icon={<MdOutlineFileUpload />}>{label}</Button>
            </Upload>
        </div>
    );
}

export default ImageUploadInput;
