export const ERRORS = {
  CUSTOMER_NOT_FOUND: (id: string) => `Customer with id '${id}' wasn't found`,
} as const;
