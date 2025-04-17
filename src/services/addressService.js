import axios from 'axios';

export const getProvinces = () => {
    return axios.get('https://provinces.open-api.vn/api/p/');
};

export const getDistrictsByProvince = (provinceCode) => {
    return axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
};

export const getWardsByDistrict = (districtCode) => {
    return axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
};
