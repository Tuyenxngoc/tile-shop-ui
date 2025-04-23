import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Breadcrumb, Menu, Spin } from 'antd';
import Policy from '~/components/Policy';
import { getNewsCategories } from '~/services/newsCategoryService';
import { getNewsBySlug } from '~/services/newsService';

function NewsDetail() {
    const { id } = useParams();

    const [entityData, setEntityData] = useState(null);
    const [categories, setCategories] = useState([]);

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

    const menuItems = categories.map((category) => ({
        key: category.id,
        label: <Link to={`/tin-tuc/${category.slug}`}>{category.name}</Link>,
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
                        items={[
                            { title: 'Trang chủ', href: '/' },
                            { title: 'Tin tức', href: '/tin-tuc' },
                            { title: entityData.category.name, href: `/tin-tuc?danh-muc=${entityData.category.id}` },
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
                    <div className="col-md-12" style={{ maxWidth: 700, marginRight: 'auto', marginLeft: 'auto' }}>
                        <div className="title-block-page text-center">
                            <h1 className="title-head uppercase mb-0 pb-1 pt-5 fs-40 " style={{ borderBottom: 'none' }}>
                                {entityData.title}
                            </h1>
                        </div>
                        <div className="row py-2 text-center">
                            <div className="col-12">
                                <div style={{ width: 45, paddingRight: 0, display: 'inline-block' }}>
                                    <img
                                        src="https://nshpos.com/Web/Resources/Uploaded/18/images/tintuc/blog/p4(1).jpg"
                                        className="img-fluid rounded-50"
                                        alt="avt"
                                    />
                                </div>
                                <div style={{ paddingTop: 5, display: 'inline-block' }}>
                                    <div className="fs-7">
                                        <i className="fa fa-clock-o" aria-hidden="true" />
                                        &nbsp;04/04/2025 &nbsp;
                                        <i className="fa fa-circle" aria-hidden="true">
                                            &nbsp;
                                        </i>
                                        Lã Anh Thơ
                                    </div>
                                </div>
                            </div>
                        </div>
                        <img src={entityData.imageUrl} className="img-fluid rounded-3 my-3" alt={entityData.title} />
                        <div
                            className="content-page v-base article-content"
                            dangerouslySetInnerHTML={{ __html: entityData.content }}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <h4 className="mt-3 mb-4">Bài viết liên quan</h4>
                </div>

                <div className="row">
                    <Policy />
                </div>
            </div>
        </>
    );
}

export default NewsDetail;
