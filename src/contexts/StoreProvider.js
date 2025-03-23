import PropTypes from 'prop-types';

import { createContext, useEffect, useState } from 'react';

const StoreContext = createContext();

const defaultStore = {
    name: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '',
};

const StoreProvider = ({ children }) => {
    const [storeInfo, setStoreInfo] = useState(defaultStore);

    useEffect(() => {
        const fetchStoreInfo = async () => {
            setStoreInfo({
                name: 'Cửa hàng Hùng Hương',
                address: '308 Tây Tựu, Quận Bắc Từ Liêm, Thành Phố Hà Nội, Xuân Phương, Hà Nội',
                phone: '0988 027 222',
                email: 'contact@hunghuong.com',
                openingHours: '8:00 AM - 10:00 PM',
            });
        };

        fetchStoreInfo();
    }, []);

    return <StoreContext.Provider value={storeInfo}>{children}</StoreContext.Provider>;
};

StoreProvider.propTypes = {
    children: PropTypes.node,
};

export { StoreContext, StoreProvider };
