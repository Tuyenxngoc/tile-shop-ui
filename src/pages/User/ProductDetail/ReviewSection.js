import { useEffect, useState } from 'react';
import { Alert, Button, Form, Image, Input, Modal, Pagination, Progress, Rate, Space, Spin, Upload } from 'antd';

import queryString from 'query-string';
import { FaStar } from 'react-icons/fa6';
import { PlusOutlined } from '@ant-design/icons';

import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import useAuth from '~/hooks/useAuth';
import { validateFile } from '~/utils';
import { INITIAL_FILTERS, INITIAL_META } from '~/constants';
import { createReview, getReviewsByProductId, getReviewSummaryByProductId } from '~/services/reviewService';

dayjs.extend(relativeTime);

const cx = classNames.bind(styles);

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function ReviewSection({ productId, message }) {
    const { isAuthenticated } = useAuth();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [summary, setSummary] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [fileList, setFileList] = useState([]);

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage }));
    };

    const handleChangeRowsPerPage = (current, size) => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            pageSize: size,
        }));
    };

    const handlePreview = async (file) => {
        let src = file.url;
        if (!src && file.originFileObj) {
            src = await getBase64(file.originFileObj);
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        if (imgWindow) {
            imgWindow.document.write(image.outerHTML);
        }
    };

    const handleFileListChange = ({ file, fileList: newFileList }) => {
        const { result, message } = validateFile(file);
        if (!result) {
            message.error(message);
            return;
        }

        if (newFileList.length > 3) {
            return;
        }

        setFileList(newFileList);
    };

    const handleCustomRequest = (options) => {
        const { onSuccess } = options;
        setTimeout(() => {
            onSuccess('ok');
        }, 0);
    };

    const showRatingModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmitReview = async (values) => {
        const payload = {
            ...values,
            productId,
        };

        setIsSubmitting(true);
        try {
            const response = await createReview(payload, fileList);
            message.success('Đánh giá của bạn đã được gửi!');
            handleCancel();
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
            message.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch review summary
    useEffect(() => {
        if (!productId) return;

        const fetchSummary = async () => {
            try {
                const response = await getReviewSummaryByProductId(productId);
                setSummary(response.data.data || {});
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            }
        };

        fetchSummary();
    }, [productId]);

    // Fetch reviews
    useEffect(() => {
        if (!productId) return;

        const fetchReviews = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getReviewsByProductId(productId, params);

                const { meta, items } = response.data.data;
                setReviews(items);
                setMeta(meta);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [filters, productId]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center w-100">
                <Spin size="large" />
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="w-100">
                <Alert message="Lỗi" description={errorMessage} type="error" />
            </div>
        );
    }

    return (
        <>
            <Modal
                title="Đánh giá sản phẩm"
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                confirmLoading={isSubmitting}
                okText="Gửi"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" size="small" onFinish={handleSubmitReview}>
                    <Form.Item
                        name="rating"
                        label="Số sao"
                        rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
                    >
                        <Rate />
                    </Form.Item>
                    <Form.Item name="comment" label="Nhận xét">
                        <Input.TextArea rows={4} maxLength={500} showCount />
                    </Form.Item>

                    <Form.Item label="Hình ảnh sản phẩm (tối đa 3)">
                        <Upload
                            accept="image/*"
                            listType="picture-card"
                            fileList={fileList}
                            maxCount={3}
                            onPreview={handlePreview}
                            onChange={handleFileListChange}
                            customRequest={handleCustomRequest}
                        >
                            {fileList.length >= 3 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            <div className={cx('section-title')}>Đánh giá và nhận xét</div>
            <div className={cx('review-wrap')}>
                <div className={cx('review-score')}>
                    <div className={cx('score-value')}>{summary.averageRating}/5</div>
                    <div>
                        <Rate value={5} disabled />
                        <div className={cx('score-count')}>{summary.totalReviews} đánh giá và nhận xét</div>
                    </div>
                </div>
                {Object.keys(summary.ratingBreakdown)
                    .sort((a, b) => b - a)
                    .map((key) => (
                        <div className={cx('rate-bar')} key={key}>
                            <span>{key}</span>
                            <FaStar color="#fcb415" />
                            <Progress
                                strokeColor="#fcb415"
                                status="normal"
                                percent={summary.ratingBreakdown[key].percentage}
                            />
                        </div>
                    ))}

                <div className={cx('rating-prompt')}>Bạn đánh giá sao về sản phẩm này ?</div>

                {isAuthenticated ? (
                    <Button type="primary" block onClick={showRatingModal}>
                        ĐÁNH GIÁ NGAY
                    </Button>
                ) : (
                    <Alert
                        type="info"
                        showIcon
                        message="Vui lòng đăng nhập để đánh giá sản phẩm"
                        action={
                            <Button type="link" href="/dang-nhap">
                                Đăng nhập
                            </Button>
                        }
                    />
                )}

                <div className={cx('comment-list')}>
                    {reviews.length === 0 ? (
                        <div>
                            <hr />
                            Chưa có đánh giá nào.
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div className={cx('comment')} key={review.id}>
                                <hr />

                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div>
                                        <strong className="me-2">{review.customer.name}</strong>
                                        <Rate value={review.rating} disabled style={{ fontSize: 14 }} />
                                    </div>
                                    <span className="text-muted" style={{ fontSize: 12 }}>
                                        {dayjs(review.createdDate).fromNow()}
                                    </span>
                                </div>

                                <div className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                                    {review.comment}
                                </div>

                                {review.images.length > 0 && (
                                    <Image.PreviewGroup>
                                        <Space size={8} wrap>
                                            {review.images.map((image, index) => (
                                                <Image
                                                    key={index}
                                                    src={image}
                                                    alt="review"
                                                    width={64}
                                                    height={64}
                                                    preview={{ mask: 'Xem ảnh' }}
                                                    style={{ borderRadius: 8, objectFit: 'cover' }}
                                                />
                                            ))}
                                        </Space>
                                    </Image.PreviewGroup>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="d-flex justify-content-center mt-4">
                    <Pagination
                        current={filters.pageNum}
                        pageSize={filters.pageSize}
                        total={meta.totalElements}
                        onChange={handleChangePage}
                        showSizeChanger
                        onShowSizeChange={handleChangeRowsPerPage}
                    />
                </div>
            </div>
        </>
    );
}

export default ReviewSection;
