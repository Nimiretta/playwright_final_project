import { COUNTRIES } from 'data/customers';
import { generateID } from 'utils';
import { MANUFACTURERS } from 'data/products';
import { ROLES } from 'data/roles.data';

export const mockCustomer = {
  _id: generateID(),
  name: 'Anatoly Karpovich',
  email: 'testAqa@mail.com',
  country: COUNTRIES.BELARUS,
  city: 'Warszawa',
  street: 'asda',
  house: 321,
  flat: 123,
  phone: '+1111111111111111111',
  createdOn: new Date(Date.now()).toISOString(),
  notes: 'test',
  role: 'User',
};

export const mockProduct = {
  _id: generateID(),
  name: 'Test Product [1]',
  price: 59.99,
  manufacturer: MANUFACTURERS.Amazon,
  amount: 3,
  notes: '',
  createdOn: new Date(Date.now()).toISOString(),
};

export const mockManager = {
  _id: '6804f272d006ba3d475fb3e0',
  username: 'Vita',
  firstName: 'Vitaliya',
  lastName: 'Tsitova',
  roles: [ROLES.USER],
  createdOn: '2025/04/20 13:11:14',
};
