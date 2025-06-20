export const API_ERRORS = {
  CUSTOMER_NOT_FOUND: (id: string) => `Customer with id '${id}' wasn't found`,
  EMPTY_TOKEN: 'Not authorized',
  INVALID_TOKEN: 'Invalid access token',
  EXPIRED_TOKEN: 'Access token expired',
  PRODUCT_NOT_FOUND: (id: string) => `Product with id '${id}' wasn't found`,
  CUSTOMER_BAD_REQUEST: 'Incorrect request body',
  CUSTOMER_EMAIL_ALREADY_EXIST: (email: string) => `Customer with email '${email}' already exists`,
  PRODUCT_IN_ORDER: 'Not allowed to delete product, assigned to the order',
  CUSTOMER_IN_ORDER: 'Not allowed to delete customer, assigned to the order',
} as const;
