export const NOTIFICATIONS = {
  CUSTOMER_CREATED: 'Customer was successfully created',
  CUSTOMER_DUPLICATED: (email: string) => `Customer with email '${email}' already exists`,
  CUSTOMER_DELETED: 'Customer was successfully deleted',
  ORDER_UPDATED: 'Order was successfully updated',
};

export const EMPTY_TABLE_ROW_TEXT = 'No records created yet';
