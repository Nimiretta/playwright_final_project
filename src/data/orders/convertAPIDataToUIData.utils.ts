import { IProductFromResponse } from 'types';

export function convertProductToUIData(data: IProductFromResponse): Record<string, string> {
  return {
    Name: data.name,
    Manufacturer: data.manufacturer,
    Price: '$' + data.price.toString(),
    Notes: data.notes ?? '',
  };
}
