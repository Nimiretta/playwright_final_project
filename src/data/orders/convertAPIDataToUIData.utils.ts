import { IProductFromResponse, ICustomerFromResponse } from 'types';
import { convertToDateAndTime } from 'utils';

export function convertProductToUIData(data: IProductFromResponse): Record<string, string> {
  return {
    Name: data.name,
    Manufacturer: data.manufacturer,
    Price: '$' + data.price.toString(),
    Notes: data.notes ?? '',
  };
}

export function convertCustomerToUIData(data: ICustomerFromResponse): Record<string, string> {
  return {
    Email: data.email,
    Name: data.name,
    Country: data.country,
    City: data.city,
    Street: data.street,
    House: data.house.toString(),
    Flat: data.flat.toString(),
    Phone: data.phone,
    'Created On': convertToDateAndTime(data.createdOn),
  };
}
