import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Flex, Image, Input, message, Popconfirm, Select, Space, Table, Tooltip } from 'antd';
import { MdOutlineModeEdit } from 'react-icons/md';
import { FaEye, FaRegTrashAlt } from 'react-icons/fa';

import { INITIAL_FILTERS, INITIAL_META } from '~/constants';
import { deleteNews, getNews } from '~/services/newsService';
import { formatDate } from '~/utils';

const options = [
    { value: 'id', label: 'ID' },
    { value: 'title', label: 'Tiêu đề' },
    { value: 'categoryName', label: 'Tên danh mục' },
];

function News() {
    const navigate = useNavigate();

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

    const handleDeleteEntity = async (id) => {
        try {
            const response = await deleteNews(id);
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
                const response = await getNews(filters);
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
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => formatDate(text),
        },
        {
            title: 'Ngày chỉnh sửa',
            dataIndex: 'lastModifiedDate',
            key: 'lastModifiedDate',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => formatDate(text),
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => (
                <div style={{ maxWidth: 200 }}>
                    <Tooltip title={text}>
                        <span className="text-truncate-2">{text}</span>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: 'Đường dẫn',
            dataIndex: 'slug',
            key: 'slug',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => (
                <div style={{ maxWidth: 200 }}>
                    <Tooltip title={text}>
                        <span className="text-truncate-2">{text}</span>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => (
                <div style={{ maxWidth: 300 }}>
                    <Tooltip title={text}>
                        <span className="text-truncate-2">{text}</span>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: 'Ảnh bìa',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            align: 'center',
            render: (text) => (
                <Image
                    src={text}
                    alt="review"
                    width={56}
                    height={56}
                    preview={{ mask: 'Xem ảnh' }}
                    className="rounded-2"
                />
            ),
        },
        {
            title: 'Lượt xem',
            dataIndex: 'viewCount',
            key: 'viewCount',
            align: 'center',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (text) => text.name,
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<FaEye />} href={`/tin-tuc/${record.slug}`} target="_blank" />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa tin tức">
                        <Button
                            type="text"
                            icon={<MdOutlineModeEdit />}
                            onClick={() => navigate(`edit/${record.id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa tin tức">
                        <Popconfirm
                            title="Thông báo"
                            description={'Bạn có chắc muốn xóa tin tức này không?'}
                            onConfirm={() => handleDeleteEntity(record.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Button type="text" danger icon={<FaRegTrashAlt />} />
                        </Popconfirm>
                    </Tooltip>
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

            <Flex wrap justify="space-between" align="center">
                <h2>Quản lý tin tức</h2>
                <Space>
                    <Space.Compact className="my-2">
                        <Select
                            options={options}
                            disabled={isLoading}
                            value={activeFilterOption}
                            onChange={(value) => setActiveFilterOption(value)}
                            style={{ width: 200 }}
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

                    <Button type="primary" onClick={() => navigate('new')}>
                        Thêm mới
                    </Button>
                </Space>
            </Flex>

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
    );
}

export default News;
