import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Flex, Image, Input, message, Popconfirm, Select, Space, Table, Tooltip } from 'antd';
import { MdOutlineModeEdit } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { AiOutlineBars } from 'react-icons/ai';
import { PiListStarBold } from 'react-icons/pi';

import queryString from 'query-string';

import { INITIAL_FILTERS, INITIAL_META } from '~/constants';
import { deleteProduct, getProducts } from '~/services/productService';
import { formatCurrency } from '~/utils/utils';

const options = [
    { value: 'id', label: 'ID' },
    { value: 'title', label: 'Tiêu đề' },
    { value: 'category', label: 'Danh mục' },
];

function Product() {
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
            const response = await deleteProduct(id);
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
                const response = await getProducts(params);
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
                <div className="d-flex align-items-start gap-2">
                    <Image
                        src={record.imageUrl}
                        alt="review"
                        width={56}
                        height={56}
                        preview={{ mask: 'Xem ảnh' }}
                        className="rounded-2"
                    />
                    <div style={{ maxWidth: 300 }}>
                        <Tooltip title={text}>
                            <span className="text-truncate-2">{text}</span>
                        </Tooltip>
                    </div>
                </div>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            showSorterTooltip: false,
            render: (price) => formatCurrency(price),
        },
        {
            title: 'Giảm giá (%)',
            dataIndex: 'discountPercentage',
            key: 'discountPercentage',
            sorter: true,
            showSorterTooltip: false,
            render: (discount) => `${discount}%`,
        },
        {
            title: 'Kho hàng',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Đánh giá TB',
            dataIndex: 'averageRating',
            key: 'averageRating',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space direction="vertical">
                    <Space>
                        <Button type="text" icon={<AiOutlineBars />} href={`/san-pham/${record.slug}`} target="_blank">
                            Thông tin
                        </Button>

                        <Button type="text" icon={<MdOutlineModeEdit />} onClick={() => navigate(`edit/${record.id}`)}>
                            Chỉnh sửa
                        </Button>
                    </Space>

                    <Space>
                        <Button
                            type="text"
                            icon={<PiListStarBold />}
                            onClick={() =>
                                navigate('/admin/reviews', { state: { searchBy: 'id', keyword: record.id } })
                            }
                        >
                            Xem đánh giá
                        </Button>

                        <Popconfirm
                            title="Thông báo"
                            description={'Bạn có chắc muốn xóa sản phẩm này không?'}
                            onConfirm={() => handleDeleteEntity(record.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Button type="text" danger icon={<FaRegTrashAlt />}>
                                Xóa
                            </Button>
                        </Popconfirm>
                    </Space>
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
                <h2>Sản phẩm</h2>
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

export default Product;
