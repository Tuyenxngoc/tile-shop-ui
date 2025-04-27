import PropTypes from 'prop-types';

import { createContext, useEffect, useState } from 'react';
import { getStoreInfo } from '~/services/storeService';

const StoreContext = createContext();

const defaultStore = {
    name: '',
    address: '',
    phone: '',
    phoneSupport: '',
    email: '',
    openingHours: '',
    facebookUrl: '',
    youtubeUrl: '',
    zaloUrl: '',
    bannerLink: '',
    logo: '',
    logoSmall: '',
    bannerImage: '',
    backgroundImage: '',
};

const StoreProvider = ({ children }) => {
    const [storeInfo, setStoreInfo] = useState(defaultStore);

    useEffect(() => {
        const fetchStoreInfo = async () => {
            try {
                const response = await getStoreInfo();
                setStoreInfo(response.data.data);
            } catch (error) {
                setStoreInfo(defaultStore);
            }
        };

        fetchStoreInfo();
    }, []);

    return <StoreContext.Provider value={{ storeInfo, setStoreInfo }}>{children}</StoreContext.Provider>;
};

StoreProvider.propTypes = {
    children: PropTypes.node,
};

export { StoreContext, StoreProvider };
