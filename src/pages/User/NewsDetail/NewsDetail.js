import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Breadcrumb, Menu, Spin } from 'antd';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import { FaClock } from 'react-icons/fa6';
import Policy from '~/components/Policy';
import { getNewsCategories } from '~/services/newsCategoryService';
import { getNews, getNewsBySlug } from '~/services/newsService';

function NewsDetail() {
    const { id } = useParams();

    const [entityData, setEntityData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [relatedNews, setRelatedNews] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getNewsBySlug(id);
                const { data } = response.data;
                setEntityData(data);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntities();
    }, [id]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getNewsCategories();
                const { items } = response.data.data;
                setCategories(items);
            } catch (error) {
                console.error('Lỗi tải danh mục:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchRelated = async () => {
            if (entityData?.category?.id) {
                try {
                    const response = await getNews({
                        excludeId: entityData.id,
                        searchBy: 'categoryId',
                        keyword: entityData.category.id,
                    });
                    const { items } = response.data.data;
                    setRelatedNews(items);
                } catch (error) {
                    console.error('Lỗi tải bài viết liên quan:', error);
                }
            }
        };

        fetchRelated();
    }, [entityData, id]);

    const menuItems = categories.map((category) => ({
        key: category.id,
        label: <Link to={`/tin-tuc?danh-muc=${category.id}`}>{category.name}</Link>,
    }));

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
            <div className="container">
                <div className="row">
                    <Breadcrumb
                        className="py-4"
                        separator=">"
                        itemRender={(route) => {
                            if (route.to) {
                                return <Link to={route.to}>{route.title}</Link>;
                            }
                            return <span>{route.title}</span>;
                        }}
                        items={[
                            { title: 'Trang chủ', to: '/' },
                            { title: 'Tin tức', to: '/tin-tuc' },
                            { title: entityData.category.name, to: `/tin-tuc?danh-muc=${entityData.category.id}` },
                            { title: entityData.title },
                        ]}
                    />
                </div>

                <div className="row">
                    <Menu mode="horizontal" selectable={false} style={{ borderBottom: 'none' }} items={menuItems} />
                </div>
            </div>

            <div className="row" style={{ position: 'relative' }}>
                <div
                    className="col-12"
                    style={{ backgroundColor: '#F4F4F4', height: 434, position: 'absolute', zIndex: 0 }}
                />
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="row">
                    <div className="col-12" style={{ maxWidth: 700, marginRight: 'auto', marginLeft: 'auto' }}>
                        <div className="text-center">
                            <h1 className="mt-5">{entityData.title}</h1>
                        </div>

                        <div className="small text-muted d-flex align-items-center justify-content-center gap-2">
                            <FaClock />
                            {dayjs(entityData.createdDate).format('DD/MM/YYYY')}
                            &nbsp;&nbsp; Admin
                        </div>

                        <img src={entityData.imageUrl} className="img-fluid rounded-3 my-3" alt={entityData.title} />
                        <div>{entityData.description}</div>
                        <ReactQuill value={entityData.content} readOnly={true} theme="bubble" />
                    </div>
                </div>

                <div className="row mb-3">
                    <h4 className="mt-3 mb-4">Bài viết liên quan</h4>
                    {relatedNews.map((news, index) => (
                        <div key={index} className="col-md-3 mb-4">
                            <Link to={`/tin-tuc/${news.slug}`}>
                                <img src={news.imageUrl} alt={news.title} className="img-fluid rounded-3" />
                            </Link>

                            <div>
                                <Link to={`/tin-tuc/${news.slug}`} className="text-dark fs-5 text-decoration-none">
                                    <h3 className="fw-semibold fs-6 mb-3">{news.title}</h3>
                                </Link>
                                <div className="small text-muted d-flex align-items-center gap-2">
                                    <FaClock />
                                    {dayjs(news.createdDate).format('DD/MM/YYYY')}
                                    &nbsp;&nbsp; Admin
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row">
                    <Policy />
                </div>
            </div>
        </>
    );
}

export default NewsDetail;
