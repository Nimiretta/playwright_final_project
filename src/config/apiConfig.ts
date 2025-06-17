export const apiConfig = {
  BASE_URL: 'https://aqa-course-project.app',
  ENDPOINTS: {
    CUSTOMERS: '/api/customers',
    CUSTOMERS_ALL: '/api/customers/all',
    CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}/`,
    LOGIN: '/api/login',
    METRICS: '/api/metrics',
    PRODUCTS: '/api/products',
    PRODUCT_BY_ID: (id: string) => `/api/products/${id}/`,
    PRODUCTS_ALL: '/api/products/all',
    NOTIFICATIONS: '/api/notifications',
    NOTIFICATIONS_BY_ID_READ: (id: string) => `/api/notifications/${id}/read`,
    NOTIFICATIONS_ALL_READ: '/api/notifications/mark-all-read',
  },
} as const;
