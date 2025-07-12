import { COUNTRIES } from 'data/customers';
import { generateID } from 'utils';
import { MANUFACTURERS } from 'data/products';
import { ROLES } from 'data/roles.data';
import { ICustomerFromResponse, IProductFromResponse, IUser } from 'types';

export const mockCustomer: ICustomerFromResponse = {
  _id: generateID(),
  name: 'Anatoly Karpovich',
  email: 'testAqa@mail.com',
  country: COUNTRIES.BELARUS,
  city: 'Warszawa',
  street: 'asda',
  house: 321,
  flat: 123,
  phone: '+1111111111111111111',
  createdOn: new Date().toISOString(),
  notes: 'test',
};

export const mockProduct: IProductFromResponse = {
  _id: generateID(),
  name: 'Test Product [1]',
  price: 59.99,
  manufacturer: MANUFACTURERS.Amazon,
  amount: 3,
  notes: '',
  createdOn: new Date().toISOString(),
};

export const mockManager: IUser = {
  _id: '6804f272d006ba3d475fb3e0',
  username: 'Vita',
  firstName: 'Vitaliya',
  lastName: 'Tsitova',
  roles: [ROLES.USER],
  createdOn: '2025/04/20 13:11:14',
};

export const secondMockManager: IUser = {
  _id: '6807a561d006ba3d475fcb36',
  firstName: 'Tatiana',
  lastName: 'Korol',
  username: 'nimiretta',
  roles: [ROLES.USER],
  createdOn: '2025/04/22 14:19:13',
};
