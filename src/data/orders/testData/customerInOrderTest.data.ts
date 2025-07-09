import { generateCustomerData } from 'data/customers';
import { generateProductData } from 'data/products';
import { ICustomerFromResponse } from 'types';
import { generateID } from 'utils';
import { ORDER_STATUSES } from '..';
import { ORDER_HISTORY_ACTIONS } from '..';
import { ROLES } from 'data/roles.data';
import { TAGS } from 'data';

const customerWithNotes: ICustomerFromResponse = {
  ...generateCustomerData(),
  _id: generateID(),
  createdOn: new Date().toISOString(),
};

const customerWithoutNotes = {
  ...generateCustomerData({ notes: '' }),
  _id: generateID(),
  createdOn: new Date().toISOString(),
};

const product = { ...generateProductData(), received: false, _id: generateID() };

export const customerDetails = [
  {
    tag: ['@001_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION, TAGS.INTEGRATION],
    testName: 'Should display correct data in Customer Details table after openning the page',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.DRAFT,
        customer: customerWithNotes,
        products: [product],
        delivery: null,
        total_price: product.price,
        createdOn: new Date().toISOString(),
        comments: [],
        history: [],
        assignedManager: null,
      },
      IsSuccess: true,
      ErrorMessage: null,
    },
  },

  {
    tag: ['@002_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION, TAGS.INTEGRATION],
    testName: 'Should display correct data in Customer Details table after openning the page(without Notes)',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.DRAFT,
        customer: customerWithoutNotes,
        products: [product],
        delivery: null,
        total_price: product.price,
        createdOn: '2025-07-08T13:23:56.000Z',
        comments: [],
        history: [
          {
            status: ORDER_STATUSES.DRAFT,
            customer: customerWithoutNotes._id,
            products: [product],
            total_price: product.price,
            delivery: null,
            changedOn: '2025-07-08T13:23:56.000Z',
            action: ORDER_HISTORY_ACTIONS.CREATED,
            performer: {
              _id: '6806a732d006ba3d475fc11c',
              username: 'a.zhuk',
              firstName: 'Aleksandr',
              lastName: 'Zhuk',
              roles: [ROLES.USER],
              createdOn: '2025/04/21 20:14:42',
            },
            assignedManager: null,
          },
        ],
        assignedManager: null,
      },
      IsSuccess: true,
      ErrorMessage: null,
    },
  },
];

export const orderWithDifferentStatuses = [
  {
    tag: ['@004_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION, TAGS.INTEGRATION],
    testName: 'Should not display edit button if order is in In Process status',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.IN_PROCESS,
        customer: customerWithNotes,
        products: [product],
        delivery: null,
        total_price: product.price,
        createdOn: new Date().toISOString(),
        comments: [],
        history: [],
        assignedManager: null,
      },
      IsSuccess: true,
      ErrorMessage: null,
    },
  },

  {
    tag: ['@006_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION, TAGS.INTEGRATION],
    testName: 'Should not display edit button if order is in Received status',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.RECEIVED,
        customer: customerWithNotes,
        products: [product],
        delivery: null,
        total_price: product.price,
        createdOn: new Date().toISOString(),
        comments: [],
        history: [],
        assignedManager: null,
      },
      IsSuccess: true,
      ErrorMessage: null,
    },
  },

  {
    tag: ['@007_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION, TAGS.INTEGRATION],
    testName: 'Should not display edit button if order is in Canceled status',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.CANCELED,
        customer: customerWithNotes,
        products: [product],
        delivery: null,
        total_price: product.price,
        createdOn: new Date().toISOString(),
        comments: [],
        history: [],
        assignedManager: null,
      },
      IsSuccess: true,
      ErrorMessage: null,
    },
  },

  {
    tag: ['@008_O_CM_UI', TAGS.UI, TAGS.VISUAL_REGRESSION, TAGS.INTEGRATION],
    testName: 'Should not display edit button if order is in Partially Received status',
    response: {
      Order: {
        _id: generateID(),
        status: ORDER_STATUSES.PARTIALLY_RECEIVED,
        customer: customerWithNotes,
        products: [product],
        delivery: null,
        total_price: product.price,
        createdOn: new Date().toISOString(),
        comments: [],
        history: [],
        assignedManager: null,
      },
      IsSuccess: true,
      ErrorMessage: null,
    },
  },
];

export const orderInDefaultStatus = {
  Order: {
    _id: generateID(),
    status: ORDER_STATUSES.DRAFT,
    customer: customerWithNotes,
    products: [product],
    delivery: null,
    total_price: product.price,
    createdOn: new Date().toISOString(),
    comments: [],
    history: [],
    assignedManager: null,
  },
  IsSuccess: true,
  ErrorMessage: null,
};
