import { useEffect, useState } from 'react';
import { Alert, Button, Pagination, Progress, Rate, Spin } from 'antd';

import { FaStar } from 'react-icons/fa6';

import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { INITIAL_FILTERS, INITIAL_META } from '~/constants';
import { getReviewsByProductId, getReviewSummaryByProductId } from '~/services/reviewService';
import queryString from 'query-string';

dayjs.extend(relativeTime);

const cx = classNames.bind(styles);

function ReviewSection({ productId }) {
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [summary, setSummary] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

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

    const handleSortChange = (pagination, filters, sorter) => {
        const sortOrder = sorter.order === 'ascend' ? true : sorter.order === 'descend' ? false : undefined;
        setFilters((prev) => ({
            ...prev,
            sortBy: sorter.field,
            isAscending: sortOrder,
        }));
    };

    useEffect(() => {
        if (!productId) return;

        const fetchData = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const [summaryRes, reviewsRes] = await Promise.all([
                    getReviewSummaryByProductId(productId),
                    getReviewsByProductId(productId, params),
                ]);

                setSummary(summaryRes.data.data || {});

                const { meta, items } = reviewsRes.data.data;
                setReviews(items);
                setMeta(meta);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
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

                <Button type="primary" block>
                    ĐÁNH GIÁ NGAY
                </Button>

                <div className={cx('comment-list')}>
                    <hr />
                    {reviews.length === 0 ? (
                        <div>Chưa có đánh giá nào.</div>
                    ) : (
                        reviews.map((review) => (
                            <div className={cx('comment')} key={review.id}>
                                <hr />
                                <strong>{review.customer.name}</strong>
                                <Rate value={review.rating} disabled className="ms-2" />
                                <div>{review.comment}</div>
                                <span className="text-gray-500">{dayjs(review.createdDate).fromNow()}</span>
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
