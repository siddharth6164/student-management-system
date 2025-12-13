import { toast as hot } from 'react-hot-toast';

export const toast = {
    success: (msg) => hot.success(msg),
    error: (msg) => hot.error(msg),
    info: (msg) => hot(msg),
};

export default toast;
