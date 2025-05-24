import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Menu } from 'antd';
import { getNewsCategories } from '~/services/newsCategoryService';
import NewsSection from './NewsSection';

function NewsList() {
    const [categories, setCategories] = useState([]);

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

    const menuItems = useMemo(
        () =>
            categories.map((category) => ({
                key: category.id,
                label: <Link to={`/tin-tuc?danh-muc=${category.slug}`}>{category.name}</Link>,
            })),
        [categories],
    );

    return (
        <>
            <div className="bg-white">
                <div className="container">
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
                        ]}
                    />

                    <Menu mode="horizontal" selectable={false} style={{ borderBottom: 'none' }} items={menuItems} />
                </div>
            </div>

            <div className="container">
                {categories.map((category, index) => (
                    <NewsSection
                        key={index}
                        title={category.name}
                        filter={{ searchBy: 'categorySlug', keyword: category.slug }}
                    />
                ))}
            </div>
        </>
    );
}

export default NewsList;
