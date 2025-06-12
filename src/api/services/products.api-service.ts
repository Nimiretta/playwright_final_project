import { APIRequestContext } from '@playwright/test';
import { ProductsController } from 'api/controllers';
import { STATUS_CODES } from 'data';
import { generateProductData } from 'data/products';
import { productSchema } from 'data/schemas';
import { IProduct } from 'types';
import { logStep } from 'utils';
import { validateDeleteResponse, validateResponse, validateSchema } from 'utils/validations';

export class ProductsApiService {
  controller: ProductsController;
  constructor(request: APIRequestContext) {
    this.controller = new ProductsController(request);
  }

  @logStep('Create product and get created product via API')
  async create(token: string, productData?: IProduct) {
    const body = generateProductData(productData);
    const response = await this.controller.create(token, body);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    validateSchema(productSchema, response.body);
    return response.body.Product;
  }

  @logStep('Delete product via API')
  async delete(token: string, id: string) {
    const response = await this.controller.delete(token, id);
    validateDeleteResponse(response, STATUS_CODES.DELETED);
  }
}
