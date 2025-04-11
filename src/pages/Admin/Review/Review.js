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
import { FaRegTrashAlt } from 'react-icons/fa';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

import queryString from 'query-string';

import { INITIAL_FILTERS, INITIAL_META } from '~/constants';
import { approveReview, deleteReview, getReviews, rejectReview } from '~/services/reviewService';
import { FaStar } from 'react-icons/fa6';

const options = [
    { value: 'id', label: 'ID' },
    { value: 'title', label: 'Tiêu đề' },
    { value: 'category', label: 'Danh mục' },
];

function Review() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

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

    const handleApprove = async (id) => {
        try {
            // Gọi API duyệt sản phẩm
            await approveReview(id);
            message.success('Sản phẩm đã được duyệt!');
            // Cập nhật lại danh sách nếu cần
        } catch (error) {
            console.error('Lỗi khi duyệt:', error);
            message.error('Duyệt sản phẩm thất bại!');
        }
    };

    const handleReject = async (id) => {
        try {
            // Gọi API từ chối duyệt sản phẩm
            await rejectReview(id);
            message.success('Đã từ chối duyệt sản phẩm!');
            // Cập nhật lại danh sách nếu cần
        } catch (error) {
            console.error('Lỗi khi từ chối:', error);
            message.error('Từ chối duyệt sản phẩm thất bại!');
        }
    };

    const handleDeleteEntity = async (id) => {
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
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            showSorterTooltip: false,
            render: (text, record) => (
                <div className="row g-2">
                    <div className="col-2">
                        <img src={record.imageUrl} alt={text} width={56} className="img-fluid" />
                    </div>
                    <div className="col-10" style={{ maxWidth: 300 }}>
                        <Tooltip title={text}>
                            <span className="text-truncate-2">{text}</span>
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
            fixed: 'right',
            sorter: true,
            showSorterTooltip: false,
            render: (text, record) => (
                <div className="text-center">
                    {text === 'PENDING' && <Tag color="gold">Chờ duyệt</Tag>}
                    {text === 'APPROVED' && <Tag color="green">Đã duyệt</Tag>}
                    {text === 'REJECTED' && <Tag color="red">Đã từ chối</Tag>}
                </div>
            ),
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
                        description={'Bạn có chắc muốn xóa sản phẩm này không?'}
                        onConfirm={() => handleDeleteEntity(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="text" danger icon={<FaRegTrashAlt />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const onChange = (key) => {
        console.log(key);
    };

    const items = Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;
        return {
            key: `${starValue}`,
            label: (
                <div className="d-flex align-items-center">
                    {starValue}
                    <FaStar color="#fcb415" style={{ marginLeft: 4 }} />
                </div>
            ),
        };
    });

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
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
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
                </Space>

                <div>
                    <Space wrap size="middle">
                        <Button type="default">Có nội dung</Button>
                        <Button type="default">Có hình ảnh</Button>
                    </Space>
                </div>
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
