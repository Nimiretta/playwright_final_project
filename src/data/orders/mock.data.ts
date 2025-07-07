import { COUNTRIES } from 'data/customers';
import { generateID } from 'utils';
import { MANUFACTURERS } from 'data/products';

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
