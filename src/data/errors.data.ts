export const API_ERRORS = {
  CUSTOMER_NOT_FOUND: (id: string) => `Customer with id '${id}' wasn't found`,
  EMPTY_TOKEN: 'Not authorized',
  INVALID_TOKEN: 'Invalid access token',
  EXPIRED_TOKEN: 'Access token expired',
  PRODUCT_NOT_FOUND: (id: string) => `Product with id '${id}' wasn't found`,
} as const;
