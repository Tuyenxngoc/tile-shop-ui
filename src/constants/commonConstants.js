export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

const configDataString = localStorage.getItem('configData');
const configData = configDataString ? JSON.parse(configDataString) : {};

export const INITIAL_META = { totalPages: 1 };
export const INITIAL_FILTERS = { pageNum: 1, pageSize: configData.pageSize || 10 };

export const API_URL = process.env.REACT_APP_API_BASE_URL;
export const RESOURCE_URL = process.env.REACT_APP_RESOURCE_BASE_URL;

export const REGEXP_PHONE_NUMBER = /^(?:\+84|0)(?:1[2689]|9[0-9]|3[2-9]|5[6-9]|7[0-9])(?:\d{7}|\d{8})$/;
export const REGEXP_FULL_NAME = /^\S+(\s+\S+)+$/;
export const REGEXP_PASSWORD = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
export const REGEXP_USERNAME = /^[a-z][a-z0-9]{3,15}$/;
export const REGEXP_COLOR = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
