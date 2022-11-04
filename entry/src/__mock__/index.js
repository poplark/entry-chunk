import cdn from './url';
import absolute from './absolute';

const routes = process.env.NODE_ENV === 'production' ? absolute : DEV_MODE === 'm-server' ? cdn : absolute;

export default routes;
