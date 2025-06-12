import { SORT_FIELD, SORT_ORDER } from 'data/sort.data';
import { customerSchema } from './customer.schema';
import { COUNTRIES } from 'data/customers';

export const customersWithSortAndFilterSchema = {
  type: 'object',
  properties: {
    Customers: {
      type: 'array',
      items: customerSchema.properties.Customer,
    },
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
    total: { type: 'number' },
    page: { type: 'number' },
    limit: { type: 'number' },
    search: { type: 'string' },
    country: {
      type: 'array',
      items: { type: 'string', enum: Object.values(COUNTRIES) },
    },
    sorting: {
      type: 'object',
      properties: {
        sortField: {
          type: 'string',
          enum: Object.values(SORT_FIELD),
        },
        sortOrder: {
          type: 'string',
          enum: Object.values(SORT_ORDER),
        },
      },
      required: ['sortField', 'sortOrder'],
    },
  },
  required: ['Customers', 'total', 'page', 'limit', 'search', 'country', 'sorting', 'IsSuccess', 'ErrorMessage'],
};
