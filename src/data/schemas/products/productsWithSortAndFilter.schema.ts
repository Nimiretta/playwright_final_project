import { MANUFACTURERS } from 'data/products';
import { productSchema } from './product.schema';
import { SORT_FIELD, SORT_ORDER } from 'data/sort.data';

export const productsWithSortAndFilterSchema = {
  type: 'object',
  properties: {
    Products: {
      type: 'array',
      items: productSchema.properties.Product,
    },
    IsSuccess: { type: 'boolean' },
    ErrorMessage: { type: ['string', 'null'] },
    total: { type: 'number' },
    page: { type: 'number' },
    limit: { type: 'number' },
    search: { type: 'string' },
    manufacturer: {
      type: 'array',
      items: { type: 'string', enum: Object.values(MANUFACTURERS) },
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
  required: ['Products', 'IsSuccess', 'ErrorMessage', 'total', 'page', 'limit', 'search', 'manufacturer', 'sorting'],
};
