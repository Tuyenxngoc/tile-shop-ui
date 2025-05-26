import httpRequest from '~/utils/httpRequest';

export const trackVisit = (values) => {
    return httpRequest.post('visit/track', values);
};
