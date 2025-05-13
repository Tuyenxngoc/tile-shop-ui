import httpRequest from '~/utils/httpRequest';

export const createChatAI = (values) => {
    return httpRequest.post('chat/ai', values);
};
