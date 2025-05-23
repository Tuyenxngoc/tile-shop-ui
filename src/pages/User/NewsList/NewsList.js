import { Breadcrumb, Card, Col, List, Menu, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNewsCategories } from '~/services/newsCategoryService';

const { Title, Text } = Typography;

function NewsList() {
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);

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
        // Fetch API dữ liệu nổi bật (ở đây mình demo với mock data)
        const fetchPosts = async () => {
            // Ví dụ gọi API thật
            // const response = await axios.get('/api/featured-posts');
            // setPosts(response.data);

            // Mock data
            setPosts([
                {
                    id: 1,
                    title: 'CHÀO HÈ RỰC RỠ - DEAL SỐC BẤT NGỜ 🎉',
                    image: '/images/deal-hot.png',
                    description: 'Thời điểm vàng để xây dựng và hoàn thiện tổ ấm đã tới...',
                    author: 'Lã Anh Thơ',
                    date: '30/04/2025',
                    link: '/tin-tuc/deal-soc-bat-ngo',
                },
                {
                    id: 2,
                    title: '100+ ý tưởng nhà cấp 4 đẹp, thịnh hành nhất hiện nay',
                    image: '/images/nha-cap-4.png',
                    author: 'Lâm Nguyễn Tường Vy',
                    date: '25/08/2024',
                    link: '/tin-tuc/y-tuong-nha-cap-4',
                },
                {
                    id: 3,
                    title: 'Top 30+ mẫu biệt thự 2 tầng hiện đại đẹp không thể bỏ qua',
                    image: '/images/biet-thu-2-tang.png',
                    author: 'Lâm Nguyễn Tường Vy',
                    date: '20/08/2024',
                    link: '/tin-tuc/biet-thu-2-tang',
                },
                // ... thêm bài
            ]);
        };

        fetchPosts();
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

            <Title level={3} className="my-4">
                Nổi bật
            </Title>

            <Row gutter={[16, 16]}>
                {posts.map((post) => (
                    <Col xs={24} sm={12} md={8} key={post.id}>
                        <Link to={post.link}>
                            <Card hoverable cover={<img alt={post.title} src={post.image} />}>
                                <Title level={5}>{post.title}</Title>
                                {post.description && <Text type="secondary">{post.description}</Text>}
                                <div style={{ marginTop: 12 }}>
                                    <Text type="secondary">
                                        📅 {post.date} • ✍️ {post.author}
                                    </Text>
                                </div>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default NewsList;
