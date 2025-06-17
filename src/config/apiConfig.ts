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
    ORDERS: '/api/orders',
    ORDERS_BY_ID: (id: string) => `/api/orders/${id}/`,
    ASSIGN_MANAGER: (orderId: string, managerId: string) => `/api/orders/${orderId}/assign-manager/${managerId}`,
    UNASSIGN_MANAGER: (orderId: string) => `/api/orders/${orderId}/unassign-manager`,
  },
} as const;
