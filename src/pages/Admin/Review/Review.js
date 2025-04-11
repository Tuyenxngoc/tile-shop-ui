import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Image,
    Input,
    message,
    Popconfirm,
    Rate,
    Select,
    Space,
    Table,
    Tabs,
    Tag,
    theme,
    Tooltip,
} from 'antd';
import { FaStar } from 'react-icons/fa6';
import { FaRegTrashAlt } from 'react-icons/fa';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

import queryString from 'query-string';

import { INITIAL_FILTERS, INITIAL_META } from '~/constants';
import { approveReview, deleteReview, getReviews, rejectReview } from '~/services/reviewService';

const options = [
    { value: 'name', label: 'Tên sản phẩm' },
    { value: 'category', label: 'Danh mục' },
];

const statusOptions = [
    { value: 'PENDING', label: 'Chờ duyệt' },
    { value: 'APPROVED', label: 'Đã duyệt' },
    { value: 'REJECTED', label: 'Đã từ chối' },
];

const statusTagMap = {
    PENDING: <Tag color="gold">Chờ duyệt</Tag>,
    APPROVED: <Tag color="green">Đã duyệt</Tag>,
    REJECTED: <Tag color="red">Đã từ chối</Tag>,
};

const ratingTabs = [
    {
        key: 'all',
        label: 'Tất cả',
    },
    ...Array.from({ length: 5 }, (_, i) => {
        const starValue = 5 - i;
        return {
            key: `${starValue}`,
            label: `${starValue}`,
            icon: <FaStar color="#fcb415" />,
        };
    }),
];

