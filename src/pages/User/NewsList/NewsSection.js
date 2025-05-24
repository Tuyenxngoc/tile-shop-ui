import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';
import { Alert, Button, Spin } from 'antd';
import NewsCard from '~/components/New/NewsCard';
import { getNews } from '~/services/newsService';

function NewsSection({ title, filter }) {
    const navigate = useNavigate();
    const [entityData, setEntityData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getNews({ pageNum: 1, pageSize: 5, ...filter });
                const { items } = response.data.data;
                setEntityData(items);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntities();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    if (entityData && entityData.length === 0) {
        return null;
    }

    const firstItem = entityData[0];
    const nextItems = entityData.slice(1, 5);

    return (
        <div className="row">
            <div className="col-12">
                <h2 className="fs-4 mt-3 my-4">{title}</h2>
            </div>

            <NewsCard className="col-md-6" news={firstItem} />

            <div className="col-md-6">
                <div className="row">
                    {nextItems.map((news, index) => (
                        <NewsCard key={index} news={news} className="col-md-6" />
                    ))}
                </div>
            </div>

            <div className="col-12 text-center mt-2 mb-5">
                <Button onClick={() => navigate('/')} icon={<FaAngleRight />} iconPosition="end">
                    Xem tất cả
                </Button>
            </div>
        </div>
    );
}

export default NewsSection;
