export const apiConfig = {
  BASE_URL: 'https://aqa-course-project.app',
  ENDPOINTS: {
    CUSTOMERS: '/api/customers',
    CUSTOMERS_ALL: '//api/customer/all',
    CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}/`,
    LOGIN: '/api/login',
    METRICS: '/api/metrics',
    PRODUCTS: '//api/products',
    PRODUCT_BY_ID: (id: string) => `/api/products/${id}/`,
    PRODUCTS_ALL: '//api/products/all',
  },
} as const;
