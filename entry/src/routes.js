export function getRoutes() {
  // todo - 替换成实际使用的 route 地址
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    return fetch('/routes.json').then(res => res.json());
  } else {
    return fetch('/routes.json').then(res => res.json());
  }
}
