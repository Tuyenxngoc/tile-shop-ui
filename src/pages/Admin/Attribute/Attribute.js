import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Checkbox,
    Flex,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
} from 'antd';
import { MdOutlineModeEdit } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';

import { INITIAL_FILTERS, INITIAL_META } from '~/constants';
import { createAttribute, deleteAttribute, updateAttribute, getAttributes } from '~/services/attributeService';
import { formatDate } from '~/utils';

const options = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Tên' },
];

function Attribute() {
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [entityData, setEntityData] = useState(null);

    const [searchInput, setSearchInput] = useState('');
    const [activeFilterOption, setActiveFilterOption] = useState(options[0].value);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    // Modal thêm mới
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm] = Form.useForm();

    // Modal chỉnh sửa
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editForm] = Form.useForm();

    const showAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        addForm.resetFields();
    };

    const showEditModal = (record) => {
        setEditingItem(record);
        editForm.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        editForm.resetFields();
    };

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

    const handleCreateEntity = async (values) => {
        try {
            const response = await createAttribute(values);
            if (response.status === 201) {
                const { data, message } = response.data.data;
                messageApi.success(message);

                // Cập nhật lại danh sách sau khi thêm mới
                setEntityData((prevData) => [data, ...prevData]);
                closeAddModal();
            }
        } catch (error) {
            messageApi.error('Lỗi: ' + error.message);
        }
    };

    const handleUpdateEntity = async (values) => {
        try {
            const response = await updateAttribute(editingItem.id, values);
            if (response.status === 200) {
                const { data, message } = response.data.data;
                messageApi.success(message);

                // Cập nhật lại danh sách sau khi sửa
                setEntityData((prevData) => prevData.map((item) => (item.id === editingItem.id ? data : item)));
                closeEditModal();
            }
        } catch (error) {
            messageApi.error('Lỗi: ' + error.message);
        }
    };

    const handleDeleteEntity = async (id) => {
        try {
            const response = await deleteAttribute(id);
            if (response.status === 200) {
                setEntityData((prev) => prev.filter((a) => a.id !== id));

                messageApi.success(response.data.data.message);
            }
        } catch (error) {
            messageApi.error('Lỗi: ' + error.message);
        }
    };

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getAttributes(filters);
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
            title: 'Tên thuộc tính',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Giá trị mặc định',
            dataIndex: 'defaultValue',
            key: 'defaultValue',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => text || 'Không có',
        },
        {
            title: 'Bắt buộc nhập',
            dataIndex: 'isRequired',
            key: 'isRequired',
            align: 'center',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => (text ? <Tag color="red">Có</Tag> : <Tag color="green">Không</Tag>),
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa thuộc tính">
                        <Button type="text" icon={<MdOutlineModeEdit />} onClick={() => showEditModal(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa thuộc tính">
                        <Popconfirm
                            title="Thông báo"
                            description={'Bạn có chắc muốn xóa thuộc tính này không?'}
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

            {/* Modal thêm mới */}
            <Modal title="Thêm mới thuộc tính" open={isAddModalOpen} onOk={addForm.submit} onCancel={closeAddModal}>
                <Form form={addForm} layout="vertical" onFinish={handleCreateEntity}>
                    <Form.Item
                        label="Tên thuộc tính"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên thuộc tính' }]}
                    >
                        <Input placeholder="Nhập tên thuộc tính" autoComplete="off" />
                    </Form.Item>
                    <Form.Item label="Giá trị mặc định" name="defaultValue">
                        <Input placeholder="Nhập giá trị mặc định" />
                    </Form.Item>
                    <Form.Item name="isRequired" valuePropName="checked">
                        <Checkbox>Bắt buộc nhập</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal chỉnh sửa */}
            <Modal title="Sửa thuộc tính" open={isEditModalOpen} onOk={editForm.submit} onCancel={closeEditModal}>
                <Form form={editForm} layout="vertical" onFinish={handleUpdateEntity}>
                    <Form.Item
                        label="Tên thuộc tính"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên thuộc tính' }]}
                    >
                        <Input placeholder="Nhập tên thuộc tính" autoComplete="off" />
                    </Form.Item>
                    <Form.Item label="Giá trị mặc định" name="defaultValue">
                        <Input placeholder="Nhập giá trị mặc định" />
                    </Form.Item>
                    <Form.Item name="isRequired" valuePropName="checked">
                        <Checkbox>Bắt buộc nhập</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>

            <Flex wrap justify="space-between" align="center">
                <h2>Quản lý thuộc tính</h2>
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

                    <Button type="primary" onClick={showAddModal}>
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

export default Attribute;
