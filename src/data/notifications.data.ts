export const NOTIFICATIONS = {
  CUSTOMER_CREATED: 'Customer was successfully created',
  CUSTOMER_DUPLICATED: (email: string) => `Customer with email '${email}' already exists`,
  CUSTOMER_DELETED: 'Customer was successfully deleted',
  MANAGER_ASSIGNED: 'Manager was successfully assigned to the order',
  MANAGER_UNASSIGNED: 'Manager was successfully unassigned from the order',
};

export const EMPTY_TABLE_ROW_TEXT = 'No records created yet';
