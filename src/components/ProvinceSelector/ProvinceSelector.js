import { useEffect, useState } from 'react';
import { Select, Input } from 'antd';
import { getDistrictsByProvince, getProvinces, getWardsByDistrict } from '~/services/addressService';

const AddressSelector = ({ onChange }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [houseNumber, setHouseNumber] = useState('');

    useEffect(() => {
        // Lấy danh sách tỉnh/thành
        const fetchProvinces = async () => {
            try {
                const response = await getProvinces();
                setProvinces(response.data);
            } catch (error) {
                console.error('Lỗi khi tải danh sách tỉnh/thành:', error);
            }
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (value) => {
        setSelectedProvince(value);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setWards([]);
        setHouseNumber('');

        if (value) {
            try {
                const response = await getDistrictsByProvince(value);
                setDistricts(response.data.districts || []);
            } catch (error) {
                console.error('Lỗi khi tải danh sách quận/huyện:', error);
            }
        }
    };

    const handleDistrictChange = async (value) => {
        setSelectedDistrict(value);
        setSelectedWard(null);
        setHouseNumber('');

        if (value) {
            try {
                const response = await getWardsByDistrict(value);
                setWards(response.data.wards || []);
            } catch (error) {
                console.error('Lỗi khi tải danh sách phường/xã:', error);
            }
        }
    };

    const handleWardChange = (value) => {
        setSelectedWard(value);
    };

    const handleHouseNumberChange = (e) => {
        setHouseNumber(e.target.value);
    };

    useEffect(() => {
        if (selectedProvince && selectedDistrict && selectedWard && houseNumber) {
            const province = provinces.find((p) => p.code === selectedProvince)?.name || '';
            const district = districts.find((d) => d.code === selectedDistrict)?.name || '';
            const ward = wards.find((w) => w.code === selectedWard)?.name || '';

            const fullAddress = `${houseNumber}, ${ward}, ${district}, ${province}`;

            onChange?.({
                provinceCode: selectedProvince,
                districtCode: selectedDistrict,
                wardCode: selectedWard,
                houseNumber,
                fullAddress,
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProvince, selectedDistrict, selectedWard, houseNumber]);

    return (
        <div className="row g-3">
            {/* Tỉnh/Thành */}
            <div className="col-12 col-md-6">
                <Select
                    placeholder="Chọn tỉnh/thành"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    options={provinces.map((p) => ({ value: p.code, label: p.name }))}
                    showSearch
                    optionFilterProp="label"
                    className="w-100"
                />
            </div>

            {/* Quận/Huyện */}
            <div className="col-12 col-md-6">
                <Select
                    disabled={districts.length === 0}
                    placeholder="Chọn quận/huyện"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    options={districts.map((d) => ({ value: d.code, label: d.name }))}
                    showSearch
                    optionFilterProp="label"
                    className="w-100"
                />
            </div>

            {/* Phường/Xã */}
            <div className="col-12 col-md-6">
                <Select
                    disabled={wards.length === 0}
                    placeholder="Chọn phường/xã"
                    value={selectedWard}
                    onChange={handleWardChange}
                    options={wards.map((w) => ({ value: w.code, label: w.name }))}
                    showSearch
                    optionFilterProp="label"
                    className="w-100"
                />
            </div>

            {/* Số nhà */}
            <div className="col-12 col-md-6">
                <Input
                    disabled={selectedWard === null}
                    placeholder="Nhập số nhà, tên đường..."
                    value={houseNumber}
                    onChange={handleHouseNumberChange}
                    className="w-100"
                />
            </div>
        </div>
    );
};

export default AddressSelector;
