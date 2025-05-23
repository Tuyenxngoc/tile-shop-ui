import { Alert, Button, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { getNews } from '~/services/newsService';
import { formatDate } from '~/utils';

function Dcs({ title, filter }) {
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

            <div className="col-md-6">
                <Link to={`/tin-tuc/${firstItem.slug}`}>
                    <img src={firstItem.imageUrl} alt={firstItem.title} className="img-fluid rounded-3" />
                </Link>

                <div>
                    <Link to={`/tin-tuc/${firstItem.slug}`} className="text-dark fs-5 text-decoration-none">
                        <h3 className="fw-semibold fs-6 mb-3">{firstItem.title}</h3>
                    </Link>
                    <div className="small text-muted d-flex align-items-center gap-2">
                        <FaClock />
                        {formatDate(firstItem.createdDate)}
                        &nbsp;&nbsp; Admin
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="row">
                    {nextItems.map((news, index) => (
                        <div key={index} className="col-md-6">
                            <Link to={`/tin-tuc/${news.slug}`}>
                                <img src={news.imageUrl} alt={news.title} className="img-fluid rounded-3" />
                            </Link>

                            <div>
                                <Link to={`/tin-tuc/${news.slug}`} className="text-dark fs-5 text-decoration-none">
                                    <h3 className="fw-semibold fs-6 mb-3">{news.title}</h3>
                                </Link>
                                <div className="small text-muted d-flex align-items-center gap-2">
                                    <FaClock />
                                    {formatDate(news.createdDate)}
                                    &nbsp;&nbsp; Admin
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-12 text-center mt-2 mb-5">
                <Button>Xem tất cả</Button>
            </div>
        </div>
    );
}

export default Dcs;
