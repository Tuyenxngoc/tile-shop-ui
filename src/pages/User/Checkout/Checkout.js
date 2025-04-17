import { useEffect, useState } from 'react';
import { Alert, Checkbox, Input, Radio, Spin } from 'antd';
import { getCartItems } from '~/services/cartService';
import OrderItem from '~/components/OrderItem';
import ProvinceSelector from '~/components/ProvinceSelector';
import { TextInput } from '~/components/FormInput';

function Checkout() {
    const [entityData, setEntityData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getCartItems();
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
    }, []);

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
        <div className="container mt-5 mb-5">
            <div className="row">
                <div className="col-md-4 order-md-2 mb-4">
                    <h4 className="mb-3">Giỏ hàng của bạn</h4>
                    {entityData.map((item, index) => (
                        <OrderItem key={index} data={item} />
                    ))}
                </div>

                <div className="col-md-8 order-md-1">
                    <div className="row g-3">
                        <div className="col-12">
                            <h4 className="mb-3">Thông tin khách hàng</h4>
                        </div>

                        <Radio.Group
                            size="large"
                            value={1}
                            options={[
                                { value: 1, label: 'Anh' },
                                { value: 2, label: 'Chị' },
                            ]}
                        />

                        <TextInput className="col-12" size="large" label="Nhập họ tên" />
                        <TextInput className="col-12" size="large" label="Nhập số điện thoại" />
                        <TextInput className="col-12" size="large" label="Nhập email" />

                        <div className="col-12">
                            <h4 className="mb-3">Chọn cách thức giao hàng</h4>

                            <Radio.Group
                                size="large"
                                value={1}
                                options={[
                                    { value: 1, label: 'Giao hàng tận nơi' },
                                    { value: 2, label: 'Nhận tại cửa hàng' },
                                ]}
                            />
                            <ProvinceSelector />
                        </div>

                        <div className="col-12">
                            <Input placeholder="Yêu cầu khác" size="large" />

                            <Checkbox>Yêu cầu xuất hóa đơn công ty (Vui lòng điền email để nhận hóa đơn VAT) </Checkbox>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
