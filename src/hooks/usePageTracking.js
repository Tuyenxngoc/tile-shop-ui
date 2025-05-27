import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackVisit } from '~/services/visitTrackingService';

function usePageTracking({ url, delay = 10000 } = {}) {
    const location = useLocation();
    const path = url || location.pathname.replace(/^\//, '');

    useEffect(() => {
        const timer = setTimeout(() => {
            trackVisit({ url: path }).catch((error) => console.error(`Tracking failed for ${path}:`, error));
        }, delay);

        return () => clearTimeout(timer);
    }, [path, delay]);
}

export default usePageTracking;