function Review() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState({
        ...INITIAL_FILTERS,
        rating: undefined,
        hasContent: undefined,
        hasImage: undefined,
        status: undefined,
    });

    const [entityData, setEntityData] = useState(null);

    const [searchInput, setSearchInput] = useState('');
    const [activeFilterOption, setActiveFilterOption] = useState(options[0].value);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

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

    const handleSearch = (searchBy, keyword) => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            searchBy: searchBy || activeFilterOption,
            keyword: keyword || searchInput,
        }));
    };

    const handleRatingFilter = (key) => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            rating: key === 'all' ? undefined : key,
        }));
    };

    const handleStatusChange = (value) => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            status: value,
        }));
    };

    const handleApprove = async (id) => {
        try {
            const response = await approveReview(id);
            if (response.status === 200) {
                const { message, data } = response.data.data;
                messageApi.success(message);

                setEntityData((prev) => prev.map((item) => (item.id === id ? data : item)));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Duyệt đánh giá sản phẩm thất bại!';
            messageApi.error(errorMessage);
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await rejectReview(id);
            if (response.status === 200) {
                const { message, data } = response.data.data;
                messageApi.success(message);

                setEntityData((prev) => prev.map((item) => (item.id === id ? data : item)));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Từ chối duyệt đánh giá sản phẩm thất bại!';
            messageApi.error(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await deleteReview(id);
            if (response.status === 200) {
                setEntityData((prev) => prev.filter((a) => a.id !== id));

                messageApi.success(response.data.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa.';
            messageApi.error(errorMessage);
        }
    };

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getReviews(params);
                const { meta, items } = response.data.data;
                setEntityData(items);
                setMeta(meta);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntities();
    }, [filters]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (product) => (
                <div className="d-flex align-items-start gap-2">
                    <Image
                        src={product.imageUrl}
                        alt="review"
                        width={56}
                        height={56}
                        preview={{ mask: 'Xem ảnh' }}
                        className="rounded-2"
                    />
                    <div style={{ maxWidth: 300 }}>
                        <Tooltip title={product.name}>
                            <span className="text-truncate-2">{product.name}</span>
                        </Tooltip>
                    </div>
                </div>
            ),
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Rate value={text} disabled />
                    <span style={{ fontWeight: 'bold', color: '#faad14', fontSize: '16px' }}>{text}/5</span>
                </div>
            ),
        },
        {
            title: 'Nội dung',
            dataIndex: 'comment',
            key: 'comment',
            width: 400,
            sorter: true,
            showSorterTooltip: false,
            render: (text, record) => (
                <div>
                    <Tooltip title={text}>
                        <span className="text-truncate-2">{text}</span>
                    </Tooltip>

                    {record.images.length > 0 && (
                        <Image.PreviewGroup>
                            <Space size={4} className="mt-2">
                                {record.images.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image}
                                        alt="review"
                                        width={56}
                                        height={56}
                                        preview={{ mask: 'Xem ảnh' }}
                                        className="rounded-2"
                                    />
                                ))}
                            </Space>
                        </Image.PreviewGroup>
                    )}
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            fixed: 'right',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => statusTagMap[text] || null,
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    {record.status === 'PENDING' && (
                        <>
                            <Button type="text" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>
                                Duyệt
                            </Button>
                            <Button type="text" danger icon={<CloseOutlined />} onClick={() => handleReject(record.id)}>
                                Từ chối
                            </Button>
                        </>
                    )}
                    <Popconfirm
                        title="Thông báo"
                        description={'Bạn có chắc muốn xóa đánh giá này không?'}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="text" danger icon={<FaRegTrashAlt />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (errorMessage) {
        return <Alert message="Lỗi" description={errorMessage} type="error" />;
    }

    return (
        <div>
            {contextHolder}

            <div
                style={{
                    padding: 24,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    boxShadow: '0 1px 4px rgba(0, 0, 0, .12)',
                    marginBottom: 16,
                }}
            >
                <h2>Đánh giá sản phẩm</h2>
                <Tabs defaultActiveKey="all" items={ratingTabs} onChange={handleRatingFilter} />
            </div>

            <div
                style={{
                    padding: 24,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    boxShadow: '0 1px 4px rgba(0, 0, 0, .12)',
                    marginBottom: 16,
                }}
            >
                <Space direction="vertical" size="middle">
                    <Space>
                        <Space.Compact className="my-2">
                            <Select
                                options={options}
                                disabled={isLoading}
                                value={activeFilterOption}
                                onChange={(value) => setActiveFilterOption(value)}
                            />
                            <Input
                                allowClear
                                name="searchInput"
                                placeholder="Nhập từ cần tìm..."
                                value={searchInput}
                                disabled={isLoading}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <Button type="primary" loading={isLoading} onClick={() => handleSearch()}>
                                Tìm
                            </Button>
                        </Space.Compact>

                        <Select
                            placeholder="Trạng thái"
                            allowClear
                            disabled={isLoading}
                            style={{ width: 160 }}
                            value={filters.status}
                            onChange={handleStatusChange}
                            options={statusOptions}
                        />
                    </Space>

                    <Space wrap size="middle">
                        <Button
                            type={filters.hasContent ? 'primary' : 'default'}
                            onClick={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    hasContent: prev.hasContent === true ? undefined : true,
                                    pageNum: 1,
                                }))
                            }
                        >
                            Có nội dung
                        </Button>

                        <Button
                            type={filters.hasImage ? 'primary' : 'default'}
                            onClick={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    hasImage: prev.hasImage === true ? undefined : true,
                                    pageNum: 1,
                                }))
                            }
                        >
                            Có hình ảnh
                        </Button>
                    </Space>
                </Space>
            </div>
            <div
                style={{
                    padding: 24,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    boxShadow: '0 1px 4px rgba(0, 0, 0, .12)',
                    marginBottom: 16,
                }}
            >
                <h6>Số đánh giá {meta.totalElements}</h6>

                <Table
                    bordered
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    dataSource={entityData}
                    columns={columns}
                    loading={isLoading}
                    onChange={handleSortChange}
                    pagination={{
                        current: filters.pageNum,
                        pageSize: filters.pageSize,
                        total: meta.totalElements,
                        onChange: handleChangePage,
                        showSizeChanger: true,
                        onShowSizeChange: handleChangeRowsPerPage,
                    }}
                />
            </div>
        </div>
    );
}

export default Review;
