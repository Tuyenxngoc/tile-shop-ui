import { Breadcrumb, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNewsCategories } from '~/services/newsCategoryService';
import Dcs from './cc';
import Search from 'antd/es/transfer/search';

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

    const menuItems = categories.map((category) => ({
        key: category.id,
        label: <Link to={`/tin-tuc?danh-muc=${category.slug}`}>{category.name}</Link>,
    }));

    return (
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
                    ]}
                />
            </div>

            <div className="row">
                <Menu mode="horizontal" selectable={false} style={{ borderBottom: 'none' }} items={menuItems} />
            </div>

            {categories.map((category, index) => (
                <Dcs key={index} title={category.name} filter={{ searchBy: 'categorySlug', keyword: category.slug }} />
            ))}
        </div>
    );
}

export default NewsList;
