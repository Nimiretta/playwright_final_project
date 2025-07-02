import { ICustomerFromResponse, IProductFromResponse } from 'types';
import { convertToDateAndTime } from 'utils';

export function convertToUIData(data: ICustomerFromResponse | IProductFromResponse): Record<string, string> {
  if ('email' in data) {
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
  } else {
    return {
      Name: data.name,
      Manufacturer: data.manufacturer,
      Price: data.price.toString(),
      Notes: data.notes ?? '',
      'Created On': convertToDateAndTime(data.createdOn),
    };
  }
}
