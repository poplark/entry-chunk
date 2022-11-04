import dev1 from './url';
import dev2 from './absolute';

const routes = process.env.NODE_ENV === 'production' ? dev2 : dev1;

export default routes;
